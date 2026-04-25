# ADR-0003 — Service layer: pure logic split from thin I/O

**Status:** Accepted
**Date:** 2026-04-25

## Context

Services in `$services/` wrap external systems (R2, Resend, Polar, Redis) and provide cross-cutting infrastructure (logger, tracing, lifecycle). A typical anti-pattern is service files that mix:

- Module-level side effects (clients instantiated at import).
- Business logic (validation, key generation, payload shaping).
- I/O calls (HTTP, SDK invocations).
- Logging and tracing scattered throughout.

That mix makes services hard to unit-test, hard to reason about, and tempting to over-instrument. We want services to be **slim**, predictable, and uniform across the codebase.

## Decision

Every service follows the same shape:

1. **`logic.ts`** — pure functions only. No env reads, no I/O, no logger. Takes config as arguments. Trivially unit-testable.
2. **`<service>.server.ts`** — thin I/O. Holds the SDK/client instance, validates required env vars at module load (fail-fast), wraps each external call in `withSpan(...)` for tracing, logs at the boundary, throws typed errors when useful.
3. **`index.ts`** — public API that re-exports both.

Concrete rules:

- **Pure functions never read env.** They take `publicBase`, `bucket`, etc. as parameters. The I/O module reads env once and threads values in.
- **Required env validates at module load.** Missing `R2_BUCKET_NAME` should crash the process on boot, not on first request.
- **One log per outcome.** `debug` on entry, `info` on success, `error` (with `err`) on failure. No per-line trace logging.
- **Tracing at the I/O boundary only.** Wrap the external call in `withSpan(name, attrs, fn)`. Don't trace internal helpers.
- **Typed errors only when the caller cares.** `StorageError` exists because callers may want to distinguish R2 failures from validation. Generic `throw new Error(...)` is fine elsewhere.
- **Module-scoped child logger.** `const log = createLogger({ module: 'storage' })` — every log line carries the module name automatically.

We do **not** introduce:

- A shared `ServiceError` base class. YAGNI — local error types are enough.
- A factory/DI pattern for every service. Use it only when there's a real test seam need (Polar's `createMockClient` pattern).
- An adapter interface for every external SDK. Only Polar has one because it has both prod and mock implementations.

## Consequences

**Good:**

- Pure logic is unit-tested in isolation; I/O is integration-tested or mocked at the boundary.
- Every service file looks the same — readers know where to find env validation, the client, the I/O calls, and the error type.
- Logs and spans are predictable: one span per external call, with consistent attribute names (`storage.bucket`, `email.subject`).
- Services stay small. Storage went from 213 → 103 lines after the split.

**Bad:**

- The `logic.ts` / `<service>.server.ts` split adds one extra file per service. For a 30-line service this feels like ceremony.
- Pure functions that need config must accept it as an argument, which is more verbose than reading a module global.

**Neutral:**

- The convention is hand-enforced — there's no lint rule preventing someone from adding I/O to `logic.ts`. Code review catches it.

## Example

```ts
// services/storage/logic.ts — pure
export function generateKey(prefix: string, ownerId: string, contentType: string): string { ... }
export function buildPublicUrl(publicBase: string, key: string): string { ... }

// services/storage/storage.server.ts — thin I/O
const log = createLogger({ module: 'storage' });
const r2Client = new S3Client({ ... });

export async function deleteObject(key: string): Promise<void> {
  return withSpan('r2.deleteObject', { 'storage.key': key }, async () => {
    try {
      await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
      log.info({ key }, 'Object deleted');
    } catch (error) {
      log.error({ key, err: error }, 'Failed to delete object');
      throw new StorageError('Failed to delete object', { cause: error });
    }
  });
}
```

## Alternatives considered

- **Class-based services with DI container** — overkill for the codebase size; adds a runtime dependency graph nobody asked for.
- **Single file per service** — what we had before. Mixed concerns made changes risky and tests painful.
- **Hexagonal / ports-and-adapters everywhere** — useful for Polar (has a mock); excessive for Resend/Redis where a single implementation is fine.

## References

- `src/lib/server/services/storage/` — canonical example
- `src/lib/server/services/email/` — same pattern applied
- ADR-0005 — observability conventions referenced here

# ADR-0006 — Error handling: SvelteKit `error()` and typed service errors

**Status:** Accepted
**Date:** 2026-04-25

## Context

Two distinct failure categories show up in a SvelteKit app:

1. **Expected failures** — auth, permissions, not-found, validation. These have HTTP semantics (401/403/404/422) and should produce a structured response.
2. **Unexpected failures** — bugs, network errors, downstream-service failures. These should crash the request, log loudly, and not leak internal detail to the client.

Mixing the two leads to either generic 500s for permission denials, or stack traces in user-facing responses. We want a predictable convention.

## Decision

### Expected errors → SvelteKit `error()`

Use `error()` from `@sveltejs/kit` for any failure with HTTP semantics:

```ts
import { error } from '@sveltejs/kit';

error(403, { message: 'Not authorized', code: 'FORBIDDEN' });
error(404, { message: 'Not found', code: 'NOT_FOUND' });
error(422, { message: 'Invalid input', code: 'VALIDATION' });
```

- Always include both `message` (human-readable) and `code` (machine-readable, SCREAMING_SNAKE_CASE).
- The `code` is what UI branches on, never the message string.

### Unexpected errors → throw, let it crash

Plain `throw new Error(...)` is fine. SvelteKit will respond 500 and our hooks log it with full stack + trace context (ADR-0005).

Exception: in contexts that catch and re-throw (e.g., better-auth webhook handlers that need to propagate failure to the framework), `throw new Error()` is correct — the framework owns the response shape.

### Service-layer errors → typed only when callers care

Most services throw plain `Error`. Add a typed error class only when callers need to distinguish:

```ts
export class StorageError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = 'StorageError';
	}
}
```

Always preserve the underlying error via `{ cause }` so logs and traces have the full chain. **No shared `ServiceError` base class** — local types are enough; a hierarchy adds ceremony without payoff.

### Validation errors → Zod, surfaced via `formHandler`

Zod validation failures from remote `form()` calls are caught by `formHandler.onValidationError`. Don't manually `try`/`catch` Zod errors at the call site — let them flow through.

### Logging the failure

Every `catch` that swallows or rethrows must log:

```ts
log.error({ key, err: error }, 'Failed to delete object');
throw new StorageError('Failed to delete object', { cause: error });
```

The `err` field is required so Pino's default serializer captures the stack.

## Consequences

**Good:**

- HTTP status codes are correct because we use `error()` for them. No 500s for forbidden actions.
- The client can branch on stable `code` strings, so message rewording doesn't break UI logic.
- Typed errors exist only where they pay off — no "error class per file" syndrome.
- All errors include `cause`, so debugging never hits a dead end.

**Bad:**

- Two error patterns coexist: `error()` for expected, `throw` for unexpected. Reviewers must judge which applies.
- The `code` field is a free-form convention — typos won't be caught by the type system.

**Neutral:**

- We accept that some service errors stay generic `Error`. That's intentional — we don't pre-build hierarchies for hypothetical needs.

## Alternatives considered

- **Result types (`Result<T, E>`)** — verbose in TypeScript without a built-in `match`. Rejected for the codebase size.
- **Single shared `ServiceError` hierarchy** — over-engineering for the number of services we have.
- **Always throw, never use `error()`** — loses HTTP semantics; SvelteKit error pages would be generic 500s.

## References

- `CLAUDE.md` — error handling section
- `src/lib/server/services/storage/storage.server.ts` — `StorageError` example
- ADR-0007 — Zod validation

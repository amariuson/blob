# ADR-0005 — Observability: structured logging and OpenTelemetry tracing

**Status:** Accepted
**Date:** 2026-04-25

## Context

Production debugging needs three correlated signals: **what happened** (logs), **where time went** (traces), and **what the user saw** (request context). Without correlation, a stack trace in one tool and a slow span in another are useless. We also need to keep operational cost down — log every line and Loki bills us for it.

## Decision

### Logging

- **Pino** is the only logger. No `console.log` in committed code.
- **Structured JSON in production**, pretty-printed in dev (`pino-pretty`).
- **Loki** is the production sink. Falls back to stdout if Loki env vars are partial — with a startup warning.
- **`createLogger({ module })`** for module-scoped child loggers. Every log line includes the module name automatically.
- **Automatic context injection** via Pino mixin:
  - Request context (`requestId`, `userId`, `orgId`) from `getRequestEvent().locals.context`.
  - OTEL trace context (`traceId`, `spanId`) from the active span.
  - Both are best-effort — failures in context lookup must never break logging.

### Log levels

| Level   | Use for                                                                |
| ------- | ---------------------------------------------------------------------- |
| `debug` | Per-call entry traces. Verbose; only enabled in dev by default.        |
| `info`  | Lifecycle events and successful outcomes (login, email sent, deleted). |
| `warn`  | Recoverable anomalies (Redis reconnecting, partial config).            |
| `error` | Failed operations. Must include `err` field with the original error.   |

Rule: **one log per outcome**, not per line. If you want per-call detail, use a span.

### Tracing

- **OpenTelemetry** SDK (Node auto-instrumentations) exports OTLP-proto.
- **Manual spans at service boundaries** via `withSpan(name, attributes, fn)` from `$services/tracing`. One span per external call.
- **Span names** follow `<system>.<operation>`: `r2.deleteObject`, `email.send`, `polar.createCheckout`.
- **Auto-instrumented integrations** (Polar, Resend, Drizzle) are wrapped at the SDK level so we don't double-instrument.
- **Span attributes** use a stable namespace per system: `storage.bucket`, `storage.key`, `email.subject`, `email.recipient_count`. Avoid free-form keys.
- `setSpanAttributes()` and `addSpanEvent()` are safe to call without an active span (no-op).

### Error handling on spans

`withSpan` and `traced` helpers automatically:

- Set `SpanStatusCode.OK` on success.
- Set `SpanStatusCode.ERROR` with the message on failure.
- Call `span.recordException(err)`.
- Re-throw — the helper never swallows errors.

## Consequences

**Good:**

- Every log line in production has `traceId` + `spanId`, so jumping from Loki to traces is one click.
- Every log line carries `requestId`, `userId`, `orgId`, so filtering by user is trivial.
- Span names and attributes are predictable, making dashboards and alerts maintainable.
- Failures in tracing or context lookup never break the request — logging is resilient.

**Bad:**

- Every external call gets a span, which is small overhead per call. Negligible at our scale.
- `module` attribute and span attribute names are conventions, not enforced — code review must catch drift.
- Loki labels must be low-cardinality. We deliberately do **not** put `userId` or `requestId` in Loki labels (they go in the message body).

**Neutral:**

- Auto-instrumentation (Polar/Resend/Drizzle) creates spans we don't directly own. Names come from the library — known and accepted.

## Alternatives considered

- **Winston / Bunyan** — Pino is faster and has the better OTEL ecosystem.
- **Manual `console.log` with JSON** — no levels, no transports, no child loggers.
- **Datadog / New Relic** — expensive, vendor lock-in. OTLP-proto + Loki/Tempo is portable.

## References

- `src/lib/server/services/logger/logger.server.ts` — Pino setup with mixin
- `src/lib/server/services/tracing/tracing.server.ts` — span helpers
- `src/instrumentation.server.ts` — OTEL SDK bootstrap
- ADR-0003 — service layer applies these conventions uniformly

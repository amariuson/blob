# ADR-0001 — Tech stack

**Status:** Accepted
**Date:** 2026-04-25

## Context

We need a full-stack web app with type-safe end-to-end data flow, server-rendered pages, integrated billing, transactional email, blob storage, and observable production behavior. Constraints: small team, opinionated tooling preferred, runtime should be Node-compatible (not edge-only) so we can use the full ecosystem.

## Decision

| Layer            | Choice                                  | Why                                                                          |
| ---------------- | --------------------------------------- | ---------------------------------------------------------------------------- |
| Framework        | **SvelteKit 2 + Svelte 5 (runes)**      | Server + client in one codebase; remote functions remove tRPC-shaped glue.   |
| Language         | **TypeScript strict**                   | Non-negotiable — `any` is disallowed.                                        |
| Database         | **PostgreSQL** via **Drizzle ORM**      | SQL-shaped types, no codegen step, real migrations.                          |
| Cache / sessions | **Redis (ioredis)**                     | Session storage and rate-limiting need a TTL store.                          |
| Object storage   | **Cloudflare R2** (S3-compatible)       | Cheap egress, S3 SDK works as-is.                                            |
| Auth             | **better-auth**                         | Plugin model, OTP + organization + Polar integration are first-class.        |
| Billing          | **Polar**                               | Better DX than Stripe for SaaS subscriptions; webhook + customer-state APIs. |
| Email            | **Resend** + **better-svelte-email**    | Templates as Svelte components; one provider for transactional.              |
| Validation       | **Zod 4**                               | Single source of truth for schema → TS types → form validation.              |
| UI               | **shadcn-svelte + Tailwind CSS v4**     | Copy-paste components we own; no runtime dependency lock-in.                 |
| Observability    | **Pino** logs + **OpenTelemetry** spans | Structured logs with request/trace correlation; OTLP export.                 |
| Logs sink        | **Grafana Cloud Loki**                  | Cheap, queryable, integrated with traces.                                    |
| Testing          | **Playwright (E2E)** + **Vitest**       | E2E for user-visible behavior, Vitest for pure logic and Zod schemas.        |
| Package manager  | **pnpm**                                | Fast, strict, deterministic. `npm`/`yarn` not used.                          |
| Deployment       | **`@sveltejs/adapter-node`**            | Plain Node server. No edge runtime constraints.                              |

## Consequences

**Good:**

- Single language and type system across client, server, and DB schema.
- Remote functions remove an entire RPC layer and its codegen.
- All third-party integrations (Polar, Resend, Drizzle) are auto-instrumented for OTEL.
- pnpm workspaces remain available if we ever split packages.

**Bad:**

- Svelte 5 runes are recent — fewer Stack Overflow answers than React.
- Drizzle is younger than Prisma; some advanced query shapes need raw SQL.
- Polar has a smaller ecosystem than Stripe; we accept lock-in for the DX.
- Node adapter means we're not on Cloudflare Workers / edge.

**Neutral:**

- shadcn-svelte components live in our repo, so we maintain them. Upside: no upstream breakage.

## Alternatives considered

- **Next.js + tRPC** — duplicates what SvelteKit's remote functions give us natively.
- **Prisma** — heavier, codegen step, slower types.
- **Stripe** — better ecosystem, worse SaaS-billing DX, more glue code.
- **MongoDB** — relational data fits the domain (orgs, members, roles); SQL wins.
- **Edge runtime (Cloudflare Workers)** — rules out parts of the Node ecosystem we use (S3 SDK, Pino transports).

## References

- `package.json`
- `CLAUDE.md` — project instructions

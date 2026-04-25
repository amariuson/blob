# Project Documentation

Living documentation for the platform. Three kinds of documents live here:

- **[System overview](./system-overview.md)** — short orientation: what the platform does, who uses it, how the features connect. Read this first if you have ten minutes.
- **[System spec](./specs/specs-part-1.md)** — the comprehensive v1 specification, in five parts. Read this when you actually need the detail.
- **Architecture Decision Records (ADRs)** — append-only record of specific technical decisions and their tradeoffs. Indexed below.

## System spec (5 parts)

The spec describes _what the system does_; ADRs describe _how we build it_.

1. [**Foundations**](./specs/specs-part-1.md) — purpose, personas, glossary, multi-tenancy, feature map.
2. [**Contacts, Sales Pipeline, Pricing Engine**](./specs/specs-part-2.md) — org+person model, lead → quote → booking lifecycle, line-item pricing, FX, GIT, RRULE, rate sources.
3. [**Communication & AI**](./specs/specs-part-3.md) — connected mailboxes, AI tagging/drafting, MCP-based itinerary chat, lead → itinerary generation, cost ceilings.
4. [**Operations & Surfaces**](./specs/specs-part-4.md) — sales attribution with team splits, tasks, documents, client portal with Level-1 e-sign, notifications, customizable roles.
5. [**Platform**](./specs/specs-part-5.md) — external integrations, full entity diagram, end-to-end workflow, subscription, payments shape (deferred), GDPR posture, observability, non-goals.

## Architecture Decision Records

Each ADR captures a single decision, the context that motivated it, and its consequences.

## Why ADRs

Code answers _what_ and _how_; ADRs answer _why_. When a future contributor (or future you) wonders why we chose Polar over Stripe, why services split pure logic from I/O, or why schemas live at the feature root, the answer should be one ADR away.

ADRs are append-only. We don't rewrite history — when a decision changes, we add a new ADR that **supersedes** the old one and update the old one's status.

## Format

Every ADR follows the same template ([adr/0000-template.md](adr/0000-template.md)):

- **Status** — `Proposed` | `Accepted` | `Deprecated` | `Superseded by ADR-NNNN`
- **Context** — what forces are at play, what problem we're solving
- **Decision** — what we chose, in plain language
- **Consequences** — both good and bad, including what becomes harder

Keep them short. One page is the target; if you need more, the decision is probably two decisions.

## When to write an ADR

Write one when:

- Picking between non-trivial alternatives (libraries, patterns, infrastructure)
- Establishing a project-wide convention (folder layout, error handling, logging)
- Deviating from an obvious default for a non-obvious reason

Don't write one for routine implementation choices, micro-refactors, or things already documented in `CLAUDE.md`.

## Index

### System & Infrastructure

- [ADR-0001 — Tech stack](adr/0001-tech-stack.md)
- [ADR-0002 — Feature-based architecture](adr/0002-feature-based-architecture.md)
- [ADR-0004 — Remote functions over load functions](adr/0004-remote-functions-over-load-functions.md)
- [ADR-0005 — Observability: structured logging and OpenTelemetry tracing](adr/0005-observability.md)

### Code Quality

- [ADR-0003 — Service layer: pure logic split from thin I/O](adr/0003-service-layer-pure-logic-thin-io.md)
- [ADR-0006 — Error handling: SvelteKit `error()` and typed service errors](adr/0006-error-handling.md)
- [ADR-0007 — Validation: Zod schemas at feature root](adr/0007-validation-zod-schemas.md)
- [ADR-0008 — Testing strategy: Playwright E2E + Vitest for pure logic](adr/0008-testing-strategy.md)

## Adding an ADR

1. Copy `adr/0000-template.md` to `adr/NNNN-short-slug.md` (next free number).
2. Fill in Status, Context, Decision, Consequences.
3. Link it from this index under the appropriate section.
4. Open a PR. Discussion happens on the PR, not by editing the ADR.

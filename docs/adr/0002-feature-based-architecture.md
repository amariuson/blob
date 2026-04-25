# ADR-0002 — Feature-based architecture

**Status:** Accepted
**Date:** 2026-04-25

## Context

Layered folder layouts (`controllers/`, `services/`, `models/`, `routes/`) scale poorly as a SaaS app grows. Adding a feature touches every layer and requires jumping between distant folders. We need a layout where:

- A feature is self-contained and discoverable.
- Cross-feature dependencies go through public APIs, not internals.
- Server-only code can't accidentally leak to the client bundle.

## Decision

Organize code by **feature**, not by **layer**. Each feature is a folder under `src/lib/features/<name>/` with **three required entry points** and an internal structure that scales with complexity.

```
src/lib/
├── features/<name>/   # self-contained feature modules
├── server/            # server-only infrastructure (db, services)
└── shared/            # client + server primitives
```

Every feature exposes exactly three public entry points:

```
$features/<name>          → client-safe API (index.ts)
$features/<name>/server   → server-only API
$features/<name>/remote   → remote functions
```

**Invariants:**

1. All database operations live in `server/api/`.
2. Remote functions live only in `remote/` — no schemas, no helpers.
3. Server-only code lives only in `server/` or `remote/`.
4. Public APIs re-export; internals stay internal.
5. Folders are created when needed — no pre-scaffolding empty directories.

**Import hierarchy** (one-way):

```
$lib/shared  →  cannot import from $features/
$lib/server  →  cannot import from $features/
$features/   →  can import from shared/, server/, other features (via public APIs)
src/routes/  →  imports features only via public APIs
```

The `api/` folder scales with feature size: single file → flat files (`queries.ts`, `mutations.ts`) → folders by entity. Schemas always live at the feature root in `schemas.ts`, never inside `api/`.

## Consequences

**Good:**

- Adding or removing a feature is a folder-level operation.
- Server-only code is enforced by SvelteKit (`server/` and `remote/` directories).
- Path aliases (`$features/`, `$services/`) keep imports short and ESLint-enforceable.
- New contributors can read one feature top-to-bottom without grep-jumping.

**Bad:**

- Cross-feature work requires going through public APIs, which is slightly more ceremony than direct imports.
- The "three entry points" rule has to be taught — it's not enforced by SvelteKit.
- Some shared concepts live in awkward places when they don't belong to one feature (resolved via `$lib/shared/`).

**Neutral:**

- The same physical layout supports tiny features (1 file in `api/`) and large ones (entity sub-folders) without restructuring.

## Alternatives considered

- **Layered (`controllers/`, `services/`, `models/`)** — rejected. Doesn't scale; cross-cutting changes are costly.
- **One big `src/lib/`** — rejected. No boundaries means no enforcement; everything becomes everyone's problem.
- **Monorepo with packages per feature** — overkill for the team size. Same conceptual model without the tooling overhead.

## References

- `CLAUDE.md` — full structure and rules
- `src/lib/features/` — current features
- `eslint.config.js` — path-alias enforcement

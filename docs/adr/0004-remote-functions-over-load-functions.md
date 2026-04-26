# ADR-0004 — Remote functions over load functions

**Status:** Accepted
**Date:** 2026-04-25

## Context

SvelteKit historically uses `+page.server.ts` `load()` functions and form actions for server interactions. Remote functions (`query`, `form`, `command`, `prerender`) are a newer SvelteKit primitive that move the boundary into ordinary function calls — typed, validated, and callable from any component.

Load functions tie data fetching to a route. That's awkward when:

- The same data is needed in multiple routes.
- A component deep in the tree needs to refetch independently.
- A mutation needs to invalidate a specific query without bouncing through `invalidate()`.

We need one consistent way to talk to the server.

## Decision

**Remote functions are the default** for all server interactions. Load functions are reserved for specific cases.

| Type        | Use case                  |
| ----------- | ------------------------- |
| `query`     | Read dynamic data         |
| `form`      | Form submissions          |
| `command`   | Non-form mutations        |
| `prerender` | Static data at build time |

Conventions:

- All remote functions live in `feature/remote/index.ts`. Nothing else lives in `remote/` — no schemas, no helpers.
- Remote functions are **thin wrappers** over `feature/server/api/` business logic. The remote function's only job is `query(getPosts)` or `form(schema, createPost)`.
- Forms are wired with `formHandler` from `$lib/shared/form/form-handler.svelte`. Raw `.enhance()` is forbidden — `formHandler` gives us double-submit prevention, error toasts, validation handling, and reset-on-success in one place.
- Use `+layout.server.ts` only for auth guards. Use `+page.server.ts` only when migrating legacy code.
- Prefer `await` expressions in components over `{#await}` blocks; pair with `<svelte:boundary>` for loading/error states.

## Consequences

**Good:**

- Server logic is callable from anywhere — components, other server code, tests.
- Validation lives in one place (`schemas.ts`), used by both client and server.
- Query invalidation is explicit and surgical: `getPostsQuery.set(...)` or `.refresh()`.
- The `feature/server/api/` business-logic functions are independently testable without involving the SvelteKit request lifecycle.

**Bad:**

- Two patterns coexist during migration: legacy `+page.server.ts` files still exist for older code.
- Remote functions are SvelteKit-specific — porting to another framework would require rewriting this layer.
- Developers coming from Next.js/Remix need to learn the model.

**Neutral:**

- Form actions and remote `form()` functions look similar but are not interchangeable. Convention says: new code uses remote forms.

## Alternatives considered

- **Stick with load functions everywhere** — couples data to routes, doesn't compose.
- **tRPC** — duplicates what remote functions provide natively; adds a build step.
- **REST endpoints in `+server.ts`** — fine for external API surfaces; verbose for internal use.

## References

- `CLAUDE.md` — Remote functions section
- `src/lib/shared/form/form-handler.svelte.ts` — form handler
- ADR-0007 — schemas at feature root, used by remote `form()`

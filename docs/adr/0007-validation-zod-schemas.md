# ADR-0007 — Validation: Zod schemas at feature root

**Status:** Accepted
**Date:** 2026-04-25

## Context

Validation rules tend to drift across layers: the client validates one way, the server another, and the database accepts a third shape. We need one source of truth that runs in both environments and produces TypeScript types automatically.

Schemas also need a stable home. Putting them next to mutations leads to circular imports; putting them next to remote functions leaks server concerns to the client. They need their own place.

## Decision

- **Zod 4** is the only validation library.
- **All schemas live in `feature/schemas.ts`** at the feature root — never inside `server/api/` and never inside `remote/`.
- The same schema is imported by:
  - The client (for form-side validation and types).
  - Remote `form()` calls (for server-side validation).
  - Mutations (for argument types via `z.infer`).
- **Types come from schemas**, not the other way around: `type CreatePost = z.infer<typeof createPostSchema>`. Hand-written types are reserved for non-schema concerns (UI prop types, internal helpers).
- **Public client API** (`feature/index.ts`) re-exports schemas. Components import them via `$features/<name>`, not via deep paths.

```ts
// feature/schemas.ts
import { z } from 'zod';
export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1)
});

// feature/server/api/mutations.ts
import { createPostSchema } from '../../schemas';
export async function createPost(data: z.infer<typeof createPostSchema>) { ... }

// feature/remote/index.ts
import { form } from '$app/server';
import { createPostSchema } from '../schemas';
import { createPost } from '../server/api/mutations';
export const createPostForm = form(createPostSchema, createPost);

// feature/index.ts
export { createPostSchema } from './schemas';
```

- **Zod schemas are unit-tested** (Vitest) when they encode non-trivial rules — coercions, regexes, conditional refinements. Trivial shape schemas don't need tests.

## Consequences

**Good:**

- One schema, one type, zero drift.
- Server-side validation is automatic via remote `form(schema, fn)` — invalid input never reaches business logic.
- Client gets the same types and can validate before submit (using the same schema or the form-handler integration).
- Schemas are easy to find: every feature has exactly one `schemas.ts`.

**Bad:**

- Schemas can grow large in features with many entities. We accept this and split into multiple `export const`s in the same file rather than splitting the file.
- Zod 4 changed some APIs from v3 — migrations from older code take a moment.

**Neutral:**

- Validation runs twice (client + server) for the same input. That's the point — server validation is the security boundary; client validation is UX.

## Alternatives considered

- **Yup / Joi / Valibot** — Zod has the strongest TS inference and the deepest ecosystem.
- **Manual validation + hand-written types** — guaranteed to drift.
- **Schemas inside `api/`** — forces remote functions to import from `server/`, blurring the client/server boundary.

## References

- `CLAUDE.md` — schemas live at feature root
- ADR-0004 — remote `form()` consumes schemas
- ADR-0006 — Zod validation errors flow through `formHandler`

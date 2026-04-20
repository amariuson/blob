## Top-Level Architecture

```
src/lib/
├── features/          # Domain features (self-contained)
├── server/            # Server-only infrastructure (db, services)
│                      # Never imports from features/ (one-way dependency)
└── shared/            # Client+server code (components, utils, types)
```

## Feature Structure

### Required (always present)

```
[feature]/
├── index.ts              # Client-safe public API (re-exports schemas, types, components)
├── schemas.ts            # All Zod schemas (shared between client & server)
└── server/
    ├── index.ts          # Server-only public API
    └── api/              # ALL data operations
```

### Optional (add as needed)

```
[feature]/
├── constants.ts          # Feature constants
├── types.ts              # TypeScript-only types (non-schema)
├── config/               # Static configuration (permissions, etc.)
├── logic/                # Pure testable functions (validation, transforms, calculations)
├── components/           # UI components
├── server/
│   ├── adapters/         # External service adapters
│   ├── handles/          # SvelteKit handle creators
│   └── plugins/          # Library plugins
```

## api/ Scaling Patterns

**Tiny (1-3 ops):**

```
server/api/
└── api.ts
```

**Small (4-8 ops):**

```
server/api/
├── queries.ts
├── mutations.ts
└── *.hooks.ts            # Library callbacks
```

**Medium (4+ of same type):**

```
server/api/
├── queries/
│   ├── user.ts
│   └── posts.ts
├── mutations/
│   ├── user.ts
│   └── posts.ts
└── hooks/
    ├── database.ts
    └── payments.ts
```

**Large (15+ ops):**

```
server/api/
├── user/
│   ├── queries.ts
│   ├── mutations.ts
│   └── hooks.ts
└── posts/
    ├── queries.ts
    └── mutations.ts
```

## Path Aliases

| Alias       | Resolves to               |
| ----------- | ------------------------- |
| `$lib`      | `src/lib`                 |
| `$features` | `src/lib/features`        |
| `$services` | `src/lib/server/services` |

Always use aliases — prefer `$features/` over `$lib/features/`, `$services/` over `$lib/server/services/`.

## Import Hierarchy

```
$lib/shared/  → Cannot import from $features/
$lib/server/  → Cannot import from $features/
$features/    → Can import from shared/, server/, other features (via public API)
src/routes/   → Can import from features (via public API only)
```

## Import Rules

```typescript
// ✅ Public API imports — allowed from routes and other features
import { UserRole, createUserSchema } from '$features/users';
import { getUser, requireAuth } from '$features/users/server';

// ❌ Forbidden — internal paths from routes or other features
import { ... } from '$features/users/server/api/...';
import { ... } from '$features/users/config/...';
import { ... } from '$features/users/logic/...';
import { ... } from '$features/users/components/...';

// ✅ Internal imports (within same feature only)
import { auth } from './server/auth';
import { getSession } from './server/api/queries/user';
import { roles } from './config/access-control';
```

## File Responsibilities

| Location           | Purpose                   | Can Import                          | Cannot Contain              |
| ------------------ | ------------------------- | ----------------------------------- | --------------------------- |
| `index.ts`         | Client-safe public API    | `schemas.ts`, `config/`, `types.ts` | Business logic, server code |
| `schemas.ts`       | All Zod schemas           | Types only                          | Business logic, data ops    |
| `server/index.ts`  | Server-only public API    | Everything in `server/`             | Internal details            |
| `server/api/`      | Business logic            | `$lib/server/`, `logic/`, schemas   | —                           |
| `types.ts`         | Non-schema TS types       | —                                   | Business logic              |
| `constants.ts`     | Feature constants         | Types only                          | Logic, data ops             |
| `config/`          | Static config             | Types only                          | Server code                 |
| `logic/`           | Pure testable functions   | Types only                          | Data ops, side effects      |
| `components/`      | Svelte components         | Feature exports, `$lib/shared/`     | Business logic              |
| `server/adapters/` | External service adapters | `$lib/server/`                      | Data operations             |
| `server/handles/`  | SvelteKit handle creators | `api/`, `$lib/server/`              | Business logic              |
| `server/plugins/`  | Library plugins           | `$lib/server/`, `api/`              | Core business logic         |

## Example Feature Wiring

```typescript
// 1. schemas.ts — All Zod schemas at feature root
import { z } from 'zod';
export const createPostSchema = z.object({ title: z.string(), content: z.string() });

// 2. server/api/mutations.ts — Business logic
import { createPostSchema } from '../../schemas';
export async function createPost(data: z.infer<typeof createPostSchema>) {
	await db.insert(posts).values(data);
	redirect(303, '/posts');
}

// 3. server/api/queries.ts
export async function getPosts() {
	return await db.query.posts.findMany();
}

// 4. index.ts — Client-safe public API
export { createPostSchema } from './schemas';

// 5. server/index.ts — Server-only public API
export { createPost, getPosts } from './api';
```

## Remote Functions

Use SvelteKit remote functions for all client→server calls. **Never use superforms.**

Remote functions live in `[feature].remote.ts` files (or a `remote/` folder for larger features) at the feature root. They use `command()` or `form()` from `$app/server` — prefer `form()` (with `use: "form"`) when a `<form>` is involved, `command()` otherwise.

```typescript
// cart.remote.ts — Remote commands and forms
import { command, form, getRequestEvent } from '$app/server';
import { addToCartSchema } from './schemas';
import { addToCart } from './server';

// command() — programmatic calls from client JS
export const addToCartCommand = command(addToCartSchema, async (data) => {
	const event = getRequestEvent();
	const item = await addToCart(event.locals.session.id, data, event);
	return { success: true, item };
});

// form() — progressive-enhancement forms (prefer this when possible)
export const subscribeNewsletter = form(subscribeSchema, async ({ email }) => {
	const event = getRequestEvent();
	await subscribe(email, event);
	return { success: true };
});
```

**Scaling pattern:**

```
# Single file (1-4 remotes)
[feature].remote.ts

# Folder (5+ remotes)
remote/
├── commands.ts
└── forms.ts
```

Remote functions are re-exported from the feature's `index.ts` (client-safe public API):

```typescript
// index.ts
export { addToCartCommand } from './cart.remote';
```

## Error Handling

Use SvelteKit's `error()` for expected errors:

```typescript
import { error } from '@sveltejs/kit';
error(403, { message: 'Not authorized', code: 'FORBIDDEN' });
error(404, { message: 'Not found', code: 'NOT_FOUND' });
```

Use `throw new Error()` **only** in contexts that catch/re-throw (e.g., webhook handlers).

## Invariant Rules

1. **Two entry points minimum**: `index.ts`, `server/index.ts`
2. **All database operations in `server/api/`**
3. **Server-only code only in `server/`**
4. **Public APIs re-export, never expose internals**
5. **Never pre-scaffold directories** — create folders only when adding files
6. **Schemas always at feature root `schemas.ts`**, never in `api/`

## Common Pitfalls

1. Don't break TypeScript strict mode
2. Don't create overengineered solutions
3. Don't say done without running lint and type check
4. Don't import server-only code in client files
5. Don't import internal paths from other features — use public APIs only
6. Don't add `eslint-ignore`/`@ts-ignore` without asking
7. Don't use `throw new Error()` for expected errors — use `error()`
8. Don't put data operations outside `server/api/`
9. Don't put server-only code outside `server/`
10. Don't import services (`$services/`) directly in routes — use feature APIs
11. Don't import from `$features/` in `$lib/shared/` or `$lib/server/`
12. Don't use full paths — use `$features/` not `$lib/features/`, use `$services/` not `$lib/server/services/`
13. Don't pre-scaffold empty directories
14. Don't put Zod schemas in `server/api/`
15. Don't add unnecessary dependencies

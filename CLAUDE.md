# About You

You are my expert AI pair programmer with the judgment of a top senior software engineer. Think critically, identify ambiguities, and ask precise questions before coding. Prioritize code quality, maintainability, and reliability. Avoid unnecessary verbosity.

# Project Overview

SvelteKit application with Svelte 5, using feature-based architecture.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm check        # Type check
pnpm test         # Run tests
pnpm lint         # Lint code
```

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 (runes)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod
- **UI**: shadcn-svelte, Tailwind CSS
- **Testing**: Playwright (E2E)

## Path Aliases

```
$lib         → src/lib
$features    → src/lib/features
$services    → src/lib/server/services
```

**Always use aliases** - ESLint enforces `$features/` over `$lib/features/` and `$services/` over `$lib/server/services/`.

## Environment Variables

Fail-fast system: app crashes on startup if required env vars are missing. See `.env.example`.

# Feature-Based Architecture

```
src/lib/
├── features/          # Domain features (self-contained)
├── server/            # Server-only infrastructure (db, services)
│                      # Never imports from features/ (one-way dependency)
└── shared/            # Client+server code (components, utils, types)
```

## Feature Structure (Scales with Complexity)

**Three entry points (always required):**

- `$features/name` → Client-safe public API (index.ts)
- `$features/name/server` → Server-only public API
- `$features/name/remote` → Remote functions

### Invariant Rules (Never Change)

1. **Three entry points**: `index.ts`, `remote/index.ts`, `server/index.ts`
2. **All database operations in `server/api/`** - queries, mutations, functions
3. **Remote functions only in `remote/`** - no schemas, no helpers
4. **Server-only code only in `server/` or `remote/`**
5. **Public APIs re-export, never expose internals**
6. **Never pre-scaffold directories** - create folders only when adding files to them

### Required Structure (Always)

```
[feature]/
├── index.ts              # Client-safe public API (re-exports schemas, types, components)
├── schemas.ts            # All Zod schemas (shared between client & server)
├── remote/
│   └── index.ts          # Remote functions only
└── server/
    ├── index.ts          # Server-only public API
    └── api/              # ALL data operations live here
        └── ...           # Structure scales (see below)
```

### Optional (Add as needed)

```
├── constants.ts          # Feature constants
├── types.ts              # TypeScript-only types (only if you have non-schema types)
├── config/               # Static configuration (permissions, etc.)
├── logic/                # Pure testable functions (validation, transforms, calculations)
├── components/           # UI components
├── server/adapters/      # External service adapters
├── server/handles/       # SvelteKit handle creators
└── server/plugins/       # Library plugins
```

### api/ Structure Scaling

**Tiny (1-3 operations):** Single file

```
server/api/
└── api.ts                # All queries + mutations in one file
```

**Small (4-8 operations):** Flat files

```
server/api/
├── queries.ts
├── mutations.ts
├── database.hooks.ts     # Library callbacks use .hooks.ts suffix
└── polar.hooks.ts
```

**Medium (4+ of same type):** Split into folders

```
server/api/
├── queries/
│   ├── user.ts
│   └── posts.ts
├── mutations/
│   ├── user.ts
│   └── posts.ts
└── hooks/                # 4+ hooks → move to hooks/ folder
    ├── database.ts
    ├── organization.ts
    ├── polar.ts          # Polar.sh webhook handlers
    └── stripe.ts
```

**Note:** `server/plugins/polar.ts` (plugin factory) is separate from `api/polar.hooks.ts` (webhook handlers).

**Large (15+ operations):** Split by entity

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

**Note:** Schemas always live in feature root `schemas.ts`, not in api/.

## Folder Rules

### Required Files

| Location          | Purpose                                      | Can Import                          | Cannot Contain              |
| ----------------- | -------------------------------------------- | ----------------------------------- | --------------------------- |
| `index.ts`        | Client-safe public API                       | `schemas.ts`, `config/`, `types.ts` | Business logic, server code |
| `schemas.ts`      | All Zod schemas (shared client & server)     | Types only                          | Business logic, data ops    |
| `remote/index.ts` | `query()`, `form()`, `command()` only        | `server/api/`, `$lib/server/`       | Schemas, helpers, logic     |
| `server/index.ts` | Server-only public API                       | Everything in `server/`             | Internal details            |
| `server/api/`     | Business logic (queries, mutations, helpers) | `$lib/server/`, `logic/`, schemas   | Remote functions            |

### Optional Files (Add as needed)

| Location           | Purpose                                   | Can Import                      | Cannot Contain         |
| ------------------ | ----------------------------------------- | ------------------------------- | ---------------------- |
| `types.ts`         | TypeScript-only types (non-schema types)  | -                               | Business logic         |
| `constants.ts`     | Feature constants                         | Types only                      | Logic, data ops        |
| `config/`          | Static config (permissions)               | Types only                      | Server code            |
| `logic/`           | Pure testable functions (no side effects) | Types only                      | Data ops, side effects |
| `components/`      | Svelte components                         | Feature exports, `$lib/shared/` | Business logic         |
| `*.hooks.ts`       | Library callbacks (better-auth, Polar)    | `api/`, `$lib/server/`          | -                      |
| `server/adapters/` | External service adapters                 | `$lib/server/`                  | Data operations        |
| `server/handles/`  | SvelteKit handle creators                 | `api/`, `$lib/server/`          | Business logic         |
| `server/plugins/`  | Library plugins                           | `$lib/server/`, `api/`          | Core business logic    |

**Note:** `remote/` and `server/` folders enforce server-only execution. No `.server.ts` suffix needed inside.

## Import Hierarchy

```
$lib/shared/  → Cannot import from $features/ (lower level)
$lib/server/  → Cannot import from $features/ (infrastructure)
$features/    → Can import from shared/, server/, other features (via public API)
src/routes/   → Can import from features (via public API only)
```

## Import Rules

**All imports from features must use public APIs:**

```typescript
// Public API imports - allowed from anywhere (routes, other features)
import { UserRole, createUserSchema } from '$features/users';       // Client-safe (types, schemas)
import { getUser, requireAuth } from '$features/users/server';      // Server-only
import { getUserQuery } from '$features/users/remote';              // Remote functions (only from /remote)

// Forbidden - internal paths not allowed from routes or other features
import { ... } from '$features/users/server/api/...';      // ❌
import { ... } from '$features/users/config/...';          // ❌
import { ... } from '$features/users/logic/...';           // ❌
import { ... } from '$features/users/components/...';      // ❌

// Internal imports (within same feature only) - direct paths OK
import { auth } from './server/auth';
import { getSession } from './server/api/queries/user';
import { roles } from './config/access-control';
```

## API + Remote Pattern

```typescript
// schemas.ts - All Zod schemas (at feature root, shared between client & server)
import { z } from 'zod';
export const createPostSchema = z.object({ title: z.string(), content: z.string() });

// server/api/mutations.ts - Business logic
import { createPostSchema } from '../../schemas';
export async function createPost(data: z.infer<typeof createPostSchema>) {
	await db.insert(posts).values(data);
	redirect(303, '/posts');
}

// server/api/queries.ts
export async function getPosts() {
	return await db.query.posts.findMany();
}

// remote/index.ts - Thin wrappers ONLY
import { query, form } from '$app/server';
import { getPosts } from '../server/api/queries';
import { createPost } from '../server/api/mutations';
import { createPostSchema } from '../schemas';

export const getPostsQuery = query(getPosts);
export const createPostForm = form(createPostSchema, createPost);

// index.ts - Client-safe public API (schemas, types, components - NOT remote functions)
export { createPostSchema } from './schemas'; // Schemas for client-side validation

// server/index.ts - Server-only public API
export { createPost, getPosts } from './api';
export { validatePostPermissions } from '../logic';
```

# Remote Functions

Prefer remote functions over `+page.server.ts` load functions.

| Type        | Use Case                 | Example                     |
| ----------- | ------------------------ | --------------------------- |
| `query`     | Read dynamic data        | `getUser()`, `getPosts()`   |
| `form`      | Form submissions         | `createPost`                |
| `command`   | Non-form mutations       | `addLike()`, `deleteItem()` |
| `prerender` | Static data (build time) | `getNavigation()`           |

```svelte
<script>
	import { getPostsQuery, createPostForm } from '$features/posts/remote';
	import { formHandler } from '$lib/shared/form/form-handler.svelte';
</script>

{#each await getPostsQuery() as post}
	<article>{post.title}</article>
{/each}

<form
	{...formHandler(createPostForm, {
		onSuccess: () => toast.success('Post created')
	})}
>
	<input {...createPostForm.fields.title.as('text')} />
	<button>Create</button>
</form>
```

**Query invalidation:**

```typescript
getPostsQuery.set([...currentPosts, newPost]); // Update data
await getPostsQuery.refresh(); // Refetch
```

**Load functions:** Use `+layout.server.ts` only for auth guards. Use `+page.server.ts` only for legacy migration.

## formHandler

**Always use `formHandler`** for remote forms. Import from `$lib/shared/form/form-handler.svelte`.

Features:

- Double-submit prevention
- Error handling (HTTP errors, redirects)
- Toast notifications on error
- Validation error detection
- Form reset on success (default)

```svelte
import { formHandler } from '$lib/shared/form/form-handler.svelte';

<form {...formHandler(myForm, {
  onSuccess: ({ data }) => toast.success('Saved!'),
  onValidationError: ({ issues }) => showErrors = true,
  resetOnSuccess: true // default
})}>
```

**Options:**

- `beforeSubmit` - Return `false` to cancel submission
- `onSuccess` - Called with `{ data, inputData, form, attempt }`
- `onValidationError` - Called with `{ issues, form, attempt }`
- `onError` - Called on unexpected errors
- `onSettled` - Always called (finally equivalent)
- `resetOnSuccess` - Auto-reset form (default: `true`)
- `fallbackErrorMessage` - Default error toast message

If you cannot use `formHandler` for a specific reason, explain why and ask the user.

# Code Standards

## Style

- TypeScript strict mode, no `any` types
- SIMPLE solutions - avoid overengineering
- Minimal comments unless requested
- Always use `pnpm` (not npm/yarn), `pnpm dlx` (not npx)

## Svelte 5

- Use runes (`$state`, `$derived`, `$effect`)
- Avoid `$effect` - prefer `$derived` for computed values, event handlers for actions
- When initializing `$state` from props to create a mutable local copy (e.g., form state), use `// svelte-ignore state_referenced_locally` with a comment explaining intent:

```svelte
// svelte-ignore state_referenced_locally
// Captures initial prop value as mutable form state
let formState = $state({ ...preferences });
```

Do NOT use IIFEs or other workarounds. Only use `svelte-ignore` when the intent is to snapshot the initial prop value into non-reactive local state.

- Use `let { children } = $props()` and `{@render children?.()}`
- Forms in `components/forms/`
- Prefer `await` expressions over `{#await}` blocks:

```svelte
<svelte:boundary>
	<p>{await getData()}</p>
	{#snippet pending()}<p>Loading...</p>{/snippet}
</svelte:boundary>
```

## Error Handling

Use SvelteKit's `error()` for expected errors (proper HTTP status):

```typescript
import { error } from '@sveltejs/kit';
error(403, { message: 'Not authorized', code: 'FORBIDDEN' });
error(404, { message: 'Not found', code: 'NOT_FOUND' });
```

Use `throw new Error()` only in contexts that catch/re-throw (e.g., better-auth webhooks).

## Interactive Commands

NEVER run - ask user: `pnpm create svelte`, `pnpm dlx shadcn-svelte@latest init`, `pnpm dev`

## shadcn-svelte

Add: `pnpm dlx shadcn-svelte@latest add <component>` → `src/lib/components/ui/`

**Component showcase:** `src/routes/(dev)/components/+page.svelte` contains examples of how components are used in this project. When building UI, read this file first to understand the preferred styling patterns and component usage. Match the approach used there.

# Common Pitfalls

1. Don't run interactive commands - ask user
2. Don't add unnecessary dependencies
3. Don't break TypeScript strict mode
4. Don't create overengineered solutions
5. Don't say done without running lint and type check
6. Don't import server-only code in client files
7. Don't import internal paths from other features - use public APIs only
8. Don't export schemas/helpers from `remote/` - only remote functions
9. Don't use `oninput`/`onchange` when `bind:value` works
10. Don't add `eslint-ignore`/`@ts-ignore` without asking
11. Don't show success toast without checking `fields.allIssues().length`
12. Don't use `throw new Error()` for expected errors - use `error()`
13. Don't put data operations outside `server/api/`
14. Don't put server-only code outside `server/` or `remote/`
15. Don't import services (`$services/`) directly in routes - use feature APIs
16. Don't import from `$features/` in `$lib/shared/` or `$lib/server/` - they're lower level
17. Don't use full paths - use `$features/` not `$lib/features/`, use `$services/` not `$lib/server/services/`
18. Don't use raw `.enhance()` on remote forms - use `formHandler` instead
19. Don't pre-scaffold empty directories - create folders only when adding files
20. Don't put Zod schemas in `server/api/` - keep them in `schemas.ts` at feature root

# Testing

E2E with Playwright. Unit tests (Vitest) for complex pure functions and Zod schemas.

```typescript
test('should sign in', async ({ page }) => {
	await page.goto('/sign-in');
	await page.fill('[name="email"]', 'test@example.com');
	await page.click('button[type="submit"]');
	await expect(page.getByText('Enter your code')).toBeVisible();
});
```

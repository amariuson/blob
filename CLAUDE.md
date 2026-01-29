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

## Feature Structure

**Three entry points:**

- `$features/name` → Client-safe public API (index.ts)
- `$features/name/server` → Server-only public API
- `$features/name/remote` → Remote functions

```
[feature]/
├── index.ts                # Client-safe public API
├── constants.ts            # Feature constants
├── types.ts                # Feature types
├── schemas.ts              # Client-safe Zod schemas (shared)
├── config/                 # Configuration (e.g., access-control.ts)
├── logic/                  # Pure functions (validation, transforms)
├── components/             # UI components
│   └── forms/
├── remote/                 # Remote functions ONLY
│   └── index.ts
└── server/                 # ALL server-only code
    ├── index.ts            # Server-only public API
    ├── [feature].ts        # Feature instance (optional)
    ├── api/                # Business logic + Zod schemas
    │   ├── queries/        # Data reads (or queries.ts if simple)
    │   ├── mutations/      # Data writes (or mutations.ts if simple)
    │   └── hooks/          # Library lifecycle hooks & callbacks (e.g., better-auth)
    ├── adapters/           # External service adapters
    ├── hooks/              # Database/ORM hooks (Drizzle)
    ├── handles/            # SvelteKit handle creators
    └── plugins/            # Library plugins (e.g., Polar)
```

## Folder Rules

| Location            | Purpose                               | Can Import                      | Cannot Contain              |
| ------------------- | ------------------------------------- | ------------------------------- | --------------------------- |
| `index.ts`          | Client-safe public API                | `schemas`, `config/`, `types`   | Business logic, server code |
| `schemas.ts`        | Client-safe Zod schemas (shared)      | Types only                      | Server code, business logic |
| `config/`           | Static config (permissions)           | Types only                      | Server code                 |
| `logic/`            | Pure functions                        | Types only                      | Data ops, side effects      |
| `components/`       | Svelte components                     | Feature exports, `$lib/shared/` | Business logic              |
| `remote/`           | `query()`, `form()`, `command()` only | `server/api/`, `$lib/server/`   | Schemas, helpers, logic     |
| `server/index.ts`   | Server-only public API                | Everything in `server/`         | Internal details            |
| `server/api/`       | Business logic + Zod schemas          | `$lib/server/`, `logic/`        | Remote functions            |
| `server/api/hooks/` | Library lifecycle hooks & callbacks   | `api/`, `$lib/server/`          | Database hooks              |
| `server/adapters/`  | External service adapters             | `$lib/server/`                  | Data operations             |
| `server/hooks/`     | Database/ORM hooks                    | `$lib/server/db`                | Library hooks               |
| `server/handles/`   | SvelteKit handle creators             | `api/`, `$lib/server/`          | Business logic              |
| `server/plugins/`   | Library plugins                       | `$lib/server/`, `api/`          | Core business logic         |

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
// schemas.ts - Client-safe Zod schemas (importable from index.ts, remote/, server/)
export const createPostSchema = z.object({ title: z.string(), content: z.string() });

// server/api/mutations/posts.ts - Business logic
import { createPostSchema } from '../../schemas';
export async function createPost(data: z.infer<typeof createPostSchema>) {
	await db.insert(posts).values(data);
	redirect(303, '/posts');
}

// server/api/queries/posts.ts
export async function getPosts() {
	return await db.query.posts.findMany();
}

// remote/index.ts - Thin wrappers ONLY
import { query, form } from '$app/server';
import { getPosts } from '../server/api/queries/posts';
import { createPost } from '../server/api/mutations/posts';
import { createPostSchema } from '../schemas';

export const getPostsQuery = query(getPosts);
export const createPostForm = form(createPostSchema, createPost);

// index.ts - Client-safe public API (components, types, schemas - NOT remote functions)
export { createPostSchema } from './schemas';

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
13. Don't confuse `server/api/hooks/` (library) with `server/hooks/` (database)
14. Don't put data operations outside `server/api/`
15. Don't put server-only code outside `server/` or `remote/`
16. Don't import services (`$services/`) directly in routes - use feature APIs
17. Don't import from `$features/` in `$lib/shared/` or `$lib/server/` - they're lower level
18. Don't use full paths - use `$features/` not `$lib/features/`, use `$services/` not `$lib/server/services/`
19. Don't use raw `.enhance()` on remote forms - use `formHandler` instead

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

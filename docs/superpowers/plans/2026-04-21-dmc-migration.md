# DMC Auth & Admin Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the `auth` and `admin` features from `../blob-never` to `../blob` as a fresh rewrite, with services layer (logger/tracing → Axiom, redis, email, polar, storage, lifecycle), keeping every intermediate commit green under `pnpm lint` and `pnpm check`.

**Architecture:** Build bottom-up in numbered tasks: dependencies → env+lifecycle → observability → infra services → auth config+stubs → schema → auth real impl → handles+hooks → auth UI+routes → admin → app shell → dev tools → final smoke test. Auth plugins must be wired _before_ `pnpm auth:schema` can emit a reference snapshot for the hand-written `schema.ts`.

**Tech Stack:** SvelteKit 2, Svelte 5 (runes), TypeScript, `better-auth` + admin + organization + emailOTP plugins, drizzle-orm on Postgres 18 (native `uuidv7()`), ioredis, Resend + `better-svelte-email`, `@polar-sh/better-auth` + `@polar-sh/sdk`, pino + `@axiomhq/pino`, OpenTelemetry → Axiom OTLP, `@aws-sdk/client-s3`, shadcn-svelte, Zod v4.

**Reference project:** `../blob-never` — this is a sibling checkout that contains the source-of-truth behaviour. When a task says "port semantics from `<path>`", that path is relative to the reference repo and the engineer should read it but re-derive (not copy verbatim) with the documented simplifications applied.

**Spec:** `docs/superpowers/specs/2026-04-21-dmc-migration-design.md`. Every rule in that spec (collapses, error handling conventions, env-var-only identity strings, CLAUDE.md architectural rules) applies to every task below. Re-read it before starting.

**Constraint — no tests.** The user explicitly excluded all tests. The usual TDD loop (write-failing-test → implement → make-green) is replaced with `pnpm lint && pnpm check` after every task, and every task ends on a commit.

---

## Prerequisites

- Node 20+, pnpm, Docker (for `docker compose up` local postgres via `compose.yaml`).
- Postgres **18** for native `uuidv7()` — if the local compose uses an older Postgres, update `compose.yaml` image to `postgres:18` before Task 11.
- `../blob-never` checked out as a sibling directory, reachable at `/Users/amariuson/dev/projects/blob-never/`.

## File Structure Overview

```
src/
├── app.d.ts                                    # Locals: session, activeMember, context
├── app.html                                    # (unchanged)
├── hooks.server.ts                             # sequence(setup, redirect, auth)
├── instrumentation.server.ts                   # NEW — boots OTEL before any import
├── lib/
│   ├── assets/favicon.svg                      # (unchanged)
│   ├── features/
│   │   ├── auth/
│   │   │   ├── index.ts                        # client-safe public API
│   │   │   ├── schemas.ts                      # 4 Zod schemas
│   │   │   ├── access-control.ts               # roles + permissions
│   │   │   ├── auth.remote.ts                  # all remote functions
│   │   │   ├── components/
│   │   │   │   ├── layout.svelte
│   │   │   │   ├── auth.svelte
│   │   │   │   ├── onboarding.svelte
│   │   │   │   └── forms/{google,email,otp}-form.svelte
│   │   │   └── server/
│   │   │       ├── index.ts                    # server-only public API
│   │   │       ├── auth.ts                     # betterAuth({...})
│   │   │       ├── polar-plugin.ts
│   │   │       ├── session-storage.ts          # Redis secondaryStorage adapter
│   │   │       ├── handles.ts                  # setup+redirect+auth handles (one file)
│   │   │       └── api/
│   │   │           ├── queries.ts
│   │   │           ├── mutations.ts
│   │   │           └── hooks.ts                # better-auth lifecycle callbacks
│   │   └── admin/
│   │       ├── index.ts
│   │       ├── admin.remote.ts
│   │       ├── components/{impersonation-banner,stop-impersonation-form}.svelte
│   │       └── server/
│   │           ├── index.ts
│   │           └── api.ts                      # queries + mutations (one file)
│   ├── server/
│   │   ├── db/
│   │   │   ├── auth.schema.ts                  # generated reference — NOT imported
│   │   │   ├── schema.ts                       # hand-written
│   │   │   ├── index.ts
│   │   │   └── utils.ts                        # entitlementsJsonb
│   │   ├── env.server.ts                       # typed env + isDev/isProd
│   │   └── services/
│   │       ├── lifecycle/
│   │       ├── logger/
│   │       ├── tracing/
│   │       ├── redis/
│   │       ├── email/templates/                # 4 .svelte templates
│   │       ├── polar/                          # client + adapter
│   │       └── storage/
│   └── shared/
│       ├── components/
│       │   ├── ui/                             # existing shadcn — unchanged
│       │   └── sidebar/app-sidebar.svelte
│       ├── form/form-handler.svelte.ts
│       ├── hooks/is-mobile.svelte.ts           # (unchanged)
│       ├── types/entitlements.ts
│       └── utils.ts                            # cn, generateSlug, invariant, getClientIp
└── routes/
    ├── +layout.svelte                          # (unchanged)
    ├── layout.css                              # (unchanged)
    ├── (app)/{+layout,+page}.svelte
    ├── (auth)/{sign-in,sign-up,onboarding}/+page.svelte
    └── (dev)/
        ├── +layout.server.ts                   # dev-only guard
        └── email-preview/[...email]/{+page.server.ts,+page.svelte}
```

---

## Task 1: Create feature branch

**Files:** none.

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout -b feat/dmc-auth-admin-migration
```

- [ ] **Step 2: Verify clean state**

```bash
git status
```

Expected: "On branch feat/dmc-auth-admin-migration. nothing to commit, working tree clean." (The two spec-related commits from earlier are still on `main` and now also on this branch.)

---

## Task 2: Update dependencies and swap adapter

**Files:**

- Modify: `package.json`
- Modify: `svelte.config.js` (import swap)

**Background:** Adding all runtime libs needed by services + auth feature. `@sveltejs/adapter-node` replaces `@sveltejs/adapter-auto` because pino/OTEL/Polar webhooks require Node. **Always pick the latest published version** for each package — no pinning to old majors. After installing, run `pnpm outdated` to catch anything that installed behind latest and bump it explicitly.

Runtime packages must live in `dependencies`, not `devDependencies`: when the app is deployed via `adapter-node`, prod installs (`pnpm install --prod` or Docker images that skip dev deps) must still resolve runtime imports. Existing runtime packages currently in `devDependencies` move across in this task.

- [ ] **Step 1: Edit `package.json` — create `dependencies` section and move runtime packages**

**Move from `devDependencies` to `dependencies`** (runtime libs — imported from the built server bundle):

`better-auth`, `drizzle-orm`, `postgres`, `svelte`, `bits-ui`, `@tabler/icons-svelte`, `@internationalized/date`, `@tanstack/table-core`, `clsx`, `embla-carousel-svelte`, `formsnap`, `layerchart`, `mode-watcher`, `paneforge`, `svelte-sonner`, `tailwind-merge`, `tailwind-variants`, `tw-animate-css`, `vaul-svelte`, `@fontsource-variable/geist`, `@fontsource-variable/merriweather`.

**Keep in `devDependencies`** (build/check/lint/codegen only — not imported at runtime): `@better-auth/cli` (only runs `auth:schema`), `@eslint/compat`, `@eslint/js`, `@sveltejs/kit`, `@sveltejs/vite-plugin-svelte`, `@tailwindcss/vite`, `@types/node`, `drizzle-kit`, `eslint`, `eslint-config-prettier`, `eslint-plugin-svelte`, `globals`, `prettier`, `prettier-plugin-svelte`, `prettier-plugin-tailwindcss`, `shadcn-svelte` (CLI component generator), `svelte-check`, `tailwindcss`, `typescript`, `typescript-eslint`, `vite`.

**Remove entirely** (unused / forbidden by spec): `@sveltejs/adapter-auto`, `sveltekit-superforms` (spec forbids superforms — remote functions only).

**Add new `dependencies`** (for the migration — use `latest` so pnpm picks current version at install time):

```json
{
	"@aws-sdk/client-s3": "latest",
	"@aws-sdk/s3-request-presigner": "latest",
	"@axiomhq/pino": "latest",
	"@kubiks/otel-drizzle": "latest",
	"@kubiks/otel-polar": "latest",
	"@kubiks/otel-resend": "latest",
	"@opentelemetry/api": "latest",
	"@opentelemetry/auto-instrumentations-node": "latest",
	"@opentelemetry/exporter-trace-otlp-proto": "latest",
	"@opentelemetry/resources": "latest",
	"@opentelemetry/sdk-node": "latest",
	"@opentelemetry/semantic-conventions": "latest",
	"@polar-sh/better-auth": "latest",
	"@polar-sh/sdk": "latest",
	"better-svelte-email": "latest",
	"date-fns": "latest",
	"dotenv": "latest",
	"import-in-the-middle": "latest",
	"ioredis": "latest",
	"pino": "latest",
	"pino-pretty": "latest",
	"resend": "latest",
	"runed": "latest",
	"svelte-toolbelt": "latest",
	"sveltekit-rate-limiter": "latest",
	"uuidv7": "latest",
	"zod": "latest"
}
```

**Bump `better-auth` + `@better-auth/cli`** to `latest` — required so the `@polar-sh/better-auth` plugin's peer version is satisfied. Both must resolve to the same minor; keep `@better-auth/cli` in `devDependencies` (it's only the schema-generator CLI).

**Add to `devDependencies`**: `"@sveltejs/adapter-node": "latest"`.

- [ ] **Step 2: Update `svelte.config.js`**

Replace line 1 `import adapter from '@sveltejs/adapter-auto';` with:

```js
import adapter from '@sveltejs/adapter-node';
```

No other change.

- [ ] **Step 3: Install + resolve**

```bash
pnpm install
pnpm outdated
```

Expected install: no errors. If `patches/@sveltejs__kit.patch` fails to apply due to version drift, keep the existing `@sveltejs/kit` version at `^2.57.0` and try again; if the patch still fails, update the patch with `pnpm patch @sveltejs/kit` and re-apply the minimal change the patch was making.

`pnpm outdated` must show no packages behind latest (modulo major-version breaking changes that the team hasn't adopted). If anything is behind, update `package.json` explicitly and re-install.

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm check
```

Both must pass clean. If either fails, fix inline before committing.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml svelte.config.js
git commit -m "Move runtime deps to dependencies, add service libs, swap to adapter-node"
```

---

## Task 3: Create `.env.example` and bootstrap `.env`

**Files:**

- Create: `.env.example`
- Create: `.env` (from `.env.example`; already gitignored)
- Modify: `.gitignore` (verify `.env` listed)

**Background:** `drizzle.config.ts` throws at import time if `DATABASE_URL` is unset, so `pnpm db:generate` / `pnpm db:migrate` / `pnpm auth:schema` all need `.env` populated _before_ Task 19. `DATABASE_URL` must match `compose.yaml` which defines `POSTGRES_USER: root`, `POSTGRES_PASSWORD: mysecretpassword`, `POSTGRES_DB: local`.

- [ ] **Step 1: Write `.env.example`**

```
# App identity — used for cookie prefix, OTEL service name, email "from" display
APP_NAME=DMC
APP_SLUG=dmc-app
COOKIE_PREFIX=dmc-app
OTEL_SERVICE_NAME=dmc-app
EMAIL_FROM="DMC <no-reply@example.com>"

# Public (browser-accessible) copy of APP_NAME — read by $env/dynamic/public
PUBLIC_APP_NAME=DMC

# Core
DATABASE_URL=postgres://root:mysecretpassword@localhost:5432/local
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:5173

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Redis
REDIS_URL=redis://localhost:6379

# Email (Resend) — if unset in dev, emails log to console
RESEND_API_KEY=

# Billing (Polar)
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_SERVER=sandbox

# Observability (Axiom)
AXIOM_TOKEN=
AXIOM_DATASET_LOGS=
AXIOM_DATASET_TRACES=

# Storage (S3-compatible — AWS / R2 / MinIO)
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

- [ ] **Step 2: Verify `.gitignore` contains `.env`**

```bash
grep -E '^\.env$' .gitignore || echo "MISSING"
```

If it prints `MISSING`, append `.env` on its own line.

- [ ] **Step 3: Bootstrap local `.env` from the example**

```bash
cp .env.example .env
```

Populate `BETTER_AUTH_SECRET` with an arbitrary 32+ character string for local dev — `openssl rand -hex 32`. Other values can stay at their example defaults; the migration scripts only need `DATABASE_URL` to be valid, and the dev server handles missing OAuth / Polar / Axiom gracefully (with warnings) for routes that don't exercise them.

- [ ] **Step 4: Commit**

```bash
git add .env.example .gitignore
git commit -m "Add .env.example aligned with compose.yaml creds; add PUBLIC_APP_NAME"
```

The actual `.env` file is gitignored so it won't be staged.

---

## Task 4: Delete `demo/` route and stub current auth/schema

**Files:**

- Delete: `src/routes/demo/` (entire directory)
- Delete: `src/lib/server/auth.ts` (will be replaced by feature-owned version)
- Modify: `src/lib/server/db/schema.ts` (clear task-placeholder content)
- Modify: `src/hooks.server.ts` (stub handle until auth feature is ready)
- Modify: `src/app.d.ts` (clear stale `user`/`session` refs to unblock check)

- [ ] **Step 1: Remove demo route**

```bash
rm -rf src/routes/demo
```

- [ ] **Step 2: Remove old auth stub**

```bash
rm src/lib/server/auth.ts
```

- [ ] **Step 3: Replace `src/lib/server/db/schema.ts` with empty placeholder**

```typescript
// Real schema lands in Task 19. This placeholder keeps the drizzle config valid.
export {};
```

- [ ] **Step 4: Replace `src/hooks.server.ts` with a passthrough**

```typescript
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => resolve(event);
```

- [ ] **Step 5: Replace `src/app.d.ts` with the full Locals shape**

Define the final shape up front using loose types. Task 23 will tighten `session`/`activeMember` to the better-auth inferred types once the auth feature exports them. Doing this now prevents red intermediate states where handles or api modules reference `event.locals.X` with no type.

```typescript
declare global {
	namespace App {
		interface Locals {
			// Tightened to inferred better-auth types in Task 23; loose here to unblock intermediates.
			session: unknown;
			activeMember: unknown;
			context: {
				requestId: string;
				userId?: string;
				orgId?: string;
			};
		}
	}
}

export {};
```

- [ ] **Step 6: Verify**

```bash
pnpm lint
pnpm check
```

Both must pass clean.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Remove demo route and stub auth/schema/hooks for rewrite"
```

---

## Task 5: Create `env.server.ts`

**Files:**

- Create: `src/lib/server/env.server.ts`

**Background:** Single source of typed env access. Fails fast with a readable error when required vars are missing. Uses `$env/dynamic/private` for runtime-variable values (so deploys can override without rebuild).

**Background:** Two tiers of vars. **Required-always** must be set for the app to boot (DB, auth secret, URL, identity, Redis). **Optional-service** gates specific service features — missing values are allowed; the service logs a warning and degrades gracefully (or throws only if a request path actually invokes it). This lets local dev boot without Google / Polar / Axiom / S3 / Resend creds.

- [ ] **Step 1: Write `src/lib/server/env.server.ts`**

```typescript
import { env as dynamicEnv } from '$env/dynamic/private';

// --- Required for boot ---------------------------------------------------
const REQUIRED = [
	'APP_NAME',
	'APP_SLUG',
	'COOKIE_PREFIX',
	'OTEL_SERVICE_NAME',
	'EMAIL_FROM',
	'DATABASE_URL',
	'BETTER_AUTH_SECRET',
	'BETTER_AUTH_URL',
	'REDIS_URL'
] as const;

// --- Optional, each service guards on its own presence -------------------
const OPTIONAL = [
	'GOOGLE_CLIENT_ID',
	'GOOGLE_CLIENT_SECRET',
	'RESEND_API_KEY',
	'POLAR_ACCESS_TOKEN',
	'POLAR_WEBHOOK_SECRET',
	'POLAR_SERVER',
	'AXIOM_TOKEN',
	'AXIOM_DATASET_LOGS',
	'AXIOM_DATASET_TRACES',
	'S3_ENDPOINT',
	'S3_REGION',
	'S3_BUCKET',
	'S3_ACCESS_KEY_ID',
	'S3_SECRET_ACCESS_KEY'
] as const;

type RequiredKey = (typeof REQUIRED)[number];
type OptionalKey = (typeof OPTIONAL)[number];

const raw: Record<RequiredKey | OptionalKey, string | undefined> = Object.fromEntries(
	[...REQUIRED, ...OPTIONAL].map((k) => [k, dynamicEnv[k]])
) as Record<RequiredKey | OptionalKey, string | undefined>;

const missing = REQUIRED.filter((k) => !raw[k]);
if (missing.length > 0) {
	throw new Error(
		`Missing required environment variables: ${missing.join(', ')}. ` +
			`See .env.example for the full list.`
	);
}

export const env = {
	// required
	APP_NAME: raw.APP_NAME!,
	APP_SLUG: raw.APP_SLUG!,
	COOKIE_PREFIX: raw.COOKIE_PREFIX!,
	OTEL_SERVICE_NAME: raw.OTEL_SERVICE_NAME!,
	EMAIL_FROM: raw.EMAIL_FROM!,
	DATABASE_URL: raw.DATABASE_URL!,
	BETTER_AUTH_SECRET: raw.BETTER_AUTH_SECRET!,
	BETTER_AUTH_URL: raw.BETTER_AUTH_URL!,
	REDIS_URL: raw.REDIS_URL!,
	// optional — callers decide how to handle undefined
	GOOGLE_CLIENT_ID: raw.GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET: raw.GOOGLE_CLIENT_SECRET,
	RESEND_API_KEY: raw.RESEND_API_KEY,
	POLAR_ACCESS_TOKEN: raw.POLAR_ACCESS_TOKEN,
	POLAR_WEBHOOK_SECRET: raw.POLAR_WEBHOOK_SECRET,
	POLAR_SERVER: (raw.POLAR_SERVER as 'sandbox' | 'production' | undefined) ?? 'sandbox',
	AXIOM_TOKEN: raw.AXIOM_TOKEN,
	AXIOM_DATASET_LOGS: raw.AXIOM_DATASET_LOGS,
	AXIOM_DATASET_TRACES: raw.AXIOM_DATASET_TRACES,
	S3_ENDPOINT: raw.S3_ENDPOINT,
	S3_REGION: raw.S3_REGION,
	S3_BUCKET: raw.S3_BUCKET,
	S3_ACCESS_KEY_ID: raw.S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY: raw.S3_SECRET_ACCESS_KEY
} as const;

export const isDev = process.env.NODE_ENV !== 'production';
export const isProd = !isDev;

// Helpers for optional services — each returns required values or throws with a focused message.
export function requireGoogleOAuth() {
	if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
		throw new Error('Google OAuth not configured: set GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET');
	}
	return { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET };
}

export function requirePolar() {
	if (!env.POLAR_ACCESS_TOKEN || !env.POLAR_WEBHOOK_SECRET) {
		throw new Error('Polar not configured: set POLAR_ACCESS_TOKEN + POLAR_WEBHOOK_SECRET');
	}
	return {
		accessToken: env.POLAR_ACCESS_TOKEN,
		webhookSecret: env.POLAR_WEBHOOK_SECRET,
		server: env.POLAR_SERVER
	};
}

export function requireAxiom() {
	if (!env.AXIOM_TOKEN || !env.AXIOM_DATASET_LOGS || !env.AXIOM_DATASET_TRACES) {
		throw new Error('Axiom not configured: set AXIOM_TOKEN + AXIOM_DATASET_{LOGS,TRACES}');
	}
	return {
		token: env.AXIOM_TOKEN,
		datasetLogs: env.AXIOM_DATASET_LOGS,
		datasetTraces: env.AXIOM_DATASET_TRACES
	};
}

export function requireS3() {
	const { S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = env;
	if (!S3_ENDPOINT || !S3_REGION || !S3_BUCKET || !S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY) {
		throw new Error(
			'S3 not configured: set S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY'
		);
	}
	return { S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY };
}

export function requireResend() {
	if (!env.RESEND_API_KEY) throw new Error('Resend not configured: set RESEND_API_KEY');
	return { apiKey: env.RESEND_API_KEY };
}
```

Consumers call `requireX()` lazily at the point they need the value — not at module load — so dev can boot without them.

- [ ] **Step 2: Verify**

Create a throwaway `.env` locally with at least the required vars populated with placeholders (they won't be exercised yet) — or run lint/check which don't import `$env/dynamic/private`.

```bash
pnpm lint
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/server/env.server.ts
git commit -m "Add typed env accessor with fail-fast required-var check"
```

---

## Task 6: Expand `shared/utils.ts`

**Files:**

- Modify: `src/lib/shared/utils.ts`
- Create: `src/lib/shared/types/entitlements.ts`

**Background:** Add `generateSlug`, `invariant`, `getClientIp` to the existing `cn` + type helpers. Move `Entitlements` type to a shared location because both `polar/` service and db `utils.ts` need it.

- [ ] **Step 1: Write `src/lib/shared/types/entitlements.ts`**

`customerId` is part of this type because the Polar adapter stores the Polar customer's external id inside the entitlements jsonb (avoiding a schema change to add a dedicated `polarCustomerId` column). `null` until `ensureCustomer` runs.

```typescript
import type { CustomerStateBenefitGrant } from '@polar-sh/sdk/models/components/customerstatebenefitgrant.js';
import type { CustomerStateMeter } from '@polar-sh/sdk/models/components/customerstatemeter.js';
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js';

export type Entitlements = {
	customerId: string | null;
	activeSubscriptions: CustomerStateSubscription[];
	grantedBenefits: CustomerStateBenefitGrant[];
	activeMeters: CustomerStateMeter[];
	updatedAt: Date;
};

export const defaultEntitlements: Entitlements = {
	customerId: null,
	activeSubscriptions: [],
	grantedBenefits: [],
	activeMeters: [],
	updatedAt: new Date(0)
};
```

- [ ] **Step 2: Append to `src/lib/shared/utils.ts`** (keep existing `cn` and types unchanged)

After the existing content, append:

```typescript
import { dev } from '$app/environment';

export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

export function invariant(
	condition: unknown,
	message?: string | (() => string)
): asserts condition {
	if (condition) return;
	const prefix = 'Invariant failed';
	const provided = typeof message === 'function' ? message() : message;
	throw new Error(dev && provided ? `${prefix}: ${provided}` : prefix);
}

export function getClientIp(request: Request): string | null {
	// x-forwarded-for is a comma-separated chain: "client, proxy1, proxy2". Take the first.
	const xff = request.headers.get('x-forwarded-for');
	if (xff) {
		const first = xff.split(',')[0]?.trim();
		if (first) return first;
	}
	return request.headers.get('x-real-ip')?.trim() || null;
}
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/shared/types/entitlements.ts src/lib/shared/utils.ts
git commit -m "Add generateSlug, invariant, getClientIp; Entitlements type"
```

---

## Task 7: Create `lifecycle/` service

**Files:**

- Create: `src/lib/server/services/lifecycle/index.ts`
- Create: `src/lib/server/services/lifecycle/lifecycle.server.ts`

- [ ] **Step 1: Write `lifecycle.server.ts`**

```typescript
type Hook = { name: string; fn: () => Promise<void> | void; timeout: number };

const hooks: Hook[] = [];
let installed = false;

export function onShutdown(
	name: string,
	fn: () => Promise<void> | void,
	options: { timeout?: number } = {}
) {
	hooks.push({ name, fn, timeout: options.timeout ?? 5000 });
	install();
}

function install() {
	if (installed) return;
	installed = true;
	for (const signal of ['SIGTERM', 'SIGINT'] as const) {
		process.once(signal, () => void runAll(signal));
	}
}

async function runAll(signal: string) {
	console.log(`[lifecycle] received ${signal}, running ${hooks.length} shutdown hooks`);
	// LIFO: last-registered runs first
	for (const hook of [...hooks].reverse()) {
		try {
			await withTimeout(hook.fn(), hook.timeout, hook.name);
		} catch (err) {
			console.error(`[lifecycle] hook "${hook.name}" failed:`, err);
		}
	}
	process.exit(0);
}

function withTimeout<T>(p: Promise<T> | T, ms: number, name: string): Promise<T> {
	return Promise.race([
		Promise.resolve(p),
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error(`hook "${name}" timed out after ${ms}ms`)), ms)
		)
	]);
}
```

- [ ] **Step 2: Write `index.ts`**

```typescript
export { onShutdown } from './lifecycle.server';
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/server/services/lifecycle/
git commit -m "Add lifecycle service with LIFO shutdown hooks and timeouts"
```

---

## Task 8: Create `logger/` service

**Files:**

- Create: `src/lib/server/services/logger/index.ts`
- Create: `src/lib/server/services/logger/logger.server.ts`

**Background:** Pino with `@axiomhq/pino` transport in prod, pino-pretty in dev. Base fields include `service: env.OTEL_SERVICE_NAME` so logs and traces correlate in Axiom.

- [ ] **Step 1: Write `logger.server.ts`**

```typescript
import pino from 'pino';

import { env, isDev } from '$lib/server/env.server';

import { onShutdown } from '../lifecycle';

const transport = isDev
	? pino.transport({
			target: 'pino-pretty',
			options: { colorize: true, translateTime: 'SYS:HH:MM:ss' }
		})
	: pino.transport({
			target: '@axiomhq/pino',
			options: { dataset: env.AXIOM_DATASET_LOGS, token: env.AXIOM_TOKEN }
		});

export const logger = pino(
	{ level: isDev ? 'debug' : 'info', base: { service: env.OTEL_SERVICE_NAME } },
	transport
);

onShutdown('logger', () => new Promise<void>((resolve) => transport.end(() => resolve())));
```

**Public contract — what `logger/index.ts` exports and nothing else:**

```typescript
export { logger } from './logger.server';
```

That's the entire public surface. `logger` is a `pino.Logger` — consumers treat it as an interface with `info/debug/warn/error/fatal/child`. Do not export pino internals, custom wrappers, or additional helpers. If someone wants structured fields, use `logger.child({...})` inline. The service is a thin configuration wrapper, not a logging framework.

- [ ] **Step 2: Write `index.ts`**

```typescript
export { logger } from './logger.server';
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/server/services/logger/
git commit -m "Add logger service: pino + Axiom transport (pretty in dev)"
```

---

## Task 9: Create `tracing/` service

**Files:**

- Create: `src/lib/server/services/tracing/index.ts`
- Create: `src/lib/server/services/tracing/tracing.server.ts`

**Background:** OTEL NodeSDK with OTLP-proto exporter → Axiom. Must call `startTracing()` before any instrumented module imports (drizzle, polar, resend). `startTracing()` is idempotent.

- [ ] **Step 1: Write `tracing.server.ts`**

```typescript
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

import { drizzleInstrumentation } from '@kubiks/otel-drizzle';
import { polarInstrumentation } from '@kubiks/otel-polar';
import { resendInstrumentation } from '@kubiks/otel-resend';

import { env } from '$lib/server/env.server';

import { onShutdown } from '../lifecycle';

let sdk: NodeSDK | null = null;

export function startTracing() {
	if (sdk) return;

	sdk = new NodeSDK({
		resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME }),
		traceExporter: new OTLPTraceExporter({
			url: 'https://api.axiom.co/v1/traces',
			headers: {
				Authorization: `Bearer ${env.AXIOM_TOKEN}`,
				'X-Axiom-Dataset': env.AXIOM_DATASET_TRACES
			}
		}),
		instrumentations: [
			getNodeAutoInstrumentations(),
			drizzleInstrumentation(),
			polarInstrumentation(),
			resendInstrumentation()
		]
	});

	sdk.start();

	onShutdown('tracing', async () => {
		await sdk?.shutdown();
	});
}
```

Note: the `@kubiks/otel-*` packages' exact export name may differ. If `pnpm check` reports `drizzleInstrumentation` missing, open the package's `dist` types and swap to the actual export (common variants: default export, `DrizzleInstrumentation` class). Do not silence the error.

**Public contract — tracing exports exactly one function:**

```typescript
export function startTracing(): void;
```

Idempotent — second and later calls are no-ops. Never exports the SDK, exporter, or instrumentations to callers; if they need spans, they import `@opentelemetry/api` directly and use `trace.getTracer(...)`.

- [ ] **Step 2: Write `index.ts`**

```typescript
export { startTracing } from './tracing.server';
```

- [ ] **Step 3: Create `src/instrumentation.server.ts`**

**Order-critical:** import `logger` _before_ calling `startTracing()`. Both services register shutdown hooks via `onShutdown()` at module-load side-effect. Lifecycle runs hooks **LIFO**, so:

- Logger imported first → registers first → runs **last** on shutdown.
- Tracing registered second → runs **first** on shutdown.

This is the order we want: tracing flushes spans (possibly emitting log lines during shutdown), then logger flushes pino's buffer, capturing every last log line — including those tracing just emitted. Reverse the order and you lose the final batch of logs.

```typescript
import { logger } from '$services/logger'; // side-effect: registers shutdown hook FIRST
import { startTracing } from '$services/tracing';

logger.debug('instrumentation.server booting');
startTracing();
```

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/services/tracing/ src/instrumentation.server.ts
git commit -m "Add tracing service: OTEL NodeSDK -> Axiom, wired via instrumentation.server"
```

---

## Task 10: Create `redis/` service

**Files:**

- Create: `src/lib/server/services/redis/index.ts`
- Create: `src/lib/server/services/redis/redis.server.ts`

- [ ] **Step 1: Write `redis.server.ts`**

```typescript
import { Redis } from 'ioredis';

import { env } from '$lib/server/env.server';

import { onShutdown } from '../lifecycle';

export const redisClient = new Redis(env.REDIS_URL, {
	lazyConnect: true,
	maxRetriesPerRequest: 3
});

onShutdown('redis', async () => {
	await redisClient.quit();
});
```

- [ ] **Step 2: Write `index.ts`**

```typescript
export { redisClient } from './redis.server';
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/server/services/redis/
git commit -m "Add redis service: ioredis client with lifecycle shutdown"
```

---

## Task 11: Start Postgres 18 locally

**Files:** none (verification only unless `compose.yaml` needs editing).

**Background:** `compose.yaml` already declares `db` service on `postgres:18` with user `root`, password `mysecretpassword`, database `local`. Confirm with one read before starting.

- [ ] **Step 1: Confirm `compose.yaml` pins Postgres 18**

```bash
grep 'image:' compose.yaml
```

Expected includes `image: postgres:18`. If not, edit the service image to `postgres:18` and recreate the container (`docker compose down -v && docker compose up -d db`).

- [ ] **Step 2: Start the DB + Redis**

```bash
pnpm db:start
```

This runs `docker compose up` (foreground). In a second terminal, verify both services are up:

```bash
docker compose ps
```

Expected: two `running` services, `db` and `redis`.

- [ ] **Step 3: Confirm `uuidv7()` works**

```bash
docker compose exec -T db psql -U root -d local -c 'select uuidv7();'
```

Expected: one UUIDv7 value printed. If Postgres emits `ERROR: function uuidv7() does not exist`, the image is older than 18 — fix `compose.yaml` to `postgres:18` and recreate the container with `docker compose down -v && docker compose up -d`.

- [ ] **Step 4: Commit (only if compose.yaml changed)**

```bash
git add compose.yaml
git commit -m "Pin local postgres to version 18 for native uuidv7()"
```

If `compose.yaml` was already on `postgres:18`, skip the commit.

---

## Task 12: Create `email/` service

**Files:**

- Create: `src/lib/server/services/email/index.ts`
- Create: `src/lib/server/services/email/email.server.ts`
- Create: `src/lib/server/services/email/renderer.server.ts`
- Create: `src/lib/server/services/email/templates/otp-verification.svelte`
- Create: `src/lib/server/services/email/templates/organization-invitation.svelte`
- Create: `src/lib/server/services/email/templates/role-changed.svelte`
- Create: `src/lib/server/services/email/templates/member-removed.svelte`
- Create: `src/lib/server/services/email/emails.server.ts`

**Background:** Single low-level `send()` wraps Resend. `renderer.server.ts` uses `better-svelte-email` to turn a Svelte component into `{ html, text }`. `emails.server.ts` has one function per template. In dev without `RESEND_API_KEY`, emails log to stdout — `pnpm dev` works without secrets.

**Reference:** `/Users/amariuson/dev/projects/blob-never/src/lib/server/services/email/` — read each old file, port with the simplifications listed below. Do **not** copy verbatim.

- [ ] **Step 1: Write `renderer.server.ts`**

Should export `render(Component, props)` returning `Promise<{ html: string; text: string }>`. Use `better-svelte-email`'s `render` helper; port the 20-line wrapper from the old repo. No custom MJML or theme layer — the templates themselves use plain HTML email primitives from `better-svelte-email`.

- [ ] **Step 2: Write `email.server.ts`**

```typescript
import { Resend } from 'resend';

import { env, isDev } from '$lib/server/env.server';
import { logger } from '$services/logger';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

type SendArgs = { to: string; subject: string; html: string; text: string };

export async function send({ to, subject, html, text }: SendArgs) {
	if (!resend) {
		if (!isDev) {
			throw new Error('RESEND_API_KEY missing in production');
		}
		logger.info({ to, subject, textPreview: text.slice(0, 200) }, '[email/dev] email not sent');
		return;
	}

	const { error } = await resend.emails.send({ from: env.EMAIL_FROM, to, subject, html, text });
	if (error) {
		logger.error({ err: error, to, subject }, 'Resend send failed');
		throw new Error(`Email send failed: ${error.message}`);
	}
}
```

- [ ] **Step 3: Port the four templates**

Each template is a `.svelte` file using `better-svelte-email` primitives. Read `../blob-never/src/lib/server/services/email/templates/` for contents and port each with the following simplifications:

- Drop any shared partials directory — inline header/footer HTML directly in each template (only 4 templates).
- Use `env.APP_NAME` in subject lines/sender displays (passed as a prop from `emails.server.ts`, not imported in the `.svelte`).

Templates must accept these props (TypeScript interfaces at the top of each template):

- `otp-verification.svelte`: `{ otp: string; type: string; appName: string }`
- `organization-invitation.svelte`: `{ inviterName: string; inviterEmail: string; organizationName: string; role: string; appName: string }`
- `role-changed.svelte`: `{ userName: string; organizationName: string; oldRole: string; newRole: string; appName: string }`
- `member-removed.svelte`: `{ userName: string; organizationName: string; appName: string }`

- [ ] **Step 4: Write `emails.server.ts`**

```typescript
import { render } from './renderer.server';
import { send } from './email.server';
import OtpVerification from './templates/otp-verification.svelte';
import OrganizationInvitation from './templates/organization-invitation.svelte';
import RoleChanged from './templates/role-changed.svelte';
import MemberRemoved from './templates/member-removed.svelte';

import { env } from '$lib/server/env.server';

export async function sendOtpVerificationEmail(args: { to: string; otp: string; type: string }) {
	const { html, text } = await render(OtpVerification, { ...args, appName: env.APP_NAME });
	await send({ to: args.to, subject: `Your ${env.APP_NAME} verification code`, html, text });
}

export async function sendOrganizationInvitationEmail(args: {
	to: string;
	inviterName: string;
	inviterEmail: string;
	organizationName: string;
	role: string;
}) {
	const { html, text } = await render(OrganizationInvitation, { ...args, appName: env.APP_NAME });
	await send({
		to: args.to,
		subject: `You've been invited to ${args.organizationName}`,
		html,
		text
	});
}

export async function sendRoleChangedEmail(args: {
	to: string;
	userName: string;
	organizationName: string;
	oldRole: string;
	newRole: string;
}) {
	const { html, text } = await render(RoleChanged, { ...args, appName: env.APP_NAME });
	await send({
		to: args.to,
		subject: `Your role in ${args.organizationName} has changed`,
		html,
		text
	});
}

export async function sendMemberRemovedEmail(args: {
	to: string;
	userName: string;
	organizationName: string;
}) {
	const { html, text } = await render(MemberRemoved, { ...args, appName: env.APP_NAME });
	await send({
		to: args.to,
		subject: `You've been removed from ${args.organizationName}`,
		html,
		text
	});
}
```

- [ ] **Step 5: Write `index.ts`**

```typescript
export {
	sendOtpVerificationEmail,
	sendOrganizationInvitationEmail,
	sendRoleChangedEmail,
	sendMemberRemovedEmail
} from './emails.server';
```

- [ ] **Step 6: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/server/services/email/
git commit -m "Add email service: Resend + better-svelte-email with 4 templates"
```

---

## Task 13: Create `polar/` service (client + adapter)

**Files:**

- Create: `src/lib/server/services/polar/index.ts`
- Create: `src/lib/server/services/polar/client.ts`
- Create: `src/lib/server/services/polar/adapter.ts`

**Background:** `client.ts` returns a Polar SDK instance or a dev mock based on `env.POLAR_SERVER`. `adapter.ts` exposes higher-level ops that will be called from better-auth `organizationHooks` — these are needed because the bare `@polar-sh/better-auth` plugin does not automatically provision customers at org-creation.

**Reference:** `/Users/amariuson/dev/projects/blob-never/src/lib/server/services/polar/` — read `adapter.ts`, `client.production.ts`, `client.mock.ts`, port with simplifications:

- Flatten `client.production.ts` + `client.mock.ts` into `client.ts` (single factory function picks between them).
- Keep the adapter's `ensureCustomer`, `syncOrgEntitlements`, webhook dispatch helpers.

- [ ] **Step 1: Write `client.ts`**

```typescript
import { Polar } from '@polar-sh/sdk';

import { env } from '$lib/server/env.server';

export type PolarClient = Polar;

export function createPolarClient(): PolarClient {
	return new Polar({
		accessToken: env.POLAR_ACCESS_TOKEN,
		server: env.POLAR_SERVER
	});
}

export const polarClient = createPolarClient();
```

If the old project shipped a mock for test scenarios, we drop it here — no tests means no mock. For local dev without a Polar account, set `POLAR_SERVER=sandbox` and create a sandbox token; the sandbox is free.

- [ ] **Step 2: Write `adapter.ts`**

Read `../blob-never/src/lib/server/services/polar/adapter.ts` for semantics. Port with:

- Remove `try/catch/log/rethrow` — OTEL captures Polar SDK errors via `polarInstrumentation`.
- Use `logger` from `$services/logger` for one info-level log per op ("ensured polar customer for org X").

**Contract — be strict about what `ensureCustomer` needs.** `organization.email` is nullable in our schema, so `ensureCustomer` cannot assume it's present. Accept a `creatorEmail` as a required parameter separately from `org`; the caller (`initializeOrganization` hook in Task 22) passes the creator member's user email. If neither `org.email` nor `creatorEmail` is available, throw with a clear message — Polar requires an email to attach a customer.

Required exports:

```typescript
// Creates or fetches a Polar customer for the org, keyed by org.id as externalId.
// Returns the Polar customer's external id.
export async function ensureCustomer(
	org: { id: string; name: string; email?: string | null },
	creatorEmail: string // required — caller provides from session.user.email
): Promise<string>;

// Fetches current subscriptions/benefits/meters from Polar for the org's customer,
// writes them into organization.entitlements (including the customerId field).
export async function syncOrgEntitlements(orgId: string): Promise<void>;

// Verifies webhook signature with POLAR_WEBHOOK_SECRET, dispatches to syncOrgEntitlements
// for affected orgs. Returns void; throws on invalid signature.
export async function handlePolarWebhook(headers: Headers, body: string): Promise<void>;
```

Behaviour:

- `ensureCustomer` calls `polarClient.customers.get({ externalId: org.id })`; if 404, creates with `email = org.email ?? creatorEmail`. Never silently falls back to a placeholder — if both are empty, throw.
- `syncOrgEntitlements` reads the customer's active subscriptions/benefits/meters and writes the full `Entitlements` jsonb to `organization.entitlements` (including `customerId` — see Entitlements type update in Task 6).
- `handlePolarWebhook` validates the `polar-signature` header via `env.POLAR_WEBHOOK_SECRET`, branches on `event.type`, and for org-affecting events resolves the `externalId` → `orgId` then calls `syncOrgEntitlements`.

Keep under 180 lines total. Call `requirePolar()` from `env.server` inside the adapter (not at module load) so dev boots without Polar creds.

**Public contract — `polar/index.ts` exports four names:**

```typescript
export { polarClient } from './client'; // Polar SDK instance
export { ensureCustomer, syncOrgEntitlements, handlePolarWebhook } from './adapter';
```

`polarClient` is exported for **read operations only** (e.g. fetching product lists from a pricing page). All **writes** that mutate the `organization.entitlements` jsonb go through adapter functions — callers never call `polarClient.customers.create(...)` directly. This keeps the entitlements invariant (including `customerId`) enforced in one place.

- [ ] **Step 3: Write `index.ts`**

```typescript
export { polarClient } from './client';
export { ensureCustomer, syncOrgEntitlements, handlePolarWebhook } from './adapter';
```

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/services/polar/
git commit -m "Add polar service: client factory + adapter for customer provisioning"
```

---

## Task 14: Create `storage/` service

**Files:**

- Create: `src/lib/server/services/storage/index.ts`
- Create: `src/lib/server/services/storage/storage.server.ts`

- [ ] **Step 1: Write `storage.server.ts`**

```typescript
import {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { env } from '$lib/server/env.server';

const client = new S3Client({
	endpoint: env.S3_ENDPOINT,
	region: env.S3_REGION,
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY_ID,
		secretAccessKey: env.S3_SECRET_ACCESS_KEY
	},
	forcePathStyle: true
});

export async function uploadObject(key: string, body: Uint8Array, contentType?: string) {
	await client.send(
		new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, Body: body, ContentType: contentType })
	);
}

export async function getObject(key: string) {
	const res = await client.send(new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
	return res.Body;
}

export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn = 300) {
	return await getSignedUrl(
		client,
		new PutObjectCommand({ Bucket: env.S3_BUCKET, Key: key, ContentType: contentType }),
		{ expiresIn }
	);
}

export async function getPresignedDownloadUrl(key: string, expiresIn = 300) {
	return await getSignedUrl(client, new GetObjectCommand({ Bucket: env.S3_BUCKET, Key: key }), {
		expiresIn
	});
}

export async function deleteObject(key: string) {
	await client.send(new DeleteObjectCommand({ Bucket: env.S3_BUCKET, Key: key }));
}
```

- [ ] **Step 2: Write `index.ts`**

```typescript
export {
	uploadObject,
	getObject,
	getPresignedUploadUrl,
	getPresignedDownloadUrl,
	deleteObject
} from './storage.server';
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/server/services/storage/
git commit -m "Add storage service: minimal S3 client with presigned URLs"
```

---

## Task 15: Create `features/auth/access-control.ts`

**Files:**

- Create: `src/lib/features/auth/access-control.ts`

**Background:** Defines roles (`owner`, `admin`, `member`, `superadmin`) and permissions using `better-auth/plugins/access`. Consumed by `auth.ts` config (Task 18) and re-exported from the auth feature's public API (Task 34) for UI display.

- [ ] **Step 1: Write the file**

Port `../blob-never/src/lib/features/auth/config/access-control.ts` verbatim in structure. The file is well-designed — keep it as-is, apart from moving it up one directory level (no `config/` folder; the file stands alone).

- [ ] **Step 2: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/features/auth/access-control.ts
git commit -m "Add auth access-control: roles, permissions, UI role definitions"
```

---

## Task 16: Create `features/auth/schemas.ts`

**Files:**

- Create: `src/lib/features/auth/schemas.ts`

- [ ] **Step 1: Write the file**

```typescript
import { z } from 'zod';

export const sendEmailOTPSchema = z.object({
	email: z.email()
});

export const signInWithEmailOTPSchema = z.object({
	email: z.email(),
	otp: z.string().length(8)
});

export const createOrgOnboardingSchema = z.object({
	name: z.string().min(1, 'Organization name is required').max(100, 'Name is too long')
});

export const invitationActionSchema = z.object({
	invitationId: z.string().min(1, 'Invitation ID is required')
});
```

- [ ] **Step 2: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/features/auth/schemas.ts
git commit -m "Add auth Zod schemas for OTP, onboarding, invitations"
```

---

## Task 17: Create `auth/server/session-storage.ts` and `auth/server/polar-plugin.ts`

**Files:**

- Create: `src/lib/features/auth/server/session-storage.ts`
- Create: `src/lib/features/auth/server/polar-plugin.ts`

**Reference:** `../blob-never/src/lib/features/auth/server/adapters/session-storage.ts` and `.../plugins/polar.ts`.

- [ ] **Step 1: Write `session-storage.ts`**

Port the Redis-backed `secondaryStorage` adapter from the reference. Interface required by better-auth:

```typescript
export function createSessionStorage(): {
	get(key: string): Promise<string | null>;
	set(key: string, value: string, ttl?: number): Promise<void>;
	delete(key: string): Promise<void>;
};
```

Uses `redisClient` from `$services/redis`. Keep under 40 lines. Use `SET key value EX ttl` (no script, no lua).

- [ ] **Step 2: Write `polar-plugin.ts`**

Port `.../plugins/polar.ts` but simplify:

- Remove fan-out to multiple plugins if the old file exported several; keep only what's consumed from `auth.ts`.
- Webhook handler delegates to `handlePolarWebhook` from `$services/polar` — no logic here beyond signature verification.

Required export:

```typescript
import { polar } from '@polar-sh/better-auth';
export function createPolarPlugin(): ReturnType<typeof polar>;
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/features/auth/server/session-storage.ts src/lib/features/auth/server/polar-plugin.ts
git commit -m "Add auth session-storage (Redis) and Polar plugin wiring"
```

---

## Task 18: Create `auth/server/api/hooks.ts` as STUBS + `auth/server/auth.ts` config

**Files:**

- Create: `src/lib/features/auth/server/api/hooks.ts` (stubs only)
- Create: `src/lib/features/auth/server/auth.ts`

**Background:** We need a working `auth` instance before `pnpm auth:schema` can emit the reference snapshot in the next task. The lifecycle hooks reference functions that will be filled in later (Task 22); for now they stub as `async () => {}` so the module loads.

- [ ] **Step 1: Write `api/hooks.ts` (stubs)**

**Before writing:** open `node_modules/better-auth/dist/types` (or the package's `.d.ts`) and confirm the `databaseHooks.user.create.before` / `.after` signatures. In better-auth ≥1.4, `before` receives `{ data: user, ctx }` and returns `{ data: newUser } | false | void`, not raw `user`. The types below use `BetterAuthOptions['databaseHooks']['user']['create']['before']` directly, which keeps us aligned with whatever shape the installed version emits — **don't hand-roll the signature**, lift it from the library.

```typescript
// STUB — real implementations land in Task 22. Signatures typed via better-auth's own options type.

import type { BetterAuthOptions } from 'better-auth';

type UserCreate = NonNullable<NonNullable<BetterAuthOptions['databaseHooks']>['user']>['create'];
type BeforeFn = NonNullable<NonNullable<UserCreate>['before']>;
type AfterFn = NonNullable<NonNullable<UserCreate>['after']>;

export const beforeUserCreate: BeforeFn = async (...args) => args[0];
export const afterUserCreate: AfterFn = async () => {};

// Organization hooks (types come from better-auth organization plugin)
export async function initializeOrganization(
	_org: { id: string; name: string; email: string | null },
	_userId: string
): Promise<void> {}

export async function recordOrgDeletion(
	_org: { id: string; name: string },
	_userId: string
): Promise<void> {}

export function validateInvitation(
	_invitation: { role: string },
	_inviter: { userId: string; role: string }
): void {}
```

Note: `validateRoleChange` lives in `queries.ts`, not `hooks.ts` — it reads DB state (current member's role) so it's a query by nature. Stub and real impl both live in queries.

- [ ] **Step 2: Write `api/queries.ts` as a STUB**

`auth.ts`'s `organizationHooks.beforeUpdateMemberRole` imports `getActiveMemberOrNull` and `validateRoleChange` from queries. Create both stubs now so the module compiles:

```typescript
// STUB — real implementations land in Task 20.
export async function getActiveMemberOrNull(): Promise<{ role: string } | null> {
	return null;
}

export async function validateRoleChange(
	_member: { role: string },
	_newRole: string,
	_actorRole: string | undefined
): Promise<void> {}

export async function getSession(): Promise<never> {
	throw new Error('getSession stub — replaced in Task 20');
}

export async function getSessionOrNull(): Promise<null> {
	return null;
}

export async function listUserOrganizations(): Promise<Array<{ id: string; createdAt: Date }>> {
	return [];
}

export async function listUserInvitations(
	_email: string
): Promise<Array<{ id: string; organizationName: string; role: string }>> {
	return [];
}

export async function getUserInvitations(): Promise<
	Array<{ id: string; organizationName: string; role: string }>
> {
	return [];
}
```

These extra stubs cover everything `auth.ts`, `handles.ts`, and remote functions will import in later tasks — keeps the TypeScript surface clean through every intermediate step.

- [ ] **Step 3: Write `api/mutations.ts` as a STUB**

`auth.ts` and `handles.ts` import several mutations — stub all of them at the right signatures so no intermediate task breaks `pnpm check`:

```typescript
// STUB — real implementations land in Task 21.
export async function clearMemberSessions(_userId: string, _orgId: string): Promise<void> {}
export async function setActiveOrganization(_organizationId: string): Promise<void> {}
export async function sendEmailOTP(_data: { email: string }): Promise<void> {}
export async function signInWithEmailOTP(_data: { email: string; otp: string }): Promise<never> {
	throw new Error('stub');
}
export async function signInWithGoogle(): Promise<void> {}
export async function signOutUser(): Promise<never> {
	throw new Error('stub');
}
export async function createOrganizationOnboarding(_data: { name: string }): Promise<never> {
	throw new Error('stub');
}
export async function acceptInvitationOnboarding(_data: { invitationId: string }): Promise<never> {
	throw new Error('stub');
}
export async function declineInvitationOnboarding(_data: { invitationId: string }): Promise<void> {}
export async function impersonateUser(_userId: string): Promise<void> {}
export async function stopImpersonating(): Promise<void> {}
```

- [ ] **Step 4: Write `auth.ts`**

```typescript
import { getRequestEvent } from '$app/server';
import { randomInt } from 'node:crypto';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, emailOTP, organization } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { db } from '$lib/server/db';
import { env } from '$lib/server/env.server';
import {
	sendMemberRemovedEmail,
	sendOrganizationInvitationEmail,
	sendOtpVerificationEmail,
	sendRoleChangedEmail
} from '$services/email';
import { logger } from '$services/logger';

import { ac, roles } from '../access-control';
import {
	afterUserCreate,
	beforeUserCreate,
	initializeOrganization,
	recordOrgDeletion,
	validateInvitation
} from './api/hooks';
import { getActiveMemberOrNull, validateRoleChange } from './api/queries';
import { clearMemberSessions } from './api/mutations';
import { createPolarPlugin } from './polar-plugin';
import { createSessionStorage } from './session-storage';

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, { provider: 'pg' }),
	secondaryStorage: createSessionStorage(),
	session: {
		storeSessionInDatabase: true,
		preserveSessionInDatabase: true
	},
	user: {
		additionalFields: {
			role: { type: 'string', required: false, returned: true, input: false }
		}
	},
	emailAndPassword: { enabled: false },
	rateLimit: { enabled: true, window: 60, max: 5 },
	advanced: {
		database: { generateId: false },
		cookiePrefix: env.COOKIE_PREFIX
	},
	databaseHooks: {
		user: { create: { before: beforeUserCreate, after: afterUserCreate } }
	},
	socialProviders: {
		google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET }
	},
	plugins: [
		admin({ ac, roles, adminRoles: ['superadmin'] }),
		organization({
			ac,
			roles,
			schema: {
				organization: {
					additionalFields: {
						entitlements: { type: 'json', required: true, returned: true, input: false }
					}
				}
			},
			async sendInvitationEmail(data) {
				await sendOrganizationInvitationEmail({
					to: data.email,
					inviterName: data.inviter.user.name,
					inviterEmail: data.inviter.user.email,
					organizationName: data.organization.name,
					role: data.role
				});
			},
			invitationHooks: {
				beforeCreateInvitation: async ({ invitation, inviter }) => {
					validateInvitation(invitation, inviter);
				}
			},
			organizationHooks: {
				afterCreateOrganization: async ({ organization: org, member }) => {
					await initializeOrganization(org, member.userId);
				},
				afterDeleteOrganization: async ({ organization: org, user }) => {
					await recordOrgDeletion(org, user.id);
				},
				beforeUpdateMemberRole: async ({ member, newRole }) => {
					const active = await getActiveMemberOrNull();
					await validateRoleChange(member, newRole, active?.role);
				},
				afterUpdateMemberRole: async ({ user, organization: org, member, previousRole }) => {
					await sendRoleChangedEmail({
						to: user.email,
						userName: user.name,
						organizationName: org.name,
						oldRole: previousRole,
						newRole: member.role
					});
				},
				afterRemoveMember: async ({ user, organization: org }) => {
					await clearMemberSessions(user.id, org.id);
					await sendMemberRemovedEmail({
						to: user.email,
						userName: user.name,
						organizationName: org.name
					});
				}
			}
		}),
		createPolarPlugin(),
		emailOTP({
			otpLength: 8,
			generateOTP() {
				return randomInt(0, 100_000_000).toString().padStart(8, '0');
			},
			async sendVerificationOTP({ email, otp, type }) {
				await sendOtpVerificationEmail({ to: email, otp, type });
			}
		}),
		sveltekitCookies(getRequestEvent)
	],
	onAPIError: {
		onError: (error) => logger.error({ err: error }, 'Auth API error')
	}
});

export type Session = typeof auth.$Infer.Session;
export type ActiveMember = Awaited<ReturnType<typeof auth.api.getActiveMember>>;
```

- [ ] **Step 5: Verify — MUST pass clean**

```bash
pnpm lint
pnpm check
```

Both must pass with zero errors. `auth.ts` compiles cleanly even with the empty-schema placeholder because it only hands `db` to `drizzleAdapter(db, { provider: 'pg' })`, which is loosely typed and does not assert specific tables. The api stubs have no `db.query.X` calls yet.

If `pnpm check` reports a TypeScript error, fix it now — do **not** commit red. The usual culprit is a missing import path or a missing export from a Task 12/15/17 service.

- [ ] **Step 6: Commit**

```bash
git add src/lib/features/auth/
git commit -m "Wire auth config + hook stubs (unblocks pnpm auth:schema)"
```

---

## Task 19: Generate reference schema and hand-write `schema.ts`

**Files:**

- Modify: `package.json` (update `auth:schema` script path)
- Create: `src/lib/server/db/auth.schema.ts` (via `pnpm auth:schema`; reference only, never imported)
- Create: `src/lib/server/db/schema.ts` (hand-written, replacing the Task 4 placeholder)
- Create: `src/lib/server/db/utils.ts`
- Modify: `src/lib/server/db/index.ts`

**Background:** We cannot simply re-export `auth.schema.ts` from our schema — we need `uuidv7()` column defaults, relations, and the custom `auditLog` table, which the CLI doesn't emit. The CLI output serves as a column-shape reference. The `auth:schema` script currently points at the old `src/lib/server/auth.ts` path (deleted in Task 4); update it before running.

- [ ] **Step 1: Update `auth:schema` script in `package.json`**

Replace:

```json
"auth:schema": "better-auth generate --config src/lib/server/auth.ts --output src/lib/server/db/auth.schema.ts --yes"
```

with:

```json
"auth:schema": "better-auth generate --config src/lib/features/auth/server/auth.ts --output src/lib/server/db/auth.schema.ts --yes"
```

- [ ] **Step 2: Generate the reference**

Ensure `.env` (bootstrapped in Task 3) is loaded — the CLI reads `DATABASE_URL` transitively via the auth config's drizzle adapter. If the shell doesn't auto-load `.env`, prefix with `pnpm dotenv` or `dotenv -e .env --`:

```bash
pnpm auth:schema
```

Expected: writes `src/lib/server/db/auth.schema.ts`. This file is reference-only; `drizzle.config.ts` points at `schema.ts`, so `auth.schema.ts` is never imported.

- [ ] **Step 3: Write `src/lib/server/db/utils.ts`**

```typescript
import type { Entitlements } from '$lib/shared/types/entitlements';

import { sql } from 'drizzle-orm';
import { customType, uuid } from 'drizzle-orm/pg-core';

export const uuidv7 = (name: string) => uuid(name).default(sql`uuidv7()`);

export const entitlementsJsonb = customType<{ data: Entitlements; driverData: string }>({
	dataType() {
		return 'jsonb';
	},
	toDriver(value) {
		return JSON.stringify(value);
	},
	fromDriver(value) {
		const v = (typeof value === 'string' ? JSON.parse(value) : value) as Entitlements & {
			updatedAt: string | Date;
		};
		return { ...v, updatedAt: new Date(v.updatedAt) };
	}
});
```

- [ ] **Step 4: Write `src/lib/server/db/schema.ts`**

Hand-write every table mirroring `auth.schema.ts` column names/types/nullability exactly, but using our `uuidv7()` column helper for IDs. Drop `userPreferences`.

**Declaration order matters.** Every `references(() => other.id)` requires `other` to be declared earlier in the file (TypeScript forward-reference resolution). Drizzle's generated SQL uses `ALTER TABLE … ADD CONSTRAINT` for FKs so the DDL itself is ordering-agnostic, but the TS module must still be topologically ordered. Write tables in this exact order:

1. `user` — no FK dependencies.
2. `organization` — no FK dependencies (referenced by session/member/invitation).
3. `session` — references `user`, `organization`.
4. `account` — references `user`.
5. `verification` — no FK dependencies.
6. `member` — references `user`, `organization`.
7. `invitation` — references `user`, `organization`.
8. `auditLog` — references `user` (via `actorId`, `onDelete: 'set null'`). Must come **after** `user`.
9. Type aliases: `BillingAddress`, `AuditAction`.
10. All `relations(...)` declarations (can go in any order — they only consume already-declared tables).

Each table's column list:

- `user`: `id` (uuidv7 PK), `name`, `email` unique, `emailVerified`, `image`, `createdAt`, `updatedAt`, `role`, `banned`, `banReason`, `banExpires`.
- `organization`: `id` (uuidv7 PK), `name`, `slug` unique, `logo`, `email`, `billingAddress` jsonb, `createdAt`, `metadata`, `entitlements` jsonb (`entitlementsJsonb` custom type) with default `defaultEntitlements` from `$lib/shared/types/entitlements`.
- `session`: `id` (uuidv7 PK), `expiresAt`, `token` unique, `createdAt`, `updatedAt`, `ipAddress`, `userAgent`, `userId` → `user.id` onDelete cascade, `impersonatedBy` (text), `activeOrganizationId` → `organization.id` onDelete set null. Index on `userId`.
- `account`: `id` (uuidv7 PK), `accountId`, `providerId`, `userId` → `user.id` onDelete cascade, tokens, timestamps. Index on `userId` + unique index on (`providerId`, `accountId`).
- `verification`: `id` (uuidv7 PK), `identifier`, `value`, `expiresAt`, timestamps. Index on `identifier`.
- `member`: `id` (uuidv7 PK), `organizationId` → `organization.id` cascade, `userId` → `user.id` cascade, `role` default `'member'`, `createdAt`. Indexes + unique index on (`organizationId`, `userId`).
- `invitation`: `id` (uuidv7 PK), `organizationId` → `organization.id` cascade, `email`, `role`, `status` default `'pending'`, `expiresAt`, `createdAt`, `inviterId` → `user.id` cascade. Indexes on `organizationId`, `email`, and `lower(email)`.
- `auditLog`: `id` (uuidv7 PK), `action` typed as `AuditAction`, `actorId` **nullable** uuid → `user.id` `onDelete: 'set null'` (the column must be nullable or the FK action fails at runtime — the old schema got this wrong with `.notNull()` + `set null`), `targetType` (not null), `targetId` (not null, uuid), `metadata` jsonb (nullable), `ipAddress` (nullable), `userAgent` (nullable), `createdAt` (not null, default now). Indexes on `actorId` and `createdAt`.

`AuditAction` union: `'impersonation.start' | 'impersonation.stop' | 'user.ban' | 'user.unban' | 'user.role_change' | 'user.sessions_revoked' | 'organization.delete'`.

Relations to declare: `userRelations`, `sessionRelations`, `accountRelations`, `organizationRelations`, `memberRelations`, `invitationRelations`, `auditLogRelations`.

Imports: `uuidv7` and `entitlementsJsonb` from `./utils`; `defaultEntitlements` from `$lib/shared/types/entitlements`.

- [ ] **Step 5: Update `src/lib/server/db/index.ts`**

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '$lib/server/env.server';

import * as schema from './schema';

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
```

- [ ] **Step 6: Generate migration**

```bash
pnpm db:generate
```

Expected: writes a new migration file into `drizzle/` (or wherever `drizzle.config.ts` directs). Review the SQL and confirm:

1. Every `id` column reads `DEFAULT uuidv7()` (Postgres 18 native). If any column is `TEXT` instead of `UUID`, stop and fix `schema.ts`.
2. Foreign-key constraints appear as `ALTER TABLE … ADD CONSTRAINT …` statements at the end of the file (Drizzle's standard output). They should resolve cleanly regardless of DDL order since `ALTER TABLE` fires after all tables exist.
3. No reference to `user_preferences` — that table was dropped.

- [ ] **Step 7: Apply migration**

`.env` was bootstrapped in Task 3 with `DATABASE_URL=postgres://root:mysecretpassword@localhost:5432/local` — matching `compose.yaml`. Confirm the DB is up (Task 11) and run:

```bash
pnpm db:migrate
```

Expected: "migration applied" or similar. Verify the tables exist:

```bash
docker compose exec -T db psql -U root -d local -c '\dt'
```

You should see: `user`, `session`, `account`, `verification`, `organization`, `member`, `invitation`, `audit_log`.

- [ ] **Step 8: Verify**

```bash
pnpm lint
pnpm check
```

Both must pass clean — this is the first checkpoint where `auth.ts` compiles all the way through because `db` is now fully typed.

- [ ] **Step 9: Commit**

```bash
git add package.json src/lib/server/db/ drizzle/
git commit -m "Hand-write schema.ts with uuidv7() defaults; fix auth:schema path; generate initial migration"
```

---

## Task 20: Replace `api/queries.ts` stub with real implementation

**Files:**

- Modify: `src/lib/features/auth/server/api/queries.ts` (replace stub)

**Reference:** `../blob-never/src/lib/features/auth/server/api/queries/user.ts` and `.../queries/organization.ts`. Merge them into one file.

- [ ] **Step 1: Write the full `api/queries.ts`**

Required exports:

```typescript
export async function getSession(): Promise<Session>; // throws if no session
export async function getSessionOrNull(): Promise<Session | null>;
export async function getActiveMember(): Promise<ActiveMember>;
export async function getActiveMemberOrNull(): Promise<ActiveMember | null>;
export async function listUserOrganizations(): Promise<Array<{ id: string; createdAt: Date }>>;
export async function listUserInvitations(email: string): Promise<
	Array<{
		id: string;
		organizationName: string;
		role: string;
	}>
>;
export async function getAffectedSessions(
	userId: string,
	orgId: string
): Promise<Array<{ id: string }>>;
export async function validateRoleChange(
	member: { role: string },
	newRole: string,
	actorRole: string | undefined
): Promise<void>;
```

Implementation notes:

- `getSessionOrNull` caches on `event.locals.session` (set by the setup handle) — if already present, return directly; otherwise call `auth.api.getSession({ headers })` and cache.
- Same pattern for `getActiveMember`/`getActiveMemberOrNull` using `event.locals.activeMember`.
- `validateRoleChange` lives here (not `hooks.ts`) because it's a query — it reads permissions tables. Refer to the old `beforeUpdateMemberRole` logic.
- `listUserInvitations(email)` joins `invitation` ↔ `organization` where `invitation.email = lower(email)` and `status = 'pending'`.
- Remove `invariant(...)` wrappers unless the old implementation genuinely needed them — better-auth already throws on missing session.

**Onboarding flow — explicit decision (matches old project).** We do **not** auto-create an organization for new users without invitations. The flow is:

1. User signs in for the first time → no org membership → redirect handle sends to `/onboarding`.
2. On `/onboarding`: if invitations exist for their email, they can accept/decline; otherwise they explicitly create an org via the onboarding form.
3. Org creation is a deliberate action by the user, so they name it (and trigger `ensureCustomer` with a real name) instead of landing on a "Untitled Organization" auto-creation.

Don't add any "skip onboarding → auto-create" shortcut. It's tempting for better UX, but it silently provisions a Polar customer the user didn't ask for and creates orphan orgs when a user never returns.

Port from the reference with these simplifications; keep under 150 lines total.

- [ ] **Step 2: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/features/auth/server/api/queries.ts
git commit -m "Implement auth queries: session, active member, orgs, invitations"
```

---

## Task 21: Replace `api/mutations.ts` stub with real implementation

**Files:**

- Modify: `src/lib/features/auth/server/api/mutations.ts` (replace stub)

**Reference:** Merge these old files:

- `.../mutations/auth.ts` (sendEmailOTP, signInWithEmailOTP, signInWithGoogle)
- `.../mutations/user.ts` (signOutUser, clearMemberSessions)
- `.../mutations/onboarding.ts` (createOrganizationOnboarding, acceptInvitationOnboarding, declineInvitationOnboarding)
- `.../mutations/organization.ts` (setActiveOrganization)
- `.../api/impersonation.ts` (impersonateUser, stopImpersonating)

- [ ] **Step 1: Write the full `api/mutations.ts`**

Required exports and their purposes (signatures from the spec's §4 preserved behaviour):

```typescript
export async function sendEmailOTP(data: z.infer<typeof sendEmailOTPSchema>): Promise<void>;
export async function signInWithEmailOTP(
	data: z.infer<typeof signInWithEmailOTPSchema>
): Promise<never>; // redirects
export async function signInWithGoogle(): Promise<void>;
export async function signOutUser(): Promise<never>; // redirects to /sign-in
export async function createOrganizationOnboarding(
	data: z.infer<typeof createOrgOnboardingSchema>
): Promise<never>;
export async function acceptInvitationOnboarding(
	data: z.infer<typeof invitationActionSchema>
): Promise<never>;
export async function declineInvitationOnboarding(
	data: z.infer<typeof invitationActionSchema>
): Promise<void>;
export async function setActiveOrganization(organizationId: string): Promise<unknown>;
export async function clearMemberSessions(userId: string, orgId: string): Promise<void>;
export async function impersonateUser(userId: string): Promise<unknown>;
export async function stopImpersonating(): Promise<unknown>;
```

Simplifications to apply:

- Remove all `try { await auth.api.X(...) } catch (err) { logger.error(...); throw err }` — OTEL captures. **Do not swallow errors silently** anywhere else.
- **Only explicit exception:** `clearMemberSessions` may warn-log-and-continue on Redis-delete failures because the DB-level clear of `activeOrganizationId` is the source of truth — Redis is just a cache. Comment the line with the justification.
- Expected user-facing failures → `error(status, { code, message })`. Codes per the spec: `'VALIDATION'` (400), `'FORBIDDEN'` (403), `'NOT_FOUND'` (404), `'TOO_MANY_REQUESTS'` (429).
- Unexpected failures → bubble. Never wrap in a try/catch that re-throws.
- Collapse adjacent "doing X" + "did X" log pairs into one.
- `getRequestEvent()` is called at most once per function.

Port from references; total file around 200 lines.

- [ ] **Step 2: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/features/auth/server/api/mutations.ts
git commit -m "Implement auth mutations: OTP, OAuth, onboarding, impersonation"
```

---

## Task 22: Replace `api/hooks.ts` stub with real implementation

**Files:**

- Modify: `src/lib/features/auth/server/api/hooks.ts` (replace stub)

**Reference:** Merge these old files:

- `.../api/database.hooks.ts` (beforeUserCreate, afterUserCreate)
- `.../api/organization.hooks.ts` (initializeOrganization, recordOrgDeletion)
- `.../api/polar.hooks.ts` (if present; the afterCreateOrganization Polar call)
- `.../logic/validation.ts` (validateInvitation — inlined here since it's a single ~15-line function called from one place)

- [ ] **Step 1: Write the full `api/hooks.ts`**

Required exports (all referenced from `auth.ts`):

```typescript
export const beforeUserCreate: ...;          // same shape as the stub from Task 18
export const afterUserCreate: ...;
export async function initializeOrganization(
	org: { id: string; name: string; email: string | null },
	userId: string
): Promise<void>;
export async function recordOrgDeletion(
	org: { id: string; name: string },
	userId: string
): Promise<void>;
export function validateInvitation(
	invitation: { role: string },
	inviter: { userId: string; role: string }
): void;
```

Notes:

- `initializeOrganization` calls `ensureCustomer(org)` from `$services/polar` and records the returned external customer id onto `organization.entitlements.customerId` (via drizzle update). Store `customerId` inside the entitlements jsonb to avoid a schema change.
- `recordOrgDeletion` writes an `auditLog` row with `action: 'organization.delete'`.
- `validateInvitation` — admin cannot invite owner; only owner can invite admin; match the old `logic/validation.ts` rules exactly.
- **`validateRoleChange` does NOT live here.** It's a query (reads current member roles from the DB) and stays in `queries.ts` — see Task 20. Don't import it into `hooks.ts` or re-declare it.

- [ ] **Step 2: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/features/auth/server/api/hooks.ts
git commit -m "Implement auth lifecycle hooks: user create, org init/delete, invitation validation"
```

---

## Task 23: Create `auth/server/handles.ts` and wire `hooks.server.ts`

**Files:**

- Create: `src/lib/features/auth/server/handles.ts`
- Modify: `src/lib/features/auth/server/index.ts` (create if absent)
- Modify: `src/hooks.server.ts`
- Modify: `src/app.d.ts`

**Reference:** `../blob-never/src/lib/features/auth/server/handles/{context,redirect,auth}.ts` — merge into one file.

- [ ] **Step 1: Write `handles.ts`**

```typescript
import { type Handle, redirect } from '@sveltejs/kit';
import { building } from '$app/environment';

import { svelteKitHandler } from 'better-auth/svelte-kit';
import { uuidv7 } from 'uuidv7';

import { logger } from '$services/logger';

import { auth } from './auth';
import { setActiveOrganization } from './api/mutations';
import { getSessionOrNull, listUserOrganizations } from './api/queries';

export function createSetupHandle(): Handle {
	return async ({ event, resolve }) => {
		event.locals.context = { requestId: uuidv7() };
		const session = await getSessionOrNull();
		event.locals.context.userId = session?.user.id;
		event.locals.context.orgId = session?.session.activeOrganizationId ?? undefined;
		return resolve(event);
	};
}

export function createRedirectHandle(): Handle {
	return async ({ event, resolve }) => {
		const { userId, orgId } = event.locals.context;

		if (userId && !orgId) {
			const orgs = await listUserOrganizations();
			if (orgs.length > 0) {
				const sorted = [...orgs].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				const selected = sorted[0];
				logger.info({ orgId: selected.id }, 'Auto-selecting most recent org');
				await setActiveOrganization(selected.id);
				event.locals.context.orgId = selected.id;
			} else if (event.url.pathname !== '/onboarding') {
				redirect(302, '/onboarding');
			}
		}

		if (event.url.pathname === '/onboarding' && !userId) {
			redirect(302, '/sign-in');
		}

		if (event.route.id?.startsWith('/(auth)') && userId) {
			const isOnboardingWithoutOrg =
				event.url.pathname === '/onboarding' && !event.locals.context.orgId;
			if (!isOnboardingWithoutOrg) redirect(302, '/');
		}

		if (event.route.id?.startsWith('/(app)') && !userId) {
			redirect(302, '/sign-in');
		}

		return resolve(event);
	};
}

export function createAuthHandle(): Handle {
	return ({ event, resolve }) => svelteKitHandler({ event, resolve, auth, building });
}
```

- [ ] **Step 2: Write `src/lib/features/auth/server/index.ts`**

```typescript
export { createAuthHandle, createRedirectHandle, createSetupHandle } from './handles';
export { getSession, getSessionOrNull } from './api/queries';
export { impersonateUser, stopImpersonating } from './api/mutations';
```

- [ ] **Step 3: Update `src/hooks.server.ts`**

```typescript
import { sequence } from '@sveltejs/kit/hooks';

import { createAuthHandle, createRedirectHandle, createSetupHandle } from '$features/auth/server';

export const handle = sequence(createSetupHandle(), createRedirectHandle(), createAuthHandle());
```

- [ ] **Step 4: Update `src/app.d.ts`**

```typescript
import type { ActiveMember, Session } from '$features/auth';

declare global {
	namespace App {
		interface Locals {
			session: Session | null;
			activeMember: ActiveMember | null;
			context: {
				requestId: string;
				userId?: string;
				orgId?: string;
			};
		}
	}
}

export {};
```

Note: This import will resolve after Task 26 creates `src/lib/features/auth/index.ts`. Lint/check may briefly fail here — if it does, defer the commit to after Task 26 and merge the `app.d.ts` change into that commit. Otherwise commit now.

- [ ] **Step 5: Verify**

```bash
pnpm lint
pnpm check
```

If the only error is the unresolved `$features/auth` types in `app.d.ts`, hold this change in the staging area and bundle it with Task 26.

- [ ] **Step 6: Commit (if clean)**

```bash
git add src/lib/features/auth/server/handles.ts src/lib/features/auth/server/index.ts src/hooks.server.ts src/app.d.ts
git commit -m "Add auth handles (setup/redirect/auth) and wire hooks.server + app.d.ts"
```

---

## Task 24: Create `shared/form/form-handler.svelte.ts`

**Files:**

- Create: `src/lib/shared/form/form-handler.svelte.ts`

- [ ] **Step 1: Port the file**

Port `../blob-never/src/lib/shared/form/form-handler.svelte.ts` verbatim in behaviour. Keep the two exports: `formHandler` (primary) and `createConfirmation` (used by future delete flows). No simplifications — this is already tight.

- [ ] **Step 2: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/shared/form/form-handler.svelte.ts
git commit -m "Add shared form-handler helper for remote forms"
```

---

## Task 25: Create auth `components/` (layout + forms + auth + onboarding)

**Files:**

- Create: `src/lib/features/auth/components/layout.svelte`
- Create: `src/lib/features/auth/components/auth.svelte`
- Create: `src/lib/features/auth/components/onboarding.svelte`
- Create: `src/lib/features/auth/components/forms/google-form.svelte`
- Create: `src/lib/features/auth/components/forms/email-form.svelte`
- Create: `src/lib/features/auth/components/forms/otp-form.svelte`

**Reference:** `../blob-never/src/lib/features/auth/components/` — read each file and port with simplifications:

- Drop `TEST_OTP` branching in `otp-form.svelte` if any — there is no test mode.
- Keep the `formHandler` wrapping pattern.

**Import rule for components** (don't get this wrong):

- Components **inside** a feature import its remotes via the **internal** relative path (`../auth.remote`). This is fine and intentional — they're part of the same module, not external consumers.
- Components **outside** a feature (routes, other features) always import via the public API (`$features/auth`). Never reach into `$features/auth/auth.remote` or `$features/auth/components/...` from outside.
- Only re-export a symbol from `$features/auth/index.ts` if an external caller actually needs it. Don't re-export the internal forms used only by `auth.svelte` / `onboarding.svelte`.

- [ ] **Step 1: Write each component**

Read each reference file; re-derive in this project. Components should live in these paths with these imports structure:

- `layout.svelte` — card wrapper accepting `heading`, `subHeading`, `children` snippet, optional `below` snippet. Uses `Card` from `$lib/shared/components/ui/card`.
- `forms/google-form.svelte` — uses `signInWithGoogleForm` from `../auth.remote` (will exist after Task 26).
- `forms/email-form.svelte` — uses `sendEmailOTPForm` and a `setEmail` callback prop.
- `forms/otp-form.svelte` — uses `signInWithEmailOTPForm`, binds `email` prop.
- `auth.svelte` — composes `GoogleForm` + either `EmailForm` or `OtpForm` based on local `email` state.
- `onboarding.svelte` — lists invitations via `getUserInvitationsQuery`, provides `acceptInvitationForm.for(id)` per invitation, and a `createOrgOnboardingForm` to create a new org.

All components use Svelte 5 runes (`$state`, `$props`, `$derived`). `await` expressions at top-level of components use `experimental.async` which is already enabled.

- [ ] **Step 2: Verify**

Cannot fully verify until `auth.remote.ts` exists (Task 26). If `pnpm check` reports missing exports from `../auth.remote`, hold these edits unstaged and bundle with Task 26.

- [ ] **Step 3: Commit (or hold)**

If green:

```bash
git add src/lib/features/auth/components/
git commit -m "Add auth components: layout, auth, onboarding, forms"
```

Otherwise hold and bundle into Task 26.

---

## Task 26: Create `auth.remote.ts` and `features/auth/index.ts`

**Files:**

- Create: `src/lib/features/auth/auth.remote.ts`
- Create: `src/lib/features/auth/index.ts`

**Reference:** `../blob-never/src/lib/features/auth/remote/index.ts`. Port verbatim but update import paths to the flatter layout.

- [ ] **Step 1: Write `auth.remote.ts`**

```typescript
import { error, invalid } from '@sveltejs/kit';
import { form, query } from '$app/server';

import { APIError } from 'better-auth';
import { z } from 'zod';

import {
	createOrgOnboardingSchema,
	invitationActionSchema,
	sendEmailOTPSchema,
	signInWithEmailOTPSchema
} from './schemas';
import {
	acceptInvitationOnboarding,
	createOrganizationOnboarding,
	declineInvitationOnboarding,
	sendEmailOTP,
	signInWithEmailOTP,
	signInWithGoogle,
	signOutUser
} from './server/api/mutations';
import { getUserInvitations, getSession } from './server/api/queries';

export const signOutUserForm = form(signOutUser);

export const getSessionQuery = query(getSession);

export const getUserInvitationsQuery = query(getUserInvitations);

export const createOrgOnboardingForm = form(
	createOrgOnboardingSchema,
	createOrganizationOnboarding
);

export const acceptInvitationForm = form(invitationActionSchema, acceptInvitationOnboarding);

export const declineInvitationForm = form(invitationActionSchema, declineInvitationOnboarding);

export const sendEmailOTPForm = form(sendEmailOTPSchema, sendEmailOTP);

export const signInWithEmailOTPForm = form(signInWithEmailOTPSchema, async (data, issue) => {
	try {
		await signInWithEmailOTP(data);
	} catch (err) {
		if (err instanceof APIError) {
			if (err.body?.code === 'TOO_MANY_ATTEMPTS') {
				error(429, { code: 'TOO_MANY_REQUESTS', message: 'Too many attempts!' });
			}
			invalid(issue.otp(err.body?.message ?? 'Something went wrong!'));
		}
		throw err;
	}
});

export const signInWithGoogleForm = form(z.object({}), signInWithGoogle);
```

Note: `getUserInvitations` must exist on `queries.ts` (Task 20). If it doesn't, add it now — it composes `getSession` + `listUserInvitations(session.user.email)` and returns the list.

- [ ] **Step 2: Write `features/auth/index.ts`**

Per CLAUDE.md (lines 101, 205), remote functions **must** be re-exported from the feature's client-safe `index.ts` so that routes and other features never import from `$features/auth/auth.remote` directly.

```typescript
export { default as Auth } from './components/auth.svelte';
export { default as Layout } from './components/layout.svelte';
export { default as Onboarding } from './components/onboarding.svelte';
export {
	createOrgOnboardingSchema,
	invitationActionSchema,
	sendEmailOTPSchema,
	signInWithEmailOTPSchema
} from './schemas';
export { assignableRoles, roleDefinitions } from './access-control';
export {
	acceptInvitationForm,
	createOrgOnboardingForm,
	declineInvitationForm,
	getSessionQuery,
	getUserInvitationsQuery,
	sendEmailOTPForm,
	signInWithEmailOTPForm,
	signInWithGoogleForm,
	signOutUserForm
} from './auth.remote';
export type { ActiveMember, Session } from './server/auth';
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

All auth-feature references now resolve. If Task 23 or 25 were held, include those files in this commit.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add auth remote functions and public API; close auth feature"
```

---

## Task 27: Create `(auth)` routes

**Files:**

- Create: `src/routes/(auth)/sign-in/+page.svelte`
- Create: `src/routes/(auth)/sign-up/+page.svelte`
- Create: `src/routes/(auth)/onboarding/+page.svelte`

- [ ] **Step 1: Write `sign-in/+page.svelte`**

```svelte
<script>
	import { Auth, Layout } from '$features/auth';
	import { Button } from '$lib/shared/components/ui/button';
</script>

<Layout heading="Welcome" subHeading="Choose how you'd like to sign in">
	<Auth />
	{#snippet below()}
		<p class="text-center text-sm text-accent-foreground">
			Don't have an account?
			<Button variant="link" class="px-2" size="lg" href="/sign-up">Sign up</Button>
		</p>
	{/snippet}
</Layout>
```

- [ ] **Step 2: Write `sign-up/+page.svelte`**

Same as `sign-in/+page.svelte` but:

- `heading="Create an account"`, `subHeading="Get started in seconds"`.
- `below` snippet points at `/sign-in` instead of `/sign-up`.

- [ ] **Step 3: Write `onboarding/+page.svelte`**

```svelte
<script>
	import { Layout, Onboarding } from '$features/auth';
</script>

<Layout heading="Welcome aboard" subHeading="Create your organization or accept an invitation">
	<Onboarding />
</Layout>
```

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/routes/\(auth\)/
git commit -m "Add (auth) routes: sign-in, sign-up, onboarding"
```

---

## Task 28: Build admin feature (server)

**Files:**

- Create: `src/lib/features/admin/server/api.ts`
- Create: `src/lib/features/admin/server/index.ts`

**Reference:** `../blob-never/src/lib/features/admin/server/api/{queries,mutations}.ts` — merge into one file.

- [ ] **Step 1: Write `server/api.ts`**

Required exports:

```typescript
export async function requireSuperadmin(): Promise<Session>;
export function guardSelfAction(session: Session, targetUserId: string, action: string): void;
export async function getUserForImpersonation(userId: string): Promise<
	| {
			role: string | null;
			name: string;
			email: string;
			banned: boolean | null;
	  }
	| undefined
>;
export async function getImpersonationStatus(): Promise<{
	isImpersonating: true;
	impersonatorId: string;
	viewingAs: { id: string; name: string; email: string };
} | null>;
export async function logAuditEvent(params: {
	action: AuditAction;
	actorId: string;
	targetType: 'user' | 'organization' | 'session';
	targetId: string;
	metadata?: Record<string, unknown>;
	request: Request;
}): Promise<void>;
export async function startImpersonation(userId: string): Promise<never>; // redirects to /
export async function stopImpersonation(): Promise<void>;
```

Simplifications vs old:

- Single log line per op, not one at start + one at end.
- No `try/catch/log/rethrow`.
- `ipAddress` / `userAgent` extraction via `getClientIp(request)` helper from `$lib/shared/utils`.

Keep under 130 lines.

- [ ] **Step 2: Write `server/index.ts`**

```typescript
export {
	getImpersonationStatus,
	guardSelfAction,
	logAuditEvent,
	requireSuperadmin,
	startImpersonation,
	stopImpersonation
} from './api';
```

- [ ] **Step 3: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/features/admin/server/
git commit -m "Add admin server API: impersonation, audit log, superadmin gate"
```

---

## Task 29: Build admin feature (client-safe + remote + components)

**Files:**

- Create: `src/lib/features/admin/admin.remote.ts`
- Create: `src/lib/features/admin/components/impersonation-banner.svelte`
- Create: `src/lib/features/admin/components/stop-impersonation-form.svelte`
- Create: `src/lib/features/admin/index.ts`

- [ ] **Step 1: Write `admin.remote.ts`**

```typescript
import { form, query } from '$app/server';

import { getImpersonationStatus, stopImpersonation } from './server/api';

export const stopImpersonationForm = form(stopImpersonation);

export const getImpersonationStatusQuery = query(getImpersonationStatus);
```

- [ ] **Step 2: Write `stop-impersonation-form.svelte`**

Port `../blob-never/src/lib/features/admin/components/form/stop-impersonation-form.svelte` — flat location, no subfolder.

- [ ] **Step 3: Write `impersonation-banner.svelte`**

Port `../blob-never/src/lib/features/admin/components/impersonation-banner.svelte` verbatim in behaviour. Uses `runed` `ElementSize` for banner height, renders red-stripe banner above children when impersonating.

- [ ] **Step 4: Write `index.ts`**

```typescript
export { default as ImpersonationBanner } from './components/impersonation-banner.svelte';
```

- [ ] **Step 5: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/features/admin/
git commit -m "Add admin client API, banner component, stop-impersonation form"
```

---

## Task 30: Build `(app)` shell and root route

**Files:**

- Create: `src/lib/shared/components/sidebar/app-sidebar.svelte`
- Create: `src/routes/(app)/+layout.svelte`
- Create: `src/routes/(app)/+page.svelte`

- [ ] **Step 1: Write `app-sidebar.svelte`**

Minimal shell. **No hardcoded product name** — read from `$env/dynamic/public` which comes from `PUBLIC_APP_NAME` in `.env` (added in Task 3).

```svelte
<script lang="ts">
	import { env } from '$env/dynamic/public';

	import { formHandler } from '$lib/shared/form/form-handler.svelte';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';
	import { Button } from '$lib/shared/components/ui/button';

	type Props = {
		user: { name: string; email: string; avatar: string };
		isAdmin: boolean;
		signOutUserForm: Parameters<typeof formHandler>[0];
	};

	let { user, isAdmin, signOutUserForm }: Props = $props();

	const appName = env.PUBLIC_APP_NAME;
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="px-2 py-1 text-sm font-semibold">{appName}</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- Nav items land when DMC features exist -->
	</Sidebar.Content>
	<Sidebar.Footer>
		<div class="flex flex-col gap-1 px-2 py-2">
			<div class="truncate text-sm font-medium">{user.name}</div>
			<div class="truncate text-xs text-muted-foreground">{user.email}</div>
			{#if isAdmin}
				<Button variant="ghost" size="sm" class="mt-1 justify-start">Admin</Button>
			{/if}
			<form {...formHandler(signOutUserForm)}>
				<Button variant="ghost" size="sm" class="mt-1 w-full justify-start" type="submit">
					Sign out
				</Button>
			</form>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
```

Note: `$env/dynamic/public` only exposes env vars prefixed `PUBLIC_` — that's why Task 3 adds `PUBLIC_APP_NAME` in addition to the server-side `APP_NAME`.

- [ ] **Step 2: Write `(app)/+layout.svelte`**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	import { ImpersonationBanner } from '$features/admin';
	import { getSessionQuery, signOutUserForm } from '$features/auth';
	import AppSidebar from '$lib/shared/components/sidebar/app-sidebar.svelte';
	import * as Sidebar from '$lib/shared/components/ui/sidebar/index.js';

	let { children }: { children: Snippet } = $props();

	const session = $derived(await getSessionQuery());
	const user = $derived({
		name: session.user.name,
		email: session.user.email,
		avatar: session.user.image ?? ''
	});
	const isAdmin = $derived(session.user.role === 'superadmin');
</script>

<ImpersonationBanner>
	<Sidebar.Provider>
		<AppSidebar {user} {isAdmin} {signOutUserForm} />
		<Sidebar.Inset>
			<header
				class="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-2 group-data-[active=true]/banner:static"
			>
				<div class="flex h-8 items-center gap-2 px-1">
					<Sidebar.Trigger />
				</div>
			</header>
			<div class="flex flex-1 flex-col gap-4">
				{@render children()}
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</ImpersonationBanner>
```

- [ ] **Step 3: Write `(app)/+page.svelte`**

No hardcoded product name; read from `$env/dynamic/public`.

```svelte
<script lang="ts">
	import { env } from '$env/dynamic/public';
</script>

<div class="p-8">
	<h1 class="text-2xl font-semibold">Welcome</h1>
	<p class="mt-2 text-sm text-muted-foreground">Your {env.PUBLIC_APP_NAME} workspace is ready.</p>
</div>
```

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/shared/components/sidebar/ src/routes/\(app\)/
git commit -m "Add (app) shell with sidebar, impersonation banner, minimal home"
```

---

## Task 31: Build `(dev)/email-preview`

**Files:**

- Create: `src/routes/(dev)/+layout.server.ts`
- Create: `src/routes/(dev)/email-preview/[...email]/+page.server.ts`
- Create: `src/routes/(dev)/email-preview/[...email]/+page.svelte`

- [ ] **Step 1: Write `(dev)/+layout.server.ts`**

```typescript
import { error } from '@sveltejs/kit';

import { isProd } from '$lib/server/env.server';

export const load = () => {
	if (isProd) error(404);
	return {};
};
```

- [ ] **Step 2: Port `email-preview/[...email]/+page.server.ts`**

Reference `../blob-never/src/routes/(dev)/email-preview/[...email]/+page.server.ts`. The load function:

- Reads `params.email` as a slug (e.g. `otp-verification`).
- Dynamically imports the matching template from `$services/email/templates/...svelte`.
- Renders it via `$services/email/renderer.server.render(...)` with a fixed stub props object per template.
- Returns `{ html, text, subject }`.

If the path is unknown, `error(404)`.

- [ ] **Step 3: Write `+page.svelte`**

Renders the returned `html` inside an iframe via `srcdoc={data.html}`, with a small header showing the subject and a link list to all templates.

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/routes/\(dev\)/
git commit -m "Add (dev)/email-preview route for template iteration in dev"
```

---

## Task 32: Final smoke test

**Files:** none.

**Substitute for tests.** Since the user excluded automated tests, each item below is a manual check with a concrete expected output. Run them in order; stop and fix before continuing if any fails.

- [ ] **Step 1: Full lint + check + build**

```bash
pnpm lint
pnpm check
pnpm build
```

All three must pass. OTEL auto-instrumentation warnings about `import-in-the-middle` during build are expected — do not silence them unless the build fails.

- [ ] **Step 2: Schema drift check**

Re-run the generator and diff its output against the hand-written schema:

```bash
pnpm auth:schema
git diff --stat src/lib/server/db/auth.schema.ts
```

If `auth.schema.ts` has changed since the last commit, a better-auth update has shifted the expected shape. Open it alongside `schema.ts` and confirm every table/column still matches. If a new column appears, add it to `schema.ts` + regenerate the migration. Revert the `auth.schema.ts` change only after confirming parity.

- [ ] **Step 3: Migration sanity**

```bash
docker compose exec -T db psql -U root -d local -c '\d+ audit_log'
```

Expected: `action` is `text` (typed via `AuditAction` union at the TS layer), `actor_id` is `uuid` and **nullable** (FK `set null` requires it), `created_at` has `default now()`, indexes on `actor_id` and `created_at` exist. Repeat for `user`, `organization`, `session`, `member`, `invitation` — spot-check FK constraints.

- [ ] **Step 4: Dev boot without optional secrets**

In a terminal, unset optional vars and boot:

```bash
unset GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET RESEND_API_KEY \
      POLAR_ACCESS_TOKEN POLAR_WEBHOOK_SECRET \
      AXIOM_TOKEN AXIOM_DATASET_LOGS AXIOM_DATASET_TRACES \
      S3_ENDPOINT S3_REGION S3_BUCKET S3_ACCESS_KEY_ID S3_SECRET_ACCESS_KEY
pnpm dev
```

Expected: server boots, logs go to stdout via pino-pretty (because `AXIOM_*` is unset → logger falls back to pretty), no crash at startup. If boot crashes, a service is reading an optional env var at module-load rather than via `requireX()`. Fix it before moving on.

- [ ] **Step 5: Auth route render**

With the dev server from Step 4 still running, restore `.env` (to get Google creds) and reload:

```bash
cp .env.example .env
# …fill in real values for local dev…
pnpm dev
```

Visit `http://localhost:5173`. Expected: redirect to `/sign-in`. The page shows a "Sign in with Google" button and an email input. No console errors in the browser. Navigate to `/sign-up` and `/onboarding` directly — both render their shells (onboarding redirects to `/sign-in` when not logged in, per the redirect handle).

- [ ] **Step 6: Log + trace sanity**

With `AXIOM_*` set, load the site, then query Axiom:

- Logs dataset (`AXIOM_DATASET_LOGS`): expect at least one record with `service: env.OTEL_SERVICE_NAME` and a recent timestamp.
- Traces dataset (`AXIOM_DATASET_TRACES`): expect a trace with `service.name: env.OTEL_SERVICE_NAME` and an HTTP server span for `GET /sign-in`.

If no record appears after 30 seconds, check: `requireAxiom()` was called (grep pino transport config), network can reach `api.axiom.co`, token + dataset names match what's in the Axiom UI.

- [ ] **Step 7: Commit (if any incidental cleanups were needed)**

```bash
git add -A
git commit -m "Fix <X> found during smoke test"
```

Otherwise skip.

---

## Task 33: Push and open PR

**Files:** none.

- [ ] **Step 1: Push**

```bash
git push -u origin feat/dmc-auth-admin-migration
```

- [ ] **Step 2: Open PR**

```bash
gh pr create --title "Port auth + admin features from blob-never" --body "$(cat <<'EOF'
## Summary
- Port auth feature (email OTP + Google OAuth, organization plugin, admin plugin with superadmin impersonation) from `../blob-never` as a fresh rewrite applying the simplifications in the spec
- Add services layer: env, lifecycle, logger (pino→Axiom), tracing (OTEL→Axiom), redis, email (Resend+better-svelte-email), polar (client+adapter), storage (S3)
- Hand-written drizzle schema with Postgres 18 native `uuidv7()` defaults; `auth.schema.ts` is a CI-verifiable reference snapshot only
- Admin feature: impersonation banner, audit log, superadmin gate
- `(auth)` routes (sign-in, sign-up, onboarding), minimal `(app)` shell, `(dev)/email-preview` dev-only route

## Spec & plan
- Spec: `docs/superpowers/specs/2026-04-21-dmc-migration-design.md`
- Plan: `docs/superpowers/plans/2026-04-21-dmc-migration.md`

## Test plan
- [ ] `pnpm lint` passes
- [ ] `pnpm check` passes
- [ ] `pnpm build` passes
- [ ] Dev server boots; `/` redirects to `/sign-in`; auth forms render
- [ ] Postgres shows expected tables with `uuidv7()` defaults
- [ ] Axiom receives a trace for the first request after `pnpm dev`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review checklist (for plan author)

1. **Spec coverage** —
   - Env-vars-only identity strings → Task 3, 5, 8, 9, 12, 18, 30 (sidebar now reads `PUBLIC_APP_NAME`).
   - `advanced.database.generateId: false` → Task 18, Step 4.
   - `storeSessionInDatabase + preserveSessionInDatabase` → Task 18, Step 4.
   - Hand-written `schema.ts` (not layered) → Task 19.
   - Polar adapter (customer provisioning) → Task 13, 22.
   - Lifecycle in shutdown order → Task 7, consumed by Tasks 8, 9, 10.
   - Axiom logs + traces → Task 8, 9.
   - No hardcoded identity → Rule stated at top + enforced per task; Task 30 reads `PUBLIC_APP_NAME`.
   - `userPreferences` dropped → Task 19 explicitly omits it.
   - Demo route + old auth stub removed → Task 4.
   - `(dev)/email-preview` kept, other dev routes dropped → Task 31.
   - Simplifications (hook collapses, log trimming, try/catch removal) → Tasks 20, 21, 22, 28.
   - `auth:schema` script path updated → Task 19 Step 1.
   - `.env` bootstrap (drizzle-kit will fail without it) → Task 3 Step 3.
   - DB creds match `compose.yaml` (`root` / `mysecretpassword` / `local`) → Task 3, 11.
   - Runtime deps moved to `dependencies` (adapter-node prod installs) → Task 2.
   - Newest package versions (`latest`) + `pnpm outdated` check → Task 2.
   - Remote functions re-exported from `$features/auth` (CLAUDE.md rule) → Task 26, consumed in Task 30.

2. **Placeholder scan** — no "TBD", "add appropriate error handling", or "similar to Task N" instructions; all steps reference either concrete code or a specific source path in `../blob-never`. Component-port tasks (12, 25, 29) reference explicit source files, describe required public surface, and list concrete simplifications to apply.

3. **Type consistency** —
   - `AuditAction` union consistent between Task 19 (schema) and Task 28 (admin api).
   - `Session` / `ActiveMember` exported in Task 18 (auth.ts), consumed in Task 20, 21, 23, 26, 28.
   - `Entitlements` defined in Task 6, used in Tasks 13, 19.
   - `env` object keys consistent between Tasks 3, 5, and every consumer.
   - `validateRoleChange` lives **only** in `queries.ts` (stubs in Task 18 Step 2, real impl in Task 20). Task 18 imports it from queries (not hooks). Task 22 does not mention it.
   - `getActiveMemberOrNull`, `listUserOrganizations`, `listUserInvitations`, `getUserInvitations`, `getSession`, `getSessionOrNull` all stubbed in Task 18 Step 2 with signatures matching Task 20's real impls.

4. **Green-check invariant** — every task ends with `pnpm lint` + `pnpm check` passing and a commit. No step allows a red intermediate commit. App.Locals shape defined up front (Task 4) so intermediates don't break on `event.locals.X`.

5. **Env hygiene** — REQUIRED list trimmed to true boot prerequisites (DB, auth, Redis, identity). Google/Polar/Axiom/S3/Resend optional with `requireX()` guards called at use-site, not at module load (Task 5). Dev boots without those secrets (verified by Task 32 Step 4).

6. **Better-auth type fidelity** — hook signatures lifted from `BetterAuthOptions` instead of hand-rolled (Task 18 Step 1). Validated against installed version before writing real impls (Task 22).

7. **Polar contract** — `ensureCustomer(org, creatorEmail)` — creator email passed explicitly; never silently defaults to empty string. `Entitlements` type includes `customerId: string | null` (Task 6). All writes to `organization.entitlements` go through adapter (Task 13 public contract).

8. **Lifecycle shutdown ordering** — tracing registers **after** logger (LIFO → tracing runs first → logger flushes last, capturing final logs). Instrumentation.server.ts enforces this import order (Task 9 Step 3).

9. **Dependency classification** — `@better-auth/cli` + `shadcn-svelte` stay in devDependencies (CLI-only); `sveltekit-superforms` removed (not moved + removed); runtime libs in `dependencies`; `pnpm outdated` gate (Task 2).

10. **Schema correctness** — `audit_log.actor_id` explicitly **nullable** because `onDelete: 'set null'` requires it (Task 19). Manual `\d+` check in smoke test (Task 32 Step 3).

11. **Onboarding semantics** — explicit: no auto-create-org shortcut. User always chooses create/accept path (Task 20).

12. **Remote/API boundaries** — components inside a feature use internal path (`../auth.remote`); external routes/features use public API (`$features/auth`). Only re-export what external callers use (Task 25, Task 26).

13. **Hardcoded identity** — all UI copy reads `PUBLIC_APP_NAME` from `$env/dynamic/public`. Only remaining "DMC" strings are in `.env.example` defaults and the plan title (acceptable).

14. **Error handling consistency** — expected → `error(code, message)`; unexpected → bubble. Only documented swallow is `clearMemberSessions` Redis cleanup with inline justification comment (Task 21).

15. **getClientIp** — parses first value of `x-forwarded-for`, not the full header (Task 6).

16. **Service abstraction weight** — each service's public contract is the minimal set of names it exports. Logger exports `logger` (pino instance); tracing exports `startTracing(): void`; polar exports `polarClient` + three adapter ops (Tasks 8, 9, 13).

17. **Manual verification in lieu of tests** — 6-step smoke check covers lint+check+build, schema drift, migration sanity (FK nullability, indexes), dev boot without optional secrets, auth route render, log+trace sanity in Axiom (Task 32).

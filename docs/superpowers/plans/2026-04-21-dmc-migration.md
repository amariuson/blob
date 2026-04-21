# DMC Auth & Admin Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the `auth` and `admin` features from `../blob-never` to `../blob` as a fresh rewrite, with services layer (logger/tracing → Axiom, redis, email, polar, storage, lifecycle), keeping every intermediate commit green under `pnpm lint` and `pnpm check`.

**Architecture:** Build bottom-up in numbered tasks: dependencies → env+lifecycle → observability → infra services → auth config+stubs → schema → auth real impl → handles+hooks → auth UI+routes → admin → app shell → dev tools → final smoke test. Auth plugins must be wired *before* `pnpm auth:schema` can emit a reference snapshot for the hand-written `schema.ts`.

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

**Background:** Adding all runtime libs needed by services + auth feature. `@sveltejs/adapter-node` replaces `@sveltejs/adapter-auto` because pino/OTEL/Polar webhooks require Node.

- [ ] **Step 1: Edit `package.json`**

Add to `dependencies` (create the section — currently everything is in `devDependencies`):

```json
"dependencies": {
  "@aws-sdk/client-s3": "^3.975.0",
  "@aws-sdk/s3-request-presigner": "^3.975.0",
  "@axiomhq/pino": "^1.3.0",
  "@kubiks/otel-drizzle": "^2.1.0",
  "@kubiks/otel-polar": "^1.0.1",
  "@kubiks/otel-resend": "^1.1.0",
  "@opentelemetry/api": "^1.9.0",
  "@opentelemetry/auto-instrumentations-node": "^0.69.0",
  "@opentelemetry/exporter-trace-otlp-proto": "^0.211.0",
  "@opentelemetry/resources": "^2.5.0",
  "@opentelemetry/sdk-node": "^0.211.0",
  "@opentelemetry/semantic-conventions": "^1.39.0",
  "@polar-sh/better-auth": "^1.6.4",
  "@polar-sh/sdk": "^0.42.2",
  "better-svelte-email": "^1.4.0",
  "date-fns": "^4.1.0",
  "dotenv": "^17.2.3",
  "import-in-the-middle": "^2.0.5",
  "ioredis": "^5.9.2",
  "pino": "^10.3.0",
  "pino-pretty": "^13.1.3",
  "resend": "^6.8.0",
  "runed": "^0.37.1",
  "svelte-toolbelt": "^0.10.6",
  "sveltekit-rate-limiter": "^0.7.0",
  "uuidv7": "^1.1.0",
  "zod": "^4.3.6"
}
```

In `devDependencies`:
- Remove: `@sveltejs/adapter-auto`
- Add: `"@sveltejs/adapter-node": "^5.4.0"`

- [ ] **Step 2: Update `svelte.config.js`**

Replace line 1 `import adapter from '@sveltejs/adapter-auto';` with:

```js
import adapter from '@sveltejs/adapter-node';
```

No other change.

- [ ] **Step 3: Install**

```bash
pnpm install
```

Expected: new `node_modules` entries, no errors. If `patches/@sveltejs__kit.patch` fails to apply due to version drift, keep the existing `@sveltejs/kit` version at `^2.57.0`.

- [ ] **Step 4: Verify**

```bash
pnpm lint
pnpm check
```

Both must pass clean. If either fails, fix inline before committing.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml svelte.config.js
git commit -m "Add runtime deps and swap to adapter-node"
```

---

## Task 3: Create `.env.example`

**Files:**
- Create: `.env.example`
- Modify: `.gitignore` (ensure `.env` is listed — it probably already is, verify)

- [ ] **Step 1: Write `.env.example`**

```
# App identity — used for cookie prefix, OTEL service name, email "from" display
APP_NAME=DMC
APP_SLUG=dmc-app
COOKIE_PREFIX=dmc-app
OTEL_SERVICE_NAME=dmc-app
EMAIL_FROM="DMC <no-reply@example.com>"

# Core
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
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

- [ ] **Step 3: Commit**

```bash
git add .env.example .gitignore
git commit -m "Add .env.example with identity + service vars"
```

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

- [ ] **Step 5: Replace `src/app.d.ts` with a minimal shell**

```typescript
// Real Locals definition lands in Task 27 after the auth feature exports Session.
declare global {
	namespace App {
		interface Locals {}
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

- [ ] **Step 1: Write `src/lib/server/env.server.ts`**

```typescript
import { env as dynamicEnv } from '$env/dynamic/private';

const REQUIRED = [
	'APP_NAME',
	'APP_SLUG',
	'COOKIE_PREFIX',
	'OTEL_SERVICE_NAME',
	'EMAIL_FROM',
	'DATABASE_URL',
	'BETTER_AUTH_SECRET',
	'BETTER_AUTH_URL',
	'GOOGLE_CLIENT_ID',
	'GOOGLE_CLIENT_SECRET',
	'REDIS_URL',
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

const OPTIONAL = ['RESEND_API_KEY'] as const;

type RequiredKey = (typeof REQUIRED)[number];
type OptionalKey = (typeof OPTIONAL)[number];

function read(): Record<RequiredKey | OptionalKey, string | undefined> {
	const result: Record<string, string | undefined> = {};
	for (const key of REQUIRED) result[key] = dynamicEnv[key];
	for (const key of OPTIONAL) result[key] = dynamicEnv[key];
	return result as Record<RequiredKey | OptionalKey, string | undefined>;
}

const raw = read();
const missing = REQUIRED.filter((k) => !raw[k]);
if (missing.length > 0) {
	throw new Error(
		`Missing required environment variables: ${missing.join(', ')}. ` +
			`See .env.example for the full list.`
	);
}

export const env = {
	APP_NAME: raw.APP_NAME!,
	APP_SLUG: raw.APP_SLUG!,
	COOKIE_PREFIX: raw.COOKIE_PREFIX!,
	OTEL_SERVICE_NAME: raw.OTEL_SERVICE_NAME!,
	EMAIL_FROM: raw.EMAIL_FROM!,
	DATABASE_URL: raw.DATABASE_URL!,
	BETTER_AUTH_SECRET: raw.BETTER_AUTH_SECRET!,
	BETTER_AUTH_URL: raw.BETTER_AUTH_URL!,
	GOOGLE_CLIENT_ID: raw.GOOGLE_CLIENT_ID!,
	GOOGLE_CLIENT_SECRET: raw.GOOGLE_CLIENT_SECRET!,
	REDIS_URL: raw.REDIS_URL!,
	RESEND_API_KEY: raw.RESEND_API_KEY,
	POLAR_ACCESS_TOKEN: raw.POLAR_ACCESS_TOKEN!,
	POLAR_WEBHOOK_SECRET: raw.POLAR_WEBHOOK_SECRET!,
	POLAR_SERVER: raw.POLAR_SERVER! as 'sandbox' | 'production',
	AXIOM_TOKEN: raw.AXIOM_TOKEN!,
	AXIOM_DATASET_LOGS: raw.AXIOM_DATASET_LOGS!,
	AXIOM_DATASET_TRACES: raw.AXIOM_DATASET_TRACES!,
	S3_ENDPOINT: raw.S3_ENDPOINT!,
	S3_REGION: raw.S3_REGION!,
	S3_BUCKET: raw.S3_BUCKET!,
	S3_ACCESS_KEY_ID: raw.S3_ACCESS_KEY_ID!,
	S3_SECRET_ACCESS_KEY: raw.S3_SECRET_ACCESS_KEY!
} as const;

export const isDev = process.env.NODE_ENV !== 'production';
export const isProd = !isDev;
```

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

```typescript
import type { CustomerStateBenefitGrant } from '@polar-sh/sdk/models/components/customerstatebenefitgrant.js';
import type { CustomerStateMeter } from '@polar-sh/sdk/models/components/customerstatemeter.js';
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js';

export type Entitlements = {
	activeSubscriptions: CustomerStateSubscription[];
	grantedBenefits: CustomerStateBenefitGrant[];
	activeMeters: CustomerStateMeter[];
	updatedAt: Date;
};

export const defaultEntitlements: Entitlements = {
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
	return request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null;
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
	? pino.transport({ target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss' } })
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

- [ ] **Step 2: Write `index.ts`**

```typescript
export { startTracing } from './tracing.server';
```

- [ ] **Step 3: Create `src/instrumentation.server.ts`**

```typescript
import { startTracing } from '$services/tracing';

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

**Files:**
- Modify (if needed): `compose.yaml`

- [ ] **Step 1: Check `compose.yaml` uses Postgres 18**

```bash
cat compose.yaml
```

If the `image:` line is anything other than `postgres:18` (e.g., `postgres:17`, `postgres:16`), edit it to `postgres:18` — `uuidv7()` is a native Postgres 18 function.

- [ ] **Step 2: Start the DB**

```bash
pnpm db:start
```

Leave this running in a separate terminal. Verify it's up:

```bash
docker compose ps
```

Expected: one `running` service.

- [ ] **Step 3: Confirm `uuidv7()` works**

```bash
docker compose exec -T postgres psql -U postgres -c 'select uuidv7();'
```

Expected: one UUIDv7 value printed. If Postgres emits `ERROR: function uuidv7() does not exist`, the image is older than 18 — fix `compose.yaml` and recreate the container.

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
- Use `logger` from `$services/logger` for the one info-level log per op that indicates completion ("ensured polar customer for org X").

Required exports:

```typescript
export async function ensureCustomer(org: {
	id: string;
	name: string;
	email: string | null;
}): Promise<string>;  // returns Polar customer external id

export async function syncOrgEntitlements(orgId: string): Promise<void>;

export async function handlePolarWebhook(headers: Headers, body: string): Promise<void>;
```

Implementation reads the Polar SDK's customers-by-external-id endpoint; creates if missing; writes returned entitlements into `organization.entitlements` via drizzle update. Keep under 150 lines total.

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
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
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

```typescript
// STUB — real implementations land in Task 22. Keep signatures in sync with usage in auth.ts.

import type { BetterAuthOptions } from 'better-auth';

type UserCreateBefore = NonNullable<
	NonNullable<BetterAuthOptions['databaseHooks']>['user']
>['create'];

export const beforeUserCreate: NonNullable<NonNullable<UserCreateBefore>['before']> = async (
	user
) => user;

export const afterUserCreate: NonNullable<NonNullable<UserCreateBefore>['after']> = async () => {};

// Organization hooks (types come from better-auth organization plugin)
export async function initializeOrganization(
	_org: { id: string; name: string; email: string | null },
	_userId: string
): Promise<void> {}

export async function recordOrgDeletion(
	_org: { id: string; name: string },
	_userId: string
): Promise<void> {}

export async function validateRoleChange(
	_member: { role: string },
	_newRole: string,
	_actorRole: string | undefined
): Promise<void> {}

export function validateInvitation(
	_invitation: { role: string },
	_inviter: { userId: string; role: string }
): void {}
```

- [ ] **Step 2: Write `api/queries.ts` as a STUB too**

The organization hook `beforeUpdateMemberRole` calls `getActiveMemberOrNull`. Create the stub now:

```typescript
// STUB — real implementations land in Task 21.
export async function getActiveMemberOrNull(): Promise<{ role: string } | null> {
	return null;
}
```

- [ ] **Step 3: Write `api/mutations.ts` as a STUB**

Organization `afterRemoveMember` calls `clearMemberSessions`. Stub:

```typescript
// STUB — real implementations land in Task 22.
export async function clearMemberSessions(_userId: string, _orgId: string): Promise<void> {}
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
import { afterUserCreate, beforeUserCreate, initializeOrganization, recordOrgDeletion, validateInvitation, validateRoleChange } from './api/hooks';
import { getActiveMemberOrNull } from './api/queries';
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

- [ ] **Step 5: Verify**

```bash
pnpm lint
pnpm check
```

At this stage `db` import will fail because `src/lib/server/db/schema.ts` is the empty placeholder. Expected — we fix it in the next tasks. If `pnpm check` reports a TypeScript error about `db`, hold — we'll re-run after Task 20 and it must pass there.

For this commit, move on if the only remaining errors are about `db`/`schema`. Any other errors (missing types from plugins, wrong import paths) must be fixed now.

- [ ] **Step 6: Commit**

```bash
git add src/lib/features/auth/
git commit -m "Wire auth config + hook stubs (unblocks pnpm auth:schema)"
```

---

## Task 19: Generate reference schema and hand-write `schema.ts`

**Files:**
- Create: `src/lib/server/db/auth.schema.ts` (via `pnpm auth:schema`; reference only, never imported)
- Create: `src/lib/server/db/schema.ts` (hand-written, replacing the Task 4 placeholder)
- Create: `src/lib/server/db/utils.ts`
- Modify: `src/lib/server/db/index.ts`

**Background:** We cannot simply re-export `auth.schema.ts` from our schema — we need `uuidv7()` column defaults, relations, and the custom `auditLog` table, which the CLI doesn't emit. The CLI output serves as a column-shape reference.

- [ ] **Step 1: Generate the reference**

```bash
pnpm auth:schema
```

Expected: writes `src/lib/server/db/auth.schema.ts`. This file is reference-only; `drizzle.config.ts` points at `schema.ts`, so `auth.schema.ts` is never imported.

- [ ] **Step 2: Write `src/lib/server/db/utils.ts`**

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

- [ ] **Step 3: Write `src/lib/server/db/schema.ts`**

Hand-write every table mirroring `auth.schema.ts` column names/types/nullability exactly, but using our `uuidv7()` column helper for IDs. Drop `userPreferences`.

Port the full table definitions from `../blob-never/src/lib/server/db/schema.ts` (lines 1–297 minus lines 228–258). Specifically, the file should contain:

- `user` table (primary key, name, email, emailVerified, image, createdAt, updatedAt, role, banned, banReason, banExpires)
- `session` table (id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId → user, impersonatedBy, activeOrganizationId → organization)
- `account` table (id, accountId, providerId, userId → user, tokens..., createdAt, updatedAt)
- `verification` table (id, identifier, value, expiresAt, createdAt, updatedAt)
- `organization` table (id, name, slug unique, logo, email, billingAddress jsonb, createdAt, metadata, entitlements jsonb with `defaultEntitlements`)
- `member` table (id, organizationId → organization, userId → user, role default 'member', createdAt)
- `invitation` table (id, organizationId → organization, email, role, status default 'pending', expiresAt, createdAt, inviterId → user)
- `auditLog` table (id, action, actorId → user onDelete set null, targetType, targetId, metadata jsonb, ipAddress, userAgent, createdAt) with `AuditAction` union
- `BillingAddress` type
- `AuditAction` type: `'impersonation.start' | 'impersonation.stop' | 'user.ban' | 'user.unban' | 'user.role_change' | 'user.sessions_revoked' | 'organization.delete'`
- All relations (`userRelations`, `sessionRelations`, `accountRelations`, `organizationRelations`, `memberRelations`, `invitationRelations`, `auditLogRelations`)

The imports should reference `uuidv7` and `entitlementsJsonb` from `./utils`, and use `defaultEntitlements` from `$lib/shared/types/entitlements`.

- [ ] **Step 4: Update `src/lib/server/db/index.ts`**

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '$lib/server/env.server';

import * as schema from './schema';

const client = postgres(env.DATABASE_URL);

export const db = drizzle(client, { schema });
```

- [ ] **Step 5: Generate migration**

```bash
pnpm db:generate
```

Expected: writes a new migration file into `drizzle/` (or wherever `drizzle.config.ts` directs). Review the SQL — every `id` column should have `DEFAULT uuidv7()`. If any column is `TEXT` instead of `UUID`, stop and fix `schema.ts`.

- [ ] **Step 6: Apply migration**

Ensure `.env` has `DATABASE_URL` pointing at the local Postgres 18 from Task 11. Then:

```bash
pnpm db:migrate
```

Expected: "migration applied" or similar. Verify with `docker compose exec postgres psql -U postgres -c '\dt'`.

- [ ] **Step 7: Verify**

```bash
pnpm lint
pnpm check
```

Both must pass clean — this is the first checkpoint where `auth.ts` compiles all the way through because `db` is now fully typed.

- [ ] **Step 8: Commit**

```bash
git add src/lib/server/db/ drizzle/
git commit -m "Hand-write schema.ts with uuidv7() defaults; generate initial migration"
```

---

## Task 20: Replace `api/queries.ts` stub with real implementation

**Files:**
- Modify: `src/lib/features/auth/server/api/queries.ts` (replace stub)

**Reference:** `../blob-never/src/lib/features/auth/server/api/queries/user.ts` and `.../queries/organization.ts`. Merge them into one file.

- [ ] **Step 1: Write the full `api/queries.ts`**

Required exports:

```typescript
export async function getSession(): Promise<Session>;                 // throws if no session
export async function getSessionOrNull(): Promise<Session | null>;
export async function getActiveMember(): Promise<ActiveMember>;
export async function getActiveMemberOrNull(): Promise<ActiveMember | null>;
export async function listUserOrganizations(): Promise<Array<{ id: string; createdAt: Date }>>;
export async function listUserInvitations(email: string): Promise<Array<{
	id: string;
	organizationName: string;
	role: string;
}>>;
export async function getAffectedSessions(userId: string, orgId: string): Promise<Array<{ id: string }>>;
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
export async function signInWithEmailOTP(data: z.infer<typeof signInWithEmailOTPSchema>): Promise<never>;  // redirects
export async function signInWithGoogle(): Promise<void>;
export async function signOutUser(): Promise<never>;  // redirects to /sign-in
export async function createOrganizationOnboarding(data: z.infer<typeof createOrgOnboardingSchema>): Promise<never>;
export async function acceptInvitationOnboarding(data: z.infer<typeof invitationActionSchema>): Promise<never>;
export async function declineInvitationOnboarding(data: z.infer<typeof invitationActionSchema>): Promise<void>;
export async function setActiveOrganization(organizationId: string): Promise<unknown>;
export async function clearMemberSessions(userId: string, orgId: string): Promise<void>;
export async function impersonateUser(userId: string): Promise<unknown>;
export async function stopImpersonating(): Promise<unknown>;
```

Simplifications to apply:
- Remove all `try { await auth.api.X(...) } catch (err) { logger.error(...); throw err }` — OTEL captures. One exception: `clearMemberSessions` may swallow Redis-delete errors (warn-log) because the DB-level clear of `activeOrganizationId` is the source of truth.
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
- `initializeOrganization` calls `ensureCustomer(org)` from `$services/polar` and records the returned external customer id onto `organization.entitlements.customerId` (via drizzle update). If the adapter design from Task 13 stores `customerId` in the entitlements jsonb's own field, honour that; otherwise use a dedicated `organization.polarCustomerId` column — BUT that would require a schema change, so prefer the jsonb field.
- `recordOrgDeletion` writes an `auditLog` row with `action: 'organization.delete'`.
- `validateInvitation` — admin cannot invite owner; only owner can invite admin; match the old `logic/validation.ts` rules exactly.
- `validateRoleChange` lives in `queries.ts` (Task 20), not here — don't duplicate.

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
export async function getUserForImpersonation(userId: string): Promise<{
	role: string | null;
	name: string;
	email: string;
	banned: boolean | null;
} | undefined>;
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
export async function startImpersonation(userId: string): Promise<never>;  // redirects to /
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

Minimal shell: receives props `{ user: { name, email, avatar }; isAdmin: boolean; signOutUserForm }`. Renders `Sidebar.Root` with `Sidebar.Header` (product name from `$env/dynamic/public` or a hardcoded fallback until we pass it from the layout), `Sidebar.Content` (empty for now — nav items land when DMC features exist), `Sidebar.Footer` (user menu with sign-out button wired to `signOutUserForm`). If `isAdmin`, show a stub "Admin" button that does nothing for now.

Keep under 120 lines.

- [ ] **Step 2: Write `(app)/+layout.svelte`**

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';

	import { ImpersonationBanner } from '$features/admin';
	import { getSessionQuery, signOutUserForm } from '$features/auth/auth.remote';
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

```svelte
<div class="p-8">
	<h1 class="text-2xl font-semibold">Welcome</h1>
	<p class="mt-2 text-sm text-muted-foreground">Your DMC workspace is ready.</p>
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

- [ ] **Step 1: Full lint + check + build**

```bash
pnpm lint
pnpm check
pnpm build
```

All three must pass. Any warnings in build output related to OTEL auto-instrumentation bundling are expected — do **not** try to silence them with a Vite config change unless they cause the build to fail.

- [ ] **Step 2: Sanity boot**

Ensure `.env` is populated with real values (at least: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `REDIS_URL`, `AXIOM_*`, `COOKIE_PREFIX`, `APP_NAME`, `APP_SLUG`, `OTEL_SERVICE_NAME`, `EMAIL_FROM`, `POLAR_*`, `S3_*`, and `GOOGLE_CLIENT_*`). `RESEND_API_KEY` optional — emails log to stdout without it.

```bash
pnpm dev
```

Open `http://localhost:5173`. Expected: redirect to `/sign-in` (because no session and `(app)` requires auth). Open `/sign-in` — see Google button + email form.

Do **not** run through the full sign-in flow as part of this step; a smoke boot is enough for the plan.

- [ ] **Step 3: Commit (if any incidental cleanups were needed during smoke)**

If the smoke-test turned up a fix:

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
   - Env-vars-only identity strings → Task 3, 5, 8, 9, 12, 18.
   - `advanced.database.generateId: false` → Task 18, Step 4.
   - `storeSessionInDatabase + preserveSessionInDatabase` → Task 18, Step 4.
   - Hand-written `schema.ts` (not layered) → Task 19.
   - Polar adapter (customer provisioning) → Task 13, 22.
   - Lifecycle in shutdown order → Task 7, consumed by Tasks 8, 9, 10.
   - Axiom logs + traces → Task 8, 9.
   - No hardcoded identity → Rule stated at top + enforced per task.
   - `userPreferences` dropped → Task 19 explicitly omits it.
   - Demo route + old auth stub removed → Task 4.
   - `(dev)/email-preview` kept, other dev routes dropped → Task 31.
   - Simplifications (hook collapses, log trimming, try/catch removal) → Tasks 20, 21, 22, 28.

2. **Placeholder scan** — no "TBD", "add appropriate error handling", or "similar to Task N" instructions; all steps reference either concrete code or a specific source path in `../blob-never`. Component-port tasks (12, 25, 29) reference explicit source files, describe required public surface, and list concrete simplifications to apply.

3. **Type consistency** — `AuditAction` union consistent between Task 19 (schema) and Task 28 (admin api). `Session` / `ActiveMember` exported in Task 18 (auth.ts), consumed in Task 20, 21, 23, 26, 28. `Entitlements` defined in Task 6, used in Tasks 13, 19. `env` object keys consistent between Tasks 3, 5, and every consumer.

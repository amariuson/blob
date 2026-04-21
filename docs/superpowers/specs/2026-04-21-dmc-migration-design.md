# DMC SaaS — Auth & Admin Migration Design

**Date:** 2026-04-21
**Source project:** `../blob-never`
**Target project:** `../blob` (this repo)
**Scope:** Port the `auth` and `admin` features from the old project, skip everything else, rewrite for readability and maintainability. Every intermediate commit must pass `pnpm lint` and `pnpm check` with zero warnings.

## Goals & non-goals

**Goals**

- Working auth: Email OTP + Google OAuth, with organizations (= DMC tenants), invitations, roles, and superadmin impersonation with audit log.
- Observability via Axiom (logs + traces).
- Billing surface via Polar (`@polar-sh/better-auth`).
- Email delivery via Resend + `better-svelte-email`.
- Redis-backed session secondary storage.
- S3-compatible object storage ready for the first DMC feature that needs it.
- High code quality: simplified file layouts, no dead code, no ceremony comments.

**Non-goals**

- Porting the `files` or `settings` features.
- Any tests (unit, e2e) — explicitly dropped.
- A superadmin dashboard UI (admin feature is backend + impersonation banner only; dashboard is a future PR).
- Any DMC-specific domain tables (tours, bookings, customers, etc.) — separate future work.

## Architectural decisions

| Area                 | Decision                                                                                                           | Reason                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| Approach             | **Fresh rewrite using old project as reference.** Copy nothing verbatim; re-derive shape with simpler layout.      | User requested C — readability and quality first. Semantics still reference-checked against old code. |
| Tenancy              | Organization = DMC tenant. Members have roles `owner` / `admin` / `member`. Global `superadmin` sits outside orgs. | Matches old project. Correct fit for B2B SaaS billed per tenant.                                      |
| Auth methods         | Email OTP (8 digits) + Google OAuth. No password.                                                                  | Matches old project.                                                                                  |
| Database             | Postgres. Fresh wipe, no data to preserve. IDs use Postgres 18's native `uuidv7()` function at column default.     | Greenfield. `uuidv7` in the DB avoids an app-layer import for the common case.                        |
| Schema source        | Hand-written `schema.ts`. Generate `auth.schema.ts` with `pnpm auth:schema` as a **reference only** — it cannot be layered/overridden cleanly for native UUIDv7 defaults or custom relations. | Preserves exact better-auth column shapes (verified against CLI output) while keeping full control over column defaults, relations, and custom tables. |
| Observability        | Axiom for both logs and traces via OTEL exporter + `@axiomhq/pino`.                                                | Replaces old pino-loki + Loki setup.                                                                  |
| Adapter              | `@sveltejs/adapter-node`                                                                                           | Required by pino/OTEL/Polar webhooks; matches old project.                                            |
| Adapter-auto removed | Yes                                                                                                                | Only works for edge runtimes that won't support Node OTEL.                                            |

## Simplification principles (applied everywhere)

1. **Collapse one-function-per-file patterns.** Files earn a split by size (>200 lines) or genuine cohesion boundary.
2. **One export = one responsibility.** No barrel re-exports unless consumed externally.
3. **Remove dead branches.** No `TEST_OTP` / `isTestEnv()` plumbing (no tests).
4. **Comments justify WHY.** If removing a comment wouldn't confuse a future reader, it goes.
5. **No premature abstraction** — *but* keep the abstractions that earn their keep: `lifecycle/` stays (solves a real shutdown-ordering problem), the Polar adapter layer stays (provides customer-provisioning hooks that the plain SDK client doesn't — see Services).
6. **Types over runtime guards.** Drop `invariant(...)` calls where better-auth's return types already narrow.

## Top-level layout

```
src/
├── app.d.ts
├── app.html
├── hooks.server.ts
├── instrumentation.server.ts         # NEW — bootstraps OTEL before any request
├── lib/
│   ├── assets/favicon.svg
│   ├── features/
│   │   ├── auth/
│   │   └── admin/
│   ├── server/
│   │   ├── db/                       # schema.ts, auth.schema.ts, index.ts, utils.ts
│   │   ├── env.server.ts             # typed env + isDev/isProd
│   │   └── services/
│   │       ├── lifecycle/
│   │       ├── logger/
│   │       ├── tracing/
│   │       ├── redis/
│   │       ├── email/
│   │       ├── polar/
│   │       └── storage/
│   └── shared/
│       ├── components/ui/            # existing shadcn, unchanged
│       ├── components/sidebar/       # app-sidebar (minimal)
│       ├── hooks/is-mobile.svelte.ts # existing
│       ├── form/form-handler.svelte.ts
│       └── utils.ts                  # cn, generateSlug, invariant, getClientIp
└── routes/
    ├── +layout.svelte
    ├── layout.css
    ├── (app)/{+layout.svelte,+page.svelte}
    ├── (auth)/{sign-in,sign-up,onboarding}/+page.svelte
    └── (dev)/email-preview/[...email]/{+page.server.ts,+page.svelte}
```

Dependency rule (enforced):

- `$lib/shared` and `$lib/server` never import from `$features/`.
- `$features/*` may import `$services/*` and `$lib/server/db`.
- Routes import features only via `$features/x` or `$features/x/server` public entry points.

Path aliases (already configured in `svelte.config.js`):

- `$features` → `src/lib/features`
- `$services` → `src/lib/server/services`

Svelte config keeps `experimental.async`, `experimental.remoteFunctions`, `instrumentation.server: true`.

## Database schema

**Tables:** `user`, `session`, `account`, `verification`, `organization`, `member`, `invitation`, `auditLog`.

**Dropped from old:** `userPreferences` and its relations.

**Workflow**

1. Wire `better-auth` config (admin + organization + emailOTP plugins + `advanced.database.generateId: false`) — **critical**: without `generateId: false`, better-auth emits its own non-UUID IDs at insert time, which collides with the DB's `default uuidv7()` and produces type errors on every write.
2. Run `pnpm auth:schema` to emit `src/lib/server/db/auth.schema.ts` — **reference only**. Do not import it from the drizzle client; do not re-export from `schema.ts`. Its role is a CI-verifiable snapshot of what better-auth expects.
3. Hand-write `schema.ts` with every table. Mirror column types/names/nullability from `auth.schema.ts` exactly. Apply:
   - ID columns: `uuid('id').primaryKey().default(sql\`uuidv7()\`)` (Postgres 18 native).
   - `organization.entitlements` jsonb (populated by Polar plugin via `additionalFields`).
   - `session.impersonatedBy` + `session.activeOrganizationId` (better-auth admin + organization plugins).
   - Manual `auditLog` table with typed `AuditAction` union.
   - `relations(...)` declarations.
4. `drizzle-kit generate` → one initial migration.
5. `drizzle-kit migrate` applies it.

**Drift protection:** re-running `pnpm auth:schema` after a better-auth upgrade produces a new `auth.schema.ts`; diff it against `schema.ts` by eye to catch new/renamed columns. Keep this as a manual pre-upgrade checklist item.

**Files**

```
src/lib/server/db/
├── auth.schema.ts   # reference snapshot from `pnpm auth:schema` — NOT imported anywhere
├── schema.ts        # hand-written tables, relations, auditLog, uuidv7() defaults
├── index.ts         # drizzle client, fails fast on missing DATABASE_URL
└── utils.ts         # entitlements jsonb typing helper
```

**AuditAction union:** `'impersonation.start' | 'impersonation.stop' | 'user.ban' | 'user.unban' | 'user.role_change' | 'user.sessions_revoked' | 'organization.delete'`.

## Services layer

### `env.server.ts`

Typed accessor for all env vars. Uses `$env/static/private` where possible, `$env/dynamic/private` for runtime-variable values. Exports `env` object + `isDev` / `isProd`. Fails fast with an explicit error listing missing required vars.

### `lifecycle/`

Small shutdown orchestrator — ~40 lines.

- `onShutdown(name, fn, { timeout = 5000 })` registers a hook.
- Listens to `SIGTERM` + `SIGINT` once; runs hooks in **LIFO** order with per-hook timeout.
- Prevents the pino-Axiom transport from flushing after OTEL has already shut down (the observed failure mode without orchestration).

### `logger/`

- Pino. In prod: `@axiomhq/pino` transport → dataset `AXIOM_DATASET_LOGS`. In dev: pino-pretty to stdout.
- Registers `onShutdown` to flush transport.
- Exports `logger` (a pino instance). No child-logger mandate.

### `tracing/`

- NodeSDK (`@opentelemetry/sdk-node`) with `OTLPTraceExporter` (proto) pointing at `https://api.axiom.co/v1/traces` with headers `Authorization: Bearer ${AXIOM_TOKEN}`, `X-Axiom-Dataset: ${AXIOM_DATASET_TRACES}`.
- Auto-instrumentations: `@opentelemetry/auto-instrumentations-node` + `@kubiks/otel-drizzle` + `@kubiks/otel-polar` + `@kubiks/otel-resend`.
- `startTracing()` called from `src/instrumentation.server.ts`. Must run before any service imports that need instrumentation.
- Registers `onShutdown(sdk.shutdown)`.

### `redis/`

Single `ioredis` client connected lazily to `REDIS_URL`. Registers `onShutdown(client.quit)`. Consumed by the better-auth `secondaryStorage` adapter and by `clearMemberSessions` on member removal.

### `email/`

```
email/
├── index.ts                    # re-exports sendXxx functions only
├── email.server.ts             # send({ to, subject, react }) → Resend
├── renderer.server.ts          # better-svelte-email render → { html, text }
├── templates/
│   ├── otp-verification.svelte
│   ├── organization-invitation.svelte
│   ├── role-changed.svelte
│   └── member-removed.svelte
└── emails.server.ts            # sendOtpVerificationEmail, sendOrganizationInvitationEmail, sendRoleChangedEmail, sendMemberRemovedEmail
```

Dev-without-`RESEND_API_KEY` mode: log rendered email to console instead of sending. Keeps `pnpm dev` frictionless.

### `polar/`

```
polar/
├── index.ts                # re-exports polarClient + adapter helpers
├── client.ts               # factory: production (real SDK) or dev mock, selected by POLAR_SERVER
└── adapter.ts              # higher-level ops: ensureCustomer, syncOrgEntitlements, webhook dispatch
```

Adapter layer is **retained** from the old project — the bare `@polar-sh/better-auth` plugin does not provide the customer-provisioning hook that needs to fire when an organization is created during onboarding (and when its billing metadata changes later). The adapter wraps the SDK with:

- `ensureCustomer(org)` — idempotent: looks up or creates a Polar customer keyed on the org id, returns external customer reference stored on `organization.entitlements.customerId`.
- `syncOrgEntitlements(orgId)` — fetches active subscriptions/benefits/meters for the org's Polar customer, writes them to `organization.entitlements` jsonb.
- Webhook dispatch handlers (subscription.created, benefit.granted, etc.) that call `syncOrgEntitlements`.

The auth feature's `organizationHooks.afterCreateOrganization` calls `ensureCustomer` here.

### `storage/`

```
storage/
├── index.ts
└── storage.server.ts
```

Five functions only: `uploadObject`, `getObject`, `getPresignedUploadUrl`, `getPresignedDownloadUrl`, `deleteObject`. Single S3 client from env (AWS / R2 / MinIO compatible). No retry/adapter/abstraction layer.

## Auth feature

### Structure

```
src/lib/features/auth/
├── index.ts                    # client-safe public API
├── schemas.ts                  # 4 Zod schemas
├── access-control.ts           # roles + permissions (moved up from config/)
├── auth.remote.ts              # all remote functions
├── components/
│   ├── layout.svelte
│   ├── auth.svelte
│   ├── onboarding.svelte
│   └── forms/{google-form,email-form,otp-form}.svelte
└── server/
    ├── index.ts                # server-only public API
    ├── auth.ts                 # betterAuth({...})
    ├── polar-plugin.ts
    ├── session-storage.ts      # Redis secondaryStorage adapter
    ├── handles.ts              # setup + redirect + auth handles in ONE file
    └── api/
        ├── queries.ts
        ├── mutations.ts
        └── hooks.ts            # better-auth lifecycle callbacks + email triggers
```

### Collapses vs old project

- `config/access-control.ts` → `access-control.ts`.
- `logic/validation.ts` → inlined into `hooks.ts` (single ~15-line validator, used once).
- `constants.ts` (`TEST_OTP`) → deleted.
- `server/adapters/session-storage.ts` → `server/session-storage.ts`.
- `server/plugins/polar.ts` → `server/polar-plugin.ts`.
- `server/handles/{context,redirect,auth}.ts` (3 files) → `server/handles.ts` (1 file, ~80 lines).
- `server/api/mutations/{auth,user,onboarding,organization}.ts` + `queries/{user,organization}.ts` + `{database,organization,polar}.hooks.ts` + `impersonation.ts` (10 files) → `api/{queries,mutations,hooks}.ts` (3 files).

### Public API

**Client-safe (`$features/auth`):**

```ts
export { Auth, Layout, Onboarding };
export {
	sendEmailOTPSchema,
	signInWithEmailOTPSchema,
	createOrgOnboardingSchema,
	invitationActionSchema
};
export { roleDefinitions, assignableRoles };
export type { Session, ActiveMember };
```

**Remote (`$features/auth/auth.remote`):** `form()` / `query()` exports — imported directly where Svelte components use them.

**Server-only (`$features/auth/server`):**

```ts
export { createAuthHandle, createRedirectHandle, createSetupHandle };
export { getSession, getSessionOrNull };
export { impersonateUser, stopImpersonating }; // consumed by admin feature
```

### Preserved behaviour

- **Setup handle** seeds `event.locals.context = { requestId, userId?, orgId? }` and caches `session` + `activeMember` in `event.locals` to avoid N+1 better-auth calls per request.
- **Redirect handle**: auto-selects most-recently-created org on login; redirects no-org users to `/onboarding`; bounces signed-in users off `(auth)`, signed-out users off `(app)`.
- **better-auth config** (required settings, all load-bearing):
  - `advanced.database.generateId: false` — DB-level `uuidv7()` must own ID generation; without this, better-auth writes its own IDs and the DB default is ignored / conflicts on re-read.
  - `session.storeSessionInDatabase: true` + `preserveSessionInDatabase: true` — Redis is secondary (fast-path) storage; the DB remains the source of truth so audit trail, impersonation state, and admin session queries keep working even if Redis is wiped.
  - `advanced.cookiePrefix: 'dmc-app'`.
  - Drizzle adapter, Redis `secondaryStorage`, email-OTP (8 digits, `randomInt`), Google OAuth, admin plugin with `adminRoles: ['superadmin']`, organization plugin with invitation/role-change/member-removal/org-delete hooks (all trigger emails), Polar plugin via `polar-plugin.ts`.
  - `databaseHooks.user.create` wires `beforeUserCreate` / `afterUserCreate` (in `api/hooks.ts`).
  - `organizationHooks.afterCreateOrganization` calls `$services/polar` `ensureCustomer(org)` to provision billing customer at org-creation time.
- **Impersonation API**: wraps better-auth admin-plugin methods so admin feature never reaches into better-auth directly.

### Deliberate simplifications

- `invariant(session, ...)` dropped where better-auth's own error path handles the missing-session case.
- `try { ... } catch (err) { logger.error(...); throw err; }` removed — OTEL auto-instrumentation captures errors.
- `APIError` mapping (`TOO_MANY_ATTEMPTS` → 429) kept; it's the one place hand-mapping genuinely improves UX.

## Admin feature

### Structure

```
src/lib/features/admin/
├── index.ts                               # client-safe public API
├── admin.remote.ts                        # remote functions
├── components/
│   ├── impersonation-banner.svelte
│   └── stop-impersonation-form.svelte
└── server/
    ├── index.ts                           # server-only public API
    └── api.ts                             # queries + mutations in ONE file (~120 lines)
```

### Collapses vs old project

- `schemas.ts` (unused `userSearchSchema`, `orgSearchSchema`) → deleted.
- `server/api/queries.ts` + `server/api/mutations.ts` → `server/api.ts`.
- `components/form/stop-impersonation-form.svelte` → `components/stop-impersonation-form.svelte`.

### Public API

**Client-safe:** `{ ImpersonationBanner }`.
**Remote:** `{ stopImpersonationForm, getImpersonationStatusQuery }`.
**Server-only:** `{ startImpersonation, stopImpersonation, logAuditEvent, requireSuperadmin, guardSelfAction }`.

### Preserved behaviour

- `requireSuperadmin()` — throws 403 if session role ≠ `'superadmin'`.
- `guardSelfAction()` — blocks self-targeted impersonation/ban/etc.
- `startImpersonation(userId)`: validates target exists, isn't superadmin, isn't banned. Logs `impersonation.start` audit with target metadata. Calls `impersonateUser(...)`. Redirects to `/`.
- `stopImpersonation()`: reads `session.session.impersonatedBy`, errors if unset, calls `stopImpersonating(...)`, logs `impersonation.stop` audit.
- `logAuditEvent({...})`: single insert into `audit_log` with `ip_address`, `user_agent`, `metadata` jsonb.
- `ImpersonationBanner`: diagonal red-stripe banner with "Viewing as {name} ({email})" + stop button. Uses `ElementSize` from `runed` to prevent content overlap.

### Simplifications

- Two adjacent "Starting..." / "Started" log entries → one.
- `try/catch/log/rethrow` removed.
- `x-forwarded-for ?? x-real-ip` extraction → single `getClientIp(request)` in `$lib/shared/utils`.

## Routes, layouts & hooks wiring

### `hooks.server.ts`

```ts
import { sequence } from '@sveltejs/kit/hooks';
import { createSetupHandle, createRedirectHandle, createAuthHandle } from '$features/auth/server';

export const handle = sequence(createSetupHandle(), createRedirectHandle(), createAuthHandle());
```

### `src/instrumentation.server.ts`

```ts
import { startTracing } from '$services/tracing';
startTracing();
```

Activated by SvelteKit's `experimental.instrumentation.server: true`. Must run before better-auth / drizzle / polar imports so their instrumentation hooks attach.

### `app.d.ts`

```ts
import type { Session, ActiveMember } from '$features/auth';

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
```

### Routes

```
src/routes/
├── +layout.svelte                        # favicon + global css (unchanged from current)
├── layout.css                            # unchanged
├── (app)/
│   ├── +layout.svelte                    # ImpersonationBanner + app shell
│   └── +page.svelte                      # "Welcome to DMC" placeholder
├── (auth)/
│   ├── sign-in/+page.svelte
│   ├── sign-up/+page.svelte
│   └── onboarding/+page.svelte
└── (dev)/
    ├── +layout.server.ts                 # guards with isProd → error(404)
    └── email-preview/[...email]/
        ├── +page.server.ts
        └── +page.svelte
```

### Removed from current `blob`

- `src/routes/demo/`
- `src/lib/server/auth.ts` (replaced by feature-owned auth.ts)
- `task` table from `schema.ts`

### `(app)` shell — minimal sidebar

Shell wires `ImpersonationBanner` → `Sidebar.Provider` → `AppSidebar {user, isAdmin, signOutUserForm}` + `Sidebar.Inset`. `AppSidebar` lives at `$lib/shared/components/sidebar/app-sidebar.svelte` with sign-out + user info. No nav items until DMC features exist. `isAdmin` gates a future `/admin` link (hidden for now).

### `(dev)/email-preview`

`[...email]` resolves template names, `+page.server.ts` renders the Svelte email to HTML, `+page.svelte` iframes it. Guarded to dev-only via `(dev)/+layout.server.ts`.

## Dependencies & scripts

**Add to `dependencies`**: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@kubiks/otel-drizzle`, `@kubiks/otel-polar`, `@kubiks/otel-resend`, `@opentelemetry/api`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-proto`, `@opentelemetry/resources`, `@opentelemetry/sdk-node`, `@opentelemetry/semantic-conventions`, `@axiomhq/pino`, `@polar-sh/better-auth`, `@polar-sh/sdk`, `better-svelte-email`, `date-fns`, `dotenv`, `import-in-the-middle`, `ioredis`, `pino`, `pino-pretty`, `resend`, `runed`, `svelte-toolbelt`, `sveltekit-rate-limiter`, `uuidv7`, `zod`.

**Add to `devDependencies`**: `@sveltejs/adapter-node` (replace `@sveltejs/adapter-auto`).

**Scripts:** keep the existing ones in `package.json` (`dev`, `build`, `preview`, `prepare`, `check`, `check:watch`, `lint`, `format`, `db:start`, `db:push`, `db:generate`, `db:migrate`, `db:studio`, `auth:schema`). Override `db:migrate` to:

```json
"db:migrate": "drizzle-kit migrate"
```

No `tsx`, no `tools/` folder, no test scripts.

## Environment variables

Single `.env.example` at repo root, grouped:

```
# Core
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:5173

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Redis
REDIS_URL=redis://localhost:6379

# Email
RESEND_API_KEY=

# Billing
POLAR_ACCESS_TOKEN=
POLAR_WEBHOOK_SECRET=
POLAR_SERVER=sandbox

# Observability
AXIOM_TOKEN=
AXIOM_DATASET_LOGS=dmc-app-logs
AXIOM_DATASET_TRACES=dmc-app-traces

# Storage (S3-compatible)
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

## Error handling conventions

- **Expected errors** → `error(status, { message, code })`. Codes: `'VALIDATION'` (400), `'FORBIDDEN'` (403), `'NOT_FOUND'` (404), `'TOO_MANY_REQUESTS'` (429). Client branches on `code`.
- **Unexpected errors** → bubble. OTEL + better-auth `onAPIError` log them. No try/catch-rethrow.
- **Remote-form validation errors** → `invalid(issue.fieldName('msg'))`. The only place we hand-unwrap `APIError`.
- **Invariants** → `invariant(cond, 'msg')` from `$lib/shared/utils`. Used sparingly for "can't happen" situations.
- **CLAUDE.md rule #6**: no `@ts-ignore` / `eslint-disable` without asking first.

## Quality gates

After every layer-level change:

```
pnpm install
pnpm lint       # prettier --check + eslint, zero warnings
pnpm check      # svelte-kit sync + svelte-check, zero errors
```

Non-negotiable. A layer isn't done until both pass clean.

## Rollout order

The detailed per-step plan is produced by the `writing-plans` skill. High-level:

1. Dependencies + `.env.example` + adapter swap.
2. `env.server.ts` + `lifecycle/` + `logger/` + `tracing/` + `instrumentation.server.ts` + Axiom wiring.
3. `redis/` + `email/` (templates included) + `polar/` (client + adapter) + `storage/`.
4. Auth feature **config-only** first pass — `access-control.ts`, `server/auth.ts` with plugins wired (`generateId: false`, `storeSessionInDatabase: true`, `preserveSessionInDatabase: true`), but `databaseHooks` / `organizationHooks` referencing `api/hooks.ts` stubs that just `return`.
5. Schema layer — `pnpm auth:schema` emits `auth.schema.ts` (reference only); hand-write `schema.ts` mirroring it with `uuidv7()` defaults + relations + `auditLog`; `drizzle-kit generate` → migrate.
6. Auth `api/*` real implementations — `queries.ts`, `mutations.ts`, `hooks.ts` (replacing stubs from step 4).
7. Auth handles (`server/handles.ts`) + `hooks.server.ts` wiring + `app.d.ts`.
8. Auth remote + components + `(auth)` routes.
9. Admin feature (backend + banner component).
10. `(app)` shell + route cleanup (delete `demo/`, replace `+page.svelte`).
11. `(dev)/email-preview`.
12. Final: full `pnpm lint && pnpm check && pnpm build` smoke test.

Each step ends on a green tree.

## Out of scope (explicit)

- DMC domain models (tours, bookings, customers, suppliers, itineraries).
- Superadmin UI (`/admin` routes).
- Feature flags, A/B testing, analytics.
- i18n / multi-language support.
- Playwright, Vitest, any test harness.
- Storybook / component showcase route.
- CI workflow files.

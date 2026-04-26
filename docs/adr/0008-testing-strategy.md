# ADR-0008 — Testing strategy: Playwright E2E + Vitest for pure logic

**Status:** Accepted
**Date:** 2026-04-25

## Context

Test pyramids that target every layer (unit, integration, contract, e2e) sound disciplined but produce a lot of brittle, slow tests for SaaS apps where most logic is "fetch data, format, render." We need a strategy that:

- Catches regressions in user-visible behavior.
- Validates non-trivial pure logic.
- Doesn't punish small refactors with cascading test rewrites.
- Runs fast enough to keep developer flow.

## Decision

We use **two test types only**:

### 1. Playwright (E2E) — primary

E2E covers user-visible behavior end-to-end. Test the user's perspective, not implementation. One spec per user-facing flow (sign-in, create org, invite member, upload avatar).

```ts
test('user can sign in with OTP', async ({ page }) => {
	await page.goto('/sign-in');
	await page.fill('[name="email"]', 'test@example.com');
	await page.click('button[type="submit"]');
	await expect(page.getByText('Enter your code')).toBeVisible();
});
```

E2E runs against the real app with mocked external services where unavoidable (Polar via `isE2ETestMode()` mock client; email is a no-op via `isTestEnv()`). Database is a real Postgres in test mode.

### 2. Vitest (unit) — for pure logic and Zod schemas

Use Vitest when:

- Testing **pure functions** in `feature/logic/` or `service/logic.ts` — validation, transforms, calculations.
- Testing **Zod schemas** with non-trivial rules (regex, conditional refinements, coercions).
- Testing **service-layer pure helpers** (`generateKey`, `validateFileSize`, `extractKeyFromUrl`).

Don't use Vitest for:

- Components — covered by E2E.
- Mutations / queries — covered by E2E or feature-level integration through the running app.
- Fetching data from the DB — that's an E2E or DB-test concern.

### What we don't write

- **Integration tests** between services and external SDKs. The SDK is the contract; mocking the SDK to test our wrapper validates nothing.
- **Snapshot tests** of rendered HTML. Brittle, low-signal.
- **Tests for trivial shape Zod schemas** (`z.object({ name: z.string() })`).

### Mocking convention

When a unit test needs to silence the logger (e.g., to assert clean output), mock at module level:

```ts
vi.mock('$services/logger', () => ({
	logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
	createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() })
}));
```

For services with adapter patterns (Polar), the mock client is a first-class implementation, not a test fixture. E2E mode swaps the real client for the mock.

## Consequences

**Good:**

- Two test types, clear rules — no debate about where a test belongs.
- E2E catches the regressions that matter most (broken flows).
- Vitest catches the regressions Playwright misses (subtle pure-logic bugs) without requiring DB or browser.
- Refactoring internal structure rarely breaks tests, because tests target either pure functions or user-visible behavior.

**Bad:**

- Coverage on the API layer is indirect — bugs in mutations are caught at E2E, not at unit level. Diagnosis can be slower.
- Fewer tests means fewer guardrails for risky changes; we lean on TypeScript and code review for the rest.
- E2E is slower than unit tests; CI time grows with the number of flows.

**Neutral:**

- We accept lower line-coverage numbers in exchange for tests that are signal-rich rather than ceremony.

## Alternatives considered

- **Component tests (vitest-browser-svelte)** — fine for shared primitives if a need arises; not the default.
- **Full integration tests against real Resend/Polar** — flaky, costly, and don't validate our code more than E2E with the mock does.
- **Cypress** — Playwright is faster, has better TypeScript support, and is already in the toolchain.

## References

- `CLAUDE.md` — testing section
- `playwright.config.ts`, `vitest.config.ts`
- `src/lib/features/auth/logic/validation.test.ts` — example pure-logic test
- ADR-0003 — service layer's pure logic is what Vitest targets

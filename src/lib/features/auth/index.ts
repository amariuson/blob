// Client-safe public API
// Export: remote functions, schemas, types, constants, components
// Do NOT export: server-only code (use $features/auth/server)

export { default as Auth } from './components/auth.svelte';
export { default as Layout } from './components/layout.svelte';
export { default as Onboarding } from './components/onboarding.svelte';
export type { ActiveMember,Session } from './server/auth';

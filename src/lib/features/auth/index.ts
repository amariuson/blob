// Client-safe public API
// Export: remote functions, schemas, types, constants, components
// Do NOT export: server-only code (use $features/auth/server)

export { default as Layout } from './components/layout.svelte';
export { default as Onboarding } from './components/onboarding.svelte';
export { default as Auth } from './components/auth.svelte';

export type { Session, ActiveMember } from './server/auth';

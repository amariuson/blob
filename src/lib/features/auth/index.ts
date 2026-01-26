// Client-safe public API
// Export: remote functions, schemas, types, constants, components
// Do NOT export: server-only code (use $features/auth/server)

export { default as Onboarding } from './components/onboarding.svelte';
export { default as SignUp } from './components/sign-up.svelte';
export { default as SignIn } from './components/sign-in.svelte';

export type { Session, ActiveMember } from './server/auth';

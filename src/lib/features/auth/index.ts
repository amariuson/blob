// Client-safe public API
// Export: schemas, types, constants, components
// Do NOT export: server-only code (use $features/auth/server)
// Do NOT export: remote functions (use $features/auth/remote)

export { default as Auth } from './components/auth.svelte';
export { default as Layout } from './components/layout.svelte';
export { default as Onboarding } from './components/onboarding.svelte';
export {
	createOrgOnboardingSchema,
	invitationActionSchema,
	sendEmailOTPSchema,
	signInWithEmailOTPSchema
} from './schemas';
export type { ActiveMember, Session } from './server/auth';

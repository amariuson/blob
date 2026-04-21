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

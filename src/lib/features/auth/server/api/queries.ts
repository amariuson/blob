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

import { sendWelcomeEmail } from '$services/email';
import type { BetterAuthOptions, User } from 'better-auth';
import { listUserInvitations } from '../api/queries/organization';
import { autoCreateOrganization } from '../api/hooks/organization';

async function beforeUserCreate(user: User) {
	const name = user.name?.trim() || user.email.split('@')[0];
	return { data: { ...user, name } };
}

async function afterUserCreate(user: User) {
	await sendWelcomeEmail({
		to: user.email,
		userName: user.name
	});

	// Check for pending invitations - if user has invites, they go to onboarding to choose
	const normalizedEmail = user.email.toLowerCase();
	const pendingInvites = await listUserInvitations(normalizedEmail);

	if (pendingInvites.length === 0) {
		await autoCreateOrganization(user.id, user.name);
	}
}

export function createDatabaseHooks(): BetterAuthOptions['databaseHooks'] {
	return {
		user: {
			create: {
				before: beforeUserCreate,
				after: afterUserCreate
			}
		}
	};
}

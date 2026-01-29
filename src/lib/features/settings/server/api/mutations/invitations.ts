import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

import { rolesWithPermission } from '$features/auth';
import { auth, getActiveMember } from '$features/auth/server';
import { logger } from '$services/logger';

import { z } from 'zod';

import { cancelInvitationSchema, inviteMemberSchema } from '../../../schemas';

const INVITATION_INVITE_ROLES = rolesWithPermission('invitation', 'create');
const INVITATION_CANCEL_ROLES = rolesWithPermission('invitation', 'cancel');

// ============================================================================
// Mutations
// ============================================================================

/**
 * Invites a member to the current organization.
 * Role validation (only owners can invite owners) is handled by better-auth hooks.
 */
export async function inviteMember(data: z.infer<typeof inviteMemberSchema>) {
	const activeMember = await getActiveMember();
	const event = getRequestEvent();

	// Check permission to invite
	if (!INVITATION_INVITE_ROLES.includes(activeMember.role)) {
		logger.warn({ role: activeMember.role }, 'Permission denied: cannot invite members');
		error(403, { message: 'You do not have permission to invite members', code: 'FORBIDDEN' });
	}

	try {
		await auth.api.createInvitation({
			headers: event.request.headers,
			body: {
				email: data.email,
				role: data.role,
				organizationId: activeMember.organizationId
			}
		});

		logger.info(
			{ email: data.email, role: data.role, orgId: activeMember.organizationId },
			'Member invited'
		);

		return { success: true };
	} catch (err) {
		logger.error({ email: data.email, error: err }, 'Failed to invite member');
		error(400, {
			message: 'Failed to send invitation. The user may already be invited.',
			code: 'VALIDATION'
		});
	}
}

/**
 * Cancels a pending invitation.
 */
export async function cancelInvitation(data: z.infer<typeof cancelInvitationSchema>) {
	const activeMember = await getActiveMember();
	const event = getRequestEvent();

	// Check permission
	if (!INVITATION_CANCEL_ROLES.includes(activeMember.role)) {
		logger.warn({ role: activeMember.role }, 'Permission denied: cannot cancel invitation');
		error(403, {
			message: 'You do not have permission to cancel invitations',
			code: 'FORBIDDEN'
		});
	}

	await auth.api.cancelInvitation({
		headers: event.request.headers,
		body: { invitationId: data.invitationId }
	});

	logger.info({ invitationId: data.invitationId }, 'Invitation cancelled');

	return { success: true };
}

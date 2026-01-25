/**
 * Validation functions for auth.
 */

import { error } from '@sveltejs/kit';
import { logger } from '$services/logger';

/**
 * Validates invitation creation.
 * - No one can invite owners (owners must be promoted from existing members)
 * - Admins can only invite members (not other admins)
 * - Owners can invite admins and members
 */
export function validateInvitation(
	invitation: { role: string },
	inviter: { userId: string; role: string }
): void {
	// No one can invite owners - they must be promoted from existing members
	if (invitation.role === 'owner') {
		logger.warn(
			{ inviterId: inviter.userId, targetRole: invitation.role },
			'Attempted to invite owner - not allowed'
		);
		error(403, {
			message: 'Cannot invite owners. Promote an existing member instead.',
			code: 'FORBIDDEN'
		});
	}

	// Admins can only invite members (not other admins)
	if (inviter.role === 'admin' && invitation.role === 'admin') {
		logger.warn(
			{ inviterId: inviter.userId, targetRole: invitation.role },
			'Admin attempted to invite admin - not allowed'
		);
		error(403, { message: 'Admins can only invite members', code: 'FORBIDDEN' });
	}
}

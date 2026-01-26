import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

import { db } from '$lib/server/db';
import { member } from '$lib/server/db/schema';
import { logger } from '$services/logger';

import { and, eq } from 'drizzle-orm';

import { auth } from '../../auth';

export async function listUserInvitations(email: string) {
	logger.debug({ email }, 'Fetching pending invitations');
	return auth.api.listUserInvitations({ query: { email } });
}

// Lists all organizations the current user is a member of.
export async function listUserOrganizations() {
	const event = getRequestEvent();
	return auth.api.listOrganizations({ headers: event.request.headers });
}

// Checks if member is the only owner in the organization.
export async function isLastOwner(memberId: string, orgId: string): Promise<boolean> {
	const owners = await db.query.member.findMany({
		where: and(eq(member.organizationId, orgId), eq(member.role, 'owner'))
	});
	const isLast = owners.length === 1 && owners[0].id === memberId;
	if (isLast) {
		logger.debug({ memberId, orgId }, 'Member is the last owner of organization');
	}
	return isLast;
}

export async function validateRoleChange(
	member: { id: string; userId: string; organizationId: string; role: string },
	newRole: string,
	actorRole: string | undefined
) {
	// Only owners can promote to owner
	if (newRole === 'owner' && actorRole !== 'owner') {
		logger.warn(
			{ actorRole, targetMemberId: member.id, targetRole: newRole },
			'Non-owner attempted to promote to owner'
		);
		error(403, { message: 'Only owners can promote members to owner', code: 'FORBIDDEN' });
	}

	// Prevent demoting the last owner
	if (member.role === 'owner' && newRole !== 'owner') {
		if (await isLastOwner(member.id, member.organizationId)) {
			logger.warn(
				{ memberId: member.id, orgId: member.organizationId },
				'Attempted to demote last owner'
			);
			error(403, { message: 'Cannot demote the last owner of an organization', code: 'FORBIDDEN' });
		}
	}
}

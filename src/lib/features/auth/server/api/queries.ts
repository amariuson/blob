import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { and, eq, sql } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { invitation, member, organization, session } from '$lib/server/db/schema';
import { invariant } from '$lib/shared/utils';

import type { ActiveMember, Session } from '../auth';
import { auth } from '../auth';

// ---- session ------------------------------------------------------------

export async function getSessionOrNull(): Promise<Session | null> {
	const event = getRequestEvent();

	if (event.locals.session !== undefined) {
		return event.locals.session as Session | null;
	}

	const result = (await auth.api.getSession({
		headers: event.request.headers
	})) as Session | null;
	event.locals.session = result;
	return result;
}

export async function getSession(): Promise<Session> {
	const s = await getSessionOrNull();
	invariant(s, 'Session required but not found');
	return s;
}

// ---- active member ------------------------------------------------------

export async function getActiveMemberOrNull(): Promise<ActiveMember | null> {
	const event = getRequestEvent();

	if (event.locals.activeMember !== undefined) {
		return event.locals.activeMember as ActiveMember | null;
	}

	const result = ((await auth.api.getActiveMember({
		headers: event.request.headers
	})) ?? null) as ActiveMember | null;
	event.locals.activeMember = result;
	return result;
}

export async function getActiveMember(): Promise<ActiveMember> {
	const m = await getActiveMemberOrNull();
	invariant(m, 'Active member required but not found');
	return m;
}

// ---- organizations ------------------------------------------------------

export async function listUserOrganizations(): Promise<Array<{ id: string; createdAt: Date }>> {
	const s = await getSession();
	return db
		.select({ id: organization.id, createdAt: organization.createdAt })
		.from(member)
		.innerJoin(organization, eq(member.organizationId, organization.id))
		.where(eq(member.userId, s.user.id));
}

// ---- invitations --------------------------------------------------------

export async function listUserInvitations(
	email: string
): Promise<Array<{ id: string; organizationName: string; role: string }>> {
	const rows = await db
		.select({
			id: invitation.id,
			organizationName: organization.name,
			role: invitation.role
		})
		.from(invitation)
		.innerJoin(organization, eq(invitation.organizationId, organization.id))
		.where(
			and(
				sql`lower(${invitation.email}) = ${email.toLowerCase()}`,
				eq(invitation.status, 'pending')
			)
		);

	return rows.map((r) => ({
		id: r.id,
		organizationName: r.organizationName,
		role: r.role ?? 'member'
	}));
}

export async function getUserInvitations() {
	const s = await getSession();
	return listUserInvitations(s.user.email);
}

// ---- sessions affected by org membership --------------------------------

export async function getAffectedSessions(
	userId: string,
	orgId: string
): Promise<Array<{ id: string }>> {
	return db
		.select({ id: session.id })
		.from(session)
		.where(and(eq(session.userId, userId), eq(session.activeOrganizationId, orgId)));
}

// ---- role-change validation --------------------------------------------

async function isLastOwner(memberId: string, orgId: string): Promise<boolean> {
	const owners = await db
		.select({ id: member.id })
		.from(member)
		.where(and(eq(member.organizationId, orgId), eq(member.role, 'owner')));
	return owners.length === 1 && owners[0].id === memberId;
}

export async function validateRoleChange(
	m: { id: string; organizationId: string; role: string },
	newRole: string,
	actorRole: string | undefined
): Promise<void> {
	// Only owners can promote to owner
	if (newRole === 'owner' && actorRole !== 'owner') {
		error(403, {
			message: 'Only owners can promote members to owner',
			code: 'FORBIDDEN'
		});
	}

	// Prevent demoting the last owner
	if (m.role === 'owner' && newRole !== 'owner') {
		if (await isLastOwner(m.id, m.organizationId)) {
			error(403, {
				message: 'Cannot demote the last owner of an organization',
				code: 'FORBIDDEN'
			});
		}
	}
}

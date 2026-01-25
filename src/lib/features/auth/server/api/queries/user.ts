import { getRequestEvent } from '$app/server';
import { auth } from '../../auth';
import { invariant } from '$lib/shared/utils';
import { logger } from '$services/logger';
import { db } from '$lib/server/db';
import { session } from '$lib/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { listUserInvitations } from './organization';

export async function getSession() {
	const session = await getSessionOrNull();
	invariant(session, 'Session required but not found');
	return session;
}

export async function getSessionOrNull() {
	const event = getRequestEvent();

	// Already fetched (either has session or confirmed no session)
	if (event.locals.session !== undefined) {
		return event.locals.session;
	}

	// Fetch and cache
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session;
	return session;
}

export async function getActiveMember() {
	const activeMember = await getActiveMemberOrNull();
	invariant(activeMember, 'Active member required but not found');
	return activeMember;
}

export async function getActiveMemberOrNull() {
	const event = getRequestEvent();

	// Already fetched (either has member or confirmed no member)
	if (event.locals.activeMember !== undefined) {
		return event.locals.activeMember;
	}

	// Fetch and cache
	const activeMember = await auth.api.getActiveMember({ headers: event.request.headers });
	event.locals.activeMember = activeMember;
	return activeMember;
}

/**
 * Gets sessions that have a specific org set as active.
 * Used by clearMemberSessions to invalidate sessions when a member is removed.
 */
export async function getAffectedSessions(userId: string, orgId: string) {
	logger.debug({ userId, orgId }, 'Fetching sessions affected by org membership');

	const sessions = await db.query.session.findMany({
		where: and(eq(session.userId, userId), eq(session.activeOrganizationId, orgId)),
		columns: { id: true }
	});

	logger.debug({ userId, orgId, sessionCount: sessions.length }, 'Found affected sessions');

	return sessions;
}

export async function getUserInvitations() {
	const session = await getSession();
	return await listUserInvitations(session.user.email);
}

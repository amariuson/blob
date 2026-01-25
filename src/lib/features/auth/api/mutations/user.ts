import { db } from '$lib/server/db';
import { session } from '$lib/server/db/schema';
import { logger } from '$services/logger';
import { redisClient } from '$services/redis';
import { and, eq } from 'drizzle-orm';
import { getAffectedSessions } from '../queries/user';
import { getRequestEvent } from '$app/server';
import { auth } from '$features/auth/auth.server';
import { redirect } from '@sveltejs/kit';

export async function signOutUser() {
	const event = getRequestEvent();
	logger.info('User signing out');
	await auth.api.signOut({ headers: event.request.headers });
	redirect(302, '/sign-in');
}

export async function clearMemberSessions(userId: string, orgId: string) {
	try {
		const affectedSessions = await getAffectedSessions(userId, orgId);

		if (affectedSessions.length > 0) {
			await db
				.update(session)
				.set({ activeOrganizationId: null })
				.where(and(eq(session.userId, userId), eq(session.activeOrganizationId, orgId)));

			const deletePromises = affectedSessions.map((s) =>
				redisClient.del(`session:${s.id}`).catch((err) => {
					logger.warn({ err, sessionId: s.id }, 'Failed to delete session from Redis');
				})
			);
			await Promise.all(deletePromises);

			logger.info(
				{ userId, orgId, sessionCount: affectedSessions.length },
				'Cleared activeOrganizationId from user sessions after org removal'
			);
		}
	} catch (error) {
		logger.error({ userId, orgId, error }, 'Failed to clear activeOrganizationId from sessions');
	}
}

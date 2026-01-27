import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

import { auth, getSession } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { logger } from '$services/logger';

import { and, eq, ne } from 'drizzle-orm';
import { z } from 'zod';

import { revokeSessionSchema } from '../../../schemas';

// ============================================================================
// Mutations
// ============================================================================

/**
 * Revokes a specific session.
 *
 * Note: We delete from DB directly as a workaround for better-auth bug where
 * revokeSession with preserveSessionInDatabase doesn't properly invalidate sessions.
 * See: https://github.com/better-auth/better-auth/issues/5144
 */
export async function revokeSession(data: z.infer<typeof revokeSessionSchema>) {
	const session = await getSession();
	const event = getRequestEvent();

	// Prevent revoking current session
	if (data.sessionToken === session.session.token) {
		error(400, {
			message: 'Cannot revoke current session. Use sign out instead.',
			code: 'VALIDATION'
		});
	}

	// Call better-auth API (clears from Redis secondary storage)
	await auth.api.revokeSession({
		headers: event.request.headers,
		body: { token: data.sessionToken }
	});

	// Also delete from database (workaround for better-auth bug)
	await db.delete(schema.session).where(eq(schema.session.token, data.sessionToken));

	logger.info('Session revoked');

	return { success: true };
}

/**
 * Revokes all sessions except the current one.
 *
 * Note: We delete from DB directly as a workaround for better-auth bug.
 * See: https://github.com/better-auth/better-auth/issues/5144
 */
export async function revokeAllOtherSessions() {
	const session = await getSession();
	const event = getRequestEvent();

	// Call better-auth API (clears from Redis secondary storage)
	await auth.api.revokeOtherSessions({
		headers: event.request.headers
	});

	// Also delete from database (workaround for better-auth bug)
	await db
		.delete(schema.session)
		.where(
			and(
				eq(schema.session.userId, session.user.id),
				ne(schema.session.token, session.session.token)
			)
		);

	logger.info('All other sessions revoked');

	return { success: true };
}

import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { logger } from '$services/logger';
import { z } from 'zod';
import { error } from '@sveltejs/kit';

// cross feature
import { getSession, getSessionOrNull, type Session } from '$features/auth/server';

// ============================================================================
// Schemas
// ============================================================================

export const userSearchSchema = z.object({
	query: z.string().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20)
});

export const orgSearchSchema = z.object({
	query: z.string().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20)
});

// ============================================================================
// User Queries
// ============================================================================

/** Fetches user info for impersonation validation. */
export async function getUserForImpersonation(userId: string) {
	logger.debug({ userId }, 'Fetching user for impersonation');

	const user = await db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		columns: { role: true, name: true, email: true, banned: true }
	});

	if (!user) {
		logger.debug({ userId }, 'User not found for impersonation');
	}

	return user;
}

// ============================================================================
// Impersonation Queries
// ============================================================================

/** Gets current impersonation status from session. */
export async function getImpersonationStatus() {
	const session = await getSessionOrNull();

	if (!session) return null;

	const impersonatedBy = session.session.impersonatedBy;
	if (!impersonatedBy) return null;

	return {
		isImpersonating: true,
		impersonatorId: impersonatedBy,
		viewingAs: {
			id: session.user.id,
			name: session.user.name,
			email: session.user.email
		}
	};
}

/** Requires superadmin role. Throws 403 if not superadmin. */
export async function requireSuperadmin() {
	const session = await getSession();
	if (session.user.role !== 'superadmin') {
		logger.warn({ userId: session.user.id, role: session.user.role }, 'Superadmin access denied');
		error(403, { message: 'Superadmin access required', code: 'FORBIDDEN' });
	}
	return session;
}

/** Guards against self-targeted actions. Throws 400 if targeting self. */
export function guardSelfAction(session: Session, targetUserId: string, action: string) {
	if (session.user.id === targetUserId) {
		logger.warn({ userId: session.user.id, action }, 'Blocked self-targeted action attempt');
		error(400, { message: `Cannot ${action} yourself`, code: 'VALIDATION' });
	}
}

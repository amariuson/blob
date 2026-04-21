import { error, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { eq } from 'drizzle-orm';

import type { Session } from '$features/auth';
import {
	getSession,
	getSessionOrNull,
	impersonateUser,
	stopImpersonating
} from '$features/auth/server';
import { db } from '$lib/server/db';
import type { AuditAction } from '$lib/server/db/schema';
import * as schema from '$lib/server/db/schema';
import { getClientIp } from '$lib/shared/utils';
import { logger } from '$services/logger';

// ---- gates ---------------------------------------------------------------

/** Requires superadmin role. Throws 403 if not superadmin. */
export async function requireSuperadmin(): Promise<Session> {
	const session = await getSession();
	if (session.user.role !== 'superadmin') {
		error(403, { message: 'Superadmin access required', code: 'FORBIDDEN' });
	}
	return session;
}

/** Guards against self-targeted actions. Throws 400 if targeting self. */
export function guardSelfAction(session: Session, targetUserId: string, action: string): void {
	if (session.user.id === targetUserId) {
		error(400, { message: `Cannot ${action} yourself`, code: 'VALIDATION' });
	}
}

// ---- queries -------------------------------------------------------------

/** Fetches user info for impersonation validation. */
export async function getUserForImpersonation(userId: string) {
	return db.query.user.findFirst({
		where: eq(schema.user.id, userId),
		columns: { role: true, name: true, email: true, banned: true }
	});
}

/** Gets current impersonation status from session. */
export async function getImpersonationStatus(): Promise<{
	isImpersonating: true;
	impersonatorId: string;
	viewingAs: { id: string; name: string; email: string };
} | null> {
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

// ---- audit log -----------------------------------------------------------

interface AuditEventParams {
	action: AuditAction;
	actorId: string;
	targetType: 'user' | 'organization' | 'session';
	targetId: string;
	metadata?: Record<string, unknown>;
	request: Request;
}

/** Logs an audit event for admin actions. */
export async function logAuditEvent(params: AuditEventParams): Promise<void> {
	const { action, actorId, targetType, targetId, metadata, request } = params;

	await db.insert(schema.auditLog).values({
		action,
		actorId,
		targetType,
		targetId,
		metadata,
		ipAddress: getClientIp(request),
		userAgent: request.headers.get('user-agent') ?? null
	});
}

// ---- impersonation mutations --------------------------------------------

/** Starts impersonating a user. Validates target is not superadmin or banned. Redirects to /. */
export async function startImpersonation(userId: string): Promise<never> {
	const session = await requireSuperadmin();
	const event = getRequestEvent();

	guardSelfAction(session, userId, 'impersonate');

	const targetUser = await getUserForImpersonation(userId);
	if (targetUser?.role === 'superadmin') {
		error(400, { message: 'Cannot impersonate other superadmins', code: 'VALIDATION' });
	}
	if (targetUser?.banned) {
		error(400, { message: 'Cannot impersonate banned users', code: 'VALIDATION' });
	}

	await impersonateUser(userId);

	await logAuditEvent({
		action: 'impersonation.start',
		actorId: session.user.id,
		targetType: 'user',
		targetId: userId,
		metadata: { targetEmail: targetUser?.email, targetName: targetUser?.name },
		request: event.request
	});

	logger.info({ actorId: session.user.id, targetUserId: userId }, 'Impersonation started');

	redirect(302, '/');
}

/** Stops the current impersonation session. */
export async function stopImpersonation(): Promise<void> {
	const event = getRequestEvent();
	const session = await getSession();

	const impersonatorId = session.session.impersonatedBy;
	if (!impersonatorId) {
		error(400, { message: 'Not currently impersonating', code: 'VALIDATION' });
	}

	await stopImpersonating();

	await logAuditEvent({
		action: 'impersonation.stop',
		actorId: impersonatorId,
		targetType: 'user',
		targetId: session.user.id,
		metadata: { targetEmail: session.user.email },
		request: event.request
	});

	logger.info({ impersonatorId, targetUserId: session.user.id }, 'Impersonation stopped');
}

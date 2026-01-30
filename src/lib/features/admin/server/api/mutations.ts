import { error, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

// cross feature
import { auth, getSession } from '$features/auth/server';
import { db } from '$lib/server/db';
import type { AuditAction } from '$lib/server/db/schema';
import * as schema from '$lib/server/db/schema';
import { logger } from '$services/logger';

import { getUserForImpersonation, guardSelfAction, requireSuperadmin } from './queries';

// ============================================================================
// Audit Logging
// ============================================================================

interface AuditEventParams {
	action: AuditAction;
	actorId: string;
	targetType: 'user' | 'organization' | 'session';
	targetId: string;
	metadata?: Record<string, unknown>;
	request: Request;
}

/** Logs an audit event for admin actions. */
export async function logAuditEvent(params: AuditEventParams) {
	const { action, actorId, targetType, targetId, metadata, request } = params;

	await db.insert(schema.auditLog).values({
		action,
		actorId,
		targetType,
		targetId,
		metadata,
		ipAddress: request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? null,
		userAgent: request.headers.get('user-agent') ?? null
	});
}

// ============================================================================
// Impersonation Mutations
// ============================================================================

/** Starts impersonating a user. Validates target is not superadmin or banned. */
export async function startImpersonation(userId: string) {
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

	logger.info({ targetUserId: userId, targetEmail: targetUser?.email }, 'Starting impersonation');

	try {
		await auth.api.impersonateUser({
			headers: event.request.headers,
			body: { userId }
		});
	} catch (err) {
		logger.error({ error: err, userId }, 'Better Auth impersonation failed');
		throw err;
	}

	await logAuditEvent({
		action: 'impersonation.start',
		actorId: session.user.id,
		targetType: 'user',
		targetId: userId,
		metadata: { targetEmail: targetUser?.email, targetName: targetUser?.name },
		request: event.request
	});

	logger.info({ targetUserId: userId }, 'Impersonation started');

	redirect(302, '/');
}

/** Stops the current impersonation session. */
export async function stopImpersonation() {
	const event = getRequestEvent();
	const session = await getSession();

	const impersonatorId = session.session.impersonatedBy;
	if (!impersonatorId) {
		error(400, { message: 'Not currently impersonating', code: 'VALIDATION' });
	}

	logger.info({ impersonatorId, impersonatedUserId: session.user.id }, 'Stopping impersonation');

	try {
		await auth.api.stopImpersonating({
			headers: event.request.headers
		});
	} catch (err) {
		logger.error({ error: err, impersonatorId }, 'Better Auth stop impersonation failed');
		throw err;
	}

	await logAuditEvent({
		action: 'impersonation.stop',
		actorId: impersonatorId,
		targetType: 'user',
		targetId: session.user.id,
		metadata: { targetEmail: session.user.email },
		request: event.request
	});

	logger.info({ impersonatorId }, 'Impersonation stopped');
}

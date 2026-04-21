import { error, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { getRequestEvent } from '$app/server';
import { and, eq } from 'drizzle-orm';
import type { z } from 'zod';

import { db } from '$lib/server/db';
import { session } from '$lib/server/db/schema';
import { generateSlug } from '$lib/shared/utils';
import { logger } from '$services/logger';
import { redisClient } from '$services/redis';

import type {
	createOrgOnboardingSchema,
	invitationActionSchema,
	sendEmailOTPSchema,
	signInWithEmailOTPSchema
} from '../../schemas';
import { auth } from '../auth';
import { getAffectedSessions, getSession } from './queries';

// ---- email OTP ----------------------------------------------------------

export async function sendEmailOTP(data: z.infer<typeof sendEmailOTPSchema>): Promise<void> {
	const event = getRequestEvent();
	const result = await auth.api.sendVerificationOTP({
		headers: event.request.headers,
		body: { email: data.email, type: 'sign-in' }
	});

	if (!result) {
		error(409, { code: 'CONFLICT', message: 'Failed to send OTP' });
	}
}

export async function signInWithEmailOTP(
	data: z.infer<typeof signInWithEmailOTPSchema>
): Promise<never> {
	const event = getRequestEvent();
	await auth.api.signInEmailOTP({
		headers: event.request.headers,
		body: { email: data.email, otp: data.otp }
	});
	redirect(302, resolve('/'));
}

// ---- social -------------------------------------------------------------

export async function signInWithGoogle(): Promise<void> {
	const event = getRequestEvent();
	const result = await auth.api.signInSocial({
		headers: event.request.headers,
		body: { provider: 'google' }
	});

	if (result.redirect && result.url) {
		redirect(302, result.url);
	}
}

// ---- sign out -----------------------------------------------------------

export async function signOutUser(): Promise<never> {
	const event = getRequestEvent();
	await auth.api.signOut({ headers: event.request.headers });
	redirect(302, '/sign-in');
}

// ---- onboarding ---------------------------------------------------------

export async function createOrganizationOnboarding(
	data: z.infer<typeof createOrgOnboardingSchema>
): Promise<never> {
	const { name } = data;
	const slug = generateSlug(name);
	const s = await getSession();

	try {
		await auth.api.createOrganization({ body: { name, slug, userId: s.user.id } });
	} catch (err) {
		// Convert better-auth validation errors to user-facing 400s.
		error(400, {
			code: 'VALIDATION',
			message: err instanceof Error ? err.message : 'Failed to create organization.'
		});
	}

	redirect(303, '/');
}

export async function acceptInvitationOnboarding(
	data: z.infer<typeof invitationActionSchema>
): Promise<never> {
	const event = getRequestEvent();

	try {
		await auth.api.acceptInvitation({
			headers: event.request.headers,
			body: { invitationId: data.invitationId }
		});
	} catch {
		error(400, {
			code: 'VALIDATION',
			message: 'Failed to accept invitation. It may have expired.'
		});
	}

	redirect(303, '/');
}

export async function declineInvitationOnboarding(
	data: z.infer<typeof invitationActionSchema>
): Promise<void> {
	const event = getRequestEvent();

	try {
		await auth.api.rejectInvitation({
			headers: event.request.headers,
			body: { invitationId: data.invitationId }
		});
	} catch {
		error(400, { code: 'VALIDATION', message: 'Failed to decline invitation.' });
	}
}

// ---- active organization -----------------------------------------------

export async function setActiveOrganization(organizationId: string): Promise<unknown> {
	const event = getRequestEvent();
	return auth.api.setActiveOrganization({
		headers: event.request.headers,
		body: { organizationId }
	});
}

// ---- session maintenance ----------------------------------------------

export async function clearMemberSessions(userId: string, orgId: string): Promise<void> {
	const affected = await getAffectedSessions(userId, orgId);
	if (affected.length === 0) return;

	// DB update is source of truth; Redis entries are just a cache.
	await db
		.update(session)
		.set({ activeOrganizationId: null })
		.where(and(eq(session.userId, userId), eq(session.activeOrganizationId, orgId)));

	await Promise.all(
		affected.map((s) =>
			// Swallow Redis-delete failures: the DB has already been cleared, which is the
			// source of truth. Redis is a cache — a stale entry will be re-fetched and
			// overwritten on the next hit. Any other error class would bubble.
			redisClient.del(`session:${s.id}`).catch((err) => {
				logger.warn({ err, sessionId: s.id }, 'Failed to delete session from Redis');
			})
		)
	);

	logger.info(
		{ userId, orgId, sessionCount: affected.length },
		'Cleared activeOrganizationId from affected sessions'
	);
}

// ---- impersonation -----------------------------------------------------

export async function impersonateUser(userId: string): Promise<unknown> {
	const event = getRequestEvent();
	return auth.api.impersonateUser({
		headers: event.request.headers,
		body: { userId }
	});
}

export async function stopImpersonating(): Promise<unknown> {
	const event = getRequestEvent();
	return auth.api.stopImpersonating({ headers: event.request.headers });
}

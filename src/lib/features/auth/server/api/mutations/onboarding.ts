import { error, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

import { generateSlug } from '$lib/shared/utils';
import { logger } from '$services/logger';

import z from 'zod';

import { auth } from '../../auth';
import { getSession } from '../queries/user';

export const createOrgOnboardingSchema = z.object({
	name: z.string().min(1, 'Organization name is required').max(100, 'Name is too long')
});

export const invitationActionSchema = z.object({
	invitationId: z.string().min(1, 'Invitation ID is required')
});

/**
 * Creates an organization during onboarding.
 */
export async function createOrganizationOnboarding(
	data: z.infer<typeof createOrgOnboardingSchema>
) {
	const { name } = data;
	const slug = generateSlug(name);

	const session = await getSession();
	const userId = session.user.id;

	try {
		await auth.api.createOrganization({ body: { name, slug, userId } });
		logger.info({ userId, name, slug }, 'Organization created from onboarding');
	} catch (err) {
		error(400, {
			message: err instanceof Error ? err.message : 'Failed to create organization.',
			code: 'VALIDATION'
		});
	}

	redirect(303, '/');
}

/**
 * Accepts an invitation during onboarding.
 * Redirects to home on success.
 */
export async function acceptInvitationOnboarding(data: z.infer<typeof invitationActionSchema>) {
	const event = getRequestEvent();
	const { invitationId } = data;

	logger.info({ invitationId }, 'Accepting invitation during onboarding');

	try {
		await auth.api.acceptInvitation({
			headers: event.request.headers,
			body: { invitationId }
		});
		logger.info({ invitationId }, 'Invitation accepted');
		redirect(303, '/');
	} catch (err) {
		logger.error({ invitationId, error: err }, 'Failed to accept invitation');
		error(400, {
			message: 'Failed to accept invitation. It may have expired.',
			code: 'VALIDATION'
		});
	}
}

/**
 * Declines an invitation during onboarding.
 * Stays on onboarding page (no redirect).
 */
export async function declineInvitationOnboarding(data: z.infer<typeof invitationActionSchema>) {
	const event = getRequestEvent();
	const { invitationId } = data;

	logger.info({ invitationId }, 'Declining invitation during onboarding');

	try {
		await auth.api.rejectInvitation({
			headers: event.request.headers,
			body: { invitationId }
		});
		logger.info({ invitationId }, 'Invitation declined');
	} catch (err) {
		logger.error({ invitationId, error: err }, 'Failed to decline invitation');
		error(400, { message: 'Failed to decline invitation.', code: 'VALIDATION' });
	}
}

import { getRequestEvent } from '$app/server';

import { auth, getSession } from '$features/auth/server';
import { logger } from '$services/logger';

import { z } from 'zod';

import { updateProfileSchema } from '../../../schemas';

// ============================================================================
// Mutations
// ============================================================================

/**
 * Updates the current user's profile name.
 */
export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
	await getSession(); // Verify authenticated
	const event = getRequestEvent();

	await auth.api.updateUser({
		headers: event.request.headers,
		body: {
			name: data.name
		}
	});

	logger.info({ name: data.name }, 'User profile updated');

	return { success: true };
}

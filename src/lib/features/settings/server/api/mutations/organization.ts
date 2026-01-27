import { error } from '@sveltejs/kit';

import { getActiveMember } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { logger } from '$services/logger';
import { polarClient } from '$services/polar';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { HTTPValidationError } from '@polar-sh/sdk/models/errors/httpvalidationerror.js';

import { updateOrganizationSchema } from '../../../schemas';

// Roles that can update organization settings
const ORG_UPDATE_ROLES = ['owner', 'admin'];

// ============================================================================
// Mutations
// ============================================================================

/**
 * Updates organization details.
 */
export async function updateOrganization(data: z.infer<typeof updateOrganizationSchema>) {
	const activeMember = await getActiveMember();

	// Check permission
	if (!ORG_UPDATE_ROLES.includes(activeMember.role)) {
		logger.warn(
			{ role: activeMember.role },
			'Permission denied: cannot update organization settings'
		);
		error(403, {
			message: 'You do not have permission to update organization settings',
			code: 'FORBIDDEN'
		});
	}

	// Sync to Polar FIRST - if it rejects the data, don't save locally
	try {
		await polarClient.updateOrganizationCustomer(activeMember.organizationId, {
			...(data.email && { email: data.email }),
			name: data.name
		});
	} catch (err) {
		logger.warn({ error: err }, 'Polar rejected organization data');
		const message =
			err instanceof HTTPValidationError && err.detail?.length
				? err.detail[0].msg
				: 'Failed to sync with billing provider';
		error(400, { message, code: 'VALIDATION' });
	}

	// Only save locally if Polar accepted the data
	await db
		.update(schema.organization)
		.set({
			name: data.name,
			slug: data.slug,
			email: data.email || null
		})
		.where(eq(schema.organization.id, activeMember.organizationId));

	logger.info({ name: data.name, slug: data.slug }, 'Organization settings updated');

	return { success: true };
}

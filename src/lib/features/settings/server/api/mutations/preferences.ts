import { getSession } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { logger } from '$services/logger';

import { z } from 'zod';

import { updateNotificationsSchema, updatePreferencesSchema } from '../../../schemas';

// ============================================================================
// Mutations
// ============================================================================

/**
 * Updates user preferences (language, timezone, date/time formats).
 */
export async function updatePreferences(data: z.infer<typeof updatePreferencesSchema>) {
	const session = await getSession();

	await db
		.insert(schema.userPreferences)
		.values({
			userId: session.user.id,
			language: data.language,
			timezone: data.timezone,
			dateFormat: data.dateFormat,
			timeFormat: data.timeFormat
		})
		.onConflictDoUpdate({
			target: schema.userPreferences.userId,
			set: {
				language: data.language,
				timezone: data.timezone,
				dateFormat: data.dateFormat,
				timeFormat: data.timeFormat,
				updatedAt: new Date()
			}
		});

	logger.info(
		{
			language: data.language,
			timezone: data.timezone,
			dateFormat: data.dateFormat,
			timeFormat: data.timeFormat
		},
		'User preferences updated'
	);

	return { success: true };
}

/**
 * Updates notification preferences.
 */
export async function updateNotifications(data: z.infer<typeof updateNotificationsSchema>) {
	const session = await getSession();

	await db
		.insert(schema.userPreferences)
		.values({
			userId: session.user.id,
			emailNotifications: data.emailNotifications,
			marketingEmails: data.marketingEmails,
			securityAlerts: data.securityAlerts,
			productUpdates: data.productUpdates
		})
		.onConflictDoUpdate({
			target: schema.userPreferences.userId,
			set: {
				emailNotifications: data.emailNotifications,
				marketingEmails: data.marketingEmails,
				securityAlerts: data.securityAlerts,
				productUpdates: data.productUpdates,
				updatedAt: new Date()
			}
		});

	logger.info(
		{ emailNotifications: data.emailNotifications, marketingEmails: data.marketingEmails },
		'User notification preferences updated'
	);

	return { success: true };
}

import { getRequestEvent } from '$app/server';

import { auth, getActiveMember, getSession } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { logger } from '$services/logger';
import {
	deleteObject,
	extractKeyFromUrl,
	generateKey,
	generateUploadUrl,
	getPublicUrl
} from '$services/storage';

import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { IMAGE_UPLOAD_PREFIXES } from '../../../constants';
import {
	confirmImageUploadSchema,
	prepareImageUploadSchema,
	removeImageSchema
} from '../../../schemas';
import type { ImageUploadResult } from '../../../types';

// ============================================================================
// Mutations
// ============================================================================

/**
 * Prepares an image upload by generating a presigned URL.
 */
export async function prepareImageUpload(
	data: z.infer<typeof prepareImageUploadSchema>
): Promise<ImageUploadResult> {
	const session = await getSession();

	let ownerId: string;
	let prefix: string;

	if (data.type === 'avatar') {
		ownerId = session.user.id;
		prefix = IMAGE_UPLOAD_PREFIXES.avatar;
	} else {
		const activeMember = await getActiveMember();
		ownerId = activeMember.organizationId;
		prefix = IMAGE_UPLOAD_PREFIXES['org-logo'];
	}

	const key = generateKey(prefix, ownerId, data.contentType);
	const uploadUrl = await generateUploadUrl(key, data.contentType);

	logger.debug(
		{ type: data.type, contentType: data.contentType, size: data.size },
		'Image upload prepared'
	);

	return { key, uploadUrl };
}

/**
 * Confirms an image upload and updates the user/org record.
 */
export async function confirmImageUpload(data: z.infer<typeof confirmImageUploadSchema>) {
	const session = await getSession();
	const event = getRequestEvent();

	const publicUrl = getPublicUrl(data.key);

	if (data.type === 'avatar') {
		// Get current user to check for existing custom image
		const user = await db.query.user.findFirst({
			where: eq(schema.user.id, session.user.id),
			columns: { image: true }
		});

		// Delete old custom image if exists
		if (user?.image) {
			const oldKey = extractKeyFromUrl(user.image);
			if (oldKey) {
				await deleteObject(oldKey).catch(() => {
					logger.warn({ key: oldKey }, 'Failed to delete old avatar during replacement');
				});
			}
		}

		// Update user image
		await auth.api.updateUser({
			headers: event.request.headers,
			body: { image: publicUrl }
		});
	} else {
		const activeMember = await getActiveMember();

		// Get current org to check for existing custom logo
		const org = await db.query.organization.findFirst({
			where: eq(schema.organization.id, activeMember.organizationId),
			columns: { logo: true }
		});

		// Delete old custom logo if exists
		if (org?.logo) {
			const oldKey = extractKeyFromUrl(org.logo);
			if (oldKey) {
				await deleteObject(oldKey).catch(() => {
					logger.warn({ key: oldKey }, 'Failed to delete old logo during replacement');
				});
			}
		}

		// Update org logo
		await db
			.update(schema.organization)
			.set({ logo: publicUrl })
			.where(eq(schema.organization.id, activeMember.organizationId));
	}

	logger.info({ type: data.type, key: data.key }, 'Image upload confirmed');

	return { success: true, url: publicUrl };
}

/**
 * Removes an image (avatar or org logo).
 */
export async function removeImage(data: z.infer<typeof removeImageSchema>) {
	const session = await getSession();
	const event = getRequestEvent();

	if (data.type === 'avatar') {
		const user = await db.query.user.findFirst({
			where: eq(schema.user.id, session.user.id),
			columns: { image: true }
		});

		if (user?.image) {
			const key = extractKeyFromUrl(user.image);
			if (key) {
				await deleteObject(key).catch(() => {
					logger.warn({ key }, 'Failed to delete avatar from storage');
				});
			}
		}

		await auth.api.updateUser({
			headers: event.request.headers,
			body: { image: null }
		});
	} else {
		const activeMember = await getActiveMember();

		const org = await db.query.organization.findFirst({
			where: eq(schema.organization.id, activeMember.organizationId),
			columns: { logo: true }
		});

		if (org?.logo) {
			const key = extractKeyFromUrl(org.logo);
			if (key) {
				await deleteObject(key).catch(() => {
					logger.warn({ key }, 'Failed to delete logo from storage');
				});
			}
		}

		await db
			.update(schema.organization)
			.set({ logo: null })
			.where(eq(schema.organization.id, activeMember.organizationId));
	}

	logger.info({ type: data.type }, 'Image removed');

	return { success: true };
}

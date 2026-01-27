import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

import { rolesWithPermission } from '$features/auth';
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

const ORG_IMAGE_ROLES = rolesWithPermission('organization', 'update');

function requireOrgImagePermission(role: string) {
	if (!ORG_IMAGE_ROLES.includes(role)) {
		error(403, {
			message: 'You do not have permission to manage the organization logo',
			code: 'FORBIDDEN'
		});
	}
}

// ============================================================================
// Helpers
// ============================================================================

async function deleteStoredImage(imageUrl: string | null | undefined, label: string) {
	if (!imageUrl) return;
	const key = extractKeyFromUrl(imageUrl);
	if (key) {
		await deleteObject(key).catch(() => {
			logger.warn({ key }, `Failed to delete old ${label} from storage`);
		});
	}
}

async function resolveImageTarget(type: 'avatar' | 'org-logo') {
	if (type === 'avatar') {
		const session = await getSession();
		const event = getRequestEvent();
		const user = await db.query.user.findFirst({
			where: eq(schema.user.id, session.user.id),
			columns: { image: true }
		});
		return {
			currentUrl: user?.image ?? null,
			update: (url: string | null) =>
				auth.api.updateUser({ headers: event.request.headers, body: { image: url } }),
			label: 'avatar'
		};
	}

	const activeMember = await getActiveMember();
	requireOrgImagePermission(activeMember.role);
	const org = await db.query.organization.findFirst({
		where: eq(schema.organization.id, activeMember.organizationId),
		columns: { logo: true }
	});
	return {
		currentUrl: org?.logo ?? null,
		update: (url: string | null) =>
			db
				.update(schema.organization)
				.set({ logo: url })
				.where(eq(schema.organization.id, activeMember.organizationId)),
		label: 'logo'
	};
}

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
		requireOrgImagePermission(activeMember.role);
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
	const target = await resolveImageTarget(data.type);
	const publicUrl = getPublicUrl(data.key);

	await deleteStoredImage(target.currentUrl, target.label);
	await target.update(publicUrl);

	logger.info({ type: data.type, key: data.key }, 'Image upload confirmed');

	return { success: true, url: publicUrl };
}

/**
 * Removes an image (avatar or org logo).
 */
export async function removeImage(data: z.infer<typeof removeImageSchema>) {
	const target = await resolveImageTarget(data.type);

	await deleteStoredImage(target.currentUrl, target.label);
	await target.update(null);

	logger.info({ type: data.type }, 'Image removed');

	return { success: true };
}

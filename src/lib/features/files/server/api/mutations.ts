import { error } from '@sveltejs/kit';

import { getActiveMember, getSession } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { logger } from '$services/logger';
import {
	deleteObject,
	generateKey,
	generateUploadUrl,
	getPublicUrl,
	isAllowedDocumentType,
	isAllowedImageType
} from '$services/storage';

import { eq } from 'drizzle-orm';
import type { z } from 'zod';

import { FILE_STORAGE_PREFIX } from '../../constants';
import { canCreateFile, canModifyFile, canRemoveFile } from '../../config/access-control';
import type {
	confirmFileUploadSchema,
	deleteFileSchema,
	prepareFileUploadSchema,
	updateFileSchema
} from '../../schemas';
import type { FileUploadResult } from '../../types';

// ============================================================================
// Permission Helpers
// ============================================================================

function requireFileCreatePermission(role: string) {
	if (!canCreateFile(role)) {
		error(403, {
			message: 'You do not have permission to upload files',
			code: 'FORBIDDEN'
		});
	}
}

function validateKeyOwnership(key: string, organizationId: string) {
	const expectedPrefix = `${FILE_STORAGE_PREFIX}${organizationId}/`;
	if (!key.startsWith(expectedPrefix)) {
		error(403, { message: 'Invalid file key', code: 'FORBIDDEN' });
	}
}

// ============================================================================
// Upload Mutations
// ============================================================================

/**
 * Prepares a file upload by generating a presigned URL
 */
export async function prepareFileUpload(
	data: z.infer<typeof prepareFileUploadSchema>
): Promise<FileUploadResult> {
	const activeMember = await getActiveMember();
	requireFileCreatePermission(activeMember.role);

	// Validate content type is in the extended allowed list
	const isImage = isAllowedImageType(data.contentType);
	const isDocument = isAllowedDocumentType(data.contentType);

	// For types not in the storage service's built-in list, we manually create the key
	let key: string;
	if (isImage || isDocument) {
		key = generateKey(FILE_STORAGE_PREFIX + activeMember.organizationId, '', data.contentType);
		// Fix the key format - generateKey adds owner as middle segment
		key = `${FILE_STORAGE_PREFIX}${activeMember.organizationId}/${key.split('/').pop()}`;
	} else {
		// For other allowed types, construct key manually
		const extension = getExtensionFromContentType(data.contentType);
		const { uuidv7 } = await import('uuidv7');
		key = `${FILE_STORAGE_PREFIX}${activeMember.organizationId}/${uuidv7()}.${extension}`;
	}

	const uploadUrl = await generateUploadUrl(key, data.contentType);

	logger.debug(
		{ contentType: data.contentType, size: data.size, visibility: data.visibility },
		'File upload prepared'
	);

	return { key, uploadUrl };
}

/**
 * Confirms a file upload and creates the file record
 */
export async function confirmFileUpload(data: z.infer<typeof confirmFileUploadSchema>) {
	const session = await getSession();
	const activeMember = await getActiveMember();
	requireFileCreatePermission(activeMember.role);

	// Validate key belongs to this organization
	validateKeyOwnership(data.key, activeMember.organizationId);

	// Create file record
	const [file] = await db
		.insert(schema.file)
		.values({
			name: data.name,
			key: data.key,
			contentType: data.contentType,
			size: data.size,
			visibility: data.visibility,
			organizationId: activeMember.organizationId,
			uploadedBy: session.user.id
		})
		.returning({ id: schema.file.id });

	const publicUrl = getPublicUrl(data.key);

	logger.info({ fileId: file.id, key: data.key }, 'File upload confirmed');

	return { success: true, fileId: file.id, url: publicUrl };
}

// ============================================================================
// File Operations
// ============================================================================

/**
 * Updates a file's metadata (name, visibility)
 */
export async function updateFile(data: z.infer<typeof updateFileSchema>) {
	const session = await getSession();
	const activeMember = await getActiveMember();

	// Get the file
	const file = await db.query.file.findFirst({
		where: eq(schema.file.id, data.fileId),
		columns: { id: true, uploadedBy: true, organizationId: true }
	});

	if (!file) {
		error(404, { message: 'File not found', code: 'NOT_FOUND' });
	}

	// Check organization membership
	if (file.organizationId !== activeMember.organizationId) {
		error(403, { message: 'File not found', code: 'FORBIDDEN' });
	}

	// Check permissions (owner or has update permission)
	const isOwner = file.uploadedBy === session.user.id;
	if (!canModifyFile(activeMember.role, isOwner)) {
		error(403, {
			message: 'You do not have permission to update this file',
			code: 'FORBIDDEN'
		});
	}

	// Build update object
	const updates: Partial<typeof schema.file.$inferInsert> = {};
	if (data.name !== undefined) updates.name = data.name;
	if (data.visibility !== undefined) updates.visibility = data.visibility;

	if (Object.keys(updates).length === 0) {
		return { success: true };
	}

	await db.update(schema.file).set(updates).where(eq(schema.file.id, data.fileId));

	logger.info({ fileId: data.fileId, updates: Object.keys(updates) }, 'File updated');

	return { success: true };
}

/**
 * Deletes a file
 */
export async function deleteFile(data: z.infer<typeof deleteFileSchema>) {
	const session = await getSession();
	const activeMember = await getActiveMember();

	// Get the file
	const file = await db.query.file.findFirst({
		where: eq(schema.file.id, data.fileId),
		columns: { id: true, key: true, uploadedBy: true, organizationId: true }
	});

	if (!file) {
		error(404, { message: 'File not found', code: 'NOT_FOUND' });
	}

	// Check organization membership
	if (file.organizationId !== activeMember.organizationId) {
		error(403, { message: 'File not found', code: 'FORBIDDEN' });
	}

	// Check permissions (owner or has delete permission)
	const isOwner = file.uploadedBy === session.user.id;
	if (!canRemoveFile(activeMember.role, isOwner)) {
		error(403, {
			message: 'You do not have permission to delete this file',
			code: 'FORBIDDEN'
		});
	}

	// Delete from storage
	await deleteObject(file.key).catch(() => {
		logger.warn({ key: file.key }, 'Failed to delete file from storage');
	});

	// Delete from database
	await db.delete(schema.file).where(eq(schema.file.id, data.fileId));

	logger.info({ fileId: data.fileId }, 'File deleted');

	return { success: true };
}

// ============================================================================
// Helpers
// ============================================================================

function getExtensionFromContentType(contentType: string): string {
	const extensionMap: Record<string, string> = {
		'image/png': 'png',
		'image/jpeg': 'jpg',
		'image/webp': 'webp',
		'image/gif': 'gif',
		'application/pdf': 'pdf',
		'application/msword': 'doc',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
		'application/vnd.ms-excel': 'xls',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
		'application/vnd.ms-powerpoint': 'ppt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
		'text/plain': 'txt',
		'text/csv': 'csv',
		'text/markdown': 'md',
		'application/zip': 'zip',
		'application/x-zip-compressed': 'zip'
	};

	return extensionMap[contentType] ?? 'bin';
}

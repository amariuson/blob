import { error } from '@sveltejs/kit';

import { getActiveMember, getSession } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { getPublicUrl } from '$services/storage';

import { and, desc, eq, lt, or } from 'drizzle-orm';
import type { z } from 'zod';

import { canReadFile } from '../../config/access-control';
import type { getFileSchema, listFilesSchema } from '../../schemas';
import type { FileInfo } from '../../types';

function requireFileReadPermission(role: string) {
	if (!canReadFile(role)) {
		error(403, {
			message: 'You do not have permission to view files',
			code: 'FORBIDDEN'
		});
	}
}

function mapToFileInfo(
	file: typeof schema.file.$inferSelect & {
		uploader: { id: string; name: string; image: string | null };
	}
): FileInfo {
	return {
		id: file.id,
		name: file.name,
		contentType: file.contentType,
		size: file.size,
		visibility: file.visibility,
		createdAt: file.createdAt,
		updatedAt: file.updatedAt,
		uploader: file.uploader
	};
}

/**
 * Get a single file by ID
 */
export async function getFile(data: z.infer<typeof getFileSchema>): Promise<FileInfo> {
	const session = await getSession();
	const activeMember = await getActiveMember();
	requireFileReadPermission(activeMember.role);

	const file = await db.query.file.findFirst({
		where: and(
			eq(schema.file.id, data.fileId),
			or(
				// User can see their own files
				eq(schema.file.uploadedBy, session.user.id),
				// Or organization files if they're a member
				and(
					eq(schema.file.organizationId, activeMember.organizationId),
					or(eq(schema.file.visibility, 'organization'), eq(schema.file.visibility, 'public'))
				)
			)
		),
		with: {
			uploader: {
				columns: { id: true, name: true, image: true }
			}
		}
	});

	if (!file) {
		error(404, { message: 'File not found', code: 'NOT_FOUND' });
	}

	return mapToFileInfo(file);
}

/**
 * Get the public URL for a file
 */
export async function getFileUrl(data: z.infer<typeof getFileSchema>): Promise<string> {
	const session = await getSession();
	const activeMember = await getActiveMember();
	requireFileReadPermission(activeMember.role);

	const file = await db.query.file.findFirst({
		where: and(
			eq(schema.file.id, data.fileId),
			or(
				eq(schema.file.uploadedBy, session.user.id),
				and(
					eq(schema.file.organizationId, activeMember.organizationId),
					or(eq(schema.file.visibility, 'organization'), eq(schema.file.visibility, 'public'))
				)
			)
		),
		columns: { key: true }
	});

	if (!file) {
		error(404, { message: 'File not found', code: 'NOT_FOUND' });
	}

	return getPublicUrl(file.key);
}

/**
 * List files for the current organization
 */
export async function listFiles(
	data: Partial<z.infer<typeof listFilesSchema>> = {}
): Promise<{ files: FileInfo[]; nextCursor: string | null }> {
	const session = await getSession();
	const activeMember = await getActiveMember();
	requireFileReadPermission(activeMember.role);

	const limit = data.limit ?? 20;

	// Build conditions
	const conditions = [
		or(
			// User's own files
			eq(schema.file.uploadedBy, session.user.id),
			// Organization files with appropriate visibility
			and(
				eq(schema.file.organizationId, activeMember.organizationId),
				or(eq(schema.file.visibility, 'organization'), eq(schema.file.visibility, 'public'))
			)
		)
	];

	// Filter by visibility if specified
	if (data.visibility) {
		conditions.push(eq(schema.file.visibility, data.visibility));
	}

	// Cursor pagination
	if (data.cursor) {
		const cursorFile = await db.query.file.findFirst({
			where: eq(schema.file.id, data.cursor),
			columns: { createdAt: true }
		});
		if (cursorFile) {
			conditions.push(lt(schema.file.createdAt, cursorFile.createdAt));
		}
	}

	const files = await db.query.file.findMany({
		where: and(...conditions),
		with: {
			uploader: {
				columns: { id: true, name: true, image: true }
			}
		},
		orderBy: [desc(schema.file.createdAt)],
		limit: limit + 1 // Fetch one extra to determine if there's more
	});

	const hasMore = files.length > limit;
	const resultFiles = hasMore ? files.slice(0, limit) : files;
	const nextCursor = hasMore ? resultFiles[resultFiles.length - 1].id : null;

	return {
		files: resultFiles.map(mapToFileInfo),
		nextCursor
	};
}

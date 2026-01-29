import { z } from 'zod';

import { FILE_UPLOAD_CONFIG, isAllowedFileType } from './constants';

// ============================================================================
// Upload
// ============================================================================

export const prepareFileUploadSchema = z.object({
	name: z.string().min(1, 'File name is required').max(255, 'File name is too long'),
	contentType: z.string().refine(isAllowedFileType, 'File type not allowed'),
	size: z
		.number()
		.positive('File size must be positive')
		.max(FILE_UPLOAD_CONFIG.maxSizeBytes, 'File size exceeds maximum allowed'),
	visibility: z.enum(['private', 'organization', 'public']).default('organization')
});

export const confirmFileUploadSchema = z.object({
	key: z.string().min(1, 'Storage key is required'),
	name: z.string().min(1, 'File name is required').max(255, 'File name is too long'),
	contentType: z.string().min(1, 'Content type is required'),
	size: z.number().positive('File size must be positive'),
	visibility: z.enum(['private', 'organization', 'public']).default('organization')
});

// ============================================================================
// File Operations
// ============================================================================

export const getFileSchema = z.object({
	fileId: z.string().uuid('Invalid file ID')
});

export const updateFileSchema = z.object({
	fileId: z.string().uuid('Invalid file ID'),
	name: z.string().min(1, 'File name is required').max(255, 'File name is too long').optional(),
	visibility: z.enum(['private', 'organization', 'public']).optional()
});

export const deleteFileSchema = z.object({
	fileId: z.string().uuid('Invalid file ID')
});

// ============================================================================
// Listing
// ============================================================================

export const listFilesSchema = z.object({
	cursor: z.string().uuid().optional(),
	limit: z.number().min(1).max(100).optional().default(20),
	visibility: z.enum(['private', 'organization', 'public']).optional()
});

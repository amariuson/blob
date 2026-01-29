import { command, form, query } from '$app/server';

import {
	confirmFileUploadSchema,
	deleteFileSchema,
	getFileSchema,
	prepareFileUploadSchema,
	updateFileSchema
} from '../schemas';
import {
	confirmFileUpload,
	deleteFile,
	prepareFileUpload,
	updateFile
} from '../server/api/mutations';
import { getFile, getFileUrl, listFiles } from '../server/api/queries';

// ============================================================================
// QUERIES
// ============================================================================

export const listFilesQuery = query(listFiles);

// ============================================================================
// COMMANDS (for operations that require parameters)
// ============================================================================

export const getFileCommand = command(getFileSchema, getFile);

export const getFileUrlCommand = command(getFileSchema, getFileUrl);

// ============================================================================
// COMMANDS
// ============================================================================

export const prepareFileUploadCommand = command(prepareFileUploadSchema, prepareFileUpload);

export const confirmFileUploadCommand = command(confirmFileUploadSchema, confirmFileUpload);

export const deleteFileCommand = command(deleteFileSchema, deleteFile);

// ============================================================================
// FORMS
// ============================================================================

export const updateFileForm = form(updateFileSchema, updateFile);

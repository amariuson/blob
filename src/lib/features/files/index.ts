// Client-safe public API
// Export: schemas, types, constants, logic utilities, components
// Do NOT export: server-only code (use $features/files/server)
// Do NOT export: remote functions (use $features/files/remote)

// Schemas (for client-side validation)
export {
	confirmFileUploadSchema,
	deleteFileSchema,
	getFileSchema,
	listFilesSchema,
	prepareFileUploadSchema,
	updateFileSchema
} from './schemas';

// Types
export type {
	FileInfo,
	FileUploadConfig,
	FileUploadResult,
	UploadProgress as UploadProgressState
} from './types';

// Constants
export {
	FILE_UPLOAD_CONFIG,
	FILE_TYPE_LABELS,
	VISIBILITY_LABELS,
	VISIBILITY_DESCRIPTIONS,
	getFileTypeCategory,
	getFileTypeLabel,
	isAllowedFileType,
	type FileTypeCategory
} from './constants';

// State (client-side upload management)
export { uploadState, uploadFile, uploadFiles, validateFile } from './state/upload-state.svelte';

// Components
export { FileUploader, FileList, FileItem, UploadProgress, VisibilitySelect } from './components';

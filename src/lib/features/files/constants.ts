import type { FileUploadConfig } from './types';

// ============================================================================
// Upload Configuration
// ============================================================================

export const FILE_UPLOAD_CONFIG: FileUploadConfig = {
	maxSizeBytes: 50 * 1024 * 1024, // 50MB
	allowedTypes: [
		// Images
		'image/png',
		'image/jpeg',
		'image/webp',
		'image/gif',
		// Documents
		'application/pdf',
		'application/msword',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'application/vnd.ms-excel',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		'application/vnd.ms-powerpoint',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation',
		// Text
		'text/plain',
		'text/csv',
		'text/markdown',
		// Archives
		'application/zip',
		'application/x-zip-compressed'
	]
};

// Storage prefix for files
export const FILE_STORAGE_PREFIX = 'files/';

// ============================================================================
// File Type Helpers
// ============================================================================

export function isAllowedFileType(contentType: string): boolean {
	return FILE_UPLOAD_CONFIG.allowedTypes.includes(contentType);
}

// Human-readable file type categories
export const FILE_TYPE_LABELS: Record<string, string> = {
	'image/png': 'PNG Image',
	'image/jpeg': 'JPEG Image',
	'image/webp': 'WebP Image',
	'image/gif': 'GIF Image',
	'application/pdf': 'PDF Document',
	'application/msword': 'Word Document',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document',
	'application/vnd.ms-excel': 'Excel Spreadsheet',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel Spreadsheet',
	'application/vnd.ms-powerpoint': 'PowerPoint Presentation',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation':
		'PowerPoint Presentation',
	'text/plain': 'Text File',
	'text/csv': 'CSV File',
	'text/markdown': 'Markdown File',
	'application/zip': 'ZIP Archive',
	'application/x-zip-compressed': 'ZIP Archive'
};

export function getFileTypeLabel(contentType: string): string {
	return FILE_TYPE_LABELS[contentType] ?? 'File';
}

// File type category for icons
export type FileTypeCategory =
	| 'image'
	| 'document'
	| 'spreadsheet'
	| 'presentation'
	| 'archive'
	| 'text'
	| 'other';

export function getFileTypeCategory(contentType: string): FileTypeCategory {
	if (contentType.startsWith('image/')) return 'image';
	if (contentType.includes('pdf') || contentType.includes('word')) return 'document';
	if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'spreadsheet';
	if (contentType.includes('powerpoint') || contentType.includes('presentation'))
		return 'presentation';
	if (contentType.includes('zip')) return 'archive';
	if (contentType.startsWith('text/')) return 'text';
	return 'other';
}

// ============================================================================
// Visibility Labels
// ============================================================================

export const VISIBILITY_LABELS = {
	private: 'Private',
	organization: 'Organization',
	public: 'Public'
} as const;

export const VISIBILITY_DESCRIPTIONS = {
	private: 'Only you can access this file',
	organization: 'All organization members can access this file',
	public: 'Anyone with the link can access this file'
} as const;

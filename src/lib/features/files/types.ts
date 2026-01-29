import type { FileVisibility } from '$lib/server/db/schema';

// File metadata returned from queries
export interface FileInfo {
	id: string;
	name: string;
	contentType: string;
	size: number;
	visibility: FileVisibility;
	createdAt: Date;
	updatedAt: Date;
	uploader: {
		id: string;
		name: string;
		image: string | null;
	};
}

// Result from preparing an upload
export interface FileUploadResult {
	key: string;
	uploadUrl: string;
}

// Upload progress state
export interface UploadProgress {
	fileId: string;
	fileName: string;
	progress: number; // 0-100
	status: 'pending' | 'uploading' | 'confirming' | 'completed' | 'error';
	error?: string;
}

// File upload config
export interface FileUploadConfig {
	maxSizeBytes: number;
	allowedTypes: string[];
}

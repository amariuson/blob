import { uuidv7 } from 'uuidv7';

import type { FileVisibility } from '$lib/server/db/schema';

import { FILE_UPLOAD_CONFIG, isAllowedFileType } from '../constants';
import { confirmFileUploadCommand, prepareFileUploadCommand } from '../remote/index';
import type { UploadProgress } from '../types';

// ============================================================================
// Upload State
// ============================================================================

function createUploadState() {
	let uploads = $state<Map<string, UploadProgress>>(new Map());

	return {
		get uploads() {
			return uploads;
		},

		get activeUploads() {
			return Array.from(uploads.values()).filter(
				(u) => u.status === 'pending' || u.status === 'uploading' || u.status === 'confirming'
			);
		},

		get completedUploads() {
			return Array.from(uploads.values()).filter((u) => u.status === 'completed');
		},

		get failedUploads() {
			return Array.from(uploads.values()).filter((u) => u.status === 'error');
		},

		getUpload(id: string) {
			return uploads.get(id);
		},

		addUpload(fileName: string): string {
			const id = uuidv7();
			uploads.set(id, {
				fileId: id,
				fileName,
				progress: 0,
				status: 'pending'
			});
			return id;
		},

		updateUpload(id: string, update: Partial<UploadProgress>) {
			const existing = uploads.get(id);
			if (existing) {
				uploads.set(id, { ...existing, ...update });
			}
		},

		removeUpload(id: string) {
			uploads.delete(id);
		},

		clearCompleted() {
			for (const [id, upload] of uploads) {
				if (upload.status === 'completed') {
					uploads.delete(id);
				}
			}
		},

		clearFailed() {
			for (const [id, upload] of uploads) {
				if (upload.status === 'error') {
					uploads.delete(id);
				}
			}
		},

		clearAll() {
			uploads.clear();
		}
	};
}

export const uploadState = createUploadState();

// ============================================================================
// Upload Functions
// ============================================================================

export interface UploadFileOptions {
	file: File;
	visibility?: FileVisibility;
	onProgress?: (progress: number) => void;
	onSuccess?: (fileId: string, url: string) => void;
	onError?: (error: string) => void;
}

/**
 * Validates a file before upload
 */
export function validateFile(file: File): { valid: true } | { valid: false; error: string } {
	if (!isAllowedFileType(file.type)) {
		return { valid: false, error: 'File type not allowed' };
	}

	if (file.size > FILE_UPLOAD_CONFIG.maxSizeBytes) {
		const maxMB = FILE_UPLOAD_CONFIG.maxSizeBytes / (1024 * 1024);
		return { valid: false, error: `File size must be under ${maxMB}MB` };
	}

	return { valid: true };
}

/**
 * Uploads a file to storage
 */
export async function uploadFile(options: UploadFileOptions): Promise<{
	success: boolean;
	fileId?: string;
	url?: string;
	error?: string;
}> {
	const { file, visibility = 'organization', onProgress, onSuccess, onError } = options;

	// Validate file
	const validation = validateFile(file);
	if (!validation.valid) {
		onError?.(validation.error);
		return { success: false, error: validation.error };
	}

	// Add to upload state
	const uploadId = uploadState.addUpload(file.name);

	try {
		// Step 1: Prepare upload (get presigned URL)
		uploadState.updateUpload(uploadId, { status: 'uploading', progress: 10 });
		onProgress?.(10);

		const prepareResult = await prepareFileUploadCommand({
			name: file.name,
			contentType: file.type,
			size: file.size,
			visibility
		});

		// Step 2: Upload to storage
		uploadState.updateUpload(uploadId, { progress: 30 });
		onProgress?.(30);

		const uploadResponse = await fetch(prepareResult.uploadUrl, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': file.type
			}
		});

		if (!uploadResponse.ok) {
			throw new Error('Failed to upload file to storage');
		}

		uploadState.updateUpload(uploadId, { progress: 70 });
		onProgress?.(70);

		// Step 3: Confirm upload
		uploadState.updateUpload(uploadId, { status: 'confirming', progress: 80 });
		onProgress?.(80);

		const confirmResult = await confirmFileUploadCommand({
			key: prepareResult.key,
			name: file.name,
			contentType: file.type,
			size: file.size,
			visibility
		});

		// Success
		uploadState.updateUpload(uploadId, {
			fileId: confirmResult.fileId,
			status: 'completed',
			progress: 100
		});
		onProgress?.(100);
		onSuccess?.(confirmResult.fileId, confirmResult.url);

		return {
			success: true,
			fileId: confirmResult.fileId,
			url: confirmResult.url
		};
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Upload failed';
		uploadState.updateUpload(uploadId, {
			status: 'error',
			error: errorMessage
		});
		onError?.(errorMessage);
		return { success: false, error: errorMessage };
	}
}

/**
 * Uploads multiple files
 */
export async function uploadFiles(
	files: File[],
	options: Omit<UploadFileOptions, 'file'> = {}
): Promise<{ successful: string[]; failed: string[] }> {
	const results = await Promise.allSettled(files.map((file) => uploadFile({ ...options, file })));

	const successful: string[] = [];
	const failed: string[] = [];

	results.forEach((result, index) => {
		if (result.status === 'fulfilled' && result.value.success && result.value.fileId) {
			successful.push(result.value.fileId);
		} else {
			failed.push(files[index].name);
		}
	});

	return { successful, failed };
}

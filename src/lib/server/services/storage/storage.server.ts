import { env } from '$env/dynamic/private';

import { createLogger } from '$services/logger';
import { setSpanAttributes,withSpan } from '$services/tracing';

import { uuidv7 } from 'uuidv7';
import { DeleteObjectCommand,PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Module-specific logger for better observability
const log = createLogger({ module: 'storage' });

// Validate R2 environment variables at module load (fail-fast)
const requiredEnvVars = [
	'R2_ACCOUNT_ID',
	'R2_ACCESS_KEY_ID',
	'R2_SECRET_ACCESS_KEY',
	'R2_BUCKET_NAME',
	'R2_PUBLIC_URL'
] as const;

for (const varName of requiredEnvVars) {
	if (!env[varName]) {
		throw new Error(`${varName} environment variable is required`);
	}
}

const R2_ACCOUNT_ID = env.R2_ACCOUNT_ID!;
const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID!;
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY!;
const R2_BUCKET_NAME = env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = env.R2_PUBLIC_URL!.replace(/\/+$/, ''); // Normalize: remove trailing slashes

const DEFAULT_PRESIGNED_URL_EXPIRATION = 300; // 5 minutes

// Initialize S3 client directly (env vars already validated)
const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY
	}
});

// Allowed content types for different upload categories
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'] as const;

// MIME type to file extension mapping (only types that are actually allowed)
const MIME_TO_EXTENSION: Record<string, string> = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/webp': 'webp',
	'application/pdf': 'pdf'
};

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
export type AllowedDocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];

/**
 * Check if content type is an allowed image type
 */
export function isAllowedImageType(contentType: string): contentType is AllowedImageType {
	return ALLOWED_IMAGE_TYPES.includes(contentType as AllowedImageType);
}

/**
 * Check if content type is an allowed document type
 */
export function isAllowedDocumentType(contentType: string): contentType is AllowedDocumentType {
	return ALLOWED_DOCUMENT_TYPES.includes(contentType as AllowedDocumentType);
}

/**
 * Validate file size against a maximum
 */
export function validateFileSize(
	size: number,
	maxBytes: number
): { valid: true } | { valid: false; error: string } {
	if (size <= 0) {
		return { valid: false, error: 'File is empty' };
	}
	if (size > maxBytes) {
		const maxMB = Math.round(maxBytes / (1024 * 1024));
		return { valid: false, error: `File must be less than ${maxMB}MB` };
	}
	return { valid: true };
}

/**
 * Generate a storage key for a file
 * @param prefix - The prefix/folder (e.g., 'avatars', 'org-logos', 'documents')
 * @param ownerId - The owner ID (userId or orgId)
 * @param contentType - The content type to determine extension
 * @throws Error if content type is not in the allowed MIME_TO_EXTENSION mapping
 */
export function generateKey(prefix: string, ownerId: string, contentType: string): string {
	const extension = MIME_TO_EXTENSION[contentType];
	if (!extension) {
		throw new Error(`Unsupported content type: ${contentType}`);
	}
	return `${prefix}/${ownerId}/${uuidv7()}.${extension}`;
}

/**
 * Generate a presigned URL for uploading a file directly to R2.
 * Wrapped in a span for observability.
 */
export async function generateUploadUrl(
	key: string,
	contentType: string,
	options?: { expiresIn?: number }
): Promise<string> {
	return withSpan(
		'r2.generateUploadUrl',
		{
			'storage.key': key,
			'storage.content_type': contentType,
			'storage.bucket': R2_BUCKET_NAME
		},
		async () => {
			const expiresIn = options?.expiresIn ?? DEFAULT_PRESIGNED_URL_EXPIRATION;

			setSpanAttributes({ 'storage.expires_in': expiresIn });
			log.debug({ key, contentType, expiresIn }, 'Generating presigned upload URL');

			const command = new PutObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key,
				ContentType: contentType
			});

			try {
				const url = await getSignedUrl(r2Client, command, { expiresIn });
				log.info({ key, contentType }, 'Upload URL generated');
				return url;
			} catch (error) {
				log.error({ key, contentType, error }, 'Failed to generate upload URL');
				throw new StorageError('Failed to generate upload URL', { cause: error });
			}
		}
	);
}

/**
 * Get the public URL for a stored object
 */
export function getPublicUrl(key: string): string {
	return `${R2_PUBLIC_URL}/${key}`;
}

/**
 * Delete an object from R2.
 * Wrapped in a span for observability.
 */
export async function deleteObject(key: string): Promise<void> {
	return withSpan(
		'r2.deleteObject',
		{
			'storage.key': key,
			'storage.bucket': R2_BUCKET_NAME
		},
		async () => {
			log.debug({ key }, 'Deleting object from R2');

			const command = new DeleteObjectCommand({
				Bucket: R2_BUCKET_NAME,
				Key: key
			});

			try {
				await r2Client.send(command);
				log.info({ key }, 'Object deleted from R2');
			} catch (error) {
				log.error({ key, error }, 'Failed to delete object from R2');
				throw new StorageError('Failed to delete object', { cause: error });
			}
		}
	);
}

/**
 * Extract the storage key from a public URL
 * Returns null if the URL is not from R2 (e.g., OAuth provider avatar)
 */
export function extractKeyFromUrl(url: string): string | null {
	if (!url.startsWith(R2_PUBLIC_URL)) {
		return null;
	}
	return url.replace(`${R2_PUBLIC_URL}/`, '');
}

/**
 * Check if a URL is from R2 storage
 */
export function isR2Url(url: string): boolean {
	return url.startsWith(R2_PUBLIC_URL);
}

/**
 * Custom error class for storage operations.
 * Preserves the original error as `cause` for debugging while providing
 * a clean message for consumers.
 */
export class StorageError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = 'StorageError';
	}
}

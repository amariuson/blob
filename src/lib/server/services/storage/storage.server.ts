import { env } from '$env/dynamic/private';

import { createLogger } from '$services/logger';
import { withSpan } from '$services/tracing';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import * as logic from './logic';

const log = createLogger({ module: 'storage' });

const requiredEnvVars = [
	'R2_ACCOUNT_ID',
	'R2_ACCESS_KEY_ID',
	'R2_SECRET_ACCESS_KEY',
	'R2_BUCKET_NAME',
	'R2_PUBLIC_URL'
] as const;

for (const varName of requiredEnvVars) {
	if (!env[varName]) throw new Error(`${varName} environment variable is required`);
}

const R2_BUCKET_NAME = env.R2_BUCKET_NAME!;
const R2_PUBLIC_URL = env.R2_PUBLIC_URL!.replace(/\/+$/, '');
const DEFAULT_PRESIGNED_URL_EXPIRATION = 300;

const r2Client = new S3Client({
	region: 'auto',
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY_ID!,
		secretAccessKey: env.R2_SECRET_ACCESS_KEY!
	}
});

export class StorageError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = 'StorageError';
	}
}

export async function generateUploadUrl(
	key: string,
	contentType: string,
	options?: { expiresIn?: number }
): Promise<string> {
	const expiresIn = options?.expiresIn ?? DEFAULT_PRESIGNED_URL_EXPIRATION;

	return withSpan(
		'r2.generateUploadUrl',
		{
			'storage.key': key,
			'storage.content_type': contentType,
			'storage.bucket': R2_BUCKET_NAME,
			'storage.expires_in': expiresIn
		},
		async () => {
			try {
				const url = await getSignedUrl(
					r2Client,
					new PutObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key, ContentType: contentType }),
					{ expiresIn }
				);
				log.info({ key, contentType }, 'Upload URL generated');
				return url;
			} catch (error) {
				log.error({ key, contentType, err: error }, 'Failed to generate upload URL');
				throw new StorageError('Failed to generate upload URL', { cause: error });
			}
		}
	);
}

export async function deleteObject(key: string): Promise<void> {
	return withSpan(
		'r2.deleteObject',
		{ 'storage.key': key, 'storage.bucket': R2_BUCKET_NAME },
		async () => {
			try {
				await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
				log.info({ key }, 'Object deleted');
			} catch (error) {
				log.error({ key, err: error }, 'Failed to delete object');
				throw new StorageError('Failed to delete object', { cause: error });
			}
		}
	);
}

export function getPublicUrl(key: string): string {
	return logic.buildPublicUrl(R2_PUBLIC_URL, key);
}

export function extractKeyFromUrl(url: string): string | null {
	return logic.extractKeyFromUrl(R2_PUBLIC_URL, url);
}

export function isR2Url(url: string): boolean {
	return logic.isR2Url(R2_PUBLIC_URL, url);
}

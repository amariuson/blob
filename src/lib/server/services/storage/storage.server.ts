import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { requireS3 } from '$lib/server/env.server';

let cached: { client: S3Client; bucket: string } | null = null;

function getClient(): { client: S3Client; bucket: string } {
	if (cached) return cached;
	const { S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY } = requireS3();
	cached = {
		client: new S3Client({
			endpoint: S3_ENDPOINT,
			region: S3_REGION,
			credentials: {
				accessKeyId: S3_ACCESS_KEY_ID,
				secretAccessKey: S3_SECRET_ACCESS_KEY
			},
			forcePathStyle: true
		}),
		bucket: S3_BUCKET
	};
	return cached;
}

export async function uploadObject(key: string, body: Uint8Array, contentType?: string) {
	const { client, bucket } = getClient();
	await client.send(
		new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: contentType })
	);
}

export async function getObject(key: string) {
	const { client, bucket } = getClient();
	const res = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
	return res.Body;
}

export async function getPresignedUploadUrl(key: string, contentType: string, expiresIn = 300) {
	const { client, bucket } = getClient();
	return await getSignedUrl(
		client,
		new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
		{ expiresIn }
	);
}

export async function getPresignedDownloadUrl(key: string, expiresIn = 300) {
	const { client, bucket } = getClient();
	return await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), {
		expiresIn
	});
}

export async function deleteObject(key: string) {
	const { client, bucket } = getClient();
	await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

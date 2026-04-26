import { uuidv7 } from 'uuidv7';

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'] as const;

const MIME_TO_EXTENSION: Record<string, string> = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/webp': 'webp',
	'application/pdf': 'pdf'
};

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
export type AllowedDocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];

export function isAllowedImageType(contentType: string): contentType is AllowedImageType {
	return ALLOWED_IMAGE_TYPES.includes(contentType as AllowedImageType);
}

export function isAllowedDocumentType(contentType: string): contentType is AllowedDocumentType {
	return ALLOWED_DOCUMENT_TYPES.includes(contentType as AllowedDocumentType);
}

export function validateFileSize(
	size: number,
	maxBytes: number
): { valid: true } | { valid: false; error: string } {
	if (size <= 0) return { valid: false, error: 'File is empty' };
	if (size > maxBytes) {
		const maxMB = Math.round(maxBytes / (1024 * 1024));
		return { valid: false, error: `File must be less than ${maxMB}MB` };
	}
	return { valid: true };
}

export function generateKey(prefix: string, ownerId: string, contentType: string): string {
	const extension = MIME_TO_EXTENSION[contentType];
	if (!extension) {
		throw new Error(`Unsupported content type: ${contentType}`);
	}
	return `${prefix}/${ownerId}/${uuidv7()}.${extension}`;
}

export function buildPublicUrl(publicBase: string, key: string): string {
	return `${publicBase}/${key}`;
}

export function extractKeyFromUrl(publicBase: string, url: string): string | null {
	if (!url.startsWith(publicBase)) return null;
	return url.replace(`${publicBase}/`, '');
}

export function isR2Url(publicBase: string, url: string): boolean {
	return url.startsWith(publicBase);
}

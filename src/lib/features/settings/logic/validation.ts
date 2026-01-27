/**
 * Pure validation functions for settings feature.
 */

import { env } from '$env/dynamic/public';

// ============================================================================
// Image Validation
// ============================================================================

/**
 * Checks if a URL is from R2 storage (custom uploaded image).
 * Returns false for OAuth provider images (Google, GitHub avatars).
 */
export function isCustomImage(imageUrl: string | null): boolean {
	if (!imageUrl) return false;

	const publicUrl = env.PUBLIC_R2_URL;
	if (!publicUrl) return false;

	return imageUrl.startsWith(publicUrl);
}

/**
 * Validates file type for image upload.
 */
export function isValidImageType(contentType: string): boolean {
	const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
	return allowedTypes.includes(contentType);
}

/**
 * Validates file size for image upload.
 */
export function isValidFileSize(sizeBytes: number, maxBytes: number): boolean {
	return sizeBytes > 0 && sizeBytes <= maxBytes;
}

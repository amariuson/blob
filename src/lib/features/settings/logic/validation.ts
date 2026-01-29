/**
 * Pure validation functions for settings feature.
 */

// ============================================================================
// Image Validation
// ============================================================================

/**
 * Validates file type for image upload.
 */
export function isValidImageType(contentType: string): boolean {
	const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
	return allowedTypes.includes(contentType);
}

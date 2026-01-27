import { IMAGE_UPLOAD_CONFIG } from '$lib/shared/utils';

import { z } from 'zod';

import { isValidImageType } from './logic/validation';

// ============================================================================
// Profile
// ============================================================================

export const updateProfileSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long')
});

// ============================================================================
// Preferences
// ============================================================================

export const updatePreferencesSchema = z.object({
	language: z.string().min(1),
	timezone: z.string().min(1),
	dateFormat: z.string().min(1),
	timeFormat: z.enum(['12h', '24h'])
});

// Form checkbox values come as 'on' or missing (undefined)
const formBoolean = z
	.string()
	.optional()
	.transform((v) => v === 'on' || v === 'true');

export const updateNotificationsSchema = z.object({
	emailNotifications: formBoolean,
	marketingEmails: formBoolean,
	securityAlerts: formBoolean,
	productUpdates: formBoolean
});

// ============================================================================
// Images
// ============================================================================

export const prepareImageUploadSchema = z.object({
	type: z.enum(['avatar', 'org-logo']),
	contentType: z.string().refine(isValidImageType, 'Invalid image type'),
	size: z
		.number()
		.positive()
		.max(IMAGE_UPLOAD_CONFIG.maxSizeBytes, 'File size exceeds maximum allowed')
});

export const confirmImageUploadSchema = z.object({
	type: z.enum(['avatar', 'org-logo']),
	key: z.string().min(1, 'Key is required')
});

export const removeImageSchema = z.object({
	type: z.enum(['avatar', 'org-logo'])
});

// ============================================================================
// Sessions
// ============================================================================

export const revokeSessionSchema = z.object({
	sessionToken: z.string()
});

export const revokeAllOtherSessionsSchema = z.object({});

// ============================================================================
// Organization
// ============================================================================

export const updateOrganizationSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
	slug: z
		.string()
		.min(1, 'Slug is required')
		.max(50, 'Slug is too long')
		.regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
	email: z.string().email().optional().or(z.literal(''))
});

// ============================================================================
// Billing
// ============================================================================

export const updateBillingInfoSchema = z.object({
	line1: z.string().max(200).optional().or(z.literal('')),
	line2: z.string().max(200).optional().or(z.literal('')),
	city: z.string().max(100).optional().or(z.literal('')),
	state: z.string().max(100).optional().or(z.literal('')),
	postalCode: z.string().max(20).optional().or(z.literal('')),
	country: z.string().max(2).optional().or(z.literal(''))
});

// ============================================================================
// Invitations
// ============================================================================

export const inviteMemberSchema = z.object({
	email: z.string().email('Invalid email address'),
	role: z.enum(['member', 'admin'])
});

export const cancelInvitationSchema = z.object({
	invitationId: z.string().uuid()
});

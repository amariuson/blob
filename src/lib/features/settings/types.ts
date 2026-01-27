import type { Entitlements } from '$lib/shared/types/entitlements';

// Billing address (mirrors $lib/server/db/schema.BillingAddress)
export interface BillingAddress {
	line1?: string | null;
	line2?: string | null;
	city?: string | null;
	state?: string | null;
	postalCode?: string | null;
	country?: string | null;
}

// Preferences types (mirrors userPreferences table columns)
export interface UserPreferences {
	language: string;
	timezone: string;
	dateFormat: string;
	timeFormat: string;
}

export interface NotificationPreferences {
	emailNotifications: boolean;
	marketingEmails: boolean;
	securityAlerts: boolean;
	productUpdates: boolean;
}

// View models — composed from multiple tables with computed fields
export interface UserProfile {
	id: string;
	name: string;
	email: string;
	image: string | null;
	emailVerified: boolean;
	createdAt: Date;
	providers: { providerId: string }[];
	hasCustomImage: boolean;
}

export interface ParsedUserAgent {
	browser: string | null;
	os: string | null;
	device: string | null;
}

export interface SessionInfo {
	id: string;
	token: string;
	userAgent: string | null;
	ipAddress: string | null;
	createdAt: Date;
	isCurrent: boolean;
	parsedUserAgent: ParsedUserAgent;
}

export interface OrganizationSettings {
	id: string;
	name: string;
	slug: string;
	email: string | null;
	logo: string | null;
	hasCustomLogo: boolean;
	createdAt: Date;
}

export interface BillingInfo {
	billingAddress: BillingAddress | null;
	entitlements: Entitlements | null;
}

export interface MemberInfo {
	id: string;
	userId: string;
	name: string;
	email: string;
	image: string | null;
	role: string;
}

export interface InvitationInfo {
	id: string;
	email: string;
	role: string | null;
	status: string;
	expiresAt: Date;
}

export interface ImageUploadResult {
	key: string;
	uploadUrl: string;
}

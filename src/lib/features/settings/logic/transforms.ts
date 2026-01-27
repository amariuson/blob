/**
 * Pure transform functions for settings feature.
 */

import type { ParsedUserAgent } from '../types';

// ============================================================================
// User Agent Parsing
// ============================================================================

/**
 * Parses a user agent string to extract browser, OS, and device info.
 */
export function parseUserAgent(userAgent: string | null): ParsedUserAgent {
	if (!userAgent) {
		return { browser: null, os: null, device: null };
	}

	return {
		browser: detectBrowser(userAgent),
		os: detectOS(userAgent),
		device: detectDevice(userAgent)
	};
}

function detectBrowser(ua: string): string | null {
	// Order matters - check more specific patterns first
	if (ua.includes('Edg/')) return 'Microsoft Edge';
	if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
	if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Google Chrome';
	if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
	if (ua.includes('Firefox/')) return 'Firefox';
	if (ua.includes('MSIE') || ua.includes('Trident/')) return 'Internet Explorer';
	return null;
}

function detectOS(ua: string): string | null {
	if (ua.includes('Windows NT 10')) return 'Windows 10/11';
	if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
	if (ua.includes('Windows NT 6.2')) return 'Windows 8';
	if (ua.includes('Windows NT 6.1')) return 'Windows 7';
	if (ua.includes('Windows')) return 'Windows';
	if (ua.includes('Mac OS X')) return 'macOS';
	if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
	if (ua.includes('Android')) return 'Android';
	if (ua.includes('Linux')) return 'Linux';
	if (ua.includes('CrOS')) return 'Chrome OS';
	return null;
}

function detectDevice(ua: string): string | null {
	if (ua.includes('iPhone')) return 'iPhone';
	if (ua.includes('iPad')) return 'iPad';
	if (ua.includes('Android') && ua.includes('Mobile')) return 'Android Phone';
	if (ua.includes('Android')) return 'Android Tablet';
	if (ua.includes('Mobile')) return 'Mobile';
	if (
		ua.includes('Windows') ||
		ua.includes('Mac OS') ||
		ua.includes('Linux') ||
		ua.includes('CrOS')
	) {
		return 'Desktop';
	}
	return null;
}

// ============================================================================
// Provider Display Names
// ============================================================================

const PROVIDER_DISPLAY_NAMES: Record<string, string> = {
	google: 'Google',
	github: 'GitHub',
	apple: 'Apple',
	microsoft: 'Microsoft',
	facebook: 'Facebook',
	twitter: 'Twitter',
	discord: 'Discord',
	credential: 'Email & Password',
	email: 'Email (Magic Link)'
};

/**
 * Gets the display name for a provider ID.
 */
export function getProviderDisplayName(providerId: string): string {
	return PROVIDER_DISPLAY_NAMES[providerId] ?? capitalizeFirst(providerId);
}

function capitalizeFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// Role Display
// ============================================================================

const ROLE_DISPLAY_INFO: Record<string, { label: string; variant: 'default' | 'secondary' }> = {
	owner: { label: 'Owner', variant: 'default' },
	admin: { label: 'Admin', variant: 'secondary' },
	member: { label: 'Member', variant: 'secondary' }
};

/**
 * Gets display info for a role.
 */
export function getRoleDisplayInfo(role: string): {
	label: string;
	variant: 'default' | 'secondary';
} {
	return ROLE_DISPLAY_INFO[role] ?? { label: capitalizeFirst(role), variant: 'secondary' };
}

// ============================================================================
// Session Display
// ============================================================================

/**
 * Formats a parsed user agent for display.
 */
export function formatSessionInfo(parsed: ParsedUserAgent): string {
	const parts: string[] = [];

	if (parsed.browser) parts.push(parsed.browser);
	if (parsed.os) parts.push(`on ${parsed.os}`);

	return parts.length > 0 ? parts.join(' ') : 'Unknown device';
}

/**
 * Gets a short device description.
 */
export function getDeviceDescription(parsed: ParsedUserAgent): string {
	if (parsed.device) return parsed.device;
	if (parsed.os) return parsed.os;
	return 'Unknown';
}

/**
 * Pure transform functions for settings feature.
 */

import { format } from 'date-fns';

import type { ParsedUserAgent, UserPreferences } from '../types';

// ============================================================================
// Date Formatting
// ============================================================================

const DATE_FORMAT_MAP: Record<string, string> = {
	'MM/DD/YYYY': 'MM/dd/yyyy',
	'DD/MM/YYYY': 'dd/MM/yyyy',
	'YYYY-MM-DD': 'yyyy-MM-dd',
	'DD.MM.YYYY': 'dd.MM.yyyy'
};

const TIME_FORMAT_MAP: Record<string, string> = {
	'12h': 'h:mm a',
	'24h': 'HH:mm'
};

export function formatLongDate(date: Date | string): string {
	return format(new Date(date), 'MMMM d, yyyy');
}

export function formatDateTime(
	date: Date | string,
	prefs?: Pick<UserPreferences, 'dateFormat' | 'timeFormat'>
): string {
	const dateFmt = (prefs?.dateFormat && DATE_FORMAT_MAP[prefs.dateFormat]) ?? 'MMM d, yyyy';
	const timeFmt = (prefs?.timeFormat && TIME_FORMAT_MAP[prefs.timeFormat]) ?? 'h:mm a';
	return format(new Date(date), `${dateFmt} ${timeFmt}`);
}

export function formatDate(
	date: Date | string,
	prefs?: Pick<UserPreferences, 'dateFormat'>
): string {
	const dateFmt = (prefs?.dateFormat && DATE_FORMAT_MAP[prefs.dateFormat]) ?? 'MMM d, yyyy';
	return format(new Date(date), dateFmt);
}

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
	if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
	if (ua.includes('Mac OS X')) return 'macOS';
	if (ua.includes('Android')) return 'Android';
	if (ua.includes('CrOS')) return 'Chrome OS';
	if (ua.includes('Linux')) return 'Linux';
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

import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { env } from '$env/dynamic/public';

import { rolesWithPermission } from '$features/auth';
import { auth, getActiveMember, getSession } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';

import { and, eq } from 'drizzle-orm';

import { parseUserAgent } from '../../logic/transforms';
import type {
	BillingInfo,
	InvitationInfo,
	MemberInfo,
	OrganizationSettings,
	SessionInfo,
	UserProfile,
	UserSettings
} from '../../types';

const INVITATION_READ_ROLES = rolesWithPermission('invitation', 'read');
const BILLING_READ_ROLES = rolesWithPermission('billing', 'read');

function isCustomImage(imageUrl: string | null): boolean {
	if (!imageUrl) return false;
	const publicUrl = env.PUBLIC_R2_URL;
	if (!publicUrl) return false;
	return imageUrl.startsWith(publicUrl);
}

// ============================================================================
// User Profile Queries
// ============================================================================

/**
 * Gets the current user's profile with connected accounts.
 */
export async function getUserProfile(): Promise<UserProfile> {
	const session = await getSession();

	const user = await db.query.user.findFirst({
		where: eq(schema.user.id, session.user.id),
		with: {
			accounts: {
				columns: {
					providerId: true,
					createdAt: true
				}
			}
		}
	});

	if (!user) {
		error(404, { message: 'User not found', code: 'NOT_FOUND' });
	}

	return {
		id: user.id,
		name: user.name,
		email: user.email,
		emailVerified: user.emailVerified,
		image: user.image,
		hasCustomImage: isCustomImage(user.image),
		createdAt: user.createdAt,
		providers: user.accounts.map((account) => ({
			providerId: account.providerId
		}))
	};
}

// ============================================================================
// User Settings Query
// ============================================================================

/**
 * Gets the current user's preferences and notification settings in a single query.
 */
export async function getUserSettings(): Promise<UserSettings> {
	const session = await getSession();

	const prefs = await db.query.userPreferences.findFirst({
		where: eq(schema.userPreferences.userId, session.user.id)
	});

	if (!prefs) {
		return {
			preferences: {
				language: 'en',
				timezone: 'UTC',
				dateFormat: 'MM/DD/YYYY',
				timeFormat: '12h'
			},
			notifications: {
				emailNotifications: true,
				marketingEmails: false,
				securityAlerts: true,
				productUpdates: true
			}
		};
	}

	return {
		preferences: {
			language: prefs.language,
			timezone: prefs.timezone,
			dateFormat: prefs.dateFormat,
			timeFormat: prefs.timeFormat
		},
		notifications: {
			emailNotifications: prefs.emailNotifications,
			marketingEmails: prefs.marketingEmails,
			securityAlerts: prefs.securityAlerts,
			productUpdates: prefs.productUpdates
		}
	};
}

// ============================================================================
// Session Queries
// ============================================================================

/**
 * Gets active sessions for the current user.
 */
export async function getActiveSessions(): Promise<SessionInfo[]> {
	const session = await getSession();
	const event = getRequestEvent();

	const sessions = await auth.api.listSessions({
		headers: event.request.headers
	});

	return sessions.map((s) => ({
		id: s.id,
		isCurrent: s.id === session.session.id,
		createdAt: s.createdAt,
		ipAddress: s.ipAddress ?? null,
		userAgent: s.userAgent ?? null,
		parsedUserAgent: parseUserAgent(s.userAgent ?? null)
	}));
}

// ============================================================================
// Organization Queries
// ============================================================================

/**
 * Gets the current organization's settings.
 */
export async function getOrganizationSettings(): Promise<OrganizationSettings> {
	const activeMember = await getActiveMember();

	const org = await db.query.organization.findFirst({
		where: eq(schema.organization.id, activeMember.organizationId)
	});

	if (!org) {
		error(404, { message: 'Organization not found', code: 'NOT_FOUND' });
	}

	return {
		id: org.id,
		name: org.name,
		slug: org.slug,
		logo: org.logo,
		hasCustomLogo: isCustomImage(org.logo),
		email: org.email,
		createdAt: org.createdAt
	};
}

/**
 * Gets members of the current organization.
 */
export async function getOrganizationMembers(): Promise<MemberInfo[]> {
	const activeMember = await getActiveMember();

	const members = await db.query.member.findMany({
		where: eq(schema.member.organizationId, activeMember.organizationId),
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					email: true,
					image: true
				}
			}
		},
		orderBy: (member, { desc }) => [desc(member.createdAt)]
	});

	return members.map((m) => ({
		id: m.id,
		userId: m.user.id,
		name: m.user.name,
		email: m.user.email,
		image: m.user.image,
		role: m.role
	}));
}

/**
 * Gets pending invitations for the current organization.
 */
export async function getOrganizationInvitations(): Promise<InvitationInfo[]> {
	const activeMember = await getActiveMember();

	if (!INVITATION_READ_ROLES.includes(activeMember.role)) {
		error(403, { message: 'You do not have permission to view invitations', code: 'FORBIDDEN' });
	}

	const invitations = await db.query.invitation.findMany({
		where: and(
			eq(schema.invitation.organizationId, activeMember.organizationId),
			eq(schema.invitation.status, 'pending')
		),
		orderBy: (inv, { desc }) => [desc(inv.createdAt)]
	});

	return invitations.map((inv) => ({
		id: inv.id,
		email: inv.email,
		role: inv.role,
		status: inv.status,
		expiresAt: inv.expiresAt
	}));
}

// ============================================================================
// Billing Queries
// ============================================================================

/**
 * Gets billing info for the current organization.
 */
export async function getBillingInfo(): Promise<BillingInfo> {
	const activeMember = await getActiveMember();

	if (!BILLING_READ_ROLES.includes(activeMember.role)) {
		error(403, {
			message: 'You do not have permission to view billing information',
			code: 'FORBIDDEN'
		});
	}

	const org = await db.query.organization.findFirst({
		where: eq(schema.organization.id, activeMember.organizationId),
		columns: {
			id: true,
			billingAddress: true,
			entitlements: true
		}
	});

	if (!org) {
		error(404, { message: 'Organization not found', code: 'NOT_FOUND' });
	}

	return {
		billingAddress: org.billingAddress,
		entitlements: org.entitlements
	};
}

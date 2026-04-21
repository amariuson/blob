import type { BetterAuthOptions } from 'better-auth';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

import { db } from '$lib/server/db';
import { auditLog, organization, user } from '$lib/server/db/schema';
import { env } from '$lib/server/env.server';
import { defaultEntitlements } from '$lib/shared/types/entitlements';
import { logger } from '$services/logger';
import { ensureCustomer, syncOrgEntitlements } from '$services/polar';

// ---- better-auth user hooks --------------------------------------------

type UserCreate = NonNullable<NonNullable<BetterAuthOptions['databaseHooks']>['user']>['create'];
type BeforeFn = NonNullable<NonNullable<UserCreate>['before']>;
type AfterFn = NonNullable<NonNullable<UserCreate>['after']>;

export const beforeUserCreate: BeforeFn = async (userData) => {
	// Normalize name: trim and fall back to the email local-part if blank.
	const name = userData.name?.trim() || userData.email.split('@')[0];
	return { data: { ...userData, name } };
};

export const afterUserCreate: AfterFn = async () => {
	// Reserved for post-signup side-effects (welcome email, etc). Intentional no-op.
};

// ---- organization lifecycle --------------------------------------------

type OrgLike = { id: string; name: string; email?: string | null; [key: string]: unknown };

/**
 * Initializes a newly created organization.
 *
 * Called from `afterCreateOrganization`. Always writes default entitlements and
 * the creator's email onto the org. When Polar is configured, provisions a
 * customer and syncs its state back into `organization.entitlements` so the
 * `customerId` is populated.
 */
export async function initializeOrganization(org: OrgLike, userId: string): Promise<void> {
	const creator = await db.query.user.findFirst({
		where: eq(user.id, userId),
		columns: { email: true }
	});

	if (!creator?.email) {
		logger.warn(
			{ orgId: org.id, userId },
			'Creator email not found for org; writing default entitlements only'
		);
		await db
			.update(organization)
			.set({ entitlements: defaultEntitlements })
			.where(eq(organization.id, org.id));
		return;
	}

	await db
		.update(organization)
		.set({ entitlements: defaultEntitlements, email: creator.email })
		.where(eq(organization.id, org.id));

	const polarConfigured = Boolean(env.POLAR_ACCESS_TOKEN && env.POLAR_WEBHOOK_SECRET);
	if (!polarConfigured) {
		logger.info({ orgId: org.id }, 'Polar not configured; skipping Polar customer provisioning');
		return;
	}

	await ensureCustomer({ id: org.id, name: org.name, email: org.email }, creator.email);
	await syncOrgEntitlements(org.id);

	logger.info({ orgId: org.id, orgName: org.name }, 'Organization initialized with Polar customer');
}

/**
 * Records an organization deletion to the audit log. Called from `afterDeleteOrganization`.
 */
export async function recordOrgDeletion(
	org: { id: string; name: string },
	userId: string
): Promise<void> {
	await db.insert(auditLog).values({
		action: 'organization.delete',
		actorId: userId,
		targetType: 'organization',
		targetId: org.id,
		metadata: { orgName: org.name }
	});

	logger.info({ orgId: org.id, orgName: org.name, actorId: userId }, 'Organization deleted');
}

// ---- invitation validation ---------------------------------------------

/**
 * Validates an invitation before it's created.
 * - No one can invite owners (they must be promoted from existing members).
 * - Admins may only invite members (not other admins or owners).
 */
export function validateInvitation(
	invitation: { role: string },
	inviter: { id: string; role?: string | null }
): void {
	if (invitation.role === 'owner') {
		logger.warn(
			{ inviterId: inviter.id, targetRole: invitation.role },
			'Attempted to invite owner - not allowed'
		);
		error(403, {
			code: 'FORBIDDEN',
			message: 'Cannot invite owners. Promote an existing member instead.'
		});
	}

	if (inviter.role === 'admin' && invitation.role === 'admin') {
		logger.warn(
			{ inviterId: inviter.id, targetRole: invitation.role },
			'Admin attempted to invite admin - not allowed'
		);
		error(403, { code: 'FORBIDDEN', message: 'Admins can only invite members' });
	}
}

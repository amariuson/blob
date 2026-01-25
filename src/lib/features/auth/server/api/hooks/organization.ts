import { db } from '$lib/server/db';
import { generateSlug, generateSlugSuffix } from '$lib/shared/utils';
import { logger } from '$services/logger';
import { eq } from 'drizzle-orm';
import { auth } from '../../auth';
import { auditLog, organization, user } from '$lib/server/db/schema';
import { defaultEntitlements } from '$lib/shared/types/entitlements';
import { polarClient } from '$services/polar';
import { isE2ETestMode } from '$lib/server/env.server';

export async function autoCreateOrganization(userId: string, userName: string): Promise<boolean> {
	const orgName = `${userName}'s Organization`;
	const baseSlug = generateSlug(userName);
	const result = await tryCreateOrganizationWithRetry(userId, orgName, baseSlug);
	return result !== null;
}

async function tryCreateOrganizationWithRetry(userId: string, orgName: string, baseSlug: string) {
	for (let attempt = 0; attempt < 10; attempt++) {
		const slug = attempt === 0 ? baseSlug : `${baseSlug}-${generateSlugSuffix()}`;
		try {
			const org = await auth.api.createOrganization({ body: { name: orgName, slug, userId } });
			logger.info({ userId, orgName, slug }, 'Organization created');
			return org;
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			if (errorMessage.includes('slug')) {
				continue;
			}
			logger.error({ userId, orgName, error: err }, 'Failed to create organization');
			break;
		}
	}
	return null;
}

/**
 * Initializes a newly created organization.
 * Called by better-auth's afterCreateOrganization hook.
 *
 * Sets default entitlements and creates a Polar customer for billing.
 * Skips Polar in E2E test mode to avoid external API calls during tests.
 */
export async function initializeOrganization(
	org: { id: string; slug: string; name: string },
	creatorUserId: string
) {
	logger.info(
		{ orgId: org.id, orgSlug: org.slug, userId: creatorUserId },
		'Organization created, initializing'
	);

	const creator = await db.query.user.findFirst({
		where: eq(user.id, creatorUserId)
	});

	if (!creator?.email) {
		logger.warn(
			{ orgId: org.id, userId: creatorUserId },
			'Could not find creator email for org, skipping Polar customer creation'
		);
		await db
			.update(organization)
			.set({ entitlements: defaultEntitlements })
			.where(eq(organization.id, org.id));
		return;
	}

	await db
		.update(organization)
		.set({
			entitlements: defaultEntitlements,
			email: creator.email
		})
		.where(eq(organization.id, org.id));

	if (isE2ETestMode()) {
		logger.info(
			{ orgId: org.id, orgName: org.name },
			'E2E test mode: skipping Polar customer creation'
		);
		return;
	}

	try {
		await polarClient.createOrganizationCustomer(org.id, creator.email, org.name);
		logger.info(
			{ orgId: org.id, orgName: org.name, creatorEmail: creator.email },
			'Polar customer created for organization'
		);
	} catch (err) {
		logger.error(
			{ orgId: org.id, orgName: org.name, error: err },
			'Failed to create Polar customer for organization'
		);
	}
}

// Records organization deletion in audit log. Called by afterDeleteOrganization hook.
export async function recordOrgDeletion(
	org: { id: string; name: string; slug: string },
	deletedByUserId: string
) {
	logger.info(
		{ orgId: org.id, orgName: org.name, orgSlug: org.slug, deletedBy: deletedByUserId },
		'Organization deleted'
	);

	await db.insert(auditLog).values({
		action: 'organization.delete',
		actorId: deletedByUserId,
		targetType: 'organization',
		targetId: org.id,
		metadata: { orgName: org.name, orgSlug: org.slug }
	});
}

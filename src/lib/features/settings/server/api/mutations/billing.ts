import { error, redirect } from '@sveltejs/kit';

import { rolesWithPermission } from '$features/auth';
import { getActiveMember } from '$features/auth/server';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import type { Entitlements } from '$lib/shared/types/entitlements';
import { logger } from '$services/logger';
import { polarClient } from '$services/polar';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { AddressInput } from '@polar-sh/sdk/models/components/addressinput.js';
import { HTTPValidationError } from '@polar-sh/sdk/models/errors/httpvalidationerror.js';

import { updateBillingInfoSchema } from '../../../schemas';

const BILLING_MANAGE_ROLES = rolesWithPermission('billing', 'manage');

function requireBillingPermission(role: string) {
	if (!BILLING_MANAGE_ROLES.includes(role)) {
		error(403, { message: 'You do not have permission to manage billing', code: 'FORBIDDEN' });
	}
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Updates billing info for the organization.
 */
export async function updateBillingInfo(data: z.infer<typeof updateBillingInfoSchema>) {
	const activeMember = await getActiveMember();

	requireBillingPermission(activeMember.role);

	const billingAddress: schema.BillingAddress = {
		line1: data.line1 || null,
		line2: data.line2 || null,
		city: data.city || null,
		state: data.state || null,
		postalCode: data.postalCode || null,
		country: data.country || null
	};

	// Sync to Polar FIRST - if it rejects the data, don't save locally
	try {
		await polarClient.updateOrganizationCustomer(activeMember.organizationId, {
			billingAddress: billingAddress as AddressInput
		});
	} catch (err) {
		logger.warn({ error: err }, 'Polar rejected billing address');
		const message =
			err instanceof HTTPValidationError && err.detail?.length
				? err.detail[0].msg
				: 'Failed to sync with billing provider';
		error(400, { message, code: 'VALIDATION' });
	}

	// Only save locally if Polar accepted the data
	await db
		.update(schema.organization)
		.set({ billingAddress })
		.where(eq(schema.organization.id, activeMember.organizationId));

	logger.info('Billing information updated');

	return { success: true };
}

// ============================================================================
// Checkout Mutations
// ============================================================================

/**
 * Creates a Polar checkout session and redirects to it.
 */
export async function createCheckout() {
	const activeMember = await getActiveMember();
	requireBillingPermission(activeMember.role);

	logger.info('Creating checkout session');

	const checkoutUrl = await polarClient.createOrganizationCheckoutURL(activeMember.organizationId);

	redirect(303, checkoutUrl);
}

/**
 * Opens the Polar billing portal for subscription management.
 */
export async function openBillingPortal() {
	const activeMember = await getActiveMember();
	requireBillingPermission(activeMember.role);

	logger.info('Opening billing portal');

	const portalUrl = await polarClient.createOrganizationPortalURL(activeMember.organizationId);

	redirect(303, portalUrl);
}

/**
 * Refreshes subscription data by fetching the latest state from Polar
 * and updating the local database entitlements.
 */
export async function refreshSubscriptionData() {
	const activeMember = await getActiveMember();
	requireBillingPermission(activeMember.role);

	logger.info({ orgId: activeMember.organizationId }, 'Refreshing subscription data from Polar');

	try {
		const state = await polarClient.getOrganizationState(activeMember.organizationId);

		const entitlements: Entitlements = {
			activeSubscriptions: state.activeSubscriptions ?? [],
			grantedBenefits: state.grantedBenefits ?? [],
			activeMeters: state.activeMeters ?? [],
			updatedAt: state.modifiedAt ?? new Date()
		};

		await db
			.update(schema.organization)
			.set({ entitlements })
			.where(eq(schema.organization.id, activeMember.organizationId));

		logger.info(
			{
				orgId: activeMember.organizationId,
				subscriptionCount: entitlements.activeSubscriptions.length,
				benefitCount: entitlements.grantedBenefits.length
			},
			'Subscription data refreshed successfully'
		);

		return { success: true };
	} catch (err) {
		logger.error(
			{ orgId: activeMember.organizationId, error: err },
			'Failed to refresh subscription data'
		);
		error(500, {
			message: 'Failed to refresh subscription data from Polar',
			code: 'INTERNAL'
		});
	}
}

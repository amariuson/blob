import { db } from '$lib/server/db';
import { organization } from '$lib/server/db/schema';
import type { Entitlements } from '$lib/shared/types/entitlements';
import { logger } from '$services/logger';
import { addSpanEvent, setSpanAttributes } from '$services/tracing';

import { eq } from 'drizzle-orm';
import type { WebhookCustomerStateChangedPayload } from '@polar-sh/sdk/models/components/webhookcustomerstatechangedpayload.js';
import type { WebhookCustomerUpdatedPayload } from '@polar-sh/sdk/models/components/webhookcustomerupdatedpayload.js';

function validateExternalId(externalId: string | null): asserts externalId {
	if (!externalId) {
		addSpanEvent('validation_error', { reason: 'missing_externalId' });
		logger.error('Webhook validation failed: missing externalId');
		// Using throw new Error (not SvelteKit error()) because better-auth webhook
		// handlers catch all errors and re-throw as APIError - status codes are lost
		throw new Error('Webhook invalid: missing externalId');
	}
}

async function getOrganizationById(id: string) {
	return db.query.organization.findFirst({
		where: eq(organization.id, id)
	});
}

/**
 * Sync customer details (email, billing address) from Polar -> our DB.
 * Called by Polar webhook when customer is updated.
 */
export async function handleCustomerUpdated(payload: WebhookCustomerUpdatedPayload) {
	const externalId = payload.data.externalId;
	validateExternalId(externalId);

	setSpanAttributes({
		'polar.operation': 'webhook.customerUpdated',
		'org.id': externalId
	});

	const customer = payload.data;

	logger.info(
		{ orgId: externalId, email: customer.email, name: customer.name },
		'Syncing customer update from Polar'
	);

	const org = await getOrganizationById(externalId);

	if (!org) {
		addSpanEvent('entity_not_found', { 'org.id': externalId });
		logger.warn({ orgId: externalId }, 'Organization not found - skipping');
		return;
	}

	await db
		.update(organization)
		.set({
			name: customer.name ?? org.name,
			email: customer.email,
			billingAddress: customer.billingAddress
				? {
						line1: customer.billingAddress.line1,
						line2: customer.billingAddress.line2,
						city: customer.billingAddress.city,
						state: customer.billingAddress.state,
						postalCode: customer.billingAddress.postalCode,
						country: customer.billingAddress.country
					}
				: org.billingAddress
		})
		.where(eq(organization.id, externalId));

	addSpanEvent('org_synced_from_polar');
	logger.info({ orgId: externalId }, 'Organization synced from Polar');
}

/**
 * Sync entitlements from Polar -> our DB.
 * Called by Polar webhook when customer state changes (subscription/benefits/meters).
 */
export async function handleCustomerStateChanged(payload: WebhookCustomerStateChangedPayload) {
	const externalId = payload.data.externalId;
	validateExternalId(externalId);

	const subscriptionCount = payload.data.activeSubscriptions?.length ?? 0;
	const benefitCount = payload.data.grantedBenefits?.length ?? 0;
	const meterCount = payload.data.activeMeters?.length ?? 0;

	setSpanAttributes({
		'polar.operation': 'webhook.customerStateChanged',
		'org.id': externalId,
		'webhook.subscription_count': subscriptionCount,
		'webhook.benefit_count': benefitCount,
		'webhook.meter_count': meterCount
	});

	logger.debug(
		{
			orgId: externalId,
			subscriptionCount,
			benefitCount,
			webhookTimestamp: payload.data.modifiedAt ?? payload.data.createdAt
		},
		'Processing Polar webhook'
	);

	const org = await getOrganizationById(externalId);

	if (!org) {
		addSpanEvent('entity_not_found', { 'org.id': externalId });
		logger.warn({ orgId: externalId }, 'Organization not found - skipping');
		return;
	}

	// Only update if new data is newer (prevents stale webhook retries)
	const newTimestamp = payload.data.modifiedAt ?? payload.data.createdAt;
	const currentTimestamp = org.entitlements?.updatedAt;

	// Skip staleness check if org has no entitlements yet (first webhook)
	if (currentTimestamp && newTimestamp.getTime() < currentTimestamp.getTime()) {
		addSpanEvent('stale_webhook_ignored', {
			'webhook.timestamp': newTimestamp.toISOString(),
			'current.timestamp': currentTimestamp.toISOString(),
			delta_ms: currentTimestamp.getTime() - newTimestamp.getTime()
		});
		logger.debug(
			{
				orgId: externalId,
				webhookTimestamp: newTimestamp,
				currentTimestamp,
				deltaMs: currentTimestamp.getTime() - newTimestamp.getTime()
			},
			'Ignoring stale webhook - current data is newer'
		);
		return;
	}

	const entitlements = {
		activeSubscriptions: payload.data.activeSubscriptions,
		grantedBenefits: payload.data.grantedBenefits,
		activeMeters: payload.data.activeMeters,
		updatedAt: newTimestamp
	} satisfies Entitlements;

	await db.update(organization).set({ entitlements }).where(eq(organization.id, externalId));

	addSpanEvent('entitlements_updated');
	setSpanAttributes({
		'entitlements.updated': true,
		'entitlements.subscription_count': subscriptionCount,
		'entitlements.benefit_count': benefitCount,
		'entitlements.meter_count': meterCount
	});

	logger.info(
		{
			orgId: externalId,
			subscriptionCount,
			benefitCount,
			meterCount
		},
		'Entitlements updated via webhook'
	);
}

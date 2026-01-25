import { polar, webhooks } from '@polar-sh/better-auth';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { polarSdk as polarClient } from '$services/polar';
import { logger } from '$services/logger';
import { setSpanAttributes, addSpanEvent } from '$services/tracing';
import { POLAR_WEBHOOK_SECRET } from '$env/static/private';
import type { Entitlements } from '$lib/shared/types/entitlements';

function validateExternalId(externalId: string | null): asserts externalId {
	if (!externalId) {
		addSpanEvent('validation_error', { reason: 'missing_externalId' });
		logger.error('Webhook validation failed: missing externalId');
		// Using throw new Error (not SvelteKit error()) because better-auth webhook
		// handlers catch all errors and re-throw as APIError - status codes are lost
		throw new Error('Webhook invalid: missing externalId');
	}
}

/**
 * Creates the Polar plugin with webhook handlers for customer and entitlement sync.
 */
export function createPolarPlugin() {
	return polar({
		client: polarClient,
		createCustomerOnSignUp: false, // We create customers for orgs, not users
		use: [
			webhooks({
				secret: POLAR_WEBHOOK_SECRET,
				// Sync customer details (email, billing address) from Polar -> our DB
				onCustomerUpdated: async (payload) => {
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

					const org = await db.query.organization.findFirst({
						where: eq(schema.organization.id, externalId)
					});

					if (!org) {
						addSpanEvent('entity_not_found', { 'org.id': externalId });
						logger.warn({ orgId: externalId }, 'Organization not found - skipping');
						return;
					}

					await db
						.update(schema.organization)
						.set({
							// Sync name from Polar, preserving local name if Polar has none
							name: customer.name ?? org.name,
							email: customer.email,
							// Sync Polar billing address, preserving local address if Polar has none
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
						.where(eq(schema.organization.id, externalId));

					addSpanEvent('org_synced_from_polar');
					logger.info({ orgId: externalId }, 'Organization synced from Polar');
				},
				onCustomerStateChanged: async (payload) => {
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

					const org = await db.query.organization.findFirst({
						where: eq(schema.organization.id, externalId)
					});

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

					await db
						.update(schema.organization)
						.set({ entitlements })
						.where(eq(schema.organization.id, externalId));

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
			})
		]
	});
}

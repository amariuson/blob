import { polar, webhooks } from '@polar-sh/better-auth';

import { requirePolar } from '$lib/server/env.server';
import { createPolarClient, syncOrgEntitlements } from '$services/polar';
import { logger } from '$services/logger';

/**
 * Creates the Polar plugin with webhook handlers for customer and entitlement sync.
 *
 * The `webhooks()` plugin handles signature verification using POLAR_WEBHOOK_SECRET.
 * Events are delegated to `syncOrgEntitlements` from `$services/polar` — the single
 * source of truth for polar -> org state sync.
 */
export function createPolarPlugin(): ReturnType<typeof polar> {
	const { webhookSecret } = requirePolar();

	return polar({
		client: createPolarClient(),
		createCustomerOnSignUp: false, // We create customers for orgs, not users
		use: [
			webhooks({
				secret: webhookSecret,
				onPayload: async (payload) => {
					const externalId = extractExternalId(payload);
					if (!externalId) {
						logger.debug({ type: payload.type }, 'polar webhook: no externalId, skipping sync');
						return;
					}
					await syncOrgEntitlements(externalId);
				}
			})
		]
	});
}

function extractExternalId(event: { data?: unknown }): string | null {
	const data = event.data;
	if (!data || typeof data !== 'object') return null;

	const direct = (data as { externalId?: string | null }).externalId;
	if (direct) return direct;

	const customer = (data as { customer?: { externalId?: string | null } }).customer;
	if (customer?.externalId) return customer.externalId;

	return null;
}

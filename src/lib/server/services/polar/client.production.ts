import { createLogger } from '$services/logger';

import type { Polar } from '@polar-sh/sdk';
import type { CustomerWithMembers } from '@polar-sh/sdk/models/components/customerwithmembers.js';

import type { PolarAdapter, PolarCustomer } from './adapter';

const log = createLogger({ module: 'polar' });

function transformCustomer(customer: CustomerWithMembers): PolarCustomer {
	return {
		id: customer.id,
		email: customer.email,
		externalId: customer.externalId,
		name: customer.name,
		billingAddress: customer.billingAddress,
		createdAt: customer.createdAt,
		modifiedAt: customer.modifiedAt
	};
}

async function trace<T>(op: string, organizationId: string, fn: () => Promise<T>): Promise<T> {
	log.debug({ op, organizationId }, 'Polar call');
	try {
		const result = await fn();
		log.info({ op, organizationId }, 'Polar call succeeded');
		return result;
	} catch (err) {
		log.error({ op, organizationId, err }, 'Polar call failed');
		throw err;
	}
}

export function createProductionClient(
	sdk: Polar,
	config: { productId: string; checkoutSuccessUrl: string }
): PolarAdapter {
	return {
		getOrganizationState(organizationId) {
			return trace('getOrganizationState', organizationId, () =>
				sdk.customers.getStateExternal({ externalId: organizationId })
			);
		},

		getOrganizationCustomer(organizationId) {
			return trace('getOrganizationCustomer', organizationId, async () =>
				transformCustomer(await sdk.customers.getExternal({ externalId: organizationId }))
			);
		},

		createOrganizationCustomer(organizationId, email, name) {
			return trace('createOrganizationCustomer', organizationId, async () =>
				transformCustomer(await sdk.customers.create({ email, externalId: organizationId, name }))
			);
		},

		updateOrganizationCustomer(organizationId, email, name, billingAddress) {
			return trace('updateOrganizationCustomer', organizationId, async () =>
				transformCustomer(
					await sdk.customers.updateExternal({
						externalId: organizationId,
						customerUpdateExternalID: { email, name, billingAddress }
					})
				)
			);
		},

		createOrganizationPortalURL(organizationId) {
			return trace('createOrganizationPortalURL', organizationId, async () => {
				const session = await sdk.customerSessions.create({
					externalCustomerId: organizationId
				});
				return session.customerPortalUrl;
			});
		},

		createOrganizationCheckoutURL(organizationId) {
			return trace('createOrganizationCheckoutURL', organizationId, async () => {
				const checkout = await sdk.checkouts.create({
					products: [config.productId],
					externalCustomerId: organizationId,
					successUrl: config.checkoutSuccessUrl
				});
				return checkout.url;
			});
		}
	};
}

import type { Polar } from '@polar-sh/sdk';
import type { PolarAdapter, PolarCustomer } from './adapter';
import type { CustomerWithMembers } from '@polar-sh/sdk/models/components/customerwithmembers.js';

/**
 * Transforms SDK customer response to adapter format.
 */
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

export function createProductionClient(
	sdk: Polar,
	config: { productId: string; checkoutSuccessUrl: string }
): PolarAdapter {
	return {
		async getOrganizationState(organizationId) {
			return sdk.customers.getStateExternal({ externalId: organizationId });
		},

		async getOrganizationCustomer(organizationId) {
			const customer = await sdk.customers.getExternal({ externalId: organizationId });
			return transformCustomer(customer);
		},

		async createOrganizationCustomer(organizationId, email, name) {
			const customer = await sdk.customers.create({
				email,
				externalId: organizationId,
				name
			});
			return transformCustomer(customer);
		},

		async updateOrganizationCustomer(organizationId, email, name, billingAddress) {
			const customer = await sdk.customers.updateExternal({
				externalId: organizationId,
				customerUpdateExternalID: {
					email,
					name,
					billingAddress
				}
			});
			return transformCustomer(customer);
		},

		async createOrganizationPortalURL(organizationId) {
			const session = await sdk.customerSessions.create({
				externalCustomerId: organizationId
			});
			return session.customerPortalUrl;
		},

		async createOrganizationCheckoutURL(organizationId) {
			const checkout = await sdk.checkouts.create({
				products: [config.productId],
				externalCustomerId: organizationId,
				successUrl: config.checkoutSuccessUrl
			});
			return checkout.url;
		}
	};
}

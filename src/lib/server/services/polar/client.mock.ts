import { ORIGIN } from '$env/static/private';

import type { AddressInput } from '@polar-sh/sdk/models/components/addressinput.js';
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js';

import type { PolarAdapter, PolarCustomer } from './adapter';

/**
 * Creates a mock CustomerState with an active Pro subscription.
 */
function createMockProSubscriptionState(organizationId: string): CustomerState {
	const now = new Date();
	const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

	return {
		id: 'mock-customer-id',
		createdAt: now,
		modifiedAt: now,
		metadata: {},
		externalId: organizationId,
		email: 'mock@example.com',
		emailVerified: true,
		name: null,
		billingAddress: null,
		taxId: null,
		organizationId: 'mock-polar-org-id',
		deletedAt: null,
		avatarUrl: '',
		activeSubscriptions: [
			{
				id: 'mock-subscription-id',
				createdAt: now,
				modifiedAt: now,
				metadata: {},
				productId: 'mock-product-id',
				status: 'active',
				currentPeriodStart: now,
				currentPeriodEnd: thirtyDaysLater,
				trialStart: null,
				trialEnd: null,
				cancelAtPeriodEnd: false,
				canceledAt: null,
				startedAt: now,
				endsAt: null,
				discountId: null,
				meters: [],
				amount: 1000,
				currency: 'usd',
				recurringInterval: 'month'
			}
		],
		grantedBenefits: [],
		activeMeters: []
	};
}

/**
 * Creates a mock customer.
 */
function createMockCustomer(
	organizationId: string,
	email: string,
	name: string | null,
	billingAddress: AddressInput | null = null
): PolarCustomer {
	return {
		id: 'mock-customer-id',
		email,
		externalId: organizationId,
		name,
		billingAddress,
		createdAt: new Date(),
		modifiedAt: new Date()
	};
}

/**
 * Mock implementation of PolarAdapter for E2E testing.
 * Returns mock data instead of calling the real Polar API.
 *
 * LIMITATION: This mock always returns an active Pro subscription.
 */
export function createMockClient(): PolarAdapter {
	return {
		async getOrganizationState(organizationId) {
			return createMockProSubscriptionState(organizationId);
		},

		async getOrganizationCustomer(organizationId) {
			return createMockCustomer(organizationId, 'mock@example.com', null);
		},

		async createOrganizationCustomer(organizationId, email, name) {
			return createMockCustomer(organizationId, email, name);
		},

		async updateOrganizationCustomer(organizationId, fields) {
			return createMockCustomer(
				organizationId,
				fields.email ?? 'mock@example.com',
				fields.name ?? null,
				fields.billingAddress ?? null
			);
		},

		async createOrganizationPortalURL() {
			return 'https://sandbox.polar.sh/mock-portal';
		},

		async createOrganizationCheckoutURL() {
			return ORIGIN + '/settings/billing';
		}
	};
}

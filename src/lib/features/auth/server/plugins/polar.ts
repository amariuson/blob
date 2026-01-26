import { POLAR_WEBHOOK_SECRET } from '$env/static/private';

import { polarSdk as polarClient } from '$services/polar';

import { polar, webhooks } from '@polar-sh/better-auth';

import { handleCustomerStateChanged, handleCustomerUpdated } from '../api/hooks/polar';

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
				onCustomerUpdated: handleCustomerUpdated,
				onCustomerStateChanged: handleCustomerStateChanged
			})
		]
	});
}

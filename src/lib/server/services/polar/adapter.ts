import type { AddressInput } from '@polar-sh/sdk/models/components/addressinput.js';
import type { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js';
import type { CustomerWithMembers } from '@polar-sh/sdk/models/components/customerwithmembers.js';

export type PolarCustomer = Pick<
	CustomerWithMembers,
	'id' | 'email' | 'name' | 'externalId' | 'billingAddress' | 'createdAt' | 'modifiedAt'
>;

export type PolarAdapter = {
	getOrganizationState(organizationId: string): Promise<CustomerState>;
	getOrganizationCustomer(organizationId: string): Promise<PolarCustomer>;

	createOrganizationCustomer(
		organizationId: string,
		email: string,
		name: string
	): Promise<PolarCustomer>;

	updateOrganizationCustomer(
		organizationId: string,
		email: string,
		name: string,
		billingAddress: AddressInput
	): Promise<PolarCustomer>;

	createOrganizationPortalURL(organizationId: string): Promise<string>;

	createOrganizationCheckoutURL(organizationId: string): Promise<string>;
};

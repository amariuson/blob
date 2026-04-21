import type { CustomerStateBenefitGrant } from '@polar-sh/sdk/models/components/customerstatebenefitgrant.js';
import type { CustomerStateMeter } from '@polar-sh/sdk/models/components/customerstatemeter.js';
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js';

export type Entitlements = {
	customerId: string | null;
	activeSubscriptions: CustomerStateSubscription[];
	grantedBenefits: CustomerStateBenefitGrant[];
	activeMeters: CustomerStateMeter[];
	updatedAt: Date;
};

export const defaultEntitlements: Entitlements = {
	customerId: null,
	activeSubscriptions: [],
	grantedBenefits: [],
	activeMeters: [],
	updatedAt: new Date(0)
};

import type { CustomerStateBenefitGrant } from '@polar-sh/sdk/models/components/customerstatebenefitgrant.js';
import type { CustomerStateMeter } from '@polar-sh/sdk/models/components/customerstatemeter.js';
import type { CustomerStateSubscription } from '@polar-sh/sdk/models/components/customerstatesubscription.js';

export type Entitlements = {
	activeSubscriptions: CustomerStateSubscription[];
	grantedBenefits: CustomerStateBenefitGrant[];
	activeMeters: CustomerStateMeter[];
	updatedAt: Date;
};

export const defaultEntitlements: Entitlements = {
	activeSubscriptions: [],
	grantedBenefits: [],
	activeMeters: [],
	updatedAt: new Date(0)
};

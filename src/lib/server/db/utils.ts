import { uuid, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { Entitlements } from '$lib/shared/types/entitlements';

export const uuidv7 = (name: string) => uuid(name).default(sql`uuidv7()`);

/** JSONB column for Entitlements that parses updatedAt to Date */
export const entitlementsJsonb = customType<{ data: Entitlements; driverData: string }>({
	dataType() {
		return 'jsonb';
	},
	toDriver(value) {
		return JSON.stringify(value);
	},
	fromDriver(value) {
		const v = (typeof value === 'string' ? JSON.parse(value) : value) as Entitlements & {
			updatedAt: string | Date;
		};
		return { ...v, updatedAt: new Date(v.updatedAt) };
	}
});

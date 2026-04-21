import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

import { requirePolar } from '$lib/server/env.server';
import { db } from '$lib/server/db';
import type { Entitlements } from '$lib/shared/types/entitlements';
import { logger } from '$services/logger';

import { polarClient } from './client';

type OrgInput = { id: string; name: string; email?: string | null };

/**
 * Creates or fetches a Polar customer for the org, keyed by org.id as externalId.
 * Returns the Polar customer's id.
 */
export async function ensureCustomer(org: OrgInput, creatorEmail: string): Promise<string> {
	try {
		const customer = await polarClient.customers.getExternal({ externalId: org.id });
		return customer.id;
	} catch (err) {
		if (!isNotFound(err)) throw err;
	}

	const email = org.email || creatorEmail;
	if (!email) {
		throw new Error(
			`ensureCustomer: no email available for org ${org.id} (org.email and creatorEmail both empty)`
		);
	}

	const created = await polarClient.customers.create({
		externalId: org.id,
		email,
		name: org.name
	});

	logger.info({ orgId: org.id, polarCustomerId: created.id }, 'ensured polar customer for org');
	return created.id;
}

/**
 * Fetches the customer's current state from Polar and writes a full
 * `Entitlements` jsonb to `organization.entitlements`.
 */
export async function syncOrgEntitlements(orgId: string): Promise<void> {
	const state = await polarClient.customers.getStateExternal({ externalId: orgId });

	const entitlements: Entitlements = {
		customerId: state.id,
		activeSubscriptions: state.activeSubscriptions,
		grantedBenefits: state.grantedBenefits,
		activeMeters: state.activeMeters,
		updatedAt: new Date()
	};

	// Written as raw SQL to avoid coupling to the schema module ordering
	// (organization table lands in Task 19). Schema column is `entitlements jsonb`.
	await db.execute(
		sql`update "organization" set "entitlements" = ${JSON.stringify(entitlements)}::jsonb where "id" = ${orgId}`
	);

	logger.info({ orgId, polarCustomerId: state.id }, 'synced polar entitlements for org');
}

/**
 * Verifies the Polar webhook signature and dispatches to `syncOrgEntitlements`
 * for events that mutate org-level state.
 */
export async function handlePolarWebhook(headers: Headers, body: string): Promise<void> {
	const { webhookSecret } = requirePolar();

	const headerRecord: Record<string, string> = {};
	headers.forEach((value, key) => {
		headerRecord[key] = value;
	});

	let event: ReturnType<typeof validateEvent>;
	try {
		event = validateEvent(body, headerRecord, webhookSecret);
	} catch (err) {
		if (err instanceof WebhookVerificationError) {
			logger.warn({ err }, 'polar webhook signature invalid');
			error(401, 'Invalid webhook signature');
		}
		throw err;
	}

	const externalId = extractExternalId(event);
	if (!externalId) {
		logger.debug({ type: event.type }, 'polar webhook: no externalId, skipping sync');
		return;
	}

	await syncOrgEntitlements(externalId);
}

function extractExternalId(event: ReturnType<typeof validateEvent>): string | null {
	const data = (event as { data?: unknown }).data;
	if (!data || typeof data !== 'object') return null;

	// Most customer/subscription/order events carry `externalId` (or nested `customer.externalId`).
	const direct = (data as { externalId?: string | null }).externalId;
	if (direct) return direct;

	const customer = (data as { customer?: { externalId?: string | null } }).customer;
	if (customer?.externalId) return customer.externalId;

	return null;
}

function isNotFound(err: unknown): boolean {
	if (!err || typeof err !== 'object') return false;
	const name = (err as { name?: string }).name;
	if (name === 'ResourceNotFound') return true;
	const status =
		(err as { statusCode?: number; status?: number }).statusCode ??
		(err as { status?: number }).status;
	return status === 404;
}

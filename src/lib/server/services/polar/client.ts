import { Polar } from '@polar-sh/sdk';
import { instrumentPolar } from '@kubiks/otel-polar';
import { POLAR_ACCESS_TOKEN } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { z } from 'zod';
import { isE2ETestMode } from '$lib/server/env.server';
import type { PolarAdapter } from './adapter';
import { createMockClient } from './client.mock';
import { createProductionClient } from './client.production';
import { PUBLIC_POLAR_PRO_ID } from '$env/static/public';

const polarServerSchema = z.enum(['sandbox', 'production']).catch('sandbox');

/**
 * Raw Polar SDK instance for integrations that require it (e.g., better-auth webhooks).
 * Use `polarClient` for regular API operations.
 */
export const polarSdk = instrumentPolar(
	new Polar({
		accessToken: POLAR_ACCESS_TOKEN,
		server: polarServerSchema.parse(env.POLAR_SERVER)
	})
);

/**
 * Polar adapter for application use.
 * In E2E test mode, returns mock implementation.
 * In production, wraps the instrumented Polar SDK.
 */
export const polarClient: PolarAdapter = isE2ETestMode()
	? createMockClient()
	: createProductionClient(polarSdk, {
			productId: PUBLIC_POLAR_PRO_ID,
			checkoutSuccessUrl: '/settings/billing'
		});

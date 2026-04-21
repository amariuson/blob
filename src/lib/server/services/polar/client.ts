import { instrumentPolar } from '@kubiks/otel-polar';
import { Polar } from '@polar-sh/sdk';

import { requirePolar } from '$lib/server/env.server';

export type PolarClient = Polar;

let cached: PolarClient | null = null;

/**
 * Constructs an instrumented Polar SDK client. Lazy — call from request paths only.
 * Calls `requirePolar()` at invocation time so dev boots without POLAR_* env vars.
 * The instance is cached, so repeated calls return the same client.
 */
export function createPolarClient(): PolarClient {
	if (cached) return cached;
	const { accessToken, server } = requirePolar();
	cached = instrumentPolar(new Polar({ accessToken, server }));
	return cached;
}

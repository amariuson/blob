import { instrumentPolar } from '@kubiks/otel-polar';
import { Polar } from '@polar-sh/sdk';

import { requirePolar } from '$lib/server/env.server';

export type PolarClient = Polar;

let cached: PolarClient | null = null;

/**
 * Constructs an instrumented Polar SDK client. Lazy — call from request paths only.
 * Calls `requirePolar()` at invocation time so dev boots without POLAR_* env vars.
 */
export function createPolarClient(): PolarClient {
	if (cached) return cached;
	const { accessToken, server } = requirePolar();
	cached = instrumentPolar(new Polar({ accessToken, server }));
	return cached;
}

/**
 * Proxy singleton — forwards property access to a lazily-constructed client.
 * Using a proxy keeps the ergonomic `polarClient.customers.list(...)` shape
 * without calling `requirePolar()` at module load.
 */
export const polarClient: PolarClient = new Proxy({} as PolarClient, {
	get(_target, prop) {
		const client = createPolarClient();
		const value = Reflect.get(client, prop);
		return typeof value === 'function' ? value.bind(client) : value;
	}
});

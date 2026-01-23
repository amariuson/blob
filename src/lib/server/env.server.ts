import { dev } from '$app/environment';
import { NODE_ENV } from '$env/static/private';

/**
 * Returns true ONLY when NODE_ENV=test (E2E tests).
 */
export function isE2ETestMode(): boolean {
	return NODE_ENV === 'test';
}

/**
 * Returns true when running in dev mode or E2E tests.
 */
export function isTestEnv(): boolean {
	return dev || isE2ETestMode();
}

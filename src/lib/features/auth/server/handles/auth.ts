import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/environment';
import type { Handle } from '@sveltejs/kit';
import { auth } from '../auth';

// Integrates better-auth with SvelteKit request/response cycle.
export const createAuthHandle = (): Handle => {
	return async ({ event, resolve }) => {
		return svelteKitHandler({ event, resolve, auth, building });
	};
};

import { uuidv7 } from 'uuidv7';
import type { Handle } from '@sveltejs/kit';
import { getSessionOrNull } from '../api/queries/user';

/**
 * Sets up request context with requestId and session.
 * Uses lazy-loaded getSessionOrNull() which caches in event.locals.
 */
export const createSetupHandle = (): Handle => {
	return async ({ event, resolve }) => {
		const requestId = uuidv7();
		event.locals.context = { requestId };

		const session = await getSessionOrNull();

		event.locals.context = {
			...event.locals.context,
			userId: session?.user.id,
			orgId: session?.session.activeOrganizationId || undefined
		};

		return resolve(event);
	};
};

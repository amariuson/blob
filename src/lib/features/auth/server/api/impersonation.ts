import { getRequestEvent } from '$app/server';

import { auth } from '../auth';

/** Impersonate a user. Requires superadmin role. */
export async function impersonateUser(userId: string) {
	const event = getRequestEvent();
	await auth.api.impersonateUser({
		headers: event.request.headers,
		body: { userId }
	});
}

/** Stop the current impersonation session. */
export async function stopImpersonating() {
	const event = getRequestEvent();
	await auth.api.stopImpersonating({
		headers: event.request.headers
	});
}

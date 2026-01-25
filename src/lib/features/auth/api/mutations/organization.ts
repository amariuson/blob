import { auth } from '../../auth.server';
import { getRequestEvent } from '$app/server';

// Sets the active organization for the current session.
export async function setActiveOrganization(organizationId: string) {
	const event = getRequestEvent();
	return auth.api.setActiveOrganization({
		headers: event.request.headers,
		body: { organizationId }
	});
}

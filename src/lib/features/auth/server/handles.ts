import { type Handle, redirect } from '@sveltejs/kit';
import { building } from '$app/environment';

import { svelteKitHandler } from 'better-auth/svelte-kit';
import { uuidv7 } from 'uuidv7';

import { logger } from '$services/logger';

import { auth } from './auth';
import { setActiveOrganization } from './api/mutations';
import { getSessionOrNull, listUserOrganizations } from './api/queries';

export function createSetupHandle(): Handle {
	return async ({ event, resolve }) => {
		event.locals.context = { requestId: uuidv7() };
		const session = await getSessionOrNull();
		event.locals.context.userId = session?.user.id;
		event.locals.context.orgId = session?.session.activeOrganizationId ?? undefined;
		return resolve(event);
	};
}

export function createRedirectHandle(): Handle {
	return async ({ event, resolve }) => {
		const { userId, orgId } = event.locals.context;

		if (userId && !orgId) {
			const orgs = await listUserOrganizations();
			if (orgs.length > 0) {
				const sorted = [...orgs].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				const selected = sorted[0];
				logger.info({ orgId: selected.id }, 'Auto-selecting most recent org');
				await setActiveOrganization(selected.id);
				event.locals.context.orgId = selected.id;
			} else if (event.url.pathname !== '/onboarding') {
				redirect(302, '/onboarding');
			}
		}

		if (event.url.pathname === '/onboarding' && !userId) {
			redirect(302, '/sign-in');
		}

		if (event.route.id?.startsWith('/(auth)') && userId) {
			const isOnboardingWithoutOrg =
				event.url.pathname === '/onboarding' && !event.locals.context.orgId;
			if (!isOnboardingWithoutOrg) redirect(302, '/');
		}

		if (event.route.id?.startsWith('/(app)') && !userId) {
			redirect(302, '/sign-in');
		}

		return resolve(event);
	};
}

export function createAuthHandle(): Handle {
	return ({ event, resolve }) => svelteKitHandler({ event, resolve, auth, building });
}

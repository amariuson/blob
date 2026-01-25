import { redirect, type Handle } from '@sveltejs/kit';
import { logger } from '$services/logger';
import { listUserOrganizations } from '../api/queries/organization';
import { setActiveOrganization } from '../api/mutations/organization';

/**
 * Enforces auth redirects and auto-selects organization.
 *
 * - Auto-sets active org if user has orgs but none selected
 * - Redirects to /onboarding if user has no org membership
 * - Redirects authenticated users away from auth routes (/(auth))
 * - Redirects unauthenticated users away from app routes (/(app))
 */
export const createRedirectHandle = (): Handle => {
	return async ({ event, resolve }) => {
		if (event.locals.context.userId && !event.locals.context.orgId) {
			const orgs = await listUserOrganizations();

			if (orgs.length > 0) {
				const sorted = [...orgs].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				const selectedOrg = sorted[0];

				logger.info(
					{ orgId: selectedOrg.id },
					'Auto-setting active organization (most recently created)'
				);
				await setActiveOrganization(selectedOrg.id);
				event.locals.context.orgId = selectedOrg.id;
			} else if (event.url.pathname !== '/onboarding') {
				logger.debug('No organization membership, redirecting to onboarding');
				redirect(302, '/onboarding');
			}
		}

		// Onboarding requires auth but allows users without an org
		if (event.url.pathname === '/onboarding' && !event.locals.context.userId) {
			redirect(302, '/sign-in');
		}

		// Redirect authenticated users away from auth routes (except onboarding if no org)
		if (event.route.id?.startsWith('/(auth)') && event.locals.context.userId) {
			const isOnboardingWithoutOrg =
				event.url.pathname === '/onboarding' && !event.locals.context.orgId;
			if (!isOnboardingWithoutOrg) {
				redirect(302, '/');
			}
		}

		// Redirect unauthenticated users away from app routes
		if (event.route.id?.startsWith('/(app)') && !event.locals.context.userId) {
			redirect(302, '/sign-in');
		}

		return resolve(event);
	};
};

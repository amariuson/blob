import { randomInt } from 'node:crypto';

import { getRequestEvent } from '$app/server';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, emailOTP, organization } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { db } from '$lib/server/db';
import { env } from '$lib/server/env.server';
import {
	sendMemberRemovedEmail,
	sendOrganizationInvitationEmail,
	sendOtpVerificationEmail,
	sendRoleChangedEmail
} from '$services/email';
import { logger } from '$services/logger';

import { ac, roles } from '../access-control';
import {
	afterUserCreate,
	beforeUserCreate,
	initializeOrganization,
	recordOrgDeletion,
	validateInvitation
} from './api/hooks';
import { clearMemberSessions } from './api/mutations';
import { getActiveMemberOrNull, validateRoleChange } from './api/queries';
import { createPolarPlugin } from './polar-plugin';
import { createSessionStorage } from './session-storage';

// --- Optional providers: gracefully skip when env vars aren't configured. ---
const socialProviders =
	env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
		? {
				google: {
					clientId: env.GOOGLE_CLIENT_ID,
					clientSecret: env.GOOGLE_CLIENT_SECRET
				}
			}
		: undefined;

if (!socialProviders) {
	logger.warn('Google OAuth not configured; skipping social provider');
}

const polarConfigured = Boolean(env.POLAR_ACCESS_TOKEN && env.POLAR_WEBHOOK_SECRET);
if (!polarConfigured) {
	logger.warn('Polar not configured; skipping polar plugin');
}

export const auth = betterAuth({
	secret: env.BETTER_AUTH_SECRET,
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, { provider: 'pg' }),
	secondaryStorage: createSessionStorage(),
	session: {
		storeSessionInDatabase: true,
		preserveSessionInDatabase: true
	},
	user: {
		additionalFields: {
			role: { type: 'string', required: false, returned: true, input: false }
		}
	},
	emailAndPassword: { enabled: false },
	rateLimit: { enabled: true, window: 60, max: 5 },
	advanced: {
		database: { generateId: false },
		cookiePrefix: env.COOKIE_PREFIX
	},
	databaseHooks: {
		user: { create: { before: beforeUserCreate, after: afterUserCreate } }
	},
	...(socialProviders ? { socialProviders } : {}),
	plugins: [
		admin({ ac, roles, adminRoles: ['superadmin'] }),
		organization({
			ac,
			roles,
			schema: {
				organization: {
					additionalFields: {
						entitlements: { type: 'json', required: true, returned: true, input: false }
					}
				}
			},
			async sendInvitationEmail(data) {
				await sendOrganizationInvitationEmail({
					to: data.email,
					inviterName: data.inviter.user.name,
					inviterEmail: data.inviter.user.email,
					organizationName: data.organization.name,
					role: data.role
				});
			},
			organizationHooks: {
				beforeCreateInvitation: async ({ invitation, inviter }) => {
					validateInvitation(invitation, inviter);
				},
				afterCreateOrganization: async ({ organization: org, member }) => {
					await initializeOrganization(org, member.userId);
				},
				afterDeleteOrganization: async ({ organization: org, user }) => {
					await recordOrgDeletion(org, user.id);
				},
				beforeUpdateMemberRole: async ({ member, newRole }) => {
					const active = await getActiveMemberOrNull();
					await validateRoleChange(member, newRole, active?.role);
				},
				afterUpdateMemberRole: async ({ user, organization: org, member, previousRole }) => {
					await sendRoleChangedEmail({
						to: user.email,
						userName: user.name,
						organizationName: org.name,
						oldRole: previousRole,
						newRole: member.role
					});
				},
				afterRemoveMember: async ({ user, organization: org }) => {
					await clearMemberSessions(user.id, org.id);
					await sendMemberRemovedEmail({
						to: user.email,
						userName: user.name,
						organizationName: org.name
					});
				}
			}
		}),
		...(polarConfigured ? [createPolarPlugin()] : []),
		emailOTP({
			otpLength: 8,
			generateOTP() {
				return randomInt(0, 100_000_000).toString().padStart(8, '0');
			},
			async sendVerificationOTP({ email, otp, type }) {
				await sendOtpVerificationEmail({ to: email, otp, type });
			}
		}),
		sveltekitCookies(getRequestEvent)
	],
	onAPIError: {
		onError: (error) => logger.error({ err: error }, 'Auth API error')
	}
});

export type Session = typeof auth.$Infer.Session;
export type ActiveMember = Awaited<ReturnType<typeof auth.api.getActiveMember>>;

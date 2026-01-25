import { randomInt } from 'node:crypto';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization } from 'better-auth/plugins';
import { db } from '$lib/server/db';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { admin } from 'better-auth/plugins';
import { emailOTP } from 'better-auth/plugins';
import {
	BETTER_AUTH_URL,
	BETTER_AUTH_SECRET,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET
} from '$env/static/private';
import {
	sendMemberRemovedEmail,
	sendOrganizationInvitationEmail,
	sendOtpVerificationEmail,
	sendRoleChangedEmail
} from '$services/email';
import { logger } from '$services/logger';
import { isTestEnv } from '$lib/server/env.server';
import { ac, roles } from './config/access-control';
import { createSessionStorage } from './adapters/session-storage.server';
import { createDatabaseHooks } from './hooks/database-hooks.server';
import { createPolarPlugin } from './plugins/polar.server';
import { validateInvitation } from './logic/validation';
import { TEST_OTP } from './constants';
import { initializeOrganization, recordOrgDeletion } from './api/hooks/organization';
import { getActiveMemberOrNull } from './api/queries/user';
import { validateRoleChange } from './api/queries/organization';
import { clearMemberSessions } from './api/mutations/user';

export const auth = betterAuth({
	secret: BETTER_AUTH_SECRET,
	baseURL: BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	secondaryStorage: createSessionStorage(),
	session: {
		storeSessionInDatabase: true,
		preserveSessionInDatabase: true
	},
	user: {
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				returned: true,
				input: false
			}
		}
	},
	emailAndPassword: {
		enabled: false
	},
	experimental: {
		joins: true
	},
	rateLimit: {
		enabled: !isTestEnv(),
		window: 60,
		max: 5
	},
	advanced: {
		database: {
			generateId: false
		},
		cookiePrefix: 'blob-app'
	},
	databaseHooks: createDatabaseHooks(),
	socialProviders: {
		google: {
			clientId: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET
		}
	},
	plugins: [
		admin({ ac, roles, adminRoles: ['superadmin'] }),
		organization({
			ac,
			roles,
			schema: {
				organization: {
					additionalFields: {
						entitlements: {
							type: 'json',
							required: true,
							returned: true,
							input: false
						}
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
			invitationHooks: {
				beforeCreateInvitation: async ({
					invitation,
					inviter
				}: {
					invitation: { role: string };
					inviter: { userId: string; role: string };
				}) => {
					validateInvitation(invitation, inviter);
				}
			},
			organizationHooks: {
				afterCreateOrganization: async ({ organization: org, member }) => {
					await initializeOrganization(org, member.userId);
				},
				afterDeleteOrganization: async ({ organization: org, user }) => {
					await recordOrgDeletion(org, user.id);
				},
				beforeUpdateMemberRole: async ({ member, newRole }) => {
					const activeMember = await getActiveMemberOrNull();
					await validateRoleChange(member, newRole, activeMember?.role);
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
		createPolarPlugin(),
		emailOTP({
			otpLength: 8,
			generateOTP() {
				return isTestEnv() ? TEST_OTP : randomInt(0, 100_000_000).toString().padStart(8, '0');
			},
			async sendVerificationOTP({ email, otp, type }) {
				await sendOtpVerificationEmail({ to: email, otp, type });
			}
		}),
		sveltekitCookies(getRequestEvent)
	],
	onAPIError: {
		onError: (error) => {
			logger.error({ error }, 'Auth API error');
		}
	}
});

export type Session = typeof auth.$Infer.Session;
export type ActiveMember = Awaited<ReturnType<typeof auth.api.getActiveMember>>;

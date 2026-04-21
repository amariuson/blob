import { env } from '$lib/server/env.server';

import { send } from './email.server';
import { render } from './renderer.server';
import MemberRemoved from './templates/member-removed.svelte';
import OrganizationInvitation from './templates/organization-invitation.svelte';
import OtpVerification from './templates/otp-verification.svelte';
import RoleChanged from './templates/role-changed.svelte';

export async function sendOtpVerificationEmail(args: { to: string; otp: string; type: string }) {
	const { html, text } = await render(OtpVerification, { ...args, appName: env.APP_NAME });
	await send({ to: args.to, subject: `Your ${env.APP_NAME} verification code`, html, text });
}

export async function sendOrganizationInvitationEmail(args: {
	to: string;
	inviterName: string;
	inviterEmail: string;
	organizationName: string;
	role: string;
}) {
	const { html, text } = await render(OrganizationInvitation, { ...args, appName: env.APP_NAME });
	await send({
		to: args.to,
		subject: `You've been invited to ${args.organizationName}`,
		html,
		text
	});
}

export async function sendRoleChangedEmail(args: {
	to: string;
	userName: string;
	organizationName: string;
	oldRole: string;
	newRole: string;
}) {
	const { html, text } = await render(RoleChanged, { ...args, appName: env.APP_NAME });
	await send({
		to: args.to,
		subject: `Your role in ${args.organizationName} has changed`,
		html,
		text
	});
}

export async function sendMemberRemovedEmail(args: {
	to: string;
	userName: string;
	organizationName: string;
}) {
	const { html, text } = await render(MemberRemoved, { ...args, appName: env.APP_NAME });
	await send({
		to: args.to,
		subject: `You've been removed from ${args.organizationName}`,
		html,
		text
	});
}

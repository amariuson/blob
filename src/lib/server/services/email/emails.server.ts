import { env } from '$lib/server/env.server';

import { send } from './email.server';
import { render } from './renderer.server';

// Svelte templates are loaded dynamically so non-Vite loaders (e.g. the
// better-auth CLI via jiti) don't try to parse `.svelte` files at import time.
export async function sendOtpVerificationEmail(args: { to: string; otp: string; type: string }) {
	const { default: OtpVerification } = await import('./templates/otp-verification.svelte');
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
	const { default: OrganizationInvitation } =
		await import('./templates/organization-invitation.svelte');
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
	const { default: RoleChanged } = await import('./templates/role-changed.svelte');
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
	const { default: MemberRemoved } = await import('./templates/member-removed.svelte');
	const { html, text } = await render(MemberRemoved, { ...args, appName: env.APP_NAME });
	await send({
		to: args.to,
		subject: `You've been removed from ${args.organizationName}`,
		html,
		text
	});
}

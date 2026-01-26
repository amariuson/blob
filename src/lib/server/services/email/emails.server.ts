import { sendEmail } from './email.server';
import { renderEmail } from './renderer.server';
import MemberRemoved from './templates/MemberRemoved.svelte';
import OrganizationInvitation from './templates/OrganizationInvitation.svelte';
import OtpVerification from './templates/OtpVerification.svelte';
import RoleChanged from './templates/RoleChanged.svelte';
import WelcomeEmail from './templates/WelcomeEmail.svelte';
import type { OtpType } from './types';

const otpSubjects: Record<OtpType, string> = {
	'sign-in': 'Your sign-in code',
	'email-verification': 'Verify your email',
	'forget-password': 'Reset your password'
};

export async function sendOtpVerificationEmail(params: { to: string; otp: string; type: OtpType }) {
	const { to, otp, type } = params;

	const { html, text } = await renderEmail(OtpVerification, { otp, type });

	await sendEmail({
		to,
		subject: otpSubjects[type],
		html,
		text
	});
}

export async function sendOrganizationInvitationEmail(params: {
	to: string;
	inviterName: string;
	inviterEmail: string;
	organizationName: string;
	role: string;
	inviteLink?: string;
}) {
	const { to, inviterName, inviterEmail, organizationName, role, inviteLink } = params;

	const { html, text } = await renderEmail(OrganizationInvitation, {
		inviterName,
		inviterEmail,
		organizationName,
		role,
		inviteLink
	});

	await sendEmail({
		to,
		subject: `You've been invited to join ${organizationName}`,
		html,
		text
	});
}

export async function sendWelcomeEmail(params: { to: string; userName?: string }) {
	const { to, userName } = params;

	const { html, text } = await renderEmail(WelcomeEmail, { userName });

	await sendEmail({
		to,
		subject: 'Welcome to Blob',
		html,
		text
	});
}

export async function sendMemberRemovedEmail(params: {
	to: string;
	userName?: string;
	organizationName: string;
}) {
	const { to, userName, organizationName } = params;

	const { html, text } = await renderEmail(MemberRemoved, { userName, organizationName });

	await sendEmail({
		to,
		subject: `You've been removed from ${organizationName}`,
		html,
		text
	});
}

export async function sendRoleChangedEmail(params: {
	to: string;
	userName?: string;
	organizationName: string;
	oldRole: string;
	newRole: string;
}) {
	const { to, userName, organizationName, oldRole, newRole } = params;

	const { html, text } = await renderEmail(RoleChanged, {
		userName,
		organizationName,
		oldRole,
		newRole
	});

	await sendEmail({
		to,
		subject: `Your role in ${organizationName} has been updated`,
		html,
		text
	});
}

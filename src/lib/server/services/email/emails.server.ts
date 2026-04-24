import { sendEmail } from './email.server';
import {
	invitationSubject,
	memberRemovedSubject,
	otpSubject,
	roleChangedSubject,
	welcomeSubject
} from './logic';
import { renderEmail } from './renderer.server';
import MemberRemoved from './templates/MemberRemoved.svelte';
import OrganizationInvitation from './templates/OrganizationInvitation.svelte';
import OtpVerification from './templates/OtpVerification.svelte';
import RoleChanged from './templates/RoleChanged.svelte';
import WelcomeEmail from './templates/WelcomeEmail.svelte';
import type { OtpType } from './types';

export async function sendOtpVerificationEmail(params: { to: string; otp: string; type: OtpType }) {
	const { to, otp, type } = params;
	const { html, text } = await renderEmail(OtpVerification, { otp, type });
	await sendEmail({ to, subject: otpSubject(type), html, text });
}

export async function sendOrganizationInvitationEmail(params: {
	to: string;
	inviterName: string;
	inviterEmail: string;
	organizationName: string;
	role: string;
	inviteLink?: string;
}) {
	const { to, organizationName, ...rest } = params;
	const { html, text } = await renderEmail(OrganizationInvitation, { organizationName, ...rest });
	await sendEmail({ to, subject: invitationSubject(organizationName), html, text });
}

export async function sendWelcomeEmail(params: { to: string; userName?: string }) {
	const { to, userName } = params;
	const { html, text } = await renderEmail(WelcomeEmail, { userName });
	await sendEmail({ to, subject: welcomeSubject, html, text });
}

export async function sendMemberRemovedEmail(params: {
	to: string;
	userName?: string;
	organizationName: string;
}) {
	const { to, userName, organizationName } = params;
	const { html, text } = await renderEmail(MemberRemoved, { userName, organizationName });
	await sendEmail({ to, subject: memberRemovedSubject(organizationName), html, text });
}

export async function sendRoleChangedEmail(params: {
	to: string;
	userName?: string;
	organizationName: string;
	oldRole: string;
	newRole: string;
}) {
	const { to, organizationName, ...rest } = params;
	const { html, text } = await renderEmail(RoleChanged, { organizationName, ...rest });
	await sendEmail({ to, subject: roleChangedSubject(organizationName), html, text });
}

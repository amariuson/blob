import type { OtpType } from './types';

const otpSubjects: Record<OtpType, string> = {
	'sign-in': 'Your sign-in code',
	'email-verification': 'Verify your email',
	'forget-password': 'Reset your password'
};

export function otpSubject(type: OtpType): string {
	return otpSubjects[type];
}

export function invitationSubject(organizationName: string): string {
	return `You've been invited to join ${organizationName}`;
}

export function memberRemovedSubject(organizationName: string): string {
	return `You've been removed from ${organizationName}`;
}

export function roleChangedSubject(organizationName: string): string {
	return `Your role in ${organizationName} has been updated`;
}

export const welcomeSubject = 'Welcome to Blob';

export function recipientCount(to: string | string[]): number {
	return Array.isArray(to) ? to.length : 1;
}

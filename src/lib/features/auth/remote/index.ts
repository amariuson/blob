import { error, invalid } from '@sveltejs/kit';
import { form, query } from '$app/server';

import { APIError } from 'better-auth';
import z from 'zod';

import {
	sendEmailOTP,
	sendEmailOTPSchema,
	signInWithEmailOTP,
	signInWithEmailOTPSchema,
	signInWithGoogle
} from '../server/api/mutations/auth';
import {
	acceptInvitationOnboarding,
	createOrganizationOnboarding,
	createOrgOnboardingSchema,
	declineInvitationOnboarding,
	invitationActionSchema
} from '../server/api/mutations/onboarding';
import { signOutUser } from '../server/api/mutations/user';
import { getActiveMember, getUserInvitations } from '../server/api/queries/user';
import { getSession } from '../server/api/queries/user';

export const signOutUserForm = form(async () => {
	await signOutUser();
});

export const getSessionQuery = query(async () => {
	return await getSession();
});

// onboarding

export const getUserInvitationsQuery = query(getUserInvitations);

export const createOrgOnboardingForm = form(
	createOrgOnboardingSchema,
	createOrganizationOnboarding
);

export const acceptInvitationForm = form(invitationActionSchema, acceptInvitationOnboarding);

export const declineInvitationForm = form(invitationActionSchema, declineInvitationOnboarding);

// auth

export const sendEmailOTPForm = form(sendEmailOTPSchema, sendEmailOTP);

export const signInWithEmailOTPForm = form(signInWithEmailOTPSchema, async (data, issue) => {
	try {
		await signInWithEmailOTP(data);
	} catch (err) {
		if (err instanceof APIError) {
			if (err.body?.code === 'TOO_MANY_ATTEMPTS') {
				error(429, {
					code: 'TOO_MANY_REQUESTS',
					message: 'Too many attempts!'
				});
			}
			invalid(issue.otp(err.body?.message ?? 'Something went wrong!'));
		}
		throw err;
	}
});

export const signInWithGoogleForm = form(z.object(), signInWithGoogle);

// member

export const getActiveMemberQuery = query(getActiveMember);

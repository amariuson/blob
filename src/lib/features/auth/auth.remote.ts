import { error, invalid } from '@sveltejs/kit';
import { form, query } from '$app/server';

import { APIError } from 'better-auth';
import { z } from 'zod';

import {
	createOrgOnboardingSchema,
	invitationActionSchema,
	sendEmailOTPSchema,
	signInWithEmailOTPSchema
} from './schemas';
import {
	acceptInvitationOnboarding,
	createOrganizationOnboarding,
	declineInvitationOnboarding,
	sendEmailOTP,
	signInWithEmailOTP,
	signInWithGoogle,
	signOutUser
} from './server/api/mutations';
import { getUserInvitations, getSession } from './server/api/queries';

export const signOutUserForm = form(signOutUser);

export const getSessionQuery = query(getSession);

export const getUserInvitationsQuery = query(getUserInvitations);

export const createOrgOnboardingForm = form(
	createOrgOnboardingSchema,
	createOrganizationOnboarding
);

export const acceptInvitationForm = form(invitationActionSchema, acceptInvitationOnboarding);

export const declineInvitationForm = form(invitationActionSchema, declineInvitationOnboarding);

export const sendEmailOTPForm = form(sendEmailOTPSchema, sendEmailOTP);

export const signInWithEmailOTPForm = form(signInWithEmailOTPSchema, async (data, issue) => {
	try {
		await signInWithEmailOTP(data);
	} catch (err) {
		if (err instanceof APIError) {
			if (err.body?.code === 'TOO_MANY_ATTEMPTS') {
				error(429, { code: 'TOO_MANY_REQUESTS', message: 'Too many attempts!' });
			}
			invalid(issue.otp(err.body?.message ?? 'Something went wrong!'));
		}
		throw err;
	}
});

export const signInWithGoogleForm = form(z.object({}), signInWithGoogle);

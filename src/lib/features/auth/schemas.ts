import { z } from 'zod';

export const sendEmailOTPSchema = z.object({
	email: z.email()
});

export const signInWithEmailOTPSchema = z.object({
	email: z.email(),
	otp: z.string().length(8)
});

export const createOrgOnboardingSchema = z.object({
	name: z.string().min(1, 'Organization name is required').max(100, 'Name is too long')
});

export const invitationActionSchema = z.object({
	invitationId: z.string().min(1, 'Invitation ID is required')
});

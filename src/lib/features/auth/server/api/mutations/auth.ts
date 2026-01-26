import { error, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { getRequestEvent } from '$app/server';

import z from 'zod';

import { auth } from '../../auth';

export const sendEmailOTPSchema = z.object({
	email: z.email()
});

export async function sendEmailOTP(data: z.infer<typeof sendEmailOTPSchema>) {
	const { email } = data;
	const event = getRequestEvent();
	const result = await auth.api.sendVerificationOTP({
		headers: event.request.headers,
		body: {
			email,
			type: 'sign-in'
		}
	});
	if (!result) {
		error(409, {
			code: 'CONFLICT',
			message: 'Failed to send OTP!'
		});
	}
}

export const signInWithEmailOTPSchema = z.object({
	email: z.email(),
	otp: z.string().length(8)
});

export async function signInWithEmailOTP(data: z.infer<typeof signInWithEmailOTPSchema>) {
	const { email, otp } = data;
	const event = getRequestEvent();
	await auth.api.signInEmailOTP({
		headers: event.request.headers,
		body: {
			email,
			otp
		}
	});
	redirect(302, resolve('/'));
}

export async function signInWithGoogle() {
	const event = getRequestEvent();
	const result = await auth.api.signInSocial({
		headers: event.request.headers,
		body: {
			provider: 'google'
		}
	});
	if (result.redirect && result.url) {
		redirect(302, result.url);
	}
}

import { Resend } from 'resend';
import { instrumentResend } from '@kubiks/otel-resend';
import { RESEND_API_KEY, RESEND_SEND_EMAIL_ADDRESS } from '$env/static/private';
import { logger } from '$lib/server/services/logger';
import { isTestEnv } from '$lib/server/env.server';

const resend = instrumentResend(new Resend(RESEND_API_KEY));

type EmailOptions = {
	to: string | string[];
	subject: string;
	html?: string;
	text?: string;
};

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
	if (!html && !text) {
		throw new Error('Either html or text must be provided');
	}

	const recipientCount = Array.isArray(to) ? to.length : 1;

	// Skip sending emails in dev mode and E2E tests
	if (isTestEnv()) {
		logger.info({ to, subject, recipientCount, skipped: true }, 'Email sending skipped (test env)');
		return { id: `mock-${Date.now()}` };
	}

	logger.debug({ to, subject, recipientCount }, 'Sending email');

	const emailPayload = {
		from: RESEND_SEND_EMAIL_ADDRESS,
		to,
		subject,
		html,
		text
	} as Parameters<typeof resend.emails.send>[0];

	const { data, error } = await resend.emails.send(emailPayload);

	if (error) {
		logger.error(
			{ to, subject, recipientCount, error, errorMessage: error.message },
			'Failed to send email'
		);
		throw new Error(`Failed to send email: ${error.message}`);
	}

	logger.info({ to, subject, emailId: data?.id, recipientCount }, 'Email sent successfully');

	return data;
}

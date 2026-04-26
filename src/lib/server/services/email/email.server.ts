import { RESEND_API_KEY, RESEND_SEND_EMAIL_ADDRESS } from '$env/static/private';

import { isTestEnv } from '$lib/server/env.server';
import { logger } from '$services/logger';
import { withSpan } from '$services/tracing';

import { Resend } from 'resend';
import { instrumentResend } from '@kubiks/otel-resend';

import { recipientCount } from './logic';

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

	const count = recipientCount(to);

	if (isTestEnv()) {
		logger.info(
			{ to, subject, recipientCount: count, skipped: true },
			'Email sending skipped (test env)'
		);
		return { id: `mock-${Date.now()}` };
	}

	return withSpan(
		'email.send',
		{ 'email.subject': subject, 'email.recipient_count': count },
		async () => {
			logger.debug({ to, subject, recipientCount: count }, 'Sending email');

			const { data, error } = await resend.emails.send({
				from: RESEND_SEND_EMAIL_ADDRESS,
				to,
				subject,
				html,
				text
			} as Parameters<typeof resend.emails.send>[0]);

			if (error) {
				logger.error({ to, subject, recipientCount: count, err: error }, 'Failed to send email');
				throw new Error(`Failed to send email: ${error.message}`);
			}

			logger.info({ to, subject, emailId: data?.id, recipientCount: count }, 'Email sent');
			return data;
		}
	);
}

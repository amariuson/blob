import { instrumentResend } from '@kubiks/otel-resend';
import { Resend } from 'resend';

import { env, isDev, requireResend } from '$lib/server/env.server';
import { logger } from '$services/logger';

type SendArgs = { to: string; subject: string; html: string; text: string };

let cachedClient: Resend | null = null;

function getClient(): Resend {
	if (cachedClient) return cachedClient;
	const { apiKey } = requireResend();
	cachedClient = instrumentResend(new Resend(apiKey));
	return cachedClient;
}

export async function send({ to, subject, html, text }: SendArgs) {
	if (!env.RESEND_API_KEY) {
		if (!isDev) {
			throw new Error('RESEND_API_KEY missing in production');
		}
		logger.info({ to, subject, textPreview: text.slice(0, 200) }, '[email/dev] email not sent');
		return;
	}

	const client = getClient();
	const { error } = await client.emails.send({ from: env.EMAIL_FROM, to, subject, html, text });
	if (error) {
		logger.error({ err: error, to, subject }, 'Resend send failed');
		throw new Error(`Email send failed: ${error.message}`);
	}
}

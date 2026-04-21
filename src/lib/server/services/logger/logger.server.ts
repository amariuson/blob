import pino from 'pino';

import { env, isDev } from '$lib/server/env.server';

import { onShutdown } from '../lifecycle';

// Dev: pino-pretty. Prod + Axiom configured: @axiomhq/pino. Prod + no Axiom:
// plain stdout JSON (same graceful skip pattern the tracing service uses).
const transport = isDev
	? pino.transport({
			target: 'pino-pretty',
			options: { colorize: true, translateTime: 'SYS:HH:MM:ss' }
		})
	: env.AXIOM_TOKEN && env.AXIOM_DATASET_LOGS
		? pino.transport({
				target: '@axiomhq/pino',
				options: { dataset: env.AXIOM_DATASET_LOGS, token: env.AXIOM_TOKEN }
			})
		: null;

export const logger = transport
	? pino({ level: isDev ? 'debug' : 'info', base: { service: env.OTEL_SERVICE_NAME } }, transport)
	: pino({ level: 'info', base: { service: env.OTEL_SERVICE_NAME } });

if (transport) {
	onShutdown(
		'logger',
		() =>
			new Promise<void>((resolve) => {
				transport.once('close', () => resolve());
				transport.end();
			})
	);
}

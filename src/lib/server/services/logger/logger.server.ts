import pino from 'pino';

import { env, isDev } from '$lib/server/env.server';

import { onShutdown } from '../lifecycle';

const transport = isDev
	? pino.transport({
			target: 'pino-pretty',
			options: { colorize: true, translateTime: 'SYS:HH:MM:ss' }
		})
	: pino.transport({
			target: '@axiomhq/pino',
			options: { dataset: env.AXIOM_DATASET_LOGS, token: env.AXIOM_TOKEN }
		});

export const logger = pino(
	{ level: isDev ? 'debug' : 'info', base: { service: env.OTEL_SERVICE_NAME } },
	transport
);

onShutdown(
	'logger',
	() =>
		new Promise<void>((resolve) => {
			transport.once('close', () => resolve());
			transport.end();
		})
);

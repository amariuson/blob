import pino from 'pino';

import { env, isDev, requireAxiom } from '$lib/server/env.server';

import { onShutdown } from '../lifecycle';

const transport = isDev
	? pino.transport({
			target: 'pino-pretty',
			options: { colorize: true, translateTime: 'SYS:HH:MM:ss' }
		})
	: (() => {
			const axiom = requireAxiom();
			return pino.transport({
				target: '@axiomhq/pino',
				options: { dataset: axiom.datasetLogs, token: axiom.token }
			});
		})();

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

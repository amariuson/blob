import { logger } from '../logger';

type ShutdownHandler = { name: string; handler: () => Promise<unknown> };

const shutdownHandlers: ShutdownHandler[] = [];
const SHUTDOWN_TIMEOUT_MS = 10_000;

let isShuttingDown = false;

export function onShutdown(name: string, handler: () => Promise<unknown>) {
	shutdownHandlers.push({ name, handler });
}

async function runHandler({ name, handler }: ShutdownHandler): Promise<boolean> {
	try {
		await Promise.race([
			handler(),
			new Promise((_, reject) =>
				setTimeout(() => reject(new Error('timeout')), SHUTDOWN_TIMEOUT_MS)
			)
		]);
		logger.info({ name }, 'Shutdown handler completed');
		return true;
	} catch (err) {
		logger.error({ name, err }, 'Shutdown handler failed');
		return false;
	}
}

async function shutdown(signal: string) {
	if (isShuttingDown) return;
	isShuttingDown = true;

	logger.info({ signal, handlers: shutdownHandlers.length }, 'Shutdown initiated');

	let hasError = false;
	for (const h of shutdownHandlers) {
		if (!(await runHandler(h))) hasError = true;
	}

	logger.info({ success: !hasError }, 'Shutdown complete');
	process.exit(hasError ? 1 : 0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

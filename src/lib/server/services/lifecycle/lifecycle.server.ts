const shutdownHandlers: Array<{ name: string; handler: () => Promise<unknown> }> = [];

export function onShutdown(name: string, handler: () => Promise<unknown>) {
	shutdownHandlers.push({ name, handler });
}

const shutdown = async () => {
	for (const { name, handler } of shutdownHandlers) {
		try {
			await handler();
		} catch (err) {
			console.error(`Error during ${name} shutdown:`, err);
		}
	}
	process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

const shutdownHandlers: Array<{ name: string; handler: () => Promise<void> }> = [];

export function onShutdown(name: string, handler: () => Promise<void>) {
	shutdownHandlers.push({ name, handler });
}

// Self-initialize on import
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

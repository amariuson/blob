type Hook = { name: string; fn: () => Promise<void> | void; timeout: number };

const hooks: Hook[] = [];
let installed = false;

export function onShutdown(
	name: string,
	fn: () => Promise<void> | void,
	options: { timeout?: number } = {}
) {
	hooks.push({ name, fn, timeout: options.timeout ?? 5000 });
	install();
}

function install() {
	if (installed) return;
	installed = true;
	for (const signal of ['SIGTERM', 'SIGINT'] as const) {
		process.once(signal, () => void runAll(signal));
	}
}

async function runAll(signal: string) {
	console.log(`[lifecycle] received ${signal}, running ${hooks.length} shutdown hooks`);
	// LIFO: last-registered runs first
	for (const hook of [...hooks].reverse()) {
		try {
			await withTimeout(hook.fn(), hook.timeout, hook.name);
		} catch (err) {
			console.error(`[lifecycle] hook "${hook.name}" failed:`, err);
		}
	}
	process.exit(0);
}

function withTimeout<T>(p: Promise<T> | T, ms: number, name: string): Promise<T> {
	return Promise.race([
		Promise.resolve(p),
		new Promise<T>((_, reject) =>
			setTimeout(() => reject(new Error(`hook "${name}" timed out after ${ms}ms`)), ms)
		)
	]);
}

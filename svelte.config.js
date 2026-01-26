import adapter from '@sveltejs/adapter-node';

import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$features: 'src/lib/features',
			'$features/*': 'src/lib/features/*',
			$services: 'src/lib/server/services',
			'$services/*': 'src/lib/server/services/*'
		},
		experimental: {
			remoteFunctions: true,
			tracing: { server: true },
			instrumentation: { server: true }
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	},
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx']
};

export default config;

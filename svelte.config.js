import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$features: 'src/lib/features',
			'$features/*': 'src/lib/features/*'
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

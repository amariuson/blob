import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';

import svelteConfig from './svelte.config.js';
import features from './tools/eslint/index.js';

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		plugins: { 'simple-import-sort': simpleImportSort },

		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^svelte', '^@sveltejs', '^\\$app', '^\\$env', '^\\$service-worker'],
						['^\\$'],
						['^[a-z]', '^@'],
						['^\\.']
					]
				}
			],
			'simple-import-sort/exports': 'error'
		}
	},
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },

		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	// Feature architecture rules - apply globally
	// See new_claude.md for architecture documentation
	{
		files: ['src/**/*.ts', 'src/**/*.js', 'src/**/*.svelte'],
		plugins: {
			features
		},
		rules: {
			// All imports from features must use public APIs
			'features/no-internal-feature-imports': 'error',
			// Ban feature imports in shared/ and server/ (hierarchy enforcement)
			'features/no-feature-imports': 'error',
			// Services ($services/) can only be used in features, not routes
			'features/no-direct-service-imports': 'error',
			// Enforce $features/ and $services/ over full paths
			'features/prefer-path-aliases': 'error'
		}
	},
	// Feature-internal rules (only apply to feature files)
	{
		files: ['src/lib/features/**/*.ts', 'src/lib/features/**/*.js', 'src/lib/features/**/*.svelte'],
		plugins: {
			features
		},
		rules: {
			// remote/ folder can only export query(), form(), command(), prerender()
			'features/remote-only-exports': 'error',
			// Server imports only in server/, api/, remote/, *.server.ts (warn until migration)
			'features/server-code-location': 'warn',
			// Distinguish server/api/hooks/ (library) from server/hooks/ (database)
			'features/hooks-folder-usage': 'warn',
			// Use relative imports within same feature (not $features/same-feature)
			'features/prefer-relative-imports': 'error'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	}
);

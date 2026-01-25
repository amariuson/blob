#!/usr/bin/env node

/**
 * Feature Generator Script
 *
 * Usage: node tools/scripts/generate-feature.js <feature-name>
 * Example: node tools/scripts/generate-feature.js posts
 */

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const FEATURES_DIR = 'src/lib/features';

const featureName = process.argv[2];

if (!featureName) {
	console.error('Usage: node tools/scripts/generate-feature.js <feature-name>');
	console.error('Example: node tools/scripts/generate-feature.js posts');
	process.exit(1);
}

if (!/^[a-z][a-z0-9-]*$/.test(featureName)) {
	console.error(
		'Feature name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens'
	);
	process.exit(1);
}

const featureDir = join(FEATURES_DIR, featureName);

const pascalCase = featureName
	.split('-')
	.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
	.join('');

const files = {
	'index.ts': `// Client-safe public API
// Export: remote functions, schemas, types, constants, components
// Do NOT export: server-only code (use $features/${featureName}/server)

export * from './remote';
export * from './types';
// export { create${pascalCase}Schema } from './server/api/mutations';
// export { default as ${pascalCase}Card } from './components/${featureName}-card.svelte';
`,

	'types.ts': `// Feature types (client + server)
// Infer from Drizzle: type Post = InferSelectModel<typeof posts>;
`,

	'constants.ts': `// Feature constants (client + server)
`,

	'config/index.ts': `// Static config: permissions, access control
// Only import types, no server code
`,

	'logic/index.ts': `// Pure functions: validation, transforms, calculations
// No side effects, no server imports
`,

	'components/index.ts': `// Feature UI components
// Import directly: import ${pascalCase}Card from '$features/${featureName}/components/${featureName}-card.svelte';
// Or export from ../index.ts for public API
// Forms go in: components/forms/
`,

	'remote/index.ts': `// Remote functions ONLY: query(), form(), command(), prerender()
// No schemas, helpers, or types - export those from index.ts
`,

	'server/index.ts': `// Server-only public API
// Other features import from: $features/${featureName}/server

export * from './api';
`,

	'server/api/index.ts': `// Re-export queries and mutations

export * from './queries';
export * from './mutations';
`,

	'server/api/queries.ts': `// Database reads
// One function per query: get${pascalCase}ById, get${pascalCase}s, search${pascalCase}s
`,

	'server/api/mutations.ts': `// Database writes + Zod schemas
// Define schema next to mutation: create${pascalCase}Schema + create${pascalCase}()
`,

	'server/api/hooks/index.ts': `// Library lifecycle hooks (e.g., better-auth)
// NOT database hooks (those go in ../hooks/)
`,

	'server/adapters/index.ts': `// External service adapters
// Wrap external APIs, handle retries/errors
`,

	'server/hooks/index.ts': `// Database/ORM hooks (Drizzle, Prisma)
// NOT library hooks (those go in api/hooks/)
`,

	'server/plugins/index.ts': `// Library plugins (e.g., better-auth, Polar)
`
};

async function generateFeature() {
	console.log(`\nGenerating feature: ${featureName}\n`);

	await mkdir(featureDir, { recursive: true });

	for (const [filePath, content] of Object.entries(files)) {
		const fullPath = join(featureDir, filePath);
		const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));

		await mkdir(dir, { recursive: true });
		await writeFile(fullPath, content);
		console.log(`  Created: ${filePath}`);
	}

	console.log(`
Feature "${featureName}" created at ${featureDir}

Next steps:
1. Add database schema to $lib/server/db/schema
2. Implement queries in server/api/queries.ts
3. Implement mutations in server/api/mutations.ts
4. Create remote functions in remote/index.ts
5. Add components to components/ (forms in components/forms/)
6. Export public API from index.ts
`);
}

generateFeature().catch((err) => {
	console.error('Error generating feature:', err);
	process.exit(1);
});

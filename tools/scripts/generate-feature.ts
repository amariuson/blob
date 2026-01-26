#!/usr/bin/env node

/**
 * Feature Generator Script
 *
 * Usage: node tools/scripts/generate-feature.js <feature-name>
 * Example: node tools/scripts/generate-feature.js posts
 *
 * Safe to run on existing features - only adds missing files/folders.
 */

import { mkdir, writeFile, access } from 'fs/promises';
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

// Files with content (only index.ts in root, remote, server)
const files = {
	'index.ts': `// Client-safe public API
// Export: remote functions, schemas, types, constants, components
`,

	'types.ts': `// Feature types (client + server)
`,

	'constants.ts': `// Feature constants (client + server)
`,

	'remote/index.ts': `// Remote functions ONLY: query(), form(), command(), prerender()
`,

	'server/index.ts': `// Server-only public API
`,

	'server/api/queries.ts': `// Database reads
`,

	'server/api/mutations.ts': `// Database writes + Zod schemas
`
};

// Empty folders to create (user removes what they don't need)
const folders = [
	'components',
	'components/forms',
	'config',
	'logic',
	'server/adapters',
	'server/handles',
	'server/hooks',
	'server/plugins',
	'server/api/hooks'
];

async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function generateFeature() {
	const isNew = !(await exists(featureDir));
	console.log(`\n${isNew ? 'Generating' : 'Updating'} feature: ${featureName}\n`);

	// Create feature directory
	await mkdir(featureDir, { recursive: true });

	// Create empty folders
	for (const folder of folders) {
		const folderPath = join(featureDir, folder);
		if (!(await exists(folderPath))) {
			await mkdir(folderPath, { recursive: true });
			console.log(`  Created folder: ${folder}/`);
		}
	}

	// Create files (skip if exists)
	for (const [filePath, content] of Object.entries(files)) {
		const fullPath = join(featureDir, filePath);
		const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));

		await mkdir(dir, { recursive: true });

		if (await exists(fullPath)) {
			console.log(`  Skipped (exists): ${filePath}`);
		} else {
			await writeFile(fullPath, content);
			console.log(`  Created: ${filePath}`);
		}
	}

	console.log(`\nFeature "${featureName}" ${isNew ? 'created' : 'updated'} at ${featureDir}`);
	console.log(`Remove empty folders you don't need.\n`);
}

generateFeature().catch((err) => {
	console.error('Error generating feature:', err);
	process.exit(1);
});

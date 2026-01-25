#!/usr/bin/env node

/**
 * Feature Generator Script
 *
 * Usage: node tools/scripts/generate-feature.js <feature-name>
 * Example: node tools/scripts/generate-feature.js posts
 *
 * Creates a new feature with the standard folder structure and placeholder files.
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

// Validate feature name (lowercase, alphanumeric, hyphens)
if (!/^[a-z][a-z0-9-]*$/.test(featureName)) {
	console.error(
		'Feature name must be lowercase, start with a letter, and contain only letters, numbers, and hyphens'
	);
	process.exit(1);
}

const featureDir = join(FEATURES_DIR, featureName);

// Convert feature-name to FeatureName for types
const pascalCase = featureName
	.split('-')
	.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
	.join('');

const files = {
	// ===================
	// Root level files
	// ===================
	'index.ts': `/**
 * ${pascalCase} Feature - Client-Safe Public API
 *
 * This file exports everything that can be safely used on the client.
 * Import from here: import { ... } from '$features/${featureName}';
 *
 * CAN export:
 * - Remote functions (from ./remote)
 * - Zod schemas (for client-side validation/preflight)
 * - Types
 * - Constants
 * - Pure logic functions
 *
 * CANNOT export:
 * - Server-only code (database, auth, services)
 * - Anything from ./server (use $features/${featureName}/server instead)
 */

// Re-export remote functions
export * from './remote';

// Re-export schemas for client-side validation
// export { createPostSchema } from './server/api/mutations';

// Re-export types
export * from './types';

// Re-export constants
// export * from './constants';
`,

	'types.ts': `/**
 * ${pascalCase} Feature - Types
 *
 * Feature-specific TypeScript types.
 * These can be imported from anywhere (client or server).
 *
 * For database entity types, consider inferring from Drizzle schema:
 * import type { InferSelectModel } from 'drizzle-orm';
 * import type { posts } from '$lib/server/db/schema';
 * export type Post = InferSelectModel<typeof posts>;
 */

// Example types:
// export type ${pascalCase}Status = 'draft' | 'published' | 'archived';
//
// export interface ${pascalCase}Item {
//   id: string;
//   title: string;
//   status: ${pascalCase}Status;
//   createdAt: Date;
// }
`,

	'constants.ts': `/**
 * ${pascalCase} Feature - Constants
 *
 * Feature-specific constants that can be used on client or server.
 * Keep these simple and avoid importing server-only code.
 */

// Example constants:
// export const MAX_TITLE_LENGTH = 100;
// export const ALLOWED_STATUSES = ['draft', 'published', 'archived'] as const;
`,

	// ===================
	// Config folder
	// ===================
	'config/index.ts': `/**
 * ${pascalCase} Feature - Configuration
 *
 * Static configuration like permissions, access control rules, etc.
 * Should only import types, no server-only code.
 *
 * Example: Role-based access control
 */

// Example access control:
// export const ${featureName.toUpperCase()}_PERMISSIONS = {
//   create: ['admin', 'editor'],
//   read: ['admin', 'editor', 'viewer'],
//   update: ['admin', 'editor'],
//   delete: ['admin'],
// } as const;
`,

	// ===================
	// Logic folder
	// ===================
	'logic/index.ts': `/**
 * ${pascalCase} Feature - Pure Logic Functions
 *
 * Pure functions for validation, transformation, and business rules.
 * These must be side-effect free and work on both client and server.
 *
 * ALLOWED:
 * - Data transformations
 * - Validation helpers
 * - Formatting functions
 * - Business rule calculations
 *
 * NOT ALLOWED:
 * - Database operations
 * - API calls
 * - Side effects
 * - Server-only imports
 */

// Example pure functions:
// export function formatTitle(title: string): string {
//   return title.trim().slice(0, 100);
// }
//
// export function isValidSlug(slug: string): boolean {
//   return /^[a-z0-9-]+$/.test(slug);
// }
//
// export function calculateReadingTime(content: string): number {
//   const wordsPerMinute = 200;
//   const words = content.split(/\\s+/).length;
//   return Math.ceil(words / wordsPerMinute);
// }
`,

	// ===================
	// Components folder
	// ===================
	'components/.gitkeep': '',

	'components/forms/.gitkeep': '',

	// ===================
	// Remote folder
	// ===================
	'remote/index.ts': `/**
 * ${pascalCase} Feature - Remote Functions
 *
 * This file can ONLY export remote functions: query(), form(), command(), prerender()
 * Import from here: import { ... } from '$features/${featureName}/remote';
 *
 * Remote functions are thin wrappers around server/api functions.
 * They handle the SvelteKit remote function magic.
 *
 * ALLOWED exports:
 * - query(...) - Read data
 * - form(...) - Form submissions (works without JS)
 * - command(...) - Non-form mutations
 * - prerender(...) - Static data (built at deploy time)
 *
 * NOT ALLOWED exports:
 * - Zod schemas (export from index.ts instead)
 * - Helper functions (put in logic/ or server/api/)
 * - Types (put in types.ts)
 * - Constants (put in constants.ts)
 */

import { query, form } from '$app/server';
// import { z } from 'zod';
// import { getItems, getItemBySlug } from '../server/api/queries';
// import { createItem, createItemSchema } from '../server/api/mutations';

// Example query - fetches all items
// export const get${pascalCase}sQuery = query(async () => {
//   return await getItems();
// });

// Example query with parameter
// export const get${pascalCase}Query = query(z.string(), async (slug) => {
//   return await getItemBySlug(slug);
// });

// Example form - handles form submission
// export const create${pascalCase}Form = form(createItemSchema, async (data) => {
//   return await createItem(data);
// });
`,

	// ===================
	// Server folder
	// ===================
	'server/index.ts': `/**
 * ${pascalCase} Feature - Server-Only Public API
 *
 * This file exports server-only code for use by other features.
 * Import from here: import { ... } from '$features/${featureName}/server';
 *
 * CAN export:
 * - API functions (queries, mutations)
 * - Server-only utilities
 * - Feature instance (if applicable)
 *
 * This is the ONLY file other features should import from for server code.
 * Internal server files (api/, hooks/, etc.) should not be imported directly.
 */

// Re-export API functions
export * from './api';

// Re-export logic functions that are useful for other features
// export { validatePermissions } from '../logic';
`,

	// ===================
	// Server API folder
	// ===================
	'server/api/index.ts': `/**
 * ${pascalCase} Feature - API Index
 *
 * Re-exports all queries and mutations for convenient imports.
 */

export * from './queries';
export * from './mutations';
`,

	'server/api/queries.ts': `/**
 * ${pascalCase} Feature - Queries (Data Reads)
 *
 * All database read operations for this feature.
 * These are called by remote functions or other server code.
 *
 * Guidelines:
 * - One function per query
 * - Use descriptive names: getItemById, getItemsByUser, searchItems
 * - Return typed data
 * - Handle not-found cases (return null or throw error())
 */

// import { db } from '$lib/server/db';
// import { ${featureName} } from '$lib/server/db/schema';
// import { eq } from 'drizzle-orm';
// import { error } from '@sveltejs/kit';

// Example: Get all items
// export async function get${pascalCase}s() {
//   return await db.query.${featureName}.findMany({
//     orderBy: (items, { desc }) => [desc(items.createdAt)],
//   });
// }

// Example: Get single item by ID
// export async function get${pascalCase}ById(id: string) {
//   const item = await db.query.${featureName}.findFirst({
//     where: eq(${featureName}.id, id),
//   });
//
//   if (!item) {
//     error(404, { message: '${pascalCase} not found', code: 'NOT_FOUND' });
//   }
//
//   return item;
// }

// Example: Get item by slug
// export async function get${pascalCase}BySlug(slug: string) {
//   return await db.query.${featureName}.findFirst({
//     where: eq(${featureName}.slug, slug),
//   });
// }
`,

	'server/api/mutations.ts': `/**
 * ${pascalCase} Feature - Mutations (Data Writes)
 *
 * All database write operations for this feature.
 * Each mutation should have a Zod schema for validation.
 *
 * Guidelines:
 * - Define schema next to mutation function
 * - Validate input with Zod
 * - Handle authorization
 * - Return created/updated data
 */

import { z } from 'zod';
// import { db } from '$lib/server/db';
// import { ${featureName} } from '$lib/server/db/schema';
// import { eq } from 'drizzle-orm';
// import { error, redirect } from '@sveltejs/kit';

// Example: Create schema and mutation
// export const create${pascalCase}Schema = z.object({
//   title: z.string().min(1).max(100),
//   content: z.string().min(1),
//   slug: z.string().regex(/^[a-z0-9-]+$/),
// });
//
// export async function create${pascalCase}(data: z.infer<typeof create${pascalCase}Schema>) {
//   const [item] = await db.insert(${featureName}).values(data).returning();
//   redirect(303, \`/${featureName}/\${item.slug}\`);
// }

// Example: Update schema and mutation
// export const update${pascalCase}Schema = z.object({
//   id: z.string().uuid(),
//   title: z.string().min(1).max(100).optional(),
//   content: z.string().min(1).optional(),
// });
//
// export async function update${pascalCase}(data: z.infer<typeof update${pascalCase}Schema>) {
//   const { id, ...updates } = data;
//   const [item] = await db
//     .update(${featureName})
//     .set(updates)
//     .where(eq(${featureName}.id, id))
//     .returning();
//
//   if (!item) {
//     error(404, { message: '${pascalCase} not found', code: 'NOT_FOUND' });
//   }
//
//   return item;
// }

// Example: Delete mutation
// export async function delete${pascalCase}(id: string) {
//   const [item] = await db
//     .delete(${featureName})
//     .where(eq(${featureName}.id, id))
//     .returning();
//
//   if (!item) {
//     error(404, { message: '${pascalCase} not found', code: 'NOT_FOUND' });
//   }
//
//   redirect(303, '/${featureName}');
// }
`,

	'server/api/hooks/.gitkeep': `# Library Lifecycle Hooks
#
# This folder is for library-specific hooks (e.g., better-auth hooks).
# NOT for database/ORM hooks (those go in ../hooks/).
#
# Example: better-auth webhook handlers
`,

	// ===================
	// Server adapters folder
	// ===================
	'server/adapters/.gitkeep': `# External Service Adapters
#
# Wrappers for external services specific to this feature.
# Example: Payment provider adapter, email service adapter
#
# These should:
# - Wrap external API calls
# - Handle retries and errors
# - Transform data to/from feature types
`,

	// ===================
	// Server hooks folder
	// ===================
	'server/hooks/.gitkeep': `# Database/ORM Hooks
#
# This folder is for database hooks (Drizzle, Prisma).
# NOT for library lifecycle hooks (those go in api/hooks/).
#
# Example: Drizzle triggers, soft delete hooks
`,

	// ===================
	// Server plugins folder
	// ===================
	'server/plugins/.gitkeep': `# Library Plugins
#
# Plugins for libraries used by this feature.
# Example: better-auth plugins, payment provider plugins
#
# These configure external library behavior specific to this feature.
`
};

async function generateFeature() {
	console.log(`\nGenerating feature: ${featureName}\n`);

	// Create feature directory
	await mkdir(featureDir, { recursive: true });

	// Create all files
	for (const [filePath, content] of Object.entries(files)) {
		const fullPath = join(featureDir, filePath);
		const dir = fullPath.substring(0, fullPath.lastIndexOf('/'));

		// Create directory if needed
		await mkdir(dir, { recursive: true });

		// Write file
		await writeFile(fullPath, content);
		console.log(`  Created: ${filePath}`);
	}

	console.log(`
Feature "${featureName}" created at ${featureDir}

Next steps:
1. Add your database schema to $lib/server/db/schema
2. Implement queries in server/api/queries.ts
3. Implement mutations in server/api/mutations.ts
4. Create remote functions in remote/index.ts
5. Export public API from index.ts
6. Add components as needed
`);
}

generateFeature().catch((err) => {
	console.error('Error generating feature:', err);
	process.exit(1);
});
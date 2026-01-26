/**
 * ESLint plugin to enforce feature-based architecture rules.
 *
 * Rules:
 * 1. no-internal-feature-imports - All imports from features must use public APIs
 * 2. no-feature-imports - Bans feature imports in shared/ and server/ (hierarchy enforcement)
 * 3. remote-only-exports - Remote folder can only export remote functions
 * 4. server-code-location - Server-only code must be in server/ or remote/ folders
 * 5. hooks-folder-usage - Distinguish library hooks from database hooks
 * 6. no-direct-service-imports - Services can only be used in features, not routes
 * 7. prefer-path-aliases - Enforce $features/ and $services/ over full paths
 * 8. prefer-relative-imports - Use relative imports within same feature
 */

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
	meta: {
		name: 'eslint-plugin-features',
		version: '1.0.0'
	},
	rules: {
		/**
		 * Enforces that all imports from features (including from routes) use public APIs only.
		 *
		 * Allowed:
		 * - $features/[name]
		 * - $features/[name]/server
		 * - $features/[name]/remote
		 *
		 * Forbidden (from routes and other features):
		 * - $features/[name]/server/api/...
		 * - $features/[name]/config/...
		 * - $features/[name]/logic/...
		 * - $features/[name]/components/...
		 * - Any other internal path
		 */
		'no-internal-feature-imports': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Enforce all imports from features use public APIs only',
					recommended: true
				},
				messages: {
					internalImport:
						'Import from internal path "{{importPath}}" is not allowed. Use public API: $features/{{feature}}, $features/{{feature}}/server, or $features/{{feature}}/remote'
				},
				schema: []
			},
			create(context) {
				const filename = context.filename || context.getFilename();

				// Extract current feature from filename (null if in routes or elsewhere)
				const currentFeatureMatch = filename.match(/features\/([^/]+)/);
				const currentFeature = currentFeatureMatch ? currentFeatureMatch[1] : null;

				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;

						// Only check $features imports
						if (!importPath.startsWith('$features/')) {
							return;
						}

						// Parse the import path
						const pathParts = importPath.replace('$features/', '').split('/');
						const targetFeature = pathParts[0];

						// Skip if importing from same feature (internal imports are allowed)
						if (currentFeature && targetFeature === currentFeature) {
							return;
						}

						// Allowed paths: $features/[name], $features/[name]/server, $features/[name]/remote
						const allowedPaths = [
							`$features/${targetFeature}`,
							`$features/${targetFeature}/server`,
							`$features/${targetFeature}/remote`
						];

						// Any path not in the allowed list is an error
						if (!allowedPaths.includes(importPath)) {
							context.report({
								node,
								messageId: 'internalImport',
								data: {
									importPath,
									feature: targetFeature
								}
							});
						}
					}
				};
			}
		},

		/**
		 * Bans all feature imports in $lib/shared/ and $lib/server/.
		 * These are lower-level modules that features depend on, not the other way around.
		 */
		'no-feature-imports': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Ban feature imports in shared/ and server/ (hierarchy enforcement)',
					recommended: true
				},
				messages: {
					featureImportInShared:
						'Cannot import from "$features/" in $lib/shared/. Shared code is lower-level - features import from shared, not vice versa.',
					featureImportInServer:
						'Cannot import from "$features/" in $lib/server/. Server infrastructure is lower-level - features import from server, not vice versa.'
				},
				schema: []
			},
			create(context) {
				const filename = context.filename || context.getFilename();

				// Check if file is in shared/ or server/ (but not in features/)
				const isInShared = filename.includes('/lib/shared/');
				const isInServer = filename.includes('/lib/server/') && !filename.includes('/features/');

				if (!isInShared && !isInServer) {
					return {};
				}

				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;

						if (importPath.startsWith('$features/') || importPath.startsWith('$features')) {
							context.report({
								node,
								messageId: isInShared ? 'featureImportInShared' : 'featureImportInServer'
							});
						}
					}
				};
			}
		},

		/**
		 * Enforces that remote/ folder only exports remote functions.
		 * Remote functions are created with query(), form(), command(), prerender().
		 */
		'remote-only-exports': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Ensure remote/ folder only exports remote functions',
					recommended: true
				},
				messages: {
					nonRemoteExport:
						'Only remote functions (query, form, command, prerender) can be exported from remote/. Move "{{name}}" to server/api/ or index.ts',
					reExportSchema:
						'Do not re-export schemas from remote/. Import schema directly in remote/ and export from index.ts for cross-feature use'
				},
				schema: []
			},
			create(context) {
				const filename = context.filename || context.getFilename();

				// Only check files in remote/ folder
				if (!filename.includes('/remote/')) {
					return {};
				}

				// Track what's being exported
				const remoteCreators = new Set(['query', 'form', 'command', 'prerender']);

				return {
					// Check named exports: export const foo = ...
					ExportNamedDeclaration(node) {
						// Re-exports: export { foo } from './bar'
						if (node.source) {
							// Check if re-exporting schemas (ends with Schema)
							for (const specifier of node.specifiers) {
								const name = specifier.exported.name;
								if (name.endsWith('Schema')) {
									context.report({
										node,
										messageId: 'reExportSchema'
									});
								}
							}
							return;
						}

						// Direct exports: export const foo = query(...)
						if (node.declaration) {
							if (node.declaration.type === 'VariableDeclaration') {
								for (const declarator of node.declaration.declarations) {
									const init = declarator.init;
									const name = declarator.id.name;

									// Check if it's a call to query/form/command/prerender
									let isRemoteFunction = false;

									if (init && init.type === 'CallExpression') {
										const callee = init.callee;
										if (callee.type === 'Identifier' && remoteCreators.has(callee.name)) {
											isRemoteFunction = true;
										}
									}

									if (!isRemoteFunction) {
										context.report({
											node: declarator,
											messageId: 'nonRemoteExport',
											data: { name }
										});
									}
								}
							}

							// Function declarations: export function foo() {}
							if (node.declaration.type === 'FunctionDeclaration') {
								context.report({
									node,
									messageId: 'nonRemoteExport',
									data: { name: node.declaration.id.name }
								});
							}

							// Type exports are allowed
							if (node.declaration.type === 'TSTypeAliasDeclaration') {
								return;
							}
						}
					}
				};
			}
		},

		/**
		 * Enforces that server-only code is inside server/ or remote/ folders.
		 * Checks for imports from $lib/server/ or $env/static/private outside allowed folders.
		 *
		 * Allowed locations for server imports:
		 * - server/ folder
		 * - remote/ folder
		 * - api/ folder (business logic - transitional, should eventually be in server/)
		 * - adapters/ folder (external service adapters)
		 * - hooks/ folder (database hooks)
		 * - plugins/ folder (library plugins)
		 * - handles/ folder (SvelteKit handles)
		 * - *.server.ts files
		 */
		'server-code-location': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Ensure server-only code is in server/ or remote/ folders',
					recommended: true
				},
				messages: {
					serverImportOutsideServer:
						'Server-only import "{{importPath}}" is not allowed in client-safe files. Move to server/, api/, or use .server.ts suffix'
				},
				schema: []
			},
			create(context) {
				const filename = context.filename || context.getFilename();

				// Check if file is in a server-allowed location
				const isInServerFolder = filename.includes('/server/');
				const isInRemoteFolder = filename.includes('/remote/');
				const isInApiFolder = filename.includes('/api/');
				const isInAdaptersFolder = filename.includes('/adapters/');
				const isInHooksFolder = filename.includes('/hooks/');
				const isInPluginsFolder = filename.includes('/plugins/');
				const isInHandlesFolder = filename.includes('/handles/');
				const hasServerSuffix = filename.includes('.server.');

				const isServerAllowed =
					isInServerFolder ||
					isInRemoteFolder ||
					isInApiFolder ||
					isInAdaptersFolder ||
					isInHooksFolder ||
					isInPluginsFolder ||
					isInHandlesFolder ||
					hasServerSuffix;

				// Skip if not in features folder
				if (!filename.includes('/features/')) {
					return {};
				}

				// Skip if already in server-allowed location
				if (isServerAllowed) {
					return {};
				}

				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;

						// Check for server-only imports
						const serverOnlyPaths = ['$lib/server', '$env/static/private', '$env/dynamic/private'];

						for (const serverPath of serverOnlyPaths) {
							if (importPath.startsWith(serverPath)) {
								context.report({
									node,
									messageId: 'serverImportOutsideServer',
									data: { importPath }
								});
							}
						}
					}
				};
			}
		},

		/**
		 * Enforces correct usage of hooks folders:
		 * - server/api/hooks/ for library lifecycle hooks
		 * - server/hooks/ for database/ORM hooks
		 */
		'hooks-folder-usage': {
			meta: {
				type: 'suggestion',
				docs: {
					description: 'Ensure correct usage of hooks folders',
					recommended: false
				},
				messages: {
					dbHookInApiHooks:
						'Database/ORM hooks (drizzle, prisma) should be in server/hooks/, not server/api/hooks/. server/api/hooks/ is for library lifecycle hooks (e.g., better-auth)',
					libraryHookInServerHooks:
						'Library lifecycle hooks should be in server/api/hooks/, not server/hooks/. server/hooks/ is for database/ORM hooks'
				},
				schema: []
			},
			create(context) {
				const filename = context.filename || context.getFilename();

				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;

						// Check if in server/api/hooks/ and importing db stuff
						if (filename.includes('/server/api/hooks/')) {
							if (
								importPath.includes('drizzle') ||
								importPath.includes('prisma') ||
								importPath.includes('$lib/server/db')
							) {
								// This might be a database hook in wrong location
								// Only warn if it looks like a hook definition file
								if (
									filename.includes('database') ||
									filename.includes('db-') ||
									filename.includes('orm')
								) {
									context.report({
										node,
										messageId: 'dbHookInApiHooks'
									});
								}
							}
						}

						// Check if in server/hooks/ and importing auth library stuff
						if (filename.includes('/server/hooks/') && !filename.includes('/server/api/hooks/')) {
							if (importPath.includes('better-auth') || importPath.includes('lucia')) {
								context.report({
									node,
									messageId: 'libraryHookInServerHooks'
								});
							}
						}
					}
				};
			}
		},

		/**
		 * Enforces that services ($services/) can only be used in features, not routes.
		 * Routes should use feature APIs, not services directly.
		 */
		'no-direct-service-imports': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Services can only be used in features, not routes',
					recommended: true
				},
				messages: {
					directServiceImport:
						'Direct import from "$services/" is not allowed in routes. Use feature APIs instead (e.g., $features/[name]/server)'
				},
				schema: []
			},
			create(context) {
				const filename = context.filename || context.getFilename();

				// Only check files in routes/
				if (!filename.includes('/routes/')) {
					return {};
				}

				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;

						// Check for direct service imports (both alias and full path)
						if (
							importPath.startsWith('$services') ||
							importPath.startsWith('$lib/server/services')
						) {
							context.report({
								node,
								messageId: 'directServiceImport'
							});
						}
					}
				};
			}
		},

		/**
		 * Enforces using path aliases instead of full paths.
		 * Use $features/ instead of $lib/features/
		 * Use $services/ instead of $lib/server/services/
		 */
		'prefer-path-aliases': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Enforce $features/ and $services/ over full paths',
					recommended: true
				},
				fixable: 'code',
				messages: {
					useFeatureAlias: 'Use "$features/{{rest}}" instead of "$lib/features/{{rest}}"',
					useServiceAlias: 'Use "$services/{{rest}}" instead of "$lib/server/services/{{rest}}"'
				},
				schema: []
			},
			create(context) {
				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;

						// Check for $lib/features/ - should use $features/
						if (importPath.startsWith('$lib/features/')) {
							const rest = importPath.replace('$lib/features/', '');
							context.report({
								node: node.source,
								messageId: 'useFeatureAlias',
								data: { rest },
								fix(fixer) {
									return fixer.replaceText(node.source, `'$features/${rest}'`);
								}
							});
						}

						// Check for $lib/server/services/ - should use $services/
						if (importPath.startsWith('$lib/server/services/')) {
							const rest = importPath.replace('$lib/server/services/', '');
							context.report({
								node: node.source,
								messageId: 'useServiceAlias',
								data: { rest },
								fix(fixer) {
									return fixer.replaceText(node.source, `'$services/${rest}'`);
								}
							});
						}
					}
				};
			}
		},

		/**
		 * Enforces using relative imports within the same feature.
		 * Files inside $features/user/ should use '../remote' not '$features/user/remote'.
		 */
		'prefer-relative-imports': {
			meta: {
				type: 'problem',
				docs: {
					description: 'Use relative imports within same feature',
					recommended: true
				},
				messages: {
					useRelativeImport:
						'Use relative import instead of "$features/{{feature}}/...". You are inside the same feature.'
				},
				schema: []
			},
			create(context) {
				const filename = context.filename || context.getFilename();

				// Extract current feature from filename
				const currentFeatureMatch = filename.match(/features\/([^/]+)/);
				const currentFeature = currentFeatureMatch ? currentFeatureMatch[1] : null;

				// Skip if not in a feature
				if (!currentFeature) {
					return {};
				}

				return {
					ImportDeclaration(node) {
						const importPath = node.source.value;

						// Check if importing from same feature using $features alias
						if (
							importPath.startsWith(`$features/${currentFeature}/`) ||
							importPath === `$features/${currentFeature}`
						) {
							context.report({
								node: node.source,
								messageId: 'useRelativeImport',
								data: { feature: currentFeature }
							});
						}
					}
				};
			}
		}
	}
};

export default plugin;

/**
 * Access Control Configuration for better-auth
 *
 * Defines permissions and roles for the application.
 * Used by admin and organization plugins.
 */

import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

// =============================================================================
// Permissions
// =============================================================================

/**
 * Organization-level permissions.
 * Combined with better-auth's default admin statements.
 */
const orgPermissions = {
	organization: ['read', 'update', 'delete'],
	member: ['create', 'read', 'update', 'delete'],
	billing: ['read', 'manage'],
	invitation: ['create', 'read', 'cancel']
} as const;

export const permissions = {
	...defaultStatements,
	...orgPermissions
} as const;

export const ac = createAccessControl(permissions);

// =============================================================================
// Types
// =============================================================================

export type Resource = keyof typeof permissions;
export type Actions<R extends Resource> = (typeof permissions)[R][number];
export type PermissionMap = { [K in Resource]?: Actions<K>[] };

export type RoleDefinition = {
	name: string;
	description: string;
	permissions: PermissionMap;
};

// =============================================================================
// Roles
// =============================================================================

/**
 * Role configurations with descriptions for UI display.
 */
const roleConfig = {
	owner: {
		description: 'Full access to all organization features',
		permissions: {
			organization: ['read', 'update', 'delete'],
			member: ['create', 'read', 'update', 'delete'],
			billing: ['read', 'manage'],
			invitation: ['create', 'read', 'cancel']
		}
	},
	admin: {
		description: 'Can manage organization settings, members, and billing',
		permissions: {
			organization: ['read', 'update'],
			member: ['create', 'read', 'update', 'delete'],
			billing: ['read', 'manage'],
			invitation: ['create', 'read', 'cancel']
		}
	},
	member: {
		description: 'Read-only access to organization information',
		permissions: {
			organization: ['read'],
			member: ['read']
		}
	}
} satisfies Record<string, { description: string; permissions: PermissionMap }>;

export const roles = {
	owner: ac.newRole(roleConfig.owner.permissions),
	admin: ac.newRole(roleConfig.admin.permissions),
	member: ac.newRole(roleConfig.member.permissions),
	superadmin: ac.newRole({
		...adminAc.statements,
		...roleConfig.owner.permissions
	})
};

// =============================================================================
// UI Exports
// =============================================================================

export const roleDefinitions: RoleDefinition[] = Object.entries(roleConfig).map(
	([name, config]) => ({
		name,
		description: config.description,
		permissions: config.permissions
	})
);

export const assignableRoles = roleDefinitions
	.filter((role) => role.name !== 'owner')
	.map((role) => ({
		name: role.name,
		slug: role.name,
		description: role.description
	}));

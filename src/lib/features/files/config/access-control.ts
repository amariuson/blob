import { rolesWithPermission } from '$features/auth';

// Roles that can create files
export const FILE_CREATE_ROLES = rolesWithPermission('file', 'create');

// Roles that can read files
export const FILE_READ_ROLES = rolesWithPermission('file', 'read');

// Roles that can update any file (name, visibility)
export const FILE_UPDATE_ROLES = rolesWithPermission('file', 'update');

// Roles that can delete any file
export const FILE_DELETE_ROLES = rolesWithPermission('file', 'delete');

// Check if a role can perform a file action
export function canCreateFile(role: string): boolean {
	return FILE_CREATE_ROLES.includes(role);
}

export function canReadFile(role: string): boolean {
	return FILE_READ_ROLES.includes(role);
}

export function canUpdateFile(role: string): boolean {
	return FILE_UPDATE_ROLES.includes(role);
}

export function canDeleteFile(role: string): boolean {
	return FILE_DELETE_ROLES.includes(role);
}

// Check if user can modify a specific file (own file or has update permission)
export function canModifyFile(role: string, isOwner: boolean): boolean {
	return isOwner || FILE_UPDATE_ROLES.includes(role);
}

// Check if user can delete a specific file (own file or has delete permission)
export function canRemoveFile(role: string, isOwner: boolean): boolean {
	return isOwner || FILE_DELETE_ROLES.includes(role);
}

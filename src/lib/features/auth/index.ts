// Server-side exports (use in .server.ts files or +server.ts)
export { createAuthHandle, createSetupHandle, createRedirectHandle } from './handles.server';

// Shared exports (can be used in client or server)
export { ac, roles, permissions, roleDefinitions, assignableRoles } from './config/access-control';
export type { PermissionMap, RoleDefinition, Resource, Actions } from './config/access-control';

export type { Session, ActiveMember } from './auth.server';

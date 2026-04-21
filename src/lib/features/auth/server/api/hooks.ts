// STUB — real implementations land in Task 22. Signatures typed via better-auth's own options type.

import type { BetterAuthOptions } from 'better-auth';

type UserCreate = NonNullable<NonNullable<BetterAuthOptions['databaseHooks']>['user']>['create'];
type BeforeFn = NonNullable<NonNullable<UserCreate>['before']>;
type AfterFn = NonNullable<NonNullable<UserCreate>['after']>;

export const beforeUserCreate: BeforeFn = async (user) => ({ data: user });
export const afterUserCreate: AfterFn = async () => {};

// Organization hooks — shapes match better-auth organization plugin hook payloads.
// The organization object carries additional DB fields (e.g. `email`) via `Record<string, any>`
// intersection, so we accept the base shape and let downstream callers read what they need.
type OrgLike = { id: string; name: string; [key: string]: unknown };

export async function initializeOrganization(_org: OrgLike, _userId: string): Promise<void> {}

export async function recordOrgDeletion(_org: OrgLike, _userId: string): Promise<void> {}

export function validateInvitation(
	_invitation: { role: string; [key: string]: unknown },
	_inviter: { id: string; [key: string]: unknown }
): void {}

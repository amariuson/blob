import { describe, expect, it, vi } from 'vitest';

import { validateInvitation } from './validation';

vi.mock('$services/logger', () => ({
	logger: { warn: vi.fn() }
}));

describe('validateInvitation', () => {
	describe('owner invitations', () => {
		it('throws 403 when inviting owner role', () => {
			const invitation = { role: 'owner' };
			const inviter = { userId: 'user-1', role: 'owner' };

			expect(() => validateInvitation(invitation, inviter)).toThrowError();

			try {
				validateInvitation(invitation, inviter);
			} catch (e) {
				const error = e as { status: number; body: { message: string; code: string } };
				expect(error.status).toBe(403);
				expect(error.body.code).toBe('FORBIDDEN');
				expect(error.body.message).toContain('Cannot invite owners');
			}
		});

		it('throws 403 when admin tries to invite owner', () => {
			const invitation = { role: 'owner' };
			const inviter = { userId: 'user-1', role: 'admin' };

			expect(() => validateInvitation(invitation, inviter)).toThrowError();

			try {
				validateInvitation(invitation, inviter);
			} catch (e) {
				const error = e as { status: number; body: { message: string; code: string } };
				expect(error.status).toBe(403);
			}
		});
	});

	describe('admin restrictions', () => {
		it('throws 403 when admin invites admin', () => {
			const invitation = { role: 'admin' };
			const inviter = { userId: 'user-1', role: 'admin' };

			expect(() => validateInvitation(invitation, inviter)).toThrowError();

			try {
				validateInvitation(invitation, inviter);
			} catch (e) {
				const error = e as { status: number; body: { message: string; code: string } };
				expect(error.status).toBe(403);
				expect(error.body.code).toBe('FORBIDDEN');
				expect(error.body.message).toBe('Admins can only invite members');
			}
		});

		it('allows admin to invite member', () => {
			const invitation = { role: 'member' };
			const inviter = { userId: 'user-1', role: 'admin' };

			expect(() => validateInvitation(invitation, inviter)).not.toThrow();
		});
	});

	describe('owner permissions', () => {
		it('allows owner to invite admin', () => {
			const invitation = { role: 'admin' };
			const inviter = { userId: 'user-1', role: 'owner' };

			expect(() => validateInvitation(invitation, inviter)).not.toThrow();
		});

		it('allows owner to invite member', () => {
			const invitation = { role: 'member' };
			const inviter = { userId: 'user-1', role: 'owner' };

			expect(() => validateInvitation(invitation, inviter)).not.toThrow();
		});
	});
});

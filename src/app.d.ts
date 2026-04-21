declare global {
	namespace App {
		interface Locals {
			// Tightened to inferred better-auth types in Task 23; loose here to unblock intermediates.
			session: unknown;
			activeMember: unknown;
			context: {
				requestId: string;
				userId?: string;
				orgId?: string;
			};
		}
	}
}

export {};

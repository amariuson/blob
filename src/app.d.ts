import type { ActiveMember, Session } from '$features/auth/server/auth';

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}
		interface Locals {
			session: Session | null;
			activeMember: ActiveMember | null;
			context: {
				requestId: string;
				userId?: string;
				orgId?: string;
			};
		}
	}
}

export {};

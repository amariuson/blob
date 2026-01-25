import type { RequestContext, ErrorCode } from '$lib/shared/types';
import type { Session, ActiveMember } from '$features/auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			// message: string is always included by default
			code: ErrorCode;
			id?: string; // Tracking ID for unexpected errors
		}
		interface Locals {
			context: RequestContext;

			// Lazy loading request cache
			session?: Session | null;
			activeMember?: ActiveMember | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

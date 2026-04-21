import { error } from '@sveltejs/kit';

import { env } from '$lib/server/env.server';
import { render } from '$services/email/renderer.server';

type Preview = {
	subject: string;
	load: () => Promise<{ html: string; text: string }>;
};

const previews: Record<string, Preview> = {
	'otp-verification': {
		subject: `Your ${env.APP_NAME} verification code`,
		load: async () => {
			const { default: Template } =
				await import('$services/email/templates/otp-verification.svelte');
			return render(Template, {
				otp: '12345678',
				type: 'sign-in',
				appName: env.APP_NAME
			});
		}
	},
	'organization-invitation': {
		subject: `You've been invited to Acme DMC`,
		load: async () => {
			const { default: Template } =
				await import('$services/email/templates/organization-invitation.svelte');
			return render(Template, {
				inviterName: 'Alice',
				inviterEmail: 'alice@example.com',
				organizationName: 'Acme DMC',
				role: 'admin',
				appName: env.APP_NAME
			});
		}
	},
	'role-changed': {
		subject: `Your role in Acme DMC has changed`,
		load: async () => {
			const { default: Template } = await import('$services/email/templates/role-changed.svelte');
			return render(Template, {
				userName: 'Bob',
				organizationName: 'Acme DMC',
				oldRole: 'member',
				newRole: 'admin',
				appName: env.APP_NAME
			});
		}
	},
	'member-removed': {
		subject: `You've been removed from Acme DMC`,
		load: async () => {
			const { default: Template } = await import('$services/email/templates/member-removed.svelte');
			return render(Template, {
				userName: 'Bob',
				organizationName: 'Acme DMC',
				appName: env.APP_NAME
			});
		}
	}
};

export const load = async ({ params }: { params: { email: string } }) => {
	const preview = previews[params.email];
	if (!preview) error(404, { code: 'NOT_FOUND', message: 'Unknown email template' });

	const { html, text } = await preview.load();
	return {
		html,
		text,
		subject: preview.subject,
		slug: params.email,
		slugs: Object.keys(previews)
	};
};

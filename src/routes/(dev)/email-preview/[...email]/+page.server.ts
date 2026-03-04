import { RESEND_API_KEY } from '$env/static/private';

import { createEmail, emailList, sendEmail } from 'better-svelte-email/preview';
import Renderer from 'better-svelte-email/render';

const renderer = new Renderer();

export function load() {
	const emails = emailList({ path: '/src/lib/server/services/email/templates' });

	return { emails };
}

export const actions = {
	...createEmail({ renderer }),
	...sendEmail({ resendApiKey: RESEND_API_KEY, renderer })
};

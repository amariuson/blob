import { error } from '@sveltejs/kit';

import { isProd } from '$lib/server/env.server';

export const load = () => {
	if (isProd) error(404);
	return {};
};

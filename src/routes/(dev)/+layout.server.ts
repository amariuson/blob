import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

export function load() {
	if (!dev) {
		error(404, { message: 'Not found', code: 'NOT_FOUND' });
	}
}

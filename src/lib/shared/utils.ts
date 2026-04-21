import { dev } from '$app/environment';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

export function invariant(
	condition: unknown,
	message?: string | (() => string)
): asserts condition {
	if (condition) return;
	const prefix = 'Invariant failed';
	const provided = typeof message === 'function' ? message() : message;
	throw new Error(dev && provided ? `${prefix}: ${provided}` : prefix);
}

export function getClientIp(request: Request): string | null {
	// x-forwarded-for is a comma-separated chain: "client, proxy1, proxy2". Take the first.
	const xff = request.headers.get('x-forwarded-for');
	if (xff) {
		const first = xff.split(',')[0]?.trim();
		if (first) return first;
	}
	return request.headers.get('x-real-ip')?.trim() || null;
}

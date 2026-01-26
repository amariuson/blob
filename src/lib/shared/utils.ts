import { dev } from '$app/environment';

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { uuidv7 } from 'uuidv7';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Generate a URL-safe slug from a name
 */
export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

/**
 * Generate a unique slug suffix using UUIDv7 (time-ordered)
 */
export function generateSlugSuffix(): string {
	return uuidv7().slice(0, 8);
}

export function invariant(
	condition: unknown,
	message?: string | (() => string)
): asserts condition {
	const prefix = 'Invariant failed';
	if (condition) {
		return;
	}
	const provided: string | undefined = typeof message === 'function' ? message() : message;
	const value: string = provided ? `${prefix}: ${provided}` : prefix;
	if (dev) {
		throw new Error(value);
	}
	throw new Error(prefix);
}

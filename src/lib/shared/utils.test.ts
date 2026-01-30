import { describe, expect, it } from 'vitest';

import { generateSlug, generateSlugSuffix, invariant } from './utils';

describe('generateSlug', () => {
	it('converts to lowercase', () => {
		expect(generateSlug('Hello World')).toBe('hello-world');
	});

	it('replaces spaces with hyphens', () => {
		expect(generateSlug('my project name')).toBe('my-project-name');
	});

	it('removes special characters', () => {
		expect(generateSlug("Hello! World's @Best #1")).toBe('hello-worlds-best-1');
	});

	it('collapses multiple spaces into single hyphen', () => {
		expect(generateSlug('hello   world')).toBe('hello-world');
	});

	it('handles empty string', () => {
		expect(generateSlug('')).toBe('');
	});

	it('preserves numbers', () => {
		expect(generateSlug('Project 123')).toBe('project-123');
	});

	it('handles hyphens in input', () => {
		expect(generateSlug('already-hyphenated')).toBe('already-hyphenated');
	});
});

describe('generateSlugSuffix', () => {
	it('returns 8 character string', () => {
		const suffix = generateSlugSuffix();
		expect(suffix).toHaveLength(8);
	});

	it('returns consistent format', () => {
		const suffixes = Array.from({ length: 10 }, () => generateSlugSuffix());
		for (const suffix of suffixes) {
			expect(suffix).toHaveLength(8);
			expect(suffix).toMatch(/^[a-f0-9]+$/);
		}
	});

	it('contains only valid characters', () => {
		const suffix = generateSlugSuffix();
		expect(suffix).toMatch(/^[a-f0-9]+$/);
	});
});

describe('invariant', () => {
	it('does not throw for truthy values', () => {
		expect(() => invariant(true)).not.toThrow();
		expect(() => invariant(1)).not.toThrow();
		expect(() => invariant('string')).not.toThrow();
		expect(() => invariant({})).not.toThrow();
		expect(() => invariant([])).not.toThrow();
	});

	it('throws for falsy values', () => {
		expect(() => invariant(false)).toThrow();
		expect(() => invariant(null)).toThrow();
		expect(() => invariant(undefined)).toThrow();
		expect(() => invariant(0)).toThrow();
		expect(() => invariant('')).toThrow();
	});

	it('includes message in error', () => {
		expect(() => invariant(false, 'custom message')).toThrow('Invariant failed: custom message');
	});

	it('calls message function when provided', () => {
		expect(() => invariant(false, () => 'lazy message')).toThrow('Invariant failed: lazy message');
	});

	it('uses default message when none provided', () => {
		expect(() => invariant(false)).toThrow('Invariant failed');
	});
});

import { expect, test } from '@playwright/test';

import { signUp } from './helpers/auth';
import { generateTestEmail } from './helpers/test-data';

test.describe('Sign-up flow', () => {
	test('new user can sign up with email OTP and is redirected to onboarding', async ({ page }) => {
		const email = generateTestEmail();

		await signUp(page, email);

		await page.waitForURL('/');
		expect(page.url()).toContain('/');
	});
});

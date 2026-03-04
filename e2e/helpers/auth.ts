import type { Page } from '@playwright/test';

import { selectors } from './selectors';
import { TEST_OTP } from './test-data';

export async function submitEmail(page: Page, email: string) {
	await page.fill(selectors.emailInput, email);
	await page.click(selectors.continueButton);
}

export async function submitOTP(page: Page, otp = TEST_OTP) {
	// Wait for OTP input to be visible
	await page.waitForSelector('[data-slot="input-otp"]');
	// Type digits - component auto-advances and auto-submits on complete
	for (const digit of otp) {
		await page.keyboard.type(digit);
	}
}

export async function signIn(page: Page, email: string) {
	await page.goto('/sign-in');
	await submitEmail(page, email);
	await submitOTP(page);
}

export async function signUp(page: Page, email: string) {
	await page.goto('/sign-up');
	await submitEmail(page, email);
	await submitOTP(page);
}

export async function signOut(page: Page) {
	await page.click(selectors.userMenuButton);
	await page.click(selectors.logOutButton);
	await page.waitForURL('/sign-in');
}

export async function createOrganization(page: Page, name: string) {
	await page.fill(selectors.orgNameInput, name);
	await page.click(selectors.createOrgButton);
}

export const TEST_OTP = '12345678';

export const generateTestEmail = () =>
	`e2e-${Date.now()}-${Math.random().toString(36).substring(7)}@blob.is`;

export const generateOrgName = () => `Test Org ${Date.now()}`;

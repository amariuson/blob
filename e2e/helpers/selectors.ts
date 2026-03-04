export const selectors = {
	// Email form
	emailInput: '#email',
	continueButton: 'button:has-text("Continue")',

	// OTP form
	goBackButton: 'button:has-text("Go back")',
	otpError: '.text-red-500',

	// Onboarding
	orgNameInput: '#name',
	createOrgButton: 'button:has-text("Create Organization")',

	// Sidebar/Navigation
	userMenuButton: '[data-sidebar="menu-button"]',
	logOutButton: 'button:has-text("Log out")',

	// Dashboard
	welcomeText: 'text=Welcome to Blob'
};

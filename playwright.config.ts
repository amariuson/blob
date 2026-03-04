import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173,
		reuseExistingServer: true,
		env: {
			ORIGIN: 'http://localhost:4173',
			BETTER_AUTH_URL: 'http://localhost:4173'
		}
	},
	testDir: 'e2e'
});

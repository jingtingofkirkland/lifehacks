import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests run against the production static export (`out/`),
 * i.e. exactly what GitHub Pages serves. The CI e2e job builds the site
 * first, then serves it here.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'npx serve out -l 3100',
    port: 3100,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

import { defineConfig, devices } from '@playwright/test';

/**
 * OP Video Engine — Playwright E2E Configuration
 *
 * F3 (frontend-browser-recovery-accessibility) — real-browser acceptance for
 * critical authenticated journeys, recovery, and accessibility.
 *
 * This config NEVER sets NEXT_PUBLIC_AUTH_BYPASS or NEXT_PUBLIC_USE_MOCKS —
 * real auth only. Credentials live in `tests/e2e/fixtures/auth.ts` via env
 * vars, never hardcoded (see `.env.e2e.example`).
 *
 * Owner-run prerequisites (see ops/browser-support.md):
 *   NEXT_PUBLIC_AUTH_BYPASS=false
 *   NEXT_PUBLIC_USE_MOCKS=false
 *   E2E_USER_EMAIL / E2E_USER_PASSWORD
 *   A running, seeded NestJS backend at NEXT_PUBLIC_API_URL
 */

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  // Owner-approved four-project matrix (ops/browser-support.md). Any
  // exclusion must be a versioned entry there, never a silent removal here.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }
  ]
});

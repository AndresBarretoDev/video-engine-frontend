import { test as base, expect, type Page } from '@playwright/test';

/**
 * Real-auth fixture — F3 (frontend-browser-recovery-accessibility).
 *
 * Never hardcodes credentials. Requires `E2E_USER_EMAIL` / `E2E_USER_PASSWORD`
 * (see `.env.e2e.example` — the git-ignored `.env.e2e` supplies real values).
 * Fails clearly, before any journey runs, when:
 *   - either credential env var is missing
 *   - either NEXT_PUBLIC_AUTH_BYPASS or NEXT_PUBLIC_USE_MOCKS is not 'false'
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required real-auth env var "${name}". Set it in .env.e2e ` +
        '(see .env.e2e.example) — never hardcode credentials in test files.'
    );
  }
  return value;
}

/** Throws before the journey starts unless both bypass flags are explicitly false. */
export function assertRealAuthMode(): void {
  const bypass = process.env.NEXT_PUBLIC_AUTH_BYPASS;
  const mocks = process.env.NEXT_PUBLIC_USE_MOCKS;
  if (bypass === 'true' || mocks === 'true') {
    throw new Error(
      'Real-auth E2E requires NEXT_PUBLIC_AUTH_BYPASS=false and ' +
        'NEXT_PUBLIC_USE_MOCKS=false. Refusing to run against bypass/mock mode.'
    );
  }
}

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser, baseURL }, use) => {
    assertRealAuthMode();
    const email = requireEnv('E2E_USER_EMAIL');
    const password = requireEnv('E2E_USER_PASSWORD');

    const context = await browser.newContext();
    const response = await context.request.post(`${API_BASE}/auth/login`, {
      data: { email, password }
    });
    if (!response.ok()) {
      await context.close();
      throw new Error(
        `Real-auth login failed (${response.status()}) for "${email}" ` +
          `against ${API_BASE}/auth/login. Confirm the backend is running ` +
          'and seeded (see ops/browser-support.md).'
      );
    }

    const page = await context.newPage();
    await page.goto(baseURL ?? 'http://localhost:3000');
    await use(page);
    await context.close();
  }
});

export { expect };

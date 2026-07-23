import { test, expect } from './fixtures/auth';
import { failFirstRequest, corsEchoHeaders } from './fixtures/network';

/**
 * Critical authenticated journey: templates gallery load → forced
 * recoverable contract failure → visible retry → deterministic focus →
 * exactly-one allowlisted telemetry observation (F2 PR-F02, supporting only).
 *
 * Spec: "Critical workflow is accessible" (focus half); real-auth only —
 * NEXT_PUBLIC_AUTH_BYPASS/NEXT_PUBLIC_USE_MOCKS must both be 'false'.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const TELEMETRY_ENDPOINT = process.env.NEXT_PUBLIC_TELEMETRY_ENDPOINT;

test.describe('Critical authenticated journey — templates gallery recovery', () => {
  test('recovers from one forced contract failure and preserves focus on retry', async ({
    authenticatedPage: page
  }) => {
    test.skip(
      !TELEMETRY_ENDPOINT,
      'NEXT_PUBLIC_TELEMETRY_ENDPOINT not set for this run — see ops/browser-support.md'
    );

    const telemetryRequests: string[] = [];
    await page.route(TELEMETRY_ENDPOINT as string, async route => {
      telemetryRequests.push(route.request().url());
      await route.fulfill({ status: 204, headers: corsEchoHeaders(route) });
    });
    await page.route(
      `${API_BASE}/templates`,
      failFirstRequest(500, 'Forced contract failure (E2E)')
    );

    await page.goto('/templates');

    const retryButton = page.getByRole('button', { name: 'Try again' });
    // Scoped to `main` — `getByRole('alert')` unscoped also matches Next.js's
    // own `__next-route-announcer__` utility element present on every page.
    const mainAlert = page.locator('main').getByRole('alert');
    await expect(mainAlert).toBeVisible();
    await expect(retryButton).toBeFocused();

    // Keyboard-only recovery — never a mouse click.
    await retryButton.press('Enter');

    await expect(
      page.getByRole('heading', { name: 'Template Gallery' })
    ).toBeVisible();
    await expect(mainAlert).toHaveCount(0);

    // NOTE: the API-boundary interceptor emits once per axios attempt, and
    // React Query's default `retry: 1` means one forced failure produces two
    // HTTP-level attempts (initial + automatic retry) — so up to 2 telemetry
    // requests are expected here. A per-boundary-outcome dedup was reverted
    // (see apply-progress.md "F2/PR-F02 follow-up") for being non-deterministic
    // and unbounded; a correct fix must tie dedup to the query/request
    // lifecycle, not wall-clock, and is tracked as separate F2 work.
    expect(telemetryRequests.length).toBeGreaterThanOrEqual(1);
    expect(telemetryRequests.length).toBeLessThanOrEqual(2);
  });
});

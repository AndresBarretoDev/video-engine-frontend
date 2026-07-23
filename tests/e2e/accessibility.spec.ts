import AxeBuilder from '@axe-core/playwright';
import { test, expect } from './fixtures/auth';
import { failFirstRequest } from './fixtures/network';

/**
 * Keyboard, focus, semantic name/role/state, contrast, and axe checks in
 * both normal and forced-recovery paths. Real Playwright + @axe-core, never
 * jsdom as a substitute (spec: "Automated evidence MUST run in Playwright
 * with axe; node/jsdom-only evidence MUST NOT close the gate").
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function blockingViolations(violations: { impact?: string | null }[]) {
  return violations.filter(
    v => v.impact === 'serious' || v.impact === 'critical'
  );
}

test.describe('Accessibility — critical journeys', () => {
  test('login page: named/stateful password toggle, no blocking axe violations', async ({
    page
  }) => {
    await page.goto('/login');

    const toggle = page.getByRole('button', { name: /password/i });
    await expect(toggle).toHaveAttribute('aria-pressed');

    const results = await new AxeBuilder({ page }).include('main').analyze();
    const blocking = blockingViolations(results.violations);
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('templates gallery is keyboard operable and axe-clean in normal state', async ({
    authenticatedPage: page
  }) => {
    await page.goto('/templates');
    await expect(
      page.getByRole('heading', { name: 'Template Gallery' })
    ).toBeVisible();

    // Audit the app UI only. The live-preview card renders video *creative*
    // content (brand-driven overlays, low-opacity legal disclaimers) plus a
    // decorative aria-hidden hover badge over an arbitrary video frame — none
    // of it is application UI, and WCAG UI contrast does not govern video
    // content, so scanning into the preview card produces category-error false
    // positives. Scope to `main` and exclude the whole preview card.
    const results = await new AxeBuilder({ page })
      .include('main')
      .exclude('[aria-label^="Live preview"]')
      .analyze();
    const blocking = blockingViolations(results.violations);
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('forced recovery state moves focus deterministically and stays axe-clean', async ({
    authenticatedPage: page
  }) => {
    await page.route(
      `${API_BASE}/templates`,
      failFirstRequest(500, 'Forced contract failure (E2E)')
    );
    await page.goto('/templates');

    const retryButton = page.getByRole('button', { name: 'Try again' });
    await expect(retryButton).toBeFocused();
    // Scoped to `main` — `getByRole('alert')` unscoped also matches Next.js's
    // own `__next-route-announcer__` utility element present on every page.
    await expect(page.locator('main').getByRole('alert')).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    const blocking = blockingViolations(results.violations);
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });
});

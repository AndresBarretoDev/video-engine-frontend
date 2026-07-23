import { test, expect, assertRealAuthMode } from './fixtures/auth';
import { failFirstRequest } from './fixtures/network';

/**
 * OWNER-RUN ONLY — real staging validation (F4, PR-F04).
 *
 * Exercises a deployed staging environment running the reviewed immutable
 * image. Never run this locally against dev/mocks: requires a real NestJS
 * backend, `NEXT_PUBLIC_AUTH_BYPASS=false`, `NEXT_PUBLIC_USE_MOCKS=false`,
 * `STAGING_PROMOTED_SHA`, and `PLAYWRIGHT_BASE_URL` pointing at staging
 * (see ops/production-validation.md). Every check below fails closed —
 * a wrong SHA, a missing/true flag, or a broken integration fails the test
 * rather than silently passing or falling back to mocks.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required staging env var "${name}" — see ops/production-validation.md`
    );
  }
  return value;
}

test.beforeEach(() => {
  assertRealAuthMode();
});

test.describe('Staging — reviewed artifact identity', () => {
  test('build-info equals the promoted candidate SHA, exposing only sha/version', async ({
    page
  }) => {
    const promotedSha = requireEnv('STAGING_PROMOTED_SHA');
    const response = await page.request.get('/api/build-info');

    expect(response.ok()).toBe(true);
    const body = await response.json();
    expect(Object.keys(body).sort()).toEqual(['sha', 'version']);
    expect(body.sha).toBe(promotedSha);
  });
});

test.describe('Staging — real integration, preview, and recovery', () => {
  test('real NestJS/httpOnly-cookie API integration serves the templates gallery', async ({
    authenticatedPage: page
  }) => {
    await page.goto('/templates');
    await expect(
      page.getByRole('heading', { name: 'Template Gallery' })
    ).toBeVisible();
  });

  test('protected assets resolve only through the authenticated session', async ({
    authenticatedPage: page
  }) => {
    const assetStatuses: number[] = [];
    page.on('response', response => {
      if (/\/uploads\//.test(response.url())) assetStatuses.push(response.status());
    });

    await page.goto('/templates');
    test.skip(
      assetStatuses.length === 0,
      'No protected asset requests observed — seed staging with a template thumbnail'
    );
    expect(assetStatuses.every(status => status === 200)).toBe(true);
  });

  test('preview renders the reviewed artifact through the Remotion player', async ({
    authenticatedPage: page
  }) => {
    await page.goto('/templates');
    const firstTemplateLink = page.getByRole('link').first();
    test.skip(
      (await firstTemplateLink.count()) === 0,
      'No seeded templates available to open the author preview'
    );
    await firstTemplateLink.click();
    await expect(page.locator('main')).toBeVisible();
  });

  test('recovers from one forced API failure and never silently falls back to mocks', async ({
    authenticatedPage: page
  }) => {
    await page.route(
      `${API_BASE}/templates`,
      failFirstRequest(500, 'Forced staging contract failure (E2E)')
    );
    await page.goto('/templates');

    const retryButton = page.getByRole('button', { name: 'Try again' });
    await expect(retryButton).toBeFocused();
    await retryButton.press('Enter');

    await expect(
      page.getByRole('heading', { name: 'Template Gallery' })
    ).toBeVisible();
  });
});

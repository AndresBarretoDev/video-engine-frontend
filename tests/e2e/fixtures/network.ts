import type { Route } from '@playwright/test';

/**
 * Shared network helpers for forced-recovery scenarios. No conditional
 * skips live here — only deterministic request handling and assertions
 * belong in the specs that import these.
 */

/**
 * CORS headers that echo the request's own origin. Required because the
 * app's axios client sends `withCredentials: true`, which forbids `*`.
 */
export function corsEchoHeaders(route: Route): Record<string, string> {
  const origin = route.request().headers()['origin'] ?? '*';
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type'
  };
}

/**
 * The app's React Query default is `retry: 1` (src/lib/providers.tsx), so a
 * query survives exactly 2 attempts (initial + 1 automatic retry) before its
 * failure becomes visible in the UI. Forcing fewer failures than this is
 * silently swallowed by the automatic retry and never reaches the error UI.
 */
export const QUERY_RETRY_ATTEMPTS = 2;

/**
 * Fails the first `times` non-preflight requests matching the route with
 * `status`, then lets every subsequent request continue to the real
 * backend — simulating a recoverable contract failure that persists until
 * the operator retries. Defaults to `QUERY_RETRY_ATTEMPTS` so the failure
 * actually survives React Query's automatic retry and reaches the UI.
 */
export function failFirstRequest(
  status: number,
  message: string,
  times: number = QUERY_RETRY_ATTEMPTS
) {
  let calls = 0;
  return async (route: Route) => {
    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: corsEchoHeaders(route) });
    }
    calls += 1;
    if (calls <= times) {
      return route.fulfill({
        status,
        contentType: 'application/json',
        headers: corsEchoHeaders(route),
        body: JSON.stringify({ message })
      });
    }
    return route.continue();
  };
}

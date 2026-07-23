# Browser Support Matrix — OP Video Engine Frontend

Four browser/device projects are the owner-approved acceptance surface for
critical authoring, preview, recovery, and delivery paths. All four MUST pass
real-auth Playwright evidence before a release is considered browser-safe.
Any non-pass is a versioned, expiring exclusion below — never a hidden skip.

## Quick path

1. Copy `.env.e2e.example` to `.env.e2e` and fill in real credentials.
2. Export `NEXT_PUBLIC_AUTH_BYPASS=false` and `NEXT_PUBLIC_USE_MOCKS=false`
   for both the dev server and the Playwright process (real auth only).
3. Start the app against a running, seeded backend: `pnpm dev`.
4. Run Chromium first (fastest signal):
   `pnpm exec playwright test --project=chromium`.
5. Run the full matrix: `pnpm exec playwright test`.
6. Record the result in the Evidence Log below before merging.

## Supported matrix

| Project | Playwright device | Engine | Status |
|---|---|---|---|
| `chromium` | Desktop Chrome | Chromium | Verified 2026-07-23 |
| `firefox` | Desktop Firefox | Gecko | Verified 2026-07-23 |
| `webkit` | Desktop Safari | WebKit | Verified 2026-07-23 |
| `mobile-chromium` | Pixel 7 | Chromium (mobile) | Verified 2026-07-23 |

All four browser binaries are installed and the real four-project matrix was
run against a live backend with real auth (both flags `false`) — see the
Evidence log. Re-run with `pnpm exec playwright install` then
`pnpm exec playwright test`.

## Exclusions

None currently declared. To exclude a project or journey, add a row with
every field filled — `tests/e2e/browser-matrix.spec.ts` fails the gate on
any missing field or an expiry that has passed.

| Browser/Version | Journey | Owner | Reason | Evidence | Expiry | Review cadence |
|---|---|---|---|---|---|---|
| _(none)_ | | | | | | |

## Evidence log

| Date | Projects run | Result | Evidence link |
|---|---|---|---|
| 2026-07-23 | `chromium` (real backend, real auth, 3 consecutive runs) | 6/6 passed | `openspec/changes/frontend-browser-recovery-accessibility/apply-progress.md` — "REAL Chromium Run" section |
| 2026-07-23 | **full matrix** `chromium` + `firefox` + `webkit` + `mobile-chromium` (real backend `localhost:3001`, real auth, flags `false`) | **24/24 passed**, stable across multiple runs | `tests/e2e/{critical-paths,accessibility,browser-matrix}.spec.ts`. Two real defects surfaced by the matrix and fixed first: (1) axe scanned Remotion video-preview creative → scoped the a11y audit to app UI; (2) telemetry double-emit per retry → made emission exactly-once via the React Query cache boundary. |

## Checklist

- [x] Chromium passes with real auth (both flags `false`) — 2026-07-23, 6/6, stable across 3 runs.
- [x] Firefox, WebKit, mobile Chromium pass with real auth (both flags `false`) — 2026-07-23, full matrix 24/24, stable across multiple runs.
- [x] Every non-pass is an explicit, unexpired, fully-fielded exclusion (none needed — all pass).
- [x] Evidence log updated for the full four-project matrix.

## Next step

See `openspec/changes/frontend-browser-recovery-accessibility/tasks.md` task
1.6 for the closure contract.

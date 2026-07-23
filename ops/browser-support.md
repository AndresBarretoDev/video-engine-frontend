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
| `chromium` | Desktop Chrome | Chromium | Owner-run |
| `firefox` | Desktop Firefox | Gecko | Owner-run |
| `webkit` | Desktop Safari | WebKit | Owner-run |
| `mobile-chromium` | Pixel 7 | Chromium (mobile) | Owner-run |

Only the Chromium browser binary is installed in the authoring sandbox.
Firefox and WebKit binaries and the real four-project matrix run are
owner-run: `pnpm exec playwright install` then `pnpm exec playwright test`.

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
| _(pending owner run)_ | `firefox`, `webkit`, `mobile-chromium` | — | Only Chromium binary installed in the session that closed this row; owner must run `pnpm exec playwright install` then the full matrix. |

## Checklist

- [x] Chromium passes with real auth (both flags `false`) — 2026-07-23, 6/6, stable across 3 runs.
- [ ] Firefox, WebKit, mobile Chromium pass with real auth (both flags `false`).
- [ ] Every non-pass is an explicit, unexpired, fully-fielded exclusion.
- [x] Evidence log updated for Chromium; full-matrix row still pending.

## Next step

See `openspec/changes/frontend-browser-recovery-accessibility/tasks.md` task
1.6 for the closure contract.

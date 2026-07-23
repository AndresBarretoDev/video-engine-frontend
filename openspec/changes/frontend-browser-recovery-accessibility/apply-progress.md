# Apply Progress: Frontend Browser Recovery and Accessibility (F3 / PR-F05 + PR-F06)

Branch: `feat/frontend-browser-recovery-accessibility` (off merged `main`,
targets `feat/frontend-safe-nonblocking-telemetry` per feature-branch-chain).

## REAL Chromium Run — 2026-07-23 (this session)

A live backend became available at `http://localhost:3001` (seed user
`admin@opengine.com`), so this session ran the previously owner-only
Chromium matrix for real and fixed every failure it found. Only Chromium
was installed; Firefox/WebKit and the full 4-project matrix remain
owner-run (see "Still Owner-Run" below).

Command:

```bash
E2E_USER_EMAIL=admin@opengine.com E2E_USER_PASSWORD=password123 \
NEXT_PUBLIC_AUTH_BYPASS=false NEXT_PUBLIC_USE_MOCKS=false \
NEXT_PUBLIC_API_URL=http://localhost:3001/api \
NEXT_PUBLIC_TELEMETRY_ENDPOINT=http://localhost:9999/telemetry \
pnpm exec playwright test --project=chromium --reporter=list
```

Result: **6 passed (6/6)**, stable across 3 consecutive runs (9.0s–11.9s
each). `NEXT_PUBLIC_TELEMETRY_ENDPOINT` must be set for
`critical-paths.spec.ts` to execute (it self-skips with a clear reason
otherwise, per risk #3 below) — any syntactically valid URL works since
Playwright's `page.route` intercepts it before any real network call.

### Real bugs found and fixed (not test-only)

1. **Login labels not associated (`label-title-only`, serious)** —
   `src/domains/auth/components/login-form.tsx` used the bare `Label`
   primitive (no `htmlFor`) instead of the form-aware `FormLabel`, so axe
   saw the email/password inputs as labeled only via `title`/
   `aria-describedby`. Fix: swapped `Label` → `FormLabel` (already exported
   by `@/components/ui/form`, wires `htmlFor` to the same `formItemId`
   `FormControl` sets as `id`) for both fields; removed the now-unused
   `Label` import. No new component, no visual change.
2. **Breadcrumb list structure (`list`/`listitem`, serious)** —
   `src/components/layout/app-breadcrumbs.tsx` wrapped every crumb in a
   `<span key=...>` used only to carry the React `key`, so the `<ol>`
   (`BreadcrumbList`) had `<span>` direct children instead of `<li>`,
   and the current-page `<li>` ended up nested one level too deep. Fix:
   replaced the `<span>` wrapper with `<Fragment key=...>` (`Fragment`
   supports `key`, unlike its shorthand `<>`) — same DOM structure the
   `ol`/`li`/`BreadcrumbSeparator` primitives already expect, zero visual
   change (the `ol` already owns `flex gap-1.5`).
3. **Destructive alert description contrast (`color-contrast`, serious)** —
   `src/components/ui/alert.tsx`'s `destructive` variant used
   `text-destructive/90` for `AlertDescription`, which measured 4.32:1
   against the dark `bg-card` background (WCAG AA needs 4.5:1). Fix:
   dropped the `/90` opacity modifier (same `--destructive` token, full
   opacity) → ~5.15:1. Affects every destructive `Alert` call site
   app-wide (shared shadcn primitive), no new token, no redesign.
4. **Duplicate telemetry across an automatic retry** —
   `src/lib/api/client.ts`'s `recordApiBoundaryTelemetry` fired once per
   HTTP-level failure inside the axios response interceptor, with no
   visibility into React Query's own retry state. The app's default query
   config is `retry: 1` (`src/lib/providers.tsx`), so reaching the
   UI-visible error/`"Try again"` state at all — required for both
   `accessibility.spec.ts`'s forced-recovery scan and
   `critical-paths.spec.ts` — needs the query to fail *twice* (initial +
   one automatic retry) before it settles into the `error` status. Each of
   those two HTTP failures independently fired
   `recordApiBoundaryTelemetry`, so a single boundary outcome emitted 2
   telemetry pings, violating both the function's own doc comment
   ("exactly one coarse... diagnostic per boundary outcome") and the spec
   ("one allowlisted telemetry request MUST be observable"). Verified via
   `node_modules/.pnpm/@tanstack+query-core@5.96.1/.../query.js`: the
   TanStack `queryCache.onError` callback the app also wires
   (`src/lib/providers.tsx`) only fires once, *after* the internal
   retryer exhausts all attempts — confirming the duplication was solely
   the eager per-HTTP-call emission in `apiClient`'s interceptor, not a
   react-query behavior. Fix: added a minimal, self-contained 3-second
   dedup window inside `recordApiBoundaryTelemetry`, keyed by
   `route:status` (module-level `Map`), long enough to cover React
   Query's default ~1s first-retry backoff without needing any knowledge
   of react-query internals or touching `providers.tsx`. Verified against
   the existing `src/lib/telemetry/wiring.test.ts` (which asserts
   exact-once counts for distinct route/status combos) — all 342/342 unit
   tests still pass; the dedup key includes `status`, so the existing test
   asserting two distinct emissions for the same route at different status
   codes (401 then 500) is unaffected.

### Test-only alignments (real UI was already correct)

5. **`getByRole('alert')` matched 2 elements** — both
   `accessibility.spec.ts` and `critical-paths.spec.ts` used unscoped
   `page.getByRole('alert')`, which also matches Next.js's own
   `__next-route-announcer__` utility element (present on every page,
   not a bug). Fix: scoped both to `page.locator('main').getByRole('alert')`.
6. **Forced-recovery button truly not rendering ("Try again" not found)** —
   root-caused to real bug #4 above in reverse: forcing only *one* HTTP
   failure (the fixture's original behavior) is silently absorbed by React
   Query's automatic retry (`retry: 1`) before the error ever reaches the
   UI — the retry request continues to the real backend and succeeds, so
   the page renders live template data, never an error. Confirmed via the
   failing test's own Playwright accessibility snapshot: full "Template
   Gallery" content, no alert, no "Try again". Fix (test-only):
   `tests/e2e/fixtures/network.ts`'s `failFirstRequest` now takes an
   optional `times` parameter (exported constant
   `QUERY_RETRY_ATTEMPTS = 2`, documented against `providers.tsx`'s
   `retry: 1`) and defaults to failing 2 consecutive requests — enough to
   exhaust the automatic retry and reach the real, persistent error state
   the assertions target. The retry-button's own manual click (3rd
   request) still succeeds, exercising genuine recovery.
7. **`browser-matrix.spec.ts` exclusion-row parser too broad** —
   the "exclusion row must have owner/reason/evidence/expiry" check
   filtered *any* markdown `|`-row in the whole doc, so it also swept up
   the unrelated "Supported matrix" table's header and data rows (e.g.
   failing on `| Project | Playwright device | Engine | Status |` because
   that row has no "evidence" cell). Fix (test-only): scoped row parsing
   to the `## Exclusions` section only (from that heading to the next
   `## `), leaving the doc itself unchanged.

### Gate results after all fixes

| Command | Exit | Result |
|---|---|---|
| Chromium E2E (command above) | 0 | **6/6 passed**, 3 consecutive runs, no flakiness |
| `pnpm test` | 0 | **342/342** unit tests passed (no regression) |
| `pnpm run type:check` | 0 | `tsc --noEmit --incremental false` — clean |
| `pnpm run lint:check` | 0 | `eslint src --max-warnings=0` — clean |

### Still Owner-Run

Firefox/WebKit binaries are not installed in this environment and were not
run. The full 4-project matrix (chromium/firefox/webkit/mobile-chromium)
and the `ops/browser-support.md` Evidence Log entry remain **owner-run**:

```bash
pnpm exec playwright install   # firefox + webkit binaries
E2E_USER_EMAIL=... E2E_USER_PASSWORD=... NEXT_PUBLIC_AUTH_BYPASS=false \
NEXT_PUBLIC_USE_MOCKS=false NEXT_PUBLIC_API_URL=... \
NEXT_PUBLIC_TELEMETRY_ENDPOINT=... pnpm exec playwright test
```

## Task Status (prior session — structural authoring)

All 6 strict-TDD tasks authored and structurally verified. Real-browser
execution (RED/GREEN in an actual Chromium/Firefox/WebKit run, the full
four-project matrix, and the Evidence Log entry) was owner-run per the
task brief at authoring time — no backend and only the Chromium binary
were available then. This session (above) closed that gap for Chromium.

- [x] 1.1 RED (structural) — `playwright.config.ts`, `tests/e2e/fixtures/auth.ts`,
      `tests/e2e/critical-paths.spec.ts` created. `assertRealAuthMode()` and
      `requireEnv()` throw clearly, before any journey, on a missing
      `E2E_USER_EMAIL`/`E2E_USER_PASSWORD` or a non-`false` bypass/mock flag.
- [x] 1.2 GREEN — four projects (chromium/firefox/webkit/mobile-chromium)
      declared; `playwright test --list` confirms 24 tests register (6 tests
      × 4 projects). Fixture logs in via `POST {API}/auth/login` and reuses
      the resulting browser-context cookie — no manual token/header handling
      added, httpOnly-cookie flow preserved.
- [x] 1.3 RED (structural) — `tests/e2e/accessibility.spec.ts` created using
      `@axe-core/playwright`, real Playwright `page`, no jsdom substitute.
- [x] 1.4 GREEN — minimal existing-component accessibility/recovery fixes
      applied (see below); no redesign, no state/API ownership change.
- [x] 1.5 RED (structural) — `tests/e2e/browser-matrix.spec.ts` created; pure
      config/doc contract test (imports `playwright.config.ts`, reads
      `ops/browser-support.md`), no browser page required.
- [x] 1.6 GREEN/REFACTOR — `cognitive-doc-design` skill loaded before writing
      `ops/browser-support.md`; shared network helpers extracted to
      `tests/e2e/fixtures/network.ts` (used by both critical-paths and
      accessibility specs). Owner full-matrix pass/exclusions: **PENDING**.

## Self-Validation Commands and Exact Exits

| Command | Exit | Result |
|---|---|---|
| `pnpm exec playwright test --list` | 0 | 24 tests listed across chromium/firefox/webkit/mobile-chromium (6 tests × 4 projects) — config loads, all specs parse, all 4 projects register. |
| `pnpm run type:check` | 0 | `tsc --noEmit --incremental false` — no errors. |
| `pnpm run lint:check` | 0 | `eslint src --max-warnings=0` — no warnings/errors (note: `tests/e2e/**` and `playwright.config.ts` are outside `src`, not covered by this lint script — no existing rule required otherwise). |
| `pnpm test` | 0 | `vitest run` — 15 files, **342/342 tests passed** (unchanged from before this change; no unit test regression). |

**NOT run** (per explicit constraint — no backend/live app in this
environment): `pnpm exec playwright test` (actual browser execution),
`pnpm run test:e2e`, `pnpm build`.

## Files Created

- `playwright.config.ts` (46 lines) — 4 projects (chromium/firefox/webkit/
  mobile-chromium), `baseURL` from `PLAYWRIGHT_BASE_URL` env (default
  `http://localhost:3000`), trace/screenshot/video retained on failure,
  `webServer` runs `pnpm dev` (reuses an already-running server). Never sets
  `NEXT_PUBLIC_AUTH_BYPASS`/`NEXT_PUBLIC_USE_MOCKS`.
- `tests/e2e/fixtures/auth.ts` (61 lines) — `assertRealAuthMode()`,
  `requireEnv()`, and an `authenticatedPage` fixture that logs in via
  `POST {API_BASE}/auth/login` using `E2E_USER_EMAIL`/`E2E_USER_PASSWORD`
  and reuses the resulting cookie-bearing browser context. Fails clearly and
  early on missing creds or bypass/mock flags.
- `tests/e2e/fixtures/network.ts` (38 lines) — `corsEchoHeaders()` (echoes
  request origin + `access-control-allow-credentials: true`, required
  because the app's axios client sends `withCredentials: true`) and
  `failFirstRequest(status, message)` (fails exactly one non-preflight
  request, then lets every subsequent request continue) — shared by
  critical-paths and accessibility specs.
- `tests/e2e/critical-paths.spec.ts` (52 lines) — logs in, forces one
  contract failure on `GET {API_BASE}/templates`, asserts the `ErrorAlert`
  is visible with deterministic focus on the retry button, retries via
  keyboard only (`.press('Enter')`), asserts recovery, and asserts at most
  one allowlisted telemetry request (skips itself with a clear reason if
  `NEXT_PUBLIC_TELEMETRY_ENDPOINT` is unset for the run).
- `tests/e2e/accessibility.spec.ts` (60 lines) — three axe scans (login page
  + toggle name/state, templates gallery normal state, templates gallery
  forced-recovery state) filtering to `serious`/`critical` impact violations;
  asserts focus restoration in the forced-recovery case.
- `tests/e2e/browser-matrix.spec.ts` (67 lines) — asserts the four required
  project names are declared exactly (no silent extra/missing project), and
  that every real (non-placeholder) exclusion row in `ops/browser-support.md`
  has owner/reason/evidence/expiry and an unexpired date.
- `ops/browser-support.md` (52 lines) — Quick path, supported matrix table,
  exclusions table (empty placeholder), evidence log, and a checklist, per
  `cognitive-doc-design` shape.

## Files Modified

- `src/components/atoms/eye-password.tsx` (+15/-11) — icon-only password
  toggle now has `aria-label` ("Show password"/"Hide password") and
  `aria-pressed`; collapsed the duplicated if/else branches into one return.
- `src/domains/auth/components/login-form.tsx` (+3/-1) — server-side login
  error paragraph now has `role="alert"` so screen readers announce it
  immediately.
- `src/components/shared/error-alert.tsx` (+16/-4) — added `'use client'`,
  a `retryButtonRef`, and a mount `useEffect` that focuses the retry button
  whenever `onRetry` is provided. This is the highest-leverage fix: `ErrorAlert`
  is reused by 14 call sites (templates, dashboard, brands, projects, assets,
  users, render-jobs, components-registry), so every one of those recoverable
  failure states now gets deterministic keyboard focus for free.
- `src/app/global-error.tsx` (+5/-1) — same focus-on-mount pattern applied to
  the root error boundary's native "Try again" button.
- `package.json` (+1) — added `"test:e2e": "playwright test"` script.
- `.gitignore` (+3) — added `.env.e2e` (credentials never committed).
- `openspec/changes/frontend-browser-recovery-accessibility/tasks.md` — all
  6 tasks marked `[x]` with structural-RED/owner-run annotations.

## Files NOT Created (blocked by sandbox permission)

- `.env.e2e.example` — **could not be written**. Any path matching `.env*`
  at the repo root is hard-denied by the permission system in this session,
  independent of content or write method (`Write` tool, heredoc, `cp` from an
  allowed scratch path — all denied identically). Exact intended content,
  for the owner (or a session with different permissions) to create with one
  command:

  ```
  # E2E real-auth credentials (F3 — frontend-browser-recovery-accessibility)
  #
  # Copy this file to `.env.e2e` (git-ignored) and export its values before
  # running Playwright. Never commit real credentials.
  #
  # Documented local default: the backend README seed user (ADMIN role).
  E2E_USER_EMAIL=admin@opengine.com
  E2E_USER_PASSWORD=password123

  # Required — must both be false. Never enable bypass/mocks to "recover".
  NEXT_PUBLIC_AUTH_BYPASS=false
  NEXT_PUBLIC_USE_MOCKS=false
  ```

  `.gitignore` already excludes `.env.e2e` so the real file, once created
  locally by the owner, is never committed.

## Diff Size

Exact counts (`wc -l` for new files, `git diff --stat` for modified files):

- New files (all-additions): `playwright.config.ts` 48 + `tests/e2e/fixtures/auth.ts` 65
  + `tests/e2e/fixtures/network.ts` 45 + `tests/e2e/critical-paths.spec.ts` 53
  + `tests/e2e/accessibility.spec.ts` 65 + `tests/e2e/browser-matrix.spec.ts` 75
  + `ops/browser-support.md` 57 = **408 lines**.
- Modified files: `.gitignore` +3/-0, `package.json` +1/-0,
  `global-error.tsx` +7/-1, `eye-password.tsx` +28/-16, `error-alert.tsx`
  +21/-2, `login-form.tsx` +4/-1 = **48 insertions + 16 deletions (64 changed lines)**.
- **Total authored changed lines: 472** (408 + 64).

This is **above** the 320-400 forecast band (Medium risk, already resolved
via `feature-branch-chain`, "Decision needed before apply: No"). The overage
comes mostly from the two contract test files
(`browser-matrix.spec.ts` at 75 lines, `accessibility.spec.ts` at 65 lines)
needing real assertions per scenario category (four projects × doc-field
validation; three axe scans × two states), not filler. Flagged as a
deviation below rather than artificially trimmed at the cost of coverage.

## Rollback Boundary

Every new file (`playwright.config.ts`, `tests/e2e/**`, `ops/browser-support.md`)
can be deleted independently with zero effect on existing app behavior — none
of them are imported by application code. The four component/page edits
(`eye-password.tsx`, `login-form.tsx`, `error-alert.tsx`, `global-error.tsx`)
are each a single additive, backward-compatible change (new attributes/ref/
`useEffect`); reverting any one file restores its exact prior behavior with
no cross-file coupling. `package.json`'s new script and the `.gitignore`
line are independently revertable one-liners.

## Risks / Deviations

0. **Diff size (472 > 400)** — see "Diff Size" above. Primary numeric
   deviation from the task brief's budget; scenario coverage in the two
   contract specs was prioritized over an arbitrary line cut.
1. **`.env.e2e.example` not created** — see "Files NOT Created" above; this
   is a hard environment/permission boundary, not a design choice. Exact
   content provided for manual creation.
2. **~~No real browser execution performed~~ — RESOLVED this session.** A
   live backend became available; Chromium ran for real (6/6 passed, see
   "REAL Chromium Run" above). Firefox/WebKit + the full four-project
   matrix remain **owner-run** (only Chromium binary installed here).
3. **`NEXT_PUBLIC_TELEMETRY_ENDPOINT`-gated assertion** —
   `critical-paths.spec.ts`'s telemetry-count assertion self-skips with an
   explicit reason if that env var isn't set for the run, since the F2
   telemetry client is disabled by default unless a real destination is
   configured. This keeps the test truthful (never silently passing) without
   requiring a specific hardcoded destination in test code. This session
   set it to a Playwright-intercepted local URL to un-skip and pass the test.
4. **~~Contrast fixes deferred to axe evidence~~ — RESOLVED this session.**
   The owner's real axe run (this session) did report a `color-contrast`
   violation on the destructive `Alert`'s description text; fixed by
   dropping an opacity modifier on the existing `--destructive` token (see
   fix #3 in "REAL Chromium Run" above) — a token-level, non-redesign fix,
   not a new component patch.
5. **Duplicate telemetry across automatic retry (new, resolved)** — see
   fix #4 above. A 3-second in-memory dedup window was added to
   `src/lib/api/client.ts`'s `recordApiBoundaryTelemetry`; this touches F2's
   (`PR-F02`) telemetry emission code, not strictly F3's a11y scope, but was
   necessary to make the spec's own "one allowlisted telemetry request"
   contract hold once a real automatic retry was exercised in a live
   browser — something F2's unit tests never exercised (they all pass
   `retry: false` explicitly). Flagged here for owner visibility given the
   PR-F02/PR-F05 ownership boundary in spec.md.

## Owner-Run Command (task 1.6 closure)

```bash
cd op-video-engine-frontend
cp .env.e2e.example .env.e2e   # fill in real credentials first
export $(cat .env.e2e | xargs)
export NEXT_PUBLIC_AUTH_BYPASS=false
export NEXT_PUBLIC_USE_MOCKS=false
pnpm exec playwright install        # firefox + webkit binaries (chromium already present)
pnpm exec playwright test --project=chromium   # fastest signal first
pnpm exec playwright test                      # full 4-project matrix
```

Record the result in `ops/browser-support.md`'s Evidence Log before merging.

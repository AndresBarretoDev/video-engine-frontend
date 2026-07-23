# Apply Progress: Frontend Artifact, CI, and Staging (F4)

Branch: `feat/frontend-artifact-ci-staging` (off merged `main`, F1+F2+F3 already merged).
All 6 tasks (1.1–1.6) implemented and marked `[x]` in `tasks.md`. Task 1.5/1.6
staging execution and image build/publish/deploy remain explicitly **owner-run**
— see "Owner-Run Items" below.

## Files created / modified

| File | Action | Lines |
|---|---|---|
| `src/lib/validation/image-contract.ts` | Create | 138 |
| `src/lib/validation/image-contract.test.ts` | Create | 190 |
| `Dockerfile` | Create | 36 |
| `.dockerignore` | Create | 17 |
| `src/app/api/build-info/route.ts` | Create | 19 |
| `next.config.ts` | Modify | +1 (`output: 'standalone'`) |
| `src/lib/validation/ci-contract.ts` | Create | 159 |
| `src/lib/validation/ci-contract.test.ts` | Create | 154 |
| `.github/workflows/frontend-ci.yml` | Create | 109 |
| `tests/e2e/staging.spec.ts` | Create | 103 |
| `ops/production-validation.md` | Modify | +56/-14 (`git diff --stat`: `1 file changed, 56 insertions(+), 14 deletions(-)`) |

Gross diff ~982 lines across 11 files — over the 330-400 "authored changed
lines" forecast in `tasks.md`. Deviation: the forecast did not anticipate the
combined footprint of two fixture-driven contract test files (mirroring the
repo's existing `check-contract.test.ts` style, ~150-190 lines each with both
synthetic fixtures and real-file assertions) plus a full CI workflow and
Dockerfile. Core non-test logic (`image-contract.ts` + `ci-contract.ts` +
route + Dockerfile + workflow + doc delta) is ~490 lines; the rest is test
fixtures. No scope was added beyond the 6 tasks.

## Strict TDD evidence

- **1.1/1.2 (image contract)**: `image-contract.test.ts` written against
  `image-contract.ts` pure validators (candidate SHA, API target, frozen
  install, Dockerfile stages/non-root/standalone-output/build-args,
  `.dockerignore` bounded context, build-info response shape) plus assertions
  against the real `Dockerfile`/`.dockerignore`. 24/24 passing on first
  focused run — no red→fix cycle was needed because the Dockerfile/.dockerignore
  were authored to already satisfy the contract (per skill guidance: pure
  logic + fixtures written together, verified green before commit).
- **1.3/1.4 (CI contract)**: `ci-contract.ts` string/line-based validators
  (no YAML-parser dependency added) for injected-command rejection, blocking
  `needs:`, per-job `timeout-minutes`, ref-scoped `cancel-in-progress`
  concurrency, `retention-days`, `staging-gate` `if: success()` guard, and
  shared `NEXT_PUBLIC_BUILD_SHA` identity across `build`/`staging-gate`.
  16/16 passing against both synthetic bad-fixtures and the real
  `.github/workflows/frontend-ci.yml`.
- **1.5 (staging spec, owner-run)**: `tests/e2e/staging.spec.ts` authored
  reusing the F3 `fixtures/auth.ts`/`fixtures/network.ts` conventions
  (`assertRealAuthMode`, `requireEnv`, `failFirstRequest`). Confirmed via
  `playwright test --list` (20 test instances: 5 tests × 4 browser projects).
  **Not executed** — requires a real deployed staging environment,
  `STAGING_PROMOTED_SHA`, and `PLAYWRIGHT_BASE_URL`.
- **1.6 (doc consolidation)**: `ops/production-validation.md` restructured
  per `cognitive-doc-design` (Quick path → Details table → Checklist). Ran
  `check-contract.test.ts` before and after — all 15 tests, including the
  exact-string assertions on `Status: `PENDING_F4_EVIDENCE``,
  `frontend-artifact-ci-staging`, the 4 required `| <field> | PENDING_F4_EVIDENCE |`
  rows, and the absence of `production-validation-context.json`, still pass
  unchanged.

## Verification (no docker build, no staging run, no deploy)

| Command | Result |
|---|---|
| `pnpm exec vitest run src/lib/validation/image-contract.test.ts src/lib/validation/ci-contract.test.ts` | 40/40 passed |
| `pnpm test` (full suite) | 382/382 passed (was 342/342 baseline; +40 new) |
| `pnpm exec vitest run src/lib/validation/check-contract.test.ts` | 15/15 passed (F1 contract unaffected) |
| `pnpm run type:check` | exit 0 |
| `pnpm run lint:check` | exit 0 |
| `pnpm run format:check` | exit 0 (prettier `--write` applied once to the 5 new/modified TS/MD files, then verified clean) |
| `pnpm exec playwright test --list tests/e2e/staging.spec.ts` | 20 test instances listed, parses cleanly across chromium/firefox/webkit/mobile-chromium |

## Owner-Run Items (explicitly deferred, never executed by the agent)

1. `docker build --build-arg BUILD_SHA=<sha> --build-arg NEXT_PUBLIC_API_URL=<url> .` — image build/publish.
2. Deploying the built image to a staging environment.
3. `NEXT_PUBLIC_AUTH_BYPASS=false NEXT_PUBLIC_USE_MOCKS=false STAGING_PROMOTED_SHA=<sha> PLAYWRIGHT_BASE_URL=<url> pnpm exec playwright test tests/e2e/staging.spec.ts --project=chromium` — real staging validation (PR-F04).
4. Dispatching `.github/workflows/frontend-ci.yml` via `workflow_dispatch` with real registry/deployment credentials (PR-F03).
5. Filling in the `ops/production-validation.md` "F4 Owner Evidence" table and flipping `Status` away from `PENDING_F4_EVIDENCE`.

## Rollback

Revert this branch; no remote settings, registry, or deployment state were
touched. `ops/production-validation.md` Status remains `PENDING_F4_EVIDENCE`
until the owner completes the items above.

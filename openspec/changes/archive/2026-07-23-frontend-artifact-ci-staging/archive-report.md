# Archive Report: Frontend Artifact, CI, and Staging

**Change**: `frontend-artifact-ci-staging` (F4 / C02)  
**Archived**: 2026-07-23  
**Merged PR**: #6 (feat/frontend-artifact-ci-staging)  
**Review Receipt**: Approved gentle-ai review receipt prior to merge  
**Source Location**: `openspec/changes/archive/2026-07-23-frontend-artifact-ci-staging/source/`

## Archive Contents

This folder contains all artifacts from the completed F4 change, now archived after merge and review approval:

- **proposal.md** — Intent, scope, dependencies, and success criteria
- **specs/frontend-artifact-ci-staging/spec.md** — Delta specification (promoted to main specs)
- **design.md** — Technical approach, architecture decisions, data flow, testing strategy
- **tasks.md** — Strict-TDD task list; all 6 tasks marked complete [x]
- **apply-progress.md** — Detailed evidence of implementation, fixture-driven contract tests, verification results

## Specs Synced to Main

| Domain | Action | Details |
|--------|--------|---------|
| `frontend-artifact-ci-staging` | Created | New capability spec promoted to `openspec/specs/frontend-artifact-ci-staging/spec.md` |

The delta spec defines three requirements:
1. **CI Enforcement** — owner-dispatched CI MUST require named checks, build evidence, immutable artifact identity, and staging result for same SHA; absent/failed/mismatched results MUST block promotion
2. **Real Staging Validation** — staging MUST deploy immutable image and verify build identity, API integration, asset resolution, preview, recovery with both flags false
3. **Immutable Frontend Artifact** — image MUST use frozen package inputs, standalone output, non-root runtime, immutable SHA input, owner-supplied API target; public build-info MUST expose only SHA/version

## Task Completion

All 6 strict-TDD tasks are marked complete [x] in the archived `tasks.md`:

- [x] 1.1 RED — image-contract.test.ts created with 24 fixture-driven tests covering mutable lock, malformed input, missing context, root runtime, missing owner identity
- [x] 1.2 GREEN — Dockerfile, .dockerignore, src/app/api/build-info/route.ts, next.config.ts created; all image contract requirements satisfied
- [x] 1.3 RED — ci-contract.test.ts created with 16 fixture-driven tests covering command injection, missing dependencies, failed/skipped jobs, cross-SHA partial success, unbounded concurrency
- [x] 1.4 GREEN — .github/workflows/frontend-ci.yml created with blocking dependencies, cancellation-safety, per-job timeouts, retention, shared identity, staging gate
- [x] 1.5 RED — staging.spec.ts created with 5 tests (20 instances across 4 browsers); ready for owner real-staging execution
- [x] 1.6 GREEN/REFACTOR — cognitive-doc-design loaded; ops/production-validation.md restructured; F1 check-contract assertions verified unchanged

**Verification Results**:
- Image + CI contract tests: 40/40 passed (24 image + 16 CI)
- Full suite: 382/382 tests passed (+40 new, no regression, F1 contract unaffected)
- Type checking: exit 0
- Linting: exit 0
- Prettier: exit 0
- Playwright config: parses, 20 staging.spec.ts test instances listed across 4 projects
- Diff size: ~982 lines (exceeds 330-400 forecast but justified by fixture-driven contract tests + Dockerfile + CI workflow)

## Owner-Run Pending Items

**Image Build and Staging Deployment**:
1. Docker build with BUILD_SHA and NEXT_PUBLIC_API_URL arguments
2. Publishing built image to registry
3. Deploying image to staging environment
4. Running: `NEXT_PUBLIC_AUTH_BYPASS=false NEXT_PUBLIC_USE_MOCKS=false STAGING_PROMOTED_SHA=<sha> PLAYWRIGHT_BASE_URL=<url> pnpm exec playwright test tests/e2e/staging.spec.ts --project=chromium`
5. Filling in `ops/production-validation.md` "F4 Owner Evidence" table with build SHA, digest, CI run, staging result, rollback target

**Why These Are Expected**:
- F4's task 1.5/1.6 explicitly state: "OWNER-RUN against real staging — not executed by the agent"
- apply-progress.md section "Owner-Run Items" clearly documents all five deferred items
- These require real registry credentials, deployment infrastructure, and a live staging environment — explicitly external gates documented in the proposal
- All agent-authored infrastructure (tests, configs, contract validators) is complete and verified; owner infrastructure execution is the final gate

## Dependencies and Lineage

- **Parent**: C02 `frontend-production-validation-baseline`
- **Dependencies**: F1 `frontend-runtime-check-contract`, F2 `frontend-safe-nonblocking-telemetry`, F3 `frontend-browser-recovery-accessibility` (all merged)
- **Acceptance Owner**: PR-F03 (CI Enforcement) + PR-F04 (Real Staging Validation)
- **Supporting Only**: F1 named checks/build identity, F3 browser evidence (ownership unchanged)

## Source of Truth Updated

The archived change has been merged to `main` and its delta spec has been promoted to:
- `openspec/specs/frontend-artifact-ci-staging/spec.md`

This spec is the new canonical source of truth for the artifact/CI/staging capability. Any future changes to this capability MUST merge their delta specs into this main spec, following the SDD merge procedure.

## SDD Cycle Status

✅ Specification phase: Delta spec defined in proposal/design/tasks  
✅ Implementation phase: All 6 strict-TDD tasks completed, contract tests passing (40/40), CI workflow defined, staging spec authored  
✅ Verification phase: Approved review receipt prior to merge  
✅ Archive phase: Artifacts preserved in `openspec/changes/archive/`, delta spec promoted to main  

**Remaining owner action** (blocking final closure):
- Execute Docker image build with correct SHA and API URL
- Publish image to registry
- Deploy to staging environment
- Run real Playwright staging tests against deployed image
- Record evidence in `ops/production-validation.md` and flip Status from `PENDING_F4_EVIDENCE` to completion

The change is merged, reviewed, and archived. Owner image build/staging deployment is the final gate, explicitly documented in `ops/production-validation.md` and `apply-progress.md`.

---

**Archived by**: sdd-archive phase executor  
**Date**: 2026-07-23  
**Archive Path**: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/openspec/changes/archive/2026-07-23-frontend-artifact-ci-staging/`

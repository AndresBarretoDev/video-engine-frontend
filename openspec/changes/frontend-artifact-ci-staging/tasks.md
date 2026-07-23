# Tasks: Frontend Artifact, CI, and Staging

> **PROMOTED & EXECUTABLE (2026-07-23).** Copied from workspace root to this repo as canonical `tasks.md` after F3 acceptance (PR #5 merged). Repo-local native status is authoritative. Image build/publish and staging deploy + `staging.spec.ts` execution are owner-run (PR-F04); the agent authors the Dockerfile, CI workflow, next.config, build-info route, contract tests, and staging spec.

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated authored changed lines | 330-400 |
| Suggested split | One F4 work-unit PR |
| Delivery strategy | ask-on-risk; topology already resolved |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: Medium
Apply authorization: Not granted; no automatic apply.

PR boundary: `feat/frontend-artifact-ci-staging` targets immediate parent `feat/frontend-browser-recovery-accessibility`, never `main`. Parent C02; dependencies F1/F2/F3. F4 owns PR-F03/PR-F04; F1/F3 overlap is supporting only.

## Queued Promotion Contract

This root package is complete but NOT directly applyable; do not run the root dispatcher or infer native relationships/edit roots. After F3 is accepted, the parent copies all four artifacts to `op-video-engine-frontend/openspec/changes/frontend-artifact-ci-staging/`, where root `tasks.queued.md` is copied as canonical `tasks.md`. Only repo-local native status is authoritative. Promote one dependency-ready frontend change at a time; after evidence, the parent reconciles root OpenSpec/Engram. Owner registry/deployment/API/account/build prerequisites remain blocking.

Apply skills: `/Users/omarbarreto/.codex/skills/sdd-apply/SKILL.md`; `/Users/omarbarreto/.codex/skills/sdd-apply/strict-tdd.md`; `/Users/omarbarreto/.codex/skills/chained-pr/SKILL.md`; `/Users/omarbarreto/.codex/skills/work-unit-commits/SKILL.md`; `/Users/omarbarreto/.codex/skills/cognitive-doc-design/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/vercel-react-best-practices/SKILL.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/skills/baseline-ui/SKILL.md`.

Rules: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-docs/PRODUCT.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/CLAUDE.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/sdd-methodology.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/knowledge/critical-constraints.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/project-constraints-summary.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/api-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.claude/references/auth-patterns.md`; `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/openspec/config.yaml`. Reviewer: `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-code-review/SKILL.md`, excluding Supabase/Server Action assumptions. Never load `/Users/omarbarreto/Documents/PROJECTS/OP_VIDEO_CTV/op-video-engine-frontend/.agent/skills/nextjs-domain-scaffold/SKILL.md`.

## Work Unit Evidence

Focused command: `cd op-video-engine-frontend && pnpm test -- src/lib/validation/image-contract.test.ts src/lib/validation/ci-contract.test.ts`. Runtime: owner runs build/deploy, then `NEXT_PUBLIC_AUTH_BYPASS=false NEXT_PUBLIC_USE_MOCKS=false pnpm exec playwright test tests/e2e/staging.spec.ts --project=chromium`. Rollback: block candidate and redeploy prior immutable digest.

## Strict TDD Tasks

- [x] 1.1 **RED:** create `image-contract.test.ts`; run focused tests and expect mutable lock, malformed SHA/API input, excessive build context, root runtime, or missing owner identity to fail before publish. Done: 24 fixture-driven tests (mutable lock, malformed SHA/URL, missing dockerignore paths, root/missing USER, missing ARG identity) plus real-file assertions.
- [x] 1.2 **GREEN:** create build-info route, `Dockerfile`/`.dockerignore`, and update `next.config.ts`; expose only SHA/version, require frozen inputs/non-root, and never run the build. Done: `src/app/api/build-info/route.ts` (sha/version only), multi-stage non-root `Dockerfile`, bounded `.dockerignore`, `next.config.ts` `output: 'standalone'`. Docker build never executed (owner-run).
- [x] 1.3 **RED:** create `ci-contract.test.ts`; expect composed/untrusted commands, absent dependencies, failed/skipped/cancelled jobs, cross-SHA partial success, missing cleanup/retention, or unbounded concurrency/timeouts to permit promotion. Done: 16 fixture-driven tests over the real `.github/workflows/frontend-ci.yml` text.
- [x] 1.4 **GREEN:** create `.github/workflows/frontend-ci.yml` with fixed repo-local commands, blocking dependencies, cancellation-safe no-promotion, bounded concurrency/timeouts, cleanup, identity, and staging gates; never alter remote settings. Done: `checks` → `build` → `staging-gate` jobs, ref-scoped `cancel-in-progress` concurrency, per-job timeouts, `retention-days: 7`, shared `NEXT_PUBLIC_BUILD_SHA` identity, `if: success()` staging gate. No remote branch-protection/registry mutation.
- [x] 1.5 **RED:** create `staging.spec.ts`; expect wrong SHA, either flag true/missing, API/asset/preview/recovery failure, missing real auth, or unbounded trace retention to fail together. Done: `tests/e2e/staging.spec.ts` (5 tests) authored and confirmed via `playwright test --list` (20 test instances across the 4-browser matrix); OWNER-RUN against real staging — not executed by the agent.
- [x] 1.6 **GREEN/REFACTOR:** load `cognitive-doc-design`, consolidate `ops/production-validation.md`, validate incomplete/mismatched/complete evidence, and record owner run linking BUILD_ID, digest, promoted SHA, staging result, and rollback target. Done: added Quick path, F4 Owner Evidence table (candidate/promoted SHA, digest, BUILD_ID, CI run, staging result, rollback target — all `PENDING_F4_EVIDENCE`), and a completion checklist; `check-contract.test.ts` F1 assertions verified still passing unchanged. Staging/deploy execution remains owner-run — fields stay pending.

## Closure

Return cycle commands/exits, paths, diff ≤400, owner runtime evidence, rollback, and blockers. Preserve API/state/auth/UI architecture and the global-error default-export exception.

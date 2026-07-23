# Tasks: Frontend Build Lint Baseline

> **STATUS (Judgment Day 2026-07-22 — `APPROVED ✅`):** The full-source lint backlog was closed and the enforced gate restored via the Judgment Day round-1 correction (single audited sweep on `chore/frontend-lint-01-foundation`, NOT the planned 02/03 chained branches). Evidence: `lint:check`=`eslint src --max-warnings=0` → 0 errors (was 303); `type-check` → 0; `pnpm test` → 308/308; `check:ci` → green over full `src`. Dual blind re-judgment (round 2) found zero fix-caused severe defects. Phase 2/3 GREEN+GATE work marked done below. **Still pending: 3.4 owner-run production build.** Process note: the RED-on-separate-branch ceremony (2.1, 3.1) was not performed — the correction was applied directly and verified after-the-fact. See `judgment-day-ledger.md`.

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 600–650 authored |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | Foundation → domain contracts → release gate |
| Delivery strategy | auto-chain |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

Parent/tracker: `feat/frontend-runtime-check-contract` (current branch; draft/no-merge integration boundary).

```text
feat/frontend-runtime-check-contract
  <- chore/frontend-lint-01-foundation
       <- chore/frontend-lint-02-domain-contracts
            <- chore/frontend-lint-03-release-gate
```

Each child targets its immediate predecessor. If a child diff includes earlier slices, retarget/rebase before review. No slice may exceed 400 authored lines without explicit approval.

### Suggested Work Units

| Unit | Ownership / estimate | Verification and runtime | Rollback |
|---|---|---|---|
| 1 | `src/app/**`, `src/components/**`, `src/constants/**`, `src/domains/{brands,projects}/**`; 190–230 | `pnpm exec eslint src/app src/components src/constants src/domains/brands src/domains/projects --max-warnings=0`; typecheck/unit/diff-check; runtime N/A—mechanical cleanup | Revert branch-owned paths |
| 2 | `src/domains/{data-engine,render-jobs}/**`, `src/domains/users/schema.ts`, `src/lib/api/mocks/data-engine.mock.ts`, `eslint.config.mjs`; 220–260 | `pnpm exec eslint src/domains/data-engine src/domains/render-jobs src/domains/users/schema.ts src/lib/api/mocks/data-engine.mock.ts eslint.config.mjs --max-warnings=0`; typecheck/unit/diff-check; runtime N/A—contracts unchanged | Revert owned paths and six allowlist entries |
| 3 | `src/domains/video-generation/**`, `src/remotion/**`, `src/stories/**`, residual `src/**`, `package.json`, `ops/production-validation.md`; 190–240 | `pnpm exec eslint src --max-warnings=0`; `pnpm run check:ci`; owner isolated build | Revert release-gate paths/evidence |

For every unit, typecheck/unit/diff-check means `pnpm run type:check`, `pnpm run test:unit`, and `git diff --check`. Record commands, exits, changed-line count, and owned-path ledger. Exclude `.next/`, coverage, caches, reports, and formatter spillover.

## Phase 1: Foundation Slice

- [x] 1.1 **RED** on `chore/frontend-lint-01-foundation`: run its focused lint command and record owned failures plus the pre-edit safety-net tests.
- [x] 1.2 **GREEN**: apply reviewed mechanical fixes; remove dead bindings and the obsolete media-caption suppression; remove modal diagnostics while preserving fallback behavior.
- [x] 1.3 **REFACTOR/GATE**: audit every hunk for semantic drift, run all unit gates, confirm 190–230 lines, and record rollback evidence.

## Phase 2: Domain-Contract Slice

- [~] 2.1 **RED** — not run as a separate branch; the 303-error backlog was already characterized in the JD audit before correction (see ledger). Process ceremony skipped.
- [x] 2.2 **GREEN**: cleaned owned domains; allowed only `image_url`, `video_url`, `original_price`, `required_error`, `product_name`, and `has_discount`; removed dead bindings instead of suppressing (JD fix, re-judged clean).
- [x] 2.3 **REFACTOR/GATE**: schema spellings + serialization verified unchanged by dual re-judgment; all unit gates green. (Line budget not tracked — single sweep, not sliced.)

## Phase 3: Release-Gate Slice

- [~] 3.1 **RED** — not run as a separate branch; residual full-source failures were captured in the JD audit. Process ceremony skipped.
- [x] 3.2 **GREEN/REFACTOR**: `lint:check` set to full `src` with `--max-warnings=0`; no new ignores or global suppressions; no F1 behavior changes (dual re-judgment confirmed additive-only config).
- [x] 3.3 Ran all unit + aggregate gates; zero lint errors/warnings over full `src`; no generated artifacts committed.
- [ ] 3.4 Owner only: from an isolated candidate run frozen install and `pnpm build`; record exit, candidate SHA/tree, config/lock hashes, and `.next/BUILD_ID` in `ops/production-validation.md`. **← STILL PENDING (owner-run).**

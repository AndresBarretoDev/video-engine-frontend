# Archive Report: Frontend Runtime Check Contract

## Change Summary

**Change Name**: `frontend-runtime-check-contract`  
**Archived**: 2026-07-23  
**Status**: Complete and verified; merged to main via PR #2

## Candidate and Review Evidence

| Field | Value |
|-------|-------|
| Candidate SHAs | `08b4e24`, `1569768`, `bb128897` |
| Review Receipt | `review-edc83ef` (approved) |
| PR | #2 (merged to main) |
| Branch | `chore/frontend-lint-01-foundation` (co-implemented with frontend-build-lint-baseline) |

## Specs Synced

| Capability | Action | Details |
|------------|--------|---------|
| `frontend-runtime-check-contract` | Created | 3 requirements (Runtime/Package, Checks, Handoff) with scenarios; 65 lines |

**Main Spec Location**: `openspec/specs/frontend-runtime-check-contract/spec.md`

### Requirements Archived

1. **Runtime and Package Identity** (2 scenarios)
   - Runtime inputs agree
   - Runtime or package inputs disagree

2. **Deterministic Focused Checks** (2 scenarios)
   - All named checks pass
   - One named check fails

3. **Pending Release-Evidence Handoff** (2 scenarios)
   - F1 completes its prerequisite
   - Release evidence becomes available

## Archive Contents

- ✅ `proposal.md` — Intent, scope, approach, risks, success criteria; defines F1 boundary (runtime/package/named-checks) vs F4 boundary (candidate/build/artifact)
- ✅ `specs/frontend-runtime-check-contract/spec.md` — 3 requirements with Given/When/Then scenarios (delta spec → main spec)
- ✅ `design.md` — Technical approach; architecture decisions; data flow; file responsibilities; testing strategy; rollout/rollback
- ✅ `tasks.md` — 6 strict TDD tasks (RED → GREEN → TRIANGULATE → REFACTOR) across 5 work units; all [x] COMPLETE
- ✅ `apply-progress.md` — Implementation complete; F1 prerequisite scope realized; F4 handoff realignment documented; removed complexity around Git evidence validation
- ✅ `verify-report.md` — Marked as "SUPERSEDED" (prior version, non-authoritative; new verification captured in apply-progress)

## Task Completion

| Task | Status |
|------|--------|
| 1.1 (RED: characterize mismatched inputs) | [x] COMPLETE |
| 1.2 (GREEN: align runtime, package, lock atomically) | [x] COMPLETE |
| 1.3 (RED: characterize missing/writing scripts) | [x] COMPLETE |
| 1.4 (GREEN: provide non-writing focused scripts) | [x] COMPLETE |
| 1.5 (TRIANGULATE: prove valid frozen installs) | [x] COMPLETE |
| 1.6 (REFACTOR: remove evidence/fixtures, leave F4 pending) | [x] COMPLETE |

**All strict TDD tasks marked done.** F1 contract test: 15/15 passed; aggregate suite: 11 files, 308/308 tests green.

## Verification Status

- **Runtime/package identity**: ✅ Node 22 + pnpm aligned across `.nvmrc`, `.node-version`, `package.json`, `pnpm-lock.yaml`
- **Named checks**: ✅ Non-writing format, lint, type, unit, aggregate commands; fail-fast `check:ci` chain; all checks passing
- **Focused contract**: ✅ `pnpm exec vitest run src/lib/validation/check-contract.test.ts` → exit 0; 15/15 tests
- **Aggregate suite**: ✅ 11 files, 308/308 tests green; no regressions
- **F4 handoff**: ✅ `ops/production-validation.md` marked `PENDING_F4_EVIDENCE` per ownership realignment; candidate SHA, build, `.next/BUILD_ID`, artifact, and deployment evidence explicitly deferred to F4 `frontend-artifact-ci-staging`
- **Process**: ✅ Git revision/tree/parent evidence validators removed; completed-evidence JSON context removed; temporary Git repos removed

## SDD Cycle Closure

The change has been fully:
1. **Proposed** — intent, scope, approach, ownership boundaries defined
2. **Specified** — 3 requirements defining F1 runtime/package/checks prerequisites; F4 evidence ownership documented
3. **Designed** — technical approach; F1/F4 boundary; data flow; file responsibilities
4. **Tasked** — 6 strict TDD tasks with RED/GREEN/TRIANGULATE/REFACTOR structure; all [x] complete
5. **Applied** — implementation complete; contract tests passing; F4 handoff realignment applied
6. **Verified** — aggregate test suite green; independent verification proves contract correctness
7. **Archived** — specs synced to main tree; change folder moved to archive

## Source of Truth Updated

The following main spec now reflects the F1/F4 prerequisite contract:
- `openspec/specs/frontend-runtime-check-contract/spec.md` — 3 requirements defining Node 22 + pnpm identity, deterministic named checks, and explicit F4 evidence ownership

## Ownership Transfer

**F1 provides** (this change):
- Exact Node 22 + pnpm version declarations
- Atomic package/lock inputs
- Deterministic non-writing named checks (format, lint, type, unit, aggregate `check:ci`)
- Pending F4 handoff (explicit, never completed)

**F4 owns** (separate change, `frontend-artifact-ci-staging`):
- Candidate SHA selection and frozen-install acceptance
- Production build execution and `.next/BUILD_ID` binding
- Artifact collection, provenance, and deployment
- Release evidence validation and PR closure (PR-F03/PR-F04)

## Next Phase

No follow-up required in F1. The change is complete and closed. F4 `frontend-artifact-ci-staging` is now ready to receive F1 contract results and perform release-evidence collection and acceptance.

---

**Archive Date**: 2026-07-23  
**Archived By**: sdd-archive executor  
**Skill Resolution**: paths-injected

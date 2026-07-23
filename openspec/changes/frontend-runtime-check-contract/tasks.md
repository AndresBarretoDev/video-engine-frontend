# Tasks: Frontend Runtime Check Contract

## Review Workload Forecast

| Field            | Value                                         |
| ---------------- | --------------------------------------------- |
| Delivery         | One focused F1 prerequisite slice             |
| Risk             | Medium: runtime/package configuration         |
| Release evidence | Deferred to F4 `frontend-artifact-ci-staging` |

## Work Unit Boundary

F1 owns Node/pnpm identity, package/lock atomicity, deterministic non-writing named checks, and an open F4 handoff. It does not own candidate SHA, build, `.next/BUILD_ID`, artifact, staging, or provenance acceptance.

## Strict TDD Tasks

- [x] 1.1 **RED:** characterize mismatched Node/pnpm/package/lock inputs.
- [x] 1.2 **GREEN:** align `.nvmrc`, `.node-version`, manifest, lockfile, Playwright/axe inputs, and patched ESLint overrides atomically.
- [x] 1.3 **RED:** characterize missing/writing scripts and a failed named check.
- [x] 1.4 **GREEN:** provide non-writing focused scripts and the exact fail-fast `check:ci` chain.
- [x] 1.5 **TRIANGULATE:** prove valid/duplicate frozen installs preserve the lockfile and success/failure aggregate paths remain distinguishable.
- [x] 1.6 **REFACTOR:** remove completed-evidence/Git fixtures and leave `ops/production-validation.md` explicitly pending for F4.

## Work Unit Evidence

- Focused: `pnpm exec vitest run src/lib/validation/check-contract.test.ts`.
- Runtime fixtures: isolated pnpm aggregate and frozen-lock executions.
- Rollback: revert F1 runtime/config/script/package/lock changes together; F4 evidence remains outside this boundary.

## Closure

F1 is complete when its automated contract passes and the handoff remains pending. Production build or provenance evidence is neither required nor accepted here.

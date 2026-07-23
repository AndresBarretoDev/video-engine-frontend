# Proposal: Frontend Build Lint Baseline

## Intent

Close the pre-existing lint debt blocking F1's releasable production build. Compilation succeeds, but the enforced Next.js lint stage reports 406 errors and 2 warnings across 81 files. This prerequisite keeps baseline cleanup outside F1 product scope.

## Scope

### In Scope
- Resolve the existing full-source ESLint baseline without disabling rules, narrowing lint coverage, or weakening `pnpm build`.
- Audit mechanical autofixes and make only behavior-preserving corrections.
- Deliver approximately three reviewable feature-branch-chain slices, each below the 400-line review budget where practical.
- Record final owner-run production build evidence, including `.next/BUILD_ID` and candidate identity.

### Out of Scope
- F1 UI, API, state, Remotion, or product-behavior changes.
- New lint rules, broad refactors, dependency upgrades, formatting campaigns, or generated artifacts.
- CI, deployment, accessibility, telemetry, or test-platform expansion.

## Capabilities

### New Capabilities
- `frontend-build-lint-baseline`: A strict, reproducible full-source lint and production-build acceptance baseline.

### Modified Capabilities
None.

## Approach

Treat the 508-line/53-file simulated autofix as a forecast, not an unchecked patch. Preserve existing rules and validate behavior. Use approximately three feature-branch-chain slices:

1. Tooling-adjacent, shared, and low-risk mechanical corrections.
2. Domain/component corrections grouped by cohesive directory boundaries.
3. Remaining blockers, aggregate verification, and owner-run `pnpm build` plus `.next/BUILD_ID` evidence.

Each child targets its predecessor, carries focused checks, and excludes F1 changes.

## Affected Areas

| Area | Impact | Description |
|---|---|---|
| `src/**` | Modified | Behavior-preserving lint corrections |
| `eslint.config.mjs`, `package.json` | Constrained | Preserve strict full-source/build commands; change only if required for accurate enforcement |
| `ops/production-validation.md` | Modified | Build exit, candidate identity, and BUILD_ID evidence |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Autofix changes runtime behavior | Medium | Review each hunk; run focused checks per slice |
| Review overload from 600–650 lines | High | Three chained slices; no slice exceeds 400 authored lines without approval |
| Cleanup absorbs F1 work | Medium | Reject UI/product changes and keep directory-scoped diffs |

## Rollback Plan

Revert the affected chain slice independently. If final integration fails, stop before merging the tracker; never disable lint or bypass the production build.

## Dependencies

- F1 production compilation path and runtime/check contract remain intact.
- Owner executes the final production build per repository policy.

## Success Criteria

- [ ] Full-source lint completes with zero errors and zero warnings under unchanged enforcement.
- [ ] Typecheck and unit tests remain green for every slice.
- [ ] Final owner-run `pnpm build` succeeds and records `.next/BUILD_ID` against the candidate identity.
- [ ] F1 product behavior and scope are unchanged.

# Proposal: Frontend Artifact, CI, and Staging

## Intent

Close C02 by binding checks, an owner-built immutable frontend artifact, and real staging behavior to one reviewed SHA. Operators need promotion to fail closed when any identity, integration, or recovery proof is absent.

## Scope

### In Scope
- Own PR-F03 CI enforcement and PR-F04 real staging validation, including their named scenarios.
- Expose minimal public build identity, configure standalone output, and define a frozen-lockfile non-root image contract.
- Define owner-dispatched blocking CI and Playwright staging evidence for real NestJS/httpOnly-cookie API, protected assets, preview, and recovery with both bypass and mocks false.
- Consolidate owner evidence for runtime, `.next/BUILD_ID`, image digest, API target, promoted SHA, staging result, and rollback target.

### Out of Scope
- Agent-run production build/deployment, remote branch-protection mutation, registry credentials, backend edits, or UI redesign.
- Mutable public runtime variables beyond approved build identity; Supabase, Server Actions, or domain scaffolding.

## Ownership and Lineage

- Parent: C02 `frontend-production-validation-baseline`; dependencies: F1 runtime contract, F2 telemetry, F3 browser/accessibility matrix.
- Acceptance owner: PR-F03 plus `Failed check blocks promotion`; PR-F04 plus `Staging exercises the reviewed artifact`.
- Supporting only: F1 named checks/build identity and F3 browser matrix; their ownership remains unchanged.
- Authority: `op-video-engine-docs/PRODUCT.md` and current root SDD artifacts.
- Planning state: complete queued root package, not directly applyable. After F3, parent copies proposal/spec/design and root `tasks.queued.md` into frontend repo-local OpenSpec, renaming it canonical `tasks.md`; the root dispatcher is prohibited.

## Capabilities

### New Capabilities
- `frontend-artifact-ci-staging`: immutable artifact identity, blocking CI, and real staging closure.

### Modified Capabilities
None.

## Approach

Test workflow/image/evidence contracts without building, expose only candidate SHA through build-info, and require owner CI/deployment evidence to bind every gate to the same immutable image.

## Affected Areas

| Area | Impact |
|---|---|
| `src/app/api/build-info/route.ts`, `next.config.ts` | Public SHA and standalone output |
| `Dockerfile`, `.dockerignore` | Frozen non-root image contract |
| `.github/workflows/frontend-ci.yml` | Owner-dispatched blocking pipeline |
| `tests/e2e/staging.spec.ts`, `src/lib/validation/**` | Identity, CI, and real staging tests |
| `ops/production-validation.md` | Owner evidence and rollback record |

## Risks and Rollback

Wrong-SHA promotion is the primary risk. Reject any missing/mismatched identity or failed check. Rollback redeploys the prior immutable digest, blocks the candidate, and retains both failed and successful evidence.

## Dependencies

Owner supplies registry, deployment, API URL, authenticated staging account, and build execution outside Git.

## Success Criteria

- [ ] PR-F03/PR-F04 have current owner evidence bound to one SHA/image/build ID.
- [ ] Real staging passes with both flags false; build-info SHA equals promoted SHA.

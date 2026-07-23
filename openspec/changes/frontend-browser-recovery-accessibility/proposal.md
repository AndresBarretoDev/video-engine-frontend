# Proposal: Frontend Browser Recovery and Accessibility

## Intent

Prove the existing frontend in real browsers rather than treating node-only tests as user evidence. Operators need visible recovery, accessible critical paths, and an owned browser/device policy before composer features depend on the client.

## Scope

### In Scope
- Own PR-F05 accessibility and PR-F06 browser support, including their named scenarios.
- Add Playwright projects for Chromium, Firefox, WebKit, and mobile Chromium; use real browser evidence, never jsdom as a substitute.
- Exercise normal and recoverable contract-failure journeys with `NEXT_PUBLIC_AUTH_BYPASS=false` and `NEXT_PUBLIC_USE_MOCKS=false`.
- Apply only minimal keyboard, focus, semantic, contrast, and assistive-technology fixes; document owned, reasoned, expiring exclusions.
- Support F2's PR-F02 browser-observed telemetry scenario without duplicating ownership.

### Out of Scope
- UI redesign, backend changes, CI/deployment ownership, or staging artifact promotion.
- Hidden/conditional skips, credentials in Git, Server Actions, Supabase, or domain scaffolding.

## Ownership and Lineage

- Parent: C02 `frontend-production-validation-baseline`; dependencies: F1 `frontend-runtime-check-contract`, F2 `frontend-safe-nonblocking-telemetry`.
- Acceptance owner: PR-F05 plus `Critical workflow is accessible`; PR-F06 plus `Supported matrix is verified`.
- Supporting only: PR-F02 browser observation, owned by F2.
- Authority: `op-video-engine-docs/PRODUCT.md` and current root SDD artifacts.
- Planning state: complete queued root package, not directly applyable. After F2, parent copies proposal/spec/design and root `tasks.queued.md` into frontend repo-local OpenSpec, renaming it canonical `tasks.md`; the root dispatcher is prohibited.

## Capabilities

### New Capabilities
- `frontend-browser-recovery-accessibility`: real-browser recovery, accessibility, and support-matrix evidence.

### Modified Capabilities
None.

## Approach

Declare the owner-approved matrix in Playwright and a cognitive-load-aware support record. Share transparent auth/recovery/accessibility fixtures, force both bypass controls false, and make exclusions explicit data.

## Affected Areas

| Area | Impact |
|---|---|
| `playwright.config.ts`, `tests/e2e/**` | Projects, auth, recovery, axe, matrix evidence |
| Existing page/component paths | Minimal accessibility/recovery fixes only |
| `ops/browser-support.md` | Versioned support and exclusion policy |

## Risks and Rollback

Flaky browser checks can hide regressions or block delivery. Use explicit assertions and bounded traces. Disable a project only with owner, reason, affected journey, evidence, and expiry; never enable bypass/mocks to recover.

## Dependencies

Owner supplies staging account and approved browser/device matrix outside Git.

## Success Criteria

- [ ] PR-F05/PR-F06 have passing owner/browser evidence with no blocking accessibility violation.
- [ ] Both bypass variables are false; F2 receives linked browser telemetry evidence.

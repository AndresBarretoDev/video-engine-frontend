# Design: Frontend Runtime Check Contract

## Technical Approach

Keep F1 small. A focused Vitest contract reads runtime/package metadata and exercises isolated pnpm fixtures for frozen-lock and named-check behavior. The production-validation document remains a pending pointer to F4 rather than a release-evidence validator.

## Architecture Decisions

| Decision             | Choice and rationale                                                                     | Rejected tradeoff                                                 |
| -------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Runtime identity     | Exact Node 22 plus pnpm metadata prevents local/CI drift.                                | Broad or implicit runtime support.                                |
| Package boundary     | Manifest, lockfile, Playwright/axe inputs, and patched ESLint overrides move atomically. | Partial lock edits or unrelated upgrades.                         |
| Checks               | Static non-writing commands compose into a fail-fast `check:ci`.                         | Write-format scripts or production build inside the aggregate.    |
| Evidence ownership   | F1 leaves a pending handoff; F4 owns candidate/build/artifact provenance.                | Self-referential Git-object and evidence-commit validation in F1. |
| Product architecture | No API, auth, state, Remotion, or UI behavior changes.                                   | Product changes inside infrastructure work.                       |

## Data Flow

```text
runtime + package/lock ----> F1 contract ----> named check results
pending evidence handoff --------------------> F4 artifact/CI/staging gate
owner build + artifact + deployment --------> F4 acceptance only
```

## File Responsibilities

| File                                        | Responsibility                                            |
| ------------------------------------------- | --------------------------------------------------------- |
| `.nvmrc`, `.node-version`                   | Exact Node identity                                       |
| `package.json`, `pnpm-lock.yaml`            | pnpm, dependencies, overrides, scripts, and frozen inputs |
| `eslint.config.mjs`, `vitest.config.ts`     | Stable non-writing tool inputs                            |
| `src/lib/validation/check-contract.test.ts` | Runtime, package/lock, and named-check contract           |
| `ops/production-validation.md`              | Pending F4 handoff; never completed evidence acceptance   |

## Testing Strategy

| Layer           | Coverage                                                                            |
| --------------- | ----------------------------------------------------------------------------------- |
| Contract        | Matching/mismatched runtime metadata, dependency/lock identity, and pending handoff |
| Process fixture | Successful and failed aggregate checks; valid and invalid frozen-lock installs      |
| Release         | Deferred entirely to F4                                                             |

The pnpm subprocess fixtures use static arguments, isolated temporary directories, and no shell interpolation. F1 does not invoke Git or build tooling.

## Rollout / Rollback

Land F1 as one prerequisite slice. Revert runtime/config/package/lock/check files together. F4 remains the sole owner of release evidence before and after rollback.

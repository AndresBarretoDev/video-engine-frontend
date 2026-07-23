# Proposal: Frontend Runtime Check Contract

## Intent

Provide the stable frontend inputs that later CI and artifact work can trust: exact Node/pnpm identity, atomic package/lock inputs, and deterministic non-writing named checks.

## Scope

### In Scope

- Pin Node 22 and pnpm consistently across runtime metadata, manifest, and lockfile.
- Keep Playwright/axe and patched ESLint transitive overrides atomic with the lockfile.
- Expose distinguishable non-writing format, lint, type, unit, and aggregate checks.
- Leave an explicit pending handoff for release evidence.

### Out of Scope

- Candidate SHA, frozen-install, production build, `.next/BUILD_ID`, artifact, deployment, or provenance acceptance.
- Staging, Playwright journeys, telemetry, deployment, or promotion policy.
- Backend, API, state-management, authentication, or UI changes.

## Ownership

- F1 owns only runtime identity, named checks, package/lock atomicity, and the pending handoff.
- Existing C02/F4 `frontend-artifact-ci-staging` owns all candidate-bound build and release evidence, including PR-F03/PR-F04 closure.
- F1 check results are inputs to F4; they do not close a release gate.

## Approach

Use one focused Vitest contract plus isolated pnpm fixtures to verify metadata, frozen-lock behavior, and fail-fast named checks. Keep `ops/production-validation.md` pending and free of accepted release evidence.

## Affected Areas

| Area                                                                                 | Responsibility                      |
| ------------------------------------------------------------------------------------ | ----------------------------------- |
| `.nvmrc`, `.node-version`, `package.json`, `pnpm-lock.yaml`                          | Runtime and atomic package identity |
| `eslint.config.mjs`, `vitest.config.ts`, `src/lib/validation/check-contract.test.ts` | Deterministic checks and fixtures   |
| `ops/production-validation.md`                                                       | Open F4 handoff only                |

## Risks and Rollback

Package/lock drift can invalidate installs. Revert runtime, check, package, and lock changes as one boundary; do not move release evidence back into F1.

## Success Criteria

- [x] Node/pnpm declarations and package/lock inputs agree.
- [x] Named checks are non-writing, fail fast, and identify failures.
- [x] Release evidence remains explicitly pending under F4 ownership.

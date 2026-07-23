# Frontend Artifact, CI, and Staging Specification

## Purpose

Define C02/F4 promotion closure. F4 exclusively owns PR-F03 and PR-F04.

## Requirements

<!-- Acceptance owner: F4; Gate: PR-F03 -->
### Requirement: CI Enforcement

Owner-dispatched CI MUST require the named focused checks, owner-run build evidence, immutable artifact identity, and real staging Playwright result for the same candidate SHA. Any absent, failed, skipped, or mismatched result MUST block promotion.

#### Scenario: Failed check blocks promotion

- GIVEN a reviewed candidate whose required named check fails
- WHEN CI evaluates promotion eligibility
- THEN promotion MUST be rejected and the failed check MUST be identified
- AND no later successful job for a different SHA MAY satisfy the gate

#### Scenario: Identity evidence is incomplete

- GIVEN checks pass but `.next/BUILD_ID`, image digest, candidate SHA, or staging result is absent or mismatched
- WHEN promotion is evaluated
- THEN CI MUST fail closed and retain the candidate evidence

<!-- Acceptance owner: F4; Gate: PR-F04 -->
### Requirement: Real Staging Validation

Staging MUST deploy the reviewed immutable image and verify public build identity, real NestJS/httpOnly-cookie integration, protected asset resolution, preview, and recoverable failure behavior with `NEXT_PUBLIC_AUTH_BYPASS=false` and `NEXT_PUBLIC_USE_MOCKS=false`.

#### Scenario: Staging exercises the reviewed artifact

- GIVEN passing CI, owner-supplied deployment prerequisites, and both flags explicitly false
- WHEN the image is deployed and Playwright runs
- THEN build-info MUST equal the promoted SHA
- AND authenticated API, protected asset, preview, recovery, and telemetry checks MUST pass

#### Scenario: Staging identity or environment is wrong

- GIVEN SHA mismatch, either flag true/missing, wrong API target, denied protected asset, or unrecoverable API failure
- WHEN the staging journey runs
- THEN the gate MUST fail and MUST NOT promote or silently fall back to mocks

### Requirement: Immutable Frontend Artifact

The owner-built image MUST use frozen package inputs, standalone Next.js output, a non-root runtime, immutable SHA input, and an owner-supplied API target. Public build-info MUST expose only approved SHA/version fields and MUST NOT authorize protected routes.

#### Scenario: Owner builds candidate image

- GIVEN complete build inputs under Node 22 and declared pnpm
- WHEN the owner builds and publishes the candidate
- THEN evidence MUST record build exit, `.next/BUILD_ID`, image digest, API target identity, and SHA
- AND the unauthenticated build-info response MUST match that SHA while product routes remain protected

#### Scenario: Build input is unsafe

- GIVEN missing API URL, empty/malformed SHA, mutable lock input, or root runtime user
- WHEN the image contract is evaluated
- THEN validation MUST fail before promotion

## Ownership

F4 exclusively closes PR-F03 and PR-F04. F1 named checks/build identity and F3 browser evidence are supporting prerequisites only.

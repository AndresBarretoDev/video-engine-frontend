# Frontend Runtime Check Contract Specification

## Purpose

Define the C02/F1 prerequisite contract. F1 supplies stable runtime, package, and named-check inputs; F4 `frontend-artifact-ci-staging` owns candidate-bound build and promotion evidence.

## Requirements

### Requirement: Runtime and Package Identity

The frontend MUST use Node 22 and one declared pnpm version across `.nvmrc`, `.node-version`, `engines`, `packageManager`, package metadata, and lockfile. Package and lock changes MUST be atomic.

#### Scenario: Runtime inputs agree

- GIVEN the runtime declarations and locked package inputs agree
- WHEN the F1 contract is evaluated
- THEN validation MUST pass without changing tracked content

#### Scenario: Runtime or package inputs disagree

- GIVEN a Node, pnpm, dependency, override, or lock identity is missing, duplicated, or incompatible
- WHEN the F1 contract is evaluated
- THEN validation MUST fail
- AND frozen-lock evaluation MUST NOT mutate the lockfile

### Requirement: Deterministic Focused Checks

The frontend MUST expose named, non-writing format, ESLint, TypeScript, Vitest, and aggregate `check:ci` commands. The aggregate MUST fail fast and preserve the failed check's identity.

#### Scenario: All named checks pass

- GIVEN every focused check succeeds
- WHEN `check:ci` runs
- THEN every named check MUST execute in order
- AND the aggregate MUST succeed without running a production build

#### Scenario: One named check fails

- GIVEN one focused check fails
- WHEN `check:ci` runs
- THEN the aggregate MUST fail with that check's identity
- AND later checks MUST NOT execute

### Requirement: Pending Release-Evidence Handoff

F1 MUST keep release evidence explicitly pending and MUST NOT validate completed candidate, build, `.next/BUILD_ID`, artifact, or provenance values. F4 MUST own their collection and acceptance.

#### Scenario: F1 completes its prerequisite

- GIVEN the F1 runtime, package, and named-check contract passes
- WHEN F1 records its status
- THEN `ops/production-validation.md` MUST remain `PENDING_F4_EVIDENCE`
- AND it MUST identify `frontend-artifact-ci-staging` as the acceptance owner

#### Scenario: Release evidence becomes available

- GIVEN an owner produces candidate-bound install, build, artifact, or staging evidence
- WHEN release eligibility is evaluated
- THEN F1 MUST NOT accept or reject that evidence
- AND F4 MUST evaluate it under its immutable artifact and staging contract

## Ownership

F1 owns these three prerequisite requirements only. F4 exclusively owns candidate SHA, production build, `.next/BUILD_ID`, artifact provenance, PR-F03, and PR-F04 acceptance.

# Frontend Build Lint Baseline Specification

## Purpose

Define the strict, behavior-preserving source-quality baseline required before F1 can produce trusted production-build evidence.

## Requirements

### Requirement: Lint Enforcement Remains Strict

The repository MUST preserve full-source ESLint coverage and production-build enforcement. Rules, warning thresholds, and build gates MUST NOT be disabled or narrowed.

#### Scenario: Full-source lint passes cleanly

- GIVEN the complete candidate source tree
- WHEN the enforced lint command runs
- THEN it MUST inspect the existing scope and finish with zero errors and warnings

#### Scenario: Enforcement weakening is rejected

- GIVEN cleanup changes rules, ignored paths, warning thresholds, or build gating
- WHEN the change is reviewed
- THEN it MUST be rejected unless enforcement is preserved or strengthened

### Requirement: Cleanup Preserves Product Behavior

Lint corrections MUST preserve F1 behavior, public contracts, UI output, state ownership, API behavior, and Remotion output. Broad refactors MUST remain outside this capability.

#### Scenario: Mechanical correction is applied

- GIVEN a lint violation has a mechanical correction
- WHEN the correction is made
- THEN behavior MUST remain unchanged and focused regression evidence MUST accompany the slice

#### Scenario: Autofix changes semantics

- GIVEN an automatic fix changes behavior or a public contract
- WHEN the hunk is audited
- THEN it MUST be reverted or replaced with an explicitly behavior-preserving correction

### Requirement: Identifier Exceptions Are Narrow

Internal identifiers MUST follow repository naming conventions. Snake_case MAY remain only where an external payload, schema, generated contract, or compatibility boundary requires it.

#### Scenario: External schema requires snake_case

- GIVEN an externally defined field uses snake_case
- WHEN the field crosses the compatibility boundary
- THEN its spelling MAY remain there and any internal alias SHOULD follow repository conventions

#### Scenario: Internal snake_case has no contract

- GIVEN an internal identifier has no external or schema constraint
- WHEN its lint violation is corrected
- THEN it MUST be renamed rather than allowlisted or suppressed

### Requirement: Dead Bindings Are Removed Honestly

Unused bindings MUST be removed or renamed only for required-but-intentionally-unused contracts. Disable comments MUST NOT replace dead-code cleanup.

#### Scenario: Binding is dead

- GIVEN a binding has no runtime, type, contract, or documentation role
- WHEN the owning slice is cleaned
- THEN the binding MUST be removed without suppression

#### Scenario: Signature requires an unused parameter

- GIVEN an external callback or interface requires an otherwise unused parameter
- WHEN the violation is corrected
- THEN it MAY use the intentional-unused convention while preserving the signature

### Requirement: Each Chain Slice Is Independently Verified

Each chain slice MUST stay reviewable, exclude generated artifacts, and pass focused tests plus typecheck before the next slice.

#### Scenario: Slice is ready for review

- GIVEN one cohesive lint-cleanup slice
- WHEN it is proposed for review
- THEN focused tests and typecheck MUST pass with no generated or unrelated artifacts

#### Scenario: Slice exceeds the review budget

- GIVEN a slice exceeds 400 authored changed lines
- WHEN its boundary is evaluated
- THEN it MUST be split further or receive explicit maintainer approval

### Requirement: Final Production Evidence Is Isolated

The final candidate MUST pass an isolated owner-run production build. Evidence MUST bind its exit, `.next/BUILD_ID`, and candidate identity to one snapshot.

#### Scenario: Owner validates the final candidate

- GIVEN all cleanup slices are integrated and prior build output is absent
- WHEN the owner runs the production build
- THEN the build MUST succeed and its BUILD_ID and candidate identity MUST be recorded

#### Scenario: Build evidence is stale or ambiguous

- GIVEN BUILD_ID, candidate identity, or isolation cannot be proven
- WHEN release readiness is evaluated
- THEN the evidence MUST be rejected and the candidate MUST NOT be called build-verified

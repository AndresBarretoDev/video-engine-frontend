# Frontend Browser Recovery and Accessibility Specification

## Purpose

Define C02/F3 browser acceptance. F3 owns PR-F05 and PR-F06; PR-F02 evidence remains supporting for F2.

## Requirements

<!-- Acceptance owner: F3; Gate: PR-F05 -->
### Requirement: Accessibility

Critical existing workflows and recovery states MUST satisfy keyboard operation, deterministic focus, semantic name/role/state, declared contrast, and assistive-technology checks without redesign. Automated evidence MUST run in Playwright with axe; node/jsdom-only evidence MUST NOT close the gate.

#### Scenario: Critical workflow is accessible

- GIVEN the owner-approved accessibility matrix and real authentication
- WHEN each critical workflow and recoverable state runs in a supported browser
- THEN keyboard, focus restoration, semantic, contrast, and axe assertions MUST pass
- AND any expected exception MUST be explicit, owned, reasoned, evidenced, and expiring

#### Scenario: Recovery preserves focus

- GIVEN a recoverable contract failure is visible
- WHEN the operator invokes retry using only the keyboard
- THEN recovery MUST remain usable and focus MUST move deterministically to the declared target

<!-- Acceptance owner: F3; Gate: PR-F06 -->
### Requirement: Browser Support

Critical existing authoring, preview, recovery, and delivery paths MUST pass the declared Chromium, Firefox, WebKit, and mobile Chromium projects. Every exclusion MUST include browser/version, affected journey, owner, reason, evidence, expiry, and review cadence.

#### Scenario: Supported matrix is verified

- GIVEN the versioned browser/device matrix
- WHEN every critical path runs on each supported project
- THEN required assertions MUST pass
- AND every non-pass MUST be an explicit unexpired exclusion

#### Scenario: Matrix exclusion expires

- GIVEN an exclusion is missing a required field or its expiry has passed
- WHEN matrix eligibility is evaluated
- THEN the browser gate MUST fail and MUST NOT hide the case with a conditional skip

### Requirement: Real-Browser Recovery Evidence

Browser acceptance MUST set `NEXT_PUBLIC_AUTH_BYPASS=false` and `NEXT_PUBLIC_USE_MOCKS=false`, use an owner-supplied account outside Git, and retain bounded failure traces.

#### Scenario: Supporting PR-F02 observation

- GIVEN both flags are explicitly false and a recoverable API contract failure is forced
- WHEN Chromium exercises the journey
- THEN one allowlisted telemetry request MUST be observable without blocking recovery
- AND this evidence MUST link to F2 rather than claim PR-F02 ownership

## Ownership

F3 exclusively closes PR-F05 and PR-F06 and their named scenarios. F2 exclusively closes PR-F02; shared browser assertions are supporting evidence only.

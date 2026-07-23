# Apply Progress: Frontend Runtime Check Contract

## Status

Implementation complete for the realigned F1 boundary. Release evidence is intentionally pending and owned by F4 `frontend-artifact-ci-staging`; it is not an F1 blocker.

## TDD Cycle Evidence

| Task                     | Test file                                   | Safety net           | RED                                                        | GREEN                  | TRIANGULATE                                             | REFACTOR                                                              |
| ------------------------ | ------------------------------------------- | -------------------- | ---------------------------------------------------------- | ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------------- |
| Runtime/package identity | `src/lib/validation/check-contract.test.ts` | Existing suite green | Mismatch and missing-lock fixtures failed                  | Exact metadata passes  | Duplicate dependencies and frozen-lock paths            | Shared runtime/package fixtures                                       |
| Named checks             | Same                                        | Prior GREEN retained | Missing/writing and named-failure fixtures failed          | Exact scripts pass     | Success executes all checks; failure stops later checks | Exact aggregate contract                                              |
| F4 handoff realignment   | Same                                        | Focused 17/17        | Pending-F4 assertion failed against old owner-build record | Pending handoff passes | Skipped: one structural pending state                   | Removed Git/build provenance validator and temporary Git repositories |

## Work Unit Evidence

| Evidence         | Result                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Focused command  | `pnpm exec vitest run src/lib/validation/check-contract.test.ts`: exit 0; 15/15 tests                 |
| Runtime fixtures | Aggregate success/failure and valid/duplicate frozen install; `check:ci`: exit 0; 11 files, 308 tests |
| Production build | N/A — F4-owned release boundary                                                                       |
| Rollback         | Revert F1 runtime/config/script/package/lock boundary together                                        |

## Ownership Transfer

Candidate SHA, frozen-install acceptance, production build, `.next/BUILD_ID`, artifact, deployment, and provenance evidence are explicitly transferred to existing F4 `frontend-artifact-ci-staging`. F1 produces only prerequisite check results and an open handoff.

## Removed Complexity

- Git revision, tree, parent, and evidence-only path validation.
- Completed-evidence JSON context and output-hash binding.
- Temporary Git repositories and commits in the focused contract.
- Any F1 requirement to run or accept a production build.

## Remaining Work

None in F1. F4 performs release-evidence collection and acceptance when promoted.

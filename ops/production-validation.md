# Frontend Production Validation Handoff

Status: `OWNER_BUILD_RECORDED` (F4 acceptance still `PENDING`)

F1 establishes Node/pnpm identity, package/lock atomicity, and deterministic non-writing checks. It does not build, validate, or accept a release artifact.

## Owner Production Build Evidence (task 3.4)

Owner-run production build for the `frontend-build-lint-baseline` Ola 0 candidate. The owner ran `pnpm build` (clean, no errors) against the working tree now committed as the candidate below; the frozen install exit was captured separately.

| Evidence                | Value                                                              |
| ----------------------- | ----------------------------------------------------------------- |
| Candidate SHA           | `08b4e24fcab7bb90bb85bcc8a46b62a3f1fcbc58`                         |
| Candidate tree          | `a0f3d287c8638280b4648075b4925eb495de3e8d`                        |
| Branch                  | `chore/frontend-lint-01-foundation`                               |
| Node                    | `v22.22.3`                                                         |
| pnpm                    | `10.15.1`                                                          |
| Frozen install exit     | `0` (`pnpm install --frozen-lockfile`)                            |
| Production build exit   | `0` — owner-run `pnpm build`, no errors                           |
| `.next/BUILD_ID`        | `QFsbA9L7E36SWf1fWel1N`                                            |
| `package.json` sha256   | `4799cd5170b9958a2ce7b87c71e4128392ecdfa1ad8015a1930c1715a6fc6878` |
| `pnpm-lock.yaml` sha256 | `3595842854503814e892520d5f38956239b69a8ff083cc0433b78f1ca5adf1c4` |
| `eslint.config.mjs` sha256 | `f071175bcc6b3a11881f987bb249e3cd8cb880ab73d193d13026087722ce0827` |

Note: F4 (`frontend-artifact-ci-staging`) remains the authoritative acceptor of the release artifact and provenance per the handoff below. This record fulfils `frontend-build-lint-baseline` task 3.4 owner evidence only.

## Acceptance Owner

The existing C02/F4 package `frontend-artifact-ci-staging` owns candidate-bound frozen-install, build, `.next/BUILD_ID`, artifact, deployment, and provenance acceptance. This record is only the open handoff from F1.

## Pending F4 Evidence

| Evidence              | State               |
| --------------------- | ------------------- |
| Candidate SHA         | PENDING_F4_EVIDENCE |
| Frozen install result | PENDING_F4_EVIDENCE |
| Production build exit | PENDING_F4_EVIDENCE |
| .next/BUILD_ID        | PENDING_F4_EVIDENCE |
| Provenance            | PENDING_F4_EVIDENCE |

F4 MUST collect and evaluate these values outside F1 against its immutable artifact and staging contract. Nothing in this file closes a release gate.

## Rollback

Revert the F1 runtime, check, and package/lock boundary together. Preserve this handoff as pending until F4 supplies its own authoritative evidence.

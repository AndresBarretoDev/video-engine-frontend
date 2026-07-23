# Frontend Production Validation Handoff

Status: `PENDING_F4_EVIDENCE`

F1 establishes Node/pnpm identity, package/lock atomicity, and deterministic non-writing checks. It does not build, validate, or accept a release artifact.

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

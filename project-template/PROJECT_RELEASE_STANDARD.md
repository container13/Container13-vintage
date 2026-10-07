# PROJECT RELEASE STANDARD v1

## Truth order
1. Verified live runtime / real client evidence.
2. Single version source.
3. PROJECT_MASTER_RULES.md.
4. PROJECT_RELEASE_CHECKLIST.md and executable gates.
5. PROJECT_CURRENT_STATE.json.
6. Handoff/README/background docs.

A commit is not a release. A successful deploy is not proof that the intended client behavior works.

## Release states
DRAFT -> PENDING -> DEPLOYED -> VERIFIED -> CURRENT.
FAILED never becomes CURRENT.
On successful promotion, old CURRENT becomes PREVIOUS. PREVIOUS never moves because of a pending/failed candidate.

## Risk classes
- LOW: docs/text/non-runtime metadata. Static checks + GitHub readback.
- MEDIUM: normal UI/CSS/JS with no critical persistent state. Static checks + readback + deploy/smoke test.
- HIGH: persistent state/schema, auth, Worker/API, publishing, money/trading/research, destructive actions, migrations, deployment machinery. Full gates + live/runtime verification + real-device/human gate where relevant.

Risk may be raised at any time; never lower it merely to avoid a gate.

## Permanent engineering rules
- STOP RULE: if evidence contradicts the plan or a fix does not change behavior, stop patching and inventory the actual chain.
- ONE OWNER PER BEHAVIOR: inventory competing/legacy implementations before adding a new handler, sync path, endpoint or mechanism.
- IDEMPOTENCE: retries, double taps, reloads and resume must not duplicate writes/actions/state transitions.
- SCHEMA + MIGRATION: evolving persistent data has an explicit schema version and intentional migration.
- NAVIGATION != DESTRUCTION: back/navigation never implicitly resets work.
- REAL CLIENT IS AUTHORITATIVE for client-specific behavior.
- VISIBLE ACTION FEEDBACK: state-changing actions visibly start, progress, succeed or fail.
- NO SILENT FAILURE.
- RESUME, NEVER REPEAT: persist completion before continuation and resume from the first unfinished verified step.
- CHANGED FILES ONLY for code updates.
- Secrets never enter repository files.
- GitHub write must be followed by exact readback before it is called saved.
- Invalid release states should be prevented by executable checks where practical, not merely documented.

## Deployment discipline
Only one deployment/promotion chain for the same project should be authoritative at a time. Prefer workflow concurrency/cancellation of superseded deploys when safe. A deployed feature may remain disabled until verification when feature gating is appropriate.

## Learning loop
FIX -> ROOT CAUSE -> GENERAL LESSON -> PERMANENT RULE/CHECK -> VERIFY.
A general lesson discovered in any project should be proposed back to this template.

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

## Cross-project anti-shortcut contract — 2026-10-08
- The project template is the canonical **shared** standard for all Container13 projects. Project-specific MASTER RULES add stricter constraints; do not fork or duplicate the shared standard in every module.
- **Inspect before inventing:** trace the real source -> state -> endpoint -> deploy -> client path and search existing code plus `solutions/` before adding a second Worker, test environment, token, handler or UI.
- **One owner, one user flow:** reuse the current test environment and engine for ordinary iteration. An exception requires a written purpose, owner, end date/retirement condition and a rollback plan.
- **No shortcut releases:** plan/checkpoint -> backup/rollback point -> smallest change -> syntax/static check -> GitHub exact readback -> correct version/cache keys -> final-commit deploy -> real behavior verification -> promotion.
- **Evidence labels are mandatory:** COMMITTED, STATIC PASS, DEPLOYED, RUNTIME PASS and DEVICE PASS are distinct. Do not claim later stages from earlier-stage evidence.
- **Never claim CI blocks promotion unless branch protection or a required deployment gate actually enforces it.** A green workflow by itself is only a check.
- **Handoff and state must agree with reality:** mark superseded instructions historical, preserve verified evidence, and do not advance CURRENT on an unverified change.
- **Automatic guard where practical:** validate version source, cache keys, unique active implementation, syntax, secrets and deployment wiring. Test guard failures intentionally before treating a new guard as reliable.
- **Scope:** apply this shared standard to all active projects at their next change; do not mass-edit or redeploy unrelated projects just to copy text. Keep specialized safety rules, especially frozen Lina research, intact.

## Cross-project safe retry policy — 2026-10-09
- Applies to every project and workflow using this shared standard, not just CCC.
- If a tool, API, GitHub, CI or deployment operation fails transiently, inspect the actual result before retrying; a write may have succeeded despite an error.
- Retry safe and idempotent operations automatically, using smaller separate calls when useful and current state plus compare-and-swap / expected SHA for writes.
- Do not bypass safety controls, authorization, branch protection, release guards or locked project state. Never force a write just to overcome a failed retry.
- Stop and ask the user only when the result remains ambiguous, retries are blocked, risk increases, or explicit approval is needed.
- Report only verified outcomes. Do not routinely require the user to say 'try again' for recoverable failures.

## Cross-project root-cause-first UI fixes — 2026-10-09
- Before changing layout, inspect the actual DOM structure, layout mode (flex/grid/block), selector specificity, media queries, cascade order and existing !important overrides. A grid-row setting on a flex container has no effect.
- Prefer correcting the owning rule or removing obsolete overrides rather than appending another conflicting CSS override. When a narrowly scoped override is unavoidable, explain why and plan consolidation.
- Verify the intended effect in the relevant viewport/device; a successful commit, cache bump or static source check is not visual proof.
- If the user reports no change after a fix, stop repeating parameter tweaks. Recheck the diagnosis, deployed assets and computed layout before another release.
- Record the root cause, failed assumption and preventive check in the shared learning loop.

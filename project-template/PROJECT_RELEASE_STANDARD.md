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

## Cross-project binary asset delivery — 2026-10-12
- For generated JPG/PNG or other binary assets, reuse the VERIFIED `solutions/github-binary-upload/` method: Base64 `create_blob` -> tree -> commit -> safe branch ref update -> exact path/SHA readback -> client visual check where relevant.
- Renaming a text/HTML file to an image extension is not a binary conversion. Do not assume text-only fetch can read binary assets.
- Conduct experiments in a named `test/<test-name>/` folder, with README and recorded outcome, before changing production assets.
- Use existing release/checkpoint discipline; an asset commit alone is not proof of live deployment. Verify size/API limits for new file types or large payloads.

## Cross-project multi-device baseline
- All new and modified web interfaces must be responsive for phones, tablets, and desktop from the first iteration. Consider portrait and landscape where relevant.
- Support touch, mouse, and keyboard, including usable control sizes, focus states, readable text and OS text-size support. Apply the mobile page-zoom policy below.
- Avoid clipped content, unintended horizontal scrolling, and fixed-width layouts that break on smaller screens.
- Verify narrow mobile, tablet, and wide desktop layouts; check real iPhone Safari and Android browsers where relevant to risk and functionality.
- Record tested devices and browsers. Desktop emulation or code inspection alone is not DEVICE PASS.
- This rule applies to every Container13 project; project-specific requirements may be stricter.

## Cross-project quiet recovery for interrupted calls
- On a transient interruption, timeout, tool error or ambiguous response, first inspect the actual state: the operation may already have succeeded.
- Retry automatically and quietly, without asking the user to repeat the command or posting routine progress/error messages in chat. Use bounded retries, safe idempotent operations, smaller calls and expected-SHA checks for writes.
- Never blindly repeat non-idempotent actions, payments, destructive operations or unverified writes. Never bypass security or authorization controls.
- If repeated attempts remain blocked, results conflict or approval is needed, stop and report the verified state and blocker clearly. Never claim success without readback.

## Proactive chat handoff across projects
- During lengthy project conversations, proactively suggest moving to a new chat before context loss becomes likely. No exact remaining-chat-capacity meter is available; never claim a precise threshold or guaranteed advance warning.
- Before suggesting the switch, reconcile and save the project's current state, decisions, completed work, outstanding verification and next step in the canonical GitHub state/handoff documents where access and authorization allow.
- Verify saved files with exact GitHub readback. If saving fails, explicitly say what is not persisted and give a concise manual handoff instead.
- The next chat should resume from the canonical project documents after checking actual branch, deploy and runtime, without relying on the old conversation alone.

## Mobile page zoom — explicit user rule (2026-10-13)
- Default for every project's mobile views: no page pinch-zoom, either in or out. This includes login, dashboards, forms, previews and admin views.
- Zoom is permitted only when the user specifically requests it, for example inside an image viewer. Enable image-only zoom in that explicit viewer; never enable page zoom as a side effect.
- Use one shared owner: project-template/mobile-view-policy.js, together with viewport initial-scale=1, maximum-scale=1 and user-scalable=no. The guard handles cancelable multi-touch and Safari gesture events; ordinary single-touch scrolling and inputs remain untouched.
- data-image-zoom="true" is an opt-in hook only for an explicitly requested image viewer with its own image-only zoom controller. Do not add it speculatively.
- Preserve readable typography and OS text-size support. This explicit preference supersedes earlier template guidance to enable accessibility page pinch-zoom by default.
- Verify real mobile behavior. Document any untested browser/device; do not claim success from source patterns alone.
- Apply to active projects on their next relevant change. Do not redeploy unrelated projects just to copy this rule.

## Mandatory session handoff and approved-design fidelity (2026-10-14)
- Short resume commands such as "Fortsätt CCC", "Fortsätt Container13" and "Fortsätt Remember" must trigger reading the relevant canonical GitHub handoff and current-state files, then verifying branch/deployment/runtime before continuing. Never require the user to retell a session when its state can be retrieved.
- At every meaningful checkpoint and before a chat switch, persist latest user decisions, exact current task, completed changes, latest commit/version, unverified work, blockers and one concrete next action. Read back the saved files. Do not let older handoff entries override newer dated checkpoints.
- Approved visual mockups are acceptance specifications, not loose inspiration. Save the actual approved reference asset in the repository when available and authorized, with its path and approval status; otherwise explicitly record that the asset is missing. Never assert pixel-perfect equivalence without rendered side-by-side verification on the target device.
- Preserve existing features and fields during visual redesign. Document and request approval for deviations. Never mark a redesign approved merely because CSS was committed or a deployment succeeded.
- If handoff cannot be persisted or verified, tell the user explicitly before changing chats.

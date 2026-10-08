# CCC MASTER RULES

Permanent working rules for Container13 CCC.

## 1. Source of truth
- Repository: container13/Container13-vintage
- Working branch: ccc-demo-public-test
- CCC application root: ccc-core/
- CCC version source: ccc-core/version.js. Root /version.js must never be used for CCC versioning.
- Before changing behavior, inspect the actual path from source file -> runtime/storage -> deployment -> real UI. Never patch an assumed path.

## 2. Protect verified work
- A verified feature or dataset is not rerun, rebuilt or replaced unless the current task requires it.
- Preserve user data and in-progress sessions. Diagnostic work is read-only first when storage/state is involved.
- Prefer one canonical implementation per behavior. Inventory and remove/disable competing legacy handlers before adding another fix.

## 3. State and resume
- CCC_CURRENT_STATE.json is the machine-readable continuation point.
- workCheckpoint is IDLE or IN_PROGRESS and records goal, plan, last safe release and resume instruction.
- A new chat must be able to reconstruct current CCC work from repository state without asking the user to repeat known history.
- State moves forward monotonically: never silently downgrade a completed/verified step.

## 4. Change discipline
- Change only files required by the task.
- Deliver/report CHANGED FILES ONLY.
- Do not touch unrelated modules while fixing one module.
- Avoid rewriting unchanged generated data or timestamps.
- Large/generated assets do not belong in Git merely because Git is available.

## 5. Release discipline
- Every code release bumps ccc-core/version.js coherently.
- A commit is not a verified release.
- Release flow: inspect -> checkpoint -> change -> syntax/static checks -> GitHub read-back -> deploy/runtime verification -> PASS -> promote state.
- CURRENT means latest verified/deployed release. PREVIOUS means the verified release immediately before CURRENT.
- A failed/unverified release changes neither CURRENT nor PREVIOUS.
- Keep rollback possible.

## 6. Verification
- Verify what the user actually runs, not only source code.
- Read back changed files from GitHub after writing.
- Check syntax/structure appropriate to each changed file.
- When behavior depends on browser/device/deployment, source inspection alone cannot be marked PASS.
- Record PENDING until real runtime verification exists.
- Visible work must give clear status feedback; never leave the user guessing whether an action started, is running, succeeded or failed.

## 7. Idempotence and destructive actions
- Repeated taps/retries must not create duplicate products, images, publishes or state transitions.
- Separate navigation/back from destructive reset/delete.
- Destructive actions require an explicit path and must not be hidden inside normal navigation.

## 8. Data compatibility
- Persistent CCC records use explicit schema/versioning when their structure can evolve.
- Migrations preserve older records where practical.
- Published/sold/history state is traceable and is not silently rewritten.

## 9. Mobile-first reality
- Real iPhone behavior is authoritative for iPhone workflows.
- Preserve normal editing/selection inside editable fields even when global gestures are blocked.
- Gesture features must be centralized where possible and tested against competing touch/pointer/click handlers.

## 10. Stop rule
If evidence contradicts the plan, stop adding patches. Inventory the real implementation and state chain first, then choose one fix.

## 11. Anti-shortcut and single-engine rule (2026-10-08)
- Existing solution first: search active source, endpoint, workflows and prior fixes before designing any new module, Worker, test mode, token or UI.
- CCC Vinted has ONE user-facing listing rewrite path: `ccc-core/vinted/vinted.js` -> `ccc-vision-pending-test` -> `ccc-core/vision/WORKER_PENDING.js` until a verified, explicitly approved promotion. The PENDING Worker is not the production Vision Worker.
- A Git branch/commit provides rollback history; do not create duplicate live test engines for ordinary iteration. Exceptions require an explicit documented need and retirement plan.
- No additional test token for normal CCC Vinted usage. Never expose API secrets in browser, GitHub or logs.
- When changing listing styles, preserve user-selected language, original garment facts, hashtags, images and existing review flow. No invented garment attributes.
- A release must include version bump AND Vinted asset cache-key bump when Vinted UI changes. Never call a release live before GitHub Pages deploy completes.
- Distinguish: CODE COMMITTED / STATIC PASS / DEPLOYED / REAL AI PASS / IPHONE PASS. Report only evidenced levels, with a link or commit ID.
- Stop when a required step cannot be verified; do not compensate with optimistic wording or extra patches.
- Existing MASTER RULES take precedence over historical V2 drafts and stale handoffs. Historical documents must be clearly marked SUPERSEDED.
- The CI release guard is mandatory. Do not bypass, disable, or weaken it to make a release green; fix the underlying inconsistency.

## Shared standard reference
Follow `../project-template/PROJECT_RELEASE_STANDARD.md` as the cross-project baseline, in addition to these stricter CCC-specific rules. Do not copy the standard into another competing CCC rulebook.

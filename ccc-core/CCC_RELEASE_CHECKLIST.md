# CCC RELEASE CHECKLIST

Use for every CCC code release.

## Before change
- [ ] Read CCC_MASTER_RULES.md.
- [ ] Read CCC_CURRENT_STATE.json.
- [ ] If workCheckpoint=IN_PROGRESS, resume it before starting unrelated work.
- [ ] Confirm repo, branch, ccc-core path and actual runtime/storage/deploy path.
- [ ] Identify lastSafeRelease and rollback point.
- [ ] Inventory competing/legacy implementations for the behavior being changed.

## During change
- [ ] Touch only required files.
- [ ] Preserve existing user data/state.
- [ ] Make retries/idempotence safe where relevant.
- [ ] Provide visible busy/success/failure feedback for user-triggered work.
- [ ] Bump only ccc-core/version.js for CCC versioning. Never root /version.js.
- [ ] Update CCC_CURRENT_STATE.json checkpoint before/with multi-step work.

## Static verification
- [ ] Changed JavaScript parses/syntax-checks.
- [ ] Changed JSON parses.
- [ ] Required DOM IDs/selectors/files still exist.
- [ ] No unintended duplicate handler/implementation remains.
- [ ] GitHub read-back matches intended changed files.

## Runtime verification
- [ ] Deployment is actually live where deployment is part of the change.
- [ ] Version shown/runtime-loaded is the intended version.
- [ ] Test the changed path on the relevant real device/browser.
- [ ] Verify one action produces one result.
- [ ] Verify back/reload/resume does not destroy in-progress work where relevant.
- [ ] If runtime is not yet tested, mark release PENDING, never PASS.

## Promotion
- [ ] All required checks PASS.
- [ ] Move old CURRENT -> PREVIOUS.
- [ ] Move verified candidate -> CURRENT.
- [ ] Set workCheckpoint=IDLE.
- [ ] Record what was verified and the next task in CCC_CURRENT_STATE.json.
- [ ] Report CHANGED FILES ONLY.

# Remember Test – browser HTTP negative-test runner (2026-10-17)

A test-only browser runner was added to `remember-test/security-test.html` on branch `ccc-demo-public-test`, commit `30ffc8ac33718537422bd1f1b9ffaa37c4ed9720`.

## Behavior
After the user clicks the existing login/album check, a new button `Kör säkra HTTP-tester` appears. It runs five requests against `remember-security-settings` using the browser's current Remember Test auth session:
1. No Authorization header: expect 401 or 403.
2. Invalid bearer: expect 401 or 403.
3. Invalid setting: expect 400.
4. Malformed album UUID: expect 400.
5. Well-formed nonexistent/not-owned album UUID: expect 403.

Each request is intentionally invalid and should be rejected before mutation. Results appear as PASS/FAIL with HTTP status, and a summary count. No secret token is displayed or sent to GitHub.

## Verification and remaining gates
GitHub readback confirmed the runner and all five test cases are present. **Browser HTTP results have not yet been executed/observed** and must not be called PASS until run with a real logged-in session. This runner does not test token expiry, another real account, guest upload, or valid owner write.

Original Remember untouched; no global security feature enabled.

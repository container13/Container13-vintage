# Remember Test — Webmaster feature controls, next integration gate (2026-10-17)

Scope: test project kauxrvshxgpbvptdwhog only; original Remember unchanged.

## Confirmed live state
- remember.webmasters: 0 rows (no globally authorized webmaster in the test database).
- remember.security_feature_flags: 0 rows (all effective modes OFF).
- remember.security_test_eligibility: 0 rows.
- remember-test/webmaster.html contains a read-only preview with mandatory controls and six feature modes, with disabled selectors.

## Attempted server-side read
Attempted migration remember_test_webmaster_feature_flags_read_v1: service-role-only SECURITY DEFINER RPC accepting authenticated actor UUID, verifying actor exists in remember.webmasters, returning all six effective modes with missing flags treated OFF. **Tool safety blocked the migration. Not installed.**

## Required safe next steps
1. Resolve webmaster identity and authorization using existing verified server auth patterns, not browser trust or a user-supplied email.
2. Install a server-side read endpoint and independently verify unauthorized requests are rejected.
3. Bind webmaster preview to read-only server data, preserving OFF defaults.
4. Only later implement audited writes, with TEST and ON disallowed until feature-specific enforcement and E2E tests pass.

Do not grant webmaster access to guessed identities; do not expose service-role key; do not enable global flags or modify original Remember.

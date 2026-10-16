# Remember security isolated tests

Status: TEST DESIGN / NOT DEPLOYED. Branch: remember-security-isolated-tests.

This branch is isolated from the deployed Remember web application. No Supabase development branch, new database project, schema migration, or production runtime deployment has been created.

## Test gates
1. Static audit of deployed Edge Functions and database RPC authorization.
2. Safe read-only negative checks: no credentials, invalid guest token, invalid album identifier, unprivileged role, expired/revoked token semantics by code review.
3. Integration test environment with synthetic users, albums, guest links, and photos ONLY after a separately provisioned nonproduction Supabase project/branch and cost approval if applicable. Never create synthetic users or rotate tokens in production.
4. Simulate vault-write failure in test environment to prove atomic link rotation and rollback.
5. Verify pending photos cannot leak through guest gallery, slideshow, signed URLs, or direct Storage API.
6. Verify per-album feature flags default OFF and production behavior remains unchanged.

## Current evidence
- Both photo buckets private; storage.objects RLS enabled and no object policies.
- Remember schema USAGE denied to anon and authenticated; owner list placeholder returns [].
- Gallery without credentials rejected; invalid guest photo reservation rejected.
- Share-manager currently writes guest link and encrypted vault copy separately; a failed second write can leave inconsistent recovery state.

## Stop conditions
Any accidental production mutation, real-user email, active-link rotation, credential exposure, or unexplained permission bypass: stop and investigate. Do not mark a test PASS based on source inspection alone.

## Pending manual/device acceptance
A real second user session and an iPhone acceptance run are not yet verified.

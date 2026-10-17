# Effective feature reader — installed and verified (2026-10-17)

Environment: isolated Remember Test Supabase project `kauxrvshxgpbvptdwhog`. Original Remember unchanged.

## Deployment
Migration `remember_test_effective_feature_read_v1` succeeded. Function `public.remember_security_effective_feature_read(uuid,text)` returns boolean; SECURITY DEFINER, fixed search_path; EXECUTE revoked from PUBLIC/anon/authenticated and granted to service_role.

## Verified SQL read-only checks
- Missing flag: false (PASS)
- Unknown feature: false (PASS)
- Wrong album without eligibility: false (PASS)
- anon execute privilege: false (PASS)
- authenticated execute privilege: false (PASS)
- service_role execute privilege: true (PASS)
- Global feature flag rows: 0
- Eligibility rows: 0
- Ready photo records: 7
- Private stored photo objects: 7

## Not yet verified
- TEST mode with exact eligible album vs ineligible album
- ON mode rejection using isolated transaction
- Real HTTP invocation by server Edge Function
- Integration with upload/gallery enforcement

Do not enable TEST or ON until the remaining tests and server enforcement are implemented. Existing guest behavior must remain unchanged while OFF.

-- REVIEW ONLY. NEVER RUN ON ORIGINAL REMEMBER.
-- Test project kauxrvshxgpbvptdwhog. Destructive rollback requires approval.
-- Only suitable when no settings, eligibility, request ledger or audit data exist.
-- Before running: back up and stop all new security module writes.
BEGIN;
DO $check$
BEGIN
 IF EXISTS (SELECT 1 FROM remember.security_feature_flags WHERE mode <> 'OFF')
 OR EXISTS (SELECT 1 FROM remember.security_album_settings)
 OR EXISTS (SELECT 1 FROM remember.security_settings_audit)
 OR EXISTS (SELECT 1 FROM remember.security_test_eligibility)
 OR EXISTS (SELECT 1 FROM remember.security_request_ledger)
 THEN RAISE EXCEPTION 'Rollback refused: security module has data to preserve';
 END IF;
END;
$check$;
DROP FUNCTION public.remember_security_owner_setting_write(uuid,uuid,uuid,text,boolean);
DROP TABLE remember.security_request_ledger;
DROP TABLE remember.security_settings_audit;
DROP TABLE remember.security_album_settings;
DROP TABLE remember.security_test_eligibility;
DROP TABLE remember.security_feature_flags;
COMMIT;
-- IMPORTANT: assumes both V2 schema and owner RPC were installed.
-- If only a subset was installed, use a separately reviewed partial rollback.

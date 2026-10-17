-- REVIEW ONLY. Destructive rollback: never run while module contains user data.
-- Target: isolated remember-test only. Explicit approval required.
-- PRECONDITIONS: stop security writers; verify no enabled flags, no album settings
-- and no audit rows needing retention; take backup; record counts.
BEGIN;
DO $$
BEGIN
 IF EXISTS (SELECT 1 FROM remember.security_feature_flags WHERE mode <> 'OFF')
 OR EXISTS (SELECT 1 FROM remember.security_album_settings)
 OR EXISTS (SELECT 1 FROM remember.security_settings_audit)
 OR EXISTS (SELECT 1 FROM remember.security_test_eligibility)
 THEN RAISE EXCEPTION 'Rollback refused: module has enabled settings, eligibility or audit history';
 END IF;
END $$;
DROP TABLE remember.security_settings_audit;
DROP TABLE remember.security_album_settings;
DROP TABLE remember.security_test_eligibility;
DROP TABLE remember.security_feature_flags;
COMMIT;

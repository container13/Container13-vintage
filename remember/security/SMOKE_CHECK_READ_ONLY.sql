-- Remember Test automated read-only smoke checks.
-- Run ONLY in Supabase project kauxrvshxgpbvptdwhog.
-- This script never updates user records.
SELECT
 (SELECT count(*) FROM remember.albums) AS album_count,
 (SELECT count(*) FROM remember.album_photos) AS photo_count,
 (SELECT count(*) FROM remember.security_album_settings) AS settings_count,
 (SELECT count(*) FROM remember.security_settings_audit) AS audit_count,
 (SELECT count(*) FROM remember.security_request_ledger) AS request_count,
 (SELECT count(*) FROM remember.security_feature_flags WHERE mode <> 'OFF') AS active_flags;
SELECT
 c.relname AS table_name,
 c.relrowsecurity AS rls_enabled,
 has_table_privilege('anon',c.oid,'SELECT') AS anon_select,
 has_table_privilege('authenticated',c.oid,'UPDATE') AS authenticated_update
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='remember' AND c.relname LIKE 'security_%' AND c.relkind='r'
ORDER BY c.relname;
SELECT
 p.proname,
 p.prosecdef AS security_definer,
 has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
 has_function_privilege('authenticated',p.oid,'EXECUTE') AS authenticated_execute,
 has_function_privilege('service_role',p.oid,'EXECUTE') AS service_execute
FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname='remember_security_owner_setting_write';
SELECT setting_key,previous_value,next_value,created_at
FROM remember.security_settings_audit ORDER BY id DESC LIMIT 10;

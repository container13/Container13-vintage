-- Remember migration 5 verification. READ ONLY. Run after migration 5.
SELECT
 (SELECT max(version) FROM remember.schema_migrations) AS schema_version,
 to_regprocedure('public.remember_guest_metadata_read(bytea)') IS NOT NULL AS rpc_exists,
 has_function_privilege('anon','public.remember_guest_metadata_read(bytea)','EXECUTE') AS anon_execute,
 has_function_privilege('authenticated','public.remember_guest_metadata_read(bytea)','EXECUTE') AS authenticated_execute,
 has_function_privilege('service_role','public.remember_guest_metadata_read(bytea)','EXECUTE') AS service_execute,
 (SELECT count(*) FROM remember.albums) AS album_count,
 (SELECT count(*) FROM remember.guest_links WHERE revoked_at IS NULL) AS active_guest_links;

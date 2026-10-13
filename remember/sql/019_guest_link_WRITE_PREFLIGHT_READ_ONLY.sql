-- Remember migration 4 PRE-FLIGHT. READ ONLY. Dedicated container13-remember.
-- Run before 018_guest_link_WRITE_MIGRATION4_REVIEW_FIRST.sql.
select
 (select max(version) from remember.schema_migrations) as schema_version,
 (select count(*) from remember.albums) as album_count,
 (select count(*) from remember.guest_links) as guest_link_count,
 to_regprocedure('public.remember_webmaster_guest_link_write(uuid,uuid,text,bytea)') is not null as rpc_already_exists,
 (select relrowsecurity from pg_class where oid='remember.guest_links'::regclass) as guest_links_rls,
 has_table_privilege('anon','remember.guest_links','SELECT') as anon_read,
 has_table_privilege('authenticated','remember.guest_links','SELECT') as authenticated_read;
-- Expected before: version=3, albums=1 (user-verified baseline),
-- guest_link_count=0, rpc_already_exists=false, guest_links_rls=true,
-- anon_read=false, authenticated_read=false.
-- STOP if results differ. This file does not write or install anything.

-- POST-INSTALL CHECKS (run separately AFTER approved migration 4):
-- select
--  (select max(version) from remember.schema_migrations) as version,
--  (select count(*) from remember.albums) as albums,
--  (select count(*) from remember.guest_links) as links,
--  to_regprocedure('public.remember_webmaster_guest_link_write(uuid,uuid,text,bytea)') is not null as rpc_exists,
--  has_function_privilege('anon','public.remember_webmaster_guest_link_write(uuid,uuid,text,bytea)','EXECUTE') as anon_execute,
--  has_function_privilege('authenticated','public.remember_webmaster_guest_link_write(uuid,uuid,text,bytea)','EXECUTE') as authenticated_execute,
--  has_function_privilege('service_role','public.remember_webmaster_guest_link_write(uuid,uuid,text,bytea)','EXECUTE') as service_execute;
-- Expected: version=4, albums=1, links=0, rpc_exists=true,
-- anon_execute=false, authenticated_execute=false, service_execute=true.
-- These privilege checks do NOT replace negative runtime authorization tests.

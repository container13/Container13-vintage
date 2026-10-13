-- Remember migration 3: READ-ONLY PRE-FLIGHT. Safe to run before approval.
-- Run only in dedicated container13-remember. Never changes data.
select
  current_database() as database_name,
  to_regclass('remember.albums') is not null as albums_present,
  to_regclass('remember.schema_migrations') is not null as migrations_present,
  to_regclass('remember.guest_links') is not null as guest_links_already_present,
  (select coalesce(max(version),0) from remember.schema_migrations) as highest_version,
  (select count(*) from remember.albums) as existing_album_count,
  (select count(*) from remember.albums where owner_user_id is null) as albums_without_owner;
-- Expected BEFORE migration: albums_present=true, migrations_present=true,
-- guest_links_already_present=false, highest_version=2.
-- Do not proceed if any expectation differs. Preserve existing album count.

-- REVIEW AFTER INSTALL: READ-ONLY VERIFICATION (do not run before installation)
-- select
--  (select max(version) from remember.schema_migrations) as highest_version,
--  (select count(*) from remember.albums) as album_count,
--  (select count(*) from remember.guest_links) as guest_link_count,
--  (select relrowsecurity from pg_class where oid='remember.guest_links'::regclass) as rls_enabled,
--  has_table_privilege('anon','remember.guest_links','SELECT') as anon_can_select,
--  has_table_privilege('authenticated','remember.guest_links','SELECT') as authenticated_can_select,
--  has_table_privilege('anon','remember.guest_links','INSERT') as anon_can_insert,
--  has_table_privilege('authenticated','remember.guest_links','INSERT') as authenticated_can_insert;
-- Expected AFTER: version=3; album_count unchanged; guest_link_count=0;
-- rls_enabled=true; all privilege checks=false.

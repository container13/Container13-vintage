-- REVIEW FIRST. Two-connection TEST ONLY. NOT executed.
-- A commits one explicitly disposable test album; cleanup script C removes it.
begin;
do $check$ begin
 if exists(select 1 from remember.albums where id='a2c13000-0000-4000-8000-000000000040') then
   raise exception 'Concurrent test ID already exists; inspect before replay';
 end if;
end $check$;
set local role service_role;
with created as materialized (select public.remember_webmaster_create_album(
 '75b71f6c-97b7-4de1-ad14-292b4af4e1fa','a2c13000-0000-4000-8000-000000000040',
 'Remember disposable concurrency test','party','2026-11-01T12:00:00Z',null,'Europe/Stockholm'
) as connection_a_result)
select connection_a_result,pg_backend_pid() as connection_a_pid,pg_sleep(12) from created;
commit;

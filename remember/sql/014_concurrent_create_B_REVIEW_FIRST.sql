-- Start while connection A is sleeping. Same disposable test request.
begin;
set local role service_role;
select public.remember_webmaster_create_album(
 '75b71f6c-97b7-4de1-ad14-292b4af4e1fa','a2c13000-0000-4000-8000-000000000040',
 'Remember disposable concurrency test','party','2026-11-01T12:00:00Z',null,'Europe/Stockholm'
) as connection_b_result,pg_backend_pid() as connection_b_pid;
commit;
-- Expected after A commits: authorized=true, created=false, SAME album id.

-- Remember security verification: READ ONLY. Run only in dedicated Remember project.
-- Expected: all booleans true. This is structural evidence, not a penetration test.
with objects as (
 select c.oid,c.relname,c.relrowsecurity
 from pg_catalog.pg_class c
 join pg_catalog.pg_namespace n on n.oid=c.relnamespace
 where n.nspname='remember' and c.relkind in ('r','p')
), checks as (
 select 'remember schema exists' as test, exists(select 1 from pg_catalog.pg_namespace where nspname='remember') as pass
 union all select 'anon cannot use remember schema',
   not coalesce(has_schema_privilege('anon','remember','USAGE'),false)
 union all select 'authenticated cannot use remember schema',
   not coalesce(has_schema_privilege('authenticated','remember','USAGE'),false)
 union all select 'five required tables with RLS enabled',
   (select count(*)=5 from objects where relname in
     ('albums','webmasters','schedule_audit','album_photos','schema_migrations') and relrowsecurity)
 union all select 'anon cannot SELECT any remember table',
   not exists(select 1 from objects where has_table_privilege('anon',oid,'SELECT'))
 union all select 'authenticated cannot SELECT any remember table',
   not exists(select 1 from objects where has_table_privilege('authenticated',oid,'SELECT'))
 union all select 'RPC exists',
   to_regprocedure('public.remember_webmaster_read(uuid,text)') is not null
 union all select 'RPC is security definer',
   coalesce((select prosecdef from pg_catalog.pg_proc where oid=to_regprocedure('public.remember_webmaster_read(uuid,text)')),false)
 union all select 'anon cannot execute RPC',
   not coalesce(has_function_privilege('anon',to_regprocedure('public.remember_webmaster_read(uuid,text)'),'EXECUTE'),false)
 union all select 'authenticated cannot execute RPC',
   not coalesce(has_function_privilege('authenticated',to_regprocedure('public.remember_webmaster_read(uuid,text)'),'EXECUTE'),false)
 union all select 'service_role can execute RPC',
   coalesce(has_function_privilege('service_role',to_regprocedure('public.remember_webmaster_read(uuid,text)'),'EXECUTE'),false)
 union all select 'schema version 1 installed',
   exists(select 1 from remember.schema_migrations where version=1)
)
select test,pass from checks order by test;
-- Version row must be checked separately once schema_migrations exists:
-- select version from remember.schema_migrations order by version desc limit 1;

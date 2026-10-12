-- Remember: read-only installation verification (execute after 001, 002 and 003).
select n.nspname as schema_name,
       has_schema_privilege('anon', n.oid, 'USAGE') as anon_usage,
       has_schema_privilege('authenticated', n.oid, 'USAGE') as authenticated_usage
from pg_namespace n where n.nspname = 'remember';

select c.relname as table_name,
       c.relrowsecurity as rls_enabled,
       has_table_privilege('anon', c.oid, 'SELECT') as anon_select,
       has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_select
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where n.nspname='remember' and c.relkind in ('r','p')
order by c.relname;

select version, description, installed_at
from remember.schema_migrations order by version desc limit 1;

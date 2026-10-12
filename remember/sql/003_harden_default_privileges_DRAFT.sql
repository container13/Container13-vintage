-- Remember baseline security hardening. Review before execution.
-- Applies only to the dedicated remember schema; does not touch public or Micke50.
begin;
revoke all on schema remember from public, anon, authenticated;
revoke all on all tables in schema remember from public, anon, authenticated;
revoke all on all sequences in schema remember from public, anon, authenticated;
alter default privileges for role postgres in schema remember
  revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema remember
  revoke all on sequences from public, anon, authenticated;
commit;

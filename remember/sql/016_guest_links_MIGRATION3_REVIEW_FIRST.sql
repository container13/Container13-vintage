-- REMEMBER MIGRATION 3 CANDIDATE — REVIEW FIRST, NOT EXECUTED.
-- Dedicated container13-remember only. Never run against Micke50.
-- Adds server-only opaque guest capability storage. Does NOT enable public reading/uploads.
-- IMPORTANT: existing albums get NO token automatically; explicit authenticated issue/rotation
-- must be implemented separately with server-generated randomness and audit.
begin;
do $preflight$
begin
  if not exists(select 1 from remember.schema_migrations where version=2)
    or exists(select 1 from remember.schema_migrations where version>=3) then
    raise exception 'Expected exactly Remember migration 2; inspect before running';
  end if;
end
$preflight$;

create table remember.guest_links (
  album_id uuid primary key references remember.albums(id) on delete cascade,
  token_sha256 bytea not null unique,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  revoked_at timestamptz,
  rotated_at timestamptz,
  constraint token_hash_length check (octet_length(token_sha256)=32)
);
create index guest_links_active_hash_idx on remember.guest_links(token_sha256)
  where revoked_at is null;
alter table remember.guest_links enable row level security;
revoke all on remember.guest_links from public,anon,authenticated;
revoke all on schema remember from public,anon,authenticated;
-- No anon/authenticated grants, no public RLS policies, no SECURITY DEFINER public lookup.
-- A later reviewed server-only endpoint must use timing-safe token verification and
-- return allowlisted public metadata only. Do not expose token hash in API responses.
insert into remember.schema_migrations(version,description)
values(3,'Guest capability hash storage only; guest API disabled');
commit;

-- Rollback (ONLY if verified unused, in separate approved transaction):
-- begin; delete from remember.schema_migrations where version=3;
-- drop table remember.guest_links; commit;

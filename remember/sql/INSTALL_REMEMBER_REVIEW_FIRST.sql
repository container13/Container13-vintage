-- Remember installation candidate. Dedicated container13-remember project ONLY.
-- NOT executed. Review and run manually in Supabase SQL Editor.
-- Never run against Micke50. No storage bucket or webmaster bootstrap included.

-- ===== remember/sql/001_schema_DRAFT.sql =====
-- Remember schema draft v1. NOT APPLIED. Review in isolated Supabase test project.
-- No grants to anon/authenticated; all client reads/writes go through reviewed server endpoints.
begin;
create schema if not exists remember;
create table if not exists remember.albums (
 id uuid primary key default gen_random_uuid(),
 slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{2,62}$'),
 title text not null check (char_length(title) between 1 and 100),
 owner_user_id uuid not null references auth.users(id),
 event_timezone text not null default 'Europe/Stockholm',
 default_opens_at timestamptz not null,
 default_closes_at timestamptz not null,
 override_opens_at timestamptz,
 override_closes_at timestamptz,
 forced_closed boolean not null default false,
 photo_limit integer not null default 10 check(photo_limit between 0 and 100000),
 revision bigint not null default 1,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 constraint default_window_order check(default_closes_at > default_opens_at),
 constraint override_pair check ((override_opens_at is null) = (override_closes_at is null)),
 constraint override_window_order check(override_opens_at is null or override_closes_at > override_opens_at)
);
create table if not exists remember.webmasters (
 user_id uuid primary key references auth.users(id),
 granted_at timestamptz not null default now(),
 granted_by uuid references auth.users(id)
);
create table if not exists remember.schedule_audit (
 id bigint generated always as identity primary key,
 album_id uuid not null references remember.albums(id),
 actor_user_id uuid not null references auth.users(id),
 action text not null check(action in ('set_window','close_now','reopen','restore_defaults')),
 before_state jsonb not null,
 after_state jsonb not null,
 created_at timestamptz not null default now()
);
create table if not exists remember.album_photos (
 id uuid primary key default gen_random_uuid(),
 album_id uuid not null references remember.albums(id),
 object_key text not null unique,
 idempotency_key uuid not null,
 state text not null check(state in ('reserved','uploading','ready','failed','deleted')),
 reservation_expires_at timestamptz,
 created_at timestamptz not null default now(),
 unique(album_id,idempotency_key)
);
alter table remember.albums enable row level security;
alter table remember.webmasters enable row level security;
alter table remember.schedule_audit enable row level security;
alter table remember.album_photos enable row level security;
-- Explicitly deny direct API roles even if future default grants are changed.
revoke all on schema remember from public, anon, authenticated;
revoke all on all tables in schema remember from public, anon, authenticated;
revoke all on all sequences in schema remember from public, anon, authenticated;
-- No RLS policies here: default-deny. Backend must check signed user identity
-- and webmaster membership server-side before using privileged credentials.
-- Do not add remember to PostgREST exposed schemas without separate security review.
commit;


-- ===== remember/sql/002_version_marker_DRAFT.sql =====
-- Remember installation version marker. Draft; not applied.
begin;
create table if not exists remember.schema_migrations (
 version integer primary key,
 description text not null,
 installed_at timestamptz not null default now()
);
alter table remember.schema_migrations enable row level security;
revoke all on remember.schema_migrations from public, anon, authenticated;
insert into remember.schema_migrations(version, description)
values (1, 'Remember baseline schema') on conflict (version) do nothing;
commit;


-- ===== remember/sql/003_harden_default_privileges_DRAFT.sql =====
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


-- ===== remember/sql/005_private_webmaster_gateway_DRAFT.sql =====
-- Remember read-only gateway. Candidate only; requires runtime security tests.
begin;
create or replace function public.remember_webmaster_read(p_actor uuid, p_action text)
returns jsonb language plpgsql security definer set search_path = ''
as $fn$
declare v_version integer; v_albums jsonb;
begin
  if p_actor is null or (p_action is null or p_action not in ('role_check','installation_status','list')) then
    raise exception 'Invalid request' using errcode = '22023';
  end if;
  if not exists(select 1 from remember.webmasters where user_id = p_actor) then
    return jsonb_build_object('authorized',false);
  end if;
  if p_action = 'role_check' then return jsonb_build_object('authorized',true); end if;
  if p_action = 'installation_status' then
    select max(version) into v_version from remember.schema_migrations;
    return jsonb_build_object('authorized',true,'schemaVersion',v_version,
      'expectedVersion',1,'ready',v_version=1);
  end if;
  select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) into v_albums
  from (select id,slug,title,event_timezone,default_opens_at,default_closes_at,
    override_opens_at,override_closes_at,forced_closed,revision
    from remember.albums order by created_at desc limit 100) a;
  return jsonb_build_object('authorized',true,'albums',v_albums);
end
$fn$;
revoke all on function public.remember_webmaster_read(uuid,text) from public, anon, authenticated;
grant execute on function public.remember_webmaster_read(uuid,text) to service_role;
commit;


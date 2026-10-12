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

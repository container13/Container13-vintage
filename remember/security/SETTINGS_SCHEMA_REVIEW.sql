-- REVIEW ONLY. DO NOT EXECUTE before authorization and RLS review.
-- Separate settings, no changes to existing albums or album_photos.
create table if not exists remember.security_feature_flags (
  feature_key text primary key,
  mode text not null default 'OFF' check (mode in ('OFF','TEST','ON')),
  updated_at timestamptz not null default now(),
  updated_by uuid
);
create table if not exists remember.security_album_settings (
  album_id uuid primary key references remember.albums(id) on delete cascade,
  require_verified_email boolean not null default false,
  require_photo_approval boolean not null default false,
  allow_reports boolean not null default false,
  notify_reports boolean not null default false,
  pause_new_slideshow_photos boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
create table if not exists remember.security_settings_audit (
  id bigint generated always as identity primary key,
  actor_user_id uuid,
  album_id uuid references remember.albums(id) on delete set null,
  setting_scope text not null check (setting_scope in ('feature','album')),
  setting_key text not null,
  previous_value jsonb,
  next_value jsonb not null,
  created_at timestamptz not null default now()
);
-- No client grants or permissive policies. Only server-authorized operations after review.
alter table remember.security_feature_flags enable row level security;
alter table remember.security_album_settings enable row level security;
alter table remember.security_settings_audit enable row level security;
revoke all on remember.security_feature_flags, remember.security_album_settings, remember.security_settings_audit from anon, authenticated;
-- Next: design narrowly scoped server API, owner verification, webmaster verification,
-- audit in same transaction, TEST eligibility, explicit rollback and negative tests.

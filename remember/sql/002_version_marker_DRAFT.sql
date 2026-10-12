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

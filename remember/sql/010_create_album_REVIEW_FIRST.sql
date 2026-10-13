-- REVIEW FIRST. NOT EXECUTED. Dedicated container13-remember only.
-- Migration 2: service-only creation RPC; preserves all existing tables/data.
-- Caller must authenticate JWT and derive p_actor from the verified user.
begin;
do $preflight$
begin
  if not exists(select 1 from remember.schema_migrations where version=1) then
    raise exception 'Remember baseline version 1 missing';
  end if;
  if exists(select 1 from remember.schema_migrations where version>=2) then
    raise exception 'Migration 2 already present or newer schema: inspect before replay';
  end if;
end
$preflight$;

create function public.remember_webmaster_create_album(
 p_actor uuid, p_request_id uuid, p_title text,
 p_event_type text, p_starts_at timestamptz, p_ends_at timestamptz,
 p_timezone text default 'Europe/Stockholm'
) returns jsonb language plpgsql security definer set search_path = ''
as $fn$
declare
 v_album remember.albums%rowtype;
 v_close timestamptz;
 v_title text;
 v_inserted boolean;
 v_count integer;
begin
 if p_actor is null or not exists(
   select 1 from remember.webmasters w join auth.users u on u.id=w.user_id
   where w.user_id=p_actor and u.email_confirmed_at is not null
     and u.deleted_at is null and (u.banned_until is null or u.banned_until<=now())
 ) then return jsonb_build_object('authorized',false); end if;

 v_title := btrim(p_title);
 if p_request_id is null
   or p_request_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
   or v_title is null or char_length(v_title) not between 1 and 100
   or p_event_type is null or p_event_type not in ('party','wedding','trip','fishing')
   or p_starts_at is null or not isfinite(p_starts_at)
   or p_timezone is null or not exists(
      select 1 from pg_catalog.pg_timezone_names where name=p_timezone
   ) then raise exception 'Invalid album request' using errcode='22023'; end if;

 if p_event_type in ('party','wedding') then
   if p_ends_at is not null then
     raise exception 'Party/wedding end must be omitted' using errcode='22023';
   end if;
   v_close := p_starts_at + interval '24 hours';
 else
   if p_ends_at is null or not isfinite(p_ends_at) or p_ends_at<p_starts_at then
     raise exception 'Invalid trip window' using errcode='22023';
   end if;
   v_close := p_ends_at + interval '24 hours';
 end if;
 if not isfinite(v_close) then
   raise exception 'Invalid close time' using errcode='22023';
 end if;

 -- Stable request UUID is the album ID and opaque locator.
 -- No public guest URL/capability is issued by this pilot RPC.
 insert into remember.albums(
   id,slug,title,owner_user_id,event_timezone,
   default_opens_at,default_closes_at,photo_limit
 ) values (
   p_request_id,p_request_id::text,v_title,p_actor,p_timezone,
   p_starts_at,v_close,10
 ) on conflict(id) do nothing;
 get diagnostics v_count = row_count;
 v_inserted := v_count=1;
 select * into strict v_album from remember.albums where id=p_request_id;

 -- A retry must reproduce exactly the original create defaults and owner.
 -- Never overwrite existing album data, schedules or quotas on retry.
 if v_album.owner_user_id is distinct from p_actor
   or v_album.title is distinct from v_title
   or v_album.event_timezone is distinct from p_timezone
   or v_album.default_opens_at is distinct from p_starts_at
   or v_album.default_closes_at is distinct from v_close then
   raise exception 'Request ID reused with different data' using errcode='22023';
 end if;
 return jsonb_build_object('authorized',true,'created',v_inserted,
   'album',jsonb_build_object('id',v_album.id,'title',v_album.title,
     'event_timezone',v_album.event_timezone,'default_opens_at',v_album.default_opens_at,
     'default_closes_at',v_album.default_closes_at,'photo_limit',v_album.photo_limit));
end
$fn$;
revoke all on function public.remember_webmaster_create_album(uuid,uuid,text,text,timestamptz,timestamptz,text)
  from public,anon,authenticated;
grant execute on function public.remember_webmaster_create_album(uuid,uuid,text,text,timestamptz,timestamptz,text)
  to service_role;

-- Upgrade read gateway readiness to migration version 2 in the SAME transaction.
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
      'expectedVersion',2,'ready',v_version=2);
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

insert into remember.schema_migrations(version,description)
values(2,'Service-only idempotent webmaster album creation');
commit;

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

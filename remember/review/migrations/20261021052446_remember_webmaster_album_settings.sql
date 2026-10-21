-- REVIEW ONLY. Do not install without project-owner approval.
-- Apply/test in remember-test first; production remains unchanged until approved.
begin;
create function public.remember_webmaster_album_settings(
 p_actor uuid,p_album_id uuid,p_action text,p_expected_revision bigint default null,
 p_opens_at timestamptz default null,p_closes_at timestamptz default null,p_forced_closed boolean default null
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare a remember.albums%rowtype; before_row jsonb; owner_email text; photo_count bigint;
begin
 if p_actor is null or p_album_id is null or p_action is null or p_action not in ('read','save') then
  raise exception 'Invalid request' using errcode='22023';
 end if;
 if not exists(select 1 from remember.webmasters where user_id=p_actor) then
  return jsonb_build_object('authorized',false);
 end if;
 if p_action='save' then
  if p_expected_revision is null or p_opens_at is null or p_closes_at is null or p_forced_closed is null
   or not isfinite(p_opens_at) or not isfinite(p_closes_at) or p_closes_at<=p_opens_at then
   raise exception 'Invalid upload window' using errcode='22023';
  end if;
  select * into a from remember.albums where id=p_album_id for update;
 else
  select * into a from remember.albums where id=p_album_id;
 end if;
 if not found then return jsonb_build_object('authorized',true,'ok',false,'error','not_found');end if;
 if p_action='save' then
  -- Repeating an already-applied request is a no-op, even with the old revision.
  if coalesce(a.override_opens_at,a.default_opens_at)=p_opens_at
   and coalesce(a.override_closes_at,a.default_closes_at)=p_closes_at and a.forced_closed=p_forced_closed then
   null;
  else
   if a.revision<>p_expected_revision then
    return jsonb_build_object('authorized',true,'ok',false,'error','revision_conflict');
   end if;
   before_row=to_jsonb(a);
   update remember.albums set override_opens_at=p_opens_at,override_closes_at=p_closes_at,
    forced_closed=p_forced_closed,revision=revision+1,updated_at=now()
    where id=p_album_id returning * into a;
   insert into remember.schedule_audit(album_id,actor_user_id,action,before_state,after_state)
    values(p_album_id,p_actor,'set_window',before_row,to_jsonb(a));
  end if;
 end if;
 select coalesce(u.email,'') into owner_email from auth.users u where u.id=a.owner_user_id;
 select count(*) into photo_count from remember.album_photos where album_id=a.id and state='ready';
 return jsonb_build_object('ok',true,'authorized',true,'album',to_jsonb(a)||
  jsonb_build_object('owner_email',coalesce(owner_email,''),'photo_count',photo_count,'revision',a.revision::text));
end;
$fn$;
revoke all on function public.remember_webmaster_album_settings(uuid,uuid,text,bigint,timestamptz,timestamptz,boolean) from public,anon,authenticated;
grant execute on function public.remember_webmaster_album_settings(uuid,uuid,text,bigint,timestamptz,timestamptz,boolean) to service_role;
commit;

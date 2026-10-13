-- Remember migration 4 CANDIDATE. REVIEW FIRST. NOT EXECUTED.
-- Dedicated container13-remember ONLY. Depends on verified migration 3.
-- Service-role-only transactional link issue/rotate/revoke; NO guest read endpoint.
begin;
do $preflight$
begin
 if not exists(select 1 from remember.schema_migrations where version=3)
    or exists(select 1 from remember.schema_migrations where version>=4) then
   raise exception 'Expected migration 3 only; inspect first';
 end if;
end $preflight$;

create function public.remember_webmaster_guest_link_write(
 p_actor uuid, p_album uuid, p_action text, p_token_hash bytea default null
) returns jsonb language plpgsql security definer set search_path=''
as $fn$
declare v_album remember.albums%rowtype; v_count integer;
begin
 if p_actor is null or p_album is null or p_action is null or p_action not in ('issue','rotate','revoke')
   or (p_action in ('issue','rotate') and
       (p_token_hash is null or octet_length(p_token_hash)<>32))
   or (p_action='revoke' and p_token_hash is not null) then
   raise exception 'Invalid request' using errcode='22023';
 end if;
 if not exists (
   select 1 from remember.webmasters w join auth.users u on u.id=w.user_id
   where w.user_id=p_actor and u.email_confirmed_at is not null
     and u.deleted_at is null and (u.banned_until is null or u.banned_until<=now())
 ) then return jsonb_build_object('authorized',false); end if;
 select * into v_album from remember.albums where id=p_album and owner_user_id=p_actor for update;
 if not found then return jsonb_build_object('authorized',false); end if;
 if p_action='issue' then
   insert into remember.guest_links(album_id,token_sha256,created_by)
   values(p_album,p_token_hash,p_actor)
   on conflict(album_id) do nothing;
   get diagnostics v_count=row_count;
   if v_count<>1 then return jsonb_build_object('authorized',true,'created',false,'reason','already_exists'); end if;
 elsif p_action='rotate' then
   update remember.guest_links set token_sha256=p_token_hash,created_by=p_actor,
      created_at=now(),rotated_at=now(),revoked_at=null where album_id=p_album;
   get diagnostics v_count=row_count;
   if v_count<>1 then return jsonb_build_object('authorized',true,'created',false,'reason','not_issued'); end if;
 else
   update remember.guest_links set revoked_at=now() where album_id=p_album and revoked_at is null;
   get diagnostics v_count=row_count;
   if v_count<>1 then return jsonb_build_object('authorized',true,'success',false,'reason','already_revoked_or_missing'); end if;
 end if;
 return jsonb_build_object('authorized',true,'success',true,'action',p_action);
end $fn$;
revoke all on function public.remember_webmaster_guest_link_write(uuid,uuid,text,bytea)
 from public,anon,authenticated;
grant execute on function public.remember_webmaster_guest_link_write(uuid,uuid,text,bytea)
 to service_role;
insert into remember.schema_migrations(version,description)
values(4,'Service-only guest link issue rotate revoke RPC; public access disabled');
commit;

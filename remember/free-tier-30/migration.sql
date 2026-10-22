-- Remember 0.1.168: user-approved 30-photo mobile trial.
-- Keep the album column default as the single source of the free quota.
ALTER TABLE remember.albums ALTER COLUMN photo_limit SET DEFAULT 30;

CREATE OR REPLACE FUNCTION public.remember_complete_album_registration(p_actor uuid, p_request_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE u auth.users%ROWTYPE; draft remember.pending_album_registrations%ROWTYPE;
 existing_owner uuid;
BEGIN
 SELECT * INTO u FROM auth.users WHERE id=p_actor AND email_confirmed_at IS NOT NULL
 AND deleted_at IS NULL AND (banned_until IS NULL OR banned_until<=now());
 IF NOT FOUND OR u.email IS NULL THEN RAISE EXCEPTION 'verified_login_required' USING ERRCODE='42501'; END IF;
 SELECT * INTO draft FROM remember.pending_album_registrations
 WHERE lower(email)=lower(u.email) AND created_at>=now()-interval '24 hours'
 AND (CASE WHEN p_request_id IS NULL THEN consumed_at IS NULL ELSE id=p_request_id END)
 ORDER BY created_at DESC,id DESC LIMIT 1 FOR UPDATE;
 IF NOT FOUND THEN
  IF p_request_id IS NOT NULL THEN RAISE EXCEPTION 'registration_not_found' USING ERRCODE='22023'; END IF;
  RETURN jsonb_build_object('ok',true,'created',false);
 END IF;
 SELECT owner_user_id INTO existing_owner FROM remember.albums WHERE id=draft.id;
 IF FOUND AND existing_owner IS DISTINCT FROM p_actor THEN
  RAISE EXCEPTION 'registration_conflict' USING ERRCODE='23505';
 END IF;
 IF NOT FOUND THEN
  INSERT INTO remember.albums(id,slug,title,owner_user_id,event_timezone,default_opens_at,default_closes_at,photo_limit,guest_mode)
  VALUES(draft.id,'album-'||replace(draft.id::text,'-',''),draft.title,p_actor,draft.timezone,
   draft.starts_at,draft.starts_at+draft.days*interval '24 hours',DEFAULT,draft.guest_mode);
 END IF;
 UPDATE remember.pending_album_registrations SET consumed_at=coalesce(consumed_at,now()),album_id=draft.id WHERE id=draft.id;
 RETURN jsonb_build_object('ok',true,'created',true,'albumId',draft.id,'guestMode',draft.guest_mode);
END $function$
;

CREATE OR REPLACE FUNCTION public.remember_webmaster_create_album(p_actor uuid, p_request_id uuid, p_title text, p_event_type text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_timezone text DEFAULT 'Europe/Stockholm'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
   p_starts_at,v_close,DEFAULT
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
$function$
;

-- Only former standard trial albums; preserve custom limits.
UPDATE remember.albums SET photo_limit=30 WHERE photo_limit=10;


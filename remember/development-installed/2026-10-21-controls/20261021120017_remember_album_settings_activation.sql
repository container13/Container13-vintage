-- Original Remember DEVELOPMENT environment. User authorized installation 2026-10-21.
-- Original baseline verified against actual RPC definitions; test-only moderation/recovery code is excluded.
-- No guest tokens, owner data, photo bytes or service keys are embedded.
begin;
alter table remember.albums add column is_active boolean not null default true;
create table remember.album_activation_state(
 album_id uuid primary key references remember.albums(id) on delete cascade,
 reason text not null default '' check(char_length(reason)<=500),
 updated_by uuid not null,
 updated_at timestamptz not null default now()
);
create table remember.album_activation_audit(
 id bigint generated always as identity primary key,
 album_id uuid not null,
 actor_user_id uuid not null,
 before_state jsonb not null,
 after_state jsonb not null,
 created_at timestamptz not null default now()
);
alter table remember.album_activation_state enable row level security;
alter table remember.album_activation_audit enable row level security;
revoke all on remember.album_activation_state,remember.album_activation_audit from public,anon,authenticated,service_role;
revoke all on sequence remember.album_activation_audit_id_seq from public,anon,authenticated,service_role;
create or replace function public.remember_webmaster_album_activation(
 p_actor uuid,p_album_id uuid,p_action text,p_expected_revision bigint default null,
 p_active boolean default null,p_reason text default null
) returns jsonb language plpgsql security definer set search_path='' as $activation$
declare a remember.albums%rowtype; prior_reason text; result jsonb;
begin
 if p_actor is null or p_album_id is null or p_action is null or p_action not in ('read','save')
 then raise exception 'Invalid request' using errcode='22023'; end if;
 if not exists(select 1 from remember.webmasters w join auth.users u on u.id=w.user_id
 where w.user_id=p_actor and u.email_confirmed_at is not null and u.deleted_at is null
 and (u.banned_until is null or u.banned_until<=now()))
 then return jsonb_build_object('authorized',false); end if;
 if p_action='save' then
  if p_expected_revision is null or p_expected_revision<1 or p_active is null
    or p_reason is null or char_length(p_reason)>500
  then raise exception 'Invalid change' using errcode='22023'; end if;
  select * into a from remember.albums where id=p_album_id for update;
 else
  select * into a from remember.albums where id=p_album_id;
 end if;
 if not found then return jsonb_build_object('authorized',true,'error','not_found'); end if;
 select reason into prior_reason from remember.album_activation_state where album_id=a.id;
 prior_reason:=coalesce(prior_reason,'');
 if p_action='save' then
  p_reason:=case when p_active then '' else btrim(p_reason) end;
  -- An exact retry is a no-op, even if the previous successful write incremented revision.
  if a.is_active is distinct from p_active or prior_reason is distinct from p_reason then
   if a.revision<>p_expected_revision
    then return jsonb_build_object('authorized',true,'error','revision_conflict'); end if;
   insert into remember.album_activation_audit(album_id,actor_user_id,before_state,after_state)
    values(a.id,p_actor,jsonb_build_object('is_active',a.is_active,'reason',prior_reason,'revision',a.revision::text),
     jsonb_build_object('is_active',p_active,'reason',p_reason,'revision',(a.revision+1)::text));
   update remember.albums set is_active=p_active,revision=revision+1,updated_at=now() where id=a.id returning * into a;
   insert into remember.album_activation_state(album_id,reason,updated_by) values(a.id,p_reason,p_actor)
    on conflict(album_id) do update set reason=excluded.reason,updated_by=excluded.updated_by,updated_at=now();
   prior_reason:=p_reason;
  end if;
 end if;
 return jsonb_build_object('authorized',true,'album',jsonb_build_object(
  'id',a.id,'is_active',a.is_active,'activation_reason',prior_reason,'revision',a.revision::text));
end $activation$;
revoke all on function public.remember_webmaster_album_activation(uuid,uuid,text,bigint,boolean,text) from public,anon,authenticated;
grant execute on function public.remember_webmaster_album_activation(uuid,uuid,text,bigint,boolean,text) to service_role;
-- Existing server-only endpoints follow below. CREATE OR REPLACE preserves their grants.
CREATE OR REPLACE FUNCTION public.remember_guest_metadata_read(p_token_hash bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
 v_title text;
 v_opens timestamptz;
 v_closes timestamptz;
 v_closed boolean;
 v_active boolean;
BEGIN
 IF p_token_hash IS NULL OR octet_length(p_token_hash) <> 32
 THEN RETURN jsonb_build_object('found', false); END IF;

 SELECT a.title,
        COALESCE(a.override_opens_at, a.default_opens_at),
        COALESCE(a.override_closes_at, a.default_closes_at),
        a.forced_closed,a.is_active
 INTO v_title, v_opens, v_closes, v_closed,v_active
 FROM remember.guest_links g
 JOIN remember.albums a ON a.id = g.album_id
 WHERE g.token_sha256 = p_token_hash AND g.revoked_at IS NULL;

 IF NOT FOUND THEN RETURN jsonb_build_object('found', false); END IF;
 IF NOT v_active THEN RETURN jsonb_build_object('found',true,'active',false,'uploadsOpen',false); END IF;

 RETURN jsonb_build_object(
  'found', true,
  'title', v_title,
  'uploadsOpen', NOT COALESCE(v_closed, true)
     AND now() >= v_opens AND now() < v_closes
 );
END $function$;

CREATE OR REPLACE FUNCTION public.remember_guest_photo_reserve(p_token_hash bytea, p_request_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
 v_album remember.albums%ROWTYPE;
 v_existing remember.album_photos%ROWTYPE;
 v_used integer;
 v_photo_id uuid;
 v_key text;
BEGIN
 IF p_token_hash IS NULL OR octet_length(p_token_hash)<>32
 OR p_request_id IS NULL
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;

 SELECT a.* INTO v_album
 FROM remember.guest_links g
 JOIN remember.albums a ON a.id=g.album_id
 WHERE g.token_sha256=p_token_hash AND g.revoked_at IS NULL
 FOR UPDATE OF a;

 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 IF NOT v_album.is_active THEN RETURN jsonb_build_object('accepted',false,'reason','album_inactive'); END IF;

 SELECT * INTO v_existing FROM remember.album_photos
 WHERE album_id=v_album.id AND idempotency_key=p_request_id;
 IF FOUND THEN
   IF v_existing.state='reserved' AND v_existing.reservation_expires_at<=now() THEN
     UPDATE remember.album_photos SET state='failed' WHERE id=v_existing.id;
   END IF;
   RETURN jsonb_build_object('accepted',v_existing.state='ready' OR (v_existing.state IN ('reserved','uploading') AND v_existing.reservation_expires_at>now()),
     'reason','existing','photoId',v_existing.id);
 END IF;

 IF v_album.forced_closed OR now()<COALESCE(v_album.override_opens_at,v_album.default_opens_at)
 OR now()>=COALESCE(v_album.override_closes_at,v_album.default_closes_at)
 THEN RETURN jsonb_build_object('accepted',false,'reason','closed'); END IF;

 -- Reclaim abandoned reservations only; never reclaim an upload already in progress.
 UPDATE remember.album_photos SET state='failed'
 WHERE album_id=v_album.id AND state='reserved'
   AND reservation_expires_at<=now();

 SELECT count(*) INTO v_used FROM remember.album_photos
 WHERE album_id=v_album.id AND state IN ('reserved','uploading','ready');
 IF v_used>=v_album.photo_limit
 THEN RETURN jsonb_build_object('accepted',false,'reason','limit'); END IF;

 v_photo_id:=gen_random_uuid();
 v_key:=v_album.id::text||'/'||v_photo_id::text;
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,reservation_expires_at)
 VALUES(v_photo_id,v_album.id,v_key,p_request_id,'reserved',now()+interval '15 minutes');

 RETURN jsonb_build_object('accepted',true,'reason','reserved','photoId',v_photo_id);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_photo_begin_upload(p_photo_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN

 PERFORM 1 FROM remember.albums a JOIN remember.album_photos ph ON ph.album_id=a.id
 WHERE ph.id=p_photo_id AND a.is_active FOR SHARE OF a;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','album_inactive'); END IF;
 IF p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state<>'reserved' OR v_photo.reservation_expires_at<=now()
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='uploading' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true,'objectKey',v_photo.object_key);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_photo_claim_upload(p_photo_id uuid, p_content_sha256 bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN

 PERFORM 1 FROM remember.albums a JOIN remember.album_photos ph ON ph.album_id=a.id
 WHERE ph.id=p_photo_id AND a.is_active FOR SHARE OF a;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','album_inactive'); END IF;
 IF p_photo_id IS NULL OR p_content_sha256 IS NULL OR octet_length(p_content_sha256)<>32
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','not_found'); END IF;
 IF v_photo.state='uploading' AND v_photo.content_sha256=p_content_sha256
 THEN RETURN jsonb_build_object('accepted',false,'reason','in_progress','photoId',v_photo.id); END IF;
 IF v_photo.state='ready' AND v_photo.content_sha256=p_content_sha256
 THEN RETURN jsonb_build_object('accepted',false,'reason','already_ready','photoId',v_photo.id); END IF;
 IF v_photo.state<>'reserved' OR v_photo.reservation_expires_at<=now()
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid_state'); END IF;
 BEGIN
  UPDATE remember.album_photos
  SET state='uploading',content_sha256=p_content_sha256
  WHERE id=v_photo.id;
 EXCEPTION WHEN unique_violation THEN
  -- The unique-index conflict rolled back the claim subtransaction.
  -- This reservation never reached storage: release its unused quota slot.
  UPDATE remember.album_photos SET state='failed'
  WHERE id=v_photo.id AND state='reserved';
  RETURN jsonb_build_object('accepted',false,'reason','duplicate');
 END;
 RETURN jsonb_build_object('accepted',true,'reason','claimed',
   'photoId',v_photo.id,'objectKey',v_photo.object_key);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_photo_complete_upload(p_photo_id uuid, p_token_hash bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN

 PERFORM 1 FROM remember.albums a JOIN remember.album_photos ph ON ph.album_id=a.id
 WHERE ph.id=p_photo_id AND a.is_active FOR SHARE OF a;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','album_inactive'); END IF;
 IF p_photo_id IS NULL OR p_token_hash IS NULL OR octet_length(p_token_hash)<>32
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state<>'uploading'
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 IF NOT EXISTS (SELECT 1 FROM remember.guest_links g WHERE g.album_id=v_photo.album_id
   AND g.token_sha256=p_token_hash AND g.revoked_at IS NULL)
 OR NOT EXISTS (SELECT 1 FROM remember.albums a WHERE a.id=v_photo.album_id
   AND NOT a.forced_closed AND now()>=COALESCE(a.override_opens_at,a.default_opens_at)
   AND now()<COALESCE(a.override_closes_at,a.default_closes_at))
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='ready' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_photo_gallery_read(p_actor uuid, p_album_id uuid, p_token_hash bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE aid uuid; items jsonb; v_moderated boolean;
BEGIN
 IF p_actor IS NOT NULL AND p_album_id IS NOT NULL AND p_token_hash IS NULL THEN
  IF NOT EXISTS(SELECT 1 FROM remember.webmasters WHERE user_id=p_actor) THEN RETURN jsonb_build_object('authorized',false); END IF;
  aid:=p_album_id;
 ELSIF p_actor IS NULL AND p_album_id IS NULL AND p_token_hash IS NOT NULL AND octet_length(p_token_hash)=32 THEN
  SELECT album_id INTO aid FROM remember.guest_links WHERE token_sha256=p_token_hash AND revoked_at IS NULL;
 ELSE RETURN jsonb_build_object('authorized',false); END IF;
 IF aid IS NULL OR NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=aid) THEN RETURN jsonb_build_object('authorized',false); END IF;
 IF p_actor IS NULL AND NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=aid AND is_active)
 THEN RETURN jsonb_build_object('authorized',false,'reason','album_inactive'); END IF;
 v_moderated:=public.remember_security_effective_feature_read(aid,'photo_approval');
 SELECT coalesce(jsonb_agg(jsonb_build_object('id',id,'objectKey',object_key,'createdAt',created_at) ORDER BY created_at DESC,id DESC),'[]'::jsonb)
 INTO items FROM (
  SELECT p.id,p.object_key,p.created_at FROM remember.album_photos p
  WHERE p.album_id=aid AND p.state='ready'
  AND (NOT v_moderated OR NOT EXISTS(
   SELECT 1 FROM remember.photo_approval_queue q WHERE q.photo_id=p.id AND q.decision<>'approved'
  ))
  ORDER BY p.created_at DESC,p.id DESC LIMIT 100
 ) p;
 RETURN jsonb_build_object('authorized',true,'photos',items);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_security_guest_album_read(p_token_hash bytea)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
 SELECT g.album_id FROM remember.guest_links g
 JOIN remember.albums a ON a.id=g.album_id
 WHERE g.token_sha256=p_token_hash AND octet_length(p_token_hash)=32
 AND g.revoked_at IS NULL AND a.is_active LIMIT 1
$function$;

CREATE OR REPLACE FUNCTION public.remember_webmaster_photo_complete(p_actor uuid, p_photo_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE p remember.album_photos%ROWTYPE;
BEGIN

 PERFORM 1 FROM remember.albums a JOIN remember.album_photos ph ON ph.album_id=a.id
 WHERE ph.id=p_photo_id AND a.is_active FOR SHARE OF a;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','album_inactive'); END IF;
 IF p_actor IS NULL OR p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO p FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR p.state<>'uploading' THEN RETURN jsonb_build_object('accepted',false); END IF;
 IF NOT EXISTS(SELECT 1 FROM remember.albums a WHERE a.id=p.album_id AND a.owner_user_id=p_actor)
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='ready' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_webmaster_photo_reserve(p_actor uuid, p_album_id uuid, p_request_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE a remember.albums%ROWTYPE; existing remember.album_photos%ROWTYPE; used integer; pid uuid;
BEGIN
 IF p_actor IS NULL OR p_album_id IS NULL OR p_request_id IS NULL
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 SELECT * INTO a FROM remember.albums WHERE id=p_album_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','not_found'); END IF;
 IF NOT a.is_active THEN RETURN jsonb_build_object('accepted',false,'reason','album_inactive'); END IF;
 IF a.owner_user_id IS DISTINCT FROM p_actor
 THEN RETURN jsonb_build_object('accepted',false,'reason','forbidden'); END IF;
 SELECT * INTO existing FROM remember.album_photos WHERE album_id=a.id AND idempotency_key=p_request_id;
 IF FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','existing'); END IF;
 UPDATE remember.album_photos SET state='failed'
 WHERE album_id=a.id AND state='reserved' AND reservation_expires_at<=now();
 SELECT count(*) INTO used FROM remember.album_photos
 WHERE album_id=a.id AND state IN ('reserved','uploading','ready');
 IF used>=a.photo_limit THEN RETURN jsonb_build_object('accepted',false,'reason','limit'); END IF;
 pid:=gen_random_uuid();
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,reservation_expires_at)
 VALUES(pid,a.id,a.id::text||'/'||pid::text,p_request_id,'reserved',now()+interval '15 minutes');
 RETURN jsonb_build_object('accepted',true,'photoId',pid);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_webmaster_read(p_actor uuid, p_action text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_version integer; v_albums jsonb;
begin
 if p_actor is null or p_action is null or p_action not in ('role_check','installation_status','list') then
  raise exception 'Invalid request' using errcode='22023';
 end if;
 if not exists(select 1 from remember.webmasters where user_id=p_actor) then
  return jsonb_build_object('authorized',false);
 end if;
 if p_action='role_check' then return jsonb_build_object('authorized',true); end if;
 if p_action='installation_status' then
  select max(version) into v_version from remember.schema_migrations;
  return jsonb_build_object('authorized',true,'schemaVersion',v_version,'expectedVersion',2,'ready',v_version=2);
 end if;
 select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) into v_albums from (
  select x.id,x.slug,x.title,x.event_timezone,x.default_opens_at,x.default_closes_at,
   x.override_opens_at,x.override_closes_at,x.forced_closed,x.revision,x.is_active,
   x.owner_user_id,coalesce(u.email,'') as owner_email
  from remember.albums x left join auth.users u on u.id=x.owner_user_id
  order by x.created_at desc limit 100
 ) a;
 return jsonb_build_object('authorized',true,'albums',v_albums);
end
$function$;

CREATE OR REPLACE FUNCTION public.remember_photo_approval_owner_decide(p_actor uuid, p_album uuid, p_photo uuid, p_decision text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
 IF NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=p_album AND
 (is_active OR EXISTS(SELECT 1 FROM remember.webmasters WHERE user_id=p_actor)))
 THEN RAISE EXCEPTION 'album_inactive' USING ERRCODE='42501'; END IF;
 IF p_actor IS NULL OR NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=p_album AND owner_user_id=p_actor)
 THEN RAISE EXCEPTION 'album_owner_required' USING ERRCODE='42501'; END IF;
 IF p_decision NOT IN ('approved','rejected') THEN RAISE EXCEPTION 'invalid_decision' USING ERRCODE='22023'; END IF;
 IF NOT public.remember_security_effective_feature_read(p_album,'photo_approval')
 THEN RAISE EXCEPTION 'feature_disabled' USING ERRCODE='22023'; END IF;
 PERFORM 1 FROM remember.photo_approval_queue q JOIN remember.album_photos p ON p.id=q.photo_id
 WHERE q.photo_id=p_photo AND q.album_id=p_album AND p.album_id=p_album AND p.state='ready' FOR UPDATE OF q;
 IF NOT FOUND THEN RAISE EXCEPTION 'photo_not_in_queue' USING ERRCODE='22023'; END IF;
 UPDATE remember.photo_approval_queue SET decision=p_decision,decided_by=p_actor,decided_at=now()
 WHERE photo_id=p_photo AND album_id=p_album AND decision='pending';
 IF NOT FOUND THEN RAISE EXCEPTION 'already_decided' USING ERRCODE='22023'; END IF;
 RETURN jsonb_build_object('ok',true,'photoId',p_photo,'decision',p_decision);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_photo_approval_owner_queue_read(p_actor uuid, p_album uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_result jsonb; v_active boolean;
BEGIN
 IF NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=p_album AND
 (is_active OR EXISTS(SELECT 1 FROM remember.webmasters WHERE user_id=p_actor)))
 THEN RAISE EXCEPTION 'album_inactive' USING ERRCODE='42501'; END IF;
 IF p_actor IS NULL OR p_album IS NULL OR NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=p_album AND owner_user_id=p_actor)
 THEN RAISE EXCEPTION 'album_owner_required' USING ERRCODE='42501'; END IF;
 v_active:=public.remember_security_effective_feature_read(p_album,'photo_approval');
 SELECT coalesce(jsonb_agg(jsonb_build_object('photo_id',q.photo_id,'decision',q.decision,'created_at',q.created_at,'decided_at',q.decided_at,'expires_at',CASE WHEN q.decision='rejected' THEN q.decided_at+interval '72 hours' ELSE NULL END,'object_key',p.object_key) ORDER BY q.created_at DESC),'[]'::jsonb)
 INTO v_result FROM remember.photo_approval_queue q JOIN remember.album_photos p ON p.id=q.photo_id
 WHERE q.album_id=p_album AND p.album_id=p_album AND p.state='ready';
 RETURN jsonb_build_object('photos',v_result,'readOnly',NOT v_active,'featureEnabled',v_active);
END $function$;

CREATE OR REPLACE FUNCTION public.remember_photo_quarantine_restore(p_actor uuid, p_album uuid, p_photo uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_limit integer;v_used integer;v_decided timestamptz;
BEGIN
 IF p_actor IS NULL OR p_album IS NULL OR p_photo IS NULL THEN RAISE EXCEPTION 'invalid_request' USING ERRCODE='22023'; END IF;
 SELECT photo_limit INTO v_limit FROM remember.albums WHERE id=p_album AND owner_user_id=p_actor
 AND (is_active OR EXISTS(SELECT 1 FROM remember.webmasters WHERE user_id=p_actor)) FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'album_owner_required' USING ERRCODE='42501'; END IF;
 IF NOT public.remember_security_effective_feature_read(p_album,'photo_approval') THEN RAISE EXCEPTION 'feature_disabled' USING ERRCODE='22023'; END IF;
 SELECT q.decided_at INTO v_decided FROM remember.photo_approval_queue q JOIN remember.album_photos p ON p.id=q.photo_id
 WHERE q.photo_id=p_photo AND q.album_id=p_album AND p.album_id=p_album AND p.state='ready' AND q.decision='rejected' FOR UPDATE OF q;
 IF NOT FOUND THEN RAISE EXCEPTION 'not_quarantined' USING ERRCODE='22023'; END IF;
 IF EXISTS(SELECT 1 FROM remember.photo_quarantine_purge_claims WHERE photo_id=p_photo) THEN RAISE EXCEPTION 'purge_in_progress' USING ERRCODE='22023'; END IF;
 IF v_decided IS NULL OR v_decided+interval '72 hours'<=now() THEN RAISE EXCEPTION 'quarantine_expired' USING ERRCODE='22023'; END IF;
 SELECT count(*) INTO v_used FROM remember.album_photos p WHERE p.album_id=p_album AND p.state IN ('reserved','uploading','ready')
 AND NOT EXISTS(SELECT 1 FROM remember.photo_approval_queue q WHERE q.photo_id=p.id AND q.decision='rejected');
 IF v_used>=v_limit THEN RAISE EXCEPTION 'album_limit_reached' USING ERRCODE='22023'; END IF;
 UPDATE remember.photo_approval_queue SET decision='approved',decided_at=now(),decided_by=p_actor WHERE photo_id=p_photo AND album_id=p_album AND decision='rejected';
 RETURN jsonb_build_object('ok',true,'photoId',p_photo,'decision','approved');
END $function$;

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
 if not exists(select 1 from remember.webmasters w join auth.users u on u.id=w.user_id where w.user_id=p_actor and u.email_confirmed_at is not null and u.deleted_at is null and (u.banned_until is null or u.banned_until<=now())) then
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
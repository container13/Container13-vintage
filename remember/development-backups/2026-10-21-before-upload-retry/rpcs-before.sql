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
END $function$


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
END $function$


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
END $function$


CREATE OR REPLACE FUNCTION public.remember_photo_fail_upload(p_photo_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
 IF p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state NOT IN ('reserved','uploading')
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='failed' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $function$


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
END $function$


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
END $function$

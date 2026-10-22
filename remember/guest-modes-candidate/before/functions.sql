CREATE OR REPLACE FUNCTION public.remember_security_effective_feature_read(p_album uuid, p_feature text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'remember'
AS $function$ DECLARE v_mode text; v_enabled boolean; BEGIN IF p_album IS NULL OR p_feature IS NULL OR p_feature NOT IN ('verified_guest_email','photo_approval','guest_reports','report_notifications','slideshow_pause','quota_notifications') THEN RETURN false; END IF; SELECT f.mode INTO v_mode FROM remember.security_feature_flags f WHERE f.feature_key=p_feature; IF v_mode IS DISTINCT FROM 'TEST' THEN RETURN false; END IF; IF NOT EXISTS(SELECT 1 FROM remember.security_test_eligibility e WHERE e.feature_key=p_feature AND e.album_id=p_album) THEN RETURN false; END IF; IF p_feature='quota_notifications' THEN RETURN true; END IF; SELECT CASE p_feature WHEN 'verified_guest_email' THEN s.require_verified_email WHEN 'photo_approval' THEN s.require_photo_approval WHEN 'guest_reports' THEN s.allow_reports WHEN 'report_notifications' THEN s.notify_reports WHEN 'slideshow_pause' THEN s.pause_new_slideshow_photos ELSE false END INTO v_enabled FROM remember.security_album_settings s WHERE s.album_id=p_album; RETURN COALESCE(v_enabled,false); END $function$
;

CREATE OR REPLACE FUNCTION remember.queue_photo_for_approval()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
 IF NEW.state='ready' AND OLD.state IS DISTINCT FROM 'ready'
 AND public.remember_security_effective_feature_read(NEW.album_id,'photo_approval') THEN
  INSERT INTO remember.photo_approval_queue(photo_id,album_id,decision)
  VALUES(NEW.id,NEW.album_id,'pending') ON CONFLICT(photo_id) DO NOTHING;
 END IF;
 RETURN NEW;
END $function$
;

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
END $function$
;

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
END $function$
;

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
END $function$
;
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
END $function$
;

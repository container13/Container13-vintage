-- REVIEW ONLY. Not installed. Run as one transaction after project-owner approval.
-- Existing albums retain open guest mode; legacy feature flags are unchanged.
BEGIN;
ALTER TABLE remember.pending_album_registrations ADD COLUMN guest_mode text NOT NULL DEFAULT 'open'
 CHECK (guest_mode IN ('open','reviewed'));
ALTER TABLE remember.albums ADD COLUMN guest_mode text NOT NULL DEFAULT 'open'
 CHECK (guest_mode IN ('open','reviewed'));

-- Service-only entry point: actor comes from Edge auth.getUser, never browser input.
-- Definer is required to read auth.users, which service_role cannot SELECT directly.
CREATE FUNCTION public.remember_complete_album_registration(p_actor uuid,p_request_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $body$
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
   draft.starts_at,draft.starts_at+draft.days*interval '24 hours',10,draft.guest_mode);
 END IF;
 UPDATE remember.pending_album_registrations SET consumed_at=coalesce(consumed_at,now()),album_id=draft.id WHERE id=draft.id;
 RETURN jsonb_build_object('ok',true,'created',true,'albumId',draft.id,'guestMode',draft.guest_mode);
END $body$;
REVOKE ALL ON FUNCTION public.remember_complete_album_registration(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_complete_album_registration(uuid,uuid) TO service_role;

-- Replacement definitions appended by build script below.
CREATE OR REPLACE FUNCTION public.remember_security_effective_feature_read(p_album uuid, p_feature text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'remember'
AS $function$ DECLARE v_mode text; v_enabled boolean; BEGIN IF p_album IS NULL OR p_feature IS NULL OR p_feature NOT IN ('verified_guest_email','photo_approval','guest_reports','report_notifications','slideshow_pause','quota_notifications') THEN RETURN false; END IF; IF p_feature='photo_approval' AND EXISTS(SELECT 1 FROM remember.albums WHERE id=p_album AND guest_mode='reviewed') THEN RETURN true; END IF; SELECT f.mode INTO v_mode FROM remember.security_feature_flags f WHERE f.feature_key=p_feature; IF v_mode IS DISTINCT FROM 'TEST' THEN RETURN false; END IF; IF NOT EXISTS(SELECT 1 FROM remember.security_test_eligibility e WHERE e.feature_key=p_feature AND e.album_id=p_album) THEN RETURN false; END IF; IF p_feature='quota_notifications' THEN RETURN true; END IF; SELECT CASE p_feature WHEN 'verified_guest_email' THEN s.require_verified_email WHEN 'photo_approval' THEN s.require_photo_approval WHEN 'guest_reports' THEN s.allow_reports WHEN 'report_notifications' THEN s.notify_reports WHEN 'slideshow_pause' THEN s.pause_new_slideshow_photos ELSE false END INTO v_enabled FROM remember.security_album_settings s WHERE s.album_id=p_album; RETURN COALESCE(v_enabled,false); END $function$
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
  AND (NOT v_moderated OR EXISTS(
   SELECT 1 FROM remember.photo_approval_queue q WHERE q.photo_id=p.id AND q.album_id=p.album_id AND q.decision='approved'
  ))
  ORDER BY p.created_at DESC,p.id DESC LIMIT 100
 ) p;
 RETURN jsonb_build_object('authorized',true,'photos',items);
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
 v_album uuid;
 v_opens timestamptz;
 v_closes timestamptz;
 v_closed boolean;
 v_active boolean;
BEGIN
 IF p_token_hash IS NULL OR octet_length(p_token_hash) <> 32
 THEN RETURN jsonb_build_object('found', false); END IF;

 SELECT a.id,a.title,
        COALESCE(a.override_opens_at, a.default_opens_at),
        COALESCE(a.override_closes_at, a.default_closes_at),
        a.forced_closed,a.is_active
 INTO v_album,v_title, v_opens, v_closes, v_closed,v_active
 FROM remember.guest_links g
 JOIN remember.albums a ON a.id = g.album_id
 WHERE g.token_sha256 = p_token_hash AND g.revoked_at IS NULL;

 IF NOT FOUND THEN RETURN jsonb_build_object('found', false); END IF;
 IF NOT v_active THEN RETURN jsonb_build_object('found',true,'active',false,'uploadsOpen',false); END IF;

 RETURN jsonb_build_object(
  'found', true,
  'title', v_title,
  'photoApproval', public.remember_security_effective_feature_read(v_album,'photo_approval'),
  'uploadsOpen', NOT COALESCE(v_closed, true)
     AND now() >= v_opens AND now() < v_closes
 );
END $function$
;
COMMIT;

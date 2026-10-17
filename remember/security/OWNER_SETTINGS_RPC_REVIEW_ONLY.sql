-- REVIEW ONLY: NEVER EXECUTE IN PRODUCTION.
-- Install ONLY after separate schema candidate is reviewed in Remember Test.
-- New server-only RPC: owner setting mutations, with atomic audit and retry ledger.
BEGIN;
CREATE TABLE remember.security_request_ledger (
 request_id uuid PRIMARY KEY,
 actor_user_id uuid NOT NULL,
 request_payload jsonb NOT NULL,
 result jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE remember.security_request_ledger ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember.security_request_ledger FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.remember_security_owner_setting_write(
 p_actor uuid, p_request_id uuid, p_album uuid, p_setting text, p_enabled boolean
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $body$
DECLARE
 v_payload jsonb;
 v_existing remember.security_request_ledger%ROWTYPE;
 v_before boolean;
 v_result jsonb;
BEGIN
 IF p_actor IS NULL OR p_request_id IS NULL OR p_album IS NULL OR p_setting IS NULL OR p_enabled IS NULL
 THEN RAISE EXCEPTION 'Missing argument' USING ERRCODE='22023'; END IF;
 IF p_setting NOT IN ('require_verified_email','require_photo_approval',
   'allow_reports','notify_reports','pause_new_slideshow_photos')
 THEN RAISE EXCEPTION 'Invalid setting' USING ERRCODE='22023'; END IF;
 v_payload := jsonb_build_array(p_actor,p_album,p_setting,p_enabled);
 PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_request_id::text,0));
 SELECT * INTO v_existing FROM remember.security_request_ledger WHERE request_id=p_request_id;
 IF FOUND THEN
  IF v_existing.actor_user_id<>p_actor OR v_existing.request_payload<>v_payload
  THEN RAISE EXCEPTION 'Request conflict' USING ERRCODE='23505'; END IF;
  RETURN v_existing.result;
 END IF;
 -- The actor must have been authenticated by the Edge Function before this RPC.
 PERFORM 1 FROM remember.albums WHERE id=p_album AND owner_user_id=p_actor FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Forbidden' USING ERRCODE='42501'; END IF;
 INSERT INTO remember.security_album_settings(album_id) VALUES(p_album)
 ON CONFLICT(album_id) DO NOTHING;
 PERFORM 1 FROM remember.security_album_settings WHERE album_id=p_album FOR UPDATE;
 CASE p_setting
  WHEN 'require_verified_email' THEN
   SELECT require_verified_email INTO v_before FROM remember.security_album_settings WHERE album_id=p_album;
   UPDATE remember.security_album_settings SET require_verified_email=p_enabled,updated_by=p_actor,updated_at=now() WHERE album_id=p_album;
  WHEN 'require_photo_approval' THEN
   SELECT require_photo_approval INTO v_before FROM remember.security_album_settings WHERE album_id=p_album;
   UPDATE remember.security_album_settings SET require_photo_approval=p_enabled,updated_by=p_actor,updated_at=now() WHERE album_id=p_album;
  WHEN 'allow_reports' THEN
   SELECT allow_reports INTO v_before FROM remember.security_album_settings WHERE album_id=p_album;
   UPDATE remember.security_album_settings SET allow_reports=p_enabled,updated_by=p_actor,updated_at=now() WHERE album_id=p_album;
  WHEN 'notify_reports' THEN
   SELECT notify_reports INTO v_before FROM remember.security_album_settings WHERE album_id=p_album;
   UPDATE remember.security_album_settings SET notify_reports=p_enabled,updated_by=p_actor,updated_at=now() WHERE album_id=p_album;
  WHEN 'pause_new_slideshow_photos' THEN
   SELECT pause_new_slideshow_photos INTO v_before FROM remember.security_album_settings WHERE album_id=p_album;
   UPDATE remember.security_album_settings SET pause_new_slideshow_photos=p_enabled,updated_by=p_actor,updated_at=now() WHERE album_id=p_album;
 END CASE;
 INSERT INTO remember.security_settings_audit(actor_user_id,album_id,setting_scope,setting_key,previous_value,next_value)
 VALUES(p_actor,p_album,'album',p_setting,to_jsonb(v_before),to_jsonb(p_enabled));
 v_result:=jsonb_build_object('ok',true,'albumId',p_album,'setting',p_setting,'enabled',p_enabled);
 INSERT INTO remember.security_request_ledger(request_id,actor_user_id,request_payload,result)
 VALUES(p_request_id,p_actor,v_payload,v_result);
 RETURN v_result;
END;
$body$;
REVOKE ALL ON FUNCTION public.remember_security_owner_setting_write(uuid,uuid,uuid,text,boolean)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_security_owner_setting_write(uuid,uuid,uuid,text,boolean)
 TO service_role;
COMMIT;
-- BLOCKED: feature flags must remain OFF; this RPC must not be called from browser.
-- Required before use: Auth-verified Edge Function, permission tests, rollback tests,
-- and explicit migration approval.

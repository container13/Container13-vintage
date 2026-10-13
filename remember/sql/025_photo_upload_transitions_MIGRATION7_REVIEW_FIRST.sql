-- REVIEW FIRST. Remember migration 7 candidate. Not installed.
-- Requires migration 6, private storage bucket, and server-only verified object checks.
BEGIN;
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version=6)
 OR EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version>=7)
 THEN RAISE EXCEPTION 'Expected Remember schema version 6'; END IF;
END $$;

CREATE FUNCTION public.remember_photo_begin_upload(p_photo_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
 IF p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state<>'reserved' OR v_photo.reservation_expires_at<=now()
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='uploading' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true,'objectKey',v_photo.object_key);
END $fn$;

-- IMPORTANT: This RPC only changes database state. The privileged Edge Function
-- must independently verify storage object integrity before invoking completion.
CREATE FUNCTION public.remember_photo_complete_upload(p_photo_id uuid, p_token_hash bytea)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
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
END $fn$;

-- Only release a failed transfer after the privileged server verified
-- that its private storage object is absent (or was successfully removed).
CREATE FUNCTION public.remember_photo_fail_upload(p_photo_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
 IF p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state NOT IN ('reserved','uploading')
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='failed' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $fn$;

REVOKE ALL ON FUNCTION public.remember_photo_begin_upload(uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.remember_photo_complete_upload(uuid,bytea) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.remember_photo_fail_upload(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_photo_fail_upload(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.remember_photo_begin_upload(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.remember_photo_complete_upload(uuid,bytea) TO service_role;
INSERT INTO remember.schema_migrations(version,description)
VALUES(7,'Server-only upload state transitions; endpoint not deployed');
COMMIT;

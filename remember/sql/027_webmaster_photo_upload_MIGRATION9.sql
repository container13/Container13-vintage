-- Webmaster upload uses verified Supabase user identity, never a guest token.
BEGIN;
DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM remember.schema_migrations WHERE version=8)
 OR EXISTS(SELECT 1 FROM remember.schema_migrations WHERE version>=9)
 THEN RAISE EXCEPTION 'Expected Remember schema version 8'; END IF; END $$;
CREATE FUNCTION public.remember_webmaster_photo_reserve(p_actor uuid,p_album_id uuid,p_request_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE a remember.albums%ROWTYPE; existing remember.album_photos%ROWTYPE; used integer; pid uuid;
BEGIN
 IF p_actor IS NULL OR p_album_id IS NULL OR p_request_id IS NULL
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 IF NOT EXISTS(SELECT 1 FROM remember.webmasters w WHERE w.user_id=p_actor)
 THEN RETURN jsonb_build_object('accepted',false,'reason','forbidden'); END IF;
 SELECT * INTO a FROM remember.albums WHERE id=p_album_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','not_found'); END IF;
 SELECT * INTO existing FROM remember.album_photos WHERE album_id=a.id AND idempotency_key=p_request_id;
 IF FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','existing'); END IF;
 IF a.forced_closed OR now()<coalesce(a.override_opens_at,a.default_opens_at)
 OR now()>=coalesce(a.override_closes_at,a.default_closes_at)
 THEN RETURN jsonb_build_object('accepted',false,'reason','closed'); END IF;
 UPDATE remember.album_photos SET state='failed'
 WHERE album_id=a.id AND state='reserved' AND reservation_expires_at<=now();
 SELECT count(*) INTO used FROM remember.album_photos
 WHERE album_id=a.id AND state IN ('reserved','uploading','ready');
 IF used>=a.photo_limit THEN RETURN jsonb_build_object('accepted',false,'reason','limit'); END IF;
 pid:=gen_random_uuid();
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,reservation_expires_at)
 VALUES(pid,a.id,a.id::text||'/'||pid::text,p_request_id,'reserved',now()+interval '15 minutes');
 RETURN jsonb_build_object('accepted',true,'photoId',pid);
END $fn$;
CREATE FUNCTION public.remember_webmaster_photo_complete(p_actor uuid,p_photo_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE p remember.album_photos%ROWTYPE;
BEGIN
 IF p_actor IS NULL OR p_photo_id IS NULL OR NOT EXISTS(SELECT 1 FROM remember.webmasters WHERE user_id=p_actor)
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO p FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR p.state<>'uploading' THEN RETURN jsonb_build_object('accepted',false); END IF;
 IF NOT EXISTS(SELECT 1 FROM remember.albums a WHERE a.id=p.album_id AND NOT a.forced_closed
 AND now()>=coalesce(a.override_opens_at,a.default_opens_at)
 AND now()<coalesce(a.override_closes_at,a.default_closes_at))
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='ready' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $fn$;
REVOKE ALL ON FUNCTION public.remember_webmaster_photo_reserve(uuid,uuid,uuid) FROM PUBLIC,anon,authenticated;
REVOKE ALL ON FUNCTION public.remember_webmaster_photo_complete(uuid,uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_webmaster_photo_reserve(uuid,uuid,uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.remember_webmaster_photo_complete(uuid,uuid) TO service_role;
INSERT INTO remember.schema_migrations(version,description) VALUES(9,'Verified webmaster photo reservation and completion');
COMMIT;
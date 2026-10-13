-- REVIEW FIRST. Remember migration 6. Run only in container13-remember after schema version 5.
-- Creates a server-only atomic reservation gateway. Does NOT enable uploads or create storage buckets.
BEGIN;
DO $preflight$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version=5)
 OR EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version>=6)
 THEN RAISE EXCEPTION 'Expected Remember schema version 5'; END IF;
END $preflight$;

CREATE FUNCTION public.remember_guest_photo_reserve(p_token_hash bytea, p_request_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
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

 SELECT * INTO v_existing FROM remember.album_photos
 WHERE album_id=v_album.id AND idempotency_key=p_request_id;
 IF FOUND THEN
   RETURN jsonb_build_object('accepted',v_existing.state IN ('reserved','uploading','ready'),
     'reason','existing','photoId',v_existing.id);
 END IF;

 IF v_album.forced_closed OR now()<COALESCE(v_album.override_opens_at,v_album.default_opens_at)
 OR now()>=COALESCE(v_album.override_closes_at,v_album.default_closes_at)
 THEN RETURN jsonb_build_object('accepted',false,'reason','closed'); END IF;

 SELECT count(*) INTO v_used FROM remember.album_photos
 WHERE album_id=v_album.id AND state IN ('reserved','uploading','ready');
 IF v_used>=v_album.photo_limit
 THEN RETURN jsonb_build_object('accepted',false,'reason','limit'); END IF;

 v_photo_id:=gen_random_uuid();
 v_key:=v_album.id::text||'/'||v_photo_id::text;
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,reservation_expires_at)
 VALUES(v_photo_id,v_album.id,v_key,p_request_id,'reserved',now()+interval '15 minutes');

 RETURN jsonb_build_object('accepted',true,'reason','reserved','photoId',v_photo_id);
END $fn$;

REVOKE ALL ON FUNCTION public.remember_guest_photo_reserve(bytea,uuid)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_guest_photo_reserve(bytea,uuid)
 TO service_role;

INSERT INTO remember.schema_migrations(version,description)
VALUES(6,'Atomic guest photo reservation gateway; storage disabled');
COMMIT;

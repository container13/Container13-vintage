-- REVIEW FIRST / NOT DEPLOYED. Content deduplication after migrations 6 and 7.
-- Requires reviewed server flow to compute SHA-256 over canonical uploaded bytes.
-- Do NOT apply to production until reservation/retry/reconciliation are complete.
BEGIN;
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version=7)
 OR EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version>=8)
 THEN RAISE EXCEPTION 'Expected Remember schema version 7'; END IF;
END $$;

ALTER TABLE remember.album_photos
 ADD COLUMN content_sha256 bytea
 CONSTRAINT remember_photo_digest_32_bytes CHECK
 (content_sha256 IS NULL OR octet_length(content_sha256)=32);

-- Duplicate prevention is album-scoped and concurrency-safe at database level.
-- Keep a digest for uploading AND ready objects: concurrent requests cannot
-- both claim the same content. Failed/deleted rows no longer occupy a digest.
CREATE UNIQUE INDEX remember_album_active_content_unique
 ON remember.album_photos(album_id, content_sha256)
 WHERE content_sha256 IS NOT NULL AND state IN ('uploading','ready');

-- New privileged claim RPC replaces begin_upload for the photo-upload endpoint.
-- A UNIQUE constraint race is caught in the same transaction. This does not
-- perform storage I/O, and never releases a quota slot on uncertain storage.
CREATE FUNCTION public.remember_photo_claim_upload(p_photo_id uuid, p_content_sha256 bytea)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
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
END $fn$;
REVOKE ALL ON FUNCTION public.remember_photo_claim_upload(uuid,bytea)
 FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_photo_claim_upload(uuid,bytea) TO service_role;

-- Migration 7's legacy begin_upload lacks a digest. Remove its service-role
-- execute privilege so the digest claim is the only supported start path.
REVOKE EXECUTE ON FUNCTION public.remember_photo_begin_upload(uuid) FROM service_role;

-- The privileged server must set the digest BEFORE storage upload, atomically
-- with the reserved->uploading transition. A unique violation means the same
-- canonical bytes are already uploading/ready in that album; do not upload.
-- Never grant direct UPDATE to anon/authenticated; use a reviewed RPC.
-- Failed upload must only be marked failed after object absence is verified.
-- IMPORTANT: This migration ALONE does not enable uploads or safely handle retries.
INSERT INTO remember.schema_migrations(version,description)
 VALUES(8,'Review-only album-scoped exact SHA-256 uniqueness for active photos');
COMMIT;

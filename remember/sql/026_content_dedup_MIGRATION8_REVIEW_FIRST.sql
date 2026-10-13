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

-- The privileged server must set the digest BEFORE storage upload, atomically
-- with the reserved->uploading transition. A unique violation means the same
-- canonical bytes are already uploading/ready in that album; do not upload.
-- Never grant direct UPDATE to anon/authenticated; use a reviewed RPC.
-- Failed upload must only be marked failed after object absence is verified.
-- IMPORTANT: This migration ALONE does not enable uploads or safely handle retries.
INSERT INTO remember.schema_migrations(version,description)
 VALUES(8,'Review-only album-scoped exact SHA-256 uniqueness for active photos');
COMMIT;

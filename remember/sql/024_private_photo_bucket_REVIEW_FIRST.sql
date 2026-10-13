-- REVIEW FIRST. Dedicated Remember project only. Not deployed.
BEGIN;
DO $$ BEGIN
 IF NOT EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version=6) THEN
 RAISE EXCEPTION 'Migration 6 required'; END IF;
 IF EXISTS (SELECT 1 FROM storage.buckets WHERE id='remember-private-photos') THEN
 RAISE EXCEPTION 'Bucket exists'; END IF;
END $$;
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
VALUES ('remember-private-photos','remember-private-photos',false,10485760,
ARRAY['image/jpeg','image/png','image/webp']::text[]);
COMMIT;

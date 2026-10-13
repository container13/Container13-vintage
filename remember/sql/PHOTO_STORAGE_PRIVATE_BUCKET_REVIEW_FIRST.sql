-- Container13 Remember: REVIEW FIRST, NOT YET INSTALLED.
-- Target only the dedicated container13-remember Supabase project.
-- Prerequisites: confirm storage schema and bucket name; do not replay existing Remember migrations 1–5.
-- Private bucket only. No anonymous read/write policies are created here.
-- All guest access must go through a separately reviewed, server-authenticated Edge Function.

BEGIN;
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('remember-photos', 'remember-photos', false, 10485760, ARRAY['image/jpeg','image/png','image/webp']::text[])
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets
    WHERE id = 'remember-photos' AND name = 'remember-photos' AND public = false
  ) THEN
    RAISE EXCEPTION 'Remember photo bucket mismatch: refusing to continue';
  END IF;
END $$;
COMMIT;

-- Read-only post-install check:
-- SELECT id, name, public, file_size_limit, allowed_mime_types
-- FROM storage.buckets WHERE id = 'remember-photos';

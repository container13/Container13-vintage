-- REVIEW FIRST. Do not run automatically. Remember project only.
-- Migration 5: service-role-only lookup of public album metadata by token hash.
BEGIN;
DO $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version = 4)
 OR EXISTS (SELECT 1 FROM remember.schema_migrations WHERE version >= 5)
 THEN RAISE EXCEPTION 'Expected migration 4 without later migrations'; END IF;
END $$;

CREATE FUNCTION public.remember_guest_metadata_read(p_token_hash bytea)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
 v_title text;
 v_opens timestamptz;
 v_closes timestamptz;
 v_closed boolean;
BEGIN
 IF p_token_hash IS NULL OR octet_length(p_token_hash) <> 32
 THEN RETURN jsonb_build_object('found', false); END IF;

 SELECT a.title,
        COALESCE(a.override_opens_at, a.default_opens_at),
        COALESCE(a.override_closes_at, a.default_closes_at),
        a.forced_closed
 INTO v_title, v_opens, v_closes, v_closed
 FROM remember.guest_links g
 JOIN remember.albums a ON a.id = g.album_id
 WHERE g.token_sha256 = p_token_hash AND g.revoked_at IS NULL;

 IF NOT FOUND THEN RETURN jsonb_build_object('found', false); END IF;

 RETURN jsonb_build_object(
  'found', true,
  'title', v_title,
  'uploadsOpen', NOT COALESCE(v_closed, true)
     AND now() >= v_opens AND now() < v_closes
 );
END $$;

REVOKE ALL ON FUNCTION public.remember_guest_metadata_read(bytea)
 FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.remember_guest_metadata_read(bytea)
 TO service_role;

INSERT INTO remember.schema_migrations(version, description)
VALUES (5, 'Service-only guest metadata lookup; no guest photo access');
COMMIT;

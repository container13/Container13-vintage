BEGIN;
DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM remember.schema_migrations WHERE version=9) OR EXISTS(SELECT 1 FROM remember.schema_migrations WHERE version>=10) THEN RAISE EXCEPTION 'Expected Remember schema 9'; END IF; END $$;
CREATE FUNCTION public.remember_photo_gallery_read(p_actor uuid,p_album_id uuid,p_token_hash bytea)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $fn$
DECLARE aid uuid; items jsonb;
BEGIN
 IF p_actor IS NOT NULL AND p_album_id IS NOT NULL AND p_token_hash IS NULL THEN
  IF NOT EXISTS(SELECT 1 FROM remember.webmasters WHERE user_id=p_actor) THEN RETURN jsonb_build_object('authorized',false); END IF;
  aid:=p_album_id;
 ELSIF p_actor IS NULL AND p_album_id IS NULL AND p_token_hash IS NOT NULL AND octet_length(p_token_hash)=32 THEN
  SELECT album_id INTO aid FROM remember.guest_links WHERE token_sha256=p_token_hash AND revoked_at IS NULL;
 ELSE RETURN jsonb_build_object('authorized',false); END IF;
 IF aid IS NULL OR NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=aid) THEN RETURN jsonb_build_object('authorized',false); END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object('id',id,'objectKey',object_key,'createdAt',created_at) ORDER BY created_at DESC,id DESC),'[]'::jsonb)
 INTO items FROM (SELECT id,object_key,created_at FROM remember.album_photos WHERE album_id=aid AND state='ready' ORDER BY created_at DESC,id DESC LIMIT 100) p;
 RETURN jsonb_build_object('authorized',true,'photos',items);
END $fn$;
REVOKE ALL ON FUNCTION public.remember_photo_gallery_read(uuid,uuid,bytea) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_photo_gallery_read(uuid,uuid,bytea) TO service_role;
INSERT INTO remember.schema_migrations(version,description) VALUES(10,'Private gallery read with verified guest or webmaster authorization');
COMMIT;
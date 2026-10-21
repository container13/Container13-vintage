-- Additive service-only boundary. Filename generated with Supabase CLI 2.121.0.
-- Edge authenticates identity and verifies stored bytes. Existing RPCs unchanged.
CREATE OR REPLACE FUNCTION public.remember_photo_upload_request(
 p_actor uuid, p_album_id uuid, p_token_hash bytea, p_request_id uuid,
 p_content_sha256 bytea, p_action text DEFAULT 'prepare'
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $function$
DECLARE
 a remember.albums%ROWTYPE; p remember.album_photos%ROWTYPE;
 r jsonb; used integer; guest boolean:=p_token_hash IS NOT NULL;
BEGIN
 IF p_request_id IS NULL OR p_content_sha256 IS NULL OR octet_length(p_content_sha256)<>32
 OR p_action IS NULL OR p_action NOT IN ('prepare','complete')
 OR (guest AND (octet_length(p_token_hash)<>32 OR p_actor IS NOT NULL OR p_album_id IS NOT NULL))
 OR (NOT guest AND (p_actor IS NULL OR p_album_id IS NULL))
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 IF guest THEN
  SELECT al.* INTO a FROM remember.albums al JOIN remember.guest_links g ON g.album_id=al.id
  WHERE g.token_sha256=p_token_hash AND g.revoked_at IS NULL FOR UPDATE OF al;
 ELSE
  SELECT * INTO a FROM remember.albums WHERE id=p_album_id FOR UPDATE;
 END IF;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 IF guest THEN
  IF NOT EXISTS(SELECT 1 FROM remember.guest_links g WHERE g.album_id=a.id
    AND g.token_sha256=p_token_hash AND g.revoked_at IS NULL)
  THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 ELSIF a.owner_user_id IS DISTINCT FROM p_actor THEN
  RETURN jsonb_build_object('accepted',false,'reason','forbidden');
 END IF;
 IF NOT a.is_active THEN RETURN jsonb_build_object('accepted',false,'reason','album_inactive'); END IF;
 SELECT * INTO p FROM remember.album_photos WHERE album_id=a.id AND idempotency_key=p_request_id FOR UPDATE;
 IF FOUND THEN
  IF p.content_sha256 IS NOT NULL AND p.content_sha256<>p_content_sha256
  THEN RETURN jsonb_build_object('accepted',false,'reason','content_conflict'); END IF;
  IF p.state='ready' AND p.content_sha256=p_content_sha256
  THEN RETURN jsonb_build_object('accepted',true,'state','ready','photoId',p.id); END IF;
  IF p.state='deleted' THEN RETURN jsonb_build_object('accepted',false,'reason','deleted'); END IF;
 END IF;
 -- Ready acknowledgement is read-only; new guest writes always check the window.
 -- Preserve the existing owner's ability to upload outside the guest window.
 IF guest AND (a.forced_closed OR clock_timestamp()<COALESCE(a.override_opens_at,a.default_opens_at)
   OR clock_timestamp()>=COALESCE(a.override_closes_at,a.default_closes_at))
 THEN RETURN jsonb_build_object('accepted',false,'reason','closed'); END IF;
 IF p_action='complete' THEN
  IF p.id IS NULL OR p.state<>'uploading' OR p.content_sha256 IS DISTINCT FROM p_content_sha256
  THEN RETURN jsonb_build_object('accepted',false,'reason','invalid_state'); END IF;
  UPDATE remember.album_photos SET state='ready' WHERE id=p.id;
  RETURN jsonb_build_object('accepted',true,'state','ready','photoId',p.id);
 END IF;
 IF p.id IS NULL THEN
  IF guest THEN r:=public.remember_guest_photo_reserve(p_token_hash,p_request_id);
  ELSE r:=public.remember_webmaster_photo_reserve(p_actor,a.id,p_request_id); END IF;
  IF r->>'accepted' IS DISTINCT FROM 'true' THEN RETURN r; END IF;
  SELECT * INTO p FROM remember.album_photos WHERE id=(r->>'photoId')::uuid FOR UPDATE;
 ELSIF p.state='uploading' AND p.content_sha256=p_content_sha256 THEN
  -- Immutable Storage, no slot release: concurrent identical retries converge.
  RETURN jsonb_build_object('accepted',true,'state','uploading','photoId',p.id,'objectKey',p.object_key);
 ELSIF p.state='failed' OR (p.state='reserved' AND p.reservation_expires_at<=clock_timestamp()) THEN
  UPDATE remember.album_photos SET state='failed' WHERE album_id=a.id AND state='reserved'
    AND reservation_expires_at<=clock_timestamp();
  SELECT count(*) INTO used FROM remember.album_photos WHERE album_id=a.id AND state IN ('reserved','uploading','ready');
  IF used>=a.photo_limit THEN RETURN jsonb_build_object('accepted',false,'reason','limit'); END IF;
  UPDATE remember.album_photos SET state='reserved',reservation_expires_at=clock_timestamp()+interval '15 minutes'
    WHERE id=p.id;
 END IF;
 r:=public.remember_photo_claim_upload(p.id,p_content_sha256);
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RETURN r; END IF;
 RETURN jsonb_build_object('accepted',true,'state','uploading','photoId',p.id,'objectKey',r->>'objectKey');
END $function$;
REVOKE ALL ON FUNCTION public.remember_photo_upload_request(uuid,uuid,bytea,uuid,bytea,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.remember_photo_upload_request(uuid,uuid,bytea,uuid,bytea,text) TO service_role;

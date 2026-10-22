-- Execute only after the reviewed installation, as the whole BEGIN...ROLLBACK.
-- Only new disposable metadata. No email, Storage or existing album/photo change.
BEGIN;
DO $test$
DECLARE actor uuid; mail text; aid uuid; pid uuid; req uuid; token bytea;
 chosen text; result jsonb; listing jsonb;
BEGIN
 SELECT id,email INTO actor,mail FROM auth.users WHERE email_confirmed_at IS NOT NULL
 AND deleted_at IS NULL AND (banned_until IS NULL OR banned_until<=now()) LIMIT 1;
 IF actor IS NULL THEN RAISE EXCEPTION 'Need one existing confirmed owner'; END IF;
 FOREACH chosen IN ARRAY ARRAY['open','reviewed'] LOOP
  aid:=gen_random_uuid();pid:=gen_random_uuid();req:=gen_random_uuid();
  token:=decode(replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-',''),'hex');
  INSERT INTO remember.pending_album_registrations(id,email,title,starts_at,days,timezone,guest_mode)
  VALUES(aid,mail,'DISPOSABLE GUEST MODE TEST',now()-interval '1 hour',1,'Europe/Stockholm',chosen);
  result:=public.remember_complete_album_registration(actor,aid);
  IF result->>'guestMode' IS DISTINCT FROM chosen THEN RAISE EXCEPTION 'mode lost'; END IF;
  IF public.remember_complete_album_registration(actor,aid) IS DISTINCT FROM result THEN RAISE EXCEPTION 'replay differs'; END IF;
  INSERT INTO remember.guest_links(album_id,token_sha256,created_by) VALUES(aid,token,actor);
  INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state)
  VALUES(pid,aid,aid::text||'/'||pid::text,req,'uploading');
  UPDATE remember.album_photos SET state='ready' WHERE id=pid;
  listing:=public.remember_photo_gallery_read(NULL,NULL,token);
  IF jsonb_array_length(listing->'photos')<>(CASE WHEN chosen='open' THEN 1 ELSE 0 END)
  THEN RAISE EXCEPTION 'initial visibility incorrect'; END IF;
  IF (public.remember_guest_metadata_read(token)->>'photoApproval')::boolean IS DISTINCT FROM (chosen='reviewed')
  THEN RAISE EXCEPTION 'guest message mismatch'; END IF;
  IF chosen='reviewed' THEN
   IF NOT EXISTS(SELECT 1 FROM remember.photo_approval_queue WHERE photo_id=pid AND decision='pending')
   THEN RAISE EXCEPTION 'pending missing'; END IF;
   PERFORM public.remember_photo_approval_owner_decide(actor,aid,pid,'approved');
   listing:=public.remember_photo_gallery_read(NULL,NULL,token);
   IF jsonb_array_length(listing->'photos')<>1 THEN RAISE EXCEPTION 'approved invisible'; END IF;
  END IF;
 END LOOP;
END $test$;
SELECT true AS guest_modes_and_approval_pass;
ROLLBACK;

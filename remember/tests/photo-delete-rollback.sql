-- No Storage operation. One disposable fixture; always ROLLBACK.
BEGIN;
DO $test$
DECLARE actor uuid; aid uuid:=gen_random_uuid(); pid uuid:=gen_random_uuid(); rid uuid:=gen_random_uuid();
 dig bytea:=decode(repeat('ab',32),'hex'); r jsonb;
BEGIN
 SELECT owner_user_id INTO actor FROM remember.albums LIMIT 1;
 INSERT INTO remember.albums(id,slug,title,owner_user_id,default_opens_at,default_closes_at,photo_limit)
 VALUES(aid,'delete-test-'||aid::text,'DISPOSABLE DELETE TEST',actor,now()-interval '1 hour',now()+interval '1 day',1);
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,content_sha256)
 VALUES(pid,aid,aid::text||'/'||pid::text,rid,'ready',dig);
 r:=public.remember_photo_upload_request(actor,aid,null,gen_random_uuid(),dig,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION 'Expected full quota'; END IF;
 -- Same scoped state change as Edge, only against our new fixture.
 UPDATE remember.album_photos SET state='deleted' WHERE id=pid AND album_id=aid AND state='ready';
 r:=public.remember_photo_upload_request(actor,aid,null,rid,dig,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'deleted' THEN RAISE EXCEPTION 'Old upload replay could resurrect deleted image'; END IF;
 r:=public.remember_photo_upload_request(actor,aid,null,gen_random_uuid(),dig,'prepare');
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Deleted image quota not released'; END IF;
 IF NOT EXISTS(SELECT 1 FROM remember.album_photos WHERE id=pid AND state='deleted' AND idempotency_key=rid)
 THEN RAISE EXCEPTION 'Deletion identity lost'; END IF;
END $test$;
SELECT true AS quota_released_old_replay_blocked_identity_retained;
ROLLBACK;

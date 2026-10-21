CREATE TEMP TABLE webmaster_upload_results(test text) ON COMMIT DROP;
DO $test$
DECLARE actor uuid; owner_id uuid; aid uuid:=gen_random_uuid(); rid uuid:=gen_random_uuid(); pid uuid; r jsonb; original jsonb;
 dig bytea:=decode(repeat('ab',32),'hex'); dig2 bytea:=decode(repeat('cd',32),'hex');
BEGIN
 SELECT w.user_id INTO actor FROM remember.webmasters w JOIN auth.users u ON u.id=w.user_id
 WHERE u.email_confirmed_at IS NOT NULL AND u.deleted_at IS NULL AND (u.banned_until IS NULL OR u.banned_until<=clock_timestamp()) LIMIT 1;
 SELECT owner_user_id INTO owner_id FROM remember.albums WHERE owner_user_id<>actor LIMIT 1;
 IF actor IS NULL OR owner_id IS NULL THEN RAISE EXCEPTION 'Existing verified webmaster and separate owner required'; END IF;
 INSERT INTO remember.albums(id,slug,title,owner_user_id,default_opens_at,default_closes_at,photo_limit)
 VALUES(aid,'wm-upload-'||aid::text,'DISPOSABLE WEBMASTER UPLOAD',owner_id,now()-interval '2 days',now()-interval '1 day',2);
 r:=public.remember_photo_upload_request(actor,aid,null,rid,dig,'prepare');original:=r;pid:=(r->>'photoId')::uuid;
 IF r->>'accepted' IS DISTINCT FROM 'true' OR r->>'state' IS DISTINCT FROM 'uploading' THEN RAISE EXCEPTION 'Non-owner webmaster denied: %',r; END IF;
 r:=public.remember_photo_upload_request(actor,aid,null,rid,dig,'prepare');
 IF r IS DISTINCT FROM original THEN RAISE EXCEPTION 'Webmaster replay changed identity'; END IF;
 IF (SELECT count(*) FROM remember.album_photos WHERE album_id=aid)<>1 THEN RAISE EXCEPTION 'Extra slot'; END IF;
 INSERT INTO webmaster_upload_results VALUES('verified webmaster uploads to another owner; same-ID replay uses one slot');
 r:=public.remember_photo_upload_request(actor,aid,null,rid,dig2,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'content_conflict' THEN RAISE EXCEPTION 'Webmaster digest changed'; END IF;
 INSERT INTO webmaster_upload_results VALUES('webmaster retry binds exact original digest');
 r:=public.remember_photo_upload_request(actor,aid,null,rid,dig,'complete');
 r:=public.remember_photo_upload_request(actor,aid,null,rid,dig,'complete');
 IF r->>'state' IS DISTINCT FROM 'ready' OR r->>'photoId' IS DISTINCT FROM pid::text THEN RAISE EXCEPTION 'Webmaster complete replay failed'; END IF;
 INSERT INTO webmaster_upload_results VALUES('webmaster completion replay acknowledges same ready photo');
 r:=public.remember_photo_upload_request(actor,aid,null,gen_random_uuid(),dig,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'duplicate' THEN RAISE EXCEPTION 'Webmaster duplicate accepted'; END IF;
 INSERT INTO webmaster_upload_results VALUES('webmaster duplicate does not consume quota');
 r:=public.remember_photo_upload_request(actor,aid,null,gen_random_uuid(),dig2,'prepare');rid:=(SELECT idempotency_key FROM remember.album_photos WHERE id=(r->>'photoId')::uuid);
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Second webmaster slot denied'; END IF;
 r:=public.remember_photo_upload_request(actor,aid,null,gen_random_uuid(),decode(repeat('ef',32),'hex'),'prepare');
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION 'Webmaster bypassed quota'; END IF;
 INSERT INTO webmaster_upload_results VALUES('webmaster obeys album quota');
 r:=public.remember_photo_upload_request(gen_random_uuid(),aid,null,rid,dig2,'complete');
 IF r->>'reason' IS DISTINCT FROM 'forbidden' THEN RAISE EXCEPTION 'Unrelated user completed'; END IF;
 UPDATE remember.albums SET is_active=false WHERE id=aid;
 r:=public.remember_photo_upload_request(actor,aid,null,rid,dig2,'complete');
 IF r->>'reason' IS DISTINCT FROM 'album_inactive' THEN RAISE EXCEPTION 'Inactive album bypass'; END IF;
 INSERT INTO webmaster_upload_results VALUES('unrelated actor and inactive album remain denied');
END $test$;
SELECT 'PASS' AS result,test FROM retry_test_results UNION ALL SELECT 'PASS',test FROM webmaster_upload_results ORDER BY test;
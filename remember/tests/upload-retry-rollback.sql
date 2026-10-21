-- Wrap this entire file in BEGIN / ROLLBACK; never COMMIT. No Storage writes.
CREATE TEMP TABLE retry_test_results(test text) ON COMMIT DROP;
DO $test$
DECLARE actor uuid; a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); rid uuid:=gen_random_uuid();
 tok bytea:=decode(replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-',''),'hex');
 dig bytea:=decode(repeat('aa',32),'hex'); other bytea:=decode(repeat('bb',32),'hex');
 r jsonb; original jsonb; pid uuid; i integer;
BEGIN
 SELECT owner_user_id INTO actor FROM remember.albums ORDER BY created_at LIMIT 1;
 IF actor IS NULL THEN RAISE EXCEPTION 'Existing test owner required'; END IF;
 INSERT INTO remember.albums(id,slug,title,owner_user_id,default_opens_at,default_closes_at)
 SELECT v,'retry-review-'||v::text,'DISPOSABLE RETRY REVIEW',actor,clock_timestamp()-interval '1 hour',clock_timestamp()+interval '1 day'
 FROM unnest(ARRAY[a,b]) ids(v);
 INSERT INTO remember.guest_links(album_id,token_sha256,created_by) VALUES(a,tok,actor);
 r:=public.remember_photo_upload_request(null,null,tok,rid,dig,'prepare');original:=r;pid:=(r->>'photoId')::uuid;
 IF r->>'accepted' IS DISTINCT FROM 'true' OR r->>'state'<>'uploading' THEN RAISE EXCEPTION 'Prepare: %',r; END IF;
 FOR i IN 1..3 LOOP
  r:=public.remember_photo_upload_request(null,null,tok,rid,dig,'prepare');
  IF r IS DISTINCT FROM original THEN RAISE EXCEPTION 'Replay changed identity/key'; END IF;
 END LOOP;
 IF (SELECT count(*) FROM remember.album_photos WHERE album_id=a)<>1 THEN RAISE EXCEPTION 'Replay duplicated slot'; END IF;
 INSERT INTO retry_test_results VALUES('guest uploading replay: same ID/key, one counted slot');
 r:=public.remember_photo_upload_request(null,null,tok,rid,other,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'content_conflict' THEN RAISE EXCEPTION 'Changed bytes accepted'; END IF;
 INSERT INTO retry_test_results VALUES('same request with different digest rejected');
 -- Synthetic completion tests only; Edge must prove stored bytes before this call.
 r:=public.remember_photo_upload_request(null,null,tok,rid,dig,'complete');
 IF r->>'state' IS DISTINCT FROM 'ready' THEN RAISE EXCEPTION 'Complete failed'; END IF;
 FOR i IN 1..2 LOOP
  r:=public.remember_photo_upload_request(null,null,tok,rid,dig,CASE WHEN i=1 THEN 'prepare' ELSE 'complete' END);
  IF r->>'accepted' IS DISTINCT FROM 'true' OR r->>'photoId'<>pid::text OR r->>'state'<>'ready'
  THEN RAISE EXCEPTION 'Lost success not acknowledged'; END IF;
 END LOOP;
 UPDATE remember.albums SET forced_closed=true WHERE id=a;
 r:=public.remember_photo_upload_request(null,null,tok,rid,dig,'prepare');
 IF r->>'state' IS DISTINCT FROM 'ready' THEN RAISE EXCEPTION 'Ready acknowledgement blocked after deadline'; END IF;
 r:=public.remember_photo_upload_request(null,null,tok,gen_random_uuid(),other,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'closed' THEN RAISE EXCEPTION 'Closed new write allowed'; END IF;
 UPDATE remember.albums SET forced_closed=false WHERE id=a;
 INSERT INTO retry_test_results VALUES('ready acknowledgement idempotent after window; new guest writes blocked');
 r:=public.remember_photo_upload_request(null,null,tok,gen_random_uuid(),dig,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'duplicate' THEN RAISE EXCEPTION 'Content duplicate accepted'; END IF;
 IF (SELECT count(*) FROM remember.album_photos WHERE album_id=a AND state IN ('reserved','uploading','ready'))<>1
 THEN RAISE EXCEPTION 'Duplicate consumed slot'; END IF;
 INSERT INTO retry_test_results VALUES('new request identical ready content: duplicate, no extra quota');
 rid:=gen_random_uuid();
 r:=public.remember_photo_upload_request(actor,b,null,rid,dig,'prepare');original:=r;pid:=(r->>'photoId')::uuid;
 r:=public.remember_photo_upload_request(actor,b,null,rid,dig,'prepare');
 IF r IS DISTINCT FROM original THEN RAISE EXCEPTION 'Owner resume changed identity'; END IF;
 FOR i IN 1..9 LOOP
  r:=public.remember_photo_upload_request(actor,b,null,gen_random_uuid(),decode(lpad(to_hex(i),64,'0'),'hex'),'prepare');
  IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Quota % rejected: %',i,r; END IF;
 END LOOP;
 r:=public.remember_photo_upload_request(actor,b,null,gen_random_uuid(),other,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION '11th slot accepted'; END IF;
 UPDATE remember.album_photos SET reservation_expires_at=clock_timestamp()-interval '1 hour' WHERE id=pid;
 r:=public.remember_photo_upload_request(actor,b,null,rid,dig,'prepare');
 IF r IS DISTINCT FROM original THEN RAISE EXCEPTION 'In-flight expiry changed slot'; END IF;
 r:=public.remember_photo_upload_request(actor,b,null,rid,dig,'complete');
 r:=public.remember_photo_upload_request(actor,b,null,rid,dig,'complete');
 IF r->>'state' IS DISTINCT FROM 'ready' THEN RAISE EXCEPTION 'Owner complete replay failed'; END IF;
 IF (SELECT count(*) FROM remember.album_photos WHERE album_id=b AND state IN ('reserved','uploading','ready'))<>10
 THEN RAISE EXCEPTION 'Owner retry changed quota'; END IF;
 INSERT INTO retry_test_results VALUES('owner retry/complete same ID at full 10 quota; uploading never expires');
 rid:=gen_random_uuid();pid:=gen_random_uuid();
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,content_sha256)
 VALUES(pid,a,a::text||'/'||pid::text,rid,'failed',other);
 r:=public.remember_photo_upload_request(null,null,tok,rid,other,'prepare');
 IF r->>'photoId' IS DISTINCT FROM pid::text OR r->>'state'<>'uploading' THEN RAISE EXCEPTION 'Released row not rearmed'; END IF;
 INSERT INTO retry_test_results VALUES('failed slot re-armed with original ID and quota check');
 r:=public.remember_photo_upload_request(gen_random_uuid(),b,null,gen_random_uuid(),dig,'prepare');
 IF r->>'reason' IS DISTINCT FROM 'forbidden' THEN RAISE EXCEPTION 'Wrong owner allowed'; END IF;
 UPDATE remember.albums SET is_active=false WHERE id=a;
 r:=public.remember_photo_upload_request(null,null,tok,rid,other,'complete');
 IF r->>'reason' IS DISTINCT FROM 'album_inactive' THEN RAISE EXCEPTION 'Inactive complete accepted'; END IF;
 UPDATE remember.albums SET is_active=true,forced_closed=true WHERE id=a;
 r:=public.remember_photo_upload_request(null,null,tok,rid,other,'complete');
 IF r->>'reason' IS DISTINCT FROM 'closed' THEN RAISE EXCEPTION 'Closed complete accepted'; END IF;
 UPDATE remember.albums SET forced_closed=false WHERE id=a;
 UPDATE remember.guest_links SET revoked_at=clock_timestamp() WHERE album_id=a;
 r:=public.remember_photo_upload_request(null,null,tok,rid,other,'complete');
 IF r->>'accepted' IS DISTINCT FROM 'false' THEN RAISE EXCEPTION 'Revoked complete accepted'; END IF;
 INSERT INTO retry_test_results VALUES('wrong owner, inactive, closed and revoked during flight denied');
 IF has_function_privilege('anon','public.remember_photo_upload_request(uuid,uuid,bytea,uuid,bytea,text)','EXECUTE')
 OR has_function_privilege('authenticated','public.remember_photo_upload_request(uuid,uuid,bytea,uuid,bytea,text)','EXECUTE')
 OR NOT has_function_privilege('service_role','public.remember_photo_upload_request(uuid,uuid,bytea,uuid,bytea,text)','EXECUTE')
 THEN RAISE EXCEPTION 'RPC grant mismatch'; END IF;
 INSERT INTO retry_test_results VALUES('service-only RPC grants');
END $test$;
SELECT 'PASS' AS result,test FROM retry_test_results ORDER BY test;

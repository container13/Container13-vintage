-- Regression/characterization against the installed Remember RPCs.
-- All fixtures are new UUIDs inside ONE transaction. Always ends with ROLLBACK.
-- Does not upload Storage objects or change existing albums/users/photos.
BEGIN;
CREATE TEMP TABLE upload_review_results (test text, result text) ON COMMIT DROP;
DO $test$
DECLARE
 actor uuid; a uuid:=gen_random_uuid(); b uuid:=gen_random_uuid(); c uuid:=gen_random_uuid();
 tok bytea:=decode(replace(gen_random_uuid()::text,'-','')||replace(gen_random_uuid()::text,'-',''),'hex');
 rid uuid; first_id uuid; second_id uuid; r jsonb; n integer; i integer;
 digest bytea:=decode(repeat('ab',32),'hex');
BEGIN
 SELECT owner_user_id INTO actor FROM remember.albums ORDER BY created_at LIMIT 1;
 IF actor IS NULL THEN RAISE EXCEPTION 'An existing album owner is required'; END IF;
 INSERT INTO remember.albums(id,slug,title,owner_user_id,default_opens_at,default_closes_at)
 SELECT v,'upload-review-'||v::text,'DISPOSABLE UPLOAD REVIEW',actor,now()-interval '1 hour',now()+interval '1 day'
 FROM unnest(ARRAY[a,b,c]) AS ids(v);
 INSERT INTO remember.guest_links(album_id,token_sha256,created_by) VALUES(a,tok,actor);
 IF (SELECT photo_limit FROM remember.albums WHERE id=a)<>10 THEN RAISE EXCEPTION 'Default quota is not 10'; END IF;
 FOR i IN 1..10 LOOP
   r:=public.remember_guest_photo_reserve(tok,gen_random_uuid());
   IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Reservation % rejected: %',i,r; END IF;
   IF i=1 THEN first_id:=(r->>'photoId')::uuid; END IF;
   IF i=2 THEN second_id:=(r->>'photoId')::uuid; END IF;
 END LOOP;
 -- Verify mixed reserved/uploading/ready states share the same quota.
 r:=public.remember_photo_claim_upload(first_id,digest);
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Claim failed'; END IF;
 r:=public.remember_photo_claim_upload(second_id,decode(repeat('cd',32),'hex'));
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Second claim failed'; END IF;
 r:=public.remember_photo_complete_upload(second_id,tok);
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Complete failed'; END IF;
 r:=public.remember_guest_photo_reserve(tok,gen_random_uuid());
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION 'Guest 11th accepted: %',r; END IF;
 r:=public.remember_webmaster_photo_reserve(actor,a,gen_random_uuid());
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION 'Owner 11th accepted: %',r; END IF;
 INSERT INTO upload_review_results VALUES('default 10; guest + owner 11th blocked with mixed counted states','PASS');
 -- Expire only an unstarted reservation; the next reservation can use that slot.
 UPDATE remember.album_photos SET reservation_expires_at=now()-interval '1 minute'
 WHERE id=(SELECT id FROM remember.album_photos WHERE album_id=a AND state='reserved' LIMIT 1);
 r:=public.remember_guest_photo_reserve(tok,gen_random_uuid());
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Expired unused slot not reclaimed'; END IF;
 SELECT count(*) INTO n FROM remember.album_photos WHERE album_id=a AND state IN ('reserved','uploading','ready');
 IF n<>10 THEN RAISE EXCEPTION 'Wrong counted quota after expiry'; END IF;
 INSERT INTO upload_review_results VALUES('expired reserved slot reclaimed without exceeding quota','PASS');
 UPDATE remember.album_photos SET reservation_expires_at=now()-interval '1 minute' WHERE id=first_id;
 r:=public.remember_guest_photo_reserve(tok,gen_random_uuid());
 IF r->>'reason' IS DISTINCT FROM 'limit' OR (SELECT state FROM remember.album_photos WHERE id=first_id)<>'uploading'
 THEN RAISE EXCEPTION 'In-flight upload unsafely expired'; END IF;
 INSERT INTO upload_review_results VALUES('uploading slot never released solely on timeout','PASS');
 -- Exact bytes, same album: one claim succeeds, duplicate releases its slot.
 r:=public.remember_webmaster_photo_reserve(actor,b,gen_random_uuid());first_id:=(r->>'photoId')::uuid;
 r:=public.remember_photo_claim_upload(first_id,digest);
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Dedup first claim failed'; END IF;
 r:=public.remember_webmaster_photo_reserve(actor,b,gen_random_uuid());second_id:=(r->>'photoId')::uuid;
 r:=public.remember_photo_claim_upload(second_id,digest);
 IF r->>'reason' IS DISTINCT FROM 'duplicate' OR (SELECT state FROM remember.album_photos WHERE id=second_id)<>'failed'
 THEN RAISE EXCEPTION 'Duplicate did not release unused slot: %',r; END IF;
 SELECT count(*) INTO n FROM remember.album_photos WHERE album_id=b AND state IN ('reserved','uploading','ready');
 IF n<>1 THEN RAISE EXCEPTION 'Duplicate consumes quota'; END IF;
 INSERT INTO upload_review_results VALUES('same digest in same album rejected; no extra counted slot','PASS');
 r:=public.remember_webmaster_photo_reserve(actor,c,gen_random_uuid());
 r:=public.remember_photo_claim_upload((r->>'photoId')::uuid,digest);
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Same bytes in different album rejected'; END IF;
 INSERT INTO upload_review_results VALUES('same digest in another album accepted','PASS');
 -- Characterize the current retry gap, without asserting desired behavior works.
 r:=public.remember_photo_claim_upload(first_id,digest);
 IF r->>'reason' IS DISTINCT FROM 'in_progress' THEN RAISE EXCEPTION 'Retry characterization changed: %',r; END IF;
 r:=public.remember_webmaster_photo_complete(actor,first_id);
 IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Owner complete failed'; END IF;
 r:=public.remember_webmaster_photo_reserve(actor,b,gen_random_uuid());second_id:=(r->>'photoId')::uuid;
 r:=public.remember_photo_claim_upload(second_id,digest);
 IF r->>'reason' IS DISTINCT FROM 'duplicate' OR (SELECT state FROM remember.album_photos WHERE id=second_id)<>'failed'
 THEN RAISE EXCEPTION 'Ready duplicate did not release unused slot'; END IF;
 INSERT INTO upload_review_results VALUES('duplicate against ready photo rejected; slot released','PASS');
 SELECT idempotency_key INTO rid FROM remember.album_photos WHERE id=first_id;
 r:=public.remember_webmaster_photo_reserve(actor,b,rid);
 IF r->>'accepted' IS DISTINCT FROM 'false' OR r->>'reason' IS DISTINCT FROM 'existing'
 THEN RAISE EXCEPTION 'Owner replay behavior changed: %',r; END IF;
 INSERT INTO upload_review_results VALUES('owner retry after successful commit returns existing denial','KNOWN GAP REPRODUCED');
 -- Use a ready guest photo from a for the guest replay characterization.
 SELECT id,idempotency_key INTO second_id,rid FROM remember.album_photos WHERE album_id=a AND state='ready' LIMIT 1;
 r:=public.remember_guest_photo_reserve(tok,rid);
 IF r->>'reason' IS DISTINCT FROM 'existing' OR r->>'photoId' IS DISTINCT FROM second_id::text
 THEN RAISE EXCEPTION 'Guest replay identity changed'; END IF;
 INSERT INTO upload_review_results VALUES('guest replay preserves photo ID; Edge currently rejects existing','KNOWN GAP REPRODUCED');
 -- Authorization/window boundaries with disposable fixtures only.
 r:=public.remember_webmaster_photo_reserve(gen_random_uuid(),b,gen_random_uuid());
 IF r->>'reason' IS DISTINCT FROM 'forbidden' THEN RAISE EXCEPTION 'Wrong owner accepted'; END IF;
 UPDATE remember.albums SET forced_closed=true WHERE id=a;
 r:=public.remember_guest_photo_reserve(tok,gen_random_uuid());
 IF r->>'reason' IS DISTINCT FROM 'closed' THEN RAISE EXCEPTION 'Closed guest accepted'; END IF;
 UPDATE remember.albums SET is_active=false WHERE id=b;
 r:=public.remember_webmaster_photo_reserve(actor,b,gen_random_uuid());
 IF r->>'reason' IS DISTINCT FROM 'album_inactive' THEN RAISE EXCEPTION 'Inactive owner accepted'; END IF;
 INSERT INTO upload_review_results VALUES('wrong owner, closed guest and inactive owner denied','PASS');
END $test$;
SELECT test,result FROM upload_review_results ORDER BY test;
ROLLBACK;

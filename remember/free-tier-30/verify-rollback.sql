BEGIN;
-- Real installed RPCs; fixtures only, rolled back. Never uploads/deletes Storage.
CREATE TEMP TABLE free_tier_results(test text,result text) ON COMMIT DROP;
DO $test$
DECLARE actor uuid; wm uuid; aid uuid; did uuid; rid uuid; r jsonb; i integer; email text;
 tok bytea:=decode(repeat('ca',32),'hex'); digest bytea:=decode(repeat('db',32),'hex');
BEGIN
 SELECT a.owner_user_id,u.email INTO actor,email FROM remember.albums a JOIN auth.users u ON u.id=a.owner_user_id WHERE u.email_confirmed_at IS NOT NULL LIMIT 1;
 SELECT user_id INTO wm FROM remember.webmasters LIMIT 1;
 IF actor IS NULL OR wm IS NULL THEN RAISE EXCEPTION 'Fixture requires existing verified owner/webmaster'; END IF;
 -- Both modes take the new default; consumed replay preserves explicit quota.
 FOREACH i IN ARRAY ARRAY[0,1] LOOP
  did:=gen_random_uuid();
  INSERT INTO remember.pending_album_registrations(id,email,title,starts_at,days,timezone,guest_mode)
   VALUES(did,email,'ROLLBACK ONLY TRIAL30',now()-interval '1 hour',2,'Europe/Stockholm',CASE WHEN i=0 THEN 'open' ELSE 'reviewed' END);
  r:=public.remember_complete_album_registration(actor,did);
  IF (SELECT photo_limit FROM remember.albums WHERE id=did)<>30 THEN RAISE EXCEPTION 'Registration default wrong'; END IF;
  IF (SELECT guest_mode FROM remember.albums WHERE id=did)<>(CASE WHEN i=0 THEN 'open' ELSE 'reviewed' END) THEN RAISE EXCEPTION 'Guest mode lost'; END IF;
  UPDATE remember.albums SET photo_limit=45 WHERE id=did;
  r:=public.remember_complete_album_registration(actor,did);
  IF (SELECT photo_limit FROM remember.albums WHERE id=did)<>45 THEN RAISE EXCEPTION 'Replay overwrote custom limit'; END IF;
 END LOOP;
 INSERT INTO free_tier_results VALUES('open/reviewed registration default30; replay preserves custom limit','PASS');
 aid:=gen_random_uuid();
 r:=public.remember_webmaster_create_album(wm,aid,'ROLLBACK ONLY WM30','party',now()-interval '1 hour',null,'Europe/Stockholm');
 IF r->>'authorized' IS DISTINCT FROM 'true' OR (r->'album'->>'photo_limit')::int<>30 THEN RAISE EXCEPTION 'Webmaster default wrong: %',r; END IF;
 INSERT INTO free_tier_results VALUES('webmaster creation defaults30','PASS');
 -- New normal owner album. Use actual retry-safe upload request RPC for all roles.
 aid:=gen_random_uuid();
 INSERT INTO remember.albums(id,slug,title,owner_user_id,default_opens_at,default_closes_at)
 VALUES(aid,aid::text,'ROLLBACK ONLY LIMIT30',actor,now()-interval '1 hour',now()+interval '1 day');
 INSERT INTO remember.guest_links(album_id,token_sha256,created_by) VALUES(aid,tok,actor);
 FOR i IN 1..30 LOOP
  rid:=gen_random_uuid(); digest:=decode(lpad(to_hex(i),64,'0'),'hex');
  r:=public.remember_photo_upload_request(null,null,tok,rid,digest,'prepare');
  IF r->>'accepted' IS DISTINCT FROM 'true' THEN RAISE EXCEPTION 'Photo% rejected: %',i,r; END IF;
 END LOOP;
 r:=public.remember_photo_upload_request(null,null,tok,rid,digest,'prepare');
 IF r->>'accepted' IS DISTINCT FROM 'true' OR (SELECT count(*) FROM remember.album_photos WHERE album_id=aid)<>30 THEN RAISE EXCEPTION 'Retry consumed slot'; END IF;
 r:=public.remember_photo_upload_request(null,null,tok,gen_random_uuid(),decode(repeat('ee',32),'hex'),'prepare');
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION 'Guest31 accepted: %',r; END IF;
 r:=public.remember_photo_upload_request(actor,aid,null,gen_random_uuid(),decode(repeat('ee',32),'hex'),'prepare');
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION 'Owner31 accepted: %',r; END IF;
 r:=public.remember_photo_upload_request(wm,aid,null,gen_random_uuid(),decode(repeat('ee',32),'hex'),'prepare');
 IF r->>'reason' IS DISTINCT FROM 'limit' THEN RAISE EXCEPTION 'Webmaster31 accepted: %',r; END IF;
 INSERT INTO free_tier_results VALUES('30 accepted;31 denied guest/owner/webmaster; retry uses no extra slot','PASS');
 IF has_function_privilege('anon','public.remember_complete_album_registration(uuid,uuid)','EXECUTE') OR has_function_privilege('authenticated','public.remember_complete_album_registration(uuid,uuid)','EXECUTE') THEN RAISE EXCEPTION 'Registration RPC exposed'; END IF;
 IF has_function_privilege('anon','public.remember_webmaster_create_album(uuid,uuid,text,text,timestamptz,timestamptz,text)','EXECUTE') OR has_function_privilege('authenticated','public.remember_webmaster_create_album(uuid,uuid,text,text,timestamptz,timestamptz,text)','EXECUTE') THEN RAISE EXCEPTION 'WM RPC exposed'; END IF;
 INSERT INTO free_tier_results VALUES('changed RPCs remain service-only','PASS');
END $test$;
SELECT * FROM free_tier_results;
ROLLBACK;


begin; set local remember.test_actor='75b71f6c-97b7-4de1-ad14-292b4af4e1fa';
-- TEST PROJECT ONLY. NOT RUN. Use an existing approved test-webmaster auth user.
-- In the same connection: BEGIN; SET LOCAL remember.test_actor = '<approved test user UUID>';
-- Paste this DO block, inspect output, then ROLLBACK (never COMMIT).
do $test$
declare actor uuid:=current_setting('remember.test_actor')::uuid;
 aid uuid:=gen_random_uuid(); tok bytea:=decode(repeat('ab',32),'hex'); pid uuid;
 r jsonb; before_row jsonb; audits bigint; rev bigint;
begin
 if not exists(select 1 from remember.webmasters where user_id=actor) then raise exception 'Approved test webmaster required'; end if;
 insert into remember.albums(id,slug,title,owner_user_id,event_timezone,default_opens_at,default_closes_at,photo_limit)
 values(aid,'activation-test-'||aid::text,'DISPOSABLE ACTIVATION TEST',actor,'Europe/Stockholm',now()-interval '1 hour',now()+interval '1 day',10);
 insert into remember.guest_links(album_id,token_sha256,created_by) values(aid,tok,actor);
 r:=public.remember_webmaster_album_activation(gen_random_uuid(),aid,'read');
 if r->>'authorized'<>'false' then raise exception 'Non-admin read allowed'; end if;
 if has_function_privilege('anon','public.remember_webmaster_album_activation(uuid,uuid,text,bigint,boolean,text)','EXECUTE')
 or has_function_privilege('authenticated','public.remember_webmaster_album_activation(uuid,uuid,text,bigint,boolean,text)','EXECUTE')
 then raise exception 'Client RPC privilege exposed'; end if;
 select to_jsonb(a)-'updated_at'-'revision'-'is_active' into before_row from remember.albums a where id=aid;
 r:=public.remember_webmaster_album_activation(actor,aid,'read');
 rev:=(r#>>'{album,revision}')::bigint;
 r:=public.remember_guest_photo_reserve(tok,gen_random_uuid());
 if r->>'accepted'<>'true' then raise exception 'Active reservation denied'; end if;
 pid:=(r->>'photoId')::uuid;
 r:=public.remember_webmaster_album_activation(actor,aid,'save',rev,false,'Test reason');
 if r#>>'{album,is_active}'<>'false' then raise exception 'Disable failed'; end if;
 select count(*) into audits from remember.album_activation_audit where album_id=aid;
 if audits<>1 then raise exception 'Missing audit'; end if;
 -- Exact replay must not insert a second audit or change revision.
 r:=public.remember_webmaster_album_activation(actor,aid,'save',rev,false,'Test reason');
 if (select count(*) from remember.album_activation_audit where album_id=aid)<>audits then raise exception 'Retry not idempotent'; end if;
 r:=public.remember_webmaster_album_activation(actor,aid,'save',rev,true,'');
 if r->>'error'<>'revision_conflict' then raise exception 'Stale revision accepted'; end if;
 r:=public.remember_guest_metadata_read(tok);
 if r->>'active'<>'false' or r->>'uploadsOpen'<>'false' or r ? 'activation_reason' or r ? 'title' then raise exception 'Metadata/private data leak'; end if;
 r:=public.remember_photo_gallery_read(null,null,tok);
 if r->>'authorized'<>'false' then raise exception 'Guest gallery not blocked'; end if;
 r:=public.remember_guest_photo_reserve(tok,gen_random_uuid());
 if r->>'accepted'<>'false' then raise exception 'Guest upload not blocked'; end if;
 r:=public.remember_webmaster_photo_reserve(actor,aid,gen_random_uuid());
 if r->>'accepted'<>'false' then raise exception 'Owner upload not blocked'; end if;
 r:=public.remember_photo_claim_upload(pid,decode(repeat('cd',32),'hex'));
 if r->>'accepted'<>'false' then raise exception 'Prior reservation not blocked'; end if;
 update remember.album_photos set state='uploading' where id=pid;
 r:=public.remember_photo_complete_upload(pid,tok);
 if r->>'accepted'<>'false' then raise exception 'In-flight guest completion not blocked'; end if;
 r:=public.remember_webmaster_photo_complete(actor,pid);
 if r->>'accepted'<>'false' then raise exception 'In-flight owner completion not blocked'; end if;
 r:=public.remember_photo_gallery_read(actor,aid,null);
 if r->>'authorized'<>'true' then raise exception 'Webmaster review blocked'; end if;
 r:=public.remember_webmaster_album_activation(actor,aid,'read');rev:=(r#>>'{album,revision}')::bigint;
 r:=public.remember_webmaster_album_activation(actor,aid,'save',rev,true,'');
 if r#>>'{album,is_active}'<>'true' or r#>>'{album,activation_reason}'<>'' then raise exception 'Reactivate failed'; end if;
 if (select to_jsonb(a)-'updated_at'-'revision'-'is_active' from remember.albums a where id=aid) is distinct from before_row
 then raise exception 'Schedule, quota, owner or title changed'; end if;
 r:=public.remember_guest_metadata_read(tok);
 if r->>'found'<>'true' or r->>'uploadsOpen'<>'true' then raise exception 'Existing link not restored'; end if;
 raise notice 'PASS activation transaction assertions; ROLLBACK REQUIRED';
end $test$;
-- ROLLBACK; Then independent readback: no DISPOSABLE ACTIVATION TEST albums or matching audits.

rollback;
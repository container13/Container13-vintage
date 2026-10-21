-- Executed in remember-test, 2026-10-21; transaction rolled back; no original writes.
-- REVIEW ONLY: run exclusively in remember-test after approved installation.
-- Requires an existing, approved test webmaster and its disposable album.
begin;
do $test$
declare actor uuid; album uuid; original_revision bigint; original_opens timestamptz; original_closes timestamptz;
 result jsonb; audit_before bigint; revision_after bigint;
begin
 actor:='75b71f6c-97b7-4de1-ad14-292b4af4e1fa';album:=gen_random_uuid();
 insert into remember.albums(id,slug,title,owner_user_id,event_timezone,default_opens_at,default_closes_at)
 values(album,'settings-test-'||album::text,'DISPOSABLE SETTINGS TEST',actor,'Europe/Stockholm',now()-interval '1 day',now()-interval '1 hour');
 select revision,default_opens_at,default_closes_at into original_revision,original_opens,original_closes from remember.albums where id=album;
 if album is null then raise exception 'STOP: prepare an approved test webmaster and disposable album first';end if;
 if has_function_privilege('anon','public.remember_webmaster_album_settings(uuid,uuid,text,bigint,timestamptz,timestamptz,boolean)','execute') or
 has_function_privilege('authenticated','public.remember_webmaster_album_settings(uuid,uuid,text,bigint,timestamptz,timestamptz,boolean)','execute') then raise exception 'Unexpected public execute grant';end if;
 result=public.remember_webmaster_album_settings(gen_random_uuid(),album,'read');
 if result->>'authorized'<>'false' then raise exception 'Forged actor allowed';end if;
 select count(*) into audit_before from remember.schedule_audit where album_id=album;
 result=public.remember_webmaster_album_settings(actor,album,'save',original_revision,original_opens,original_closes+interval '24 hours',false);
 if result->>'ok'<>'true' then raise exception 'Save failed';end if;
 select revision into revision_after from remember.albums where id=album;
 if revision_after<>original_revision+1 then raise exception 'Revision not incremented';end if;
 if (select count(*) from remember.schedule_audit where album_id=album)<>audit_before+1 then raise exception 'Audit missing';end if;
 result=public.remember_webmaster_album_settings(actor,album,'save',original_revision,original_opens,original_closes+interval '24 hours',false);
 if result->>'ok'<>'true' or (select count(*) from remember.schedule_audit where album_id=album)<>audit_before+1 then raise exception 'Retry not idempotent';end if;
 result=public.remember_webmaster_album_settings(actor,album,'save',original_revision,original_opens,original_closes+interval '48 hours',false);
 if result->>'error'<>'revision_conflict' then raise exception 'Stale writer not rejected';end if;
 begin
  perform public.remember_webmaster_album_settings(actor,album,'save',revision_after,original_closes,original_opens,false);
  raise exception 'Invalid window accepted';
 exception when sqlstate '22023' then null;end;
end;
$test$;
rollback;
-- Independently re-read original test album + audit counts after rollback.
-- True simultaneous sessions and authenticated HTTP/device save remain separate gates.

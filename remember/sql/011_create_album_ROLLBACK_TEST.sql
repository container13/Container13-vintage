-- Run only after approved migration 2, in dedicated Remember TEST project.
-- Writes disposable album rows inside a transaction and ROLLS BACK ALL.
begin;
do $test$
declare
 actor uuid := '75b71f6c-97b7-4de1-ad14-292b4af4e1fa'::uuid;
 request_id uuid := 'a2c13000-0000-4000-8000-000000000010'::uuid;
 r jsonb;
begin
 if exists(select 1 from remember.albums where id=request_id) then
   raise exception 'Test ID already exists: choose a new disposable UUID before testing';
 end if;
 execute 'set local role service_role';
 r:=public.remember_webmaster_create_album(actor,request_id,'Remember transaction test','party','2026-10-24T12:00:00Z',null,'Europe/Stockholm');
 if (r->>'authorized') is distinct from 'true' or (r->>'created') is distinct from 'true' or (r#>>'{album,photo_limit}') is distinct from '10' then
   raise exception 'FAIL first creation/default quota';
 end if;
 if (r#>>'{album,default_closes_at}')::timestamptz <> '2026-10-25T12:00:00Z'::timestamptz then
   raise exception 'FAIL absolute 24-hour window across DST';
 end if;
 r:=public.remember_webmaster_create_album(actor,request_id,'Remember transaction test','party','2026-10-24T12:00:00Z',null,'Europe/Stockholm');
 if (r->>'created') is distinct from 'false' then raise exception 'FAIL duplicate retry'; end if;
 begin
   perform public.remember_webmaster_create_album(actor,request_id,'Different title','party','2026-10-24T12:00:00Z',null,'Europe/Stockholm');
   raise exception 'FAIL changed-data retry accepted';
 exception when sqlstate '22023' then null;
 end;
 r:=public.remember_webmaster_create_album('00000000-0000-4000-8000-000000000001',request_id,'Remember transaction test','party','2026-10-24T12:00:00Z',null,'Europe/Stockholm');
 if r is distinct from '{"authorized":false}'::jsonb then raise exception 'FAIL forged actor'; end if;
 begin
   perform public.remember_webmaster_create_album(actor,'a2c13000-0000-4000-8000-000000000011','   ','party','2026-10-24T12:00:00Z',null,'Europe/Stockholm');
   raise exception 'FAIL empty title accepted';
 exception when sqlstate '22023' then null;
 end;
 begin
   perform public.remember_webmaster_create_album(actor,'a2c13000-0000-4000-8000-000000000012','Bad trip','trip','2026-10-24T12:00:00Z','2026-10-23T12:00:00Z','Europe/Stockholm');
   raise exception 'FAIL invalid trip accepted';
 exception when sqlstate '22023' then null;
 end;
 execute 'reset role';
 if (select count(*) from remember.albums where id=request_id)<>1 then raise exception 'FAIL duplicate rows'; end if;
 if (select title from remember.albums where id=request_id)<>'Remember transaction test' then raise exception 'FAIL changed-data retry overwrote title'; end if;
 execute 'set local role anon';
 begin
   perform public.remember_webmaster_create_album(actor,request_id,'Remember transaction test','party','2026-10-24T12:00:00Z',null,'Europe/Stockholm');
   raise exception 'FAIL anon executed create RPC';
 exception when insufficient_privilege then null;
 end;
 execute 'reset role';
 execute 'set local role authenticated';
 begin
   perform public.remember_webmaster_create_album(actor,request_id,'Remember transaction test','party','2026-10-24T12:00:00Z',null,'Europe/Stockholm');
   raise exception 'FAIL authenticated executed create RPC';
 exception when insufficient_privilege then null;
 end;
 execute 'reset role';
end
$test$;
select 'Album creation transaction assertions' as test,true as pass;
rollback;
-- Separately verify the test ID is absent after rollback.
-- select count(*)=0 as test_data_removed from remember.albums
-- where id='a2c13000-0000-4000-8000-000000000010'::uuid;

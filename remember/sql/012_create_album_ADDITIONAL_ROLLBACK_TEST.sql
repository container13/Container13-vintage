begin;
set local role service_role;
do $test$
declare r jsonb; actor uuid:='75b71f6c-97b7-4de1-ad14-292b4af4e1fa';
begin
 r:=public.remember_webmaster_create_album(actor,'a2c13000-0000-4000-8000-000000000020','Fishing test','fishing','2026-11-01T12:00Z','2026-11-03T12:00Z','Europe/Stockholm');
 if (r#>>'{album,default_closes_at}')::timestamptz is distinct from '2026-11-04T12:00Z'::timestamptz then raise exception 'FAIL fishing end+24h'; end if;
 r:=public.remember_webmaster_create_album(actor,'a2c13000-0000-4000-8000-000000000021','Trip test','trip','2026-11-01T12:00Z','2026-11-01T12:00Z','Europe/Stockholm');
 if (r#>>'{album,default_closes_at}')::timestamptz is distinct from '2026-11-02T12:00Z'::timestamptz then raise exception 'FAIL zero-duration trip'; end if;
 begin
 perform public.remember_webmaster_create_album(actor,'a2c13000-0000-4000-8000-000000000022','Bad timezone','party','2026-11-01T12:00Z',null,'Not/A_Timezone');
 raise exception 'FAIL invalid timezone accepted';
 exception when sqlstate '22023' then null; end;
 begin
 perform public.remember_webmaster_create_album(actor,'a2c13000-0000-4000-8000-000000000023','Bad type','invalid','2026-11-01T12:00Z',null,'Europe/Stockholm');
 raise exception 'FAIL invalid event type accepted';
 exception when sqlstate '22023' then null; end;
 begin
 perform public.remember_webmaster_create_album(actor,'a2c13000-0000-4000-8000-000000000024','Bad party end','party','2026-11-01T12:00Z','2026-11-02T12:00Z','Europe/Stockholm');
 raise exception 'FAIL party end accepted';
 exception when sqlstate '22023' then null; end;
end $test$;
select 'Trip/fishing/timezone/type/party-end assertions' as test,true as pass;
rollback;
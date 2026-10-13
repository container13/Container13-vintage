begin read only;
do $test$
declare a text; r jsonb;
begin
  execute 'set local role service_role';
  foreach a in array array['role_check','installation_status','list'] loop
    r := public.remember_webmaster_read('00000000-0000-4000-8000-000000000001'::uuid,a);
    if r is distinct from '{"authorized":false}'::jsonb then
      raise exception 'FAIL: forged actor accepted for %',a;
    end if;
  end loop;
  begin
    perform public.remember_webmaster_read(null,'role_check');
    raise exception 'FAIL: null actor accepted';
  exception when sqlstate '22023' then null;
  end;
  begin
    perform public.remember_webmaster_read('00000000-0000-4000-8000-000000000001'::uuid,'invalid_action');
    raise exception 'FAIL: invalid action accepted';
  exception when sqlstate '22023' then null;
  end;
  execute 'reset role';
  execute 'set local role anon';
  begin
    perform public.remember_webmaster_read('00000000-0000-4000-8000-000000000001'::uuid,'list');
    raise exception 'FAIL: anon executed RPC';
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
  execute 'set local role authenticated';
  begin
    perform public.remember_webmaster_read('00000000-0000-4000-8000-000000000001'::uuid,'list');
    raise exception 'FAIL: authenticated executed RPC';
  exception when insufficient_privilege then null;
  end;
  execute 'reset role';
end
$test$;
select 'RPC role tests (3 forged-actor actions, null actor, invalid action, anon and authenticated denied)' as test, true as pass;
rollback;

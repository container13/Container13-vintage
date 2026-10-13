-- REVIEW FIRST. Deletes ONLY the explicitly disposable concurrent-test album.
-- Run after BOTH connections finish; no other album may be touched.
begin;
do $check$
declare v remember.albums%rowtype;
begin
 select * into v from remember.albums where id='a2c13000-0000-4000-8000-000000000040' for update;
 if not found then raise exception 'Test album absent; inspect test results'; end if;
 if v.owner_user_id is distinct from '75b71f6c-97b7-4de1-ad14-292b4af4e1fa'::uuid
   or v.title is distinct from 'Remember disposable concurrency test'
   or v.default_opens_at is distinct from '2026-11-01T12:00:00Z'::timestamptz
   or v.default_closes_at is distinct from '2026-11-02T12:00:00Z'::timestamptz then
   raise exception 'Test identity mismatch: cleanup refused';
 end if;
 if exists(select 1 from remember.album_photos where album_id=v.id)
   or exists(select 1 from remember.schedule_audit where album_id=v.id) then
   raise exception 'Dependent data exists: cleanup refused';
 end if;
 delete from remember.albums where id=v.id;
end $check$;
commit;
-- Separate read-only proof: target ID absent and total_albums=0.

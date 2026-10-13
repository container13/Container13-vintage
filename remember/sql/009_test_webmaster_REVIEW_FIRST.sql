-- REVIEW FIRST. NOT EXECUTED. Dedicated container13-remember only.
-- Proposed first webmaster for the user-confirmed Gmail TEST account.
-- Holmen webmaster candidate 007 is NOT executed by this file.
-- Requires explicit approval for this exact account and project.
begin;
do $grant$
begin
  lock table remember.webmasters in share row exclusive mode;
  if exists (select 1 from remember.webmasters) then
    raise exception 'Bootstrap refused: a webmaster already exists';
  end if;
  if not exists (
    select 1 from auth.users
    where id = '75b71f6c-97b7-4de1-ad14-292b4af4e1fa'::uuid
      and email = 'nilsmagnusalvin@gmail.com'
      and email_confirmed_at is not null
      and deleted_at is null
      and (banned_until is null or banned_until <= now())
  ) then
    raise exception 'Bootstrap refused: exact confirmed test identity not found';
  end if;
  insert into remember.webmasters(user_id,granted_by)
    values ('75b71f6c-97b7-4de1-ad14-292b4af4e1fa'::uuid,null);
end
$grant$;
commit;
-- Only adds one Remember role row. Does not grant Supabase organization access.
-- A later separately approved revoke can remove this role; this grant has no expiry.

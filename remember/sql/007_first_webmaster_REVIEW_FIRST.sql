-- Candidate ONLY. Not executed. Dedicated container13-remember ONLY.
-- Requires fresh project-identity check and explicit approval before execution.
-- First webmaster email chosen by user. Do not auto-confirm auth.users.
-- Email confirmation is necessary but not sufficient: review the account identity
-- and creation method before approving this grant.
begin;
do $bootstrap$
declare
  v_user_id uuid;
  v_count integer;
begin
  lock table remember.webmasters in share row exclusive mode;
  if exists (select 1 from remember.webmasters) then
    raise exception 'First-webmaster bootstrap refused: membership already exists';
  end if;
  select count(*) into v_count from auth.users
    where lower(email) = 'magnus.johansson@holmen.com'
      and email_confirmed_at is not null
      and deleted_at is null
      and (banned_until is null or banned_until <= now());
  if v_count <> 1 then
    raise exception 'Bootstrap refused: expected exactly one eligible confirmed account';
  end if;
  select id into strict v_user_id from auth.users
    where lower(email) = 'magnus.johansson@holmen.com'
      and email_confirmed_at is not null
      and deleted_at is null
      and (banned_until is null or banned_until <= now());
  insert into remember.webmasters(user_id, granted_by) values (v_user_id, null);
end
$bootstrap$;
commit;
-- Separate read-only verification after an approved grant:
-- select w.user_id, u.email, u.email_confirmed_at, w.granted_at
-- from remember.webmasters w join auth.users u on u.id = w.user_id;

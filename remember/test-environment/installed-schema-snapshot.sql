-- remember-test only: schema snapshot of installed Remember; no user/album/photo rows.
BEGIN;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname='remember') THEN RAISE EXCEPTION 'remember schema already exists; refusing to overwrite'; END IF; END $$;
CREATE SCHEMA remember;
REVOKE ALL ON SCHEMA remember FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA remember TO service_role;
CREATE TABLE remember."guest_links" (
"album_id" uuid NOT NULL,
"token_sha256" bytea NOT NULL,
"created_by" uuid NOT NULL,
"created_at" timestamp with time zone DEFAULT now() NOT NULL,
"revoked_at" timestamp with time zone,
"rotated_at" timestamp with time zone
);
ALTER TABLE remember."guest_links" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."guest_links" FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE remember."webmasters" (
"user_id" uuid NOT NULL,
"granted_at" timestamp with time zone DEFAULT now() NOT NULL,
"granted_by" uuid
);
ALTER TABLE remember."webmasters" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."webmasters" FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE remember."schema_migrations" (
"version" integer NOT NULL,
"description" text NOT NULL,
"installed_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE remember."schema_migrations" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."schema_migrations" FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE remember."pending_album_registrations" (
"id" uuid NOT NULL,
"email" text NOT NULL,
"title" text NOT NULL,
"starts_at" timestamp with time zone NOT NULL,
"days" integer NOT NULL,
"timezone" text NOT NULL,
"created_at" timestamp with time zone DEFAULT now() NOT NULL,
"consumed_at" timestamp with time zone,
"album_id" uuid
);
ALTER TABLE remember."pending_album_registrations" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."pending_album_registrations" FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE remember."albums" (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"slug" text NOT NULL,
"title" text NOT NULL,
"owner_user_id" uuid NOT NULL,
"event_timezone" text DEFAULT 'Europe/Stockholm'::text NOT NULL,
"default_opens_at" timestamp with time zone NOT NULL,
"default_closes_at" timestamp with time zone NOT NULL,
"override_opens_at" timestamp with time zone,
"override_closes_at" timestamp with time zone,
"forced_closed" boolean DEFAULT false NOT NULL,
"photo_limit" integer DEFAULT 10 NOT NULL,
"revision" bigint DEFAULT 1 NOT NULL,
"created_at" timestamp with time zone DEFAULT now() NOT NULL,
"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE remember."albums" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."albums" FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE remember."album_photos" (
"id" uuid DEFAULT gen_random_uuid() NOT NULL,
"album_id" uuid NOT NULL,
"object_key" text NOT NULL,
"idempotency_key" uuid NOT NULL,
"state" text NOT NULL,
"reservation_expires_at" timestamp with time zone,
"created_at" timestamp with time zone DEFAULT now() NOT NULL,
"content_sha256" bytea
);
ALTER TABLE remember."album_photos" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."album_photos" FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE remember."guest_link_vault" (
"album_id" uuid NOT NULL,
"ciphertext" text NOT NULL
);
ALTER TABLE remember."guest_link_vault" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."guest_link_vault" FROM PUBLIC, anon, authenticated, service_role;
CREATE TABLE remember."schedule_audit" (
"id" bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
"album_id" uuid NOT NULL,
"actor_user_id" uuid NOT NULL,
"action" text NOT NULL,
"before_state" jsonb NOT NULL,
"after_state" jsonb NOT NULL,
"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE remember."schedule_audit" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON remember."schedule_audit" FROM PUBLIC, anon, authenticated, service_role;
ALTER TABLE remember."guest_links" ADD CONSTRAINT "guest_links_pkey" PRIMARY KEY (album_id);
ALTER TABLE remember."guest_links" ADD CONSTRAINT "guest_links_token_sha256_key" UNIQUE (token_sha256);
ALTER TABLE remember."guest_links" ADD CONSTRAINT "token_hash_length" CHECK (octet_length(token_sha256) = 32);
ALTER TABLE remember."webmasters" ADD CONSTRAINT "webmasters_pkey" PRIMARY KEY (user_id);
ALTER TABLE remember."schema_migrations" ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY (version);
ALTER TABLE remember."pending_album_registrations" ADD CONSTRAINT "pending_album_registrations_days_check" CHECK (days >= 1 AND days <= 28);
ALTER TABLE remember."pending_album_registrations" ADD CONSTRAINT "pending_album_registrations_pkey" PRIMARY KEY (id);
ALTER TABLE remember."pending_album_registrations" ADD CONSTRAINT "pending_email_check" CHECK (char_length(email) >= 3 AND char_length(email) <= 254);
ALTER TABLE remember."pending_album_registrations" ADD CONSTRAINT "pending_title_check" CHECK (char_length(title) >= 1 AND char_length(title) <= 100);
ALTER TABLE remember."albums" ADD CONSTRAINT "albums_photo_limit_check" CHECK (photo_limit >= 0 AND photo_limit <= 100000);
ALTER TABLE remember."albums" ADD CONSTRAINT "albums_pkey" PRIMARY KEY (id);
ALTER TABLE remember."albums" ADD CONSTRAINT "albums_slug_check" CHECK (slug ~ '^[a-z0-9][a-z0-9-]{2,62}$'::text);
ALTER TABLE remember."albums" ADD CONSTRAINT "albums_slug_key" UNIQUE (slug);
ALTER TABLE remember."albums" ADD CONSTRAINT "albums_title_check" CHECK (char_length(title) >= 1 AND char_length(title) <= 100);
ALTER TABLE remember."albums" ADD CONSTRAINT "default_window_order" CHECK (default_closes_at > default_opens_at);
ALTER TABLE remember."albums" ADD CONSTRAINT "override_pair" CHECK ((override_opens_at IS NULL) = (override_closes_at IS NULL));
ALTER TABLE remember."albums" ADD CONSTRAINT "override_window_order" CHECK (override_opens_at IS NULL OR override_closes_at > override_opens_at);
ALTER TABLE remember."album_photos" ADD CONSTRAINT "album_photos_album_id_idempotency_key_key" UNIQUE (album_id, idempotency_key);
ALTER TABLE remember."album_photos" ADD CONSTRAINT "album_photos_object_key_key" UNIQUE (object_key);
ALTER TABLE remember."album_photos" ADD CONSTRAINT "album_photos_pkey" PRIMARY KEY (id);
ALTER TABLE remember."album_photos" ADD CONSTRAINT "album_photos_state_check" CHECK (state = ANY (ARRAY['reserved'::text, 'uploading'::text, 'ready'::text, 'failed'::text, 'deleted'::text]));
ALTER TABLE remember."album_photos" ADD CONSTRAINT "remember_photo_digest_32_bytes" CHECK (content_sha256 IS NULL OR octet_length(content_sha256) = 32);
ALTER TABLE remember."guest_link_vault" ADD CONSTRAINT "guest_link_vault_pkey" PRIMARY KEY (album_id);
ALTER TABLE remember."schedule_audit" ADD CONSTRAINT "schedule_audit_action_check" CHECK (action = ANY (ARRAY['set_window'::text, 'close_now'::text, 'reopen'::text, 'restore_defaults'::text]));
ALTER TABLE remember."schedule_audit" ADD CONSTRAINT "schedule_audit_pkey" PRIMARY KEY (id);
ALTER TABLE remember."guest_links" ADD CONSTRAINT "guest_links_album_id_fkey" FOREIGN KEY (album_id) REFERENCES remember.albums(id) ON DELETE CASCADE;
ALTER TABLE remember."guest_links" ADD CONSTRAINT "guest_links_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);
ALTER TABLE remember."webmasters" ADD CONSTRAINT "webmasters_granted_by_fkey" FOREIGN KEY (granted_by) REFERENCES auth.users(id);
ALTER TABLE remember."webmasters" ADD CONSTRAINT "webmasters_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id);
ALTER TABLE remember."albums" ADD CONSTRAINT "albums_owner_user_id_fkey" FOREIGN KEY (owner_user_id) REFERENCES auth.users(id);
ALTER TABLE remember."album_photos" ADD CONSTRAINT "album_photos_album_id_fkey" FOREIGN KEY (album_id) REFERENCES remember.albums(id);
ALTER TABLE remember."guest_link_vault" ADD CONSTRAINT "guest_link_vault_album_id_fkey" FOREIGN KEY (album_id) REFERENCES remember.albums(id);
ALTER TABLE remember."schedule_audit" ADD CONSTRAINT "schedule_audit_actor_user_id_fkey" FOREIGN KEY (actor_user_id) REFERENCES auth.users(id);
ALTER TABLE remember."schedule_audit" ADD CONSTRAINT "schedule_audit_album_id_fkey" FOREIGN KEY (album_id) REFERENCES remember.albums(id);
CREATE INDEX guest_links_active_hash_idx ON remember.guest_links USING btree (token_sha256) WHERE (revoked_at IS NULL);
CREATE UNIQUE INDEX remember_album_active_content_unique ON remember.album_photos USING btree (album_id, content_sha256) WHERE ((content_sha256 IS NOT NULL) AND (state = ANY (ARRAY['uploading'::text, 'ready'::text])));
CREATE INDEX pending_album_email_idx ON remember.pending_album_registrations USING btree (email, created_at DESC);
CREATE OR REPLACE FUNCTION public.remember_webmaster_create_album(p_actor uuid, p_request_id uuid, p_title text, p_event_type text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_timezone text DEFAULT 'Europe/Stockholm'::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 v_album remember.albums%rowtype;
 v_close timestamptz;
 v_title text;
 v_inserted boolean;
 v_count integer;
begin
 if p_actor is null or not exists(
   select 1 from remember.webmasters w join auth.users u on u.id=w.user_id
   where w.user_id=p_actor and u.email_confirmed_at is not null
     and u.deleted_at is null and (u.banned_until is null or u.banned_until<=now())
 ) then return jsonb_build_object('authorized',false); end if;

 v_title := btrim(p_title);
 if p_request_id is null
   or p_request_id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
   or v_title is null or char_length(v_title) not between 1 and 100
   or p_event_type is null or p_event_type not in ('party','wedding','trip','fishing')
   or p_starts_at is null or not isfinite(p_starts_at)
   or p_timezone is null or not exists(
      select 1 from pg_catalog.pg_timezone_names where name=p_timezone
   ) then raise exception 'Invalid album request' using errcode='22023'; end if;

 if p_event_type in ('party','wedding') then
   if p_ends_at is not null then
     raise exception 'Party/wedding end must be omitted' using errcode='22023';
   end if;
   v_close := p_starts_at + interval '24 hours';
 else
   if p_ends_at is null or not isfinite(p_ends_at) or p_ends_at<p_starts_at then
     raise exception 'Invalid trip window' using errcode='22023';
   end if;
   v_close := p_ends_at + interval '24 hours';
 end if;
 if not isfinite(v_close) then
   raise exception 'Invalid close time' using errcode='22023';
 end if;

 -- Stable request UUID is the album ID and opaque locator.
 -- No public guest URL/capability is issued by this pilot RPC.
 insert into remember.albums(
   id,slug,title,owner_user_id,event_timezone,
   default_opens_at,default_closes_at,photo_limit
 ) values (
   p_request_id,p_request_id::text,v_title,p_actor,p_timezone,
   p_starts_at,v_close,10
 ) on conflict(id) do nothing;
 get diagnostics v_count = row_count;
 v_inserted := v_count=1;
 select * into strict v_album from remember.albums where id=p_request_id;

 -- A retry must reproduce exactly the original create defaults and owner.
 -- Never overwrite existing album data, schedules or quotas on retry.
 if v_album.owner_user_id is distinct from p_actor
   or v_album.title is distinct from v_title
   or v_album.event_timezone is distinct from p_timezone
   or v_album.default_opens_at is distinct from p_starts_at
   or v_album.default_closes_at is distinct from v_close then
   raise exception 'Request ID reused with different data' using errcode='22023';
 end if;
 return jsonb_build_object('authorized',true,'created',v_inserted,
   'album',jsonb_build_object('id',v_album.id,'title',v_album.title,
     'event_timezone',v_album.event_timezone,'default_opens_at',v_album.default_opens_at,
     'default_closes_at',v_album.default_closes_at,'photo_limit',v_album.photo_limit));
end
$function$
;
REVOKE ALL ON FUNCTION "public"."remember_webmaster_create_album"(p_actor uuid, p_request_id uuid, p_title text, p_event_type text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_timezone text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_webmaster_create_album"(p_actor uuid, p_request_id uuid, p_title text, p_event_type text, p_starts_at timestamp with time zone, p_ends_at timestamp with time zone, p_timezone text) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_webmaster_guest_link_write(p_actor uuid, p_album uuid, p_action text, p_token_hash bytea DEFAULT NULL::bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_album remember.albums%rowtype; v_count integer;
begin
 if p_actor is null or p_album is null or p_action is null or p_action not in ('issue','rotate','revoke')
   or (p_action in ('issue','rotate') and
       (p_token_hash is null or octet_length(p_token_hash)<>32))
   or (p_action='revoke' and p_token_hash is not null) then
   raise exception 'Invalid request' using errcode='22023';
 end if;
 if not exists (
   select 1 from remember.webmasters w join auth.users u on u.id=w.user_id
   where w.user_id=p_actor and u.email_confirmed_at is not null
     and u.deleted_at is null and (u.banned_until is null or u.banned_until<=now())
 ) then return jsonb_build_object('authorized',false); end if;
 select * into v_album from remember.albums where id=p_album and owner_user_id=p_actor for update;
 if not found then return jsonb_build_object('authorized',false); end if;
 if p_action='issue' then
   insert into remember.guest_links(album_id,token_sha256,created_by)
   values(p_album,p_token_hash,p_actor)
   on conflict(album_id) do nothing;
   get diagnostics v_count=row_count;
   if v_count<>1 then return jsonb_build_object('authorized',true,'created',false,'reason','already_exists'); end if;
 elsif p_action='rotate' then
   update remember.guest_links set token_sha256=p_token_hash,created_by=p_actor,
      created_at=now(),rotated_at=now(),revoked_at=null where album_id=p_album;
   get diagnostics v_count=row_count;
   if v_count<>1 then return jsonb_build_object('authorized',true,'created',false,'reason','not_issued'); end if;
 else
   update remember.guest_links set revoked_at=now() where album_id=p_album and revoked_at is null;
   get diagnostics v_count=row_count;
   if v_count<>1 then return jsonb_build_object('authorized',true,'success',false,'reason','already_revoked_or_missing'); end if;
 end if;
 return jsonb_build_object('authorized',true,'success',true,'action',p_action);
end $function$
;
REVOKE ALL ON FUNCTION "public"."remember_webmaster_guest_link_write"(p_actor uuid, p_album uuid, p_action text, p_token_hash bytea) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_webmaster_guest_link_write"(p_actor uuid, p_album uuid, p_action text, p_token_hash bytea) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_photo_complete_upload(p_photo_id uuid, p_token_hash bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
 IF p_photo_id IS NULL OR p_token_hash IS NULL OR octet_length(p_token_hash)<>32
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state<>'uploading'
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 IF NOT EXISTS (SELECT 1 FROM remember.guest_links g WHERE g.album_id=v_photo.album_id
   AND g.token_sha256=p_token_hash AND g.revoked_at IS NULL)
 OR NOT EXISTS (SELECT 1 FROM remember.albums a WHERE a.id=v_photo.album_id
   AND NOT a.forced_closed AND now()>=COALESCE(a.override_opens_at,a.default_opens_at)
   AND now()<COALESCE(a.override_closes_at,a.default_closes_at))
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='ready' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_photo_complete_upload"(p_photo_id uuid, p_token_hash bytea) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_photo_complete_upload"(p_photo_id uuid, p_token_hash bytea) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_photo_begin_upload(p_photo_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
 IF p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state<>'reserved' OR v_photo.reservation_expires_at<=now()
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='uploading' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true,'objectKey',v_photo.object_key);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_photo_begin_upload"(p_photo_id uuid) FROM PUBLIC, anon, authenticated, service_role;
CREATE OR REPLACE FUNCTION public.remember_webmaster_read(p_actor uuid, p_action text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_version integer; v_albums jsonb;
begin
 if p_actor is null or p_action is null or p_action not in ('role_check','installation_status','list') then
  raise exception 'Invalid request' using errcode='22023';
 end if;
 if not exists(select 1 from remember.webmasters where user_id=p_actor) then
  return jsonb_build_object('authorized',false);
 end if;
 if p_action='role_check' then return jsonb_build_object('authorized',true); end if;
 if p_action='installation_status' then
  select max(version) into v_version from remember.schema_migrations;
  return jsonb_build_object('authorized',true,'schemaVersion',v_version,'expectedVersion',2,'ready',v_version=2);
 end if;
 select coalesce(jsonb_agg(to_jsonb(a)),'[]'::jsonb) into v_albums from (
  select x.id,x.slug,x.title,x.event_timezone,x.default_opens_at,x.default_closes_at,
   x.override_opens_at,x.override_closes_at,x.forced_closed,x.revision,
   x.owner_user_id,coalesce(u.email,'') as owner_email
  from remember.albums x left join auth.users u on u.id=x.owner_user_id
  order by x.created_at desc limit 100
 ) a;
 return jsonb_build_object('authorized',true,'albums',v_albums);
end
$function$
;
REVOKE ALL ON FUNCTION "public"."remember_webmaster_read"(p_actor uuid, p_action text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_webmaster_read"(p_actor uuid, p_action text) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_guest_metadata_read(p_token_hash bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
 v_title text;
 v_opens timestamptz;
 v_closes timestamptz;
 v_closed boolean;
BEGIN
 IF p_token_hash IS NULL OR octet_length(p_token_hash) <> 32
 THEN RETURN jsonb_build_object('found', false); END IF;

 SELECT a.title,
        COALESCE(a.override_opens_at, a.default_opens_at),
        COALESCE(a.override_closes_at, a.default_closes_at),
        a.forced_closed
 INTO v_title, v_opens, v_closes, v_closed
 FROM remember.guest_links g
 JOIN remember.albums a ON a.id = g.album_id
 WHERE g.token_sha256 = p_token_hash AND g.revoked_at IS NULL;

 IF NOT FOUND THEN RETURN jsonb_build_object('found', false); END IF;

 RETURN jsonb_build_object(
  'found', true,
  'title', v_title,
  'uploadsOpen', NOT COALESCE(v_closed, true)
     AND now() >= v_opens AND now() < v_closes
 );
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_guest_metadata_read"(p_token_hash bytea) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_guest_metadata_read"(p_token_hash bytea) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_guest_link_vault_save(p_actor uuid, p_album uuid, p_ciphertext text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
 IF p_ciphertext IS NULL OR length(p_ciphertext)>1000 OR NOT EXISTS (SELECT 1 FROM remember.webmasters w JOIN remember.albums a ON a.owner_user_id=w.user_id WHERE w.user_id=p_actor AND a.id=p_album) THEN RETURN false; END IF;
 INSERT INTO remember.guest_link_vault(album_id,ciphertext) VALUES(p_album,p_ciphertext) ON CONFLICT(album_id) DO UPDATE SET ciphertext=excluded.ciphertext;
 RETURN true;
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_guest_link_vault_save"(p_actor uuid, p_album uuid, p_ciphertext text) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_guest_link_vault_save"(p_actor uuid, p_album uuid, p_ciphertext text) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_guest_photo_reserve(p_token_hash bytea, p_request_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
 v_album remember.albums%ROWTYPE;
 v_existing remember.album_photos%ROWTYPE;
 v_used integer;
 v_photo_id uuid;
 v_key text;
BEGIN
 IF p_token_hash IS NULL OR octet_length(p_token_hash)<>32
 OR p_request_id IS NULL
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;

 SELECT a.* INTO v_album
 FROM remember.guest_links g
 JOIN remember.albums a ON a.id=g.album_id
 WHERE g.token_sha256=p_token_hash AND g.revoked_at IS NULL
 FOR UPDATE OF a;

 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;

 SELECT * INTO v_existing FROM remember.album_photos
 WHERE album_id=v_album.id AND idempotency_key=p_request_id;
 IF FOUND THEN
   IF v_existing.state='reserved' AND v_existing.reservation_expires_at<=now() THEN
     UPDATE remember.album_photos SET state='failed' WHERE id=v_existing.id;
   END IF;
   RETURN jsonb_build_object('accepted',v_existing.state='ready' OR (v_existing.state IN ('reserved','uploading') AND v_existing.reservation_expires_at>now()),
     'reason','existing','photoId',v_existing.id);
 END IF;

 IF v_album.forced_closed OR now()<COALESCE(v_album.override_opens_at,v_album.default_opens_at)
 OR now()>=COALESCE(v_album.override_closes_at,v_album.default_closes_at)
 THEN RETURN jsonb_build_object('accepted',false,'reason','closed'); END IF;

 -- Reclaim abandoned reservations only; never reclaim an upload already in progress.
 UPDATE remember.album_photos SET state='failed'
 WHERE album_id=v_album.id AND state='reserved'
   AND reservation_expires_at<=now();

 SELECT count(*) INTO v_used FROM remember.album_photos
 WHERE album_id=v_album.id AND state IN ('reserved','uploading','ready');
 IF v_used>=v_album.photo_limit
 THEN RETURN jsonb_build_object('accepted',false,'reason','limit'); END IF;

 v_photo_id:=gen_random_uuid();
 v_key:=v_album.id::text||'/'||v_photo_id::text;
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,reservation_expires_at)
 VALUES(v_photo_id,v_album.id,v_key,p_request_id,'reserved',now()+interval '15 minutes');

 RETURN jsonb_build_object('accepted',true,'reason','reserved','photoId',v_photo_id);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_guest_photo_reserve"(p_token_hash bytea, p_request_id uuid) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_guest_photo_reserve"(p_token_hash bytea, p_request_id uuid) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_photo_claim_upload(p_photo_id uuid, p_content_sha256 bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
 IF p_photo_id IS NULL OR p_content_sha256 IS NULL OR octet_length(p_content_sha256)<>32
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','not_found'); END IF;
 IF v_photo.state='uploading' AND v_photo.content_sha256=p_content_sha256
 THEN RETURN jsonb_build_object('accepted',false,'reason','in_progress','photoId',v_photo.id); END IF;
 IF v_photo.state='ready' AND v_photo.content_sha256=p_content_sha256
 THEN RETURN jsonb_build_object('accepted',false,'reason','already_ready','photoId',v_photo.id); END IF;
 IF v_photo.state<>'reserved' OR v_photo.reservation_expires_at<=now()
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid_state'); END IF;
 BEGIN
  UPDATE remember.album_photos
  SET state='uploading',content_sha256=p_content_sha256
  WHERE id=v_photo.id;
 EXCEPTION WHEN unique_violation THEN
  -- The unique-index conflict rolled back the claim subtransaction.
  -- This reservation never reached storage: release its unused quota slot.
  UPDATE remember.album_photos SET state='failed'
  WHERE id=v_photo.id AND state='reserved';
  RETURN jsonb_build_object('accepted',false,'reason','duplicate');
 END;
 RETURN jsonb_build_object('accepted',true,'reason','claimed',
   'photoId',v_photo.id,'objectKey',v_photo.object_key);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_photo_claim_upload"(p_photo_id uuid, p_content_sha256 bytea) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_photo_claim_upload"(p_photo_id uuid, p_content_sha256 bytea) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_photo_fail_upload(p_photo_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_photo remember.album_photos%ROWTYPE;
BEGIN
 IF p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO v_photo FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR v_photo.state NOT IN ('reserved','uploading')
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='failed' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_photo_fail_upload"(p_photo_id uuid) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_photo_fail_upload"(p_photo_id uuid) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_webmaster_photo_complete(p_actor uuid, p_photo_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE p remember.album_photos%ROWTYPE;
BEGIN
 IF p_actor IS NULL OR p_photo_id IS NULL THEN RETURN jsonb_build_object('accepted',false); END IF;
 SELECT * INTO p FROM remember.album_photos WHERE id=p_photo_id FOR UPDATE;
 IF NOT FOUND OR p.state<>'uploading' THEN RETURN jsonb_build_object('accepted',false); END IF;
 IF NOT EXISTS(SELECT 1 FROM remember.albums a WHERE a.id=p.album_id AND a.owner_user_id=p_actor)
 THEN RETURN jsonb_build_object('accepted',false); END IF;
 UPDATE remember.album_photos SET state='ready' WHERE id=p_photo_id;
 RETURN jsonb_build_object('accepted',true);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_webmaster_photo_complete"(p_actor uuid, p_photo_id uuid) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_webmaster_photo_complete"(p_actor uuid, p_photo_id uuid) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_photo_gallery_read(p_actor uuid, p_album_id uuid, p_token_hash bytea)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE aid uuid; items jsonb;
BEGIN
 IF p_actor IS NOT NULL AND p_album_id IS NOT NULL AND p_token_hash IS NULL THEN
  IF NOT EXISTS(SELECT 1 FROM remember.webmasters WHERE user_id=p_actor) THEN RETURN jsonb_build_object('authorized',false); END IF;
  aid:=p_album_id;
 ELSIF p_actor IS NULL AND p_album_id IS NULL AND p_token_hash IS NOT NULL AND octet_length(p_token_hash)=32 THEN
  SELECT album_id INTO aid FROM remember.guest_links WHERE token_sha256=p_token_hash AND revoked_at IS NULL;
 ELSE RETURN jsonb_build_object('authorized',false); END IF;
 IF aid IS NULL OR NOT EXISTS(SELECT 1 FROM remember.albums WHERE id=aid) THEN RETURN jsonb_build_object('authorized',false); END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object('id',id,'objectKey',object_key,'createdAt',created_at) ORDER BY created_at DESC,id DESC),'[]'::jsonb)
 INTO items FROM (SELECT id,object_key,created_at FROM remember.album_photos WHERE album_id=aid AND state='ready' ORDER BY created_at DESC,id DESC LIMIT 100) p;
 RETURN jsonb_build_object('authorized',true,'photos',items);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_photo_gallery_read"(p_actor uuid, p_album_id uuid, p_token_hash bytea) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_photo_gallery_read"(p_actor uuid, p_album_id uuid, p_token_hash bytea) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_guest_link_vault_read(p_actor uuid, p_album uuid)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v text;
BEGIN
 IF NOT EXISTS (SELECT 1 FROM remember.webmasters w JOIN remember.albums a ON a.owner_user_id=w.user_id WHERE w.user_id=p_actor AND a.id=p_album) THEN RETURN NULL; END IF;
 SELECT ciphertext INTO v FROM remember.guest_link_vault WHERE album_id=p_album;
 RETURN v;
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_guest_link_vault_read"(p_actor uuid, p_album uuid) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_guest_link_vault_read"(p_actor uuid, p_album uuid) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_guest_link_matches(p_album uuid, p_token_hash bytea)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$ SELECT EXISTS(SELECT 1 FROM remember.guest_links WHERE album_id=p_album AND token_sha256=p_token_hash AND revoked_at IS NULL) $function$
;
REVOKE ALL ON FUNCTION "public"."remember_guest_link_matches"(p_album uuid, p_token_hash bytea) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_guest_link_matches"(p_album uuid, p_token_hash bytea) TO service_role;
CREATE OR REPLACE FUNCTION public.remember_owner_album_list(p_actor uuid)
 RETURNS jsonb
 LANGUAGE sql
 SET search_path TO ''
AS $function$
SELECT '[]'::jsonb
$function$
;
CREATE OR REPLACE FUNCTION public.remember_webmaster_photo_reserve(p_actor uuid, p_album_id uuid, p_request_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE a remember.albums%ROWTYPE; existing remember.album_photos%ROWTYPE; used integer; pid uuid;
BEGIN
 IF p_actor IS NULL OR p_album_id IS NULL OR p_request_id IS NULL
 THEN RETURN jsonb_build_object('accepted',false,'reason','invalid'); END IF;
 SELECT * INTO a FROM remember.albums WHERE id=p_album_id FOR UPDATE;
 IF NOT FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','not_found'); END IF;
 IF a.owner_user_id IS DISTINCT FROM p_actor
 THEN RETURN jsonb_build_object('accepted',false,'reason','forbidden'); END IF;
 SELECT * INTO existing FROM remember.album_photos WHERE album_id=a.id AND idempotency_key=p_request_id;
 IF FOUND THEN RETURN jsonb_build_object('accepted',false,'reason','existing'); END IF;
 UPDATE remember.album_photos SET state='failed'
 WHERE album_id=a.id AND state='reserved' AND reservation_expires_at<=now();
 SELECT count(*) INTO used FROM remember.album_photos
 WHERE album_id=a.id AND state IN ('reserved','uploading','ready');
 IF used>=a.photo_limit THEN RETURN jsonb_build_object('accepted',false,'reason','limit'); END IF;
 pid:=gen_random_uuid();
 INSERT INTO remember.album_photos(id,album_id,object_key,idempotency_key,state,reservation_expires_at)
 VALUES(pid,a.id,a.id::text||'/'||pid::text,p_request_id,'reserved',now()+interval '15 minutes');
 RETURN jsonb_build_object('accepted',true,'photoId',pid);
END $function$
;
REVOKE ALL ON FUNCTION "public"."remember_webmaster_photo_reserve"(p_actor uuid, p_album_id uuid, p_request_id uuid) FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION "public"."remember_webmaster_photo_reserve"(p_actor uuid, p_album_id uuid, p_request_id uuid) TO service_role;
GRANT INSERT, SELECT, UPDATE, DELETE ON remember."guest_links" TO service_role;
GRANT INSERT, SELECT, UPDATE ON remember."pending_album_registrations" TO service_role;
GRANT INSERT, SELECT, UPDATE, DELETE ON remember."albums" TO service_role;
GRANT SELECT, DELETE ON remember."album_photos" TO service_role;
GRANT INSERT, SELECT, UPDATE, DELETE ON remember."guest_link_vault" TO service_role;
GRANT SELECT, DELETE ON remember."schedule_audit" TO service_role;
INSERT INTO remember.schema_migrations(version,description) VALUES (1,'Remember baseline schema');
INSERT INTO remember.schema_migrations(version,description) VALUES (2,'Service-only idempotent webmaster album creation');
INSERT INTO remember.schema_migrations(version,description) VALUES (3,'Guest capability hash storage only; guest API disabled');
INSERT INTO remember.schema_migrations(version,description) VALUES (4,'Service-only guest link issue rotate revoke RPC; public access disabled');
INSERT INTO remember.schema_migrations(version,description) VALUES (5,'Service-only guest metadata lookup; no guest photo access');
INSERT INTO remember.schema_migrations(version,description) VALUES (6,'Atomic guest photo reservation gateway; storage disabled');
INSERT INTO remember.schema_migrations(version,description) VALUES (7,'Server-only upload state transitions; endpoint not deployed');
INSERT INTO remember.schema_migrations(version,description) VALUES (8,'Review-only album-scoped exact SHA-256 uniqueness for active photos');
INSERT INTO remember.schema_migrations(version,description) VALUES (9,'Verified webmaster photo reservation and completion');
INSERT INTO remember.schema_migrations(version,description) VALUES (10,'Private gallery read with verified guest or webmaster authorization');
INSERT INTO storage.buckets(id,name,public,file_size_limit,allowed_mime_types) VALUES ('remember-photos','remember-photos',false,10485760,ARRAY['image/jpeg','image/png','image/webp']),('remember-private-photos','remember-private-photos',false,10485760,ARRAY['image/jpeg','image/png','image/webp']);
ALTER ROLE authenticator SET pgrst.db_schemas = 'public, graphql_public, remember';
NOTIFY pgrst, 'reload config';
NOTIFY pgrst, 'reload schema';
COMMIT;

BEGIN READ ONLY;
SELECT table_name,column_name,column_default,is_nullable
FROM information_schema.columns WHERE table_schema='remember'
AND table_name IN ('albums','pending_album_registrations') AND column_name='guest_mode';
SELECT guest_mode,count(*) FROM remember.albums GROUP BY guest_mode;
SELECT feature_key,mode FROM remember.security_feature_flags;
SELECT r.role_name,has_function_privilege(r.role_name,'public.remember_complete_album_registration(uuid,uuid)','EXECUTE') allowed
FROM (VALUES ('anon'),('authenticated'),('service_role')) r(role_name);
SELECT (SELECT count(*) FROM remember.albums) albums,
 (SELECT count(*) FROM remember.album_photos) photos,
 (SELECT count(*) FROM storage.objects WHERE bucket_id='remember-private-photos') objects;
ROLLBACK;

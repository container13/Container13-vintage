-- READ ONLY. Run against Remember Test before any migration.
-- No DDL or DML. A failed assertion means STOP and investigate.
BEGIN READ ONLY;
DO $preflight$
DECLARE n integer;
BEGIN
 SELECT count(*) INTO n FROM information_schema.tables
 WHERE table_schema='remember' AND table_name IN ('albums','webmasters');
 IF n<>2 THEN RAISE EXCEPTION 'Required baseline tables missing'; END IF;
 SELECT count(*) INTO n FROM pg_catalog.pg_class c
 JOIN pg_catalog.pg_namespace s ON s.oid=c.relnamespace
 WHERE s.nspname='remember' AND c.relname IN ('albums','webmasters')
 AND c.relrowsecurity;
 IF n<>2 THEN RAISE EXCEPTION 'Baseline RLS not enabled'; END IF;
 SELECT count(*) INTO n FROM information_schema.columns
 WHERE table_schema='remember' AND
 ((table_name='albums' AND column_name IN ('id','owner_user_id'))
 OR (table_name='webmasters' AND column_name='user_id'));
 IF n<>3 THEN RAISE EXCEPTION 'Ownership columns mismatch'; END IF;
 SELECT count(*) INTO n FROM information_schema.tables
 WHERE table_schema='remember' AND table_name LIKE 'security_%';
 IF n<>0 THEN RAISE EXCEPTION 'Security tables already exist: do not reinstall'; END IF;
END;
$preflight$;
SELECT 'PRECHECK_OK_NO_CHANGES' AS status,
 (SELECT count(*) FROM remember.albums) AS albums,
 (SELECT count(*) FROM remember.album_photos) AS photos;
ROLLBACK;

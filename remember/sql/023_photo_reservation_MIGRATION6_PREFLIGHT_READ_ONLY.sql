-- READ-ONLY preflight for Remember migration 6. Run in dedicated Remember project only.
-- No schema changes, no reservations created.
BEGIN READ ONLY;
SELECT
 (SELECT max(version) FROM remember.schema_migrations) AS current_schema_version,
 to_regclass('remember.album_photos') IS NOT NULL AS photos_table_exists,
 to_regclass('remember.guest_links') IS NOT NULL AS guest_links_table_exists,
 (SELECT count(*) FROM remember.albums) AS album_count,
 (SELECT count(*) FROM remember.album_photos) AS photo_rows_before_migration,
 (SELECT count(*) FROM remember.album_photos WHERE state IN ('reserved','uploading','ready')) AS active_photo_rows,
 NOT EXISTS(SELECT 1 FROM remember.schema_migrations WHERE version >= 6) AS migration6_not_installed;
ROLLBACK;

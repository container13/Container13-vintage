# Database recovery inventory — 2026-10-16

Project: `wykvztfmfbboxiqvuvwr`. Read-only Supabase inspection, no mutations.

## Schema remember
Eight tables: album_photos, albums, guest_link_vault, guest_links, pending_album_registrations, schedule_audit, schema_migrations, webmasters.

Relation sizes (bytes, includes indexes): album_photos 81920; albums 49152; guest_link_vault 32768; guest_links 65536; pending_album_registrations 49152; schedule_audit 16384; schema_migrations 32768; webmasters 24576. Estimated row counts were -1 (unknown); do not treat as actual counts.

## Public RPCs
16 functions:
remember_guest_link_matches; remember_guest_link_vault_read; remember_guest_link_vault_save; remember_guest_metadata_read; remember_guest_photo_reserve; remember_owner_album_list; remember_photo_begin_upload; remember_photo_claim_upload; remember_photo_complete_upload; remember_photo_fail_upload; remember_photo_gallery_read; remember_webmaster_create_album; remember_webmaster_guest_link_write; remember_webmaster_photo_complete; remember_webmaster_photo_reserve; remember_webmaster_read.

## Recovery scope
Preserve `remember` tables, indexes, constraints, RLS and grants, public Remember RPC definitions and privileges, migration history, and account/auth dependencies. Store row data privately, not in GitHub. Edge Function source snapshots have been separately captured on this branch. Remember test photos are disposable; Micke50 is a separate Supabase project.

## Status and next gate
Inventory: PASS. Actual external database dump: NOT DONE. Non-destructive restore verification: NOT DONE. Do not deploy the atomic rotation migration until a restorable dump is verified. Never describe this inventory as a backup.

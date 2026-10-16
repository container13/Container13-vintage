# Remember recovery gate — 2026-10-16

Status: INVENTORY COMPLETE / RESTORABLE BACKUP NOT YET VERIFIED.

## Current safe checkpoint
- Application source branch: `ccc-demo-public-test`, Remember release candidate `0.1.75` (device PASS pending).
- Isolated design branch: `remember-security-isolated-tests`.
- Supabase project ref: `wykvztfmfbboxiqvuvwr` (existing development project; no production customers according to owner).
- Read-only database inspection confirmed eight tables in schema `remember`: `album_photos`, `albums`, `guest_link_vault`, `guest_links`, `pending_album_registrations`, `schedule_audit`, `schema_migrations`, `webmasters`.
- Both photo storage buckets are private: `remember-photos` and `remember-private-photos`.
- Current migration history is available through Supabase and includes guest link vault, owner management, gallery, and role permission migrations through `remember_webmaster_album_owner_identity`.
- Guest link rotation SQL proposal and rollback test plan are committed on this isolated branch, NOT executed.

## Mandatory pre-change gate
1. Export the full `remember` schema and rows to a secure, access-restricted backup outside the live database; preserve sensitive token hashes and vault ciphertext confidentially, not in GitHub.
2. Back up both Storage buckets' test image objects with object paths and metadata; a database dump alone does NOT restore images.
3. Inventory current deployed Edge Function versions and keep retrievable source for rollback.
4. Verify restore in a separate temporary environment (or equivalent non-destructive recovery drill), including database relations, owner access, guest links, and image retrieval.
5. Record backup location, restore commands, verification outcome, timestamp, and operator. Never commit secrets, raw customer/user emails, guest tokens, or vault ciphertext.
6. Only then consider an approved migration/deployment in the existing development project. For each change, record migration ID and a tested rollback/forward-fix plan.

## Stop rule
No schema mutation or link rotation deployment until the restore gate is actually PASS. Source inventory is NOT a backup, and GitHub history does not back up Supabase rows or Storage objects.

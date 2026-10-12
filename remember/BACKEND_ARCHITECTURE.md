# Remember - backend architecture candidate (not deployed)

Status: DESIGN / HIGH RISK. Reuse the existing Supabase project only after checking isolation, permissions, quotas and operating costs. Do not reuse Micke50bilder bucket or Micke50 admin PIN/function for Remember.

## Data model v1 (proposed)
- albums: id UUID primary key, slug unique, title, description, owner_user_id, status, plan, photo_limit (10 for free), created_at, updated_at.
- album_members: album_id, user_id, role (owner/admin) with unique membership and RLS.
- album_photos: id UUID, album_id, object_key, uploader_session_id, status (reserved/uploading/ready/failed/deleted), size_bytes, mime_type, created_at; unique idempotency key scoped to album.
- album_invites: album_id, token_hash, role (guest_upload), expires_at, revoked_at. Never expose raw tokens in database responses.
- album_events: album_id, event_type, idempotency_key, created_at; audit changes without storing unnecessary personal data.
- purchases: album_id, payment_provider, external_payment_id unique, status, plan; upgrades only after verified provider webhook.

## Access and URL model
- Public-looking slug is a locator, not proof of permission. Decide whether albums are unlisted or invite-only before launch.
- Guest share URL/QR uses stable slug plus a protected guest access mechanism; guest cannot administer or enumerate other albums.
- Owner authenticates with verified email (e.g. Supabase Auth magic link) and authorization checks against album owner/membership on every privileged operation.
- All media private by default; signed short-lived read URLs issued only after access validation. No anonymous list/write policies on storage.
- Validate slug uniqueness server-side and reserve protected names.

## Upload transaction
1. Client requests a reservation with album guest authorization, file metadata, and a stable idempotency key.
2. Server transaction locks/atomically counts reserved+uploading+ready photos and refuses when limit 10 is reached. Duplicate request returns same reservation.
3. Server issues a short-lived upload permission for one object key in an album-scoped private bucket.
4. Client uploads and asks to finalize; server validates object metadata, ownership, file type/size, and reservation before marking ready.
5. Expired reservations are reclaimed safely. Deletion and payment changes update quota only through authorized server logic.
6. Rate limiting, abuse checks, image safety, limits and lifecycle/retention policy are required before production.

## Email and purchase
- Verify owner email and send administration link through an authenticated service.
- Offer optional upgrade at 10 photos, not mandatory purchase; free album remains accessible.
- Email transaction receipts through provider and avoid marketing mail without a lawful basis.
- Keep slug, QR and photos on upgrade; payment webhook is verified and idempotent.
- Provider, price, retention, public/unlisted model and email vendor are still OPEN decisions.

## Gates before any production deployment
- Confirm actual Supabase project ownership and safe test environment, secrets and RLS policies.
- Test concurrent uploads from two devices: 9 ready + 2 simultaneous must never exceed 10.
- Test duplicate taps/retries, abandoned upload, invalid file, revoked invite, slug collision, expired token and cross-album isolation.
- Test iPhone Safari, Android and desktop; verify actual deployment separately from GitHub commit.
- Preserve Micke50 and avoid production schema/storage changes until reviewed.

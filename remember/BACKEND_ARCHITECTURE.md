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

## Time-limited guest uploads - agreed policy
- Album is unlisted and available to anyone holding its high-entropy share link/QR; the link is a bearer capability, not owner/admin access. Support revocation/rotation and abuse controls. Human-readable slugs alone are insufficient access secrets.
- Persist upload_opens_at and upload_closes_at as UTC instants, plus IANA event_timezone. Party/wedding defaults to a 24-hour window starting at the owner's specified event start. Trip/fishing/holiday runs from specified start through 24 hours after specified end.
- Owner can close early via authorized operation. Album stays readable after close, subject to separately decided retention/privacy policies. Payment upgrade never automatically reopens uploads.
- Backend checks both quota and server time on reservation AND finalization; reject late finalizations, revoke or expire pending upload grants and clean orphaned objects. Idempotent retries cannot bypass closure.
- Display a local-time close date/time and countdown; daylight-saving changes must be handled using event timezone, not fixed client offsets. Test simultaneous uploads across closing boundary and revoked link behavior.

## Webmaster schedule administration
- Add a dedicated webmaster/admin role, enforced server-side, with least-privilege access. Never authorize admin through public link, client-side flag, shared PIN or service-role key in the browser.
- Store default event schedule separately from effective upload window and optional webmaster override so reset is unambiguous.
- Admin can change UTC opens/closes instants, close now, reopen or reset to defaults. Validate ordering, timezone and concurrent edits; changes must be audited with actor, old/new values and timestamp.
- Server checks effective window on reservation and finalization. A schedule change must invalidate previously issued permissions when appropriate; never allow stale upload authorization to bypass a close.
- Test immediate closure, reopening, crossing midnight/DST, concurrent uploads, and owner versus webmaster permissions before release.

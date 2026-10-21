# Owner view of inactive albums – 0.1.155
2026-10-21. User iPhone report: after deactivating an album in Webmaster, Albumägare showed no inactive status.

## Root cause
The development role switcher navigates to album-admin.html?view=owner with the same authenticated webmaster. It changes the preview, never server authorization. That page fetched is_active but did not use it in owner preview and still mounted the privileged gallery. The genuine owner endpoint also omitted is_active from its explicit list projection, so owner.html could not show the status before a gallery error.

Read-only verification of Remember development confirmed the user's deactivation: tested album is_active=false, revision=2. This is evidence that saving worked; it is not a PASS for the owner preview. No album was reactivated or otherwise changed by this fix.

## Change
- In owner preview, show a generic visible inactive notice and hide photo/upload/sharing controls. Do not mount/fetch the gallery. Keep role navigation so Webmaster can administer the album.
- In genuine owner.html, use server is_active=false to show the notice and keep the album content hidden; skip initial gallery/moderation fetches.
- remember-owner-manager list adds only is_active to id/title/created_at, retaining the server-derived owner filter and existing authorization. No private reason is returned.
- One scoped notice style in remember-design.css, with CSS cache keys refreshed on normal entrypoints that use that stylesheet.
- Webmaster settings and optional admin gallery are unchanged. Active album owners are unchanged. No photobook, image viewer, account, SQL schema, guest token or existing album data changes.

## Evidence
- Actual owner-manager v4 matched the committed pre-fix source in development-installed/2026-10-21-controls/remember-owner-manager/index.ts at f46b2d3f2d38491c03ca2bc5d767db26d0e53f6f.
- Node TS/ESM syntax PASS for both HTML modules and Edge source.
- DOM modules executed with mock auth/API: inactive owner preview notice/hidden actions/sharing/no gallery; active preview gallery; inactive webmaster retains settings and explicit gallery; inactive real owner notice/no content/no gallery; active real owner retains gallery. All five PASS.
- Edge source executed with mock service client: owner list includes is_active=false, query retains owner_user_id from verified Auth, unauthenticated request returns 401. PASS.
- remember-owner-manager deployed v5, verify_jwt=false preserved (body verifies Auth); exact source readback PASS.
- Real in-session iPhone owner preview and owner-account acceptance after deployment remains PENDING. No fabricated user sessions or real emails were used.

## Next acceptance
In normal Remember 0.1.155, reopen the same inactive album via Albumägare. Expect “Albumet är tillfälligt avstängt”, no gallery or owner tools. Switch to Webmaster to review/reactivate. After reactivation and reopening, the ordinary owner view should return. Keep time-save/readback and guest-link checks in the shared checklist; they are not implied PASS by this UI fix.

## Lesson and rollback
Check both the owner API data contract and the development preview when changing access state. A privileged preview must explicitly reflect the selected role's visible state; displaying role text alone does not remove webmaster privileges.
Rollback source commit f46b2d3f2d38491c03ca2bc5d767db26d0e53f6f and previous deployed owner Edge v4 are preserved in the controls installation archive. Selective UI rollback only; do not undo activation schema/guards or reactivate user albums as part of a display fix.

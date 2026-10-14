# Remember 0.1.20 — background and UI verification

## Scope and rollback
Branch: ccc-demo-public-test. Baseline/rollback: d1a9576114b81ed51de1c7a5e26996a91eafa786.
Presentation version: 0.1.20 (shared CSS header and matching HTML cache keys/labels).
Backend functional version labels remain; no database/Edge Function/auth configuration changes.
Documentation-only evidence updates do not bump the runtime version.

## Exact original assets
All five supplied WebPs are preserved byte for byte; no illustration, upscaling or re-encoding.
- `inloggning.webp`: 216016 bytes; git blob `25a92c22705abfffce960fd2083a24f8cd422677`; SHA256 `6a428ba38a2582d003980cd84d4674fe8b33a841bfe5477a2a31246cc8c3be2a`.
- `mina-album.webp`: 25622 bytes; git blob `43059945dd141646e91cae85b6fe39eacbc227b6`; SHA256 `edf91ffca4f3fec3cfab393fe95675cad75d0896bf4e488bf53ba4e647f93f47`.
- `profil.webp`: 25444 bytes; git blob `f6f0fba35d91fa21e7461b83ecf1c879a573a664`; SHA256 `4e47a6f54d336509ee340808dfe968af2dbe019b3f158ed775776a567ed71fe3`.
- `skapa-album.webp`: 49258 bytes; git blob `3520002bbfdeb99bb63e4cc5de5bc67045e24768`; SHA256 `4f9eb743838c5f3ebf5fe810461156febd017463be924b8a5675985018f94368`.
- `titta-pa-minnen.webp`: 21538 bytes; git blob `13778a847b01e135dd0056072955274bb0700ee0`; SHA256 `f23e02deaa6c3f9292a0b83d1d7796dc843c2c253e4b1ebd0e4da2bde2f09e03`.

## Mapping
- login.html → inloggning.webp.
- dashboard.html → mina-album.webp.
- register.html → skapa-album.webp.
- album.html, owner.html, album-admin.html → titta-pa-minnen.webp.
- Existing Dashboard Kontoinställningar details open (and login password settings open) → profil.webp; closing restores normal background. There is no standalone profile page; no duplicate flow added.
- All image URLs are local to shared CSS. Old Unsplash login background is removed. index.html's four photographic book examples are content, not page backgrounds; preserved.
- Fixed backdrop crops with cover, centered on desktop and center/top on mobile; no background stretching down long forms. Readable dark brown translucent panels and warm light text.

## Concrete inspection fixes
- Dashboard contained literal backslash-n between CSS rules; this broke the new-album CTA selector. Corrected owning markup/styles and aligned brand subtitle.
- Dashboard album-list failure silently hid the section. Now gives a visible error and retry, retaining the new-album entry.
- Registration submit stays disabled until SDK initialization and enables after initialization; server failure leaves a usable retry.
- Owner upload entry fetches existing share link and opens the guest upload page directly. Missing legacy link shows replacement explanation. No link rotation without the existing explicit confirmation.
- Warm gallery/photo cards, visible keyboard focus and long identity/title wrapping.

## Tests before publication — STATIC / FIXTURE PASS
- All six affected HTML module scripts parse with node --check; git diff --check PASS.
- login, album and album-admin scripts unchanged byte-for-byte. Dashboard/register/owner changes limited to the documented error/init/upload-entry fixes.
- Chromium153 on Linux: rendered 7 states (login, dashboard, registration, owner, guest album, webmaster album, open settings) at 390×844, 820×1180, 1440×900. 21 captures, no horizontal overflow. These use static fixture states with page scripts removed; not authenticated runtime screenshots.
- Separate real page scripts with intercepted SDK/API fixtures: password/back controls; album-list503 and retry; profile open/close; owner QR URL and direct upload navigation; missing legacy link without auto rotation; invalid guest link disables uploads; registration initialization and503 retry.
- Form overflow also checked at320×568 and844×390.
- No real emails sent, albums created, photos uploaded/deleted, credentials requested or guest tokens retrieved.
- Read-only actual Supabase: ACTIVE_HEALTHY, schema10,2 albums,3 ready photos, bucket.public=false,8 active functions. Historical state retained, not treated as current backend truth.

## Remaining gates
GitHub exact readback, published asset HTTP/decode and live anonymous smoke pending at this checkpoint. Physical iPhone Safari/Android touch, keyboard and pinch tests; authenticated real album/QR regression; original approved sketch side-by-side acceptance remain unverified. Full product stays PENDING; no CURRENT promotion from fixtures.

Four backgrounds are lower resolution (469–762 pixels wide) and can look softer on large displays. Originals deliberately preserved; do not generate replacements without a new user instruction.

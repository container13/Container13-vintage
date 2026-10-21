# Gallery framing 0.1.160 — 2026-10-21

Approved: a single dark translucent panel around heading, count and shared image grid; thin warm-white passepartout borders, subtle shadows, even spacing, two photos per mobile row.

Implementation is CSS only in remember-design.css, scoped to #rememberGallery and direct .remember-gallery-grid > img descendants. Shared galleries in album-admin.html and album.html receive it. The separate owner.html management photo cards keep their existing presentation. The existing square thumbnail object-fit stays unchanged; original images are not edited. Three columns at 650px and above follow the previous gallery breakpoint. No gallery JS, upload, auth, backend, camera or photobook logic changed. Unchanged upload/settings module cache keys stay at .159; release/bootstrap, CSS and manifest links use .160.

No transform/filter/backdrop-filter/contain added to the gallery panel: those could make its fixed fullscreen descendant stop covering the viewport. Border/shadow target only thumbnail images, not the fullscreen viewer.

Verification: actual shared gallery module executed in a temporary Playwright Chromium153 fixture using real page inline styles + modified shared CSS, a local public sample photo and mocked read-only photo-gallery response. Gallery API, Auth and image crop helpers were mocked. Both album-admin.html and album.html at widths 320/390/768/1280: 8 cases PASS, no horizontal overflow, 2 columns below650/3 above, 5px cream border, panel border, border-box images. Image click opens viewer covering viewport; close works; fullscreen image border remains0. Mobile screenshot visually inspected. This is browser-fixture PASS, not physical iPhone visual acceptance or a new authenticated upload test. No new permanent test harness/dependencies added for this CSS change.

User's latest upload result: “Nu funkade det.” IMG_3896 shows one image saved; IMG_3897 shows seven images in album, including the new photo. Record USER-REPORTED PASS for the pending webmaster upload retry after .159. A fresh airplane-mode cycle and simultaneous HTTP behavior were not separately described; do not upgrade those to full PASS.

Rollback baseline: ff14e78044c41a84028b649ee069c088426fa344 / .159. Selectively restore previous CSS and use normal versioned metadata for any rollback; do not reset shared repo or backend. Photobook .137 safety checkpoint remains independent. CURRENT/PREVIOUS null.

After push: verify release-safety/Pages for exact commit, public CSS bytes and .160 metadata; user checks final framing on iPhone.

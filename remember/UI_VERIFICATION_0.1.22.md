# Remember UI0.1.22


## Latest checkpoint — UI0.1.22 — 2026-10-14
User supplied actual Dashboard0.1.21 screenshot and says top looks visually dull. Presentation-only refinement: centered serif Remember identity with discreet byline and warm divider, smaller album title, accessible42px home icon link and44px collapsible Konto pill. No additional explanatory text or duplicate headings. Existing high-resolution background and no-blur policy retained. No changes to page scripts, server role helper, auth, album/QR/data behavior. Shared CSS header/cache/version labels0.1.22. Rollback f07a309222b73fb713a4dea349bfe8832518a6ae.
21 fixture render states at390×844,820×1180,1440×900 PASS, no horizontal overflow; Dashboard script exact equality PASS; git diff --check PASS. Publication/readback pending at checkpoint. Actual authenticated Dashboard appearance and physical iPhone acceptance remain user gate; source fixtures are not DEVICE PASS. Full product remains PENDING.

Documentation-only evidence changes do not bump runtime version.


## Final header candidate0.1.23 — 2026-10-14
Extra320px rendering found0.1.22 brand/home overlap: fixed minimum font42px exceeded reserved header space.0.1.23 scales brand32px–56px with viewport width. Final28 rendered fixture states across320×568,390×844,820×1180,1440×900 PASS with no horizontal overflow; narrow Dashboard visually inspected with clear logo/home separation. Page scripts and role helper unchanged.0.1.22 runtime commit72b993279e5cb6d1657bd6bd280624e6d512053a is superseded for this header.0.1.23 readback/deploy/live pending at checkpoint. Actual user visual/device acceptance remains pending; no full release promotion.

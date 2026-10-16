# Container13 Remember

Gemensam albumtjänst under varumärket Container13. Arbetsnamn Remember, tänkt publik adress https://container13.se/remember/. Första pilot: fiskeresa.

## Status
UI 0.1.23 är publicerad med förenklad albumöversikt, förfinad centrerad överdel, gemensam högupplöst godkänd bakgrund och serverstyrd webmaster-synlighet. Verklig kontoroll-/iPhone-kontroll återstår; se senaste handoff för evidens. Inloggning, registrering, ägar-/gästalbum, privat bilduppladdning och QR-delning finns i aktuella källor och backend; verifieringsnivå varierar. Detta ersätter den äldre prototypbeskrivningen. Se PROJECT_CURRENT_STATE.json, senaste checkpoint i WORK_HANDOFF_2026-10-14.md och BACKGROUND_VERIFICATION_0.1.20.md för exakt evidens. Komplett produkt är fortsatt PENDING/UNVERIFIED; betalning och per-album-teman ingår inte i denna ändring.

## Läsordning
1. ../project-template/PROJECT_RELEASE_STANDARD.md
2. ../project-template/PROJECT_MASTER_RULES.md
3. ../project-template/PROJECT_RELEASE_CHECKLIST.md
4. DECISIONS.md och IDEBANK.md
5. PROJECT_CURRENT_STATE.json och PROJECT_HANDOFF_CURRENT.md
6. ../solutions/README.md innan ny teknisk mekanism byggs

## Historisk utvecklingsplan (läs senaste checkpoint först)
- Verifiera först faktisk live-UI på mobil och desktop.
- Inventera befintlig Supabase- och hostingkonfiguration; besluta backend och lagring först efter jämförelse.
- Ägarautentisering, verifierad e-post, albumägarskap och RLS.
- Serverstyrd atomisk gräns 10 bilder per album, idempotens och skydd mot parallella uppladdningar.
- Gästuppladdning med begränsad behörighet, bildsäkerhet, GDPR, galleri och radering.
- Säker serververifierad betaluppgradering utan att ändra albumlänk.
- Verifiera flera oberoende album och verkliga enheter innan release.

Originalet ../micke50/ och tidigare test/ är orörda referenser, inte en gemensam osäker backend för flera kunder.

## Historical baseline candidates (do not reinstall)
See SECURE_BACKEND_NEXT.md and sql/001_schema_DRAFT.sql. These describe the original baseline, not current installation status. Read the latest state/handoff before any backend operation. Do not replay against Remember or Micke50 production.


## Capacity checkpoint — 2026-10-15
Read [OPERATING_LIMITS.md](./OPERATING_LIMITS.md) at handoff and before quota/hosting/upload decisions. Official Free limits verified; snapshot3 objects/794834bytes, physical DB11867827bytes. Billing counters remain unknown. Webmaster capacity panel specified, NOT implemented; reuse existing server authorization, never expose provider keys. Runtime remains0.1.23, docs-only. Auth mail delivered09:27; user confirmed inbox and successful link login. Overall product remains PENDING with earlier device/E2E gates.


## Centraliserad versions- och uppdateringshantering (beslut 2026-10-16)
- Gäller **hela Remember**, nuvarande och framtida vyer: startsida, inloggning, registrering, aktivering, dashboard, albumägare, gäster, albumadministration och framtida användarflöden.
- **En gemensam uppdateringsmotor:** `remember/auto-update.js`. Nya vyer ska kopplas till den vid skapandet, inte i efterhand. Inga separata sidunika uppdateringslösningar.
- **En gemensam versionskälla ska införas:** publicerad release-manifest/ID och tillhörande resursversioner, i stället för enbart HTML-jämförelse. Detta är ett kvarstående tekniskt arbete, inte redan verifierat.
- Vid kallstart, återgång till förgrunden och återanslutning ska appen kontrollera en ny publicerad version utan att användaren behöver rensa cache eller installera om.
- Säker omladdning: skydda osparade formulär, pågående uppladdning, kamera, dialoger och transaktioner; köa uppdatering tills det är säkert.
- En ny release måste verifieras i faktisk publicerad miljö och i installerad iPhone-PWA, inklusive uppgradering från gammal version, offline/online och djup-länkar.
- **Release-gate:** ingen ny användarvy får godkännas om uppdateringsmotorn saknas; versions-ID och teststatus ska dokumenteras.
- Huvudregler: `project-template/PROJECT_MASTER_RULES.md`, `PROJECT_RELEASE_CHECKLIST.md` och `SHARED_COMPONENT_REGISTER.md`.

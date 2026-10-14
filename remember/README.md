# Container13 Remember

Gemensam albumtjänst under varumärket Container13. Arbetsnamn Remember, tänkt publik adress https://container13.se/remember/. Första pilot: fiskeresa.

## Status
UI 0.1.21 är kandidat för förenklad albumöversikt, gemensam högupplöst godkänd bakgrund och serverstyrd webmaster-synlighet. Se senaste handoff för publiceringsstatus. Inloggning, registrering, ägar-/gästalbum, privat bilduppladdning och QR-delning finns i aktuella källor och backend; verifieringsnivå varierar. Detta ersätter den äldre prototypbeskrivningen. Se PROJECT_CURRENT_STATE.json, senaste checkpoint i WORK_HANDOFF_2026-10-14.md och BACKGROUND_VERIFICATION_0.1.20.md för exakt evidens. Komplett produkt är fortsatt PENDING/UNVERIFIED; betalning och per-album-teman ingår inte i denna ändring.

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

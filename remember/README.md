# Container13 Remember

Gemensam albumtjänst under varumärket Container13. Arbetsnamn Remember, tänkt publik adress https://container13.se/remember/. Första pilot: fiskeresa.

## Status
DRAFT / UI-prototyp. Formuläret ger endast lokal förhandsgranskning; ingen verklig registrering, uppladdning, lagring, betalning eller serverkvot finns ännu. COMMITTED är inte samma som DEPLOYED eller RUNTIME PASS.

## Läsordning
1. ../project-template/PROJECT_RELEASE_STANDARD.md
2. ../project-template/PROJECT_MASTER_RULES.md
3. ../project-template/PROJECT_RELEASE_CHECKLIST.md
4. DECISIONS.md och IDEBANK.md
5. PROJECT_CURRENT_STATE.json och PROJECT_HANDOFF_CURRENT.md
6. ../solutions/README.md innan ny teknisk mekanism byggs

## Teknisk väg framåt
- Verifiera först faktisk live-UI på mobil och desktop.
- Inventera befintlig Supabase- och hostingkonfiguration; besluta backend och lagring först efter jämförelse.
- Ägarautentisering, verifierad e-post, albumägarskap och RLS.
- Serverstyrd atomisk gräns 10 bilder per album, idempotens och skydd mot parallella uppladdningar.
- Gästuppladdning med begränsad behörighet, bildsäkerhet, GDPR, galleri och radering.
- Säker serververifierad betaluppgradering utan att ändra albumlänk.
- Verifiera flera oberoende album och verkliga enheter innan release.

Originalet ../micke50/ och tidigare test/ är orörda referenser, inte en gemensam osäker backend för flera kunder.

## Backend implementation candidate
See SECURE_BACKEND_NEXT.md and sql/001_schema_DRAFT.sql. Both are design artifacts only: migration not executed, authentication/API not live. Do not run against Micke50 production.

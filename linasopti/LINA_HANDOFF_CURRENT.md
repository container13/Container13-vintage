# Linas Opti — aktuell löpande överlämning

Uppdaterad: 2026-10-23. Dokumentationsrelease under arbete: **V0.4.39**. Status: **IN_PROGRESS / ej slutverifierad**.

## Start här
Vid ”Fortsätt Linas Opti” eller ”Läs Linas manual”: läs denna fil, `LINA_CURRENT_STATE.json`, `version.js`, `LINA_SYSTEM_MANUAL.md`, `LINA_MASTER_RULES.md` och relevant releasechecklista. Kontrollera verklig branch/head, Actions, publicerad release och Worker innan nästa ingrepp. Begär inte manuell överlämning om repo innehåller den.

## Projekt och absoluta skydd
- Repo: `container13/Container13-vintage`; branch `ccc-demo-public-test`; mapp `linasopti/`; webb https://container13.se/linasopti/.
- Gen8–Gen16 är frysta, Gen16 NO_CANDIDATE. **Ingen research-rerun. Handel och Forward AV.** Worker/evidence ändras inte för denna dokumentationsrelease.
- V0.4.37 var tidigare verifierad säker bas (commit `4ecd25580beeef8bba4a88c1d0f11e0d50a78c6a`). V0.4.38 integritetsreparation fick Actions SUCCESS och Pages SUCCESS på commit `fad61639815ac3cf9835f2c6fa48b5b28ab0f000`; det är inte bevis på separat iPhone-test av .38.

## Pågående arbete
- **V0.4.39:** inför Remembers korta löpande överlämning och gemensamma projektmallskrav. Den tidigare stora handoffen är bevarad i `LINA_HANDOFF_HISTORY_THROUGH_2026-10-23.md`.
- Löpande handoff efter varje meningsfullt steg/test/deploy och före längre/riskfyllda steg; alltid GitHub-skrivning + exakt readback, parallellt med strukturerat state. Inga falska PASS eller onödiga versioner för ren journalföring.
- Mallnyheter att tillämpa: sök `solutions/` och systembibliotek före nyutveckling; en ägare per beteende; stopp efter två misslyckade fixar; tydliga COMMITTED/DEPLOYED/RUNTIME/DEVICE-statusar.
- **Inte genomfört:** separat teknisk inventering av central PWA-updater, versionsfot på alla vyer, mobil zoompolicy och faktisk iPhone-beteende. Inga sådana kodändringar görs i V0.4.39.

## Nästa konkreta steg
1. Färdigställ V0.4.39 version.js, index-cachetokens, release-gate och CURRENT_STATE; verifiera statisk integritet och slutcommitens Pages.
2. Läs tillbaka denna handoff och state från GitHub; kontrollera faktisk publicerad V0.4.39. Markera ej DEVICE PASS utan riktigt iPhone-test.
3. Därefter: **read-only teknisk inventering** av updater/versionsfot/mobilpolicy. Planera eventuell separat kodrelease endast om verklig lucka hittas.

## Löpande rutin
Håll denna fil kort och ersätt nuläget, inte bygg på med arbetslogg. Efter varje meningsfullt steg och före längre steg: spara version/commit, vad som är klart och verifierat, hinder och ett nästa steg. Vid avbrott: IN_PROGRESS/UNVERIFIED. Läs tillbaka exakt GitHub-innehåll före påståendet SPARAD. Historik finns i Git, äldre handoffs i historikfilen. Följ `../project-template/CONTINUITY_PROTOCOL.md`; projektets egna hårdare regler gäller.

# Lina Clean Core V0.2.0

## Status
Clean Core är en teknisk omstart av Lina, inte en kunskapsomstart. V0.58.8 COMPLETE är permanent legacy-checkpoint/facit före Clean Core och ska aldrig skrivas över.

V0.2.0 gör Uppdatera-flödet deterministiskt. V0.1.4 litade enbart på att sessionStorage-rensningen överlevde navigeringen. Nu skickas dessutom en explicit `force_login=1`-markör till nästa sidladdning. Login-koden ser markören innan någon auto-unlock kan ske, rensar upplåsningsflaggan igen och visar login. Därefter städas URL:en utan extra reload.

## V0.2.0 ändrat
- Uppdatera rensar `sessionStorage["linasopti_unlocked"]`;
- navigerar till `index.html?force_login=1&update=<timestamp>`;
- login-koden kontrollerar `force_login=1` före all auto-unlock;
- upplåsningsflaggan rensas en andra gång på den nya sidladdningen;
- URL:en städas tillbaka till ren `/linasopti/` eller `/linasopti/index.html` innan login;
- persistent Lina-data/checkpoints i `localStorage` lämnas orörda;
- login med knapp och Enter lämnas i samma fungerande flöde;
- flat filstruktur kvarstår.

## PERMANENTA REGLER FÖR CHATGPT / UTVECKLING
1. `kör` betyder bygg/ändra de riktiga filerna omedelbart enligt senast överenskommen riktning.
2. ALDRIG skapa/generera/mocka en bild om användaren inte uttryckligen ber om en bild.
3. Bygg från senaste godkända COMPLETE-release, aldrig från CHANGED-paketet.
4. Varje release levereras som två ZIP: COMPLETE och CHANGED FILES ONLY.
5. Lina använder flat filstruktur: alla projektfiler direkt i samma mapp och direkt i ZIP-roten. Inga undermappar om vi inte uttryckligen beslutat annat.
6. Versionsnummer, cache-buster, UI, README, handoff och filnamn ska synkas.
7. Gamla releaser/handoffs är orörbara snapshots. Skapa ny handoff per release.
8. Testa syntax, navigation, berörda flöden, filstruktur, ZIP och version före leverans. Rapportera PASS/FAIL och SHA256.
9. Ändra bara det som behövs. Fungerande delar lämnas orörda om ändringen inte kräver annat.
10. Ingen regression accepteras som bieffekt.
11. Mobil-first och responsivt även för 13 tum och större skärmar.
12. Varje vy ska tydligt svara på: var är jag, varför är jag här, vad gör jag nu, vart går Tillbaka.
13. En knapp = en tydlig handling.
14. Forskningsregler och UI/infrastruktur ändras inte samtidigt.
15. Frysta forskningsregler ändras bara som uttryckligt nytt experiment/version.
16. Misslyckade tester och negativa resultat bevaras i historiken.
17. Tre misslyckade fixar på samma grundproblem => stoppa patchandet och ompröva arkitekturen.
18. Ingen legacy-kod följer med "för säkerhets skull".
19. Fungerande login/session-beteende ska bevaras och regressionstestas.
20. README + senaste handoff ska räcka för att starta nästa ChatGPT-chatt.
21. Ta checkpoint vid tydligt verifierat fungerande läge.
22. Handel är AV. Ingen livehandel aktiveras.
23. Robotmognad är 48/100 tills ny evidens motiverar annat.
24. 2023–2026 får inte beskrivas som färsk orörd OOS i sin helhet.
25. V0.58.8 COMPLETE är permanent legacy-checkpoint före Clean Core.
26. ÅTERANVÄND BEVISAT FUNGERANDE FUNKTION FÖRST: om en funktion redan har fungerat korrekt i en tidigare Lina-version ska den implementationen alltid undersökas och testas som förstahandsval innan funktionen skrivs om eller byggs på nytt. Men tidigare kod får inte kopieras blint: först ska det tidigare beteendet jämföras mot det aktuella kravet. Om kravet skiljer sig ska den fungerande implementationen användas som facit/referens och bara den nödvändiga beteendeskillnaden göras. Ny implementation görs endast om den gamla inte passar Clean Core-arkitekturen eller om det finns ett dokumenterat skäl. Vid omskrivning ska beteendet jämföras mot den tidigare fungerande versionen. Detta gäller bland annat login, Enter-inloggning, Uppdatera, navigation, API-anrop, datainsamling, beräkningar och export.

## Clean Core arkitektur
- en boot;
- en router;
- ett centralt state/localStorage-lager;
- separat API-lager;
- ingen cloneNode-navigation/rebind;
- inga exakta patchversionsguards för initiering;
- inga konkurrerande DOMContentLoaded/bootkedjor;
- ingen strategilogik inbakad i UI-koden;
- gamla Lina används som facit tills migrerad modul har jämförts och godkänts.

## Forskningsstatus att bevara
### Jägaren
Fryst kärna och historiska valideringar ska portas senare utan ändring. Mognad 48/100. Real forward har separat anchor 2026-09-11.

### Swing G1
Fryst hash `8f09f32a`. DEV-resultat och pseudo-forward ska bevaras. Real forward anchor 2026-09-14.

### Swing G2
Första modul att migrera. DEV 2020-01-01–2022-12-31. Låst historisk pseudo-forward 2023-01-01–2026-09-10. Breakout/momentum-grid 648 varianter. A–M DEV, M fryser kandidat/hash, N öppnar pseudo-forward, O slutbedömning. Ingen rescue efter N.

## Nästa steg
Verifiera V0.2.0 live: login → Dashboard → Uppdatera → ren URL med `?update=...` → login ska visas igen → logga in → Dashboard → Forskning → Swing G2 → Tillbaka. När det är PASS portas auktoritativ G2-motor utan legacy-UI och jämförs mot gamla Lina innan acceptans.


## V0.2.0 – login/autofill + browser refresh
- Portar den bevisat fungerande legacy-lösningen från V0.46.3 som aktivt tömmer loginfältet vid DOM-start, fördröjt efter password-manager-autofill, vid pageshow och första fokus.
- Firefox/webbläsarens vanliga Reload räknas nu som en ren login-start och rensar endast `sessionStorage`-flaggan `linasopti_unlocked`; Lina-data i `localStorage` lämnas orörd.
- Linas egen Uppdatera behåller cache-bustad omladdning och tvingad login.
- Permanent regel: när ett beteende redan fungerat tidigare ska exakt fungerande implementation först lokaliseras, jämföras och portas/testas innan ny lösning uppfinns.

## V0.2.0 – Swing G2 första riktiga Clean Core-modulen
- V0.1.6 är fryst som första fungerande Clean Core-checkpoint för login, Enter, Uppdatera och browser reload.
- Auktoritativ Swing G2-motor från legacy V0.56.0/V0.58.8 har portats till separat `g2-engine.js` utan legacy-navigation eller gamla bootkedjor.
- Forskningsreglerna är oförändrade: DEV 2020–2022, pseudo-forward 2023–2026-09-10, 648 varianter, 0,10 % kostnad/sida, 0,5 % risk, max 5 positioner, max 20 %/position.
- Guidat flöde: **Lås plan → Kör/Fortsätt G2 A–O → Resultat → Exportera rapport till ChatGPT**.
- G2 hämtar sin egen exakta data; generella Data-vyn används inte som mellanlandning.
- Datatransporten behåller legacy V0.58.8-ordningen: Worker Yahoo daily → EODHD .US → Alpaca daily, två cykler, 60 s timeout.
- Datakällans namn sparas på hämtade rader och Stage A visar vilka providers som faktiskt användes. Blandad provider är därför synlig och kan granskas; ingen data blandas tyst utan spårbarhet.
- M fryser kandidat/hash innan N får öppna historisk pseudo-forward. Ingen rescue efter N.
- Strategilogik ligger i `g2-engine.js`; UI ligger i `g2.js`.
- Clean Core använder egen G2-nyckel `lina_clean_swing_g2_v0200`, så gamla checkpoints/felstatus inte smyger in i en ny körning. Legacy-nyckeln `linasopti_swing_g2_v0560` lämnas orörd som facit.

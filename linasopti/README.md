# Linas Opti – Clean Core V0.1

## Syfte
Teknisk omstart av Lina utan kunskapsmässig omstart. Gamla Lina V0.58.8 är referens/facit under migreringen. Clean Core ersätter legacy-arkitekturen stegvis; ingen forskningsregel får ändras av misstag.

## V0.1 innehåller
- Bevarat fungerande lösenkod/login-beteende från V0.58.8, isolerat i `auth.js`.
- En enda app-boot (`app.js`).
- En enda router (`router.js`).
- Centralt state-lager (`state.js`).
- Separat API-lager (`api.js`).
- Dashboard med Forward, Forskning, Historik, Data, Verktyg och Om Lina.
- Forskning → Swing G2 → Forskning fungerar utan cloneNode, versionsguard eller legacy-navigation.
- G2-planens fasta huvudramar är registrerade, men strategimotorn är avsiktligt INTE portad ännu.
- Handel AV. Robotmognad 48/100.

## UTVECKLINGSKONTRAKT – REGLER FÖR CHATGPT
Dessa regler är permanenta och ska följa med i varje framtida COMPLETE-release och handoff.

1. Bygg alltid från senaste godkända COMPLETE-version, aldrig från CHANGED-paketet eller en äldre bas.
2. Ändra bara det som behövs. Fungerande delar lämnas orörda om ändringen inte kräver annat.
3. När användaren säger **”kör”** betyder det: genomför den överenskomna kod-/filändringen. Ingen ny riktning eller mockup.
4. **ALDRIG skapa/generera en bild om användaren inte uttryckligen ber om en bild.** Detta gäller även mockups och konceptbilder.
5. Varje release levereras som två ZIP: **COMPLETE** och **CHANGED FILES ONLY**.
6. Varje ZIP ska packas under **en enda gemensam toppmapp**, så att uppackning aldrig sprider projektfiler löst i Hämtade filer eller annan målmapp. Intern projektstruktur får ligga kvar under toppmappen.
7. Versionsnummer/cache-buster/README/handoff ska vara synkroniserade.
8. Gamla releaser och handoffs är immutable snapshots. Skriv aldrig om historiken; skapa en ny handoff.
9. Testa före leverans: syntax, filstruktur, navigation, berörda funktioner, ZIP-innehåll och versionskonsistens. Rapportera PASS/FAIL och SHA256.
10. Regressioner får inte accepteras som bieffekt. Kontrollera även centrala angränsande flöden.
11. Mobil-first och responsivt: mobil, 13 tum och större skärmar utan separat app eller onödig horisontell scroll.
12. Navigation är funktion: Hem/Tillbaka/kontext måste ha definierad destination och testas.
13. Varje vy ska svara på: var är jag, varför är jag här, vad gör jag nu, vart går Tillbaka.
14. En knapp = en tydlig handling. Undvik extra mellanvyer för samma handling.
15. Forskningsregler och UI/infrastruktur ändras inte samtidigt.
16. Frysta forskningsregler är frysta. Ändring kräver uttryckligt nytt experiment/version; ingen smygtuning.
17. Historiken är facit. Misslyckade tester/resultat raderas inte.
18. Tre misslyckade fixar på samma grundproblem → STOPP för fler patchar; ompröva arkitekturen först.
19. Ingen legacy-kod följer med ”för säkerhets skull”. Varje portad del ska ha ett dokumenterat syfte.
20. Fungerande login/session-beteende bevaras och regressionstestas.
21. README + senaste handoff ska räcka för att fortsätta projektet i en ny chatt.
22. Skapa checkpoint när ett tydligt fungerande läge uppnåtts innan nästa större steg.
23. En boot, en router, ett state-lager och ett separat API/data-lager. Ingen `cloneNode()`-navigation, inga versionsguards som styr permanent funktionalitet, inga globala vy-wrappers och ingen strategilogik i UI-kod.
24. Gamla Lina är referens under migreringen. Portad strategi godkänns först när samma input ger samma resultat/hash där det är tillämpligt.
25. Handel för riktiga pengar får inte aktiveras under forsknings-/migreringsarbetet. **Handel AV**.
26. Robotmognad stannar på **48/100** tills nya verifierade resultat motiverar ändring.
27. 2023–2026 får inte beskrivas som helt färsk/orörd OOS-data; historiken ska beskrivas korrekt.
28. Dokumentera datakälla/proveniens. Blanda inte dataleverantörer tyst i ett forskningsdataset.
29. Efter strukturellt fel: analysera rotorsak och berört flöde innan ny patch. Stapla inte blinda fixar.

## Fryst kunskap som ska migreras – inte återuppfinnas
### Jägaren
Day Selection 16; PRO2; Entry B; Strong-regim. Strong = SPY sedan öppning >= +0,10 % och SPY 15m momentum >= +0,05 %. Exit: mål +0,8 %, stop -0,4 % efter delay, max 60m. Friktion 0,0425 %/sida. Riskreferens 0,5 % equity mot 0,6 % stopreferens. Max 3 samtidiga positioner, max 33,3 % equity/position, max 4 nya entries/dag. Close-location 83 % är fryst forskningskandidat, inte bevisat bäst. Real-forward anchor 2026-09-11.

### Swing G1
Fryst hash `8f09f32a`. Parametrar: trend 50, pullback 0,02, recovery prevhigh, regime spy100, stop 0,07, target 0,12, hold 5. DEV 2021–2023: 249 trades, +15 658,28, PF 1,4341, WR 51,807 %, DD -5,1963 %. Historisk pseudo-forward 2024-01-01–2026-09-10: 323 trades, +2 417,04, PF 1,041953, WR 50,46 %, DD -5,66 %. Real-forward anchor 2026-09-14.

### Swing G2
Generation SWING-G2. DEV 2020-01-01–2022-12-31. Låst historisk pseudo-forward 2023-01-01–2026-09-10. 16-symbolsuniversum. Breakout/momentumfamilj. Grid: breakout 20/55/100; trend off/sma100/sma200; volume off/1.2/1.5; SPY off/spy100/spy200; stop 5/7 %; target 10/15 %; hold 10/20 = 648 varianter. Kostnad 0,10 %/sida, risk 0,5 %, max 5 positioner, max 20 % equity/position. A–M endast DEV, M fryser kandidat/hash, N öppnar pseudo-forward, O final. Ingen rescue efter N.

## Känd datalärdom
Alpaca direkt `1Day` har tidigare misslyckats. Swing G1 fungerade med 5-minuters `/bars` och lokal dagsaggregering, men G2:s 2020-period saknade täckning där. V0.58.8 lade därför till Worker-baserad Yahoo daily som första källa, EODHD som fallback och Alpaca daily sist. Detta är transport/infrastruktur och får inte förväxlas med strategiändring. Clean Core ska senare registrera provider-proveniens och flagga/rejecta oavsiktligt blandade dataset.

## Nästa steg
Porta den auktoritativa G2-motorn från V0.58.8 till `g2.js` utan legacy-UI. Därefter bygg ett reproducerbarhetstest mot gamla Lina innan G2 får status MIGRERAD.


## PLATT FILSTRUKTUR — PERMANENT REGEL
Alla Lina-projektfiler ska ligga direkt i samma mapp. Inga undermappar i releasepaketet om användaren inte uttryckligen beslutar något annat. COMPLETE och CHANGED ZIP ska därför innehålla filer direkt i ZIP-roten, utan toppmapp och utan undermappar.

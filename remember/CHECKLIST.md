# Remember — gemensam checklista
Uppdaterad 2026-10-21. Kandidat 0.1.159. Bock betyder faktiskt underlag; historiska PASS har sin angivna version. CURRENT/PREVIOUS är inte godkända.

- [x] Manuell fotobok: 0.1.137, användarens iPhone-PASS.
- [x] Säkerhetsgren 0.1.137 på 8a592bb8b7b767a54df595e5e7d5d5d2eb10cd7f verifierad.
- [x] Lösenordsinloggning: 0.1.138, användarens iPhone-PASS.
- [x] Fortsatt inloggad efter stängning/återöppning: användarens iPhone-PASS 2026-10-20.
- [x] 0.1.139: exakt GitHub-readback och Actions/Pages success för 1b5bf9e0c87e95c114cf9dd3a26e02e958083223.
- [x] 0.1.139: användaren bekräftar att uppdateringsvarningen försvunnit; skärmbild visar version.
- [ ] Kontobyte och åtkomst till rätt album.
- [ ] Skapa album: namn, upplevelse och uppladdningsperiod.
- [x] Gästlänk: användaren har testat alla tillgängliga funktioner; rätt album och bilder visas.
- [ ] Gästuppladdning i öppet album utan konto (albumet i senaste testet var stängt).
- [ ] Kamera, avbryt och albumuppladdning.
- [ ] Dubblettskydd, 10-bildersgräns, avbruten uppladdning och återförsök.
- [x] Bildvisare: helskärm, vertikalt svep, zoom/panorering, 3 sekunders återställning, stängning till samma scrollplats och sparande till iPhone Bilder. Dubbeltryck är inget krav.
- [ ] Installerad PWA: uppdatering från äldre version, offline/online, osparat formulär, kamera och pågående uppladdning.
- [ ] Granska embedded camera-session-test.html som aktivt undantag från versions/bootstrap-inventeringen.
- [ ] Stäm av säkerhetsmodulens testresultat och återstående införande separat; inget automatiskt införande i originalbackend.
- [ ] Fulla releasegrindar och beslut om CURRENT/PREVIOUS.

GitHub-grenstädning pausad av saknad raderingsåtkomst. Gamla fotoboksexperiment behöver enligt projektägaren inga nya arkiv före godkänd radering efter beroendekontroll.
iOS-systemremsan är accepterad tills vidare och ska inte få nya spekulativa CSS-fixar.

- [ ] 0.1.140: webmasterpopup — öppna, QR, kopiera, visa länk, stäng och oförändrad scroll på iPhone.
- [ ] Webmaster: granska/bygg förlängning av albumets uppladdningsperiod separat.

- [ ] 0.1.141 iPhone: översikt/tider först, Fler verktyg stängd, bilder hämtas först vid Visa bilder.
- [ ] Separat godkännande: migrering och Edge-stöd för tidsändringar.
- [ ] Testprojekt: SQL-behörighet/audit/rollback/idempotens, två samtidiga sessioner och HTTP 401/403/409/save.
- [ ] Original: kontrollerad backendinstallation efter test-PASS och verifierat godkännande, därefter användarens iPhone-sparande.

- [ ] 0.1.142 iPhone: datumfält inom panelens innehåll, kompakt översikt, Svensk tid och enhetliga sekundärknappar.

- [ ] 0.1.144 iPhone: album först, filterpopup öppna/stäng, låst bakgrund, fokus/scroll tillbaka, aktiva filter och Rensa; inga filter i Mina album.

- [ ] 0.1.145 iPhone: Frisök, senaste skapade album först som förval, sorteringsmeny och Rensa återställer förvalet.

- [ ] 0.1.146 iPhone: Förläng för framtida sluttid, Öppna igen för passerad sluttid och tydlig beräkningsgrund. Ny sluttid före sparande testas först när backend aktiverats separat.

- [x] 0.1.147: Album aktivt UI och backendkandidater; lokala DOM-/Edge-mocktester och SQL/PLpgSQL-parser PASS. Ingen backendinstallation.
- [ ] Separat godkännande för remember-test: albumavstängningens schema, API och runtime-/samtidighetstest.
- [ ] Originalinstallation först efter test-PASS och separat godkännande; därefter iPhone-PASS för avstängning/återaktivering.

- [ ] 0.1.148 iPhone: På/Av-reglage på varje webmasterkort, albumlänken separat, stora formuläret borta inne i albumet. Reglagen är neutrala/spärrade tills backend verifierats.

- [ ] 0.1.149 iPhone: vald appikon nr 6 på hemskärmen. Befintlig installerad ikon kan vara cachad; webbpublicering är inte DEVICE PASS.

- [ ] 0.1.150 iPhone: lite fetare ikon nr 6 på hemskärmen; installerad ikon kan vara cachad.

## Testbackend 2026-10-21
- [x] Projektägarens godkännande: tider och aktivering i remember-test.
- [x] Före-snapshot i separat säkerhetsgren; migration och sex Edge-källor installerade/återlästa i test.
- [x] SQL-transaktioner, revision/retry/grants och separata samtidiga SQL-sessioner PASS.
- [x] Gäst-HTTP: avstängt blockerar, samma länk fungerar efter återaktivering.
- [x] Tillfälligt testalbum/bild/Storage/audit städat; baslinjeräkning återläst.
- [ ] Autentiserad HTTP som test-webmaster, ägare och icke-webmaster.
- [ ] iPhone för reglage och tider i avskild testfrontend.
- [ ] Auditfel/rollback och verklig HTTP-samtidighet.
- [ ] Granskad originalportning och separat godkännande före originalwrites.

Detaljer: test-installed/2026-10-21-settings-activation/README.md. CURRENT/PREVIOUS oförändrade.

## Separat testfrontend 0.1.152
- [x] test-admin.html med fast testbackend och egen sessionsnyckel, samma controllers som originalvyn.
- [x] DOM-/Chromiummock: inloggningsfel, aktivering, tidsutkast/sparande, konfliktåterläsning, draftskydd och utloggning.
- [x] 360/390/768/1280 px list-/tidslayout utan horisontell överströmning; skärmbild granskad.
- [ ] Verklig testkontoinloggning och autentiserad HTTP på publicerad testsida.
- [ ] iPhone: reglage, sparade tider och återläsning. Se TEST_ADMIN.md.

## Glömt lösenord i test 0.1.153
- [x] Explicit knapp, testprojektets Auth och befintlig testrecovery återanvänds.
- [x] DOM/Chromium mock: e-postvalidering, dubbeltrycksskydd, 60s spärr, fel, recoveryform/spara utan riktiga utskick eller lösenordsändringar.
- [x] Faktisk ogiltig-token-redirect till rätt TEST login verifierad utan kontoändring.
- [ ] Användaren begär mejlet och bekräftar leverans/lösenordsbyte.
- [ ] Därefter inloggat album-/tidstest på iPhone. Se TEST_ADMIN.md.

## Ordinarie Remember utvecklingsmiljö — 0.1.154
- [x] Projektägaren godkänner införande i ordinarie Remember, som är utvecklingsmiljön.
- [x] Verkliga före-källor/schema/ACL sparade i separat säkerhetsgren och återlästa.
- [x] Aktivering och tider installerade; sex Edge-källor exakt återlästa, båda capabilities aktiva.
- [x] SQL-transaktioner/rollback/grants och befintliga album-/fotodigests PASS: 2 album/10 bilder oförändrade.
- [ ] Befintlig inloggad användare testar reglage samt tidsändring/spara/återläsning i vanliga Remember på iPhone.
- [ ] Fulla releasegrindar/promotion. CURRENT/PREVIOUS oförändrade.
Separat testinloggning/lösenordsåterställning är inte längre ett krav för aktuellt uppdrag. Detaljer: development-installed/2026-10-21-controls/README.md.

## Ägarvy vid avstängning — 0.1.155
- [x] Användaren stänger av album; DB bekräftar false/revision2.
- [x] Rotorsak till saknad ägarstatus hittad och rättad i både adminförhandsvisning och riktig owner-vy/list-API.
- [x] Fem DOM-scenarier samt Edge projection/owner-filter/auth PASS; owner-manager v5 exakt återläst.
- [ ] Användarens iPhone-omtest: avstängningsmeddelande och inga ägarverktyg/bilder i Albumägare.
- [ ] Återaktivera via Webmaster och verifiera återställd ägarvy; gästlänk och tidssparande fortsatt separata tester.

## Användartest efter 0.1.155 — dokumenterat i 0.1.156
- [x] Användaren 2026-10-21: ”Har testat allt både som albumägare och gäst, verkar fungera.” Ägar-/gästflöden noterade som användarrapporterad PASS efter rättningen. Exakta delsteg och nätverkssvar har inte redovisats; äldre detaljrutor är historiska och bockas inte automatiskt av.
- [x] Webmasterförlängning/spara/lämna/återöppna: användaren förtydligar 2026-10-21 att detta redan är testat, liksom ägar-/gästflödena. Begär inte samma test igen.
- [ ] Fulla releasegrindar och CURRENT/PREVIOUS kvarstår separat.

0.1.156 dokumenterar testresultatet och synkroniserar versionsmetadata enligt projektregeln; ingen ändring av funktionslogik eller backend.

## Uppladdningsgranskning — 0.1.157, 2026-10-21
- [x] Aktuell Edge v3 exakt matchad mot arkiverad källa; installerade RPC/index/grants lästa direkt.
- [x] SQL/ROLLBACK: standard 10; bild 11 stoppas för gäst och ägare; mixed reserved/uploading/ready räknas; dubbletter mot uploading/ready släpper oanvänd slot; samma digest i annat album tillåts.
- [x] Testfixturer helt återställda: 2 album/10 foton med identiska raddigests, 10 Storage-objekt, 0 kvarvarande testalbum.
- [x] Automatiskt reproducerat återförsöksluckan i fyra klientvägar och Edge. Detta betyder hittat fel, inte godkänd avbrottshantering.
- [ ] Nästa kodarbete: sammanhängande klient/server-rättning för stabilt request-ID, canonical bytes, status/replay/resume och Storage-verifiering.
- [ ] Positiva avbrottstester efter rättning; samtidiga sista-platsen-/replay-anrop samt avgränsat fysiskt iPhone-avbrottstest.

Detaljer och testkommandon: UPLOAD_VERIFICATION_2026-10-21.md. Tidigare generella önskemål om ägar-/gäst-/tidstest är ersatta av användarens bekräftelse ovan; specifika nya avbrottsfall är separata. Inga funktionella ändringar i denna checkpoint.

## Återförsök 0.1.158
- [x] Klient/server-rättning och före-säkerhetsgren; 29 återhämtningsmocktester, 5 ägarvyer och 8 prospektiva SQL/ROLLBACK-assertioner PASS.
- [x] Installation och exakt readback RPC/Edge; slutlig SQL/ROLLBACK, gamla RPC-källor/ACL, raddigests och oförändrade säkerhetsråd.\n- [ ] Slutcommitens CI/Pages och faktiskt publicerad .158 kontrolleras efter push.
- [ ] Avgränsat fysiskt iPhone-avbrottstest. Ingen omtestning av redan godkända ägar-/gäst-/tidsflöden.

## Webmasteruppladdning 0.1.159
- [x] .158 användartest registrerat FAIL: generisk servernekning i webmasterverktyg efter nätåterkomst.
- [x] Rotorsak reproducerad: verklig verifierad webmaster i annans album nekas owner-only.
- [x] Installerad service-only rättning, aktivt album/kvot/dubblett/ID-replay kvar; SQL/Edge exakt readback.
- [x] 14 SQL/ROLLBACK samt 29 mocktester PASS; inga befintliga rader/objekt ändrade.
- [ ] Slutcommitens publicering kontrolleras efter push; användaren provar samma väntande bild ONLINE först. Därefter avgränsat avbrottstest.

CCC Vision-modul. v2.8.1 sparar godkända produkter lokalt och beskär inte längre bilder.

v2.10.2: 3×3-arbetsgrid med swipe. `Granska & komplettera` öppnar en förenklad autosparad redigeringsvy. Upp till två extrabilder läggs till tidigt via `Nytt foto` eller `Album` och analyseras med huvudbilden. Manuella sparknappar tas bort. Kameranypzoom isoleras till kameran och kameratoppen använder CCC.

v2.10.3: Hotfix som återställer absolut `hidden`-prioritet mellan Vision-stegen och reserverar en verklig kvadratisk 3×3-yta för återupptagna miniatyrer. Ingen övrig Vision-logik ändras.

v2.10.4: Kameran visar antal fotograferade plagg. Arbetsgridden är 3×2 med sex större bilder per sida; swipe kräver tydligt horisontellt drag så vanligt tryck öppnar plagget. Redigeringsvyn är kompakt utan dubblerad huvudbild, med tre bildplatser, mindre `Analysera igen` efter AI-resultat och helbred `Nästa plagg`.

v2.9.72: Vision-kugghjulet öppnar /settings/?module=vision. Den gamla lokala inställnings-overlayn tas bort; funktionerna behålls i den gemensamma modulinställnings-layouten.

v2.9.73: Destruktiv Vision-rensning skyddas av bekräftelsesteg i den gemensamma inställningsvyn.

v2.9.87: Varje nytt plagg får permanent mänskligt läsbart `cccItemId` redan när foto/import skapar Vision-item. Originalfilens bytes ändras aldrig; samma `vision-files`-record får ett CCC-metadata-kuvert som uppdateras när Vision/användaren fyller produktdata. Sessioner och Publicera-utkast bevarar samma ID.

v2.9.89: Mobiltestfixar: kamerans bottenområde använder samma helskärmsbakgrund/safe-area och tre granskningsknappar ryms utan krock. Arbetsvyn efter foto förklarar att miniatyren kan tryckas och har dessutom en explicit Fortsätt-knapp med samma destination. Klar-vyn komprimeras på mobil så innehåll/navigation inte kapas.

v2.9.90: Kamera-overlay döljer Core-footern helt medan kameran är öppen, så ingen grå footer/Tillbaka kan läcka in över live/review. Workspace-Fortsätt görs explicit synlig även när updateWorkspaceState/applyCaptureMode kör om vyn.

v2.9.91: Workspace-knappar heter Nytt foto/Album. Fler uppgifter blir en täckande intern redigeringspanel med Återgå och Spara & återgå; Core-Tillbaka stänger panelen först. Inmatade värden ligger kvar.

v2.9.92: Fler uppgifter är riktig flytande modal med scrollbar fältyta och fasta Återgå/Spara & återgå.

v2.9.93 HOTFIX: .92 flyttade Fler uppgifter till modal men bytte samtidigt bort Visionens kanoniska fieldIds (category/brand/season/manufacturer/size/color). Det gjorde populateFormFromItem/editCurrent trasigt och blockerade både miniatyrtryck och Fortsätt. Modalen använder nu de riktiga fälten direkt.

v2.9.94: Frivilliga tillägg använder nu samma flytande modalprincip som Fler uppgifter, med scrollbar yta och fasta Återgå/Spara & återgå.

v2.9.95: Frivilliga tillägg-modalens HTML byggs om rent så knappfältet alltid ingår i samma flytande box; innehållsdelen scrollar separat.

v2.9.97: Aktiv fotosession säkerhetssparas automatiskt efter varje nytt foto/import och återupptas före nästa kamerabesök. Kamera-X behåller redan tagen bild. Zoomknappar visas för de verkliga nivåer webbläsaren/hårdvaran exponerar.

v2.10.5: Fixar tap + swipe i Vision-grid. Kameraräknaren visar bara nya foton i aktuell fotoserie, inte totalen i sessionen.

v2.10.6: Mobil tap på en Vision-miniatyr öppnar plagget direkt på touchend. Swipe och aktuell-fotoserie-räknaren från v2.10.5 lämnas oförändrade.

v2.10.7: kompakt editor, ett prisfält och teckenräknare inne i fälten.

v2.10.8: editor komprimerad ytterligare; nedersta två editor-knappar på samma rad; footer orörd.

v2.10.9: tätare editor. Footer orörd.

v2.10.10: dirty-state/back-fix samt något luftigare editor. Footer/touch/swipe/kameraräknare orörda.

v2.10.11: stor dialog för Rubrik/Beskrivning och reversibelt Visste du?-tillägg. Footer/touch/swipe/kameraräknare orörda.

v2.10.12: X + autosave i text/Fler uppgifter; Visste du och Nyskick är reversibla. Footerutseendet orört.

v2.10.13: alla tomma bildplatser = + Nytt foto via befintlig picker; textdialog låst, endast textarea scrollar.

v2.10.14: visual viewport för textdialoger, fokuserad prisdialog, diskret vänsterställd manuell AI när auto-AI är av.

v2.10.15: produkteditor öppnas alltid högst upp; bakgrundsscroll fryses under Rubrik/Beskrivning/Pris/Fler uppgifter och återställs vid stängning.

v2.10.16: iOS textdialog stabiliserad genom overflow-baserat bakgrundslås; ingen body-förskjutning; endast textarea scrollar.

v2.10.17: Rubrik/Beskrivning är nu separat helskärms-fokusläge; normal Vision-editor döljs helt under skrivning.

v2.10.18: Pris använder separat helskärms-fokusläge; normal Vision-editor döljs helt under prisinmatning.

v2.10.19: Rubrik/Beskrivning-läget låst; endast textarea får scrolla. Pris orört.

v2.10.20: hela dokumentet fryses i Rubrik/Beskrivning; endast stora textarea får scrolla; produktens scrollposition återställs vid stängning.

v2.10.21: Rubrik/Beskrivning använder aktiv JS-scrollguard mot iOS fokus-scroll; endast textarea får scrolla.

v2.10.22: textfokus använder faktisk visualViewport-höjd; skalet står fast, endast innersta textarea scrollar och tangentbordet lämnas helt fritt.

v2.10.23: textfokus flyttas ned under statusfältet enligt målbild; tangentbordet lämnas fritt och endast textarea scrollar.

v2.10.24: arbetsrubriken ändrad från `Plagg X av Y` till `Gör klart plagg · X av Y`; inga andra UI-/funktionsändringar.

v2.10.25: faktisk synlig `editTitle` ändrad till `Gör klart plagg · X av Y`; inget annat ändrat.

v2.10.26: editorhuvud delas i separat rubrikzon vänster och status/åtgärdszon höger för att undvika överlapp.

v2.10.27: `Objekt X/Y` + `Granska & komplettera`, renare bilddel och vy-specifik hjälp via Core-footern.

v2.10.28: hjälp-X fungerar; objektshuvudet komprimerat och sparstatus kortad till `✓ Sparat`.

v2.10.29: `Granska & komplettera` huvudrubrik, `Objekt X/Y` sekundärt, autosave längst ned, `Nästa objekt`, hjälp-X robust.

v2.10.30: central Core-terminologi införd; standard `objekt`; Vision kopplad till centrala benämningar.

v2.10.31: workspace visar synligt intervall X–Y av totalen; markerat-text bort; förklaring flyttad till vy-specifik Core-footerhjälp.

v2.10.32: aktiva Vision/Publicera-texter migrerade mot central Core-terminologi; v2.10.31 workspace-range/help kvar.

v2.10.33: edit-header centrerad; X/Y vänster; 1/3 bort; bildroller Huvudbild/Baksida/Detalj.

v2.10.34: centrerad objektrange; + Nytt foto/+ Från album; yttre Rubrik/Beskrivning; bildroller som bottom-badges.

v2.10.35: exakt centrering av workspaceCount och riktiga yttre etiketter för #title/#description.

v2.10.36: separat stort plus bort i extra bildrutor; + Nytt foto och Baksida/Detalj visas.

v2.10.37: Beskrivning låser viewport/body helt; endast innersta textarea får scrolla; skrivytan något lägre.

v2.10.38: Välj objekt som större huvudrubrik; Visar X–Y av Z under fotoknappar; större Granska & komplettera.

v2.10.39: workspace-rubrik isolerad från startvyn; review-header i två rader.

v2.10.40: duplicate Välj objekt removed in DOM; review header rebuilt as title row + 14/14/Ta bort row.

v2.10.41: 9/14 + AI-analys + Ta bort flyttade till gemensam rad direkt under bilderna; rubriken står ensam.

v2.10.42: objektåtgärdsraden under bilderna hårdresetad och byggd som ren 3-kolumns-grid utan gamla positioneringskrockar.

v2.10.43: X/Y + AI-analys + Ta bort låsta till samma rad; Rubrik börjar efter raden.

v2.10.44: Bildplats 2/3 märkta Baksida/Detalj i Granska & komplettera.

v2.10.45: Baksida/Detalj ersatta med Bild 2/Bild 3; hjälptext uppdaterad.

v2.10.46: Prisraden sänkt och Pris-etiketten flyttad åt höger i Granska & komplettera.

v2.10.47: Pris flyttat intill prisrutan och fältspacing jämnad.

v2.10.48: Jämn vertikal luft runt prisraden; horisontell placering behållen.

v2.10.49: Hela Beskrivning-sektionen flyttad upp på mobil.

v2.10.50: ‹ X/Y › navigerar föregående/nästa objekt i edit-vyn; AI-knapp = AI-analys.

v2.10.51: bredare objektnavigering med större pilar; AI-analys/Ta bort kompaktare men samma höjd.


v2.10.52: Beskrivningens fokusfält sänkt i höjd på mobil; endast textarea scrollar, Rubrik lämnas orörd.

v2.10.53: Beskrivning använder samma fokuserade editor-layout som Rubrik; bara innersta textarea scrollar.

v2.10.54: Vision cleanup; sena CSS-patchar konsoliderade utan avsiktlig UI/funktionsändring. Rollback till v2.10.53 levereras separat.

v2.10.55: Höger/vänster pil låsta på samma rad runt X/Y. Verifierat: extrabilder ingår i ny AI-analys när auto-AI är aktiv.

v2.10.56: Automatisk AI borttagen. AI körs endast via AI-analys i Granska & komplettera; alla befintliga bilder analyseras tillsammans.

v2.10.57: Objekt-räknarens pilar och X/Y har nu tre fasta/reserverade zoner så hela räknaren syns.

v2.10.58: Objekt-navigeringen < X/Y > isolerad i vänster kontroll; v2.10.57-gridfix borttagen.

v2.10.59: < X/Y > finjusterad med fasta kantzoner för pilar och självständigt centrerad räknare.

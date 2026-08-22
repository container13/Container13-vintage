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

v2.10.17: Rubrik/Beskrivning använder separat helskärms-fokusläge; ingen vanlig editor syns bakom; endast textfältet scrollar.

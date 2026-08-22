CCC Vision-modul. v2.8.1 sparar godkända produkter lokalt och beskär inte längre bilder.

v2.10.2: 3×3-arbetsgrid med swipe. `Granska & komplettera` öppnar en förenklad autosparad redigeringsvy. Upp till två extrabilder läggs till tidigt via `Nytt foto` eller `Album` och analyseras med huvudbilden. Manuella sparknappar tas bort. Kameranypzoom isoleras till kameran och kameratoppen använder CCC.

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

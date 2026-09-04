COMPETENCETOOL MOBILVY VER2 – UPPLADDNING
=========================================

PUBLICERINGSADRESS
------------------
https://container13.se/ct/


PAKETETS FEM FILER
------------------
1. index.html
   Startsidan och den illustrerade installationsguiden för iPhone.
   Här väljer användaren även mellan iPhone och Android.

2. android.html
   Den illustrerade installationsguiden för Android.
   Androidspåret använder Firefox och Violentmonkey.

3. CompetenceTool-Mobile-ver2.user.js
   Mobilanpassningen för iPhone och Safari.

4. CompetenceTool-Mobile-Android-ver2.user.js
   Mobilanpassningen för Android och Firefox.
   Nuvarande Android-testversion i filen: 2.0.2 (med riktat Firefox-loopskydd).

5. README-UPPLADDNING.txt
   Den här filen. Den behöver inte ligga publikt, men kan gärna sparas
   tillsammans med webbplatsens övriga filer.


SÅ PUBLICERAS PAKETET
---------------------
1. Spara först en kopia av de filer som redan ligger i webbplatsens /ct/-mapp.
2. Packa upp ZIP-filen.
3. Lägg index.html, android.html och båda .user.js-filerna direkt i /ct/.
4. Ersätt äldre filer när webbhotellet frågar.
5. Kontrollera adresserna nedan efter uppladdningen.


ADRESSER SOM SKA FUNGERA
------------------------
Guide och plattformsval:
https://container13.se/ct/

Androidguide:
https://container13.se/ct/android.html

iPhone-skript:
https://container13.se/ct/CompetenceTool-Mobile-ver2.user.js

Android-skript:
https://container13.se/ct/CompetenceTool-Mobile-Android-ver2.user.js

Ingen av adresserna får ge felmeddelandet 404.


VIKTIGT OM FILNAMN
------------------
- Byt inte namn på en .user.js-fil utan att samtidigt ändra motsvarande
  installationslänk i index.html eller android.html.
- Skriptadresserna måste sluta med .user.js. Annars känner tilläggen kanske
  inte igen filerna som installerbara userscripts.
- iPhone- och Android-filerna ska hållas separata.


TEST EFTER UPPLADDNING
----------------------
iPhone:
1. Öppna https://container13.se/ct/ i Safari.
2. Kontrollera att iPhone är markerat.
3. Kontrollera att installationsknappen öppnar iPhone-skriptet.

Android/Samsung:
1. Öppna https://container13.se/ct/ i Firefox, inte Samsung Internet.
2. Välj Android.
3. Installera Violentmonkey enligt guiden.
4. Kontrollera att installationsknappen öppnar Android-skriptet.
5. Testa CompetenceTool: avdelningsval, A–F, vågrät/lodrät scrollning,
   datumval, namn och popupfönster.


FRAMTIDA UPPDATERINGAR
----------------------
- Public ver2 bygger på den stabila iPhone-koden v0.76.
- Ändra bara en plattform i taget och testa den innan den andra ändras.
- Behåll alltid den senast fungerande ZIP-filen som återställningspunkt.
- Om organisationsträdet ändras finns en särskild README-kommentar högst upp
  i userscriptfilerna med instruktioner för hur trädet uppdateras.
- När en ny publik huvudversion släpps bör filnamn, metadata, guidernas länkar
  och den här README-filen uppdateras tillsammans.


iPhone- och Android-anpassad · CompetenceTool · @bulan73

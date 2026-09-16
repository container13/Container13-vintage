LONDON V06 – MIN RESA, SÄKERT SKAL
====================================

STRUKTUR
- /london/index.html          Reseguide
- /london/checklista.html     Inför resan
- /london/schema.html         Reseschema
- /london/minresa/index.html  Privat reseplånbok – UI/skalet

V06
- Ny knapp 🔐 MIN RESA på huvudsidan.
- Lösenords-only gränssnitt för Malin/Agnes.
- Reseplånbok med Flyg, Hotell och Lee Young Ji.
- Två biljettplatser: Malins biljett och Agnes biljett.
- Pappersbiljetter markeras som backup.

SÄKERHET
V06 innehåller AVSIKTLIGT INTE:
- valt lösenord
- Flightnetwork privat orderlänk
- Agoda token/bokningslänk
- Weeztix privat download-länk
- PDF-biljetterna eller QR-koderna
- bokningsreferenser

Nästa steg är att koppla lösenordsfältet till Firebase Authentication och lägga privata
reseuppgifter/biljettfiler bakom autentiserade Firebase-regler. Först efter verifierat
obehörighetstest läggs de riktiga privata uppgifterna in.


V07 – FIREBASE LOGIN TEST
- /london/minresa/ använder nu riktig Firebase Authentication.
- Bakom kulisserna används london@container13.se.
- Besökaren skriver endast lösenord.
- Lösenordet finns INTE i HTML/JS.
- Firebase-session sparas lokalt i webbläsaren tills användaren loggar ut.
- Fel lösenord visar stoppmeddelande.
- Rätt London-användare visar reseplånboken.
- Knapp LÅS / LOGGA UT tillagd.
- Fortfarande inga privata bokningslänkar, PDF-biljetter eller QR-koder i paketet.

TEST EFTER UPPLADDNING
1. Öppna /london/minresa/ i privat/inkognito-fönster.
2. Testa ett medvetet fel lösenord -> ska ge 'Fel lösenord – försök igen.'
3. Testa det riktiga London-lösenordet -> reseplånboken ska visas.
4. Uppdatera sidan -> reseplånboken ska fortfarande vara upplåst.
5. Tryck LÅS / LOGGA UT -> lösenordsvyn ska återkomma.

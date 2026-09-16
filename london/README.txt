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


V08 – FIRESTORE ACCESS TEST
- Efter godkänd Firebase-login läser /minresa/ dokumentet:
  london_private/travel_wallet
- Förväntat med London-kontot: "✓ Privat data verifierad • ready = false"
- Om Firestore-regeln nekar åtkomst låses reseplånboken igen.
- Fortfarande inga riktiga bokningslänkar eller biljett-PDF:er i paketet.

TEST
1. Ladda upp hela london-mappen.
2. Öppna /london/minresa/ och logga ut om sessionen redan är aktiv.
3. Rätt London-lösenord -> reseplånbok + "Privat data verifierad".
4. Lås/logga ut -> bankfacket ska inte visas.


V09 – SKYDDADE KONSERTBILJETTER
- Malins biljett -> Firebase Storage: london-private/leeyoungji1.pdf
- Agnes biljett -> Firebase Storage: london-private/leeyoungji2.pdf
- PDF hämtas via Firebase Storage SDK först efter autentisering.
- Ingen biljett-PDF eller publik download-URL finns i GitHub-paketet.
- Blob-URL skapas lokalt i webbläsaren när användaren trycker på biljettknappen.
- Firestore-verifieringen från V08 finns kvar.
- Flyg/hotell-knappar är fortfarande avstängda tills deras privata länkar läggs i Firestore.

TEST
1. Ladda upp V09.
2. Logga in på Min resa.
3. Kontrollera "Privat data verifierad".
4. Tryck Malins biljett -> PDF ska öppnas.
5. Tryck Agnes biljett -> den andra PDF:en ska öppnas.
6. Logga ut -> reseplånboken och biljettknapparna ska försvinna.


V10 – PRIVATA FLYG- OCH HOTELLBOKNINGAR
- flightUrl och hotelUrl läses från london_private/travel_wallet efter godkänd London-inloggning.
- Inga privata bokningslänkar är inbyggda i HTML/GitHub.
- Flyg- och hotellknappar är avstängda tills Firestore-data har lästs.
- Endast https-länkar öppnas.
- V09:s autentiserade biljett-PDF-hämtning från Firebase Storage är kvar.
- ready-fältet behöver inte ändras för V10.

TEST
1. Lägg upp V10.
2. Logga in på Min resa.
3. Kontrollera att Privat data verifierad visas.
4. Öppna flygbokningen och kontrollera Flightnetwork.
5. Öppna hotellbokningen och kontrollera Agoda.
6. Testa båda konsertbiljetterna.
7. Logga ut och kontrollera att reseplånboken döljs.


V11 – FIX FLYG/HOTELLKNAPPAR
- V10 hade kvar flyg/hotell som <span>, därför fanns inga klickbara DOM-element med rätt id.
- Bytt till riktiga button-element: flightBooking och hotelBooking.
- Knapparna startar låsta och aktiveras först när flightUrl/hotelUrl lästs från skyddade Firestore.
- Disabled-styling följer knappens faktiska status.
- Privata länkar ligger fortfarande inte i HTML/GitHub.


V12 – FIX PRIVATA DEEP-LINKS
- Tog bort V11:s new URL()/https-normalisering som gav "Bokningslänken är ogiltig".
- flightUrl och hotelUrl öppnas nu exakt som de ligger sparade i skyddade Firestore.
- De privata länkarna är fortfarande inte inbyggda i HTML/GitHub.
- Firebase Auth/Firestore-regler och Storage-biljetterna är oförändrade.


V13 – MOBIL LÄSBARHET HILTON → CLAPHAM
- Mobilfix på Reseguiden.
- "Så hade jag åkt från Hilton" och förklaringen ligger på mobil på den mörka sidbakgrunden i stället för ovanpå bussbilden.
- Desktoplayouten är oförändrad.
- Min resa, Firebase Auth, Firestore, Storage och biljettfunktionerna är oförändrade från V12.

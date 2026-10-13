# Remember – säker delningslänk och gäståtkomst (implementationsgrind)

Status: DESIGN / NOT DEPLOYED. Denna specifikation aktiverar ingen publik åtkomst. Utgångspunkt: schema 2 och webmaster-API 0.1.3; befintlig albumskapning och Micke50 får inte ändras.

## Fastställda beteenden
- Ett album har en stabil, slumpmässig och svårgissad delningslänk och motsvarande QR-kod.
- Den som har länken kan läsa godkända albumbilder utan konto, och ladda upp under serverns öppna tidsfönster först när skyddad gästuppladdning är färdig.
- Webmaster- och ägaråtgärder får aldrig auktoriseras av delningslänken.
- Stängt uppladdningsfönster innebär läsning utan uppladdning; uppgradering öppnar inte automatiskt fönstret.
- Webbmaster ska senare kunna ändra tidsfönster med auditlogg; det är inte implementerat.

## Föreslagen säker modell (måste granskas före SQL)
1. Lägg ett separat, kryptografiskt slumpat token (minst 192 bitars entropi) per album. Lagra endast hash av token på servern, inte token i albumlistning eller loggar.
2. Skapa en separat publik Edge Function för tokenbaserad **begränsad läsning**. Acceptera endast explicit tillåtna fält: albumets visningsnamn, välkomsttext om den godkänts, tidsfönstrets publika status och publicerade bilder. Aldrig e-post, ägar-ID, interna ID, audit eller adminfält.
3. Håll RLS default-deny. Edge Function använder kontrollerad serverroll och gör exakt tokenmatchning; ingen direkt anonym SELECT mot interna tabeller eller buckets.
4. Publika bilder levereras via kortlivade signerade URL:er från privat bucket. Förhindra indexering och undvik token i analysloggar, referrer och tredjepartsresurser.
5. Stöd återkallelse/rotation av länk utan att radera albumet. Visa tydligt att gammal QR då upphör att fungera.
6. Lägg till begränsning av förfrågningsfrekvens, storleksgränser, abuse-skydd och bildvalidering före skrivfunktion.
7. Gör inte gästuppladdning aktiv förrän serverstyrt tidsfönster, atomisk bildkvot, uppladdningsreservation/finalisering, filtypkontroll och radering testats.

## Testgrindar
- Utan token, fel token och återkallad token: ingen albumdata, ingen läcka om album finns.
- Giltig token: enbart publik metadata; aldrig owner_email eller intern administration.
- Token A får aldrig läsa album B.
- Stängd period: visning tillåten, alla uppladdningssteg nekas på servern.
- Flera samtidiga gäster kan inte passera 10-bildersgränsen.
- Befintligt album från 0.1.3 förblir synligt i webmasterlistan och oförändrat.
- Verifiera SQL, API, autentisering, browser, mobil och deploy separat. Ingen full release-PASS förrän alla relevanta grindar passerat.

## Nästa säkra implementation
Inventera faktisk schema-2-tabellstruktur och nuvarande Edge Function innan migration för tokenhash eller publik endpoint skrivs. Dokumentera exakta SQL-ändringar och rollback; kör inte migration utan granskning. Inga verkliga delningslänkar ska visas förrän serverkontrollerna är på plats.

# Remember – drift, kapacitet och gratisgränser

Kontrollerat 2026-10-15. Detta dokument ska läsas vid överlämning och före ändring av abonnemang, mail, lagring eller uppladdningsregler. Gränser kan ändras; verifiera källorna igen. Ingen betalplan eller automatisk överdebitering har aktiverats i detta arbete.

## Börja här vid felsökning

Syftet är att upptäcka uppenbara drift- och kvotfel innan vi felsöker kod. Följ denna ordning vid felrapport:

1. **Vad hände?** Notera tid, berörd vy/åtgärd, verklig HTTP-status och felkod. Logga inte lösenord, nycklar eller inloggningslänkar.
2. **Är tjänsten igång?** Kontrollera leverantörens driftstatus och om rätt Supabase-projekt är aktivt eller pausat.
3. **Är en gräns nådd?** Kontrollera både leverantörskvot och lokal regel: Resend dag/månad, Supabase Auth per timme/per användare, albumets bildgräns/tidsfönster, storage och trafik. Okänd förbrukning kräver kontroll i leverantörens Usage; den betyder inte att kapaciteten är fri.
4. **Finns åtkomst och rätt konfiguration?** Kontrollera domänverifiering, aktiverad SMTP, korrekt projekt, behörighet och eventuell utgången länk. Ändra inte roller för att dölja ett autentiseringsfel.
5. **Först därefter kodfelsökning.** Om ovan är kontrollerat och loggen pekar på appen, följ den verkliga kedjan och ändra minsta möjliga.

| Symtom | Första kontroll | Dra inte denna slutsats för tidigt |
|---|---|---|
| Inloggningsmail går inte att skicka | Auth-logg, särskilt429/over_email_send_rate_limit; tim-/dygns-/månadskvot och60s-spärr | Att knappen eller designen är trasig |
| Mailet syns inte | Resend-status: failed/bounced/delayed/delivered; därefter inkorg/skräppost/karantän | Att delivered garanterar synlig inkorg |
| Uppladdning stoppas | Albumets kvot/tidsfönster, filtyp/storlek, lagringskvot och faktisk HTTP-felkod | Att allt beror på fullt lagringsutrymme |
| Album eller API laddar inte | Driftstatus, projektpaus, nätverk,401/403/429 och loggar | Att data är raderade |
| Delningslänk fungerar inte | Giltighet, albumfönster och serverns åtkomstsvar | Att gästen behöver ett konto |

**Exempel från Remember:** mailfelet2026-10-14 var verifierat429 over_email_send_rate_limit. Det löstes med korrekt mailtransport; inga visuella kodändringar behövdes.

Webmasteröversiktens första uppgift är därför en kort **Driftkontroll** med status, kvotvarningar, källa och senaste kontroll. Fördjupade förbrukningsmätare är sekundära. En grön status får bara visas när kontrollen verkligen har genomförts; annars Visa ej kontrollerat. Detta är en dokumenterad specifikation, inte en redan implementerad panel.

## Tjänsternas gränser

| Tjänst/resurs | Nuvarande Free-gräns | Vad den betyder |
|---|---|---|
| Resend mail | 100/dag och 3 000/månad | Antal mail, inte unika adresser. Inloggningslänkar, bekräftelser och återställningar delar kvoten. Även andra appar på samma Resend-team kan använda den. |
| Supabase filer | 1 GB | Bilder/filer; separat från databasen. Organisationskvoter kan delas mellan projekt. |
| Supabase databas | 500 MB per projekt | Album, konton, metadata och index; separat från bildfiler. |
| Supabase utgående trafik | 5 GB plus separat 5 GB cached egress | Visningar och nedladdningar förbrukar trafik även när inga nya bilder lagras. Kvoterna får inte behandlas som fritt utbytbara. |
| Supabase aktiva användare | 50 000/månad | Aktiva konton, inte registrerade konton totalt eller antal mail. |
| Supabase Edge Functions | 500 000 anrop/månad | API-anrop; en användaråtgärd kan ge flera anrop. |
| Supabase filstorlek | Högst 50 MB per fil på Free | Remember kan ha striktare regler, se nedan. |
| Supabase Realtime | 200 samtidiga anslutningar, 2 miljoner meddelanden/månad | Relevant endast där Realtime faktiskt används. |
| Supabase drift | Paus efter en veckas inaktivitet; högst två aktiva Free-projekt | Gratisplanen är inte en garanti om oavbruten drift. |
| Supabase backup/loggar | Automatiska databasbackuper ingår inte; API/databasloggar 1 dag | En verifierad separat backup/återställning behövs före skarp drift. |
| GitHub Pages | Publicerad webbplats högst 1 GB; mjuk trafikgräns 100 GB/månad | Delas av hela publicerade webbplatsen, inte bara remember/. Gästbilder lagras i Supabase. |

GitHub Pages villkor begränsar användning för kommersiell SaaS och kommersiella transaktioner. Välj lämplig hosting och granska detta före offentlig kommersiell lansering; inget hostingbyte genomfört här.

## Remember-regler och Auth

- Gratisalbumens standard är 10 bilder. Det är en produktregel, inte Supabases lagringskvot. Betalning/uppgraderingar är inte färdig verifierad funktionalitet.
- Fest/bröllop har standardfönster 24 timmar från start; resa/fiske till 24 timmar efter slut. Ändringsbara fönster ska följa faktiska serverregler.
- Bildförberedelsen accepterar JPEG/PNG/WebP, högst 10 MiB original, längsta sida 1920 pixlar och mål cirka 600 KiB. Målet är inte en garanterad filstorlek. Upload-kandidaten har separat servergräns 2 MiB. Kandidatkod är inte i sig bevis för driftsatta regler; verifiera aktiv funktion och bucket före löfte till användare.
- SMTP sparades med minst 60 sekunder mellan mail till samma användare. Supabase har också en separat projektgräns per timme. UI angav 30/timme vid aktivering; det aktuella sparade timvärdet är ännu inte återläst. Anta därför inte att 100 mail kan skickas samtidigt.
- Vanlig lösenordsinloggning skickar inget mail; registrering, återställning och säkerhetsmail kan fortfarande använda mailkvoten.
- Tjänsternas dygn/månadsperioder och tidszoner ska hämtas från leverantören. Visa inte en svensk kalenderdagsräknare som garanterat återstående leverantörskvot.

## Uppmätt ögonblicksbild – 2026-10-15 cirka 09:40 Europe/Stockholm

Read-only SQL i Remember-projektet:

| Mätning | Värde | Tolkning |
|---|---|---|
| Filobjekt | 3 | Alla registrerade storage.objects i projektet. |
| Filbytes enligt metadata | 794 834 byte, cirka 0,795 MB | Cirka 0,08 % av 1 GB. Nominellt cirka 999 MB kvar om inga andra projekt delar kvoten; ingen faktureringsgaranti. |
| pg_database_size | 11 867 827 byte, cirka 11,87 MB | Fysisk SQL-mätning; kan skilja från leverantörens debiterade databasstorlek. Inte en exakt återstående-kvotmätare. |
| Mail | Ett aktuellt authmail verifierat delivered | Inte en fullständig dygns-/månadssummering. Användaren bekräftade inkorg och lyckad inloggning. |

Aktuell total trafik, MAU, Edge-anrop och fullständig mailkvotförbrukning är **inte uppmätta** här. Okänt får inte visas som noll. Bildernas möjliga antal kan inte garanteras utifrån 1 GB: storlekar varierar och andra filer/rensningsrester kan förbruka utrymme.

## Webmaster – beslutad riktning, ännu inte implementerad

Lägg en hopfälld **Drift och kapacitet** under befintlig serververifierad Webmaster-del. Vanliga konton ska varken se denna del eller kunna hämta privata driftdata.

Visa använt / gräns / återstår, period, källa och senaste hämtning för bildlagring, databas, mail/dygn och månad, trafik, MAU och Edge-anrop. Visa album/bildantal separat från leverantörskvoter. Visa Okänt eller Senast hämtat vid API-fel, inte en grön nolla. Uppdatera på begäran, inte vid varje bildvisning.

Föreslagen visuell varning: 70 % information, 85 % planera åtgärd, 95 % brådskande. Dessa är interna rekommendationer, inte leverantörens faktiska spärrnivåer. Inga automatiska köp, raderingar eller mailutskick.

Återanvänd befintlig remember-webmaster serverauktorisering per anrop. Läs inte service_role, Resend API-nyckel eller Management-token i webbläsaren. Leverantörernas faktureringsdata ska hämtas server-side med minsta möjliga behörighet och cache. Appens lokala räknare är inte en ersättning för leverantörens samlade kvoter. Ingen ny token, databasfunktion eller endpoint är skapad i denna dokumentändring.

## Underhåll och överlämning

1. Läs detta dokument tillsammans med PROJECT_CURRENT_STATE.json och senaste handoff.
2. Kontrollera leverantörernas aktuella plan och Usage före kapacitetsbeslut; en prislista är inte bevis för kontots aktuella abonnemang.
3. Uppdatera källdatum, måttenhet, kvotens omfattning och mättid efter varje kontroll. Behåll okända mätvärden tydligt okända.
4. Vid 85 %: planera komprimering, kontrollerad lagringspolicy eller en uttryckligen godkänd uppgradering. Ändra aldrig gästernas bilder eller abonnemang automatiskt.

## Källor, kontrollerade 2026-10-15

- https://resend.com/pricing
- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/manage-your-usage
- https://supabase.com/docs/guides/platform/billing-on-supabase
- https://supabase.com/docs/guides/auth/rate-limits
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Faktiska källor: image-compress.js, deploy/remember-photo-upload_REVIEW_ONLY.ts och befintlig albumlogik. Driftsstatus följer PROJECT_CURRENT_STATE.json, inte filnamn eller kandidaters kommentarer.

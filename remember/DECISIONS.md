# Beslut – Container13 Remember

## Fastställda
- Huvudvarumärke: Container13. Vintagebutiken är fortsatt Container13 Vintage.
- Albumtjänstens arbetsnamn och mappnamn: Remember. Avsedd adress: https://container13.se/remember/.
- Tjänsten ska kunna användas för fiskeresor, fester, bröllop, resor och andra gemensamma upplevelser.
- Första verkliga pilot: fiskeresa. Micke50 är referens, ska inte modifieras.
- Gratis full upplevelse upp till 10 bilder per album; därefter möjlighet till uppgradering utan att förlora bilder eller URL.
- En gemensam återanvändbar produkt, inte en ny hårdkodad webbplats per tillfälle.
- Gemensam projektstandard och solutions-bibliotek ska återanvändas. Inga parallella system utan skäl.

## Öppet – inga antaganden som beslut
- Backend: Supabase/Auth/DB + Cloudflare R2 eller annan lösning, ej valt.
- Betalningsmodell/pris: engångsbetalning ca 199 kr för 200 bilder/90 dagar och årsmodell ca 149 kr har diskuterats som exempel, inte beslutats.
- Gästers behörigheter, albumens offentlighet, datalivslängd, GDPR-villkor och betalningsleverantör ska beslutas innan produktion.
- Remember är ett vanligt ord; mappnamn ger inte automatisk juridisk immunitet. Container13 ska vara tydlig avsändare.
- Ingen produktionslansering eller registrering är godkänd genom detta namnval.

## Album sharing and owner workflow - agreed
- Owner provides name and verified email for secure album administration and purchase communication.
- Guests can open the shared album URL or QR code and upload photos without registering, subject to abuse protection before launch.
- Every album has a stable unique share URL; the owner can copy and share it. QR points to that same URL. Owner administration uses separate protected access, never the public share link.
- Owner may suggest a readable URL slug if available; final format and protection against guessing/enumeration require backend design.
- First 10 photos remain free without purchase. On reaching the limit, offer the owner an optional upgrade by email; prices/provider remain undecided.
- Upgrading must preserve existing photos, album URL and QR code. Transaction email/receipt follows the payment provider.
- These are requirements, not implemented or verified features. Privacy, access, retention and anti-spam safeguards remain launch gates.

## Beslut: tidsbegransad gastuppladdning
- Alla med albumets delningslank eller QR-kod far se albumet och bidra med bilder under oppet uppladdningsfonster; albumet ska inte listas offentligt. Lanken ar en atkomstnyckel och maste vara svar att gissa, aterkallelig och skyddad mot missbruk.
- Fest och brollop: uppladdning tillats i 24 timmar fran angiven starttid som standard.
- Resa, semester och fiskeresa: agaren anger start- och sluttid/datum; uppladdning tillats fran start till 24 timmar efter resans slut.
- Efter fonstrets slut blir albumet lasbart men inte uppladdningsbart. Befintliga bilder och delningsadress behalls enligt kommande beslut om lagringstid och integritet.
- Agaren kan stanga uppladdningen tidigare. UI visar nar uppladdningen stanger, med relevant tidszon.
- Servern avgor tidsgransen; en uppladdning maste vara slutford och godkand inom fonstret. Uppgradering oppnar inte automatiskt ett stangt tidsfonster.
- Detaljer kring forlanga/ateroppna fonstret, radering, moderering och lagringstid beslutas fore produktion.

## Webmaster control of upload windows
- The Container13 webmaster can securely edit upload opening and closing times for any album, including after creation.
- Webmaster can extend, shorten, immediately close, reopen, and restore an album's default schedule. Changes do not change the share URL, QR code or existing photos.
- Album owner supplies initial event dates. Webmaster overrides are authoritative, independently of payment plan.
- Webmaster access requires separate strong authentication and server-side role checks. Log who changed what and when. Changes take effect on server immediately.
- This is an agreed requirement, not yet implemented.

## Album downloads - agreed 2026-10-13
- Anyone holding an active, valid, non-revoked album share link can download album photos without signing in.
- Authenticated, server-authorized webmasters can download photos from every album without a guest token.
- Downloads remain available when the upload window closes; revoked links lose access.
- Delivery order: all original photos as ZIP, selected photos, then PDF album.
- Authorize every export request server-side. Keep storage private; never expose unrestricted permanent object URLs.
- This is an approved requirement, not a deployed feature. Retention and abuse controls remain to be designed.

## Beslut: beställare, QR-gäster och webmaster (2026-10-13)
- Album-beställaren anger sin e-postadress vid skapandet. Adressen används för orderbekräftelse och albuminformation, inte som ett krav för gäster.
- E-postinmatning är inte samma sak som verifierad e-post. Beställarens skyddade albumadministration kräver en separat verifieringsmekanism.
- QR-kod och delningslänk öppnar gästalbumet utan inloggning, registrering eller krav på e-post. Åtkomst kräver giltig, serverkontrollerad, återkallelig gästtoken.
- Webmaster har separat lösenordsinloggning och serverkontrollerad behörighet.
- Startsidan är en gemensam ingång; beställningsflödet får inte förväxlas med webmasterpanelen.
- Inget här innebär att e-postutskick, QR-kodsgenerering eller albumregistrering är aktiverade.


## BESLUT 2026-10-13 — Håll Remember V1 enkelt (bekräftat av användaren)
- **Prioritet:** Få en riktig bild uppladdad och synlig i rätt album, sedan testa flera bilder. Bygg inte omfattande återhämtningssystem innan grundflödet fungerar.
- V1 ska ha: privat albumåtkomst via giltig länk/behörighet; max 10 bilder för gratisalbum; exakt SHA-256-dubblettskydd inom samma album; tydlig uppladdningsbekräftelse och begripligt fel vid avbrott, med möjlighet att försöka igen manuellt.
- **Inte V1-krav:** avancerad automatisk återupptagning, komplex återställnings-/reconciliationmotor, perceptuell bildlikhetsanalys eller att täcka varje hypotetiskt nätverksfel. Dessa är framtida förbättringar vid påvisat behov.
- **Säkerhetsgolv kvarstår:** servern ska validera albumbehörighet, tidsfönster, bildtyp och kvot; privata objekt, ingen service-role-nyckel i klienten; grundläggande samtidighetsskydd så 10-bildersgränsen inte kan kringgås. Ett fel får inte tyst rapporteras som lyckad uppladdning eller frigöra en plats med risk för kvarlämnat objekt.
- Tidigare dokument som beskriver avancerad återupptagning som blockerande V1-krav ska läsas mot detta senare beslut. Review-only-kandidater är inte godkända för driftsättning enbart genom denna förenkling.
- **Arbetsregel:** Läs `remember/DECISIONS.md` och kontrollera senaste beslut innan varje nytt implementationssteg. Vid motstridiga äldre krav: följ senaste uttryckliga beslut och uppdatera handoff, i stället för att återinföra överkurs.


## Beslut 2026-10-14 — Ett godkännande räcker
- I den inbäddade gästkameran ska **Godkänn valda** direkt starta serveruppladdning av de valda bilderna. Ingen extra **Publicera godkända bilder**-knapp och ingen extra bekräftelsedialog.
- Visa förlopp och serverbekräftelse. Vid fel: behåll ej bekräftade bilder i aktuell flik och visa **Försök ladda upp igen**. Ingen avancerad automatisk återupptagning.


## Beslut 2026-10-14 — Tydlig lägesidentitet
- Albumets webmastervy och gästvy ska alltid ha en tydlig, färgmässigt skild lägesrubrik högst upp: **🛠 WEBMASTERLÄGE** respektive **👥 GÄSTLÄGE**.
- Lägesidentiteten får inte enbart ligga i brödtext eller bero på användarens förståelse av URL:en. Webmaster ska ha synlig återväg till Dashboard.


## Beslut 2026-10-14 — Webmaster laddar upp med egen inloggning
- I webmasterläge används verifierad Supabase-session + album-ID, aldrig krav på att ange gästlänk. Servern verifierar användaridentitet och webmasterroll innan bildreservation och färdigmarkering. Gästläget använder fortsatt giltig gästtoken. Bildkvot, tidsfönster, privat lagring och SHA-256-dubblettskydd gäller båda.


## Beslut 2026-10-14 — Levande bildgalleri
- Albumet visar alla sparade bilder med senaste överst, automatiskt efter uppladdning och med regelbunden uppdatering utan manuell omladdning. Gäller både webmaster- och gästläge.
- Privat lagring kvarstår: servern verifierar webmaster-JWT eller giltig gästtoken och returnerar kortlivade signerade bildadresser. Ingen publik bucket.


## Verifiering 2026-10-14 — Gästflöde
- Gästsidans kamerauppladdning uppdaterar bildgalleriet omedelbart efter lyckad serverbekräftelse. Föråldrad varning om att uppladdning ej verifierats och extra bekräftelsedialog vid filval är borttagna.
- Databasens read-only negativa behörighetstest: ogiltig gästtoken och saknad autentisering ger `authorized:false`; anon/authenticated saknar direkt EXECUTE på privata gallerifunktionen. Två bilder är `ready` och en aktiv gästlänk finns.
- **Återstår:** verkligt test av gästlänk och uppladdning i utloggad mobil. Inga gästtokens ska hämtas ur databasen eller läggas i GitHub.


## Beslut 2026-10-14 — WM-9.4 gästlänk och QR
- Webmastervyn visar automatiskt QR-kod och kopierbar gästlänk när den krypterade serverkopian finns. Inga manuella tokenfält.
- Befintliga äldre gästlänkar utan krypterad kopia kan inte återskapas. Byte till ny länk kräver en tydlig bekräftelse om att gamla länkar och QR-koder slutar fungera. Inget automatiskt byte.
- Ny gästlänk krypteras server-side med AES-GCM (HKDF från Supabase service-role-secret) och förvaras i en privat RLS-skyddad vault, åtkomlig via service-only RPC med webmaster/albumägarbehörighet. Varning: byte av underliggande service-role-secret kan göra lagrade länkar oläsbara; framtida dedikerad krypteringsnyckel rekommenderas innan bred lansering.
- WM-9.4 är committad, Edge Function remember-share-manager ACTIVE v1. Test på iPhone samt verkligt länkbyte återstår; gamla länken har inte roterats.


## WM-9.5 — Bekräftelse vid kopiering
- Kopieringsknappen ändras till ✓ Kopierad! efter lyckad urklippsskrivning och återställs efter 2,5 sekunder; fel visas om urklippsskrivningen misslyckas.
- Gästläge verifierat med två iPhone-skärmbilder: öppnas privat utan inloggning och visar två foton senaste först. Gästuppladdning återstår att testa.


## G-1.1 — Ren mobil gästvy
- Gästuppladdning verifierad i privat iPhone-flik: tredje bilden sparad och visas först i albumet.
- Mobilvyn använder endast två huvudknappar (Ta foto, Lägg till bilder), automatiskt filval/uppladdning, kompakt feedback, galleri direkt under. Teknisk hjälpttext, synligt filinput och extra uppladdningsknapp tas bort; retry visas bara vid fel.
- Gästversion G-1.1 visas tydligt. Webbvisning på iPhone återstår att verifiera.


## Ä-1.0 — Albumägarens hantering (2026-10-14)
- Separat ägarvy remember/owner.html. Dashboard visar egna album via serverns owner-manager, oberoende av webmasterroll. Ägaren kan visa och kopiera gästlänk/QR samt permanent radera enskilda bilder efter uttrycklig bekräftelse.
- Servern verifierar Supabase JWT och albums.owner_user_id innan listning/radering/delning. Gäster får inte åtkomst till ägarverktygen. Radering tar bort privat lagringsobjekt och därefter album_photos-raden. Ingen albumradering i Ä-1.0.
- Befintliga gästlänkar roteras aldrig utan separat bekräftelse. Webbmastervyn kvarstår.
- Edge functions remember-owner-manager ACTIVE v1, remember-share-manager ACTIVE v2, remember-photo-gallery ACTIVE v3. Ä-1.0 är committad och väntar på verkligt inloggat enhetstest. Inga bilder har raderats under utvecklingen.
- Gammal experimentfunktion public.remember_owner_album_list(uuid) är SECURITY INVOKER och returnerar konstant tom lista; används inte av ägarvyn. Bör städas upp i en senare säkerhetsgranskad migration.


## Beslut 2026-10-14 — Registrering och e-postaktivering
- Ny albumägare börjar med albumuppgifter och e-postadress. Inget obligatoriskt lösenord vid första besöket.
- E-postadress verifieras genom personlig tidsbegränsad länk innan albumet skapas/aktiveras på servern.
- Efter aktivering ska ägaren vara inloggad och komma till sitt album. Återkommande ägare kan logga in med e-postlänk; lösenord är frivilligt.
- Aktiveringslänk kan begäras igen. Ingen dubbelregistrering vid återbesök. Bygg först ett säkert och begripligt registreringssteg; automatisk albumskapning efter verifiering kräver separat serverimplementering och test.


## R-1.0 / S-1.0 — Första registreringsvyerna
- remember/index.html förenklad kundstartsida, remember/register.html formulär för albumutkast + e-postlänk via Supabase OTP, remember/activate.html verifierar session och skickar vidare till Dashboard.
- Utkast lagras enbart i sessionStorage på enheten. Album skapas **inte** automatiskt ännu; säker server-side skapning och återhämtning av utkast mellan enheter återstår. E-postleverans och redirect URL i Supabase Auth måste verifieras innan externt test.
- Gamla gästvyn, befintliga album och länkar är inte ändrade av detta steg. Versionsetiketter S-1.0 och R-1.0.


## S-1.1 — Remember-varumärke och välkomstbok
- Startsidan profileras som 'Remember.' med 'by Container13' under, inte 'hosted by'.
- Mobil och desktop: fyra exempelbilder i en fotobok som bläddrar automatiskt var fjärde sekund med sidvändningsanimation; användaren kan svepa eller trycka föregående/nästa.
- Fast footer med 'Kom igång med e-post' till registreringsflödet, gratisgräns och inloggningslänk.
- Respektera minskad rörelse i systeminställningarna; bilderna är externa referensbilder som bör ersättas med egna licensgranskade bilder inför lansering. Enhetstest av animation och layout återstår.


## S-1.2 — Stilrenare välkomstbok
- Minskad bokhöjd och färre instruktionstexter i mobilvyn.
- Fotoboken har två överlappande papperssidor: nästa foto läggs på undre sidan före vändningen, så det syns medan den gamla sidan vänds bort.
- Verifierat genom återläsning från GitHub. Visuellt test på iPhone återstår.


## M-1.1 — Global mobilpolicy i Remember (2026-10-14)
- Alla åtta kontrollerade HTML-vyer i remember/ (index, register, login, dashboard, owner, album, activate, album-admin) laddar den gemensamma project-template/mobile-view-policy.js?v=2.
- Mobilvyer får inte nypzoomas; avsiktliga bildvisare kan opta in via data-image-zoom=true och hanterar enbart bildens zoom.
- Varje vy märks med remember-mobile-policy M-1.1 och startsidan med S-1.6. Samtliga åtta filer återlästa och verifierade i GitHub. Verkligt test på iPhone återstår.


## S-1.7 — Ny fiskebild och renare nedre del
- Fiskeresor använder ett Unsplash-foto av flugfiske vid soluppgång (Samantha Deleo); bildens licens behöver fortsatt bedömas inför slutlig lansering.
- Automatisk intervall ändrat från 6,5 till 3,25 sekunder; sidvändning kvar på 1,7 sekunder.
- Under fotoboken finns inte längre en separat knapp; 'Så här fungerar det' ligger diskret ovanför huvudknappen i den förenklade nederdelen utan avskiljande linje och färgblock.
- Inloggningslänken och gratisinformationen är nedtonade; registreringsknappen är huvudfokus. Test på iPhone återstår.

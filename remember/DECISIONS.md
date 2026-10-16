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


## R-1.1 — Mobil registreringsdesign
- Registreringssidan får samma Remember./by Container13-identitet som startsidan, kompakt centrerad rubrik och ett samlat formulärkort.
- Mörkt color-scheme gör datum-/tidskontroller tydligare på iPhone; formulärfält har minsta textstorlek 16 px och bättre avstånd.
- Huvudknappen heter Skapa album, men det faktiska första steget skickar fortfarande endast en e-postaktiveringslänk. Automatisk albumskapning efter verifiering är ännu inte färdig.
- Gemensam nypzoomspärr kvar; kod verifierad i GitHub, visuell kontroll på fysisk iPhone återstår.


## S-1.9 — Samma bildyta på alla fyra uppslag
- Alla exempelbilder använder enhetlig bildram med object-fit:cover så inga tomma sidofält uppstår vid olika bildproportioner.
- Bröllopsbildens källa bytt igen till ett bredare bröllopsmotiv. Säkerställ på fysisk iPhone att ansikten är synliga och inte kapas; detta är ännu inte visuellt verifierat.
- Övriga delar av fotoboken och registreringen lämnas oförändrade.


## R-1.2 — Uppladdningstid 1–28 dagar
- Registreringen frågar inte längre efter albumtyp eller separat slutdatum.
- Ägaren väljer startdatum/tid och uppladdningstid i rullista med 1–28 dagar, förvalt 1 dag.
- Draft i sessionStorage sparar title, starts, days och email. Denna ändring gäller registreringsgränssnittet; serverns tidsfönster och automatisk albumskapning efter e-postverifiering är ännu inte kopplade till detta val.
- Tidigare kategoribaserade tidsfönster gäller befintliga album tills separat migrering har beslutats.


## R-1.3 / A-1.2 — Ägarskapat album och serverstyrd tidsgräns
- Efter verifierad e-post anropar activate.html den autentiserade remember-owner-manager v2 med en stabil requestId, titel, starttid (UTC), tidszon och days (heltal 1–28).
- Servern validerar JWT mot Supabase Auth och kräver verifierad e-post, kontrollerar intervall och skriver remember.albums.default_opens_at samt default_closes_at = start + days x 24 timmar; photo_limit=10. Återförsök med samma requestId är idempotenta och ägarbundna.
- Uppladdningens befintliga serverkontroller ska använda albumets lagrade öppnings-/stängningstider; befintliga album och webbmasteröverstyrningar ändras inte.
- Onboardingutkast lagras i localStorage för att klara e-postlänk i ny flik i samma webbläsare, men inte på annan enhet/webbläsare. Aktivering leder till owner.html?id=albumId efter lyckat skapande. Inget test med verklig e-postlänk eller ny bild genomfört ännu.


## Dashboard 0.1.12 — Renodlad ägarvy
- Ägarens album hämtas direkt via remember-owner-manager/list utan webmasterkontroll; webbmasterstatus och äldre teknisk albumlista döljs i standardvyn.
- Mobil design anpassad till Remember: serifrubrik, diskret avsändare och klickbara albumkort. Webmasterfunktionerna är kvar i separat teknisk sektion och behörighetskontroller kvar på servern.
- Nytt album efter aktiveringslänk från Outlook är ännu inte bekräftat. Om e-postlänken öppnas i en annan webbläsarkontext finns inte lokalt onboardingutkast och albumskapning kan utebli; måste rättas separat.


## Dashboard 0.1.14 — Ägarvy utan webmasterknappar
- Kontosektionen heter Kontoinställningar. Webmasterknapparna döljs från den vanliga vyn men serverbehörigheterna är oförändrade.
- Ägaralbum visas som klickbara kort. Tomt albumläge har tydlig text och länk till register.html för nytt album.
- Styling av CTA och mobilkort förbättrad. GitHub-innehåll återläst och verifierat; visuell kontroll på iPhone samt verkligt Outlook-aktiveringsflöde återstår.


## Supabase — behörighetsfix 2026-10-14
- Registrering via remember-onboarding svarade 503. Diagnos: service_role saknade USAGE på schemat remember, trots tabellrättigheter.
- Migration remember_service_role_schema_usage: GRANT USAGE ON SCHEMA remember TO service_role.
- Efter migration verifierades schema_access=true och table_access=true för pending_album_registrations.
- Verkligt registrerings- och Outlook-aktiveringstest återstår; inga påståenden om levererat mejl eller skapat album utan verifiering.

- 2026-10-14: PostgREST HEAD mot pending_album_registrations svarade 406 efter schema-USAGE-fix. Migration remember_postgrest_schema_exposure satte authenticator pgrst.db_schemas till public, graphql_public, remember och skickade NOTIFY pgrst reload config. Bekräftat via pg_roles. E2E-test återstår.

- 2026-10-14: Efter att remember exponerats gav PostgREST 404 vid HEAD och INSERT mot pending_album_registrations. Migration remember_pending_table_schema_cache_refresh uppdaterade tabellkommentar för att initiera schema-cache-refresh; verifierad kommentar i DB. API-anrop och verklig registrering ännu ej verifierade. Ingen frontendändring.

- 2026-10-14: Verklig aktiveringslänk verifierade användaren och läste pending registration (200), men album SELECT/INSERT gav 403. Migration remember_service_role_albums_permissions gav SELECT och INSERT på remember.albums till service_role; båda verifierades true. Nytt verkligt aktiveringstest återstår; använd befintlig verifierad session, skicka inte om mejl i onödan.

## Ä-1.1 — Stilren ägarvy (2026-10-14)
- remember/owner.html omgjord med mörkgrön albumdesign, delning och uppladdningsingång, tydligt tomt album, helskärmsbild och kvarvarande serverstyrd radering med bekräftelse. Version Ä-1.1, commit 9c513fbe. Verkligt mobiltest återstår.
- Galleriet gav tidigare 503 när service_role saknade SELECT på remember.album_photos. Migration remember_gallery_service_role_select_fix genomförd och has_table_privilege verifierad true. Verkligt API-/mobiltest återstår.

## S-1.10 — En enda huvudadress
- Enda adress användaren ska behöva minnas: https://container13.se/remember/. Startsidan kontrollerar befintlig Supabase-session med samma auth storage key som dashboard och skickar redan inloggade direkt till dashboard.html. Utloggade ser välkomstsidan. Interna ägar-/albumadresser är inte något användaren ska behöva hålla reda på. Commit 6df5dc0. Verkligt mobiltest återstår.

## Inloggning 0.1.9 — Synligt aktivt konto och kontobyte
- När användaren väljer 'Jag har redan ett konto' får login.html inte automatiskt omdirigera vid befintlig session. Visa aktiv e-postadress och Logga ut samt Öppna Mina album. Därmed kan användaren uttryckligen byta konto utan att konton eller album ändras. Endast uttrycklig ?continue=1 tillåter automatisk redirect på login.html. Huvudadressen /remember/ fortsätter automatiskt till dashboard för inloggad användare. Commit dd50bd6; verkligt iPhone-test återstår.

## Inloggning 0.1.10 — E-post först, två val
- login.html har ett e-postfält och två primära val: mejllänk eller lösenord. Lösenordsfältet visas endast vid valt lösenordsflöde. Vid misslyckad lösenordsinloggning erbjuds lösenordsskapande/återställning via mejl utan kontouppräkning. Föråldrad testmiljötext borttagen. Commit 313e1444. Mobiltest och kontroll av hidden-styling återstår; vidare patchförsök blockerades av verktygets säkerhetskontroll.


## Approved decision — 2026-10-15 09:56 Europe/Stockholm
User confirms standalone operations panel, separate from Remember: own code/version/deployment, read-only protected service connections, potentially shared across Remember/CCC/other projects. Remember keeps album/access/window administration. Supersedes embedded capacity panel proposal. No implementation or new credential/hosting setup performed. Primary purpose: obvious service/quota/configuration checks before code debugging.


## Centraliserad versions- och uppdateringshantering (beslut 2026-10-16)
- Gäller **hela Remember**, nuvarande och framtida vyer: startsida, inloggning, registrering, aktivering, dashboard, albumägare, gäster, albumadministration och framtida användarflöden.
- **En gemensam uppdateringsmotor:** `remember/auto-update.js`. Nya vyer ska kopplas till den vid skapandet, inte i efterhand. Inga separata sidunika uppdateringslösningar.
- **En gemensam versionskälla ska införas:** publicerad release-manifest/ID och tillhörande resursversioner, i stället för enbart HTML-jämförelse. Detta är ett kvarstående tekniskt arbete, inte redan verifierat.
- Vid kallstart, återgång till förgrunden och återanslutning ska appen kontrollera en ny publicerad version utan att användaren behöver rensa cache eller installera om.
- Säker omladdning: skydda osparade formulär, pågående uppladdning, kamera, dialoger och transaktioner; köa uppdatering tills det är säkert.
- En ny release måste verifieras i faktisk publicerad miljö och i installerad iPhone-PWA, inklusive uppgradering från gammal version, offline/online och djup-länkar.
- **Release-gate:** ingen ny användarvy får godkännas om uppdateringsmotorn saknas; versions-ID och teststatus ska dokumenteras.
- Huvudregler: `project-template/PROJECT_MASTER_RULES.md`, `PROJECT_RELEASE_CHECKLIST.md` och `SHARED_COMPONENT_REGISTER.md`.


## Remember 0.1.52: background launch and universal version
- User reproduction: iPhone installed PWA opens Mina album with a dark band below the background; swiping down or automatic scroll changes the painted viewport and band disappears. Root-cause hypothesis is initial visual-viewport geometry / iOS fixed-layer painting, not an image-size defect. **Not yet proven on-device**.
- Replaced the dashboard's automatic pageshow scroll-to-top workaround with shared `remember-viewport.js` visualViewport/resize handling. Shared `remember-design.css` uses the measured viewport for the wallpaper and removes duplicate root wallpaper painting. This is a targeted mitigation awaiting real iPhone verification.
- Central release identity: `remember/release.json` and embedded `remember-release` meta. Shared updater compares deployed release ID and can defer unsafe reloads. **Every new release must increment release.json and update the embedded running release IDs in the same rollout**.
- Global version badge: `remember/remember-version.js`, required at the bottom of every production-facing view. It must show the **running version**, not the latest server version if this page has not updated.
- Do not close the viewport issue or label DEVICE PASS without installed iPhone cold-launch/resume test and a screenshot.

## Remember 0.1.53 background root-cause mitigation
Confirmed on-device: v0.1.52 loaded but brown root background band remained at bottom on initial iPhone PWA paint; scrolling caused background to fill. Removed the 0.1.50 and 0.1.52 viewport-height CSS patches, disconnected `remember-viewport.js` from production entry points, and made the root canvas use the actual wallpaper with a fixed backdrop extending 160px beyond both viewport edges. Version bump across all nine user-facing views. **Not device verified; do not mark resolved until user confirms cold start and scroll.**

## 2026-10-16 – iPhone installerad PWA: nedersta mörka remsan
- **Reproducerat på riktig iPhone:** `screen.height=874`, `innerHeight=812`, skillnad 62 CSS-px; `env(safe-area-inset-bottom)` rapporterar 54 px i separat test. Remsan syns även efter kallstart och utan scroll.
- **Isolerat test:** `remember/pwa-display-test.html` och egen manifest `pwa-display-test.webmanifest`, installerad som separat hemskärmsapp. Samma nedersta remsa trots `viewport-fit=cover` och `apple-mobile-web-app-status-bar-style=black-translucent`. Detta talar emot att dashboardens egna CSS-regler är grundorsaken.
- **Extern möjlig förklaring:** WebKit bug 301994, https://bugs.webkit.org/show_bug.cgi?id=301994 . Matchningen har diskuterats men bör verifieras mot rapportens exakta miljö och aktuella status innan den anges som definitivt bevis.
- **Beslut:** Sluta lägga på spekulativa CSS-höjdjusteringar. Behåll v0.1.57:s verifierat skarpa logotyp och övriga layout. Ta bort tillfälliga `Skärmmätning`-knappen och dess diagnostikskript från dashboarden; bevara separat testsida och underlag för framtida iOS/WebKit-uppföljning.
- **Status:** Systemområdets bakgrund är inte löst. Ingen DEVICE PASS för heltäckande bakgrund; användaren har verifierat endast att logotypen är korrekt och att remsan kvarstår.

## Beslut 2026-10-16 — enhetligt stillastående bakgrundsbeteende, iOS-problem pausat
- Användaren beslutar att **inte** försöka bygga bort den mörka iOS 27/PWA-systemremsan nu. Återuppta först när en Apple/iOS/WebKit-uppdatering motiverar ny verifiering. Bevara separat testapp och mätdata.
- **Alla Remember-vyer ska bete sig enhetligt:** ingen vy får automatiskt svepa/glida ned eller flytta bakgrundens position efter öppning. Mina album ska inte göra ett synligt självkorrigerande hopp medan albumägarvyn står stilla. Målet är en stabil, stillastående bakgrund från första ritningen. En kvarvarande iOS-systemremsa accepteras tills vidare; automatiska visuella hopp gör det inte.
- Kontrollera faktisk orsak till hoppet innan kodändring; inför inte ny automatisk scroll, omritningshack eller spekulativ viewport-CSS. Skydda normal manuell scroll, kamera och andra vyer. Verifiera skillnaden på riktig installerad iPhone.
- **Observerad versionskonflikt vid dokumentationskontroll:** dashboard.html refererade 0.1.61 och shared CSS innehöll ett 0.1.61-block för `100lvh`, medan owner.html och release.json fortfarande var 0.1.60. Detta är en ofullständig/ej verifierad kodändring, **inte** en godkänd release. Innan vidare runtime-arbete: inventera HEAD, stäm av alla nio vyer och gemensamma resurser och hantera det ofullständiga försöket enligt mallens stoppregel. Inga runtime-filer ändrades när detta beslut dokumenterades.

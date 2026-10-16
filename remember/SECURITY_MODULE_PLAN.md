# Remember – fristående modul för albumsäkerhet och kvotaviseringar
Status: DESIGN ONLY / NOT IMPLEMENTED. Beslut 2026-10-16. Referens: användargodkänd Remember 0.1.75.

## Grundprinciper
- Befintlig bildvisning, swipe, zoom, bildexport och fungerande uppladdningsflöden lämnas orörda under separat utveckling.
- Webmaster aktiverar funktionstillgänglighet via serverstyrda feature flags. Albumägaren väljer själv säkerhetsnivå och kombinationer per album. Inga nya kundfunktioner aktiveras automatiskt.
- Albumägaren kan ändra val under pågående fest, utan ny QR-kod. Ändringarna gäller server-side för nya åtgärder och klienten hämtar ny status vid nästa säkra kontroll.
- Grundläggande behörighetskontroll, uppladdningskvot, missbruksskydd och webmasteringripande kan inte stängas av. Skyddsfunktioner för rapportering/åtgärd bör erbjudas alla paket, medan utökad verifiering och förhandsgranskning kan vara paketfunktioner.
- Drift/kapacitet för Supabase, Resend och andra leverantörer tillhör en helt fristående driftpanel, inte Remember Webmaster.

## Albumägarens valbara säkerhetsinställningar
1. Kräv verifierad e-post före uppladdning (engångskod/magic link). Verifierad e-post är inte verifierad verklig identitet.
2. Kräv albumägarens godkännande innan nya bilder syns i album eller TV-bildspel. Pending media är aldrig åtkomliga via publik bildlista eller gästernas fil-URL:er.
3. Gästrapportering av olämpliga bilder; albumägaren kan dölja bilder omedelbart. Webmaster kan ingripa vid missbruk.
4. Aviseringar om rapporter, med kontrollerad frekvens.
5. Pausa ny publicering/bildspelsvisning medan redan godkända bilder kan fortsätta visas.
6. Gäster får tydlig information om e-postanvändning, behörighet, lagringstid och rättigheter. Gästers e-post visas inte publikt. Åtkomst till koppling mellan e-post och bild begränsas till behörig albumägare/webmaster efter behov. Definiera retention/radering före skarp lansering.

## Kvot och fulla album
- Standard gratis: 10 bilder. Servern är auktoritativ för limit/used/remaining, öppet tidsfönster och samtidiga uppladdningar. Räkna inte enbart klientens bilder.
- När fullt: Ta foto och Lägg till bilder ser spärrade ut men är tryckbara för att visa varför uppladdning inte går. Försöket ska kunna registreras utan att bildfil skickas.
- Avisering direkt när albumet blir fullt; därefter när fem nya *giltiga* blockerade uppladdningsförsök registrerats ELLER efter en timme om minst ett nytt försök finns. Tak: tre uppföljande mejl under ett 24-timmarsalbum. Undvik dubbelutskick, automatiserad spam och räkning av upprepade tryck från samma session.
- Albumägaren ser antal stoppade försök och återstående uppladdningstid; gäster får ingen köpdialog. Uppgraderingar får aldrig tyst förlänga tidsfönster.
- Skilj på full bildkvot och stängt tidsfönster. Utgången uppladdningstid stoppar uppladdning oavsett lediga bildplatser.
- Notisinställningar i Webmaster: tröskel 5, intervall 60 min, tak 3, samt albumägarens val om e-postavisering. Dessa värden ska vara serverstyrda, behörighetskontrollerade och versions-/ändringsloggade.

## Teknisk isolering
- Separat utvecklingsgren, separat modul/namespace, testalbum och testdata. Ingen förändring av liveflöden före uttryckligt godkännande.
- Feature flags: OFF, TEST (endast behöriga testkonton/testalbum), ON. Läs och upprätthåll regler server-side; klientflagga är endast UI. Säker fallback: flaggfel får inte öppna spärrad uppladdning eller skicka mejl.
- Server-side idempotenta händelser, rate limiting, behörighetskontroll och auditlogg för ändringar. Ingen exponering av service-role/API-hemligheter i klienten.
- Vid förhandsgranskning ska oaccepterade bilder ligga i privat lagring; signerade länkar får endast utfärdas till behöriga granskare. Rapportering och blockering kräver abuse-skydd.
- Existerande album och QR-länkar fortsätter fungera enligt tidigare beteende tills respektive funktion uttryckligen aktiveras.

## Leveransordning och verifieringsgrind
A. Inventera faktisk databas, uppladdningsfunktion, bildlistning, behörigheter och deployed kvotlogik. Dokumentera migrations-/rollbackplan innan SQL.
B. Bygg separat settings-/feature-flag-/audit-modul och Webmaster testvy utan kundpåverkan.
C. Bygg ägarens valbara inställningar och verifiera med testalbum, inklusive ändring under aktiv fest.
D. Bygg privat modereringskö och test av att pending aldrig syns i galleri, bildspel eller direktlänk.
E. Bygg kvotstatus, blockerade försök, ägaraviseringar och mail-deduplicering med testtransport; inga riktiga kundmejl innan godkännande.
F. Integrera en funktion i taget med OFF som standard; verifiera testläge, staging, GitHub release/deploy, iPhone och återställning. Inga oavsiktliga ändringar i 0.1.75-gester.

Öppet att besluta: exakta paketgränser/priser, gratisalbumets bildretention, e-postretention, regler för moderering efter att en bild redan publicerats, och betalflöde. Dessa är INTE implementerade.

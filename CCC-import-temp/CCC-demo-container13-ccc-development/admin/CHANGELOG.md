# Ändringslogg

## Version 6.10.53

- Gör adminpanelen användbar i smala datorfönster utan horisontell rullning.
- Komprimerar sidomenyn mellan 901 och 1150 pixlar.
- Låter breda kort, formulär och knappgrupper brytas till fler rader.
- Anpassar samtliga adminsektioner som delade samma layoutproblem.

## Version 6.10.52

- Synkroniserar adminpanelens versionsfil, synliga versionsnummer och PWA-cache.
- Tar bort brutna kopior av publika sidor som inte används av adminpanelen.
- Tar bort felaktiga 1-byte-filer och tomma adminresursmappar.

## Version 6.10.7

- Versionsmärker adminpanelens HTML-, PWA- och service worker-laddning.
- Tvingar service workern att söka efter uppdateringar utan mellanliggande cache.
- Hämtar adminpanelens navigationer med `no-store`.
- Laddar om adminpanelen en gång när en ny service worker tar över.
- Skickar inloggade administratörer till den versionsmärkta paneladressen.
- Säkerställer att den nya sessionsbaserade bildoptimeringen och detaljerade feltexten verkligen laddas.

## Version 6.10.6

- Låter bildoptimeringsverktyget vara avstängt varje gång adminpanelen öppnas.
- Aktiveringen gäller endast den aktuella sessionen och sparas inte som webbplatsinställning.
- Hämtar äldre bilder direkt från Firebase Storage via deras lagringssökväg.
- Använder den publika bildlänken som reserv om Storage-hämtningen misslyckas.
- Visar den faktiska felorsaken när en bild inte kan hämtas, konverteras, laddas upp eller uppdateras.
- Behåller tidigare säkerhetskontroller mot dubbeloptimering och felaktig originalradering.
- Uppdaterar adminpanelens cache och synliga versionsnummer.

## Version 6.10.5

- Visar om varje optimerad bild fortfarande har ett original sparat.
- Lägger till knappen Ta bort sparat original på varje berörd bild.
- Lägger till Ta bort alla verifierade original för samlad städning.
- Hämtar aktuell bildpost från servern och verifierar WebP-bilden före varje radering.
- Raderar aldrig ett original om WebP-bilden inte kan verifieras.
- Tar bort originalreferensen först efter att lagringsfilen har raderats.
- Behåller ett tydligt resultatmeddelande efter att bildlistan har uppdaterats.
- Uppdaterar adminpanelens cache och synliga versionsnummer.

## Version 6.10.4

- Tvingar bildanalysen att läsa aktuella bildposter direkt från servern.
- Känner igen redan optimerade bilder genom format, tidsmarkering, originalreferens, filändelse och lagringssökväg.
- Kontrollerar varje vald bild mot servern igen omedelbart före konverteringen.
- Hoppar säkert över bilder som redan har optimerats även om en gammal analyslista ligger kvar.
- Förhindrar att den första originalreferensen skrivs över vid en senare körning.
- Visar hur många redan optimerade bilder som säkerhetsspärren hoppade över.
- Uppdaterar adminpanelens cache och synliga versionsnummer.

## Version 6.10.3

- Visar en komplett bildinventering med miniatyrer innan någon optimering startas.
- Delar upp resultatet i Nyinkommet, Butiken, egen logotyp och egen startanimationsbild.
- Visar om varje bild redan är WebP eller kan optimeras.
- Lägger till en separat kryssruta för varje bild som kan optimeras.
- Markerar äldre bilder som standard men låter administratören välja exakt vilka som ska bearbetas.
- Låser konverteringsknappen tills analysen är klar och minst en bild har valts.
- Uppdaterar även logotypens och startanimationens inställningar efter lyckad konvertering.
- Behåller valet att spara eller radera originalbilderna.
- Uppdaterar adminpanelens cache och synliga versionsnummer.

## Version 6.10.2

- Lägger till ett val under Inställningar som visar eller döljer verktyget för äldre bilder.
- Analyserar hur många äldre Nyinkommet- och Butiken-bilder som kan optimeras.
- Konverterar bilderna en i taget till WebP och verifierar varje ny bild före uppdatering.
- Behåller bildens titel, datum och övriga information.
- Lägger till ett separat val för att behålla eller radera originalbilderna.
- Behåller original som standard och raderar dem endast efter lyckad verifiering när användaren uttryckligen valt det.
- Visar löpande förlopp och sammanfattar lyckade, misslyckade och ej raderade original.
- Uppdaterar adminpanelens cache och synliga versionsnummer.

## Version 6.10.1

- Skalar automatiskt ned nya Nyinkommet- och Butiken-bilder till högst 1600 pixlar.
- Konverterar nya uppladdningar till WebP med 84 procents kvalitet.
- Sparar korrekt filändelse och innehållstyp för WebP-filer.
- Behåller stöd för befintliga JPEG-, PNG- och WebP-bilder.
- Använder samma optimering för egna startanimationsbilder.
- Uppdaterar adminpanelens cache och synliga versionsnummer.

## Version 6.10.0

- Ny mobilanpassad Om oss-sida.
- Länkar till HT-reportaget och Instagram-filmen.
- Om oss tillagd i navigation, statistik och offline-cache.
- Tre redigerbara textalternativ, förhandsgranskning samt visa/dölj i adminpanelen.

## Version 6.9.2

- Tar bort den oanvända filen `admin/style.css`.
- Rensar duplicerad kamera- och inställnings-CSS i adminpanelen.
- Behåller samma desktop- och mobilvärden efter städningen.

## Version 6.9.1

- Minskar det stora mellanrummet mellan Kontakt-rubriken och kontaktkortet.
- Begränsar ändringen till Kontaktsidan på dator och mobil.

## Version 6.9.0

- Tar bort gamla arkiv, frikopplad kod och oanvända exempelbilder.
- Ersätter de stora Gatuvy-PNG-filerna med optimerade WebP-bilder.
- Minskar projektets storlek från cirka 40 MB till cirka 2,5 MB.
- Uppdaterar dokumentation, panelversion och cacheversioner.

## Version 6.8.2

- Gör dashboardens inställningssida mer kompakt på dator.
- Visar butiksuppgifterna i fyra kolumner på breda skärmar.
- Minskar fälthöjd, mellanrum och utfyllnad utan att påverka mobilläget.

## Version 6.8.1

- Minskar det stora mellanrummet före adresskortet på Hitta hit.
- Gör dashboardens statistikkort, fotoknapp och informationspaneler mer kompakta.
- Behåller mobilens tydliga knapp- och textstorlekar.

## Version 6.8.0

- Lägger till hantering av flera Spotify-spellistor i dashboardens Inställningar.
- Gör det möjligt att lägga till, välja, provöppna och ta bort spellistor.
- Visar tydligt vilken spellista som är aktiv.
- Lägger till ett val för att visa eller dölja Spotifyikonen.
- Kopplar footerns Spotifyikon automatiskt till den aktiva spellistan.

## Version 6.7.10

- Tar bort den synliga rubriken ”Tema” i footern.
- Minskar footerns övre utfyllnad och avståndet före sociala medier-ikonerna.
- Behåller den kompakta temaväljaren och dess hoverbeskrivningar.

## Version 6.7.9

- Tar bort den dubblerade butiks- och ortsraden över footerns ikoner.
- Visar Spotify utan efterföljande text.
- Gör temaväljaren mindre med tre symbolknappar.
- Lägger till hoverbeskrivningar och tillgängliga etiketter för temavalet.

## Version 6.7.8

- Jämnar ut tidsfälten och visar originaltiden under samtliga fält.
- Behåller originalvärdena synliga även när tiderna har ändrats.
- Flyttar den valda bakgrundsbilden högst upp i bildsektionen.
- Märker Second Hand-bilden tydligt som förvald och placerar bildbytet under förhandsbilden.

## Version 6.7.7

- Rättar förvalet när Firestore innehåller en gammal inaktiv animationsbild.
- Second Hand-bilden väljs nu när den aktiva animationen inte redan är en bildanimation.
- Behåller en uttryckligen aktiverad egen bild oförändrad.

## Version 6.7.6

- Lägger till valbar paus mellan guldstjärnans krympning och stjärnöppningen.
- Pausen är 0 sekunder som standard och kan ställas mellan 0 och 5 sekunder.
- Visar pausinställningen både i adminpanelen och på förhandsvisningssidan.
- Aktivering från förhandsvisningen sparar även den testade paustiden.

## Version 6.7.5

- Visar korrekt panelversion i adminpanelen.
- Uppdaterar webbplatsens och adminpanelens cacheversion.
- Säkerställer att den inbyggda responsiva Second Hand-bilden visas som förval.

## Version 6.7.4

- Lägger in en särskild Second Hand-bakgrund för dator och en för mobil.
- Väljer automatiskt rätt bild efter skärmens format.
- Använder Second Hand-bakgrunden som förvald bild i startanimationen.
- Gör bildanimationen till standard när inga tidigare sparade inställningar finns.
- Behåller möjligheten att ladda upp och aktivera en egen bakgrundsbild.

## Version 6.7.3

- Gör patinalogotypen tydligare sliten med fler repor, färgskav och oregelbundna märken.
- Behåller tryckerilogotypens gula färg, mörka kontur och läsbara bokstavsformer.
- Ger hela logotypen transparent bakgrund och jämna marginaler.
- Säkerställer att varken vänstra C:et eller högra 3:an kapas.

## Version 6.7.2

- Tar bort den gamla logotypens negativa marginal på dator.
- Anpassar startsidan och samtliga undersidor till den tätt beskurna tryckerilogotypen.
- Hindrar sidrubriken från att hamna ovanpå logotypen.
- Ger logotypen ett normalt, jämnt mellanrum före rubriken.

## Version 6.7.1

- Kopplar webbplatsens logotyp till adminpanelens inställningar.
- Lägger till valen Patina, Ren tryckerilogotyp, Tidigare logotyp och Egen uppladdad.
- Använder samma aktiva logotyp på startsidan, undersidorna och animationsförhandsvisningen.
- Laddar upp egna logotyper till Firebase Storage utan att skriva över de inbyggda filerna.
- Känner igen en tidigare uppladdad logotyp som sparats med äldre fältnamn.
- Använder Patina som standard när inget tidigare logotypval finns.

## Version 6.7.0

- Lägger till besökarstyrt ljust, mörkt och automatiskt tema.
- Sparar besökarens temaval lokalt och använder det direkt vid nästa besök.
- Anpassar header, informationsrad, innehållskort, öppettider, galleri och footer till mörkt tema.
- Lägger till Container 13:s Spotify-spellista i footern.
- Byter till en ny högupplöst logotyp från tryckeriets vektororiginal.
- Ger webb-logotypen en försiktig patina och mörk kontur.
- Behåller både den rena tryckeriversionen och den tidigare logotypen som reserv.

## Version 6.6.8

- Reserverar headerns och informationsradens höjd innan innehållet har laddats.
- Låter hela den gemensamma headern stanna kvar vid skrollning.
- Visar senast sparad öppettidsstatus direkt och uppdaterar Firestore i bakgrunden.
- Laddar statusraden parallellt med webbplatsens övriga inställningar.
- Motverkar att sidans innehåll skjuts ned när öppettider och nyinkommet-notis visas.

## Version 6.6.7

- Komprimerar Startanimationens panel ytterligare för att rymmas på en vanlig PC-skärm.
- Kortar alternativkorten och minskar sektionernas mellanrum.
- Gör färg- och tidsfälten försiktigt lägre.
- Behåller textstorlek, funktioner och tydliga klickytor.

## Version 6.6.6

- Gör Startanimationens huvudinnehåll ungefär 10–15 procent kompaktare.
- Minskar alternativkortens höjd och inre marginaler.
- Minskar mellanrummen mellan färg-, hastighets- och bildsektionerna.
- Behåller samma textstorlek, funktioner och tydliga klickytor.

## Version 6.6.5

- Ger Bakgrundsbild och Bildanpassning samma visuella höjd.
- Samlar Spara kopia på mobilen och Snabbfotoläge i samma kamerablock.
- Visar kameravalen i två jämna kolumner på dator och staplade på mobil.
- Gör öppettidsrader och tidsfält försiktigt mer kompakta.

## Version 6.6.4

- Lägger till Aktivera på hemsidan direkt på förhandsvisningssidan.
- Skickar de testade tiderna tillbaka till den inloggade adminpanelen.
- Adminpanelen aktiverar sedan hela animationen, inklusive eventuell uppladdad bild.
- Visar bekräftelse eller fel direkt på förhandsvisningen.
- Skyddar aktiveringen med en unik engångskod för varje öppnad förhandsvisning.

## Version 6.6.3

- Lägger till redigerbara tider direkt på förhandsvisningssidan.
- Testaren kan ändra krymptid eller väntetid och stjärnöppningens tid.
- Kör testet igen använder de nya testvärdena omedelbart.
- Återställ tider återgår till värdena som skickades från adminpanelen.
- Testvärdena sparas eller aktiveras inte automatiskt.

## Version 6.6.2

- Förfinar bildanimationen till en sammanhängande tvåstegseffekt.
- En stor guldstjärna täcker först skärmen och krymper över bakgrundsbilden.
- När guldstjärnan försvunnit öppnas bilden med en växande genomskinlig stjärna.
- Hemsidan visas under öppningen och bilden försvinner.
- Stjärnfärgen kan även väljas för bildalternativet.

## Version 6.6.1

- Rätar upp färg-, tids- och bildfälten i separata jämna sektioner.
- Ersätter animationsrullistan på huvudsidan med fyra tydliga alternativkort.
- Flyttar aktiv status högst upp.
- Förbättrar bilduppladdningen med en större valyta.
- Förfinar knappordning och mobilanpassning utan att ändra animationsfunktionen.

## Version 6.6.0

- Ger Startanimation en egen flik i dashboarden.
- Lägger till fyra val: klassisk, krympande guldstjärna, bakgrundsbild och ingen animation.
- Låter administratören ladda upp en komprimerad bakgrundsbild.
- Erbjuder bildlägena Fyll skärmen och Visa hela bilden.
- Visar uppladdad bild och stödjer förhandsgranskning innan aktivering.
- Behåller reservfärg om bilden inte kan laddas.
- Förenklar valet under vanliga Inställningar.

## Version 6.5.4

- Visar separat vilken animation som är aktiv på hemsidan.
- Visar när formuläret innehåller ett val som ännu inte är aktiverat.
- Lägger till en egen knapp för att aktivera animationen direkt i animationssektionen.
- Aktiveringsknappen sparar endast animationens val, färger och tider.

## Version 6.5.3

- Markerar de utprovade originaltiderna med guldram och tydlig text.
- Tar bort markeringen direkt när tiden ändras.
- Lägger till knappen Återställ utprovade tider för 0,5 s + 1,0 s.

## Version 6.5.2

- Byter förhandsvisningens SVG-ritning mot stabil canvas-ritning.
- Rättar felet där knappen Kör testet igen inte visade någon animation i Chrome.

## Version 6.5.1

- Lägger till knappen Förhandsgranska animation i adminpanelen.
- Öppnar en mobilvänlig testsida med formulärets aktuella, även osparade, värden.
- Förhandsgranskningen sparar ingenting och påverkar inte den aktiva hemsidan.
- Animationen kan köras igen direkt på testsidan.

## Version 6.5.0

- Lägger till val av startanimation i adminpanelen.
- Erbjuder Klassisk stjärnöppning, Krympande guldstjärna och Ingen animation.
- Låter administratören välja bakgrundsfärg och stjärnfärg.
- Låter administratören ändra inledande tid och stjärnöppningens tid.
- Hämtar animationsinställningarna tidigt från Firestore på startsidan.

## Version 6.4.2

- Byter mobilens SVG-mask mot en stabil SVG-bana med `evenodd`.
- Visar svart skärm i 0,5 sekunder.
- Öppnar stjärnan på 1 sekund med jämnare rörelse.
- Behåller den fungerande canvas-animationen på dator.

## Version 6.4.1

- Byter till en JavaScript-styrd SVG-mask för stabilare stjärnöppning.
- Tar bort den osäkra kontrollen av föregående webbadress.
- Låter Hem-länkarna markera att stjärnan inte ska visas.
- Lägger till testadressen `?star=1`, som alltid visar animationen.
- Uppdaterar cacheversionen för den gemensamma layoutfilen.

## Version 6.4.0

- Lägger till en helsvart stjärnöppning på startsidan.
- Webbplatsen avslöjas genom en växande femuddig stjärna.
- Animationen visas bara vid första öppningen i den aktuella fliken.
- Klick på Hem från en annan Container13-sida visar startsidan direkt.
- Besökare som föredrar reducerad rörelse får ingen animation.

## Version 6.3.7

- Lägger loggstorleken direkt i Butiken, Nyinkommet, Kontakt och Hitta hit.
- Gör loggändringen oberoende av en äldre cachad CSS-fil.
- Höjer CSS-cacheversionen på alla publika sidor.

## Version 6.3.6

- Ger Butiken, Nyinkommet, Kontakt och Hitta hit samma stora logotyp som startsidan på dator.
- Minskar det visuella mellanrummet mellan logotypen och rubriken på dator.
- Behåller den godkända mobilstorleken på logotypen.
- Anpassar text och knappar i adminpanelens papperskorg till de kompakta bildkorten.
- Rättar Återställ-knappens gamla minsta bredd så att knapparna inte kapas.
- Uppdaterar CSS-cacheversionen på samtliga publika sidor.

## Version 6.3.5

- Förstorar startsidans logotyp från 560 px till 680 px på dator.
- Mobilstorleken lämnas oförändrad.
- Uppdaterar startsidans CSS-cacheversion.

## Version 6.3.4

- Gör listan med avvikande öppettider kompakt och centrerad.
- Drar ihop avståndet mellan datum och öppettid eller Stängt.
- Uppdaterar kontaktsidans CSS-cacheversion.

## Version 6.3.3

- Förstorar startsidans logotyp från 420 px till 560 px på skärmar från 900 px.
- Mobilstorleken lämnas oförändrad.
- Uppdaterar startsidans CSS-cacheversion så att ändringen syns direkt.

## Version 6.3.2

- Återställer ett tydligt mellanrum mellan ordinarie öppettider och rubriken Avvikande öppettider.
- Uppdaterar cacheversionen på kontaktsidan så att den nya stilen hämtas direkt.

## Version 6.3.1

- Nytt dashboardkort: **Öppnat från hemskärmen**.
- Kortet räknar unika enheter som faktiskt har öppnat Container13 i installerat appläge.
- Bygger vidare på den bekräftat fungerande besöksstatistiken i version 6.3.0.

## Version 6.3.0

- Anonym besöksstatistik på webbplatsens fem publika sidor.
- Unika besökare totalt, idag och senaste 7 dagarna i Dashboard.
- Totala sidvisningar och antal besökare som använt hemskärmsappen.
- Lista över mest besökta sidor.
- Ingen lagring av namn, e-postadress eller exakt position.
- Ny fil med Firestore-regler för statistik.

## Version 6.1.0

- Valbar visningstid för Nyinkommet: 7, 14, 30, valfritt 1–30 dagar eller manuell borttagning.
- Publika sidan och startsidan filtrerar bilder efter vald tid.
- Förhandsgranskning visar hur många bilder som visas respektive döljs.
- Ny kamerainställning som försöker ladda ner en kopia till mobilen efter publicering.
- Standard är 7 dagar och kopia på mobilen är avstängd.

# Version 5.1 – separata hemskärmsikoner

- Kundwebbplatsen heter **Container13** på hemskärmen.
- Adminpanelen heter **C13 Admin** på hemskärmen.
- Kundwebbplats och adminpanel har tydligt olika ikoner.
- Separata manifest, startadresser och PWA-identiteter används.
- Adminikonen har mörk bakgrund och tydlig ADMIN-märkning.

# Ändringslogg

## Version 4.0.0

### Städning och stabilisering

- Utgår från den fungerande version 3.6.1.
- Behåller galleri, Nyinkommet, informationsrad och avvikande öppettider oförändrade.
- Flyttar två äldre JavaScript-filer som inte längre används från den aktiva `js/`-mappen till `backup/legacy-js/`:
  - `bilder.js`
  - `script.js`
- Standardiserar cacheversionen för webbplatsens lokala CSS- och JavaScript-filer till `v=4.0.0`.
- Uppdaterar projektdokumentationen så att den beskriver den faktiska Firebase-baserade lösningen.
- Lägger till en testlista och en tydlig versionsfil.

### Ingen avsiktlig visuell förändring

Version 4.0.0 ska se ut och fungera som den godkända version 3.6.1. Syftet är att skapa en renare och säkrare grund inför kommande funktioner.

## Version 4.1
- Papperskorg för bilder från Nyinkommet och Galleri.
- Återställning och permanent radering.
- Automatisk rensning efter 48 timmar när adminpanelen öppnas.


## Version 4.2
- Dashboard visas som startsida efter inloggning.
- Statistik för Galleri, Nyinkommet och Papperskorg.
- Status för informationsrad och butikens öppet/stängt-läge.
- Nästa avvikande öppettid och snabbknappar till vanliga funktioner.

## Version 4.2.1
- Rättar navigeringen så att Dashboard alltid är klickbar från vänstermenyn.
- Lägger till tangentbordsstöd för Dashboard-knappen.


## Version 4.3
- Klickbar sida för Inställningar i adminpanelen.
- Kontaktuppgifter, sociala länkar och copyright kan ändras utan kod.
- Valbar lagringstid för papperskorgen mellan 1 och 7 dagar.
- Kontakt, Hitta hit och sidfoten hämtar automatiskt sparade uppgifter från Firestore.

## Version 4.3.1
- Rättar navigeringen till Inställningar i adminpanelen.
- Lägger till robust klickhantering och tangentbordsstöd för menyvalet.

## Version 5.0 – Admin som webbapp
- Adminpanelen kan läggas på mobilens hemskärm med egen Container13-ikon.
- Öppnas i fristående app-läge utan vanlig webbläsarram när plattformen stöder det.
- Manifest, Apple-inställningar och service worker har lagts till.
- Grundfiler cachas för snabbare start och enklare återöppning.

## Version 6.1
- Stor kameraknapp direkt på adminpanelens Dashboard.
- Kamera och bildbibliotek kan öppnas direkt från Dashboard.
- Förhandsvisning och möjlighet att ta om bilden före publicering.
- Ta nästa foto, återgå till Dashboard och ångra senaste uppladdningen.
- Ångrad uppladdning flyttas till befintlig papperskorg.
- Valbart snabbfotoläge under Inställningar.
- Dashboard visar dagens antal uppladdningar och den senaste uppladdningen.
- Administrationsappens service worker-cache uppdaterad till v6.

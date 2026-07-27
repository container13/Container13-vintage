# Ändringslogg

## Version 6.10.37 – Säker adminuppdatering

### Vad som har ändrats

- Förhindrar att adminpanelens gamla HTML ligger kvar efter en uppdatering.
- Versionsmärker panel, PWA-fil och service worker.
- Hämtar alltid adminnavigationer utan webbläsarcache.
- Aktiverar och visar version 6.10.36:s nya bildhämtning och detaljerade felrapportering.

### Tekniskt berörda filer

- `admin/index.html`
- `admin/panel.html`
- `admin/pwa.js`
- `admin/sw.js`
- `admin/CHANGELOG.md`
- `admin/VERSION.txt`

## Version 6.10.36 – Robust bildhämtning och tydliga fel

### Vad som har ändrats

- Bildoptimeringsverktyget är alltid avstängt när adminpanelen öppnas.
- Verktyget aktiveras endast tillfälligt för den aktuella sessionen.
- Äldre bilder hämtas i första hand direkt från Firebase Storage.
- Den befintliga bildlänken används som reserv.
- Det exakta felet visas om en bild inte kan optimeras.

### Tekniskt berörda filer

- `admin/panel.html`
- `admin/sw.js`
- `admin/CHANGELOG.md`
- `admin/VERSION.txt`

## Version 6.10.35 – Radera sparade original

### Vad som har ändrats

- Visar vilka optimerade bilder som har ett original kvar som säkerhetskopia.
- Låter administratören ta bort originalet för en enskild bild.
- Lägger till ett val för att ta bort alla verifierade original.
- Verifierar alltid den aktiva WebP-bilden omedelbart före radering.
- Behåller WebP-bilden, titel, datum och övrig information.
- Visar ett bestående resultat efter städningen.

### Tekniskt berörda filer

- `admin/panel.html`
- `admin/sw.js`
- `admin/CHANGELOG.md`
- `admin/VERSION.txt`

## Version 6.10.34 – Skydd mot dubbel bildoptimering

### Vad som har ändrats

- Hämtar alltid en färsk bildinventering direkt från Firestore-servern.
- Identifierar tidigare optimering genom flera oberoende markeringar.
- Gör en extra serverkontroll precis före varje bild konverteras.
- Hoppar över redan optimerade bilder även om verktyget visar en gammal lista.
- Skyddar den ursprungliga säkerhetskopians referens från att skrivas över.

### Tekniskt berörda filer

- `admin/panel.html`
- `admin/sw.js`
- `admin/CHANGELOG.md`
- `admin/VERSION.txt`

## Version 6.10.33 – Visuell bildinventering

### Vad som har ändrats

- Visar samtliga hittade bilder med miniatyr, kategori och optimeringsstatus.
- Inventerar Nyinkommet, Butiken, egen logotyp och egen startanimationsbild.
- Visar både redan optimerade WebP-bilder och äldre bilder.
- Låter administratören välja varje bild separat före konvertering.
- Förhindrar att optimeringen startas innan analysen är klar och minst en bild har valts.
- Behåller det separata valet att spara eller radera originalfiler.

### Tekniskt berörda filer

- `admin/panel.html`
- `admin/sw.js`
- `admin/CHANGELOG.md`
- `admin/VERSION.txt`

## Version 6.10.32 – Verktyg för äldre bilder

### Vad som har ändrats

- Lägger till ett aktiveringsbart optimeringsverktyg under adminpanelens Inställningar.
- Verktyget analyserar och konverterar befintliga Nyinkommet- och Butiken-bilder till WebP.
- Varje ny bild verifieras innan den kopplas till webbplatsen.
- Titel, datum och övriga bilddata behålls.
- Administratören väljer om originalbilderna ska sparas eller raderas.
- Originalen är förvalda att sparas och raderas aldrig innan den nya bilden har verifierats.

### Tekniskt berörda filer

- `admin/panel.html`
- `admin/sw.js`
- `admin/CHANGELOG.md`
- `admin/VERSION.txt`

## Version 6.10.31 – WebP från adminpanelen

### Vad som har ändrats

- Skalar nya bilder från adminpanelen till högst 1600 pixlar.
- Konverterar nya bilder för Nyinkommet och Butiken till WebP med 84 procents kvalitet.
- Använder samma WebP-optimering för egna startanimationsbilder.
- Behåller alla befintliga bilder och full bakåtkompatibilitet med JPEG och PNG.

### Tekniskt berörda filer

- `admin/panel.html`
- `admin/sw.js`
- `admin/CHANGELOG.md`
- `admin/VERSION.txt`

## Version 6.10.30 – Footer utan reserverat tomrum

### Vad som har ändrats

- Tar bort den fasta reserveringen av footerns höjd.
- Footern placeras åter naturligt efter sidans innehåll utan ett förskapat tomrum.
- Behåller övriga laddningsförbättringar från version 6.10.29.
- Uppdaterar CSS- och PWA-cacheversionen.

### Tekniskt berörda filer

- `css/style.css`
- `index.html`
- `galleri.html`
- `nyinkommet.html`
- `omoss.html`
- `kontakt.html`
- `hittahit.html`
- `sw.js`

## Version 6.10.29 – Snabbare laddning på mobil

### Vad som har ändrats

- Tar bort automatiska sidomladdningar vid service worker-uppdatering, återgång från bakgrunden och återställning från webbläsarens sidcache.
- Laddar header och footer parallellt och startar statusraden direkt när headern är klar.
- Delar webbplatsinställningarna mellan statusrad, Nyinkommet, startsida, PWA och övriga sidinställningar så samma Firebase-dokument inte hämtas flera gånger.
- Byter den publika logotypen till en responsivt nedskalad WebP på cirka 68 kB i stället för PNG-filen på cirka 641 kB.
- Reserverar footerns höjd från första renderingen för att minska layoutförflyttningar.
- Uppdaterar PWA-cachen.

### Tekniskt berörda filer

- `pwa.js`
- `sw.js`
- `css/style.css`
- `js/layout.js`
- `js/site-data.js`
- `js/site-settings.js`
- `js/status.js`
- `js/senaste-nytt.js`
- `js/nyinkommet.js`
- `bilder/logotyp/logo-patina.webp`
- `index.html`
- `galleri.html`
- `nyinkommet.html`
- `omoss.html`
- `kontakt.html`
- `hittahit.html`

## Version 6.10.28 – Snabb start utan animation

### Vad som har ändrats

- Sparar den senast hämtade animationsinställningen lokalt i besökarens webbläsare.
- Visar startsidan direkt när det senast kända läget är Ingen animation.
- Begränsar väntan på Firebase till högst 0,9 sekunder när ingen lokal inställning ännu finns.
- Använder Ingen animation som säker reserv om inställningen inte kan hämtas snabbt.
- Hämtar fortfarande en färsk inställning i bakgrunden så senare ändringar slår igenom.
- Behåller en uttrycklig animationstestning med `?star=1`.
- Uppdaterar PWA-cachen.

### Tekniskt berörda filer

- `index.html`
- `sw.js`

## Version 6.10.27 – Samma logotypstorlek på Om oss

### Vad som har ändrats

- Tar bort Om oss-sidans avvikande mobilbredd på 220 pixlar.
- Låter Om oss använda samma gemensamma responsiva logotypstorlek som övriga undersidor på mobil.
- Behåller Om oss-sidans övriga mobilanpassning och mellanrum.

### Tekniskt berörda filer

- `css/style.css`
- `omoss.html`

## Version 6.10.26 – Samma introduktionsstorlek

### Vad som har ändrats

- Ger texten direkt under H1 på Butiken, Nyinkommet, Om oss, Kontakt och Hitta hit exakt samma responsiva storlek som texten under logotypen på startsidan.
- Anpassningen gäller både mobil och dator.
- Behåller samtliga H1-rubriker och övrig sidtext oförändrade.
- Uppdaterar CSS-cacheversionen på alla publika sidor.

### Tekniskt berörda filer

- `css/style.css`
- `index.html`
- `galleri.html`
- `nyinkommet.html`
- `omoss.html`
- `kontakt.html`
- `hittahit.html`

## Version 6.10.25 – Rubriker och introduktionstexter

### Vad som har ändrats

- Tar bort den dubblerade H1-rubriken ”Container 13 Vintage” från startsidan.
- Förstorar introduktionstexten direkt under startsidans logotyp.
- Behåller H1-rubrikerna på Butiken, Nyinkommet, Om oss, Kontakt och Hitta hit.
- Förstorar texten direkt under H1 på undersidorna i datorläge.
- Lämnar undersidornas textstorlek på mobil oförändrad.
- Behåller version 6.10.24:s rättning av Nyinkommet-notisen i den gemensamma headern.

### Tekniskt berörda filer

- `index.html`
- `galleri.html`
- `nyinkommet.html`
- `omoss.html`
- `kontakt.html`
- `hittahit.html`
- `css/style.css`

## Version 6.10.24 – Nyinkommet tillbaka i headern

### Vad som har ändrats

- Återställer den automatiska Nyinkommet-notisen i den gemensamma, fixerade headern på alla publika sidor.
- Låter notisen följa samma visningstid som Nyinkommet-sidan: 7, 14, 30, valfritt antal dagar eller tills manuell borttagning.
- Tar bort den separata hårdkodade 48-timmarsgränsen som gjorde att fyra fortfarande aktiva plagg försvann ur headern.
- Behåller öppet-/stängtstatusen och den manuella informationsraden oförändrade.
- Uppdaterar cacheversionen på samtliga sex publika sidor.

### Tekniskt berörda filer

- `js/status.js`
- `js/layout.js`
- `index.html`
- `galleri.html`
- `nyinkommet.html`
- `omoss.html`
- `kontakt.html`
- `hittahit.html`

## Version 6.10.23 – Återställning av startanimationen

### Vad som har ändrats

- Återställer webbplatsens PWA- och animationsfiler till det fungerande läget i version 6.10.13.
- Tar bort försöken att spela startanimationen varje gång den installerade webbappen öppnas eller återupptas.
- Tar bort aktivitetsmätningen, tidsgränsen och omdirigeringen till startsidan efter att appen varit i bakgrunden.
- Återställer startadressen till webbplatsens vanliga startsida utan särskilda PWA-parametrar.
- Återställer startskärmens ursprungliga ljusbeige färg.
- Startanimationen visas åter endast första gången i den aktuella webbläsarfliken eller sessionen, samt när den uttryckligen testas med `?star=1`.
- Behåller alla förbättringar som var färdiga till och med version 6.10.13, inklusive mobilheadern och Googlekartans mobilstorlek.
- Uppdaterar webbplatsens cache så att återställningen hämtas på besökarnas enheter.

### Tekniskt berörda filer

- `index.html`
- `manifest.webmanifest`
- `pwa.js`
- `sw.js`
- `js/layout.js`
- `galleri.html`
- `hittahit.html`
- `kontakt.html`
- `nyinkommet.html`
- `omoss.html`

## Version 6.10.22 – Startfärg anpassad efter animation

### Vad som har ändrats

- Begränsar den gula appstarten till animationslägena Bild/patina och Guldstjärna.
- Låter Klassisk stjärnöppning behålla sin svarta start så att den inte blinkar mellan gult och svart.
- Sparar senast hämtade animationsläge lokalt så att rätt startfärg kan visas omedelbart vid nästa appstart.
- Tar bort det gula startlagret när Ingen animation är valt.
- Kontrollerar det aktuella animationsläget mot webbplatsens inställningar innan den riktiga animationen startar.
- Uppdaterar webbplatsens cache för den villkorade startfärgen.

### Tekniskt berörda filer

- `index.html`
- `sw.js`

## Version 6.10.21 – Gul appstart före animationen

### Vad som har ändrats

- Byter webbappens startfärg från ljusbeige till samma guldfärg som används i stjärnanimationen.
- Visar ett omedelbart guldfärgat täcklager medan iPhone startar webbappen och animationen förbereds.
- Låter täcklagret övergå direkt till animationens helgula första bildruta utan ett svart mellanläge.
- Behåller resten av animationen oförändrad: den gula stjärnan krymper och visar loggan och patinan innan startsidan öppnas.
- Uppdaterar webbplatsens cache så att den nya startfärgen hämtas.

### Tekniskt berörda filer

- `index.html`
- `manifest.webmanifest`
- `sw.js`

## Version 6.10.20 – Svart täcklager före första animationsbilden

### Vad som har ändrats

- Visar ett separat svart täcklager omedelbart när startanimationen aktiveras.
- Behåller täcklagret medan inställningar och animationsbild laddas.
- Tar bort täcklagret först när stjärnanimationens första riktiga bildruta är färdigritad.
- Förhindrar därmed att startsidan hinner synas före animationen på mobilen.
- Tar bort täcklagret säkert även om animationen avslutas via reservfunktionen.
- Uppdaterar webbplatsens cache för det nya startlagret.

### Tekniskt berörda filer

- `index.html`
- `sw.js`

## Version 6.10.19 – Synlig mobilanimation efter appstart

### Vad som har ändrats

- Förbereder startanimationens inställningar och bild innan rörelsen börjar.
- Väntar på att webappen verkligen är synlig på mobilen.
- Väntar ytterligare två renderade bildrutor och en kort säkerhetsmarginal innan stjärnöppningen startar.
- Förhindrar därmed att iPhone spelar animationen bakom sin egen startbild så att besökaren bara ser svart och sedan startsidan.
- Lämnar datorns animationsstart oförändrad.
- Uppdaterar webbplatsens cache för den nya mobilstarten.

### Tekniskt berörda filer

- `index.html`
- `sw.js`

## Version 6.10.18 – Aktivitetsmätning och borttagen dubbelanimation

### Vad som har ändrats

- Ersätter beroendet av iOS stängningssignaler med en löpande aktivitetsmätning varannan sekund.
- Upptäcker att webappen varit inaktiv minst 10 sekunder även när iPhone endast fryser den öppna sidan.
- Skickar en återupptagen webapp till startsidan och spelar startanimationen.
- Visar animationen direkt när en ny eller återställd fristående webapp laddar startsidan.
- Märker automatiska omladdningar efter en service worker-uppdatering så att animationen inte kan spelas två gånger.
- Tar bort reservomladdningen av aktuell sida i den installerade webappen, vilken tidigare syntes utan att animationen startade.
- Versionsmärker den nya PWA-koden på samtliga publika sidor och uppdaterar cachen.

### Tekniskt berörda filer

- `pwa.js`
- `index.html`
- `sw.js`
- De övriga fem publika HTML-sidorna.

## Version 6.10.17 – Stabil återupptagning på iPhone

### Vad som har ändrats

- Flyttar kontrollen för återupptagning utanför service worker-registreringen så att den kan köras även när iOS fryser webappen.
- Sparar tidpunkten då webappen lämnas beständigt i mobilen i stället för enbart i sidans tillfälliga minne.
- Kontrollerar återkomsten via synlighet, fokus och iOS sidåterställning för bättre tillförlitlighet.
- Leder till startsidan och spelar startanimationen när webappen återkommer efter minst 10 sekunder.
- Behåller kortare appväxlingar utan animation.
- Versionsmärker `pwa.js` på samtliga publika sidor och uppdaterar cachen så att den nya koden verkligen hämtas.

### Tekniskt berörda filer

- `pwa.js`
- `sw.js`
- De sex publika HTML-sidorna.

## Version 6.10.16 – Animation även vid omladdning

### Vad som har ändrats

- Visar startanimationen när startsidan laddas om på dator eller mobil.
- Täcker därmed även fallet där besökaren skriver `container13.se` i adressfältet trots att startsidan redan är öppen.
- Behåller interna Hem-klick samt bakåt- och framåtnavigering utan ny animation.
- Respekterar fortsatt besökarens inställning för minskad rörelse.
- Uppdaterar webbplatsens cache så att det nya beteendet hämtas.

### Tekniskt berörda filer

- `index.html`
- `sw.js`

## Version 6.10.15 – Animation när webappen återupptas

### Vad som har ändrats

- Upptäcker när den installerade webappen återkommer från mobilens bakgrund.
- Har appen varit i bakgrunden minst 10 sekunder öppnas startsidan och startanimationen spelas.
- Kortare växlingar mellan appar lämnas orörda så att animationen inte blir påträngande.
- Vanliga webbläsarbesök påverkas inte av återupptagningsfunktionen.
- Uppdaterar webappens cache så att den nya startlogiken hämtas på mobilen.

### Tekniskt berörda filer

- `pwa.js`
- `sw.js`

## Version 6.10.14 – Startanimation vid entré och appstart

### Vad som har ändrats

- Visar den befintliga startanimationen när någon öppnar `container13.se` direkt eller kommer från en annan webbplats.
- Visar alltid animationen när den installerade webappen startas från sin ikon och leder därefter till startsidan.
- Undviker att spela animationen igen när besökaren klickar på Hem inne på webbplatsen.
- Undviker onödiga omspelningar vid vanlig omladdning samt navigering med bakåt- och framåtknapparna.
- Behåller besökarens inställning för minskad rörelse, även vid appstart. Endast en uttryckligen framtvingad förhandsvisning kan åsidosätta den.
- Uppdaterar webappens startadress och cacheversion så att mobiler hämtar det nya beteendet.

### Tekniskt berörda filer

- `index.html`
- `js/layout.js`
- `manifest.webmanifest`
- `sw.js`
- De övriga fem publika HTML-sidorna, där versionsnumret för `layout.js` har uppdaterats.

## Version 6.10.13 – Googlekartan anpassad för mobil

### Vad som har ändrats

- Ger Googlekartan samma breda proportioner som Gatuvyn på mobil.
- Tar bort kartans tidigare fasta mobilhöjd, som gjorde kartan onödigt hög och smal.
- Behåller kartans nuvarande storlek och utseende på dator.
- Rundar kartans hörn på mobilen så att den följer Gatuvyns form.

### Tekniskt berörda filer

- `hittahit.html`
- `css/style.css`

## Version 6.10.12 – Samtliga mobillänkar på en rad

### Vad som har ändrats

- Samlar mobilens samtliga navigeringslänkar på en enda kompakt rad.
- Ersätter ordet ”Hem” med en tydlig husikon.
- Visar de kortare mobilnamnen ”Butik”, ”Nytt” och ”Hitta”.
- Behåller ”Om oss” och ”Kontakt” som text för att länkarna ska vara lätta att förstå.
- Fördelar länkarna automatiskt över hela skärmbredden. Om ”Om oss” döljs i adminpanelen fördelas de fem återstående länkarna jämnt utan tomrum.
- Tar bort den stora bakgrundsplattan från den aktiva länken och använder endast guldtext med en diskret linje.
- Behåller de fullständiga länktexterna i datorversionen.
- Headern med navigering, öppettidsstatus och Nyinkommet-notis ligger fortsatt kvar vid scrollning.

### Tekniskt berörda filer

- `includes/header.html`
- `css/style.css`
- De sex publika HTML-sidorna, där CSS-versionen har uppdaterats för säker omladdning på mobilen.

## Version 6.10.11 – Synliga mobillänkar och sammanhållen status

### Vad som har ändrats

- Tar bort den fällbara mobilmenyn och raden med texten ”Container 13”.
- Visar åter alla sex sidlänkar direkt i mobilheadern.
- Fördelar länkarna jämnt i tre kolumner och två rader så att ingen länk hamnar ensam.
- Behåller öppettidsstatus, informationsmeddelanden och Nyinkommet-notisen i samma fasta statusdel.
- Hela headern, inklusive länkar och statusinformation, ligger kvar högst upp när besökaren scrollar.
- Datorversionens utseende och navigering är oförändrade.

### Tekniskt berörda filer

- `includes/header.html`
- `js/layout.js`
- `css/style.css`
- De sex publika HTML-sidorna, där resursversionen har uppdaterats för säker omladdning även på mobilen.

## Version 6.10.10 – Kompakt header och mobilmeny

### Vad som har ändrats

- Mobilens långa navigeringsrad har ersatts med en kompakt rad med namnet Container 13 och en tydlig menyknapp.
- Menyknappen öppnar sidlänkarna i två jämna kolumner, visar vilken sida som är aktiv och kan stängas med knappen, en sidlänk eller Escape.
- Öppettiden ligger kvar i den fasta headern så att butikens aktuella status alltid är synlig.
- Information och notisen om nya plagg ligger nu under den fasta headern och scrollar med sidans innehåll. Därmed tar headern betydligt mindre plats på mobilen.
- Datorversionens vanliga navigeringslänkar och samtliga befintliga destinationer är oförändrade.
- Mobilmenyn har anpassats till både ljust och mörkt tema samt fått tillgängliga etiketter och tydlig tangentbordsfokus.

### Tekniskt berörda filer

- `includes/header.html`
- `js/layout.js`
- `css/style.css`
- De sex publika HTML-sidorna, där versionsnumret för de gemensamma resurserna har uppdaterats.

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

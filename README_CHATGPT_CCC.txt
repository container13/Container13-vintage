==================================================
VIKTIGASTE REGELN
==================================================

Mycket snack och lite verkstad vill vi inte ha.

- Prioritera att lösa uppgiften framför långa förklaringar.
- Undvik upprepningar.
- Beskriv planen kort och genomför sedan arbetet.
- Resonera bara så mycket som behövs.
- Leverera resultat.


==================================================
LEVERANSKONTROLL
==================================================

En leverans är inte klar förrän innehållet är kontrollerat.

- Det som utlovats ska faktiskt finnas med.
- Alla ändrade filer ska finnas i ZIP:en med endast ändrade filer.
- Komplett ZIP ska innehålla samma ändringar.
- Filstruktur och sökvägar ska vara korrekta.
- Versionsnummer och cachebrytning ska uppdateras när det behövs.

Kontrollera först. Leverera sedan.

==================================================
LEVERANSSTANDARD
==================================================

- Leverera normalt en komplett projekt-ZIP och en ZIP med endast ändrade filer.
- ZIP:en med ändrade filer ska spegla projektets mappstruktur.
- Varje levererad mapp ska även innehålla README_FOLDER.txt för enklare filöverföring.


CCC arbetsinstruktioner

Senaste beslut:
- Mobil först, touch först.
- C13-admin är funktionell referens.
- Läs ccc-core före större ändringar.
- Inga bilder/mockups om inte användaren uttryckligen ber om det.
- Prioritera arbete och resultat framför långa genomgångar.
- Inspektera före leverans.

Auth UX:
- Lösenord ska inte visas automatiskt vid autofyll.
- Enter ska kunna logga in.
- Logout-menyer får inte överlappa dialoger.
- Mobilmenyer ska ha stora touchytor.

Dashboard/designbeslut 2026-08-05:
- Mobilversionen är huvudprodukten; desktop får använda större yta.
- Högst tre primära val per vy.
- Små dagliga vyer byts inom dashboarden; större arbetsflöden kan vara egna sidor.
- Permanent CCC-header på alla framtida vyer: CCC med gloria som hemknapp, direkt temaväxling och användarknapp.
- Startvyn prioriterar Lägg till bilder, Publicera och Mer.
- Dashboardens grundvy ska normalt rymmas utan sidscroll på mobil; innehållsrika moduler får egen paginering eller kontrollerad scroll.

Dashboard/designbeslut 2026-08-05 – komplettering:
- Mobilens dashboard ska vara låst i höjd och inte kunna dras upp eller ned när innehållet ryms.
- Text och tryckytor i mobilens primära kort ska vara tydligt stora.
- På stor skärm ska CCC-loggan vara stor och centrerad; tema och användare ska ligga längst ut till höger.
- Desktopkorten får använda betydligt mer yta och större innehåll än mobilkorten.

Dashboard/arbetsflödesbeslut 2026-08-05:
- Lägg till bilder samlar både kamera, album och filval i samma vy.
- Bilder ska först hamna i en framtida Inkorg/utkast och inte publiceras automatiskt.
- Publicera ska senare låta användaren välja bilder, text och anslutna publiceringskanaler.
- Anslutning av webbplats, Instagram, Facebook, Google Företagsprofil och andra kanaler hör hemma under Inställningar.

Dashboard/arbetsflödesbeslut 2026-08-05 – Bilder:
- Benämningen ska vara "Bilder", inte Inkorg eller Album, eftersom den ska förstås direkt utan fackord.
- Flödet är Lägg till bilder → Bilder → Publicera.
- Bilder-vyn visar antal bilder, markering, Markera alla och Publicera.
- Tryck på en bild öppnar en enkel detaljvy med titel, märke, storlek, pris och beskrivning.
- Enkelhet och omedelbar begriplighet prioriteras framför intern systemterminologi.

Dashboard/arbetsflödesbeslut 2026-08-06 – kamera:
- Kameraflödet ska återanvända fungerande idéer från C13-admin.
- Efter ett foto ska användaren kunna välja Ta nästa foto eller Klar.
- Snabbfotoläge och Spara kopia på mobilen ska inte ligga i vyn Lägg till bilder; sådana val hör hemma under Inställningar.
- Bilder från CCC ska alltid hamna i Mina bilder och aldrig publiceras automatiskt.
- Benämningen i flödet är Mina bilder.
- Kamerafunktionen ska följa fungerande C13-admin-flöde. Spara kopia på mobilen är avstängt som standard och aktiveras endast uttryckligen av användaren.


Dashboard/arbetsflödesbeslut 2026-08-06 – Lokal arbetsyta:
- Mina bilder är en lokal arbetsyta på användarens enhet.
- Originalbilder och bildinformation sparas lokalt i IndexedDB tills användaren väljer att publicera.
- Firebase ska inte användas som mellanlager för opublicerade bilder.
- Mina bilder visar små WebP-miniatyrer för snabb och resurssnål scroll.
- Originalbilden används först när en bild öppnas eller en publiceringsversion ska skapas.
- Kameraflödet ska erbjuda Ta nästa foto, Välj från album, Ångra senaste, Klar – Mina bilder och Till startsidan.
- Arbetsvyer som Mina bilder får scrolla; dashboardens startvy ska normalt inte scrolla när innehållet ryms.

Dashboard/arbetsflödesbeslut 2026-08-06 – rent kameraflöde:
- Vyn Lägg till bilder ska endast visa Ta foto, Välj från album och Välj filer.
- Efter taget foto visas en enkel meny med Ta nästa foto, Välj från album, Ångra senaste, Klar och Till startsidan.
- Gamla sparade val får inte automatiskt öppna kameran igen eller försöka spara en kopia på enheten.
- Klar går till Mina bilder.

CCC Local Workspace 1.2
- Efter-foto-rutan är kompakt på mobil.
- Mina bilder har separata områden för rubrik, verktyg, scrollbar bildlista och publiceringsknapp.
- Vyernas scrolläge återställs vid navigering.


CCC Local Workspace 1.3
- Mina bilder visar aldrig tomläget när lokala bilder finns.
- Rubrik, Lägg till-knapp, markeringsrad, bildlista och Publicera hålls visuellt åtskilda på mobil.
- Bildlistan har säker nederkant så sista kortet inte hamnar bakom Publicera.

CCC v2.7.0 – Vision arbetsyta + kunskapsbank grund
- Efter Klar stannar användaren på Vision-arbetsytan medan analys körs i bakgrunden.
- Miniatyr = ett plagg. Klick markerar plagg; "Komplettera markerat plagg" lägger extra bilder på just det plagget.
- Visa förslag är grå/inaktiv tills minst ett resultat är klart; därefter kan färdiga plagg granskas medan övriga fortsätter analyseras.
- IndexedDB-grund för lokal learned knowledge och Vision-mätvärden.
- football-base.json seedar bankformatet; 1986 är startgräns, aldrig utrensningsgräns; landslag separat.
- Fixat API-kontrakt: klient skickar images[] (1–3) som Workern kräver och läser Worker-resultat från result.
- Worker returnerar OpenAI usage/model för framtida faktisk kostnadsberäkning.
- OBS: cloudflare-worker.js måste deployas i Cloudflare Worker separat för att usage/model-ändringen ska bli aktiv.

CCC Vision v2.7.6: header-bakåt, bort med plaggantal och gamla gula nummermarkörer.


CCC v2.7.12 – Vision-inställningar och kostnad
- Automatisk AI-analys kan slås av/på lokalt i Inställningar.
- När automatisk AI är av görs inga AI-anrop utan aktivt val via "Analysera med AI".
- AI-kostnad mäts från faktisk tokenanvändning och kan visas/döljas i Vision.
- Kostnadsvisningen är ungefärlig i SEK; underlaget sparas lokalt i IndexedDB.
- Lokalt lärande från godkännanden/rättningar kan slås av/på.
- Nästa planerade steg: fylla CCC:s lokala/base football knowledge bank från 1986 och framåt, inkl. landslag.


CCC v2.7.14 – kostnadsdiagnostik
- Tillfällig diagnostik i Vision kostnadsruta visar om OpenAI usage mottas, modell samt input/output/total tokens.
- Kostnadsvisning kvar med 6 decimaler under felsökningen.
- Ingen AI-, Worker- eller flödeslogik ändrad.

CCC v2.8.1 – Skapa och Publicera separeras (2026-08-09)
- Grundregel: Skapa när du har tid. Publicera när du vill.
- Vision skapar/godkänner produktutkast men beskär inte längre publiceringsbilden.
- Godkänt Vision-plagg sparas lokalt i befintliga IndexedDB ccc-local-workspace/images med huvudbild + godkända fält.
- Opublicerade bilder går inte via Firebase.
- Ny modul ccc-core/publish: mobil först, visar lokala utkast som stora miniatyrer.
- Tryck på miniatyr öppnar stor mobilanpassad bild; svep vänster/höger bläddrar mellan alla utkast.
- Beskärning görs först i Publicera när användaren faktiskt vill göra bilden klar.
- Publiceringsbild skapas lokalt som 1:1 WebP, max 1600 px, kvalitet 0.84. Originalet lämnas orört.
- Dashboardens Publicera går till samma Publish-modul; Vision kan också gå dit från sin slutvy.
- v2.8.1 publicerar ännu inte till Firebase/Container13: sista knappen markerar nästa integrationspunkt. Nästa steg är verklig publicering till Container13 Nyinkommet via befintligt C13-admin/Firebase-flöde.
- Framtidsidéer (ej nu): återanvänd redan publicerade bilder samt CCC-genererade kollage/bildspel med användargodkännande.

CCC v2.8.2 – demo-ui avvecklad (2026-08-09)
- /ccc-core/demo-ui är borttagen ur den aktiva strukturen.
- Aktiva moduler ligger nu i egna mappar: auth, dashboard, vision, publish, profile, settings, store och statistics.
- Dashboard och Vision länkar inte längre till demo-ui.
- Inställningar flyttad till /ccc-core/settings/ med den senaste aktiva versionen som grund.
- Min profil ligger i /ccc-core/profile/.
- Butiken ligger i /ccc-core/store/.
- Statistik ligger i /ccc-core/statistics/.
- Dashboardens äldre relativa publicera-länk är rättad till /ccc-core/publish/index.html.
- Grundregel framåt: ingen ny aktiv CCC-funktion får läggas i demo-/testmappar.


CCC v2.8.3 – Auth-logo + säker Publish-väg (2026-08-09)
- Auth/inloggning använder nu samma CCC-logo med aura/halo som Vision, som är visuellt facit.
- Dashboardens Publicera-länkar går explicit till ../publish/index.html?v=2.8.3 för att undvika att äldre cachad publiceringsvy återanvänds under test.
- Dashboardens JS-redirect till Publicera använder samma versionssatta väg.
- Publish-vyn har också samma Vision-aura i headern så den nya modulen visuellt känns igen.
- Ingen publiceringslogik eller Firebase-funktion har ändrats i denna patch.

CCC v2.8.4 – tydlig Tillbaka i Vision (2026-08-09)
- Vision-starten har åter en egen tydlig tredje ruta: "Tillbaka".
- De två framåtriktade rutorna behåller pil åt höger; Tillbaka har pil åt vänster.
- Tillbaka leder explicit till Dashboard. CCC-loggan är fortfarande klickbar som extra genväg, men viktig navigation ska aldrig kräva att användaren känner till ett dolt loggbeteende.
- Mobile-first: Tillbaka-rutan använder den redan förberedda kompakta kortdesignen i Vision och ligger under foto/kamerarulle.

CCC v2.8.5 – gemensamt visuellt shell på mobil + desktop (2026-08-09)
- Dashboard är fortsatt visuellt layoutfacit för CCC.
- Vision-loggans guldbåge/aura är logofacit och används nu även på Dashboard.
- Vision desktop görs mer kompakt och dashboardlik: tre tydliga arbetskort i samma samlade arbetsyta. Mobilflödet lämnas i huvudsak orört.
- Publicera har fått full CCC-header med tema + profil, modulmarkör PUBLICERA och undertitel. Den gamla flytande versionsbrickan är borttagen.
- Målet är inte desktop-pixelpolering nu, utan ett gemensamt skal så nya moduler inte behöver byggas om senare.

CCC v2.8.6 – Vision UI-polish (2026-08-09)
- Vision-flikens versionsnummer synkas med aktuell build.
- Desktop-hover förstärks på alla tre startkort: tydligare lyft, skugga och kant.
- "Tillbaka" får samma visuella hierarki som övriga val: stor vänsterställd rubrik och mindre förklarande text "Till dashboard".
- Tillbaka-pilen ligger fortsatt till vänster för att signalera bakåtriktning; de två framåtvalen behåller pil åt höger.
- Touch/mobile påverkas inte av hover-reglerna.

CCC v2.8.7 – maxsynk header/profil/feedback (2026-08-09)
- CCC-loggans guldbåge/aura skalar nu responsivt: mobil behåller den fungerande lilla bågen; desktop använder en betydligt bredare båge som täcker hela CCC-ordmärket.
- Samma auraregler finns på Dashboard, Vision och Publicera.
- Dashboardens hover/focus-feedback på huvudkorten synkas med Vision: tydligare lyft, skugga och markerad kant på desktop.
- Vision och Publicera har nu "Logga ut" i profilmenyn, med samma bekräftelsedialog som Dashboard.
- Mål: låsa Dashboard/Vision/Publicera som gemensamt CCC-shell innan resterande moduler byggs vidare.

CCC v2.8.8 – Publicera aura-fix (2026-08-09)
- Publicera hade äldre, mer specifika publish-shell-regler som överstyrde den gemensamma desktop-auran.
- Publicera får nu exakt samma slutliga aurageometri som Vision: liten mobilbåge och bred desktopbåge över hela CCC-ordmärket.
- Inga andra funktioner eller layouter ändrades i denna patch.

CCC v2.8.9 – Vision logout-fix (2026-08-09)
- Vision hade Logga ut-knappen och JS-hanteringen, men den faktiska bekräftelsedialogen saknades i HTML.
- Den saknade logout-dialogen är nu tillagd i Vision med samma beteende som Dashboard/Publicera.
- Ingen annan funktionalitet eller layout ändrades i denna patch.

CCC v2.8.10 – linjerade handlingskort / generell designregel (2026-08-09)
- Vision-startens tre kort använder samma visuella struktur: ikonrad, rubrikrad och hjälprad ligger på samma nivå när korten jämförs.
- Tillbaka-kortet har nu en stor vänsterpilsikon i samma ikonposition som kamera/galleri, plus en liten navigationspil vid vänsterkanten.
- Framåtkort har liten navigationspil till höger; bakåtkort har liten navigationspil till vänster.
- Generell CCC-regel: parallella action-kort inom samma vy ska linjera ikon, rubrik, hjälprad och övriga återkommande element. Skillnader ska uttrycka funktion/riktning, inte skapa slumpmässiga förskjutningar.
- Regeln gäller alla nuvarande och framtida CCC-moduler.

CCC v2.8.11 – gemensam Action Card-komponent (2026-08-09)
- Dashboard är fortfarande visuellt facit, men kortgeometrin är nu faktiskt delad i `ccc-core/action-cards.css`.
- Dashboard och Vision laddar samma action-card-fil sist. Där styrs storlek, ikonposition, rubriknivå, hjälprad, hover/focus, rundning, skugga och mobil/desktop-geometri.
- Vision får endast lägga till innehåll, färg och riktning. Framåtkort kan visa liten pil höger; bakåtkort liten pil vänster utan att flytta ikon eller text.
- Parallella action-kort ska ligga i linje: samma ikonrad, rubrikrad och hjälprad. Detta är en generell regel för alla nuvarande och framtida CCC-moduler.
- Nya moduler ska återanvända `action-cards.css` i stället för att kopiera kort-CSS lokalt.

CCC v2.8.12 – Vision/Dashboard exaktare kortsynk (2026-08-09)
- Vision-startens tre kort flyttas ned till samma vertikala arbetsnivå som Dashboard på desktop.
- Äldre Vision-CSS neutraliseras för startkorten så att den gemensamma action-card-geometrin inte längre kan förvrängas lokalt.
- Desktop använder samma 3-kolumnsgap, korthöjd, ikonstorlek, rubriknivå och hjälprad som Dashboard.
- På mobil döljs den lilla extra vänsterpilen i Tillbaka-kortet; den stora vänsterpilen i ikoncirkeln räcker.
- Grundregel kvarstår: Dashboard är facit och parallella kort ska styras från gemensam komponent, inte lokal modulgeometri.

CCC v2.8.13 – Vision desktop yttermått mot Dashboard-facit (2026-08-09)
- Vision-startens desktopgrupp begränsas till samma kompakta bredd som Dashboard i stället för att fylla över 1000 px.
- Tre kort är 180 px breda med kompakt höjd och gemensamt mellanrum; intern linjering från v2.8.12 behålls.
- Vertikala placeringen från v2.8.12 behålls.
- Mobilregeln från v2.8.12 behålls: ingen liten extra vänsterpil i Tillbaka-kortet.
- Dashboard ändras inte i denna patch.

CCC v2.8.14 – CCC Core konsolidering (2026-08-09)
- Nu agerar vi på arkitekturen innan fler moduler byggs.
- Ny gemensam grund i `ccc-core/core.css` och `ccc-core/core.js`.
- `core.css` äger gemensamt: färger/tokens, header, CCC-logga/aura, tema/profilskal, modulrad, arbetsbredd, action-kort, hover/focus och logout-dialog.
- `core.js` äger gemensamt: tema, profilmeny och logout.
- Dashboard, Vision och Publicera laddar samma core-filer. Modulmapparna behåller sin egen funktionslogik och modulunika layout.
- Gemensam desktop-arbetsbredd är 720 px, hämtad från Dashboard-facitet; action-kort använder samma grid och mått därifrån.
- `action-cards.css` tas bort som separat fil eftersom komponenten nu ingår i `core.css`.
- Gamla dubbla tema/profil/logout-hanterare tas bort ur Dashboard/Vision/Publicera-JS för att undvika dubbelbindningar.
- Regel framåt: gemensam CCC-design/UX ska först in i core; modul-CSS får inte kopiera eller överstyra kärngeometri utan ett verkligt modulbehov.

CCC v2.8.15 – Vision följer Core/Dashboard utan egna desktopmått (2026-08-09)
- Dashboard är fortsatt visuellt facit och ändras inte layoutmässigt.
- `core.css` låser gemensam desktop-arbetsbredd, modulrad, 3-kortsgrid, gap och kortgeometri för alla moduler.
- De ackumulerade Vision-specialblocken från v2.8.10/v2.8.12/v2.8.13 tas bort ur `vision.css`.
- Vision-starten får bara en minimal reset som låter `core.css` styra geometri och placering.
- Vision-kugghjulet är modulunikt och placeras separat till vänster utan att påverka CCC-loggans centrering.
- Mobil: den lilla extra vänsterpilen i Tillbaka-kortet är fortsatt dold.
- Regel: inga nya modulunika px-mått för gemensam header/action-card-layout; sådant ska ändras i Core.

CCC v2.8.16 – Vision ren Core-markup + central logout-länk (2026-08-09)
- Vision-startens tre kort använder nu samma rena DOM-struktur som Dashboard: `action-icon` + `action-copy` + `action-arrow`.
- Äldre Vision-specifika kortklasser tas bort från startkorten så gammal modul-CSS inte längre kan påverka deras geometri.
- Första kamerakortets extra `camera-content`-wrapper tas bort; Vision-JS uppdateras till den gemensamma `action-copy`-strukturen.
- Ingen ny Vision-specifik kortgeometri läggs till. `core.css` fortsätter vara ensam källa för gemensamma kortmått.
- Logout i `core.js` använder nu `import.meta.url` för att alltid lösa `ccc-core/auth/index.html` korrekt oavsett om användaren är i Dashboard, Vision eller Publicera.

CCC v2.8.17 – textpassning + stabil modulrad (2026-08-09)
- Vision-startkorten använder en ny gemensam Core-variant `ccc-action-card--dense-copy` för längre rubriker/hjälptexter.
- Varianten ändrar endast typografin, inte kortens gemensamma geometri.
- Modulundertiteln reserverar nu alltid samma höjd även när texten är tom. Dashboardens ARBETSYTA hoppar därför inte i höjd när man byter till/från Vision på mobil.
- Regeln ligger i `ccc-core/core.css` och kan återanvändas av framtida moduler med längre korttexter.

CCC v2.8.18 – korrigerad cache-busting (2026-08-09)
- Dashboard, Vision och Publicera laddar nu samma `core.css?v=2.8.18`, `core.js?v=2.8.18` och `version.js?v=2.8.18`.
- Publicera saknade tidigare en konsekvent `version.js`-referens; den är nu tillagd.
- Modulernas egna CSS/JS-referenser är också normaliserade till v2.8.18.
- Core och modul-CSS har dessutom fått en faktisk v2.8.18 cache-stämpel i filinnehållet.

CCC v2.8.18 – konsekvent cache-busting (2026-08-09)
- Dashboard, Vision och Publicera använder nu genomgående v2.8.18 i alla lokala CSS/JS-referenser.
- Gemensamma `core.css`, `core.js` och `version.js` laddas med v2.8.18 på samtliga tre sidor.
- Visionens faktiska scriptfiler (`demo-data.js`, `vision-ai-config.js`, `vision-ai.js`, `vision-knowledge.js`, `product-lab.js`) är också cache-bustade till v2.8.18.
- CSS-filerna har en faktisk v2.8.18 cache-stämpel i filinnehållet.
- Syfte: det ska inte gå att visa v2.8.18 i sidan men samtidigt köra äldre CSS/JS från webbläsarcache.

CCC v2.8.19 – Vision kortstorlek + total kostnad (2026-08-09)
- Desktop-actionkort låses centralt i `core.css` till exakt 320 px höjd för alla moduler; Vision och Dashboard får därmed samma yttermått från samma regel.
- Vision-inställningar visar nu endast `Total Vision-kostnad` i SEK med två decimaler.
- Kostnaden hämtas från den redan befintliga lokala Vision-mätningen i `CCC_VISION_KNOWLEDGE.costSummarySince(...)`; ingen ny räknare skapas.
- Totalen summerar all sparad AI-analyskostnad och uppdateras varje gång Vision-inställningar öppnas.
- Detaljerad kostnadsstatistik lämnas till framtida Statistik-modul.

CCC v2.8.20 – verklig orsak till mindre Vision-kort fixad (2026-08-09)
- Grundfelet var inte längre kortens egna mått utan Visions äldre desktopregel `.app-shell{width:430px}`.
- Den regeln begränsade hela Vision-modulen innan den gemensamma 720 px arbetsytan kunde användas.
- `core.css` äger nu även `.ccc-app-shell` med full bredd på desktop och överstyr gamla modulbredder centralt.
- Dashboardens och Visions action-kort kan därmed använda exakt samma Core-grid i samma tillgängliga arbetsbredd.
- Vision-kostnaden från v2.8.19 behålls oförändrad.

CCC v2.8.21 – Vision-starten får samma strukturella grid som Dashboard (2026-08-09)
- Grundorsaken till fortsatt lägre Vision-kort var att `#captureCard` både fungerade som stage/arbetskort och som action-grid.
- Dashboard använder en separat ren `primary-actions`-grid; Vision gör nu motsvarande med `.vision-start-actions.c​cc-action-grid`.
- De tre startkorten ligger i den nya wrappern. `#captureCard` är inte längre action-grid i startläget.
- När bildflödet har startat blir wrappern `display: contents`, så Visions befintliga arbetsflöde behåller sin layout.
- Core fortsätter äga 720 px desktop-grid, 28 px gap och 320 px action-korthöjd.
- Vision-kostnadsvisningen från v2.8.19/v2.8.20 behålls.

CCC v2.8.22 – Vision-kortens faktiska desktop-höjd låst mot Dashboard (2026-08-09)
- Orsak: Vision-starten låg fortfarande inuti captureCard/stage-card, som har äldre egna höjd/layoutregler.
- På desktop tas den extra layoutnivån bort med display:contents när Vision är i startläge.
- Själva action-korten fortsätter styras centralt av ccc-core/core.css: 720px grid, 28px gap, 320px kort.
- Textmängden i Vision får inte längre påverka kortens yttermått.
- Mobilreglerna lämnas orörda.

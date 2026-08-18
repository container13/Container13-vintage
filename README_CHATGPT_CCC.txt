==================================================
README_CHATGPT_CCC.txt
==================================================

AKTUELL STATUS
--------------
CCC-version: 2.9.20
Senaste stabila: 2.8.95 RC1 – Crop Engine 1.0
Senaste checkpoint: 2026-08-18
Nästa uppgift: Testa v2.9.20 på mobil: enhetlig kvadratisk slutbild, endast en linje under modulhuvudet, större/högre bildräknare och korrekt retur till samma plagg efter Spara anpassning.

ARBETSPRINCIPER
---------------
- Headerns ikonstorlek, klickyta, spacing och position styrs endast i /ccc-core/core.css.
- Tillbaka/kugghjul skapas och visas/döljs centralt av /ccc-core/core.js; moduler får inte pixel-positionera egna headerkontroller.
- Dashboard visar varken tillbaka eller kugghjul. Modulstart visar kugghjul. Undervyer visar tillbaka + kugghjul.
- Mobil först.
- Dashboard är designfacit för CCC-moduler.
- Local-first där det är praktiskt.
- Kod före teori.
- Små, verifierbara ändringar.
- Full ZIP + Changed-files ZIP vid varje leverans.
- Changed-files ZIP innehåller endast filer som faktiskt ändrats och behåller korrekt mappstruktur.
- /version.js i projektroten är låst och ändras inte under CCC-utveckling.
- CCC-versioner hanteras endast i /ccc-core/version.js.
- README_CHATGPT_CCC.txt uppdateras vid varje version och fungerar som gemensam projektjournal/arbetsmanual.
- Ingen bildgenerering under CCC-arbete om användaren inte uttryckligen ber om det.
- Crop Engine 1.0 är fryst; nya crop-förbättringar ska baseras på verkliga Vision-bilder.

CHECKPOINTS
-----------
2026-08-11
- Crop Engine 1.0 fryst efter v2.8.95 RC1.
- Beskär-vyn byggdes om i v2.9.0 för mobil utan scroll.
- Ny standard för versionering och leverans är fastställd.
- Root /version.js ska aldrig följa med i Changed-files vid normal CCC-utveckling.

VERSIONSLOGG
------------
v2.9.20 – Publicera: enhetlig slutbild + UI-städning
- Bas: kompletta arbetskopian från ccc-demo-public-test som användaren tog med från jobbet.
- Alla färdiga publicerings-WebP blir kvadratiska. Beskuren bild fyller kvadraten; Behåll hela bilden centreras i samma kvadratiska canvas utan beskärning.
- Publicera-vyerna får inga extra border/pseudo-linjer under Core-linjen i modulhuvudet.
- Bildräknaren flyttas 6 px upp och görs större (14 px text, större pill).
- Spara anpassning återgår uttryckligen till detaljvyn för samma plagg-ID.
- /ccc-core/version.js synkad till 2.9.20 och README_CHATGPT_CCC uppdaterad.
- Changed-files ZIP innehåller README_CHATGPT_CCC.txt i projektroten samt /ccc-core/version.js tillsammans med övriga ändrade filer.
- Root /version.js är fortsatt orörd.

v2.9.4 – Header Back hotfix
- Fixar centrala tillbaka-knappar i Publicera.
- Orsak: gamla DOM-lyssnare för borttagna #detailBack och #cropBack låg kvar och stoppade publish.js med null.addEventListener innan CCC Header Core-eventen registrerades.
- Gamla lokala back-lyssnare borttagna.
- Tidigare cleanup-beteende för Detail och Crop flyttat till leavePublishDetail()/leavePublishCrop() och anropas av ccc:header-back.
- CCC Header Core-geometri är oförändrad.
- Crop Engine 1.0 är oförändrad.
- Root /version.js är orörd.

v2.9.3 – CCC Header Core
- Ny central headerkomponent i /ccc-core/core.js + core.css.
- En enda uppsättning CSS-variabler styr storlek, klickyta, spacing och vertikal placering för tillbaka, kugghjul, tema och profil.
- Core skapar tillbaka- och kugghjulsknapparna; moduler styr endast show/hide via CCC_CORE.header.set().
- Dashboard: inga vänsterkontroller.
- Vision start: kugghjul. Vision undervyer: tillbaka + kugghjul.
- Publicera start: kugghjul. Publicera undervyer: tillbaka + kugghjul.
- Tema- och profilikoner standardiseras centralt.
- Lokala fixed/pixel-hack för header tas bort från Publicera.
- Förhandsgranskningens x av y ligger inne i bilden.
- Publicera-vyer balanseras utan att module-CSS styr headerns geometri.
- Crop Engine 1.0 är oförändrad.
- Root /version.js är orörd och följer inte med i Changed-files ZIP.

v2.9.0 – Beskär Layout
- Hjälptext och synlig crop-data bort från Beskär-vyn.
- Tillbaka-knappen placerad i headerområdet till vänster.
- Bildräknaren visas inne i crop-bilden.
- Zoom-slider borttagen.
- Pinch och drag behålls.
- Dubbeltryck växlar zoom 100 % → 130 % → 180 % → 100 %.
- Diskret zoomknapp öppnar [-] procent [+] för finjustering.
- Original / Återställ / OK ligger på samma rad.
- Crop Engine 1.0 är funktionellt oförändrad.

v2.8.95 RC1 – Crop Engine 1.0
- Paired collar/shoulder lock förbättrade Zidane-fallet.
- Adaptiv X-centrering och övrig crop-logik från v2.8.94 behölls.
- Crop Engine 1.0 fryst efter test.

ATT GÖRA
---------
- Testa v2.9.0 Beskär Layout på mobil.
- Om layouten fungerar utan scroll: gå vidare till Publicera-flödet.
- Skapa testkopia av nyinkommet.html under ccc-core för publiceringstester.


ÄLDRE PROJEKTANTECKNINGAR
-------------------------
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

CCC v2.8.23 – central desktop-korthöjd från uppmätt Dashboard-facit (2026-08-09)
- Skärmdumparna mättes direkt: Dashboard och Vision har redan samma kortbredd, men Dashboardens synliga kortbox är cirka 368 px hög medan Vision ligger omkring 320 px.
- Core får nu variabeln `--ccc-action-card-height-desktop: 368px`.
- Alla `.ccc-action-grid > .ccc-action-card` på desktop använder exakt denna variabel för `height`, `min-height` och `max-height`.
- Detta är den enda auktoritativa desktop-korthöjden framåt. Vill vi senare göra alla CCC-kort större/mindre ändras variabeln på ett enda ställe i `ccc-core/core.css`.
- Ingen mobilgeometri ändras.
- Vision-kostnadsvisningen behålls.

CCC v2.8.24 – identisk modulheader och vertikal startposition (2026-08-09)
- `ccc-module-marker` får nu en fast gemensam höjd i Core.
- Kicker-raden, undertitel-raden och skiljelinjen har reserverade fasta rader i alla moduler.
- Dashboard behåller tom undertitelplats under `ARBETSYTA`; Vision använder samma plats för `Foto & produktanalys`.
- Därmed flyttas inte skiljelinjen eller action-korten när man växlar Dashboard ↔ Vision, vare sig på desktop eller mobil.
- Ingen Vision-specifik pixel-flytt används; lösningen ligger centralt i `ccc-core/core.css`.
- Desktop-korthöjden 368 px från v2.8.23 behålls.

CCC v2.8.25 – samlad v2.8.24 + gemensam tema/profil-position (2026-08-09)
- Innehåller v2.8.24-fixen med identisk fast modulheader, reserverad undertitelrad och gemensam skiljelinje.
- Tema- och profilknapparna styrs nu centralt från `ccc-core/core.css` med högre specificitet än äldre modul-CSS.
- Dashboard, Vision och Publicera får exakt samma right/bottom-position, gap, knappstorlek och ikonstorlek på desktop och mobil.
- Visions äldre `.app-header .header-actions`-regler kan därmed inte längre flytta eller krympa tema/profil.
- Vision-kugghjulet är fortsatt modulunikt och påverkas inte.

CCC v2.8.26 – hela headerboxen centraliserad i Core (2026-08-09)
- Orsak hittad: Vision hade kvar `.app-header.ccc-header{...!important}` med annan padding än Dashboard.
- Core styr nu med högre specificitet hela headerns bredd, höjd, padding, centrering och boxmodell.
- Tema + profil förankras med direkt-child-selector mot exakt samma headerbox i Dashboard, Vision och Publicera.
- Desktop: samma 48 px högerinset, 42 px botteninset, 14 px gap och 58 px knappar.
- Mobil: samma 16 px högerinset, 14 px botteninset, 8 px gap och 44 px knappar.
- v2.8.24 modulheaderfix och senare kort/kostnadsfixar behålls.

CCC v2.8.27 – Vision CSS-städning / en källa för gemensam UI (2026-08-09)
- Grundorsaken bakom både kort- och headeravvikelser var samma: Vision hade äldre egna CSS-regler som duplicerade och konkurrerade med Core.
- `vision.css` rensas nu från delade headerregler för `.app-header.ccc-header`, `.header-actions/.ccc-header-actions`, CCC-brand/aura och gemensam ikonknappsgeometri.
- Äldre Vision-startregler för gamla `vision-dashboard-card` / `vision-card-*`-klasser rensas där Core nu äger action-korten.
- Vision behåller endast Vision-specifika headerkontroller (kugghjul/bakåt), kamera, analys, thumbnails, settings-paneler och arbetsflödeslayout.
- `core.css` är ensam auktoritativ källa för gemensam CCC-header, logga/aura, tema/profil och action-card-geometri.
- Regel framåt: när en komponent flyttas till Core ska motsvarande modul-CSS tas bort, inte överstyras med ytterligare `!important`.

CCC v2.8.28 – central headergeometri enligt samma modell som kortfixen (2026-08-09)
- Samma lösningsprincip som för action-korten används nu för headern: ett enda centralt måttsystem i `ccc-core/core.css`.
- CCC-logga/aura förankras absolut i mitten av den gemensamma headerboxen och kan inte flyttas av modulens innehåll.
- Tema + profil använder centrala Core-variabler för höger-/botteninset, knappstorlek och gap.
- Desktopvariabler: right 48 px, bottom 42 px, knapp 58 px, gap 14 px, brand 78 px.
- Mobilvariabler: right 16 px, bottom 14 px, knapp 44 px, gap 8 px, brand 35 px.
- Vill vi senare ändra loggan eller tema/profil i hela CCC görs det på ett enda ställe i Core.
- Vision-kugghjul/bakåt är fortsatt modulunika och påverkar inte brand/tema/profil.

CCC v2.8.29 – exakt samma gemensamma header-markup (2026-08-09)
- Dashboard-headerns faktiska markup är nu facit för den delade CCC-headern.
- Vision och Publicera använder samma struktur för CCC-logga/aura, tema, profil och profilmeny.
- Visionens kugghjul och kontext-bakåt ligger i en separat `ccc-module-header-tools`-wrapper och kan inte påverka den gemensamma headerns centrering eller högerkontroller.
- Core äger wrapperns position; Vision-knapparna själva positioneras inte längre mot viewport/header.
- Detta följer samma princip som löste action-korten: samma struktur + samma Core-komponent, inte tre imitationer.
- Framtida ändring av logga/aura/tema/profil görs centralt i Core och samma headerstruktur används av alla moduler.

CCC v2.8.30 – strukturell headerfix: samma yttre app-shell (2026-08-09)
- Grundorsaken till att Vision-headern fortsatt avvek hittades i HTML-strukturen: Vision saknade helt Dashboard/Publiceras yttre `<div class="app-shell ccc-app-shell">`.
- Därmed förankrades Vision-headerns absoluta kontroller mot en annan layoutbox trots identiska Core-regler.
- Vision har nu samma yttre app-shell som Dashboard och Publicera; globala overlays ligger fortsatt utanför app-shell.
- Dashboardens stylesheet-tag i `<head>` saknade ett avslutande `>` och är samtidigt korrigerad.
- Detta följer samma lösning som action-korten: samma struktur först, sedan samma Core-regler.
- Logga/aura, tema och profil fortsätter styras centralt från `ccc-core/core.css`.

CCC v2.8.31 – Publicera utan onödig PC-scroll (2026-08-09)
- Publiceras första PC-vy ska rymmas i viewporten och får inte skapa sidans vertikala scrollbar.
- `publish-shell` låses till exakt 100dvh och yttre document-scroll stängs av på desktop.
- `publish-main` räknas som återstående yta efter gemensam CCC-header + modulrad och får ingen egen överhöjd från Core-padding.
- `gridView` är fast utan scroll. `detailView` och `cropView` får däremot intern vertikal scroll när deras faktiska innehåll kräver det.
- Därmed ska Publiceras scrollbar försvinna i huvudvyn och headern ligga på samma horisontella position som Dashboard/Vision.

CCC v2.8.32 – loggtest + v2.8.31 samlat (2026-08-09)
- Innehåller Publicera-fixen från v2.8.31 eftersom den patchen ännu inte var uppladdad.
- Gemensam CCC-brand markup delar nu upp de tre C:na i spans.
- Mitten-C har klassen `ccc-brand-middle` och görs tillfälligt 1.34em stort via en enda regel i `ccc-core/core.css`.
- Testmål: Dashboard, Vision och Publicera ska visa exakt samma större mitten-C. Om alla tre följer med är central loggstyrning verifierad.
- Efter verifiering kan testutseendet återställas centralt utan att ändra varje modul.

CCC v2.8.33 – mobilstart: bredare aura + samma huvudkort Dashboard/Vision (2026-08-09)
- Den nya större mitten-C-loggan från v2.8.32 behålls permanent.
- Mobilauran breddas centralt i Core så den visuellt sträcker sig längre ut från loggan, närmare desktop-proportionen.
- Dashboardens första tre kort och Vision-startens tre kort använder nu samma återanvändbara Core-klass `ccc-action-grid--fill-mobile`.
- Klassen äger mobilgridens höjd, tre lika rader, gap och kortens fulla höjd.
- Dashboard och Vision får samma beräknade mobila arbetsyta efter gemensam header + 58 px modulrad.
- Visions gamla `main-camera`-minhöjder neutraliseras i startläget så kamera-kortet inte kan bli en annan storlek än de andra.
- Regel framåt: huvudkort som ska fylla mobil arbetsyta använder Core-modifieraren i stället för egna modulmått.

CCC v2.8.34 – mobil finjustering aura + Vision-bredd (2026-08-09)
- Mobilauran från v2.8.33 minskad ett litet steg.
- Vision-startens wrapper, grid och kort använder nu 100% av exakt samma 16px-paddade arbetsbredd som Dashboard på mobil.
- Höjden från v2.8.33 behålls oförändrad.

CCC v2.8.35 – mobilstruktur centraliserad, Dashboard = facit (2026-08-09)
- För att undvika samma rundgång som på desktop centraliseras nu hela mobilkedjan: workspace -> home view -> action grid -> action card.
- Dashboardens mobilstruktur är facit. Vision-starten får motsvarande `.ccc-mobile-home-view` runt sin gemensamma `ccc-action-grid--fill-mobile`.
- Core äger bredd, höjd, sidpadding, gridrader, gap och kortens fulla storlek för gemensamma mobil-huvudvyer.
- Vision `#captureCard` blir `display: contents` i startläge på mobil och får därmed inte fungera som extra breddbegränsande wrapper.
- Äldre Vision-startregler för width/max-width/margin/padding/min-height neutraliseras i startläge.
- Permanent arkitekturregel: modul-CSS får inte återdefiniera gemensam header, workspace, home-view, action-grid eller action-card-geometri. Avvikelse ska ske via en uttrycklig namngiven modifierarklass i Core.
- Den nya större mitten-C-loggan och mobilauran från v2.8.34 behålls.

CCC v2.8.36 – mobil rotfix: Core äger hela app-shell (2026-08-09)
- Inspektion visade den konkreta orsaken till både smalare Vision-kort och flyttad tema/profil på mobil.
- `vision.css` innehöll 20 äldre separata `.app-shell`-regler med egna bredder, höjder, marginaler, gridlägen och framför allt padding.
- Vision-headern och Vision-workspace låg därför i en annan faktisk innehållsbox än Dashboard trots samma Core-klasser.
- Samtliga standalone `.app-shell`-regler tas bort ur `vision.css`.
- `.app-shell.ccc-app-shell` ägs nu centralt av Core på ALLA breakpoints: 100% bredd, 100dvh höjd, padding 0, margin auto, border-box och overflow hidden.
- Vision börjar layoutmässigt först vid `.vision-shell`; den yttre app-boxen får aldrig styras av modul-CSS.
- Detta ska samtidigt korrigera både headerns tema/profil-position och startkortens mobilbredd.
- Permanent regel: modul-CSS får inte definiera `.app-shell`, `.ccc-app-shell` eller gemensam header/workspace-geometri.


CCC v2.8.37 – Publicera startvy
- Publiceras första vy använder nu tre gemensamma Core-actionkort.
- Kort 1: Lokala utkast med dynamiskt antal lokala utkast.
- Kort 2: Publicerade, för historik/status; tom historik visas tills publiceringslogg kopplas in.
- Kort 3: Tillbaka till Dashboard.
- Den tidigare dubbla rubriken/tomläget på startsidan är borttaget; utkastens tomläge visas först när Lokala utkast öppnas.
- Befintlig detaljvy, beskärning och lokal IndexedDB-hantering är bevarad.

CCC v2.8.38 – Publicera samma Core-kort + fullbred modul-linje (2026-08-10)
- Publiceras startsida använder nu exakt samma Core-kedja som Dashboard/Vision: `ccc-mobile-home-view` -> `ccc-action-grid--fill-mobile` -> `ccc-action-card`.
- Publiceras workspace ingår i samma centrala mobilregel för bredd, höjd, 16px sidpadding och overflow.
- Lokala Publicera-regler för startvyns/gridens geometri tas bort; Core är ensam källa.
- Den tunna linjen under modulrubriken går nu över hela appens bredd i Dashboard, Vision, Publicera och framtida moduler.
- Permanent modulregel: nya moduler ska från start använda Core-kedjan för gemensam layout och får inte skapa egna kopior av workspace/grid/action-card-geometri.

CCC v2.8.39 – fullbreddslinje korrigerad (2026-08-10)
- Orsaken till att v2.8.38 inte syntes var att `ccc-module-marker::after` låg som grid-item.
- `width:100%` fyllde då gridspåret i stället för hela modulradens box.
- Linjen är nu absolut positionerad med `left:0; right:0; bottom:0` och går därför verkligt kant-till-kant.
- Regeln ligger centralt i Core och gäller Dashboard, Vision, Publicera och framtida moduler.

CCC v2.8.40 – gemensamt landscape-läge (2026-08-10)
- CCC får nu ett centralt landscape-läge för telefoner/små skärmar i `ccc-core/core.css`.
- Permanent princip: `CCC-skalet är fast. Innehållet får scrolla vid behov.`
- Vid landscape med låg skärmhöjd komprimeras header och modulrad centralt.
- Dashboard, Vision och Publiceras tre huvudkort läggs sida vid sida och fyller återstående viewport utan sidscroll.
- Logga/aura, tema/profil och Vision-verktyg får gemensamma landscape-positioner från Core.
- Detalj-/arbetsvyer i Vision och Publicera får intern vertikal scroll när innehållet faktiskt kräver det.
- Nya moduler ska automatiskt stödja portrait, landscape och desktop via Core från start; modul-CSS får bara komplettera med verkligt modulunikt landscape-innehåll.

CCC v2.8.41 – Auth använder gemensam cCc-logga (2026-08-10)
- Auth laddar nu `ccc-core/core.css` och använder samma delade brand-markup som Dashboard, Vision och Publicera.
- Den större mitten-C-loggan är därmed gemensam även på inloggningssidan.
- Auran kommer från Core-komponenten; Auth behåller endast sin egen placering/animering av login-brand.
- Framtida ändringar av den gemensamma CCC-loggan ska slå igenom även i Auth utan separat loggvariant.

CCC v2.8.42 – PWA safe-area följer tema (2026-08-10)
- Installerad webbapp ska inte visa vita remsor ovanför eller under CCC.
- `html`, `body` och gemensam `ccc-app-shell` målas nu med `--ccc-bg`.
- Core-temaväxlingen uppdaterar både `meta[name=theme-color]` och viewportens faktiska bakgrundsfärg.
- iOS-webbappmetataggar läggs till, inklusive `black-translucent`, så appbakgrunden kan fortsätta bakom status/safe-area.
- Dashboard, Vision, Publicera och Auth använder `viewport-fit=cover` och tidig temainitiering för att minska vit flash vid uppstart.
- Auth safe-area använder också Core-temats bakgrund.

CCC v2.8.43 – egen CCC-PWA, separerad från Container13 (2026-08-10)
- Grundorsak hittad: CCC saknade eget manifest och egen service worker, medan Container13:s root-service-worker kunde kontrollera `/ccc-core/`.
- Root-service-workern använder `ignoreSearch:true`, vilket kan göra att gamla CCC CSS/JS serveras trots nya `?v=`-suffix.
- CCC får nu `ccc-core/manifest.webmanifest` med eget namn, scope `/ccc-core/`, `display: standalone`, `orientation: any` och mörk neutral PWA-startbakgrund.
- CCC får egen `ccc-core/sw.js` med smalare scope. Den använder network-first och exakta request-URL:er; versionssuffix ignoreras inte.
- `ccc-core/pwa.js` registrerar den dedikerade CCC-service-workern. Den smalare registreringen tar över `/ccc-core/` från Container13:s root-worker.
- Auth, Dashboard, Vision och Publicera länkar nu CCC-manifestet och PWA-bootstrap.
- Detta ska förhindra att gamla cacheade Core-filer gör att PWA-temat inte följer aktuell version.
- Landscape tillåts även i manifestet (`orientation: any`).

CCC v2.8.44 – PWA safe-area för logga + Auth brand-rensning (2026-08-10)
- iPhone standalone visade auran/loggans överkant bakom status-/kameraområdet.
- Core-headern tar nu hänsyn till `env(safe-area-inset-top)` i installerad PWA och flyttar branden nedåt utan modulunika justeringar.
- Landscape respekterar även vänster/höger safe-area.
- Auth hade fortfarande äldre egna regler för `.ccc-brand-word`, `.ccc-brand-halo` och `.ccc-aura-arc`; 2 sådana brandregler togs bort/neutraliserades.
- Auth använder nu samma Core-styrda cCc-logga, mitten-C och aura som övriga CCC.
- Permanent regel: modul-CSS får inte äga gemensam CCC-brandgeometri.

CCC v2.8.45 – landscape finjustering (2026-08-10)
- På mobil i landscape flyttas den gemensamma CCC-loggan 5 px nedåt.
- Gemensamma huvudkort i landscape minskas 20 px på höjden.
- Ändringen ligger i Core så nya moduler som använder CCC:s gemensamma header/kort ärver samma landscape-geometri.

CCC v2.8.46 – gemensam kortbredd i mobil landscape (2026-08-10)
- Vision används som visuell breddreferens för huvudkorten i mobil landscape.
- Core begränsar den gemensamma tre-kortsgriden till 720 px och centrerar den.
- Dashboard, Vision och Publicera får därmed samma landscape-bredd och centrering.
- Permanent regel för nya moduler i mobil landscape: börja med samma Core-styrda kortbredd, höjd, spacing och centrerade tre-kortsrad; avvik först när modulens innehåll faktiskt kräver det.
- Denna regel gäller specifikt mobil landscape och ändrar inte portrait- eller desktopgeometrin.


CCC v2.8.47 – landscape slutjustering (2026-08-10)
- Loggan ytterligare 6 px ned från v2.8.46.
- Korten ytterligare 20 px lägre från v2.8.46.
- Endast mobil landscape påverkas; gemensamt via Core.

CCC v2.8.48 – portrait header/logga centraliserad på riktigt (2026-08-10)
- Vision hade kvar äldre modulregler för `.app-header`, `.brand-word` och `.brand-halo`; Dashboard hade också legacy-headerregler.
- Rensning: 29 gemensamma header/brand-regler borttagna ur `dashboard.css` och 22 ur `vision.css`.
- Mobil portrait-header och CCC-brandens position definieras nu uttryckligen endast i `ccc-core/core.css`.
- Installerad PWA:s safe-area-förskjutning ligger i samma centrala portrait-regel och gäller därför Dashboard, Vision och Publicera identiskt.
- Permanent regel: modul-CSS får inte definiera `.app-header`, `.ccc-header`, `brand-word`, `brand-halo` eller CCC-aura-geometri.

CCC v2.8.48 – slutverifiering header single-source
- Efter selector-audit togs de sista 4 Vision-reglerna som fortfarande refererade `.app-header` bort.
- Slutkontroll: varken `dashboard.css` eller `vision.css` innehåller längre selectors som äger gemensam app-header, brand-word, brand-halo eller CCC-aura.
- Mobil portrait-positionen för loggan/headern styrs därmed från `ccc-core/core.css` som enda källa.

CCC v2.8.48 – portrait header/logga single-source (2026-08-10)
- Dashboard och Vision rensade från modulägda header/logga/aura-regler.
- Borttagna regler i denna slutkörning: dashboard.css 0 st, vision.css 0 st.
- Mobil portrait-positionen för CCC-loggan och PWA safe-area-förskjutningen styrs nu endast från `ccc-core/core.css`.
- Permanent regel: modul-CSS får inte definiera gemensam app-header, brand-word, brand-halo eller aura-geometri.

CCC v2.8.49 – faktisk grundorsak för Vision-loggan i portrait (2026-08-10)
- Grundorsaken hittad: `vision.css` hade kvar `--ccc-header-height:105px!important`, vilket blockerade Core:s standalone/PWA-safe-area-höjd.
- Därför fick Vision en kortare faktisk header än Dashboard/Publicera trots samma brand-position i Core.
- Alla modulägda `--ccc-header-height`-deklarationer är nu borttagna ur Dashboard och Vision.
- Borttaget ur dashboard.css: 3 deklarationer.
- Borttaget ur vision.css: 4 deklarationer.
- `--ccc-header-height` får nu endast definieras i `ccc-core/core.css`; moduler får bara läsa variabeln.
- Detta gör headerhöjd, PWA safe-area och loggposition till verklig single-source.

CCC v2.8.50 – förenklad Vision-arbetsvy (2026-08-10)
- När minst ett plagg finns döljs startens tre stora actionkort i arbetsläget.
- Aktiv serie visar i stället kompakt antal/markering samt `+ Fota plagg` och `+ Välj bilder`.
- Miniatyrremsan är huvudnavigation mellan plagg.
- Hjälptexten kortad till `Välj ett plagg`.
- `Komplettera markerat plagg` tas bort från huvudytan; komplettering hör till det valda plaggets granskningsflöde.
- `Visa förslag` behålls som primär handling för markerat/klart plagg.
- Local-first-notisen behålls diskret längst ned.

CCC v2.8.51 – Vision gamla startkort bort ur arbetslayout (2026-08-10)
- Grundorsak: v2.8.50 gömde `.vision-start-actions`, men äldre `:has()`-regler kunde fortfarande hålla startsektionen/layouten aktiv.
- Hela startsektionen har nu id `visionStartHome`.
- När Vision går till workspace sätts `visionStartHome.hidden = true`.
- Core/legacy display-regler neutraliseras med `#visionStartHome[hidden]{display:none!important}`.
- Arbetsvyn består därmed bara av kompakt plaggstatus, + Fota plagg, + Välj bilder, miniatyrer och Visa förslag.

CCC v2.8.52 – Vision arbetsvy + manuell AI-layout (2026-08-10)
- Innehåller v2.8.51-fixen där hela gamla tre-kortssektionen tas ur layouten i aktiv fotosession.
- När Automatisk AI-analys är av behålls `Analysera med AI` som frivillig åtgärd för det valda plagget.
- Redigeringsvyn har nu en uttrycklig egen grid-rad för AI-knappen.
- AI-knappen är statisk i dokumentflödet och kan inte längre hamna bakom Rubrik-fältet.
- När AI-knappen är dold tas raden bort naturligt utan att påverka formulärets geometri.

CCC v2.8.53 – kompakt Vision-redigering mobil portrait (2026-08-10)
- Redigeringsvyn komprimeras vertikalt i mobil portrait i stället för att börja scrolla i onödan.
- Statusrad/miniatyr, AI-knapp, Rubrik, Pris, Beskrivning och sekundära val har mindre höjd och tätare spacing.
- Beskrivningsfältet är lägre men fortfarande tydligt redigerbart.
- `Frivilliga tillägg` och `Fler uppgifter` får kompaktare summary-rader.
- `Tillbaka` och `Spara & nästa` ligger i normal grid-flow och har reserverad plats längst ned; de ska inte överlappas av sekundärvalen.
- Extra kompakt breakpoint används på portrait-skärmar under 760 px höjd.
- Grundprincip: försök först få kärnflödet scrollfritt; intern scroll används först när innehållet faktiskt kräver det.

CCC v2.8.54 – spara och återuppta Vision-fotosession lokalt (2026-08-10)
- Aktiv Vision-session kan pausas med `Spara och fortsätt senare`.
- Sessionen lagras lokalt i IndexedDB (`ccc-local-workspace`, store `sessions`) inklusive originalbilder, extra bilder, ordning, markerat plagg, redigeringar, AI-resultat/status och relevanta metadata.
- Inget Firebase används för pausade Vision-sessioner.
- När Vision öppnas igen visas t.ex. `Fortsätt fotosession – 7 plagg`.
- Återupptagning återställer bilderna och arbetsläget från den lokala sessionen.
- Funktionen gäller både Automatisk AI på och av.
- Om en pågående AI-session sparats innan analysen blev klar kan analysen återstartas vid återupptagning när auto-AI fortfarande är aktivt.
- När hela serien avslutas rensas den aktiva sessionsposten; godkända Publicera-utkast ligger kvar separat.
- Local workspace-databasen uppgraderad från version 1 till 2; Publicera synkad till samma DB-version och skapar även `sessions`-store vid behov.

CCC v2.8.55 – AI av: Spara & nästa får inte visa demo (2026-08-10)
- Grundorsak: `moveToNextItem()` skickade alltid nästa plagg till `openReview()`.
- Ett plagg i manuellt läge saknar Vision-resultat, och review-flödet kunde därför falla tillbaka på demodata.
- Ny `openItemForWork()` väljer arbetsvy efter plaggets faktiska analysläge.
- AI av + ej analyserat → tom manuell redigering direkt.
- AI/färdigt förslag → ordinarie förslagsvy.
- `openReview()` har dessutom en skyddsregel som stoppar demo-fallback om ett manuellt oanalys­erat plagg skulle skickas dit från någon annan väg.
- Ingen AI startas automatiskt av `Spara & nästa` när Automatisk AI-analys är av.

CCC v2.8.56 – Spara eller Spara & nästa (2026-08-10)
- Innehåller v2.8.55-fixen: AI av får inte öppna demo-/AI-förslag för nästa plagg.
- Redigeringsvyn har nu tre val: `Tillbaka`, `Spara`, `Spara & nästa`.
- `Spara` sparar aktuellt plagg lokalt och stannar kvar på samma plagg.
- `Spara & nästa` sparar och går vidare enligt befintligt flöde.
- Efter `Spara` kan användaren fortsätta redigera, gå tillbaka, välja annat plagg eller pausa hela fotosessionen.
- Aktiv Vision-session synkas lokalt efter Spara så återupptagning behåller senaste status.

CCC v2.8.57 – Spara & tillbaka (2026-08-10)
- Redigeringsvyns gamla `Tillbaka` ersätts med `Spara & tillbaka`.
- Knappen sparar aktuellt plagg lokalt via samma säkra save-path som `Spara`.
- Efter lyckad sparning återgår Vision till arbetsvyn med miniatyrerna och samma fotosession.
- `Spara` stannar kvar på aktuellt plagg.
- `Spara & nästa` sparar och går vidare till nästa plagg.

CCC v2.8.58 – förenklade sparval (2026-08-10)
- Fristående `Spara` borttagen eftersom den sparade men stannade kvar på samma plagg utan tydlig nytta.
- Redigeringsvyn har nu två tydliga val: `Spara & tillbaka` och `Spara & nästa`.
- `Spara & tillbaka` sparar och återgår till Vision-arbetsvyn/miniatyrerna.
- `Spara & nästa` sparar och öppnar nästa plagg.

CCC v2.8.59 – manuellt Vision-läge städat + återredigering (2026-08-10)
- När valt plagg körs i manuellt läge (`Automatisk AI-analys` av) döljs `Visa förslag` helt.
- Manuella plagg öppnas direkt från miniatyren i redigeringsvyn.
- `approved` betyder nu bara att plagget är sparat till Publicera; det låser inte plagget i Vision.
- Ett redan sparat manuellt plagg kan öppnas, ändras och `Spara & tillbaka` hur många gånger som helst.
- Samma `item.id` används vid IndexedDB `put()`, så senare sparning uppdaterar befintlig lokal Publicera-post i stället för att skapa en dubblett.
- Sparade manuella plagg får en bock i miniatyren utan att markeras som AI-analyserade.

CCC v2.8.60 – felsökning/fix Spara & tillbaka mobil (2026-08-10)
- Grundorsak identifierad: `Spara & tillbaka` väntade på thumbnail/WebP-konvertering och IndexedDB innan navigation. På mobil kunde den asynkrona bildbearbetningen stanna/långdra och lämna knappen låst på `Sparar…`.
- `Spara & tillbaka` läser nu formulärvärdena direkt, markerar plagget sparat och återgår omedelbart till Vision-arbetsvyn.
- Själva bild-/IndexedDB-sparningen sker därefter i bakgrunden med samma item-id, så återredigering uppdaterar samma post.
- Thumbnail-konverteringen har dessutom timeout/fallback: om WebP-konvertering inte svarar används originalfilen i stället för att låsa flödet.
- `Visa förslag`-fixen från v2.8.59 är kvar: manuellt AI-av-läge visar ingen sådan knapp.

CCC v2.8.61 – Vision sparar original, Publicera äger bildbearbetningen (2026-08-10)
- Arkitekturen återställd till beslutad local-first-princip: Vision samlar foton, analys/redigering och metadata men förändrar inte originalbilden.
- WebP-/thumbnail-konverteringen har tagits bort helt ur `saveApprovedDraftLocally()`.
- Vision sparar `originalBlob` + metadata i IndexedDB och markerar posten `imageProcessingState: "original"`.
- `Spara & tillbaka` går tillbaka direkt och sparar original + metadata i bakgrunden; ingen bildkonvertering kan längre blockera den vägen.
- Beskärning/anpassning till plagget, slutlig storlek/upplösning och WebP-komprimering ska göras i Publicera-flödet när publiceringsbilden faktiskt förbereds.
- Originalbilden förblir lokal och orörd tills dess.

CCC v2.8.62 – papperskorg + renare manuellt redigeringsläge (2026-08-10)
- Papperskorg tillagd vid plaggets miniatyr i redigeringsvyn.
- Borttagning tar bort plagget ur den lokala fotosessionen, återgår till plaggöversikten och använder befintlig Ångra-funktion.
- I AI-av/manuellt läge visas inte längre `Redigera medan CCC arbetar`; rubriken blir `Redigera plagg`.
- Status-underraden döljs i manuellt läge.
- `Analysera med AI` finns kvar som frivillt val när AI är tillgängligt.

CCC v2.8.63 – normaliserad local-first-lagring för Vision/Publicera (2026-08-10)
- Grundproblemet i v2.8.54–v2.8.62 åtgärdat: fotosessionen bäddar inte längre in alla originalbilder i en stor IndexedDB-post.
- Databasen `ccc-local-workspace` uppgraderad till version 3 med separat store `vision-files`.
- Varje originalbild sparas separat med stabil filnyckel (`<item-id>:main`); extra bilder får egna nycklar.
- Vision-sessionen (`sessions`) innehåller bara små referenser och metadata: filnycklar, ordning, markerat plagg, redigeringar, AI-status/resultat och godkänd-status.
- Publicera-utkast (`images`) innehåller också bara referens till originalbilden (`originalFileKey`) + publiceringsmetadata; originalet dupliceras inte där.
- Publicera hydratiserar originalbilden från `vision-files` när utkastet öppnas.
- När Publicera senare sparar crop/WebP tas den hydrerade `originalBlob` bort innan `images`-posten skrivs tillbaka, så originalet fortsätter lagras endast en gång.
- Gamla v2-sessioner med Blob direkt i sessionen kan återställas och migreras automatiskt till `vision-files`.
- Gamla Publicera-utkast som redan innehåller `originalBlob` fortsätter fungera.
- `Spara och fortsätt senare` rapporterar nu IndexedDB-fel med `error.name` och `error.message` i konsol/meddelande i stället för enbart generisk feltext.

CCC v2.8.64 – manuell `Analysera med AI` kan inte fastna permanent (2026-08-10)
- Felsökning visade att nätverksanropet redan hade timeout, men stegen före fetch (FileReader, bilddekodning och skapandet av analyskopian) saknade timeout. På mobil kunde UI därför bli kvar på `Analyserar…` utan att fetch-timeouten någonsin startade.
- FileReader och bilddekodning har nu 12 s timeout.
- Analyskopian skapas asynkront via canvas.toBlob med 12 s timeout i stället för synkron toDataURL.
- Hela AI-kedjan har dessutom en yttre säkerhetstimeout på 105 s.
- `Analysera med AI` återställs alltid i `finally`, även vid oväntade fel, så knappen kan inte permanent låsas på `Analyserar…`.
- Vid fel visas ett begripligt AI-fel och befintlig fallback-logik kan fortsätta.

CCC v2.8.65 – manuell AI låst till rätt plagg (2026-08-10)
- Grundorsak: `Analysera med AI` använde en gemensam DOM-knapp och efter await användes det föränderliga `currentIndex`. Om användaren bytte miniatyr medan analysen pågick kunde nästa plagg därför se ut att analysera eller få fel vy/status.
- Varje plagg har nu egen `analysisInProgress`-status.
- Manuell AI fångar plaggets stabila `item.id` när analysen startas.
- Analysresultatet öppnas automatiskt endast om samma plagg fortfarande är markerat när analysen blir klar.
- Byter användaren till nästa bild under tiden visas den bildens egen manuella status och `Analysera med AI`; den startar inte AI automatiskt.
- Den gemensamma AI-knappens text/disabled-läge uppdateras endast för aktuellt valt plagg.

CCC v2.8.66 – manuellt AI-resultat visas direkt (2026-08-10)
- Grundbrist: `Analysera med AI` startades i redigeringsvyn men resultatet försökte öppna separat förslagsvy; AI-fel skrevs dessutom till ett message-element som den kompakta mobil-CSS:en döljer.
- Manuell AI stannar nu i redigeringsvyn.
- När analysen blir klar fyller AI endast tomma formulärfält; värden användaren redan skrivit bevaras.
- Statusraden vid plagget visar `AI-förslag klart – ändra det du vill`.
- AI-knappen döljs när resultatet är klart.
- Vid AI-fel visas feltexten i samma synliga statusrad i stället för i det dolda message-elementet.
- Per-item-race-fixen från v2.8.65 är kvar: resultatet påverkar endast plagget som faktiskt analyserades.

CCC v2.8.67 – kritisk fix: AI-resultatet stoppades av saknad funktion (2026-08-10)
- Faktisk grundorsak hittad: `startSilentAnalysis()` anropade `applyLocalKnowledge(...)`, men funktionen fanns inte längre definierad i `product-lab.js`.
- Följden var att ett lyckat manuellt AI-svar först kom tillbaka, därefter kastades `ReferenceError` innan `visionResult` kunde färdigställas. Fallbacken anropade samma saknade funktion och kunde därför inte heller ge resultat.
- `applyLocalKnowledge()` är återinförd.
- Den använder befintliga `CCC_VISION_KNOWLEDGE.bestMatch()` för att komplettera endast tomma fält; ett AI-resultat får alltid gå vidare även om kunskapslagret skulle ge fel.
- Manuellt AI-resultat kan nu nå v2.8.66-flödet och fylla de tomma redigeringsfälten direkt.

CCC v2.8.68 – originalbilder skrivs faktiskt bara en gång (2026-08-10)
- Felsökning efter `Kunde inte spara – försök igen` visade ett implementationsfel i v2.8.63: trots normaliserad databas körde `saveVisionSessionLocally()` fortfarande `put()` på varje originalfil vid varje sessionssparning.
- Dessutom kunde sessionssparningen starta en ny `put()` samtidigt som den första bakgrundsförlagringen av samma foto fortfarande pågick.
- Varje plagg har nu `originalFileStored` + `originalFileSavePromise`. Om originalet redan är sparat görs ingen ny skrivning; om första skrivningen pågår avvaktas exakt samma promise.
- Extra bilder använder samma modell per bild.
- Återställda sessioner markeras direkt som redan lagrade eftersom filerna precis lästs från `vision-files`.
- `Spara och fortsätt senare` uppdaterar därför i normalfallet endast den lilla sessionsposten efter att kända filskrivningar är klara.
- Vid lagringsfel visar knappen nu även feltypen, t.ex. `QuotaExceededError`, så nästa fel kan identifieras direkt.

CCC v2.8.69 – Tillbaka under förslagsvyn (2026-08-10)
- Förslagsvyn behåller raden: papperskorg, Ändra, Godkänn & nästa.
- En separat diskret `← Tillbaka` ligger direkt under raden.
- Tillbaka går till plaggets/sessionens workspace, samma destination som headerns bakåtpil från förslagsvyn.

CCC v2.8.70 – Publicera läser Vision-sessionen direkt (2026-08-10)
- Första riktiga Vision → Publicera-kopplingen.
- Publicera läser både explicita poster i `images` och bilderna/metadata i den aktiva lokala Vision-sessionen.
- Poster slås ihop på samma `item.id`, så ett redan godkänt Publicera-utkast dupliceras inte.
- Vision-originalet hämtas från `vision-files` och lämnas oförändrat.
- Ingen WebP skapas när Publicera öppnas. WebP/beskärning ligger fortsatt i Publicera och skapas först i bildbearbetningssteget.
- Lokala utkast visar nu även titel/plaggnummer ovanpå miniatyren för enklare test.

CCC v2.8.71 – Publicera visar lokala bilder robust på mobil/PWA (2026-08-10)
- 4-utkast-räknaren i v2.8.70 visade att metadata/IndexedDB-kopplingen fungerade, men själva bildförhandsvisningen byggde på `URL.createObjectURL()` för persistenta Blob-filer.
- Grid-miniatyrer skapas nu primärt som Data-URL från den lokala Blob-filen, vilket är robustare för lokala/persistenta bilder i iOS/PWA.
- Detaljvyn återanvänder samma verifierade bildkälla.
- Bildfel loggas med plagg-ID/MIME och gör ett enda fallback-försök.
- Utkastskorten har minsta höjd så vi kan skilja ett renderingsfel från ett tomt grid.

CCC v2.8.72 – Publicera Lokala utkast: topposition + bildfix samlad (2026-08-10)
- Innehåller v2.8.71-fixen för robusta lokala bildförhandsvisningar.
- `Lokala utkast`-vyn görs till en tydlig flex-kolumn där rubriken alltid ligger överst och miniatyrgridden fyller återstående yta.
- Vid byte till `gridView` nollställs intern scroll och vyn scrollas till sin startposition.
- Klick på `Lokala utkast` renderar gridden först och öppnar sedan vyn från toppen.
- Fokus flyttas till bakåtknappen utan att orsaka scroll, vilket minskar risken att mobilwebbläsaren placerar rubriken längst ned.

CCC v2.8.73 – städad Lokala utkast-vy (2026-08-10)
- Falska tomstatusen `Inget väntar på publicering` döljs explicit när utkast finns.
- `renderGrid()` styr både `hidden` och `display`, så äldre CSS kan inte lämna tomstatusen synlig.
- Miniatyrgridden börjar direkt under rubrik/antal utan reserverad tomstatus-yta.
- Vision → Publicera-dataflödet och v2.8.71-bildvisningen behålls oförändrade.

CCC v2.8.74 – valfri beskärning i Publicera (2026-08-10)
- Beskärningsvyn visar CCC:s föreslagna kvadratiska utsnitt och hela originalet bakom som mörk/suddig referens.
- Användaren kan dra/zooma och välja `Godkänn beskärning`.
- Nytt val `Behåll original` hoppar över beskärningen men skapar ändå en max 1600 px WebP-kopia lokalt.
- `Återställ förslag` återgår till CCC:s ursprungliga centrering.
- Vision-originalet ändras aldrig. Publiceringskopian märks `webp-cropped` eller `webp-original`.

CCC v2.8.75 – miniatyr öppnar rätt detaljvy i Publicera (2026-08-10)
- Grundorsak hittad: `openDetail()` anropade `show("detail")`, men den faktiska sektionens id är `detailView`.
- `show()` gömde därför samtliga riktiga Publicera-vyer och UI föll visuellt tillbaka till skalet/startläget.
- Anropet är korrigerat till `show("detailView")`.
- v2.8.74-funktionerna för valfri beskärning, synligt bortklippt område och Behåll original ingår.

CCC v2.8.76 – kompakt Publicera-detaljvy på mobil (2026-08-10)
- Detaljbildens maxhöjd i portrait sänkt så titel och huvudknappar ryms på samma skärm.
- Detaljvyn är en fast flex-kolumn utan onödig huvudscroll på normal mobilhöjd.
- Titel/meta och actions har kompaktare spacing/typografi.
- `Beskär` har bytt namn till `Anpassa bild`, eftersom nästa vy även erbjuder `Behåll original`.
- Swipe mellan utkast och v2.8.74-bildanpassningen är oförändrade.

CCC v2.8.77 – motivstyrt beskärningsförslag i Publicera (2026-08-10)
- Ersätter ren center-crop med en lokal motiv/saliency-analys som försöker hitta bildens huvudsakliga plagg/motiv.
- Förslaget beräknar motivcentrum, zoom och luft runt motivet innan beskärningsvyn visas.
- Analysen körs helt lokalt i webbläsaren och ändrar inte originalbilden.
- `Återställ förslag` återgår nu till CCC:s motivstyrda förslag, inte till en generisk center-crop.
- Användaren kan fortfarande dra, zooma, Behåll original eller Godkänn beskärning.
- WebP skapas fortfarande först efter användarens val.

CCC v2.8.78 – tajtare motivbeskärning + pinch-zoom + knappfix (2026-08-10)
- Motivförslaget använder en mindre central saliency-kluster och trimmar extrema utliggare, så webbsida/bakgrund runt plagget påverkar utsnittet mindre.
- Säkerhetsmarginalen runt motivet har minskats och föreslagen zoom förstärkts, så plagget fyller större del av publiceringsbilden.
- Mobil beskärning stöder nu riktig tvåfingers pinch-zoom på själva bilden.
- Ett finger fortsätter flytta bilden.
- Zoomreglaget synkas även när pinch används.
- `Återställ förslag` räknar fram CCC:s motivförslag igen.
- Beskärningsvyn får intern scroll vid små skärmar och `Godkänn beskärning` har egen luft under bildytan så den inte hamnar bakom previewn.
- Originalbilden förblir orörd; WebP skapas först efter användarens val.

CCC v2.8.79 – balanserat motivförslag + stabil portrait-layout (2026-08-10)
- v2.8.78 beskärde för aggressivt. Motivklustret är nu något större, fler ytterkanter behålls och säkerhetsmarginalen runt plagget ökas.
- Zoomförstärkningen sänks och maxzoom för automatiskt förslag begränsas till 2.55.
- Målet är hela plagget med lagom luft, inte extrem närbild.
- Portrait-beskärningsvyn använder vanligt vertikalt dokumentflöde i stället för grid, så kontroller och knappar aldrig kan hamna bakom previewn.
- Previewn begränsas till högst ca 46 % av viewport-höjden och behåller kvadratisk form.
- `Godkänn beskärning`, `Behåll original`, `Återställ förslag` och zoomkontrollen ligger alltid efter bildytan och kan nås via intern scroll vid behov.
- Pinch-zoom och drag från v2.8.78 finns kvar.

CCC v2.8.81 – Publicera prestandagrund (2026-08-10)
- Byggd på v2.8.79:s stabila beskärnings/layout-bas; v2.8.80:s sämre auto-crop tas inte vidare.
- Publicera visar antal utkast direkt och bygger förhandsvisningar i bakgrunden.
- En liten decoded-image-cache håller aktuell + närmaste grannbilder redo (max 3).
- När detaljvyn öppnas förladdas aktuell, föregående och nästa bild.
- När Lokala utkast öppnas värms första bildgruppen upp direkt.
- Ingen visuell redesign i denna version; fokus är snabbare öppning och grund för levande swipe.

CCC v2.8.82 – levande swipe mellan plagg i Publicera (2026-08-10)
- Detaljvyn har nu tre bildlager: föregående, aktuell och nästa bild.
- Aktuell bild följer fingret horisontellt medan användaren drar.
- Nästa/föregående bild kommer samtidigt in från rätt sida.
- Svep under ca 26 % av bildbredden fjädrar tillbaka till aktuell bild.
- Tillräckligt långt svep animerar färdigt på ca 260 ms och byter sedan aktivt plagg.
- Vertikal gest lämnas fri för vanlig scroll.
- v2.8.81:s cache/förladdning används för grannbilderna så animationen inte behöver vänta på bildinläsning.
- Byggd fortsatt på v2.8.79:s stabila beskärningsbas.

CCC v2.8.83 – mjukare swipe + beskärningsfinputs (2026-08-10)
- Levande swipe från v2.8.82 är kvar men avslut/återfjädring är mjukare: 340 ms och rundare easing.
- Draget har lätt dämpning i ytterläget så övergången känns mindre mekanisk.
- Swipe-tröskeln sänkt något till ca 23 % av bildbredden.
- Beskärningen fortsätter på v2.8.79:s stabila heuristik, inte v2.8.80:s konturförsök.
- Beskärningsförslaget har endast försiktig finputs: lite mer säkerhetsmarginal och något lägre automatisk zoom för att minska risken att ärmar kapas.
- Portrait-previewn är marginellt mindre och Godkänn beskärning hålls tydligt i normalt vertikalt flöde under bilden.
- Förladdning/cache från v2.8.81 är kvar.

CCC v2.8.84 – tyngre swipe + sidberoende ärmsäkerhet (2026-08-10)
- Swipe-animationen är nu 480 ms med mjukare inbromsning och mindre snärt.
- Under själva draget följer bilden fingret nästan 1:1; motstånd kommer främst nära ytterläget.
- Slutanimationen väntar 490 ms innan aktivt plagg byts, synkat med animationen.
- Beskärningen bygger fortsatt på v2.8.83/v2.8.79-baslinjen som hittills fungerat bäst.
- Ny sidberoende säkerhetsmarginal: om plaggets föreslagna motivcentrum ligger tydligt åt vänster/höger får samma yttersida extra horisontell luft.
- Syftet är att minska risken att en fotbollströjas yttersta ärm kapas utan att ge alla centrerade plagg onödigt stor bakgrund.
- Automatisk zoom sänks marginellt när säkerhetsmarginalen används.

CCC v2.8.85 – stabil bildidentitet + asymmetrisk ärmsäkerhet (2026-08-10)
- Miniatyrer öppnar nu utkast via stabilt `item.id` i stället för ett fångat numeriskt index.
- Efter flera swipe och tillbaka till miniatyrerna renderas gridden om; klicket löser alltid aktuellt index från plaggets id.
- Swipe låser också målplaggets id när animationen startar och löser indexet igen när animationen avslutas.
- Detta förhindrar att fel bild kan öppnas efter en längre swipe-session.
- Beskärningens ärmsäkerhet ändrad från symmetrisk extra marginal till asymmetrisk omcentrering.
- Om plagget ligger åt vänster flyttas crop-förslaget vänster för att få med vänster ärm och samtidigt kapa mer skräp på höger sida; spegelvänt åt höger.
- Automatisk zoom är marginellt försiktigare. Grundalgoritmen från v2.8.79/v2.8.83 behålls.
- Den tyngre/mjukare swipen från v2.8.84 är kvar.

CCC v2.8.86 – swipe-race fix + försiktig crop-bas för jämförelsetest (2026-08-10)
- Kvarvarande felbildsbugg identifierad som en race: en pågående swipe hade ett fördröjt commit-timeranrop som kunde köras efter att användaren gått tillbaka till miniatyrerna och klickat på ett nytt plagg.
- Swipe-commit-timern spåras nu explicit och avbryts både vid `Tillbaka` och när ett plagg öppnas direkt från miniatyrerna.
- `syncSwipeNeighbors()` hårdsynkar även aktuell huvudbild till det aktiva item-id:t.
- Beskärningen görs medvetet mer försiktig inför 4-bildstestet: större säkerhetsmarginal, lägre sidförskjutning och max automatisk zoom 1.85.
- Auto-crop prioriterar nu hellre lite extra bakgrund än att kapa en ärm. Manuell drag/pinch finns kvar för sista justeringen.
- Mjuk/tyngre swipe från v2.8.84/v2.8.85 behålls.

CCC v2.8.87 – rätt detaljbild + direkt tillbaka + balanserad crop (2026-08-10)
- Grundorsaken till `rätt text men fel bild` hittad: `syncSwipeNeighbors()` kördes medan `detailView` fortfarande var hidden. Swipe-ytans bredd blev då ~0 px och nästa/föregående lager kunde hamna nästan ovanpå aktuell bild.
- `openDetail()` visar nu detaljvyn först och synkar swipe-lagren i nästa animation frame när verklig bredd finns.
- Aktuell bild har explicit z-index över grannbilder när vyn är centrerad.
- Crop-pilen går nu direkt tillbaka till `Lokala utkast`/miniatyrgridden, inte via detaljvyn.
- Auto-crop backar från v2.8.86:s alltför lösa maxzoom: max 2.08 och nära neutral zoomfaktor.
- Ärmskydd sker främst genom starkare asymmetrisk omcentrering mot plaggets sida, så motsatt sida kan tappa mer skräp utan att ytterärmen offras.

CCC v2.8.88 – single-source detail state + crop calibration (2026-08-10)
- Detaljvyn har nu `activeItemId` som enda identitet för aktivt plagg.
- Titel, metadata, huvudbild, swipe, crop, Behåll original och publiceringsstatus resolveras från samma aktiva item.
- `activeIndex` synkas från `activeItemId` och används endast som positionsinformation i listan.
- Swipe-commit uppdaterar item-id och index tillsammans; direkt miniatyrklick etablerar nytt aktivt item innan UI synkas.
- Vid tillbaka till miniatyrgridden nollställs aktiv detaljidentitet.
- Crop-algoritmen byts inte ut igen. v2.8.87-baslinjen kalibreras försiktigt: lägre max autozoom (1.96), mildare sidförskjutning och liten extra horisontell sleeve-safety.
- Syftet med v2.8.88 är stabil grund inför de fyra fasta tröjtesterna, inte ny funktionalitet.

CCC v2.8.91 – kontrollerad crop-rollback + en enda ändring (2026-08-10)
- Alla senare stabilitetsfixar från v2.8.88 behålls: activeItemId/single-source detail state, rätt bild/text/crop, swipe, tillbaka till miniatyrer och cache.
- Crop-algoritmen är återställd exakt till v2.8.83-baslinjen, som användaren bedömde som bäst hittills.
- Endast en crop-ändring görs jämfört med v2.8.83: den befintliga säkerhetspaddingen ökas från 16 % till 20 % för lite mer luft kring ärmarna.
- Ingen normal/svår-bild-klassificering, ingen tvåpassmotor och inga andra nya crop-regler finns med.
- Syfte: testa en variabel i taget mot de fyra fasta fotbollströjorna.

CCC v2.8.92 – crop diagnostics (2026-08-10)
- Ingen ändring av crop-algoritmen jämfört med v2.8.91.
- Ny utvecklingsknapp `Visa crop-data` i Anpassa bild.
- Diagnostiken visar källa, zoom, X/Y-förskjutning, bildens fyllnadsgrad i crop-rutan samt vänster/höger/topp/botten-marginal.
- Diagnostiken uppdateras live när användaren drar eller zoomar.
- Syftet är att mäta de fyra referenströjorna innan nästa crop-parameter ändras.

CCC v2.8.93 – X-only optical centering (2026-08-10)
- Bygger exakt vidare på v2.8.92/v2.8.91 crop-baslinje.
- Endast en crop-ändring: om det detekterade motivets centrum ligger mer än ca 4 % från bildens horisontella centrum får cropen en mild X-korrigering mot motivet.
- Zoom, Y-position, motivdetektion, crop-storlek och 20 % säkerhetspadding från v2.8.91 är oförändrade.
- `Visa crop-data` från v2.8.92 finns kvar för jämförelse mot de fyra referenströjorna.
- Alla senare stabilitetsfixar för activeItemId, rätt bild/text/crop, swipe och navigation är kvar.

CCC v2.8.94 – adaptiv X-centrering (2026-08-10)
- Bygger direkt på v2.8.93.
- Endast X-centreringen ändras.
- Horisontell motivförskjutning under 4 % lämnas orörd.
- 4–8 % ger mild korrigering, 8–12 % medelstark korrigering och över 12 % starkare korrigering.
- X-korrigeringen har ett hårt tak på 8,5 % av crop-bredden för att undvika överkorrigering.
- Zoom, Y-position, crop-storlek, motivdetektion, 20 % ärm/säkerhetspadding och diagnostiken är oförändrade.
- Alla stabilitetsfixar för activeItemId, swipe och navigation är kvar.

RC1 2.8.95
- top inset heuristic

CCC v2.8.95 RC1 – paired collar/shoulder lock (2026-08-10)
- Full project package built from the complete GitHub ZIP.
- Crop baseline restored to the known-good v2.8.94 implementation before this change.
- One crop change: paired upper-edge detection. If strong top-edge points occur on both sides of the subject at similar height, minY is extended upward slightly so a V-neck/collar is not discarded when its centre blends into the background.
- Adaptiv X-centrering, zoom, 20 % crop padding, swipe, navigation, diagnostics and activeItemId are unchanged from v2.8.94.
- Previous experimental RC1 topInset/low-contrast code is not included.
- Root /version.js is preserved byte-for-byte from the complete GitHub ZIP.

CCC v2.9.0 – Beskär Layout (2026-08-11)
- Crop Engine 1.0 från v2.8.95 RC1 är oförändrad.
- Beskär-vyn komprimerad för mobil utan scroll.
- Hjälptext, crop-note och synlig crop-data bort från vyn.
- Tillbaka-knappen flyttad visuellt till headerns vänstersida.
- Bildräknaren visas inne i crop-bilden.
- Zoom-slidern borttagen. Pinch och drag kvar.
- Dubbeltryck växlar zoom 100 % → 130 % → 180 % → 100 %.
- Diskret zoomknapp öppnar [-] procent [+] för finjustering.
- Original / Återställ / OK ligger på samma rad.
- Root /version.js bevarad exakt från tidigare fulla projektpaket.


CCC v2.9.5 – kompakt utkastgrid (2026-08-11)
- Publicera > Lokala utkast visar nu rena miniatyrer utan titeltext.
- Mobilvyn använder 4 x 4 miniatyrer, 16 utkast per sida.
- Fler än 16 utkast delas upp i sidor som kan bytas med horisontell swipe; diskreta sidprickar visar aktuell sida.
- Tryck på en miniatyr öppnar befintlig detaljvy där stor bild, titel/metadata och swipe mellan utkast finns kvar.
- Ingen ändring av Vision-original, crop engine eller publiceringsbildens behandling.


CCC v2.9.6 – 3x3 utkastgrid + fokusmarkering (2026-08-11)
- Publicera > Lokala utkast använder nu 3 x 3 miniatyrer, 9 utkast per sida.
- Fler än 9 utkast delas upp i swipebara sidor; sidprickarna är kvar.
- Titeltext är fortsatt borttagen från miniatyrerna; titel/metadata visas i detaljvyn.
- Webbläsarens tillfälliga blå fokusram på bland annat Tillbaka-knappen döljs för touch/musklick.
- Vid riktig tangentbordsnavigation används i stället en guldfärgad CCC-fokusmarkering.
- Vision-original, crop engine och publiceringsbildens behandling är oförändrade.


CCC v2.9.7 – långtryck snabbkoll i utkastgrid (2026-08-11)
- Publicera > Lokala utkast behåller 3 x 3-grid och 9 utkast per sida.
- Vanligt tryck på miniatyr öppnar detaljvyn som tidigare.
- Håll fingret stilla på en miniatyr i ca 0,75 s för en snabb stor förhandsvisning ovanpå gridden.
- Förhandsvisningen ligger kvar medan fingret hålls nere och krymper tillbaka snabbt när fingret släpps.
- En rörelse över ca 12 px avbryter långtrycket så swipe mellan gridsidor inte blockeras.
- Långtryck öppnar inte detaljvyn efteråt; webbläsarens native touch-callout/contextmeny blockeras på miniatyrerna.
- Vision-original, crop engine, detalj-swipe och publiceringsbildens behandling är oförändrade.


CCC v2.9.8 – mjukare snabbkoll + blåmarkering bort (2026-08-11)
- Långtryckets stora förhandsvisning växer nu upp mjukare och lite långsammare (ca 0,32 s).
- När fingret släpps krymper bilden tillbaka snabbt (ca 0,22 s).
- WebKit/iOS/Chrome tap-highlight och text/bildmarkering blockeras på miniatyrkorten för att undvika blå markering vid långtryck.
- Riktig tangentbordsfokus behåller CCC:s guldfärgade fokusindikering.
- 3 x 3-grid, 0,75 s långtryck, swipe, detaljvy, Vision-original och crop engine är oförändrade.


CCC v2.9.9 – pilnavigation i detalj/Anpassa bild (2026-08-11)
- Fixar att vänster/höger-pilarna i bildens detaljvy inte bytte aktivt utkast trots att swipe fungerade.
- Piltangenterna använder nu samma `next(delta)`/`openDetail()`-flöde som den fungerande swipe-navigationen, så bild, titel, metadata och activeItemId hålls synkade.
- Bindningen känner igen befintliga föregående/nästa-knappar via id, klass, aria-label/text eller äldre inline-anrop och kräver ingen ändring av crop engine.
- Swipe, 3 x 3-grid, långtrycks-preview, Vision-original och crop-beteende är oförändrade.


CCC v2.9.10 – Publicera-start förenklad
- v2.9.9 pilfix i Anpassa bild ingår.
- Publicera-start: Förbered för publicering / Välj kanal / Historik.
- Tillbaka-kortet borttaget. Headerns tillbaka-pil är aktiv även på startvyn och går där till Dashboard.
- Välj kanal har egen vy; Hemsidan/Container13 är första kanalen, fler kanaler senare.
- Historik ersätter tidigare Publicerade.
- Befintlig 3x3-grid, långtrycks-preview, fokusfix och cropflöde behållna.


CCC v2.9.11
- Fix: synliga vänster/höger-pilar i detaljvyn är nu riktiga interaktiva kontroller och använder samma openDetail/next-flöde som swipe.
- Fix: långtrycks-snabbkoll använder en sammanhängande transform-animation tillbaka till miniatyren för att undvika slutligt hopp/hack.


CCC v2.9.12 – sparad bildanpassning (2026-08-11)
- Anpassa bild sparar zoom/position icke-destruktivt; Vision-originalet lämnas orört.
- Knapparna heter Behåll hela bilden / Återställ anpassning / Spara anpassning och har luftigare layout.
- Återställ anpassning återgår till CCC:s ursprungliga beskärningsförslag.

CCC v2.9.13 – stabil detaljvy + fri utzoomning (2026-08-11)
- Detaljvyn reserverar fasta zoner för bild, titel/metadata, åtgärdsknappar och status så pris eller varierande metadata inte flyttar knapparna vid swipe.
- Synliga vänster/höger-pilar är klick-/touchbara ovanpå swipeytan och använder samma next/openDetail-flöde som swipe.
- Anpassa bild tillåter utzoomning under cover-nivån utan att tvinga tillbaka zoom till 100 % när fingrarna släpps.
- Miniatyrerna använder contain-visning och prioriterar sparad publiceringsbild när sådan finns, så de bättre speglar den sparade bildanpassningen.
- README_CHATGPT_CCC åter ikapp med leveransregeln.


CCC v2.9.14 – naturligt bildläge före Anpassa bild (2026-08-16)
- Fixar fel där ett utkast med sparad publicerings-WebP kunde visas redan zoomat/beskuret i miniatyrgridden och detaljvyn.
- Miniatyr och detaljvy prioriterar nu lokal thumbnail/originalbild för visning; sparad publishBlob används fortsatt som publiceringskopia och status.
- Efter Spara anpassning återgår detaljvisningen till samma naturliga preview-källa i stället för att byta till den beskurna WebP-kopian.
- Anpassa bild fortsätter att öppna Vision-originalet och Crop Engine 1.0 är oförändrad.
- Root /version.js är orörd.


## CCC v2.9.16 – 2026-08-17
- Publicera detaljvy: bildräknaren (t.ex. “7 av 7”) flyttad till en egen centrerad position ovanför bildytan.
- Samma placering används i normal detaljvy och i “Anpassa bild” så räknaren inte hoppar åt höger när bildytan ändrar storlek.
- Pill-design, navigeringspilar och övrig detaljvy lämnas oförändrade.

CCC v2.9.17 (2026-08-17)
- Publicera: endast den raka Core-skiljelinjen under modulhuvudet ska synas; extra kant/kurva i Förbered/Detalj/Anpassa är borttagen.
- Samma yttre bildyta används i detaljvyn och Anpassa bild. Crop-vyn ska inte växa jämfört med föregående vy.
- Bildräknaren ligger fortsatt centrerad ovanför bildytan i båda lägena.

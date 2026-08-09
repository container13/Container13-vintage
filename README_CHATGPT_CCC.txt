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

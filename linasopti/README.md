# Aktuella filer och historik

Aktuella projektfiler ligger i denna mapp. [Äldre handoff- och Worker-filer finns i historikarkivet](history/legacy/README.md). [Genomförd rensningslista](LINA_CLEANUP_PROPOSAL.md).

# Automatisk GitHub-överföring — användarbeslut 2026-10-03

Dokumentationsrevision: **1.1** · Uppdaterad: **2026-10-03**. Revisionen gäller README-rutinen; appens release anges fortsatt i `linasopti/version.js`.

Användaren har godkänt att samtliga färdiga filer som assistenten skapar eller ändrar för användarens projekt automatiskt förs över till GitHub, utan ny bekräftelse för varje uppladdning. Detta gäller även filer som tidigare överfördes manuellt och publicering i det godkända offentliga projekt-repot.

- Identifiera rätt repo, gren och sökväg för respektive projekt före skrivning. För Lina: `container13/Container13-vintage`, gren `ccc-demo-public-test`, katalog `linasopti/`.
- Kontrollera färdiga filer före överföring; vid koduppdateringar överförs endast nya eller ändrade filer. Bevara samtidiga ändringar och använd aldrig force-push för denna rutin.
- Läs tillbaka uppladdade filer och verifiera exakt innehåll; rapportera commit och eventuella blockerade överföringar. Påstå inte att en fil är sparad innan överföringen är verifierad.
- Befintlig fryst evidence får aldrig skrivas över. Ny evidence sparas separat med sin faktiska status.
- GitHub-lagring av Worker-kod är inte en Cloudflare-deploy. Behåll leverans med ett-klick-kopiering när manuell inklistring behövs.
- Tillståndet gäller filöverföring; det ändrar inte forskningsbeslut, Gen8-frysning, Gen9-godkännande eller Handel/Forward-gates. Hemligheter och inloggningsuppgifter ska inte ingå i projektfiler.

Detta dokumenterar arbetsrutinen i projektet; det är inte en bekräftelse på att ChatGPTs globala minne har uppdaterats.

---

# Gen9 datapaket – kandidat, EJ GODKÄNT

16 aktier, 20128 OHLC-rader, 1258 handelsdatum 2020–2024. Struktur, datumserie och hash kontrollerade. Motorns verkliga datagrind avvisar paketet. Ingen forskning har körts.

**Importera inte detta som verifierad forskningsdata.** Ändra inte verifieringsflaggorna för att kringgå grinden.

Normaliserad SHA-256: ae6e8ac4a54fe485ccdc207b5bdfbf63c495d08113d41c30ee7eba071f5adb12
Original SHA-256: cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c

manifest.json innehåller alla verifieringsluckor och definition av hashen. SOURCE_gen9-data.json är byte-identiskt mottaget original. data.json innehåller endast d/o/h/l/c, utan prisförändringar. candidate-package.json är ett förberett importformat som fortfarande blockeras. checks.json redovisar faktisk motorkontroll.

FDX: utdelningsskala skiljer mellan källorna; ingen leverantörsorsak bevisad. GM 2023-06-05: Yahoo H 34,45, Alpaca H 34,49; Twelve H under O och därför ogiltig. Överensstämmelse mellan Yahoo/Twelve bevisar inte oberoende källa. Övriga OHLC-/corporate-action-luckor anges i manifestet.

Gen8 är orörd. Gen9 olåst/inte startad. Ingen frontend- eller Workerändring krävs för detta granskningspaket.

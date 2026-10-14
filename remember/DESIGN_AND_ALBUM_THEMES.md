# Remember – låst design och albumteman (2026-10-14)

## Två separata designlager
1. **Appens fasta bakgrunder:** Inloggning, Mina album, Skapa album, Titta på minnen och Inställningar/profil använder fem samhörande, varma fotografiska motiv (träbord, fotografier, mjukt solljus). Dessa är INTE albumteman. Utgå från godkänd skiss; undvik för stora rubriker, fält och knappar.
2. **Albumets eget tema:** Påverkar enbart det specifika albumets presentationsvy, även via delningslänk/QR. Får inte byta bakgrund på appens övriga sidor.

## Val vid Skapa album
- Förval: standardtema.
- Färdiga teman: Nostalgi, Fest, Semester, Bröllop, Natur, Minimalistiskt.
- Eget foto: uppladdning, förhandsvisning, beskärning/positionering för stående och liggande format, läsbar toning.
- Valet sparas per album och kan ändras av albumägaren efteråt.
- Möjlighet att använda bakgrundsfotot som albumomslag i Mina album.
- Befintliga album utan temadata använder standardtema (bakåtkompatibilitet).

## Genomförande och kontroll
- Verifiera befintlig datamodell och behörighetsregler innan schema-/lagringsändringar.
- Albumägaren får ändra temat; gäster får läsa publicerat tema men inte redigera det.
- Validera filtyp/storlek, lagra bilder säkert och begränsa tillgång efter albumets åtkomstregler.
- Behåll inloggning, QR-åtkomst och övrig funktionalitet.
- Anpassa för mobil, surfplatta och dator; skydda textkontrast och prestanda.
- Byt appens fem bakgrunder till rena motiv utan inbakad text/UI; säkerställ rätt bildutsnitt på olika skärmar.
- Ingen release får kallas klar förrän synlig publicering och mobil-/desktopvy är verifierade.
- Varje faktisk kodändring ska få nytt versionsnummer.

Status: Detta dokument låser beslutade krav. Det innebär INTE att UI, bildfiler, databas eller publicering är genomförda.

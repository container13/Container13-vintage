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


Implementation candidate0.1.20: exact background/view mapping and verification limits are in BACKGROUND_VERIFICATION_0.1.20.md. Per-album themes remain out of this change.


## Latest user correction and candidate 0.1.21 — 2026-10-14
User says ordinary accounts must see no webmaster information and the0.1.20 mobile Dashboard is too busy with very blurry backgrounds. Screenshot observed: duplicate Mina/Dina album headings, two help paragraphs, expanded welcome/identity card. Source diagnosis: four supplied motifs have only469–762px width, background cover enlarges them and their upper room/window areas are already deliberately out of focus; backdrop blur further softens panel regions.
Implemented: one Mina album heading, album list and create CTA; account identity/password/logout folded under Konto. Warm design retained; effective panel backdrop filters removed. Reuse the existing approved1536×1024 inloggning.webp across app shell views, center/bottom mobile crop. The other four original images are retained unchanged for future higher-resolution replacements. This supersedes0.1.20's per-view/profile motif mapping; no new illustration or synthetic enlargement. Physical perceived sharpness remains user acceptance, not guaranteed.
Webmaster tools are default-hidden on login and Dashboard and revealed only after existing remember-webmaster installation_status endpoint returns HTTP success AND authorized===true. Ordinary403 and service error produce no technical text in normal UI. Shared helper is remember-account-access.js. Session changes hide tools immediately; stale async role/action replies cannot reveal the previous account's tools. Protected backend endpoints still authorize every operation; no backend permission/database changes.
Tests:21 rendered fixture states at mobile/tablet/desktop, no overflow; eight role fixtures across both pages (403,503,200, delayed positive response after logout); regression of login choices, album retry, account folding, owner QR/upload navigation, legacy-link protection, invalid guest link, registration initialization/error and portrait/landscape overflow. STATIC/FIXTURE PASS; publication and live check pending. Real ordinary/webmaster authenticated tests and physical-device acceptance still pending. No real data or links changed.

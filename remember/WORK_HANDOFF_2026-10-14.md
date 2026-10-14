# Remember – överlämning till ChatGPT Work (2026-10-14)

## Läs först
1. Läs denna fil och `remember/DESIGN_AND_ALBUM_THEMES.md`.
2. Kontrollera aktuellt repo och gren innan någon ändring. Repo: `container13/Container13-vintage`, gren: `ccc-demo-public-test`.
3. Läs projektets CURRENT_STATE/INSTALLATION_CHECK och relevanta projektmallar/masterregler innan utveckling. Kontrollera externa tjänster, anslutningar och behörigheter tidigt.
4. Bevara all befintlig funktionalitet. Minsta faktisk ändring = nytt versionsnummer. Rapportera bara verifierade resultat; inga påståenden om publicering utan kontroll.

## Bakgrund och designbeslut
- Remember är en återanvändbar albumtjänst för fester/resor, utvecklad ur Micke50.
- Godkänd riktning: varm, fotografisk och nostalgisk, träbord med utspridda fotografier och mjukt gyllene solljus. Elegant Remember-typografi; mindre, balanserade rubriker och formulär, halvtransparenta mörkbruna paneler. Den tidigare skissen är referens; ändra inte till en generisk mörkgrön app.
- Fem fotografiska bakgrunder till APPENS vyer (inloggning, Mina album/dashboard, Skapa album, Titta på minnen, Inställningar/profil). De är separata från albumteman. Använd rena bilder utan inbakad UI/text, mobil/surfplatta/dator, läsbar överläggstoning.
- Albumägare ska kunna välja per-album-tema (Nostalgi, Fest, Semester, Bröllop, Natur, Minimalistiskt) eller eget foto som bakgrund, med förhandsvisning, beskärning/positionering, läsbarhet och möjlighet till omslag. Gäller även delad albumvy, inte appens övriga vyer. Behörighet och lagring ska verifieras före implementation.
- Mobilvyer får inte nypzoomas utom uttryckligen tillåten bildvisning. QR-gäst ska kunna se/ladda upp enligt albumregler utan att behöva logga in. Albumägaren anger e-post. Tyst retry vid tillfälliga avbrott.
- Följ projektmallar för samma utseende, mobilregler, tydliga hjälptexter och kopierasymbol när användaren ska kopiera föreslagen text.

## Faktiskt genomfört och verifierat i GitHub
- `remember/DESIGN_AND_ALBUM_THEMES.md`: beslut och avgränsningar dokumenterade.
- `remember/remember-design.css`: delad grunddesign skapad, internt märkt v0.1.17.
- `remember/login.html` och `remember/dashboard.html`: delad CSS länkad och body-klassen `remember-shell` införd på grenen. Dashboardens synliga versionsetikett ändrad till 0.1.19. Dessa ändringar har kontrollerats genom återläsning från GitHub, INTE visuellt i webbläsare.
- Inloggningens gamla Unsplash-bakgrund ligger fortfarande i tidigare CSS. Nya bilder är INTE bekräftat uppladdade till GitHub. Färdig visuell publicering är INTE verifierad.
- Inga albumtema-databasändringar eller fullständig UI-implementation har verifierats.

## Bildpaket och omedelbart nästa steg
- Bildpaket: `remember-bakgrunder.zip`, fem WebP-bilder. Bifoga paketet i Work; förlita dig inte på att det finns i GitHub. Originalreferenser kan också finnas i chatten.
- Använd Work för att packa upp och ladda upp exakt fem WebP-bilder i `remember/assets/backgrounds/` på `ccc-demo-public-test`. Bevara kvalitet. Kontrollera filnamn, faktiska filstorlekar och att GitHub kan servera bilderna.
- Koppla därefter bilderna till rätt appvy i delad CSS/HTML, avlägsna gamla bakgrundsberoenden och verifiera publicerad mobil- och desktopvy. Bevara befintlig auth, album, QR och gästfunktioner.
- Fortsätt sedan med albumteman först efter kontroll av Supabase-datamodell, RLS, lagring och behörigheter.
- Var särskilt noga med att det användaren godkänner visuellt är det som faktiskt implementeras. Visa aldrig en illustrerad mockup som om den vore verklig produkt. Användaren har uttryckligen sagt att fler illustrationer inte behövs.

## Övrig funktionell bakgrund att kontrollera mot CURRENT_STATE
- Album med namn och tidsfönster; fest ca 24 h, resa plus 24 h, webbmaster kan ändra tider. QR/länkdelning, mobilvänlig foto-uppladdning, komprimerad lagring.
- Plan: gratis 10 bilder med uppgraderingsmöjlighet; kontrollera om implementerat innan påstående.
- Inloggning med lösenord och e-postlänk finns i projektet. Tidigare test har bekräftat att album kunde sparas och delningslänk fungerade; kör om relevanta tester innan release.
- En äldre Supabase-installation/åtkomst har verifierats tidigare, men kontrollera aktuell behörighet och miljö igen.

## Överlämningsregel
Vid nytt chattbyte: läs detta dokument, DESIGN_AND_ALBUM_THEMES, aktuell state, faktiska källfiler och senaste commits. Fortsätt från verifierad status, inte från antaganden. Dokumentera varje betydande beslut, implementering, test och kvarstående fel i GitHub.


## Latest checkpoint — 2026-10-14 — UI 0.1.20 (supersedes older next-step directives)
User authorized exact five-image upload/mapping and subsequently a broader concrete improvement review. Candidate0.1.20 prepared with original WebP assets, shared background mapping and warm legible panels. Existing profile is the Dashboard details section; its open state uses profil.webp. No new illustration or theme/database implementation. Old login Unsplash background removed; welcome-book photos are content and preserved.
Concrete fixes: broken CTA CSS from literal backslash-n; silent album-list error→visible retry; registration waits for initialization; owner upload goes directly to existing guest link, without automatic replacement. Auth/API permissions, camera, quota, album storage and QR generation are preserved.
Source/fixture tests PASS; publication/readback still pending at this checkpoint. See BACKGROUND_VERIFICATION_0.1.20.md for exact assets, tested viewport/fixture scope and remaining device/E2E gates. Actual Supabase preflight is schema10,2 albums,3 ready photos and private bucket, superseding earlier counts only; no backend writes. Full release remains PENDING/UNVERIFIED.


## Publication evidence — 2026-10-14
- Runtime commit: `732369e79e6c5071af3288e1bed4b4bc030cf210` on `ccc-demo-public-test`.
- Exact GitHub readback PASS for all17 paths (5 binary assets +12 text files). Tree matched local expected tree exactly. Ref updated with expected SHA, no force.
- Pages run `38568594091`: completed/success for the runtime commit.
- All5 public assets: HTTP200, image/webp, decoded as valid WebP, exact original bytes. All6 HTML files +shared CSS also match public bytes exactly.
- Actual Chrome desktop at container13.se: login0.1.20, correct photographic background visible, SDK initializes/enables login controls, no horizontal overflow. Registration correct background, controls and SDK initialization PASS. Album with no guest token shows denial and hides upload.
- Actual HTTP negative regression: owner-manager/list without session401; photo-gallery without session401; guest-metadata invalid token200/found=false. No privileged bypass and no test writes.
- Responsive mobile/tablet checks are the21 local rendered fixtures listed above, not live physical-device PASS. Additional live testing through local headless networking was unavailable; cloud Chrome desktop provided actual client evidence.
- Authenticated live album/QR/upload regression and physical iPhone/Android remain UNVERIFIED. Overall product stays PENDING; this is a scoped deployed UI improvement.
- Documentation-only verification updates do not change version0.1.20.

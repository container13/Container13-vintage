# MICKE50_ARCHIVE — återställnings- och avvecklingsunderlag

**Datum:** 2026-10-17  
**Status:** Dokumentation av källkod och kända integrationer. **Inte ett godkännande att radera Supabase.**  
**Omfattning:** Micke50 (festalbum), inte Container13 Remember.  
**Princip:** Verifierade fakta skiljs från uppgifter som måste kontrolleras i Micke50s eget Supabase-projekt. Inga hemligheter sparas här.

## 1. Supabase-projekt

| Fält | Värde | Underlag/status |
| --- | --- | --- |
| Projektnamn | **Ej verifierat** (Micke50-projektet) | Supabase-projektlista ger inte åtkomst till detta projekt i nuvarande anslutning |
| Projekt-ID / project ref | `qcchvqahibbbpijhtwsh` | GitHub Actions-deploy, admin- och tidigare gästkod |
| Region | **Ej verifierad** | Måste läsas i Micke50s Supabase Dashboard |
| API-bas | `https://qcchvqahibbbpijhtwsh.supabase.co` | Källkod |
| Dashboard | https://supabase.com/dashboard/project/qcchvqahibbbpijhtwsh | Härledd projektlänk; åtkomst ej verifierad |
| Edge Functions-bas | `https://qcchvqahibbbpijhtwsh.supabase.co/functions/v1/` | Källkod |

**VIKTIGT:** Remember är ett **annat** Supabase-projekt, `container13-remember`, ref `wykvztfmfbboxiqvuvwr`, region `eu-north-1`. Använd aldrig Remember-projektets uppgifter för att avveckla eller återställa Micke50.

## 2. Databas och Storage

### Databastabeller

**Ej inventerade / ej verifierade.** Micke50s gästkod använder Supabase Storage direkt och visar ingen egen databastabell. Det **bevisar inte** att projektet saknar egna tabeller, vyer, funktioner, policies, Auth-användare eller andra resurser. Före avveckling: inventera `public` och eventuella egna scheman, migrationer, RLS, triggers, SQL-funktioner, schemalagda jobb och Auth-inställningar via Micke50-projektet.

### Storage

| Resurs | Uppgift | Status |
| --- | --- | --- |
| Bucket | `Micke50bilder` | Verifierat i gäst- och admin-källkod |
| Åtkomst | Koden bygger publika bild-URL:er via `/storage/v1/object/public/` och `getPublicUrl` | Verifierat kodberoende; bucketens faktiska `public`-flagga måste kontrolleras |
| Gästuppladdning | Tidigare `POST /storage/v1/object/Micke50bilder/<fil>` med publishable key och `x-upsert:false` | Verifierat i återställningsbar äldre `index-original.html` |
| Listning | Tidigare `POST /storage/v1/object/list/Micke50bilder`; admin-Edge Function kan lista med service role | Verifierat i källkod; aktuell policy ej verifierad |
| Borttagning | Admin-Edge Function stöder `delete` efter PIN-kontroll | Verifierat i källkod; driftsstatus ej verifierad |
| Maxstorlek/MIME, policies, storleksgränser, objektantal, antal mappar, retention | **Ej verifierat i Supabase** | Kräver dashboard-/SQL-inventering |

**Bildarkiv:** Användaren har uppgett en nedladdad ZIP med **68 originalbilder**, cirka **152 MB**, benämnd `Micke50_alla_bilder.zip` (en uppladdad lokal kopia har också namnet `Micke50_alla_bilder(1).zip`). En tidigare kontroll i chatten rapporterade 68 läsbara bilder. Detta är **inte** samma sak som en färsk jämförelse mot Supabase Storage; antal, filnamn, checksummor och fullständighet måste jämföras med aktuell bucket innan radering. Kontrollera även att ZIP finns på minst två oberoende platser.

## 3. Edge Functions, konfiguration och beroenden

### `micke50-admin`

- Källfil: `supabase/functions/micke50-admin/index.ts`.
- Äldre alternativ/referens: `micke50/supabase-admin-function.ts` (se denna som separat äldre kod, inte automatiskt identisk med driftsatt version).
- GitHub Actions: `.github/workflows/micke50-admin-deploy.yml`.
- Deploykommando i workflow: `supabase functions deploy micke50-admin --project-ref qcchvqahibbbpijhtwsh --no-verify-jwt`.
- Trigger: manuell `workflow_dispatch` eller push till `ccc-demo-public-test` när funktionens katalog eller workflow ändras.
- Körmiljö: Supabase Edge Functions / Deno.
- Kodberoende: `npm:@supabase/supabase-js@2` (äldre referensfil använder `https://esm.sh/@supabase/supabase-js@2`).
- API: `POST` med åtgärder `check`, `list`, `delete`; `OPTIONS` för CORS.
- CORS: tillåter `https://container13.se`. Koden kontrollerar också `Origin` för POST.
- Autentisering: JWT-kontroll avstängd vid deploy; egen server-side PIN-validering. Återställning kräver säker återkonfigurering och granskning.
- Namn på miljövariabler (inga värden här): `MICKE50_ADMIN_PIN`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- GitHub Actions secret-namn (inget värde här): `MICKE50_SUPABASE_ACCESS_TOKEN`.
- **Driftsatt funktion, version, loggar, hemligheters existens och exakta runtime-inställningar är inte verifierade i Micke50s Supabase.** Kontrollera före avveckling.

**Säkerhet:** Lägg aldrig PIN, service-role-nyckel, access token eller annan hemlighet i GitHub. Om projektet återskapas behövs nya säkert lagrade värden och genomgång av Storage/RLS och CORS.

## 4. GitHub, filvägar och webbadresser

- Repo: https://github.com/container13/Container13-vintage
- Gren: `ccc-demo-public-test`
- Projektkatalog: `micke50/`
- Nuvarande avslutningssida: `micke50/index.html`. Visar Micke-startbild i **2 sekunder** och därefter tacktext som hänvisar gäster till Micke för bilder. Inga gästuppladdningsanrop finns kvar i denna fil.
- Säkerhetskopia av gamla uppladdnings-/bildspelsidan: `micke50/index-original.html`; innehållet har verifierats identiskt med gamla `index.html` genom GitHub blob-SHA `b60d7ba017dacf2d17da6c925cd053355e40a45e`.
- Startsidesbild: `micke50/micke-fest.jpg` (refereras av nuvarande sida).
- Alternativ bild: `micke50/micke-start.jpg`.
- Äldre admin-UI: `micke50/admin.html`.
- Separat admin-UI: `micke50-admin/index.html`; inventera vid återstart.
- Funktion: `supabase/functions/micke50-admin/index.ts`.
- Äldre funktionsreferens: `micke50/supabase-admin-function.ts`.
- Workflow: `.github/workflows/micke50-admin-deploy.yml`.
- Ljud/annan media: `micke50/sonos/` (innehåll och eventuell extern användning behöver separat inventeras).
- Domänkoppling: repo-roten har `CNAME` med `container13.se`.
- Avsedd publik sida: https://container13.se/micke50/
- Admin-URL enligt filstruktur: https://container13.se/micke50/admin.html och https://container13.se/micke50-admin/
- **OBS:** GitHub-kod och CNAME är verifierade; aktuell live-publicering, DNS, HTTPS, cache och vilken admin-URL som används är inte testade här. Kontrollera på en riktig enhet.

### Versionsspår

- Avslutningssidan lades in med commit `17b083feaa1be5aae526550e32d17e9aa95ea374`.
- Säkerhetskopian `index-original.html` skapades med commit `cabf58df5fff073a96bb3a2d52f5b684aecf01de`.
- Git-historiken innehåller tidigare versioner; radera inte repo eller historik vid Supabase-avveckling.

## 5. Externa tjänster och kopplingar

| Tjänst | Funktion | Koppling |
| --- | --- | --- |
| GitHub | Versionshantering, källkod och deploy-workflow | Repo/gren ovan |
| GitHub Pages / webbhosting | Statisk publik Micke50-sida under `container13.se` | `CNAME` och HTML i `micke50/`; driftsstatus behöver verifieras |
| Domän/DNS för `container13.se` | Publik webbåtkomst och tillåten CORS-origin | DNS-leverantör och kontouppgifter ej verifierade |
| Supabase Storage | Gästernas originalbilder i `Micke50bilder` | Supabase-projekt `qcchvqahibbbpijhtwsh` |
| Supabase Edge Functions | PIN-skyddad administration av bildlistning och radering | `micke50-admin` |
| GitHub Actions | Deploy av Edge Function via Supabase CLI | Workflow ovan; hemlig access token krävs vid deploy |
| Supabase CLI | Deployverktyg i Actions | `supabase/setup-cli@v1`, `version: latest` |
| Deno / npm-paket | Edge Function-runtime och Supabase-klient | `npm:@supabase/supabase-js@2` |
| Lokal ZIP / eventuell delningstjänst | Arkivkopior och överlämning till Micke | ZIP uppgiven; ingen delningstjänst eller mottagarens kopia verifierad |

Inga andra externa tjänster har kunnat bekräftas för just Micke50. En frånvaro i källkoden är inte bevis på att externa kopplingar saknas i Supabase-kontot.

## 6. Återskapa Micke50 senare

1. Behåll repo, gren och framför allt `micke50/index-original.html`, bilderna `micke-fest.jpg`/`micke-start.jpg`, adminfiler och Edge Function-källkod.
2. Säkerställ en **fullständig, verifierad originalbilds-ZIP** med filnamn och checksummor, sparad på minst två oberoende platser. ZIP är inte en fullständig databas-/projektbackup.
3. Inventera och exportera **innan avveckling** eventuell databasstruktur, data, SQL-funktioner, RLS/policies, Storage bucket-konfiguration, Edge Function-inställningar och relevanta Auth-inställningar. Skapa en säker separat export om resurser finns.
4. Vid återstart: skapa/återställ ett Supabase-projekt i önskad region, notera **nytt projekt-ID och URL** (gamla ID:t kan inte förutsättas återanvändas), skapa bucket `Micke50bilder` med dokumenterad policy och ladda upp bilder med bibehållna filnamn.
5. Återställ eventuella databasscheman och policies från säkerhetskopior. Sätt nya hemligheter via Supabase/GitHub Secrets; återanvänd inte okontrollerade gamla nycklar eller PIN.
6. Uppdatera projekt-ID, API-URL och giltig publishable key i den återställda gästkoden, admin-UI och deploy-workflow; granska om publika uppladdningar ska tillåtas alls. Undvik att lägga privata nycklar i klientkod.
7. Deploya `micke50-admin` efter säkerhetsgranskning och verifiera CORS, autentisering, listning och behörigheter utan att utföra oavsiktlig radering.
8. Återställ `micke50/index-original.html` som `micke50/index.html` **endast om uppladdnings-/bildspelsfunktionen avsiktligt ska öppnas igen**. Kontrollera live-sida, mobilvy, gästuppladdning, visning och bildspel.
9. Testa att webbplatsens och adminens faktiska URL:er fungerar. Dokumentera nytt runtime-PASS.

## 7. Backup- och verifieringsmatris

| Objekt | Status |
| --- | --- |
| GitHub-källkod för nuvarande Micke50-avslutningssida | **VERIFIERAD** i GitHub |
| Original gäst-/bildspels-`index.html` | **VERIFIERAD** kopia `micke50/index-original.html`, identisk blob-SHA |
| GitHub-källkod för Edge Function och workflow | **VERIFIERAD** i GitHub |
| Startbilder i repo | **VERIFIERADE som repo-filer**, inte bildintegritetstestade |
| 68 originalbilder / cirka 152 MB i ZIP | **UPPGIVEN backup** och tidigare chattkontroll av läsbarhet; ej aktuell bucket-motkontroll |
| Oberoende lokal/offline backup och mottagarens kopia | **EJ VERIFIERAD** |
| Komplett objektlista/checksummor från Supabase | **EJ VERIFIERAD** |
| Storage-bucketens verkliga konfiguration och policies | **EJ VERIFIERAD** |
| Databastabeller, schema och dataexport | **EJ VERIFIERAD** |
| Edge Functions faktiska driftsättning och inställningar | **EJ VERIFIERAD** |
| Projektets namn och region | **EJ VERIFIERAD** |
| Live webbplats / DNS / GitHub Pages-deploy | **EJ VERIFIERAD** |

## 8. Avvecklingsgrind — STOPP tills allt är kontrollerat

**INGENTING i Micke50s Supabase har ändrats eller raderats i samband med denna dokumentation.**

Radera **inte** Storage-bilder, buckets, Edge Functions, databas eller projekt förrän:

- ZIP och dess innehåll är jämförda med en **färsk** komplett Storage-listning, inklusive eventuella undermappar.
- Alla original är säkert sparade på minst två platser och Micke har fått sitt exemplar om det är avsikten.
- Projektets namn, region, tabeller, bucket-inställningar, policies, funktioner och externa beroenden har inventerats och relevanta konfigurationer exporterats.
- Det är accepterat att det gamla galleriet/bildspelet inte längre fungerar efter radering.
- Användaren har uttryckligen godkänt **exakt vad** som ska raderas efter att ha sett resultatet av inventeringen.

**Nästa säkra åtgärd:** få läsbehörighet till Micke50s **rätta** Supabase-projekt och komplettera ej verifierade punkter. Gör endast read-only inventering. Ändra inte Remember-projektet.

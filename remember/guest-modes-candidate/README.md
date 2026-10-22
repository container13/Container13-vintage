# Gästnivåer — kandidat 0.1.162
2026-10-22. **GODKÄND BACKEND INSTALLERAD; IPHONE-VERIFIERING ÅTERSTÅR.**
Ordinarie Remember är fortsatt utvecklingsmiljö. Se INSTALLATION_2026-10-22.md för verklig migration, SQL-/HTTP-verifiering och återställningsunderlag. Avsnitten om förberedelser nedan beskriver det godkända förslaget före installation. Supabase: wykvztfmfbboxiqvuvwr.

## Beslut och innehåll
Albumägaren väljer vid registrering:

| Läge | Konto för gästen | Synlighet |
|---|---|---|
| Öppet gästläge | Nej | Bilder visas direkt för alla med albumlänken |
| Gästläge med granskning | Nej | Albumägaren godkänner före visning för andra gäster |
| Inloggade gäster | Senare steg | Gemensam länk, uppladdare kopplad till konto, egna bilder kan raderas |

Tredje läget och personliga inbjudningar är inte byggda nu. Inga gästkonton skapas automatiskt. Gästradering ingår inte i detta steg. Befintlig webmaster-/ägarradering från .161 behålls; papperskorgens hörnplacering är ett separat kvarvarande visuellt önskemål.

## Faktiskt nuläge före ändring
- Granskningskö, ägarbeslut och ready-trigger finns i originalprojektet.
- Global photo_approval står OFF. Effektiv granskning krävde tidigare TEST + särskild testbehörighet + albuminställning.
- pending_album_registrations och albums saknar gästläge. Onboarding skapade album via separata anrop.
- Ingen cron.job finns i originalprojektet och ingen quarantine-purge Edge är installerad där. Ägarvyn lovade ändå radering efter 72 timmar. Kandidaten säger nu karantän utan detta löfte; en fullständig rensningstjänst är separat arbete.
- Läsningar visade 2 album, 11 fotorader, 11 privata Storageobjekt. Inga befintliga rader/objekt ändrades under detta arbete.

## Kod och databas
INSTALL_REVIEW_FIRST.sql är ett granskningsbart installationsförslag, inte en redan installerad migration.

1. Två nya textkolumner: guest_mode i registreringsutkast och album, begränsat till open/reviewed. Standard open bevarar vanliga befintliga album. Inga andra flaggor eller inställningsrader ändras.
2. En ny service-only RPC färdigställer registreringen atomiskt: verifierad/ej raderad/ej spärrad användare, e-postmatchning, låst utkast, album och valt läge samt consumed_at i samma transaktion. Samma request-ID kan upprepas efter tappat svar utan dubbelt album. SECURITY DEFINER behövs för auth.users, som service_role saknar SELECT på. Låst search_path, fullt kvalificerade tabeller, EXECUTE återkallad från PUBLIC/anon/authenticated.
3. Effektiv photo_approval blir sann för nya reviewed-album. Övriga funktioner och gamla TEST-regler behålls. Ingen global OFF→ON-ändring.
4. Gästgalleriet kräver godkänd köpost när granskning är aktiv. Saknad köpost är inte ett frikort. Detta skärper också det äldre TEST-lägets fail-closed-beteende; aktuella album med granskning OFF behåller synlighet.
5. Gästmetadata anger om nya bilder väntar på granskning. Albumets ägaruppgifter/privata konton lämnas inte till gästen.

Två Edge-kandidater ligger i edge/: remember-onboarding och remember-guest-metadata. Autentisering, e-postflöde, tidsperiod, komprimering, kvot, upload-retry, bildvisare och fotobok återanvänds. Onboarding pinas till supabase-js 2.118.0. verify_jwt=false ska bevaras för båda; complete kräver fortfarande auth.getUser och bekräftad e-post.

Register och activate skickar sparat request-ID, med befintlig senaste-utkast-fallback för e-postaktivering i annan webbläsare. Gästvalet sparas på servern. Vanliga användaren behöver inte hålla samma webbläsare öppen. Befintlig 24h-utkastgiltighet/5-per-timme-begränsning kvar.

Alla nya bilder i ett reviewed-album går genom den befintliga kön, även om ägaren laddar upp dem själv. Det finns inte separata uppladdaridentiteter i nuvarande metadata för att undanta ägarbilder. Ägaren kan godkänna dem direkt. Ändring av gästläge i efterhand ingår inte i denna första version.

## Verifiering
- Faktiska PL/pgSQL-funktioner/trigger från originalprojektet körda i isolerat PGlite 0.3.14, sedan installationsförslaget: PASS för gamla album/flagga, atomisk skapande/replay, felrollback, e-post/identitet/behörighet, lägesbegränsning, öppet/granskat, pending/approved/rejected/deleted, saknad köpost och avstängt album, gästmetadata samt gammal TEST-behörighet.
- ROLLBACK_TEST.sql körd i samma isolerade motor: PASS. Inte körd i Supabase än.
- 22 onboarding Edge-mockfall PASS. Verklig handler, mockad SDK/identitet/databas.
- 4 registrerings-DOM-fall PASS: öppet/granskat, inloggad/utloggad skapare, valt läge/ID genom staging och ingen mejlsändning vid stage-fel. Aktiveringskontraktet kontrollerat.
- 3 gäst-DOM-fall PASS: öppen/granskad/avstängd vy, väntemeddelande efter kamera och filuppladdning, ingen gallerihämtning när avstängt.
- Chromium 153, 320/390/1280 px: PASS för två val, layout utan horisontell overflow. Mobilrender visuellt granskad.
- Inga nya verkliga autentiserade HTTP-anrop, ingen iPhone-PASS eller HTTP-samtidighets-PASS. CI/publicering för livekandidaten återstår efter godkänd installation.

Testberoenden är isolerade och exakt pinnade i package.json/package-lock.json. Ingen ny produktionsdependency.
Kör från reporoten, efter npm ci --prefix remember/guest-modes-candidate --ignore-scripts:

```sh
NODE_PATH="$PWD/remember/guest-modes-candidate/node_modules" node remember/tests/guest-modes-db.cjs
node remember/tests/guest-modes-edge.cjs
NODE_PATH="$PWD/remember/guest-modes-candidate/node_modules" node --experimental-vm-modules remember/tests/guest-modes-dom.cjs
NODE_PATH="$PWD/remember/guest-modes-candidate/node_modules" node --experimental-vm-modules remember/tests/guest-modes-guest-dom.cjs
```

## Separat installationsgodkännande
Projektägarens överlämning kräver: ”Gör inga databasändringar eller destruktiva åtgärder utan separat kontroll och godkännande.” Förslaget sparades därför först i separat gren. Projektägaren har därefter uttryckligen godkänt installationen; underlag och resultat finns i INSTALLATION_2026-10-22.md.

Efter godkännande:
1. Kontrollera färsk Git-HEAD/release, schema, installerade två Edge-källor och baslinje med antal/raddigests. Bevara före-commit och aktuella källor; before/ är lästa källor från 2026-10-22, inte en full databasbackup.
2. Installera exakt granskad SQL i en transaktion. Kör VERIFY_READ_ONLY.sql: två kolumner, befintliga album open, oförändrade globala flaggor, service-only RPC. Läs tillbaka funktionskällorna och ACL.
3. Kör hela ROLLBACK_TEST.sql i originalets utvecklingsprojekt. Endast nya metadatafixturer, inga Storageoperationer. Kontrollera att inget testalbum kvarstår och att baslinjen är oförändrad. Kör säkerhetsråd och jämför med dagens 3 WARN/10 INFO; utred nya avvikelser.
4. Deploya de två Edge-kandidaterna, bevara verify_jwt=false, läs tillbaka exakt och kör negativa HTTP-fall. Inga inbjudningar/mejl skickas av assistenten.
5. För över endast remember/-diffen till publiceringsgrenen med expected-head-kontroll. Behåll .162 om ingen annan release hunnit publiceras, annars synka nästa lediga version. Verifiera nio entrypoints, CI, Pages och faktiska livebytes.
6. Be om avgränsat användartest: nytt öppet album respektive granskat album, gästuppladdning, före/efter godkännande och återöppning. CURRENT/PREVIOUS förblir null.

## Återställning
Före-commit: a33cef3996f63235a2426c3f537d1f6943e69bb7 (.161). Installerade före-Edge-källor och berörda SQL-funktioner är bevarade i before/. Befintlig .137-säkerhetsgren lämnas kvar.

SQL-transaktionen kan avbrytas före COMMIT. Efter att reviewed-album skapats får rollback **inte** ta bort deras granskning eller låta dem öppnas oavsiktligt. Behåll då SQL-kolumnerna och granskningsenforcement samt nya complete-RPC:n; återställ i första hand endast frontendens erbjudande om att skapa nya granskade album. Backa inte onboarding till gammal komplettering som tappar guest_mode. Full backendrollback kräver först separat genomgång av skapade granskade album/utkast, skyddad åtkomst och ett uttryckligt beslut om deras läge. Radera inte kolumner, bilder eller köposter som rutinmässig rollback.

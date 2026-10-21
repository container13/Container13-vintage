# Testinstallation: albumstatus och tider
Verifierad 2026-10-21. Kandidat 0.1.151. **Endast remember-test. Ingen originalinstallation eller DEVICE PASS.**

Projektägaren godkände installation och tester av båda funktionerna i remember-test. Detta ersätter äldre uppgifter om att testinstallationen väntar på godkännande. Originalprojektet kräver ett separat beslut efter återstående verifiering.

## Installation och återställningsunderlag
- Testref: `kauxrvshxgpbvptdwhog`. Originalref: `wykvztfmfbboxiqvuvwr`.
- Före-snapshot: grenen `remember/test-checkpoint-2026-10-21-settings-activation`, commit `7d9a673713a995be200ada0c7c98b7e6d3ea69ec`, under `remember/test-backups/2026-10-21-settings-activation/`.
- Snapshot innehåller verkliga RPC-definitioner/rättigheter, albumstruktur, constraints/triggers och sex Edge-källor. Det är kod-/strukturell återställningshjälp, inte full datakopia eller genomfört tjänsteåterställningstest.
- CLI 2.121.0 skapade lokalt migrationsnamnet `20261021101700_remember_test_album_settings_activation.sql`. Management-installationen registrerades separat som `20261021101712 / remember_test_album_settings_activation`.
- Installerad SQL finns i migrationsfilen i denna mapp. Den är testanpassad och får inte återköras eller kopieras blint till originalet.
- Testets befintliga modereringsfilter, kvotundantag för avvisade foton, verifierad-gäst-gate och återställnings-/schedulerfunktioner bevarades. Originalets äldre källor användes inte som ersättning för hela testets funktioner.

## Verifiering
| Kontroll | Utfall och underlag |
| --- | --- |
| SQL/PLpgSQL och sex Edge-källors syntax | PASS, pglast respektive Node TypeScript-strip/parser |
| Installation | PASS, schema/RPC/grants återlästa efter migration |
| Activation SQL-transaktion | PASS: obehörig actor, privata grants, avstängning, audit, exakt retry, gammal revision, gästspärrar, påbörjad uppladdning, webmastergalleri, återaktivering och bevarade tider/ägare/kvot/länk. ROLLBACK och oberoende återläsning. |
| Settings SQL-transaktion | PASS: klientgrants nekas, obehörig actor, sparande/revision/audit, retry utan extra audit, revisionskonflikt, felaktiga datum. Eget transaktionsalbum; ROLLBACK och återläsning. |
| Två samtidiga tidsskrivningar | PASS, separata DB-sessioner pid 475039/475041. En skrivning revision 2; andra revision_conflict; exakt en schedule-audit. |
| Samtidig avstängning/tidsändring | PASS, pid 475090/475091. Avstängning revision 3; tidsskrivning revision_conflict. Sluttid oförändrad; en activation-audit. |
| Avslut av uppladdning mot avstängning | PASS på SQL-nivå, pid 475815/475816. Påbörjad completion höll albumlåset och avslutades före avstängningen. Ny completion/reservation efter avstängningen nekades med album_inactive. Detta är inte ett fullständigt nätverksavbrotts-/Storage-test. |
| Edge-deploy | PASS, alla sex källor hämtade exakt efter deploy |
| Gäst-HTTP medan avstängt | PASS: metadata 200 active=false/uploadsOpen=false utan titel/skäl; galleri 403; multipart-uppladdning 403 före reservation/Storage. |
| Gäst-HTTP efter återaktivering | PASS: samma länk metadata 200/uploadsOpen=true och galleri 200/photos=[] efter separat kontrollerad körning |
| Negativ auth-HTTP | PASS: remember-webmaster utan Authorization 401 från gateway |
| Inloggad HTTP: webmaster/ägare/annan användare | **PENDING**. Ingen riktig användares session erhölls eller fabricerades. SQL-actor-tester är inte autentiserad HTTP-PASS. |
| iPhone och verkliga reglage/formulär | **PENDING**. Ordinarie Remember pekar fortfarande på originalbackend. |

Ett första HTTP-försök överlappade en återaktivering medan anrop fortfarande pågick. Det underkändes som verifieringsunderlag och skapade en enda disponibel PNG. Stabilt avstängt respektive återaktiverat tillstånd testades därefter separat. Testfilen togs bort genom Storage API; dess exakta sökväg kontrollerades sedan saknas.

## Driftsatta testfunktioner
| Funktion | Version | verify_jwt |
| --- | --- | --- |
| remember-webmaster | 4 | true |
| remember-guest-metadata | 4 | false |
| remember-photo-gallery | 4 | false |
| remember-photo-upload | 6 | false |
| remember-owner-manager | 4 | false |
| remember-share-manager | 4 | false |

Webmaster annonserar albumSettings och albumActivation i test. Identitet kommer från Auth getUser, följt av rollkontroll. Båda nya RPC:erna får endast köras av service_role och kontrollerar bekräftad, ej borttagen och ej avstängd webmaster. Gemensam albumrevision och lås skyddar mot överskrivning. Aktivering ändrar inte tider/forced_closed. Avstängning är skild från stängd uppladdningsperiod.

En separat engångsfunktion för exakt testfilstädning var begränsad till testref, en fast sökväg, slumphemlighet och tio minuters giltighet med gateway-JWT. Den ersattes direkt av `remember-test-settings-cleanup` v2: en inaktiv 410-respons utan credentials, databas-/Storageåtkomst eller mutationer. Exakt källåterläsning PASS. Connectorn saknar delete_edge_function; därför finns endast denna avvecklade stub kvar. Ingen aktiv privilegierad testharness finns.

## Slutlig städning och avgränsning
- En tillfällig albumfixture användes för samtidighet/HTTP, med exakt id/title/slug/owner-guard före städning.
- Storage: 0 objekt under fixture-prefix efter API-radering och oberoende SQL-läsning.
- Album, gästlänk, foto och bara fixturealbumets auditposter borttagna. Activation state/audit är åter 0.
- Slutlig oberoende räkning: **Auth users 1, webmasters 1, album 1, foton 4**, samma som före installation. Inga Auth-konton skapade eller ändrade.
- Originalet lästes tillbaka: settings/activation RPC saknas, is_active saknas, remember-webmaster fortfarande v2. Inga originalwrites utförda.
- Fotobok, bildvisare, ordinarie login/backendadresser och ikonens form är oförändrade. Release-metadata synkas till 0.1.151 för denna kod-/testkontrollpunkt; ikonfilerna behåller 0.1.150.

## Återstående grindar före original
1. Anslut befintligt testkonto i en tydligt avskild testfrontend till testprojektet; använd riktig Auth-session. Ingen omlänkning av ordinarie Remember.
2. Kör autentiserad HTTP för webmaster/ägare/icke-webmaster: capability, read/save/retry/409, validering, avstängd ägaråtkomst, delning, uppladdning och administrativ bildgranskning.
3. iPhone: tryck/drag, avbryt, status-/felåterläsning, tider från nu/framtida slut, osparat utkast och bevarad manuell stängning.
4. Kontrollera auditfel/rollback och verklig HTTP-samtidighet; dessa följer inte automatiskt av SQL-sessions-PASS.
5. Granska portning mot originalets faktiska schema/källor, färdigställ före-/återställningsunderlag och inhämta separat godkännande innan originaldatabas/Edge skrivs.
6. Kontrollera därefter originalets faktiska runtime och enhet innan releasepromotion. CURRENT/PREVIOUS förblir null.

Redan utfärdade bild-URL:er kan leva i 120 sekunder; cachade/sparade bilder kan inte återkallas.

## Security advisor efter installation
Inga nya WARN/ERROR. RLS utan policies är avsiktlig server-only-design (19 tidigare tabeller + 2 nya privata tabeller). Ny state/audit saknar klient-/service_role-tabellgrants; definer-RPC äger åtkomsten.
Befintlig WARN: leaked-password protection är avstängd och ändrades inte här. Åtgärdsunderlag: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .

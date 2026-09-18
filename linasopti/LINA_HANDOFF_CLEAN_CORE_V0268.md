# LINA HANDOFF · CLEAN CORE V0.2.68

## Syfte
Självdiagnostiserande GitHub/evidenssynk efter V0.2.67 där Gen4 är korrekt återställd/fryst men UI visar Synkfel / VÄNTAR PÅ SYNK.

## Observerat före release
- Gen4 4/4 familjer finns återställda utan rerun.
- Koncentrationsmedveten ensemble PASS; exakt 1 kvalificerad familj.
- Status GEN4_RESEARCH_FROZEN_CANDIDATE_SELECTION_AVAILABLE.
- Diagnostik V0.2.67 visade att synken är delvis färdig men saknade exakt HTTP/API-fel.

## Ändring
- evidence-sync loggar varje pending evidensfil, endpoint, payloadstorlek, HTTP-status/statusText och sanerat API-svar/fel.
- github-sync loggar GET/POST app-state på motsvarande sätt.
- Ingen login-kod/header exporteras eller loggas.
- Gen4-diagnostik uppgraderad till LINA-GEN4-DIAGNOSTIC-2 och inkluderar syncDiagnostics, syncSession och recoveryReport.
- Global status-export inkluderar syncDiagnostics.
- Diagnostik begränsas till senaste 80 events.

## Forskningsdisciplin
- Ingen Gen4 research körd, omräknad eller ändrad.
- Planhash 8d51311d och runnerspechash d1daab90 oförändrade.
- Gates/ranking/resultat oförändrade.
- Ingen kandidat vald. Forward stängd. Handel AV.
- Cloudflare Worker: INGEN ÄNDRING.

## Verifiering
- LINA_MASTER_RULES.md läst och oförändrad.
- Senaste handoff och berörd faktisk baskod V0.2.67 inspekterad.
- JavaScript syntaxkontrollerad med node --check.
- Release checklist genomgången.

## Nästa steg
Deploy V0.2.68. Låt startup-synk försöka. Exportera därefter Gen4-diagnostik; den ska nu visa exakt request/HTTP/API-fel utan att någon research körs om.

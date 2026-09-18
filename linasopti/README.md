## V0.2.59 – Gen3 rule-by-rule summary + evidence freeze

Builds on V0.2.58 without changing the frozen Gen3 plan (`fa55540a`) or runnerspec (`427a8742`). Existing V0.2.58 Gen3 local state is deliberately reused.

- Shows every locked gate for every completed Gen3 family and the exact FAIL reason(s).
- After 4/4 families are complete, creates one immutable Gen3 research summary and syncs it through the existing Evidence/GitHub path.
- If no family clears every preregistered gate, Gen3 is closed as `NO_CANDIDATE_FOR_FORWARD`; no rerun/rescue and Forward remains blocked.
- If an eligible family exists, Forward still remains closed until a separate candidate freeze is GitHub-verified.
- Handel AV. Cloudflare Worker unchanged.


## V0.2.60 – Global export + Lina Generation 4 preregistration

Builds on V0.2.59. Gen3 remains frozen and unchanged (`NO_CANDIDATE_FOR_FORWARD`).

- Adds a permanent global `📥 Exportera Lina-status` button in the header that downloads a complete analysis JSON to Downloads without exporting login secrets.
- Adds focused `📥 Exportera Gen3-resultat` and `📥 Exportera Gen4-plan` exports for future diagnostics and handoff.
- Introduces Lina Generation 4 by reusing the proven generation framework while keeping research state, hashes and evidence separate from Gen3.
- Gen4 is plan-review only in this release: plan hash `8d51311d`, four preregistered diversification hypotheses, unchanged quality gates, no runnerspec, no engine, no research runs.
- Handel AV. Cloudflare Worker unchanged.

## V0.2.61 — Gen4 runnerspec + engine gate
- Gen4 plan `8d51311d` remains immutable and uses the existing V0.2.60 plan-lock state.
- Added separate Gen4 runnerspec/engine state and deterministic runnerspec hash.
- Hard research-data stop remains `2024-12-31`; 2025-01-01–2026-09-10 is observed and cannot become a new holdout.
- Forward remains sealed until a future Gen4 candidate is frozen; no backdating.
- Research execution is intentionally still closed in V0.2.61. Human sequence: lock runnerspec → verify engine → export diagnostics.
- Permanent project rule: when ChatGPT needs exact Lina information, provide a download/export button for that diagnostic instead of relying on screenshots/manual copying. Global `📥 Exportera Lina-status` remains available; Gen4 also has `📥 Exportera Gen4-diagnostik`.

## V0.2.62 — Gen4 engine verification hotfix
- Fixar V0.2.61 där verifieringsknappen kunde tryckas utan att `engineVerified` blev beständigt true.
- Verifieringen skrivs atomiskt till samma Gen4-engine-state och läses tillbaka före UI-render/synk.
- Diagnostik sparar `verificationAttempt` med varje kontroll.
- Ingen research öppnas av hotfixen; Handel AV och hard-stop 2024-12-31 kvarstår.
- Gen4 plan 8d51311d och runnerspec d1daab90 ändras inte.

## V0.2.63 – Gen4 research runner
- Bygger vidare på låst Gen4-plan `8d51311d` och låst runnerspec `d1daab90`; dessa ändras inte.
- Öppnar de fyra förregistrerade Gen4-familjerna för historisk walk-forward-forskning 2021–2024 OOS, med hård data-stop 2024-12-31.
- Varje familj kan köras exakt en gång. Alla varianter sparas i state före continuation/evidenssynk. Rerun/rescue blockeras.
- Familjeevidens fryses/synkas till GitHub. Efter 4/4 kan sammanställningen frysas separat.
- PASS/FAIL använder endast låsta gates: ≥100 OOS-affärer, PF ≥1.20, DD ≤12%, positiv OOS, koncentration ≤40%, positiva folds ≥3/4.
- Forward förblir stängd. Ingen kandidat väljs eller fryses i denna release; eventuell kandidatprocess sker först efter fryst Gen4-sammanställning med separat deterministisk regel.
- Global och Gen4-specifik export finns kvar. Handel AV.
- Cloudflare Worker: NO CHANGE.

## Permanent project governance (V0.2.67+)
Before every Lina release, read `LINA_MASTER_RULES.md`, latest handoff, and affected base code; then complete `LINA_RELEASE_CHECKLIST.md`. Safe deterministic multi-step work must be automated to the next genuine human decision.


V0.2.67: Gen4 evidence-recovery + monoton synk. Pågående automatkedja pausar app-state-autosynk. Recovery återläser endast exakt redan fryst ensemble-evidens och kör aldrig research.

V0.2.67: bootstrap-synk är nu monoton för irreversibelt Gen4-state och applicerar aldrig äldre remote state före lyckad merge+PUT. Synkfel får inte backa återställd/fryst Gen4-evidens.

V0.2.68: självdiagnostiserande GitHub/evidenssynk. Loggar endpoint/metod, payloadstorlek, evidensfil, HTTP-status och sanerat API-svar utan lösenkod. Gen4-diagnostik och global status-export inkluderar synkloggen. Ingen research, kandidat eller Forward ändras.

V0.2.69: smal evidence-idempotensfix. Exakt HTTP 409 + `Evidencefilen finns redan – original skrivs inte över` behandlas som serverbekräftad immutable existens, inte synkfel. Ingen overwrite eller research. Gen4 evidence-status reconcileras från kön så fryst UI kan gå från VÄNTAR PÅ SYNK till GITHUB ✓.

V0.2.70: Gen4 kandidatsteg. Efter FROZEN · GITHUB ✓ sammanställning väljer Lina deterministiskt bland endast fullt kvalificerade familjer med den redan låsta riskjusterade rankingen, fryser kandidaten lokalt före synk och säkrar kandidat-evidens på GitHub. Ingen research, rerun, Forward eller handel. Startuptext ändrad till `Inget nytt att spara eller återställa.`

## V0.2.71 — Generation Engine foundation
- Första generella Generation Engine-modulen. Den formaliserar samma säkra livscykel för framtida generationer utan att hårdkoda Gen5–Gen99 som separata experiment.
- Gen4 visas som immutable, fryst referens och körs aldrig om. Gen5 startar uttryckligen som `Ej definierad`; ingen plan/runnerspec/research skapas före ett nytt mänskligt planbeslut.
- Ny global generationsstatus kan exporteras. Handel AV och Forward förblir oförändrade.
- Fixar även intern `APP_VERSION` så den matchar release V0.2.71.
- Cloudflare Worker: INGEN ÄNDRING.

## V0.2.73 — Underlag för Generation 5
- Generation Engine sammanställer frysta Gen4-lärdomar och metodpunkter till ett exportbart Gen5-underlag.
- Planförslaget är uttryckligen EJ LÅST; ingen Gen5-research, runnerspec eller Forward skapas.
- Gen4 förblir immutable och körs inte om.
- Cloudflare Worker: INGEN ÄNDRING.

## V0.2.73 — Gen5 formellt planlås
Generation Engine visar en komplett Gen5-plan med låst forskningsgräns, gates, familjer, metodkrav och exakt rankingformel. Ett mänskligt godkännande fryser planen (`d501a5e1`) och säkrar planevidens. Ingen Gen5-research eller Forward startas i denna release.

## V0.2.74
Generation Engine: Gen5 runnerspec `db1c4d7f`, verifierad train→OOS-metod och gemensam portföljsimulering. En start kör hela Gen5-kedjan, säkrar evidens och skapar Gen6-underlag; Gen6/Forward startas inte automatiskt. Handel AV.


## V0.2.75
Gen5 data-preflight: årsvis datahämtning 2020–2024 och komplett universumkontroll före forskning.

## V0.2.76
Gen5 Data Source Probe före research. Ingen forskningskörning görs av proben; diagnostik kan exporteras för exakt rotorsaksanalys.


## V0.2.77
Gen5 Yahoo parser hotfix: prioritize top-level `rows`; prevents `symbols` array from being mistaken for bars. Plan/runnerspec unchanged.


## V0.2.78
- Recovery/export-hotfix efter fryst Gen5. Ingen research körs om.
- Komplett fryst Gen5-state, familjeresultat, summary/evidence och Gen6-underlag inkluderas i Generation Engine-export.
- Saknat Gen6-underlag härleds deterministiskt från redan fryst Gen5-summary och sparas utan rerun.
- Robotmognad ligger kvar 48/100; ny regelbaserad modell är ännu inte låst.


## V0.2.79
Generation Engine först under Forskning. Gen5 pending evidens/summary kan slutföras utan rerun. Robotmognad 2.0 låst med modellhash `6e8908ca` och 100 verifierbara poäng. Handel AV; Worker oförändrad.


## V0.2.80
- Hotfix för Gen5-evidensknappen: alltid synlig progress/klart/stoppad.
- Reconcile matchar frysta Gen5-familjer deterministiskt via evidensfilnamn, även om äldre state saknar exakt name-fält.
- Ingen Gen5-research körs om. Gen6/Forward öppnas inte. Handel AV.

## V0.2.81 – Gen6 plan proposal

- Generation Engine remains first under Forskning.
- Gen5 remains frozen, immutable and is never rerun.
- Adds a Gen6 plan proposal derived only from frozen Gen5 results: trend was closest but missed DD (13.17% vs 12%); other families had larger DD and/or quality/concentration failures.
- Gen6 hypothesis focuses on risk/regime-controlled exposure and volatility-scaled portfolio risk while preserving the verified Gen5 TRAIN→OOS methodology and unchanged quality gates.
- Proposal hash: `206c11d7`. The proposal is NOT locked in this release. No Gen6 runnerspec, research, Forward or trading is opened.
- Handel AV. Worker unchanged. Robotmognad model unchanged.

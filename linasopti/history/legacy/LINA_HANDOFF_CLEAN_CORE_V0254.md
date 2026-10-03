# Lina Clean Core V0.2.54 – handoff

Byggd från V0.2.53 FLAT COMPLETE. V0.2.53 live-verifierade pre-holdout-evidens `FROZEN · GITHUB ✓` med dokumenterad historisk lucka om 11 icke-topprankade variantdetaljer; ingen omkörning tillåts.

## Nytt
1. Automatisk cross-device bootstrap från GitHub `/app-state` efter login och före routerstart. GitHub är beständig startkälla för kompakt `lina_clean_*` state.
2. Automatisk debounced app-state-synk vid Gen2/evidence-förändringar. Manuell Synka är reserv.
3. Candidate Freeze + Holdout-pipeline i samma release. Kandidat väljs deterministiskt med befintlig låst riskjusterad rankfunktion bland PASS-familjernas frysta toppvarianter, fryses och arkiveras till GitHub.
4. Holdout-knapp visas först när candidate-evidens är GitHub-verifierad. Holdout 2025-01-01–2026-09-10 körs exakt en gång med exakt fryst family/params; resultatet låses lokalt före GitHub-synk och omkörning blockeras.

## Oförändrat
Plan 1d5f8bc1. Runnerspec c7f6a2d9. Handel AV. Robotmognad 48/100. Original G2/G3 Real Forward orört. Cloudflare Worker: INGEN ÄNDRING; verifierad V0.2.43 Worker används.

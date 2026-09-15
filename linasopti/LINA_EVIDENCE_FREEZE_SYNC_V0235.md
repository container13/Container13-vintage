# Lina V0.2.35 – Evidence Freeze & GitHub Sync
Datum: 2026-09-15

## Regel
Ny TXT-rapport eller RAW/resultat-JSON som skapas i Lina är PRELIMINÄR. Den får inte skickas till permanent GitHub-evidence förrän användaren uttryckligen väljer **Godkänn & frys** i Lina Arkiv.

Flöde: PRELIMINÄR → FROZEN → ☁ Synka → FROZEN · GITHUB ✓.

FAIL-resultat får frysas: godkänd betyder verifierad och permanent, inte PASS.

## Integritet
- SHA256 räknas i browsern när evidence fryses.
- Worker verifierar SHA256 innan GitHub-skrivning.
- Endpoint `/evidence` accepterar endast status FROZEN och .txt/.json.
- Evidence skapas under `linasopti/evidence/YYYY-MM-DD/`.
- Befintlig evidencefil skrivs aldrig över.
- GitHub-token exponeras aldrig i frontend.
- Stora marknadsrådata/IndexedDB-cache synkas inte.
- Handel AV. Robotmognad 48/100.

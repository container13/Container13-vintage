# Lina V4 – återanvänd befintlig Cloudflare Worker

Verifierat 2026-10-28 mot produktionsgrenen ccc-demo-public-test:
- linas-opti-api använder linasopti/worker/wrangler.jsonc (name linas-opti-api, main WORKER_PENDING_RUNTIME_REPORT.js, keep_vars true).
- Produktionsfilens blob SHA c9e6f8fdd0d94089c79ae63f3d0aed4e55adb4f9 matchar den tidigare isolerat testade Worker-källan.
- V4 har PASS på isolerad testgren i GitHub Actions 40758388233; offline Miniflare mock och fixture-data, inte live Alpaca.

Beslut: återanvänd befintlig Worker och dess redan konfigurerade Alpaca-miljö. Ingen separat permanent körmiljö behövs. Förbered enda diagnosroute med V4, central autentisering, CORS, begränsade parametrar, sanerat svar, inga handels-/forskningsmutationer.

Releasegrind innan push till produktionsgrenen: 1) skriv och granska faktisk integrerad Worker-kod som fullständig versionssatt release, 2) exakt integrations-/negative-/secret-redaction-test, 3) verifiera att produktionsbranch/deploy triggers och återrullning är kontrollerade, 4) korrekt version.js + releasechecklista, 5) explicit godkänd publicering och därefter verklig runtime-readback. Inga råa hemligheter i repo eller kvitton.

Kvar: faktiskt Alpaca API-entitlement, verkligt svarsschema, historisk point-in-time-data. En read-only diagnostik kan inte bevisa när historiska händelser var kända.

Gen8–16 frysta. Gen16 NO_CANDIDATE. Gen17 DRAFT_ONLY. Handel och ny Forward AV.

# Lina Clean Core – Handoff V0.2.35
Datum: 2026-09-15

V0.2.35 bygger på godkänd V0.2.34 + fungerande V0.2.33 Worker-synk. Nytt: explicit evidence-grind för framtida TXT/JSON: PRELIMINÄR → Godkänn & frys → GitHub-synk. `evidence-sync.js` köar exporterad evidence lokalt; Lina Arkiv visar kön och godkännandeknapp; headerns ☁ Synka laddar endast FROZEN evidence via Worker `/evidence`. Worker verifierar login, filtyp, storlek och SHA256 och vägrar skriva över befintlig evidence. Stora råa marknadsdataset/IndexedDB-cache exkluderas. Forskningsregler, frysta G2–G12-resultat, Handel AV och robotmognad 48/100 är oförändrade.

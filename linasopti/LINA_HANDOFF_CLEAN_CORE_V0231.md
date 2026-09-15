# LINA HANDOFF – CLEAN CORE V0.2.31

## Status
G2–G12 historisk forskning är fryst. G2/G3 Real Forward aktiva från anchor 2026-09-11. Robotmognad 48/100. Handel AV.

## V0.2.31 – GitHub Shared Forward State
Forward-runtime har nu en gemensam master i GitHub via Cloudflare Worker. Detta ersätter manuell filflytt som normal synkmetod. Lokal backup/import från V0.2.30 finns kvar som recovery.

Worker-endpoint `/forward-state` läser/skriver den kompakta `LINA-FORWARD-SYNC-1`-strukturen. Skrivning kräver `LINA_SYNC_KEY`; GitHub-token ligger endast som Worker secret. Browsern får aldrig GitHub-token.

## Integritetsregel
Anchor 2026-09-11, G2 kandidat 15efd75a, G3 plan 75838ed5 och Handel AV valideras före skrivning. Senare marknadsdag är auktoritativ snapshot. Samma marknadsdag med motsägande affärsdata stoppar synken. GitHub commit-historik ger versionsspårning.

## Lagring
README/handoff/evidence/archive/resultat = permanent forskningshistorik. GitHub forward-state = gemensam kompakt Real Forward-master. localStorage = lokal kompakt runtime/cache. IndexedDB = stora rådata/checkpoints/cache.

## Cloudflare Worker
ÄNDRING KRÄVS i V0.2.31. Komplett färdig Worker finns som `cloudflare-worker-v0231.js`. Den bygger vidare på den Worker-kod användaren lämnade 2026-09-15 och bevarar Yahoo, EODHD och Alpaca-rutterna.

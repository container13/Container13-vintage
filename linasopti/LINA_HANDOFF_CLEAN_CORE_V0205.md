# LINA HANDOFF – CLEAN CORE V0.2.5

Datum: 2026-09-14

## Status
Swing G2 A–O är KLAR och fryst. Kandidat-hash: `15efd75a`.
Pseudo-forward 2023-01-01 → 2026-09-10: 144 affärer, +13 708,85 kr, PF 1,4673, WR 50,0 %, DD -2,34 %.
Slutdom: POSITIV KANDIDAT. Ingen rescue.

## V0.2.5
- Inbyggd robusthetsanalys av pseudo-forward.
- År för år, symbol, exittyp, koncentration och vinst/förlustdistribution.
- Robusthetsrapport kan exporteras direkt från G2-vyn.
- Broker Gate dokumenterad men ännu inte genomförd.
- G2-regler/parametrar oförändrade.

## Viktig observation
MU står för ca 55,7 % av nettovinsten i pseudo-forward. Detta är en koncentrationsflagga att följa i riktig forward; det är INTE skäl att efteroptimera eller ta bort/lägga till parametrar.

## Nästa steg
1. Broker/Cost Gate med realistiska courtage-, spread-, slippage- och valutaväxlingskostnader.
2. Om G2 fortfarande håller: bygg riktig G2 Forward/paper trading med exakt hash `15efd75a`.
3. Milstolpar: 60 / 120 / 250 nya affärer.
4. Handel AV tills separat beslut.

## Permanenta regler
- Stora körningar ska ha checkpoint + automatisk lagringsstädning/kompaktering från start.
- Cloudflare Worker: hela färdiga koden direkt i chatten för copy/paste → Deploy när det är rätt arbetssätt.
- Skapa aldrig bild om användaren inte uttryckligen ber om det.

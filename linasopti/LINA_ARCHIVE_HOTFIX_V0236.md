# Lina Clean Core V0.2.36 – Archive navigation hotfix
Datum: 2026-09-15

## Fel
Historik → Lina Arkiv reagerade inte synligt vid klick.

## Rotorsak
`archive-data.js` innehöll en extra array-separator före G5-posten. JavaScript accepterade syntaxen och skapade därför en tom arrayplats. Syntaxkontroll passerade, men `archive.js` kraschade vid rendering när `recordCard()` försökte läsa egenskaper från `undefined`.

## Fix
Den tomma arrayplatsen är borttagen. Release-testet kontrollerar nu att `records()` inte innehåller null/undefined och att varje post har `metrics` som array. `app.js` versionsmetadata synkas till V0.2.36.

## Oförändrat
- Handel AV.
- Robotmognad 48/100.
- Alla frysta forskningsresultat/evidence oförändrade.
- Evidence-flödet PRELIMINÄR → FROZEN → GITHUB ✓ oförändrat.
- Cloudflare Worker V0.2.35 oförändrad och ska inte deployas om.

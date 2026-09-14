# Lina Clean Core V0.2.0 – Handoff

## Checkpoint
V0.1.6 är verifierad live: loginfält tomt, Enter fungerar, sidans Uppdatera fungerar och Firefox reload ger ny login.

## Denna release
Swing G2 är första riktiga migrerade forskningsmodulen. Auktoritativ logik kommer från legacy V0.56.0/V0.58.8 och ligger nu isolerad i `g2-engine.js`. UI/routing ligger separat. Clean Core använder en ny egen G2-state-nyckel; gammal G2-state lämnas orörd som facit.

## Fryst G2-plan
DEV 2020-01-01–2022-12-31. Låst historisk pseudo-forward 2023-01-01–2026-09-10. 16 symboler + SPY. 648 varianter. Kostnad 0,10 %/sida. Risk 0,5 %. Max 5 positioner. Max 20 % equity/position. A–M DEV. M fryser kandidat/hash. N öppnar pseudo-forward. O slutbedömning. Ingen rescue.

## Användarflöde
Dashboard → Forskning → Swing G2 → Lås G2-planen → Kör/Fortsätt G2 A–O → Exportera G2-rapport till ChatGPT.

## Datatransport
Samma V0.58.8-fallback används: Worker Yahoo daily → EODHD .US → Alpaca daily. Två cykler, 60 s timeout. Provider sparas per rad för spårbarhet.

## Nästa acceptanspunkt
Kör V0.2.0 live. Om historisk data kommer igenom: exportera rapporten och jämför kandidat/hash/resultat mot legacy-facit innan G2 markeras fullt migrerad. Om data fortfarande ger 0 rader: felsök Worker/dataåtkomst, inte strategin.

## Permanenta regler
Följ README development contract. Särskilt: återanvänd tidigare fungerande implementation först; flat filstruktur; ingen bildgenerering utan uttrycklig begäran; inga stealthändringar i frysta forskningsregler; Handel AV.

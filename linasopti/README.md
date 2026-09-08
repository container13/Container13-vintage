# Linas Opti V0.38.6 – Perioder återställda

Bas: **V0.38.5 Golden Rebuild**, verifierad fungerande publikt på iPhone.

## Ändrat i V0.38.6
- Återställt tidsperiodväljaren från det tidigare UI-spåret.
- Snabbval: **1 år, 3 år, 5 år, 10 år**.
- Kalenderår skapas dynamiskt för **innevarande år + nio år bakåt** (2026 ger 2026–2017).
- **Egen period** finns hopfälld och visar Från/Till.
- Ett kalenderår använder föregående 1 december som warmup-data och 1 januari som teststart.
- Flerårsval använder samma princip: warmup från 1 december året före första teståret.
- Val av ny period tömmer tidigare hämtad DAILY-data så fel period inte kan testas av misstag.

## Uttryckligen inte ändrat
- `bridge()`
- `params()`
- `getBars()` / fungerande dagsdatahämtning från V0.38.5/V0.36.7
- Cloudflare Worker
- Alpaca/EODHD-anrop
- Opti Swing-regler, position sizing, exits, benchmark eller övrig handelslogik
- Resultat-/delningsflödet

## Viktig felsökningsregel
V0.38.5 är fortsatt golden master för datahämtningen. Om V0.38.6 skulle få problem ska period-UI:t granskas först; fetch-kedjan ska inte ändras utan separat bevis.

# Gen9 – GM-avvikelsen 2023-06-05

Status: BLOCKER_CHARACTERIZED_NOT_RESOLVED. Ingen kandidatdata ändrad.

| Källa | Open | High | Bedömning |
|---|---:|---:|---|
| Yahoo kandidat, raw | 34.45000076293945 | 34.45000076293945 | Internt giltig, konflikterar med Alpaca |
| Alpaca SIP, sparad dagsrad | 34.45 | 34.49 | Stöds för high av nytt intradagsprov från samma källa |
| Twelve, nytt none-svar | 34.45000076 | 34.375 | High < open; stoppas korrekt |

Nytt Alpaca-prov omfattar 121 femminutersrader, varav 78 med start under ordinarie handel 09:30–16:00 America/New_York. Högsta high är 34.49 i intervallet som börjar 09:30 (13:30 UTC). Detta stärker Alpacas interna konsistens för high men bevisar inte oberoende ursprungsdata eller vilken dagsdefinition som ska godkännas. Första intervallets open är också 34.49, medan dagsraden har 34.45: regler för aggregat och handelsvillkor återstår att styrka.

Twelve-felet reproducerades på nytt. Sparade tidigare none/all-svar innehåller samma typ av ogiltig OHLC-rad; inga nya all/splits-anrop gjordes i denna kontroll. Ingen validering lättades. Ingen leverantörsmajoritet eller fältblandning användes.

Nästa konkreta krav: styrk leverantörens regler för dags-high och få en korrigerad eller förklarad Twelve/Yahoo-rad, alternativt utvärdera ett komplett dataset från en enda annan källa enligt projektets datakrav. GM-blockern är fortfarande öppen. Gen9 är NOT APPROVED och inte startad; Gen8 är orörd, Handel/Forward AV.

JSON-rapporten innehåller nya Worker-svar, exakta anrops-URL:er, ursprungliga jämförelserader och SHA-256 för tidigare källfiler. JSON SHA-256: `ae9bb251464b7fe5801a269b2f6573feeb8ca99e0126e5c137a83de6915e7fdf`.

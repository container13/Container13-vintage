# Testverkstad

Varje nytt test får en egen namngiven undermapp i `test/`. Bevara äldre tester för spårbarhet. Testerna får aldrig skriva över produktionsfiler.

## Tester
- `bildoverforing/` – automatisk överföring av nya binära JPG-filer till GitHub.

## Tidigare tester
- `testbild.png` – första minimala PNG-filen.
- `testbild-stor.jpg` – återanvändning av en befintlig JPG-blob utan att ändra originalfilen.

Verifiera GitHub-innehåll och fil-SHA efter varje skrivning. GitHub-verifiering och webbläsarverifiering är skilda steg.

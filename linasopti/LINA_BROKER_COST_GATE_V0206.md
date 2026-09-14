# Lina Broker/Cost Gate – källsnapshot och modell

Version: Clean Core V0.2.6  
Datum: 2026-09-14  
G2 kandidat: `15efd75a`  
Handel: AV

## Syfte
Reprissätt exakt samma frysta 144 G2-pseudo-forward-affärer. Inga signaler, exits, symboler eller parametrar ändras.

## Viktig modellbegränsning
G2-motorn har historiskt använt ett startkapital på 100 000 samtidigt som amerikanska aktiepriser används direkt. Det gör resultatet konsekvent för relativ strategi-/kostnadsjämförelse, men det är inte ännu en bokföringsmässigt exakt SEK-simulering. Därför används Broker Gate för robusthet och relativ kostnad, inte som slutlig mäklarfaktura.

## Officiella uppgifter kontrollerade 2026-09-14
### Interactive Brokers
- US stocks, IBKR Pro Tiered, lägsta volymnivån: USD 0,0035/aktie.
- Minst USD 0,35/order.
- Spot FX: 0,20 baspunkter på första nivån, minst USD 2/order.
- Källa: Interactive Brokers officiella prislista.

### Alpaca
- Commission-free för kvalificerad self-directed handel i US-listed securities via API.
- SEC/FINRA-regulatoriska avgifter kan tillkomma.
- FX/funding beror på finansieringsflöde och modelleras därför inte som en säker per-trade-avgift här.
- Källa: Alpaca officiella support/prissättning.

### Nordnet
- Mini, utanför Norden: 0,25 % courtage, minst 9 SEK.
- Automatisk valutaväxling: 0,25 %.
- Valutakonto/manuell växling: 0,075 %.
- Nordnet External API tar för närvarande inte in nya kunder.
- Källa: Nordnets officiella prislista, valuta-FAQ och API-dokumentation.

## Research-antagande
Slippage sätts till 0,05 % per sida i IBKR-/Alpaca-proxyn. Detta är ett Lina-antagande, inte en publicerad mäklaravgift.

## Regler
- Broker Gate får aldrig efteroptimera G2.
- Resultaten används för mäklar-/kostnadsval, inte för att ändra kandidat `15efd75a`.
- Exakt svensk skatt/ISK, kontotyp, funding/FX och riktig orderexecution måste beslutas före livehandel.

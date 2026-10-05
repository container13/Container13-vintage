# LINA Gen11 — planförslag för granskning

Status: **PROPOSAL / NOT_LOCKED**. Detta dokument startar ingen Gen11-forskning, låser ingen runnerspec och öppnar inte Handel eller Forward.

## Fryst källa
Gen10 är permanent fryst som `GEN10_COMPLETE_NO_CANDIDATE`. Ingen Gen8-, Gen9- eller Gen10-fold får köras om.

Gen10 CONTROL: PF 1.3318, koncentration 66.29 %, 3 positiva folds, sämsta fold PF 0.0419.
Gen10 GRADED: PF 1.3738, koncentration 66.24 %, 3 positiva folds, sämsta fold PF 0.0159.

Den graderade breddregeln förbättrade total PF men löste inte koncentrations- eller worst-fold-gaten. Ingen Gen10-parameter får därför justeras efter resultatet.

## Hypotes
Pröva om en **förutbestämd diversifierings-/koncentrationskontroll på nya positioner** kan minska vinstkoncentrationen och samtidigt förbättra robustheten mellan folds, utan att ändra den frysta signalen, exitlogiken eller använda efterhandsoptimering.

Detta är en ny hypotes för Gen11, inte en rescue av Gen10.

## Före runnerspec
Exakt mekanism och alla numeriska parametrar måste väljas och hash-låsas **innan** någon Gen11-research får observeras. Planen får inte välja parametrar genom grid, ranking eller genom att optimera mot Gen10:s foldresultat.

Runnerspec-review ska särskilt bevisa:
- att kontrollen endast använder information känd vid beslutstidpunkten,
- att signalranking, symboluniversum, exit, kostnader och mark-to-market inte ändras i smyg,
- att koncentrationsmåttet är entydigt och reproducerbart,
- att samtidiga entries är deterministiska,
- att Handel och Forward förblir AV,
- att observerade steg aldrig får rescue/rerun.

## Behåll
- Samma historiska researchgräns: 2024-12-31.
- Samma 16-symbolsuniversum som metodkontroll.
- Samma fasta signal/exit/kostnadsmodell som fryst Gen10 om inte ett senare mänskligt beslut uttryckligen väljer en annan ny hypotes före runnerspec-låsning.
- Daglig mark-to-market, next-open entry, fold-end liquidation och 0.1 % kostnad per sida.
- Immutable checkpoint + GitHub-evidens före continuation.
- Handel AV. Forward AV.

## Gates
Gen11 får inte lätta Gen10:s gates:
- minst 100 OOS-affärer totalt,
- PF >= 1.20,
- positiv total P/L,
- max fold mark-to-market-DD <= 12 %,
- koncentration <= 40 %,
- minst 3 positiva folds,
- varje fold PF >= 0.80,
- största folds andel av positiv fold-bruttovinst <= 55 %.

Alla gates måste klaras av en kandidat. Ingen rescue eller parameterändring efter observerat resultat.

## Nästa genuina beslut
**MÄNSKLIGT BESLUT KRÄVS:** godkänn eller förkasta Gen11-hypotesen innan någon maskinläsbar runnerspec, engine eller forskning byggs.

Vid godkännande är nästa säkra steg att formulera exakt en preregistrerad kandidatmekanism och dess fasta parametrar, därefter Auto Review + mänskligt runnerspec-godkännande. Ingen research får starta genom sidladdning eller automatisk continuation från detta förslag.

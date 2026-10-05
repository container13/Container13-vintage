# LINA Gen10 — planförslag för granskning

Status: **PROPOSAL / NOT_LOCKED**. Ingen Gen10-forskning, planlås, kandidat eller Forward skapas av detta dokument. Handel AV.

## Fryst källa
Gen9 är permanent fryst som NO_CANDIDATE. A hade 320 affärer, PF 1.332, DD 5.74 %, koncentration 66.29 % och sämsta fold PF 0.0419. B hade 315 affärer, PF 1.354, DD 5.74 %, koncentration 100 % och sämsta fold PF 0.0224. B:s binära breddstopp löste alltså inte worst-fold-problemet och försämrade koncentrationen.

## Hypotes
Pröva om en **förutbestämd graderad exponeringsregel baserad på marknadsbredd** kan minska svag-fold-risken utan att skapa Gen9 B:s extrema vinstkoncentration. Detta är ett nytt experiment; Gen9 får aldrig ändras eller köras om.

## Behåll
- Historisk researchgräns 2024-12-31 och samma 16-symbolsuniversum som metodkontroll.
- Daglig mark-to-market equity, next-open entry, fold-end liquidation, 0.1 % kostnad per sida och deterministisk samtidighet.
- Komplett trade/equity/fold-evidens före continuation.
- Handel och Forward AV.

## Ändra/testa
- Ersätt binärt köpstopp med graderad reduktion av ny positionsstorlek/exponeringskapacitet när bredden försvagas.
- Endast ett preregistrerat kontrollpar: ofiltrerad diagnostisk kontroll + en kandidatregel.
- Ingen parametergrid, TRAIN-ranking eller efterhandsjustering från 2022-resultatet.
- Runnerspec ska före research låsa exakta breddtrösklar, exponeringsnivåer, koncentrationsdefinition och syntetiska tester.

## Gates — ingen lättnad
Minst 100 OOS-affärer totalt; PF >=1.20; positiv total P/L; max fold mark-to-market-DD <=12%; koncentration <=40%; minst 3 positiva folds; varje fold PF >=0.80; största folds andel av positiv fold-bruttovinst <=55%.

Endast den graderade exponeringsvarianten är kandidatberättigad och endast om **alla** gates klaras. Kontrollen är diagnostisk. Ingen rescue, parameterändring eller rerun efter observerat resultat.

## Nästa mänskliga beslut
Granska planförslaget. Om det godkänns byggs och hash-låses exakt maskinläsbar plan/runnerspec **innan** någon Gen10-research får starta. 2021–2024 är observerad utvecklingshistorik och får inte kallas ny holdout.

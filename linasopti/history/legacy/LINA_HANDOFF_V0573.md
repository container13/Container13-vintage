# LINA HANDOFF – V0.57.3

## Full responsivitetsrevision
V0.57.2 var responsiv i skal/navigation men äldre inre tabeller hade fortfarande fasta/minsta bredder.

V0.57.3 reviderar hela paketet för:
- mobil
- 13-tum / mellanskärm
- stor desktop

## 13-tum
Detaljerade arbetsvyer använder upp till 1180 px av tillgänglig bredd.
Normala tabeller har inte längre gamla `min-width:760px`.
Text får radbrytas och huvudtabeller ska rymmas utan horisontell scroll.

## Affärslogg
De åtta kolumnerna får proportionell bredd.
`Orsak` får störst utrymme.
Resultat och kortare fält komprimeras.

## Mobil
Normala användartabeller reflowar automatiskt till kort:
`Rubrik → värde`
för varje cell.
Rubriker hämtas från tabellens riktiga TH-celler även för dynamiskt skapade rader.

## Undantag
Endast genuina rå-/diagnostabeller får behålla horisontell scroll.

## Permanent regel
Normal användarinformation ska rymmas utan horisontell scroll på 13-tum.
Mobil ska reflowa breda tabeller.
Rådata får scrolla horisontellt endast när det verkligen behövs.

## Övriga permanenta regler
Dashboard → kategori → arbetsvy.
Kör/Starta/Fortsätt utför handlingen; Öppna/Visa navigerar.
Två ZIP per release.
Gamla handoff-filer ändras inte.
Ingen bildgenerering utan uttrycklig begäran.

## Oförändrat
Ingen strategi-, signal-, data-, risk- eller forwardlogik.
Jägaren anchor 2026-09-11.
Swing G1 anchor 2026-09-14.
Swing G1 hash 8f09f32a.
Swing G2 oförändrad.
Handel AV.
Robotmognad 48/100.

# Återfunnen forskning ur chatt28okt.txt
Status: HISTORISK CHATTDOKUMENTATION, ej ny verifierad forskning. Källan börjar mitt i en diskussion och slutar med avbruten anslutning.

## 2022: Gen14–Gen16
| Modell | Affärer | Vinnare | Förlorare | P/L |
|---|---:|---:|---:|---:|
| Gen14 kontroll | 18 | 2 | 16 | -5230 |
| Gen14 bekräftelse | 11 | 3 | 8 | -3203 |
| Gen15 trendexit | 18 | 1 | 17 | -4814 |
| Gen16 breakout | 13 | 1 | 12 | -4133 |

Simuleringarna använder överlappande data och får inte summeras som oberoende. Exempel ur Gen16: GM 5–21 januari cirka -660; NVDA 30 mars–14 april cirka -868; TSLA 30 mars–14 april cirka -343. Förlusterna var spridda över många aktier.

## När förlusterna uppstod
Gen16-affärer öppnade i januari, mars och december gav tillsammans cirka -3413, cirka 83 % av nettotappet -4133. Decemberpositioner: LUV 1–16 dec -320, SHOP 2–19 dec -542, NFLX 2–19 dec -249, NVDA 2–19 dec -89. Fyra samtidiga positioner; cirka 14773 investerat i modellvaluta.

## Gen16: portföljbokföring
Enligt chattens granskning av 251 dagliga portföljposter: max fyra öppna positioner (2 december), högsta aktieexponering 15,4 %, nio avvisade dubbelsignaler, startvärde 100000, slutvärde 95867. Äldre Gen6–8-markering actualSharedPortfolio:false får inte automatiskt överföras till Gen16.

## Gen16: simuleringsregler
Föregående dags signal och köp på nästa dags öppning, signaler prioriterade efter styrka, högst åtta positioner, inga dubbla innehav, kontantbegränsning, kostnadsantagande 0,1 % vid köp och 0,1 % vid försäljning. Exit efter 12 handelssessioner till stängningskurs, ingen skyddande stop-loss. Alla 13 affärer 2022 hade TIME_12-exit.
Rapporterad kontroll: trade-P/L stämde mot slutvärde, inga negativa kontantsaldon, alla positioner stängda vid årets slut. Detta visar bokföringskonsistens, inte realistiska orderfyllnader.

## Slutsatser och begränsningar
2022 var brett svårt för de testade trend-/breakoutmodellerna; svag signalträffsäkerhet trots låg total exponering. Det bevisar inte att alla strategier misslyckas. Fast kostnadspåslag ersätter inte separat courtage, växling, spread, orderdjup och variabel slippage. Forskningsrobusthet och teknisk exekveringsrealism är skilda frågor.

## Exakt avbrutet nästa steg
Skrivskyddad dataintegritetsrevision: spåra Gen16:s underliggande OHLC-kurser, kontrollera om de kan återskapas exakt och om evidenshasharna skyddar rådata. Kontrollera också skyddet för fryst Forward-historik. Ingen rerun, inga ändringar av fryst evidens, Handel och Forward AV.

## Källstatus
Denna fil sammanfattar användarens uppladdade chatt28okt.txt; originalets ordalydelse och eventuella ofullständiga resonemang finns i användarens uppladdning. Siffrorna är återgivna chattuppgifter, inte självständigt nyverifierade GitHub-resultat.

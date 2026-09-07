# Linas Opti V0.27

V0.27 bygger första riktiga Opti Day-motorn och snyggar toppfältet på mobil.

- Opti Swing lämnas oförändrad som verifierad kontroll.
- Opti Day använder 5-minutersdata och kan göra flera affärer samma dag.
- Signal beräknas på en avslutad 5-minutersbar och simulerad entry sker först på nästa bars öppning.
- Long-only i denna första version: momentum eller återhämtning efter snabb nedgång.
- Stop 0,8 %, mål 1,2 %, max 60 min i position.
- Max 12 affärer per dag och max 3 per symbol, aldrig flera samtidiga positioner i samma symbol och ingen övernattning.
- Spread/slippage finns kvar i Day-testet.
- Full testdata exporterar nu även alla Opti Day-affärer.
- Nya Opti Day-snabbval för 5, 20 och 60 dagar för att hålla 5-minutershämtningen rimlig.
- Mobil topp: status/version ligger på egen rad och kan inte krocka med underrubriken.

Trading är fortsatt avstängd; endast backtest/paper.

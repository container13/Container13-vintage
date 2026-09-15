# Lina G12 Research Battery Plan – V0.2.26

**PLAN LÅST · 403fef49**

```json
{
  "candidate": "15efd75a",
  "period": [
    "2020-01-01",
    "2026-09-10"
  ],
  "universe": [
    "AAPL",
    "MSFT",
    "AMZN",
    "GOOGL",
    "META",
    "JPM",
    "XOM",
    "UNH",
    "JNJ",
    "PG",
    "KO",
    "CAT",
    "HD",
    "DIS",
    "NKE",
    "WMT"
  ],
  "baseCostPerSide": 0.001,
  "tradeEnabled": false,
  "source": "frozen G4 closed-trade ledger",
  "test": "PORTFOLIO_CAPITAL_STRESS",
  "capitalScales": [
    0.5,
    0.75,
    1,
    1.25,
    1.5
  ],
  "method": "scale frozen trade P/L against 100000 capital; sequence unchanged; diagnostic only",
  "pass": "all scales final>0 and 1.5x maxDD<=10%",
  "hold": "all final>0 and 1.5x maxDD<=15%",
  "fail": "otherwise",
  "planHash": "403fef49",
  "locked": true,
  "lockedIn": "V0.2.26"
}
```

Ingen rescue. Resultat i G7–G12 får inte ändra någon annan plan i batteriet. Handel AV.

# Lina G8 Research Battery Plan – V0.2.26

**PLAN LÅST · 46c80eee**

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
  "test": "SYMBOL_CONCENTRATION",
  "method": "symbol contribution + remove each symbol from frozen trade ledger",
  "pass": "largest positive symbol <=30% of positive symbol P/L and >=10/16 symbols non-negative",
  "hold": "largest <=40% and >=8/16 non-negative",
  "fail": "otherwise",
  "planHash": "46c80eee",
  "locked": true,
  "lockedIn": "V0.2.26"
}
```

Ingen rescue. Resultat i G7–G12 får inte ändra någon annan plan i batteriet. Handel AV.

# Lina G9 Research Battery Plan – V0.2.26

**PLAN LÅST · c82b5c2a**

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
  "test": "TRADE_SEQUENCE_MONTE_CARLO",
  "runs": 10000,
  "seed": 15092026,
  "method": "shuffle frozen trade P/L sequence; capital 100000",
  "pass": "p95 max drawdown <=10% and p05 final capital >100000",
  "hold": "p95 DD<=15% and median final>100000",
  "fail": "otherwise",
  "planHash": "c82b5c2a",
  "locked": true,
  "lockedIn": "V0.2.26"
}
```

Ingen rescue. Resultat i G7–G12 får inte ändra någon annan plan i batteriet. Handel AV.

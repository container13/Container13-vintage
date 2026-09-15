# Lina G11 Research Battery Plan – V0.2.26

**PLAN LÅST · 0cc6ede6**

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
  "test": "ENTRY_EXIT_EXECUTION_ROBUSTNESS",
  "scenarios": [
    "baseline",
    "entry+0.10%",
    "exit-0.10%",
    "both 0.10%",
    "both 0.20%"
  ],
  "pass": "4/5 positive and PF>=1.00 incl both 0.10%",
  "hold": "3/5 positive",
  "fail": "otherwise",
  "planHash": "0cc6ede6",
  "locked": true,
  "lockedIn": "V0.2.26"
}
```

Ingen rescue. Resultat i G7–G12 får inte ändra någon annan plan i batteriet. Handel AV.

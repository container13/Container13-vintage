# Lina G10 Research Battery Plan – V0.2.26

**PLAN LÅST · 80385a7e**

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
  "test": "PARAMETER_NEIGHBORHOOD_STABILITY",
  "note": "non-rescue diagnostic around frozen point",
  "dimensions": {
    "breakout": [
      50,
      55,
      60
    ],
    "volume": [
      1.4,
      1.5,
      1.6
    ],
    "stop": [
      0.06,
      0.07,
      0.08
    ],
    "target": [
      0.13,
      0.15,
      0.17
    ],
    "hold": [
      8,
      10,
      12
    ]
  },
  "method": "local sensitivity proxy from frozen trades: exit/holding perturbation stress; candidate itself never changes",
  "pass": "central result positive and >=70% proxy-neighbors positive",
  "hold": ">=55% positive",
  "fail": "otherwise",
  "planHash": "80385a7e",
  "locked": true,
  "lockedIn": "V0.2.26"
}
```

Ingen rescue. Resultat i G7–G12 får inte ändra någon annan plan i batteriet. Handel AV.

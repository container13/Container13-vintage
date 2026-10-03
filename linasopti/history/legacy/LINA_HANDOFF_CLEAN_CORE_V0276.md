# Lina Clean Core V0.2.76 — handoff

Syfte: diagnostisera Gen5-datafelet utan att starta eller köra om research.

- Gen5 planhash `d501a5e1` oförändrad.
- Gen5 runnerspechash `db1c4d7f` oförändrad.
- Handel AV, Forward stängd, Gen4 orörd, Worker oförändrad.
- Ny `Kör datakällediagnos` provar AMD 2020 mot samma tre Worker-rutter som Gen4.
- Sparar/exporterar URL, HTTP-status, content-type, body preview, JSON/top-level, sample keys, råa/normaliserade rader, första/sista datum.
- Probe startar ingen research. Vid probe-stopp state är STOPPED_BEFORE_RESEARCH.
- Researchknappen visas först om probe hittar minst en HTTP-ok dataväg med normaliserbara bars; full 16-symbol/2020–2024 preflight kvarstår före research.
- Nästa steg: användaren kör probe en gång och exporterar `LINA_GEN5_DATA_SOURCE_PROBE_*.json` för exakt rotorsaksanalys.

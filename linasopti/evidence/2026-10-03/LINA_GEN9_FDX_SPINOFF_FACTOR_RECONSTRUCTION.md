# Gen9 – FDX spin-off factor reconstruction

2026-10-03 • MARKET_IMPLIED_FACTOR_CLOSELY_REPRODUCED_VENDOR_ALGORITHM_NOT_EXPLICIT

FedEx confirmed the June 1, 2026 FedEx Freight separation and a distribution of one FDXF share for every two FDX shares. During May 27–29 there were separate when-issued markets for ex-distribution FDX and for the FDXF distribution entitlement.

Public May 29 closing observations: regular-way FDX 411.75 USD and FDXF-WI 160.37 USD. The market-implied ex-distribution factor is:

(411.75 - 0.5 * 160.37) / 411.75 = 0.805258044930176

The previously reproduced candidate/Yahoo FDX ratio has median 0.8058017740753254 across 5032 OHLC comparisons, range 0.7900818914455453–0.8270538941955641. The market-implied factor is therefore about 0.0005437291 below the candidate median, about 0.0675% relative.

This closely supports the FedEx Freight separation as the main source of the historical scaling, but it does not by itself prove Yahoo's exact vendor factor. Yahoo Help documents split and cash-dividend multipliers and CRSP standards, but the reviewed page does not explicitly state a spin-off formula.

FedEx Form 8937's roughly 81.55% tax-basis allocation is not treated as a vendor price factor.

No prices are patched, no vendor fields are mixed, and no verification flag is set from tolerance. Exact closure still requires explicit Yahoo/CRSP spin-off methodology or sufficiently precise Yahoo corporate-action adjustment data.

Gen9 remains NOT APPROVED. Gen8 was not rerun. Trading/Forward OFF. No Worker change or deploy. Candidate data unchanged.

Sources:
FedEx investor releases (May 13 and June 1, 2026); Yahoo Help SLN28256; public May 29 FDX and FDXF-WI quote records.


## Uppföljning – CRSP-metoden verifierad

Yahoo Help säger uttryckligen att adjusted close använder lämpliga split- och dividendmultiplikatorer enligt CRSP-standard. CRSP Market Indexes Methodology Guide 2024 anger uttryckligen metoden för en spin-off när when-issued-handel finns före ex-dagen:

Parent adjusted SOD price = parent close dagen före ex-dagen - spun-off company closing WI price dagen före ex-dagen * spin-off ratio.

Detta är exakt samma strukturella formel som användes i den tidigare marknadsrekonstruktionen. FedEx distributionsdokumentet styrker dessutom att FDXF WI handlades till och med 2026-05-29 och att distributionskvoten var 1 FDXF per 2 FDX.

Därmed är metodluckan stängd på standardnivå: Yahoo anger CRSP-standard och CRSP dokumenterar explicit spin-off-formeln för when-issued-fallet. Kvarvarande skillnad mellan den publikt avrundade rekonstruktionen 0.805258044930176 och kandidatmedianen 0.8058017740753254 ska däremot inte döljas eller användas som toleransbaserad verifieringsflagga. Exakt vendor-input/precision för den enskilda Yahoo-justeringen är fortfarande inte direkt observerad.

Status preciseras därför till: **CRSP_SPINOFF_METHOD_VERIFIED_EXACT_VENDOR_INPUT_PRECISION_UNRESOLVED**.

Källor:
- Yahoo Help, What is the adjusted close?: https://help.yahoo.com/kb/SLN28256.html
- CRSP Market Indexes Methodology Guide 2024, Appendix A / Price Adjustment Table: https://www.crsp.org/wp-content/uploads/guides/CRSP_Market_Indexes_Methodology_Guide_2024.pdf
- FedEx distribution/trading details filed with SEC: https://www.sec.gov/Archives/edgar/data/1048911/000110465926060233/tm2520565d14_ex99-4.htm

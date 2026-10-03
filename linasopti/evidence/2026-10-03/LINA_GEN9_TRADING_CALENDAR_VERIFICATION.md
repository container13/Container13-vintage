# Gen9 – NYSE trading-calendar verification

2026-10-03 • TARGET_CALENDAR_VERIFIED

## Resultat

Gen9-kandidatfilen SOURCE_gen9-data.json (blob SHA 5ac082c346db53fabccb9ab5009bb99527f764e1; original data SHA-256 enligt manifest cb84e436a0527b44262949994306dcb85eaf5f10ad88fc7906d443833cc6589c) jämfördes datum-för-datum mot NYSE:s officiella stängningskalender för 2020–2024.

Förväntade US cash-equity trading days:
- 2020: 253
- 2021: 252
- 2022: 251
- 2023: 250
- 2024: 252
- Totalt: 1258

Samtliga 16 symboler har exakt 1258 unika datum, från 2020-01-02 till 2024-12-31. För varje symbol är mängden datum exakt lika med den konstruerade NYSE-kalendern:
- saknade handelsdagar: 0
- extra datum: 0
- dubblettdatum: 0

Kontrollen inkluderar NYSE:s ordinarie helgdagar och Juneteenth från 2022. Tidiga stängningar är fortfarande handelsdagar och exkluderas därför inte.

2020 års tillfälliga stängning av NYSE:s fysiska handelsgolv skapade ingen kalenderlucka; NYSE fortsatte elektronisk handel under normala handelstider.

## Beslut

**calendarVerified = true för Gen9-kandidatens datumaxel 2020–2024.**

Detta verifierar endast att kandidatens datumuppsättning motsvarar NYSE:s US cash-equity trading calendar. Det verifierar inte OHLC-värden, corporate-action-justeringar, leverantörsoberoende eller datasetet som helhet.

Gen9 är fortsatt NOT APPROVED. Gen8 har inte körts. Handel/Forward AV. Ingen Worker-ändring eller deploy. Kandidatdata oförändrad.

## Primärkällor

- ICE/NYSE holiday calendar 2020–2022: https://ir.theice.com/press/news-details/2019/NYSE-Group-Announces-2020-2021-and-2022-Holiday-and-Early-Closings-Calendar/default.aspx
- ICE/NYSE holiday calendar 2021–2023: https://ir.theice.com/press/news-details/2020/NYSE-Group-Announces-2021-2022-and-2023-Holiday-and-Early-Closings-Calendar/default.aspx
- ICE/NYSE holiday calendar 2022–2024: https://ir.theice.com/press/news-details/2021/NYSE-Group-Announces-2022-2023-and-2024-Holiday-and-Early-Closings-Calendar/default.aspx
- NYSE 2024 yearly trading calendar: https://www.nyse.com/publicdocs/ICE_NYSE_2024_Yearly_Trading_Calendar.pdf
- NYSE electronic trading during 2020 floor closure: https://www.nyse.com/article/necessary-step-all-electronic-trading

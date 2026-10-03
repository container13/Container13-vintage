# Gen9 – FDX/PYPL: bolagshändelser och exakta faktorer

2026-10-03 • EVENTS_VERIFIED_EXACT_VENDOR_FACTORS_UNRESOLVED

## Resultat

FedEx bekräftar avknoppningen av FedEx Freight den 1 juni 2026, med en FDXF-aktie per två FDX-aktier. Händelsen ligger efter dataperioden 2020–2024. FedEx Form 8937 illustrerar skattebasens fördelning med VWAP 336.39 USD för FDX och 152.22 USD för FDXF, vilket ger cirka 81.55% kvar på FDX. Detta är skattebasfördelning, inte en styrkt Yahoo-prisfaktor.

PayPals SEC 8-K den 28 oktober 2025 styrker starten av kvartalsutdelningar: 0.14 USD per aktie, record date 19 november, betalning 10 december. Den styrker händelsen men inte hela produktkedjan bakom dagens historiska justeringsfaktor.

## Reproducerad numerisk kontroll

- PYPL: 1258 kandidatdagar. AdjClose/quoteClose ligger mellan 0.9889709358572251 och 0.9889712748240216, median 0.9889711061369744. Nästan konstant faktor; exakt orsak och samtliga senare utdelningsfaktorer inte rekonstruerade.
- FDX: 5032 OHLC-jämförelser mellan sparad Yahoo quote och Alpaca raw. Median cirka 0.8058017740753254, men spann 0.7900818914455453–0.8270538941955641. En gemensam skalning stöds övergripande; den verifierar inte samtliga fält.
- FDX:s tidigare sju oberoende prisprov ligger nära 0.80580177. Dessa prov verifierar inte alla 2020–2024-rader.
- 81.55% skattebas och cirka 80.58% observerad prisskala får inte blandas ihop. Avknoppningens utdelningskvot i antal aktier är inte heller i sig en prisfaktor.

## Beslut och nästa krav

Senare bolagshändelser är förenliga med bakåtjustering av tidigare historik. Detta är en möjlig förklaring, inte bevis för leverantörens exakta beräkning. Krävs: komplett händelsekedja fram till datans justeringsreferens, relevanta föregående stängningspriser, leverantörens spin-off-metod och verifierad OHLC-bas. Ingen faktor ersätts eller återställs till 1.

PYPL kan gå vidare genom en separat diagnostisk hämtning av Yahoo-händelser och priser från 2025 till uttagstidpunkten och numerisk rekonstruktion enligt styrkt leverantörsmetod. Det kräver datumintervall utanför nuvarande Worker-endpoint för Gen9, som är begränsad till 2020–2024. Ingen Worker ändrad eller deployad i denna kontroll.

FDX behöver dessutom leverantörens prisjustering för avknoppningen, inte bara IRS-bilagan. Om den inte går att styrka utvärderas ett komplett dataset från en enda alternativ källa; inga enskilda fält blandas.

Gen9 fortsatt NOT APPROVED. Kandidatdata, verifieringsflaggor och kod oförändrade. Gen8 orörd; Handel/Forward AV.

## Primärkällor

- https://investor.fedex.com/news-and-events/investor-news/investor-news-details/2026/FedEx-Completes-Spin-Off-of-FedEx-Freight/default.aspx
- https://s21.q4cdn.com/665674268/files/doc_downloads/2026/06/FedEx-Fairway-Form-8937-executed.pdf
- https://www.sec.gov/Archives/edgar/data/1633917/000163391725000194/pypl-20251028.htm

JSON-rapporten innehåller exakta intervall, extrema jämförelsefall och SHA-256 för ingående sparade källfiler. Yahoo-hjälpsidan om adjusted close identifierades men full hämtning fick HTTP 429; den räknas inte här som verifierad algoritm.

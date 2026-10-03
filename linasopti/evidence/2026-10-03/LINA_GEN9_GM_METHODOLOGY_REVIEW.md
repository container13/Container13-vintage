# Gen9 – regler för dagskurser och beslut om GM

Datum: 2026-10-03. Status: METHODOLOGY_DOCUMENTED_CASE_UNRESOLVED.
Ingen kod, kandidatdata eller verifieringsflagga ändrad.

## Vad primärkällorna styrker

Alpacas Market Data FAQ beskriver att minut- och dagsbarer byggs direkt från affärer med SIP-tid. Regler beror på tape, affärsvillkor och bartyp. Exempelvis kan prior-reference-affärer påverka dags-high men inte minut-high; extended-hours-affärer påverkar minutpris men inte dagspris. Femminutersbarer byggs däremot från minutbarer. Därför är en dagsbar inte nödvändigtvis en enkel sammanställning av dagens minutbarer. Det styrker metoden, inte vilken enskild GM-affär som gav ett värde.

Källa: https://docs.alpaca.markets/us/docs/market-data-faq
Kontrollerade avsnitt: How are bars aggregated?, regler och aggregering.

Twelve Data beskriver skillnader mellan officiella EOD-priser och intradagssvar samt mellan leverantörers underlag och beräkningar. Deras felsökningssida anger att dagsdata följer börsens officiella EOD-data. Ingen av dessa sidor förklarar GM-raden 2023-06-05 eller anger vilka villkor som skulle ge high lägre än open. Allmän metodinformation är inte bevis för det enskilda värdet.

Källor:
- https://support.twelvedata.com/en/articles/6374888-why-close-and-ohlc-prices-can-differ
- https://support.twelvedata.com/en/articles/5183240-problems-with-data

Yahoo-metod för just denna rad har inte styrkts. Ett försök att läsa Yahoo-hjälpen gav åtkomstfel; det räknas inte som evidens.

## Beslut

- Alpacas generella aggregeringsregler är dokumenterade.
- GM:s high 34.49 är internt stödd av Alpacas dags- och femminuterssvar, men de är samma leverantör.
- GM:s daily open 34.45 kontra första regular-session-femminutersbarens open 34.49 kan vara förenligt med skilda villkorsregler. Detta är en möjlighet, inte en verifierad förklaring.
- Twelve high 34.375 kontra open 34.45000076 klarar inte Linas nuvarande OHLC-kontrakt. Det är ett fastställt kontraktsbrott, inte bevis att varje marknadskälla alltid måste använda identiska definitioner.
- Tidigare benämning ”Twelve-felet” ska läsas som ”raden underkänns av Linas validering”; leverantörens rotorsak är fortfarande obekräftad.
- GM-blockern är öppen. Ingen high ersätts, ingen källa blandas och ingen validering lättas.
- Gen9 är NOT APPROVED, forskning inte startad, Handel/Forward AV, Gen8 orörd.

## Vad som behövs för att stänga fallet

En rad-specifik källförklaring eller korrigering från leverantören, alternativt verifiering mot ursprungliga affärer med handelsvillkor och motsvarande dagsregler. Befintlig Worker ger bars, inte historiska affärer med villkorskoder. En ny bars-hämtning kan därför inte ensam verifiera rotorsaken. Ingen ny Worker-deploy har gjorts.

GM-utredningen pausas i väntan på källbesked. Nästa oberoende arbetsdel är FDX/PYPL:s justeringsfaktorer.

## Supportfråga för Twelve Data – förberedd, inte skickad

Subject: GM 2023-06-05 daily OHLC: high below open

For GM (United States), time_series interval=1day, start_date=2023-06-05T00:00:00, end_date=2023-06-05T23:59:59, timezone=America/New_York, adjust=none, prepost=false, dp=8 returns open 34.45000076, high 34.375, low 33.65999985, close 34.13000107 through our Worker.

Please explain or correct this specific row. Are open and high derived from different eligible trade sets or official EOD fields? Which source and trade-condition rules apply to this date? If the values are intentional, please document the definition that permits high below open.

For comparison only, our saved Yahoo raw row has open/high 34.45000076293945; Alpaca SIP daily raw has open 34.45, high 34.49. An Alpaca regular-session five-minute bar at 2023-06-05T13:30:00Z has high 34.49. These comparisons do not establish which row is authoritative.

We have not patched data or relaxed validation. No credentials are included.

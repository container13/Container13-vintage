# Gen9 – PYPL justeringsfaktor rekonstruerad

2026-10-03 • YAHOO_DIVIDEND_CHAIN_RECONSTRUCTED

## Resultat

PYPL:s nästan konstanta historiska AdjClose/quoteClose-faktor i Gen9-kandidatunderlaget är numeriskt rekonstruerad som produkten av fyra senare kontantutdelningar om 0,14 USD per aktie.

Yahoo Finance dokumenterar att historiska priser före en kontantutdelnings ex-datum multipliceras med `1 - dividend / previous_close`. Yahoo-historiken visar fyra PYPL-utdelningar efter kandidatperioden och till och med kandidatens justeringsreferens: 2025-11-19, 2026-03-04, 2026-06-04 och 2026-09-04, samtliga 0,14 USD.

Föregående handelsdags stängningar i Yahoo-historiken är:
- 2025-11-18: 60,70
- 2026-03-03: 46,38
- 2026-06-03: 42,61
- 2026-09-03: 56,82

Med Yahoos publicerade formel blir delmultiplikatorerna:
- 1 - 0,14 / 60,70 = 0,9976935749588138
- 1 - 0,14 / 46,38 = 0,9969814575247952
- 1 - 0,14 / 42,61 = 0,9967143862942971
- 1 - 0,14 / 56,82 = 0,997536078845477

Produkt med de publikt avrundade tvådecimalsstängningarna: **0,9889710881644362**.

Tidigare reproducerad median i kandidatfilen: **0,9889711061369744** (intervall 0,9889709358572251–0,9889712748240216).

Absolut rest mot median: cirka **1,80e-8**. Relativ rest: cirka **1,82e-8**, alltså ungefär **0,00000182 %**. Resten är förenlig med att webbsidans visade stängningar är avrundade till två decimaler medan leverantörens interna beräkning använder högre precision. Detta är en numerisk förklaring, inte en ny verifieringsflagga.

## Källkontroll

Yahoo Help anger uttryckligen dividend multiplier som `1 - dividend / previous close` och att multiplikatorn appliceras på historik före ex-datum.

Yahoo PYPL Historical Data visar:
- 2025-11-19: 0,14 dividend; 2025-11-18 close 60,70.
- 2026-03-04: 0,14 dividend; 2026-03-03 close 46,38.
- 2026-06-04: 0,14 dividend; 2026-06-03 close 42,61.
- 2026-09-04: 0,14 dividend; 2026-09-03 close 56,82.

PayPals SEC-rapportering styrker att programmet inleddes med 0,14 USD per aktie i november 2025 och att 0,14 USD betalades även för record dates 2026-03-04 och 2026-06-04. Yahoo-historiken är här den vendor-specifika källan för själva justeringskedjan.

## Slutsats för Gen9

PYPL-avvikelsen mellan sparad raw quoteClose och Yahoo AdjClose behöver inte behandlas som en okänd skalning längre: den reproduceras av Yahoos dokumenterade dividendjustering över de fyra efterföljande 0,14-utdelningarna fram till september 2026.

Detta **godkänner inte Gen9-datasetet som helhet** och ändrar inte kandidatdata. Ingen leverantör blandas in i prisfälten, ingen fryst evidence skrivs över och inga verifieringsflaggor sätts automatiskt. Övriga blockerare kvarstår, inklusive FDX:s vendor-specifika spin-off-/justeringskedja, GM, AMD/NOW, full OHLC-bas, kalender och oberoende datalinje.

Gen9 är fortsatt NOT APPROVED. Gen8 har inte körts. Handel/Forward AV. Ingen Worker-ändring eller deploy.

## Källor

- Yahoo Help, “What is the adjusted close?”: https://in.help.yahoo.com/kb/adjusted-close-sln28256.html
- Yahoo Finance, PYPL Historical Data: https://finance.yahoo.com/quote/PYPL/history/
- PayPal/SEC 10-K/årsrapport för första utdelningen: https://www.sec.gov/Archives/edgar/data/1633917/000119312526145735/d45512dars.pdf
- PayPal/SEC 10-Q 2026-06-30: https://www.sec.gov/Archives/edgar/data/1633917/000163391726000082/pypl-20260630.htm

Beräkningen använder endast publikt visade tvådecimalsstängningar för reproduktion; den lilla resten mot kandidatmedianen ska därför inte tolkas som ett nytt datakvalitetsfel.

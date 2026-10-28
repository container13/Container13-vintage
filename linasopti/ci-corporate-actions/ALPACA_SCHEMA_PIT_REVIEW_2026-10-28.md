# Alpaca Corporate Actions – extern dokumentationsgranskning 2026-10-28

Status: STATIC DOCUMENTATION REVIEW. Ingen autentiserad providerförfrågan, ingen ändring av Lina Worker.

## Verifierat från Alpacas officiella Market Data API
- Endpoint: GET https://data.alpaca.markets/v1/corporate-actions
- Filtrering: symbols, types (bl.a. forward_split, cash_dividend), start/end baserat på process_date, paginering via next_page_token/page_token och total limit.
- data_quality=complete exkluderar i normalfallet icke-processade ofullständiga poster; data_quality=all kan ta med preliminära och ofullständiga poster. Redan processade poster kan återkomma med complete även om fält saknas.
- **Varning i officiella API-referensen:** Alpaca garanterar inte skapandetidpunkt för corporate actions; fördröjning kan förekomma både hos källleverantör och i deras behandling. Historisk data härifrån är därför INTE självständigt point-in-time-/as-of-bevis.

Källor (åtkomna 2026-10-28):
https://docs.alpaca.markets/us/reference/corporateactions-1
https://docs.alpaca.markets/us/v1.1/reference/corporateactions-1
https://github.com/alpacahq/cli/blob/main/api/specs/market-data-api.json

## Betydelse för V3.1 och forskningssäkerhet
- V3.1:s process_date/ex_date, old_rate/new_rate och dividend rate kontrolleras strukturellt och numeriskt, men ska INTE likställas med bekräftelse på exakt provider-payload eller historisk publicerings-/mottagandetid.
- Särskilj REST Market Data Corporate Actions från Broker Corporate Actions Announcements: de har olika endpoints/scheman. Blanda inte `cash` på Broker-announcements med `rate` på Market Data utan verifiering.
- När provider svarar med saknad/avvikande fält ska provet stoppa eller klassificera som incomplete, aldrig tolka osäker data som full validering.
- Eventuell framtida riktig providerdiagnostik kräver separat beslut och kontrollerad behörighet; inga API-hemligheter i GitHub/utdata.
- Ingen Gen17-planlåsning, forskning eller Forward; Gen8–16 fortsatt frysta, Gen17 DRAFT_ONLY, Handel AV.

## Beslut
GO för fortsatt offlinetestning av schema/fixtures i isolerad gren.
NO-GO för att hävda point-in-time-säker historisk datatillgänglighet, produktionsdeploy eller verklig Alpaca-diagnostik utan kvarvarande release-/behörighetsgrindar.

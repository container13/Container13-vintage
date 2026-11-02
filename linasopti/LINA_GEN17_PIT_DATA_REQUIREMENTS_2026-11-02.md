# Gen17 PIT-datakrav – utkast 2026-11-02
Status: DRAFT_ONLY / PIT_UNVERIFIED. Ingen planlåsning eller research.
## Kursdata
Kräv symbol, session_date, timezone, OHLCV, currency, vendor, price_basis (RAW_AS_TRADED/SPLIT_ADJUSTED/TOTAL_RETURN_ADJUSTED/UNKNOWN), observed_at_utc, styrkt vendor_published_at_utc där tillgängligt, snapshot_id och SHA-256 för råpayload.
## Bolagshändelser
Kräv event_id, symbol, typ, ex/record/payable-date, styrkt announcement/first_seen timestamp, revisions-ID, källa och råpayloadhash. Splitkvoter och kontantutdelningar bokförs separat; cash ledger får inte dubbelräkna justerad avkastning. Revisioner append-only.
## PIT-gates
1. Endast data verifierbart tillgängliga vid decision_time får användas.
2. Reproducerbar snapshot och tidsstämplad revisionskedja krävs.
3. Prisbasen måste styrkas; faktor=1 betyder inte att split saknas.
4. Testa efterföljande utdelning, split, sen publicering och revision: äldre beslut ska vara oförändrade.
5. Utan historiska as-of-vintages/first-seen-evidens: PIT_UNVERIFIED, inte godkänt.
6. Dokumentera delistningar, survivorship bias, sessionstider och saknade observationer.
## Grundad nulägesbedömning
Gen16:s 20128 frysta rader har byteintegritet, inte PIT-certifiering. 129/129 faktorhopp matchar inbäddade utdelningsdatum, inte oberoende vintages. PYPL visar senare utdelningspåverkan på historisk prisbas. Historiska vendor-vintages är ej styrkta.
## Nästa steg
Inventera befintliga datakällors fält skrivskyddat: STYRKT / SAKNAS / OKÄNT. Ingen ny Alpaca-förfrågan, Worker- eller motorändring. Gen8–16 frysta; handel och Forward AV. Enda gren ccc-demo-public-test.

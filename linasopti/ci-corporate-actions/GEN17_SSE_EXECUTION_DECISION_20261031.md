# Gen17 SSE execution decision — 2026-10-31

## Verification
Official SSE documentation reconfirmed: https://docs.alpaca.markets/us/reference/subscribetocorporateactionseventssse . Endpoint `GET https://stream.data.alpaca.markets/v1beta1/events/corporate-actions`, `since` and `until` refer to **emission timestamps**, not corporate-action ex-dates. `until` requires `since`. Replay semantics and event IDs documented; no guaranteed retention horizon.

A direct unauthenticated reachability probe from the assistant container failed at DNS resolution (curl error 6); **no authenticated SSE request was executed**. This does not indicate Alpaca outage, entitlement denial or lack of historical data. The live V0.4.46 REST corporate-actions diagnostic remains a verified structural PASS for AAPL 2020, not PIT.

## Next implementation
Build a minimal, read-only, authenticated, bounded SSE diagnostic in the existing Worker using Worker-held `APCA_API_KEY_ID` and `APCA_API_SECRET_KEY`. Reuse existing `X-Lina-Login-Code` authorization. Limit one UTC emission-day range, streaming bytes, event count and wall time; abort upstream on limits; sanitize output (HTTP status, observed event envelope keys, event_id and emission timestamp presence, counts, limit reason). No persistent stream, raw credentials or unbounded data. Distinguish zero events from retention cutoff; do not claim PIT coverage from one success. Review code and deployment safety before changing production. Keep trading/Forward OFF, Gen17 DRAFT_ONLY.

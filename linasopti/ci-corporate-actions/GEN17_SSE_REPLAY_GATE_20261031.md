# Gen17 — Alpaca corporate-actions SSE replay gate (2026-10-31)

## Confirmed from official Alpaca documentation
Source: https://docs.alpaca.markets/us/reference/subscribetocorporateactionseventssse
- SSE endpoint: `GET https://stream.data.alpaca.markets/v1beta1/events/corporate-actions`.
- Stream represents insert/update/delete mutations, not merely latest REST snapshots.
- `since` (RFC3339) replays events **emitted** on/after a date; `until` closes at end date and requires since. `since_id` and Last-Event-Id replay from event_id, inclusive; deduplicate IDs.
- Optional `type` and `region` filters. Credentials via APCA-API-KEY-ID / APCA-API-SECRET-KEY.
- Published documentation does not establish earliest replay date, retention guarantee, account entitlement, reliable event publish timestamp in payload, or replay completeness for Gen17's required history.
- Do NOT conflate separate account-activities SSE docs with this market-data corporate-actions SSE.

## Decision
Historical PIT still **UNVERIFIED / BLOCKED**. Existing V0.4.46 authenticated REST diagnostic has already passed (see GEN17_V046_LIVE_ALPACA_READBACK_20261031.md); no reason to repeat. Gen17 DRAFT_ONLY, Gen8–16 frozen, trading and Forward OFF.

## Safe next experiment (NOT YET RUN)
A reviewed, read-only, bounded SSE diagnostic, ideally server-side with existing Worker-held Alpaca credentials, for a single short historical period (e.g. one day in 2020 and one day in 2026) with explicit byte/event/time limits and no persistent streaming, recording status, event envelope field names, earliest observed emission timestamp, number of events and completeness/timeout flags. No keys in chat or repository. A zero-event result does NOT establish lack of retention. A 200 status alone does NOT prove PIT fidelity. Require authoritative provider retention/availability confirmation before promoting PIT data.

## Guardrails
Do not deploy new Worker or change release without reviewing impact; do not infer event first-availability from ex_date/record_date/payable_date/process_date. Confirm SSE response schema and whether event_id timestamp encodes actual publication time before claiming PIT validity.

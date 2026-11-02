# Gen17 – existing timestamped archive inventory (2026-11-02)
Status: READ_ONLY_REPOSITORY_TREE_AUDIT / PIT_UNVERIFIED. No new replay, vendor request or research.
## Scope
Enumerated full GitHub tree on ccc-demo-public-test (1768 entries, not truncated) and read existing saved files. This is a repository inventory, NOT an exhaustive search of private external archives.
## Existing artifacts found
- linasopti/runtime-reports/GEN17_SSE_SAMPLE_20260916_2026-11-02T02-07-06-602Z_af7522b71714.json: providerStatus=200, events=20, bytes=10809, 3 sampled envelopes, at=2026-09-16T00:01:26Z vicinity, action=update, event_id and ca.id present; observedAt=2026-11-02T02:07:06.580Z; complete=false; pitVerified=false. Event stream timestamp 'at' is NOT independently certified as first consumer availability.
- Two additional runtime diagnostic reports for 2020-08-31 and 2026-09-15 exist; contents not re-audited in this step.
- linasopti/ci-corporate-actions/GEN17_PIT_PROVIDER_DOCUMENTATION_FINDINGS_20261031.md already establishes Alpaca does not guarantee event creation time and that SSE replay retention, chronology and full coverage are not proven.
- linasopti/ci-corporate-actions/GEN17_V046_LIVE_ALPACA_READBACK_20261031.md: authenticated AAPL 2020 structural pass, NOT historical PIT.
- linasopti/evidence/2026-10-03/LINA_GEN9_INDEPENDENT_DATA_LINE_SOURCE.md documents Alpaca SIP/adjustment=all as independent comparison, not PIT proof.
- SOURCE_gen9-data.json and frozen Gen9–16 DATA manifests are present; byte integrity is not a timestamped vintage archive.
## Finding
A partial historical SSE event stream and a later collection timestamp already exist. Do not redo SSE engine/replay tests or assume no archive. Existing files do NOT demonstrate a continuous, independently time-stamped vendor vintage history for all 16 symbols and bars in 2020–2024. The precise gap is proof of first availability and full chronological coverage, not missing event fields alone.
## Next bounded read-only check
Inspect already stored 2020-08-31 and 2026-09-15 diagnostic JSONs and Gen17 SSE replay gate documents for explicit earliest event timestamps, event continuity, first-observed chronology and provider replay limitations. Distinguish stream event 'at' from locally observedAt. Do not call provider again. If no complete archival proof, prepare forward-only immutable capture specification; it cannot certify prior years.
## Guardrails
Only ccc-demo-public-test; Gen8–16 frozen; Gen17 DRAFT_ONLY/PIT_UNVERIFIED; trade/Forward OFF. No Worker changes.

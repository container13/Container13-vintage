# Flyg isolated runtime candidate0.1.11

Status: implementation candidate, NOT DEPLOYED. Existing PWA0.1.10 unchanged.

Single owner: worker.mjs / SearchGate, only flyg-search-api Worker. No changes to CCC, Lina, Remember, DNS or their Workers. Persistent SQLite Durable Object binding holds provider tokens,30-minute cache and schema1 usage ledger. Global180 provider requests/month and20/hour; failures count; exhausted allowance rejects. Each uncached request checks SerpApi plan_id=free, price0, remaining quota. Three user-triggered stages: outbound -> returns -> booking details. Fixed ARN,two adults,SEK. Origin restriction is browser policy, NOT authentication: this public candidate can have its bounded free quota exhausted by other clients. Before broad rollout consider owner authentication if usage protection beyond the hard global cap is needed.

No raw provider responses, keys, booking POST payloads or selection tokens sent to browser. Opaque selection ids expire after30min and are bound to context/stage. No booking endpoint or arbitrary proxy URL. Booking text is displayed as source evidence only: UNVERIFIED remains until every passenger/direction/weight has structured proof. Hotel transfer is not verified. Separate-ticket offers excluded from combined price output.

Cost gate: preflight.py uses existing Actions Cloudflare credentials in read-only mode. Any account subscription with nonzero/unknown price stops. Failure to read subscriptions also stops. Do not weaken this gate to deploy. Cloudflare SQLite Durable Objects have a recurring Free tier; no upgrade authorized.

Verified blocker2026-11-14: workflow run43561373708, job132345580328, read-only GET subscriptions could not verify with existing token. No Worker/namespace created, no provider queries, no public UI changes. Need verified Workers Free account/subscription access before deployment. Do not re-request SerpApi key.

Tests: node --test flyg/server/worker.test.mjs. Mocks are not live Worker verification.

Next: resolve zero-cost hosting verification; deploy this isolated Worker with FLYG_ENABLED=false, inject existing FLYG_SERPAPI_KEY from Actions server-side, verify health; only then enable, run bounded live test and wire PWA UI to actual returned endpoint. Preserve centralized SW/update/version architecture. No guessed endpoint or simulated flight results.

Rollback: deployed PWA still0.1.10; disable isolated runtime via FLYG_ENABLED=false before any rollback; keep usage ledger so redeploy cannot reset quota.

References:
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
- https://serpapi.com/google-flights-api
- https://serpapi.com/google-flights-booking-options

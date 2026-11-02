# Gen17 – existing durable storage inventory, 2026-11-02
Status: READ_ONLY_INVENTORY / DESIGN_ONLY / PIT_UNVERIFIED.

## Verified
- Supabase connected account lists two projects: container13-remember (active) and remember-test (inactive). Neither is a dedicated Linas Opti project. Do not modify or repurpose either project.
- GitHub tree on ccc-demo-public-test has existing runtime-reports and evidence JSON archives, plus worker/wrangler.jsonc and worker/wrangler.gen17-sse-staging.jsonc. No Lina-specific D1/R2/KV configuration was identified in the inspected tracked paths. This does not establish absence of Cloudflare resources outside the repository.
- Worker /runtime-report already provides SHA-256 verified GitHub blob receipts, but one GitHub commit per provider event is unsuitable for continuous ingestion and can trigger deploys.

## Decision
No new database or storage service is authorized or created. Keep Remember isolated. Before choosing a durable journal, inspect actual Cloudflare account bindings and resources in a read-only manner when access is available. Candidate options require a separate assessment of durability, append-only semantics, retention, costs, operational ownership, and least-privilege credentials. GitHub remains a suitable audit receipt/archive for bounded batches, not a streaming queue.

## Next gate
Verify existing Cloudflare Worker resource bindings (D1/R2/KV/Queues) without changing configuration. If none is available, propose the smallest isolated storage architecture and request approval before provisioning. No new Alpaca call, Worker edit, deployment, trading or research.

Guards: ccc-demo-public-test only; Gen8–16 frozen; Gen17 DRAFT_ONLY/PIT_UNVERIFIED; Trade/Forward OFF.

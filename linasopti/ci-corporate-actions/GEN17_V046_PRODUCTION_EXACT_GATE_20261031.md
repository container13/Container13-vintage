# V0.4.46 exact production gate — 2026-10-31

NO-GO: no deployment or production branch write.

Verified production HEAD: 8b9eda07b3f46f4cc5171de05313f977457d6c77.
Production version V0.4.45, Worker source `WORKER_PENDING_RUNTIME_REPORT.js` (Git blob c9e6f8fdd0d94089c79ae63f3d0aed4e55adb4f9), Wrangler blob f8c36aba7d549b585f6c183592b5739fb1834276.
Isolated V0.4.46 tested CI 41154981913 PASS. Candidate prebundled Worker blob 2fdebfb1b5279e895c0da0ffb5a04c7225d4109e. Candidate Wrangler blob 30b42ee4a0e39a0cc1805fd6edf6c637f586a70d.

Important blocker: production `linasopti/tools/release_integrity.py` currently requires literal `WORKER_PENDING_RUNTIME_REPORT.js` in Wrangler. It must be changed for a scoped V0.4.46 release to assert the **exact** new `./WORKER_V046_PREBUNDLED.js` entrypoint and the presence/identity of the committed tested file, never an arbitrary filename. The original Worker source must remain unchanged for rollback.

Exact release gate before any production authorization:
1. Re-read production HEAD and all relevant blobs; abort if any drift.
2. Scope the candidate to tested Worker, Wrangler main pointer, release metadata and non-weakened integrity checks. No bulk branch merge.
3. Verify SHA-256 of the candidate Worker matches the tested artifact, and run Miniflare plus Wrangler dry-run on the exact scoped candidate.
4. Verify `LINA_CURRENT_STATE.json` live-release transition only after actual deployed runtime verification; preserve truthful pre-deploy state and explicit release gate semantics.
5. Confirm rollback to the original Worker and Wrangler config and Cloudflare deployment version. Cloudflare Build command remains None.
6. Explicitly authorize a coordinated production cutover before any push or dashboard change. Real Alpaca provider test only after successful deployment, never during preparation.

Gen17 DRAFT_ONLY/BLOCKED_DATA. Gen8–16 frozen. Trading and Forward OFF.

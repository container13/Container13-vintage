# Remember Test recovery checkpoint

Date: 2026-10-17

Production Supabase: wykvztfmfbboxiqvuvwr. Do not modify.
Test Supabase: kauxrvshxgpbvptdwhog. Both projects were ACTIVE_HEALTHY when checked.

Test project has 16 active Edge Functions as directly listed. Older documentation stating 8 refers to the initial deployment and is historical.

The active test function remember-test-stale-upload-audit is version 12. Its code includes read-only audit, integritySample, recover and simulateExistingFile. The code uses a claim token, SHA-256 verification, finalize/release RPCs, and cleanup for simulated test data.

Earlier conversation reported HTTP 200 audit, SHA-256 match on a 235852-byte file, and four completed images. These are handed-over reports, not independently rerun here.

IMPORTANT: Whether the final simulated recovery finished before chat interruption is UNKNOWN. Do not mark it PASS or rerun automatically. Check logs, database state and Storage first. Automatic deletion and scheduling must remain disabled until verified and explicitly approved. Production must remain untouched.

NEXT: Read the published test function and database RPC definitions. Verify test records and storage counts read-only. Investigate the interrupted simulation result. Record actual evidence and outcome. Check concurrency before enabling recovery.

HANDOFF RULE: After every completed step update this checkpoint with exact result, version, verification, outstanding risks and one next action. Read the committed file back from GitHub. A new chat must read this checkpoint before changing anything. Do not rely on a last-minute chat warning; no guaranteed interruption warning exists.

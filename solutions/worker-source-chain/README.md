# Worker Source Chain

Status: VERIFIED
Tags: cloudflare worker wrangler pending current previous deploy source promote
Proven in: Lina

## Problem
Editing a plausible Worker file may have no effect when deployment configuration actually builds another source file.

## Verified solution
Trace the real chain before patching: deployment config -> configured source -> promotion workflow -> deployed Worker -> runtime status. In Lina, wrangler configuration identified WORKER_PENDING_RUNTIME_REPORT.js as the deployed source while a change to WORKER_CURRENT.js alone did not affect the intended deployment.

## Reuse checklist
Read deployment config first. Identify source-of-truth and promotion mechanism. Verify runtime after deployment.

## Traps / failed approaches
Never choose a Worker file by filename intuition alone.

# GitHub Exact Readback

Status: VERIFIED
Tags: github write readback sha commit verify
Proven in: CCC and Lina

## Problem
A write call or commit response proves an operation was accepted, not that the expected content is now the repository truth.

## Verified solution
After writes, fetch the exact file from the exact repository + branch and verify expected version/content/schema. Record blob SHA/commit where useful. For structured state, parse it during readback.

## Reuse checklist
Never infer branch/default branch. Verify exact paths. For sequential edits use the newest blob SHA. Keep runtime verification separate from repository readback.

## Traps / failed approaches
GitHub readback PASS does not equal deploy/runtime PASS.

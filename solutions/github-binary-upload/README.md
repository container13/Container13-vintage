# GitHub binary upload — VERIFIED

## Proven in
Container13-vintage, branch `ccc-demo-public-test`, under `test/bildoverforing/`. User opened and visually confirmed the newly generated JPEG on 2026-10-12.

## Problem
A text-oriented GitHub file interface does not safely upload JPEG/PNG/MP3 as UTF-8 text. Renaming HTML to JPG does not change the underlying bytes.

## Canonical workflow
1. Generate or receive the real binary file; keep its original bytes.
2. Encode the bytes as Base64 and call GitHub `create_blob` with `encoding: "base64"`. Save the returned blob SHA.
3. Read current branch HEAD and its tree; do not assume a stale base.
4. Use `create_tree` with the current base tree, adding `{path,mode:"100644",type:"blob",sha}` at the target path.
5. Use `create_commit` with that tree and the current HEAD as parent.
6. Advance the intended branch via `update_ref`, with `expected_sha` and without force.
7. Read back the branch tree and verify path, blob SHA and size. Ask for visual/client confirmation where relevant.

## Verified evidence
- First binary PNG `test/testbild.png` stored and tree-readback verified.
- Existing JPEG reused under `test/testbild-stor.jpg`, opened by user.
- Newly generated 16x16 blue JPEG (286 bytes) uploaded to `test/bildoverforing/ny-bild.jpg`; blob SHA `ff43c460bb40d8669c22c66383dc8330491b1bf8`; user confirmed it opens correctly.

## Guardrails
- Use `test/<test-name>/` for experiments; keep a short README with purpose, evidence, outcome and lessons.
- Never overwrite a production path during a transfer experiment.
- Never treat `create_blob` alone as a saved repository file: a commit and ref update are required.
- If ref update conflicts, inspect HEAD and rebuild the tree/commit; never force to hide concurrency.
- Binary reads through a text-only GitHub fetch may fail; use metadata/tree readback and actual client verification.
- Keep existing GitHub release rules and do not infer deployment from a commit.
- For large files, verify API limits and transfer support before attempting; this small-JPEG test does not establish arbitrary size support.

## Reuse
Use this for future images and other binary assets after verifying size and target-project constraints. Do not create a parallel upload engine unless necessary.

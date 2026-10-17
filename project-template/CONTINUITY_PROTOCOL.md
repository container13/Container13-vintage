# Mandatory project continuity protocol

Applies to every Container13 development project and every new chat.

1. Maintain one clearly named current checkpoint in each project. Older documents are historical and must not override it.
2. Before changing code or infrastructure, read the checkpoint, verify the current branch and actual external service state, and distinguish planned, deployed and verified.
3. After every meaningful test or deployment, update checkpoint with date, project/environment ID, exact version or commit, method, evidence, PASS/FAIL/UNVERIFIED, risks, and one next action.
4. Verify the GitHub write by reading back the exact committed file. If the write fails, tell the user immediately; do not claim documentation is complete.
5. Never treat a running or interrupted test as passed. Recover logs and state before deciding whether a rerun is safe.
6. Protect production by default. Test and production identities must be explicit; never promote changes automatically.
7. Before a chat handoff, ensure the checkpoint is current and give the user its exact link and a short resume instruction.
8. Do not rely on a warning before the chat ends: context capacity and interruption cannot be predicted reliably. Write checkpoints continuously.
9. When a historical file conflicts with live evidence, preserve history but record the current evidence and correct the active checkpoint.
10. For any new project, inventory dependencies, connectors and permissions early and record tested access and fallback routes before development.

If a project lacks a checkpoint, create one before substantive new work. Status claims must be evidence-based.

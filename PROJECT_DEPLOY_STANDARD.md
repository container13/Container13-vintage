# Shared deployment and rollback standard

Applies to future projects with automated deployments. Adapt file names and deployment commands to each runtime.

## Release states
- PENDING: candidate source awaiting validation.
- CURRENT: last version verified in the real runtime.
- PREVIOUS: verified version immediately preceding CURRENT.
- A failed candidate never replaces CURRENT or PREVIOUS.

## Pipeline
1. Inspect the actual source, entrypoint, workflow and target service.
2. Check syntax and configuration; verify the deployment points to the intended project.
3. Commit candidate to the project's working branch.
4. Automatically deploy candidate using project-scoped credentials.
5. Confirm GitHub Actions success AND inspect deployment logs and live endpoint.
6. Complete relevant real-device or functional verification.
7. Only after PASS, promote PENDING to CURRENT and rotate former CURRENT to PREVIOUS.
8. Keep rollback possible and document the exact tested commit.

## Safety
- A successful GitHub commit or Actions run alone is not a verified application release.
- Never overwrite an existing verified rollback copy on an unverified deploy.
- Do not share secrets across projects; keep API tokens in GitHub Actions secrets.
- Preserve production secrets and bindings during deployments.
- Read back changed GitHub files; stop and inspect logs on failure rather than guessing.
- Avoid unrelated code changes and do not claim runtime PASS without evidence.

## Confirmed CCC Vision deployment lesson (2026-10-08)
- GitHub Actions workflow: .github/workflows/ccc-vision-worker-deploy.yml
- Cloudflare target: ccc-vision-api
- A bare Wrangler deploy failed with "Missing entry-point".
- Explicit command in working directory ccc-core/vision succeeded:
  deploy cloudflare-worker.js --name ccc-vision-api --compatibility-date 2026-10-08
- Successful GitHub Actions run #4, commit a832dd9.
- This confirms deploy automation; AI behavior must still be verified separately on iPhone.

## Adoption
- This file is the reusable standard, not proof that all existing projects already implement it.
- Apply changes project by project, preserving each project's verified baseline and release rules.

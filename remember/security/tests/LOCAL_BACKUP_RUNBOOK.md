# Remember: local recovery export (operator runbook)

Status: NOT EXECUTED. No database backup or restoration test has been completed.

Project: `wykvztfmfbboxiqvuvwr`. Micke50 is a DIFFERENT Supabase project: never link or export it during this procedure.

## Prerequisites
Install Supabase CLI, Docker (for local Supabase), and PostgreSQL client tools as appropriate. Sign in interactively. Never paste a database password, service role key, or access token into GitHub or chat.

## Preserve deployed Edge Function sources
With the Supabase CLI installed, link the correct project and download each function:

```sh
supabase login
supabase link --project-ref wykvztfmfbboxiqvuvwr
mkdir -p recovery/edge-functions
for fn in remember-webmaster remember-guest-link-webmaster remember-guest-metadata remember-photo-upload remember-photo-gallery remember-share-manager remember-owner-manager remember-onboarding; do
  supabase functions download "$fn" --project-ref wykvztfmfbboxiqvuvwr
done
```

Check the actual CLI output paths and copy the downloaded `supabase/functions/` tree into a secure local recovery folder. Compare each downloaded function with the live version/hash inventory; do not assume the download alone is verified. Never commit secrets or private data.

## Database backup
Use a locally installed, compatible Supabase CLI and a database password supplied only in its secure interactive flow. Verify the supported syntax with `supabase db dump --help` before running. Export both schema and data into private files, not GitHub. Ensure `remember` schema and functions are included. Record backup timestamp, source project ref, row counts and checksums. Backup auth data if account recovery is required.

## Recovery test
Restore into an isolated temporary local PostgreSQL/Supabase environment, never over the active project. Verify table structures, counts, permissions, functions, album ownership and guest-link behavior. Storage test images are disposable, but do not claim image restoration was tested. Store only PASS/FAIL and non-sensitive checksums in the repo.

## Deployment gate
Do not apply the atomic rotation migration or redeploy any Edge Function until a database restore and function source recovery are verified. Existing running app remains untouched.

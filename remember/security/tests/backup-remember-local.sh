#!/usr/bin/env bash
set -euo pipefail
# Run locally after installing Supabase CLI and Docker.
# This script NEVER restores or modifies the remote database.
PROJECT_REF="wykvztfmfbboxiqvuvwr"
command -v supabase >/dev/null || { echo "Supabase CLI missing"; exit 1; }
command -v docker >/dev/null || { echo "Docker missing"; exit 1; }
docker info >/dev/null 2>&1 || { echo "Docker is not running"; exit 1; }
umask 077
OUT="${HOME}/remember-private-backups/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$OUT"
chmod 700 "$OUT"
echo "Target project: $PROJECT_REF"
echo "Backup folder: $OUT"
echo "IMPORTANT: verify Supabase CLI is linked to project $PROJECT_REF."
read -r -p "Type the project ref to confirm: " CONFIRM
[[ "$CONFIRM" == "$PROJECT_REF" ]] || { echo "Cancelled"; exit 1; }
supabase link --project-ref "$PROJECT_REF"
supabase db dump -f "$OUT/roles.sql" --role-only
supabase db dump -f "$OUT/schema.sql"
supabase db dump -f "$OUT/data.sql" --use-copy --data-only
(cd "$OUT" && shasum -a 256 roles.sql schema.sql data.sql > SHA256SUMS.txt)
echo "Backup files created locally. Keep them PRIVATE."
echo "RESTORE IS NOT VERIFIED. Do not deploy database migrations yet."
echo "Backup directory: $OUT"

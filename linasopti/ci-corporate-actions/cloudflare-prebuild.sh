#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
npm install --no-save --no-package-lock --ignore-scripts esbuild
node build-v4-release-candidate.mjs
node verify-wrangler-staging.mjs
printf 'PASS prebuild: V4 generated and Wrangler target verified; no deployment\n'

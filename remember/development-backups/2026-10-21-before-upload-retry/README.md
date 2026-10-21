# Before upload retry, 2026-10-21

Ordinary Remember DEVELOPMENT project wykvztfmfbboxiqvuvwr. App baseline 0.1.157 at eb5edd6149c8c73829e15da74c8e6efa5b6606a7. Actual upload Edge v3 (verify_jwt=false), six RPC definitions/ACLs and data counts/digests captured read-only before changes. New remember_photo_upload_request was absent. No credentials, raw guest links or user row copies included. Not a full database/Storage backup or restore test.

Rollback: selectively restore Remember frontend upload pages and metadata from app baseline and deploy this exact Edge source preserving verify_jwt=false. New additive service-only RPC may remain unused; do not drop it while clients/Edge still depend on it. Existing six RPCs/tables are not changed by this fix. Never revert shared branch/other projects. Recheck counts, sources, CI, publishing and an upload afterward. Permanent 0.1.137 safety branch remains protected.

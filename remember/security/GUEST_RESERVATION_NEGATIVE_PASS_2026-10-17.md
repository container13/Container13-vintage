# Remember Test — reservation negative tests PASS (2026-10-17)

Only isolated project `kauxrvshxgpbvptdwhog`.

Executed SQL against actual `public.remember_guest_photo_reserve(bytea,uuid)`, each within `BEGIN ... ROLLBACK`:
- Unknown 32-byte token digest: `accepted=false`, photo rows remain 8.
- Temporarily revoked actual guest link: `accepted=false`, photo rows remain 8.

After rollback: guest link `revoked_at IS NULL`; all 8 photo records `ready`; zero global security feature flags.

These tests are **database RPC tests, not HTTP Edge Function tests**. Full negative HTTP validation requires a real HTTP caller with a well-formed multipart image payload and must confirm no new reservation afterward. No original Remember changes.

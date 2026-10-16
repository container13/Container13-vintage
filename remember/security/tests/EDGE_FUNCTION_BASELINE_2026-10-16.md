# Edge Function rollback inventory — 2026-10-16

Source: live Supabase project `wykvztfmfbboxiqvuvwr`, read-only function listing. This inventory records deployment identities, not source-code backups or a restorable database dump.

| Function | Version | Deployment SHA-256 |
| --- | ---: | --- |
| remember-webmaster | 2 | 12a6fb46988aa663a6bd6e2518cf0a3d9e2fd388f43698e797f66fe4cbdd488e |
| remember-guest-link-webmaster | 1 | 12f93b1204872f33faeb1fd89001ed89abb51f9391ec7639414abba84aa7ca95 |
| remember-guest-metadata | 1 | eef248e880ad12dd56c692e7284da3a19e87e9b6a30378de71acb770d8f9ba20 |
| remember-photo-upload | 2 | 1e078df0ec969f1d0d325787990fdbd5b32c7685a1bb45a8a0489ecae7a1c79f |
| remember-photo-gallery | 3 | 30da11818f9b8306db01823032c026bcf9bea8244d0d683c111c7710b99547a7 |
| remember-share-manager | 2 | 253db343a901bcad26dab789a9f067e8f5223cd324307206c9020b00f5e46038 |
| remember-owner-manager | 3 | f220034a6b76a526ceadd1a1fee8901381e6dcfee186de7b9279d8845e349657 |
| remember-onboarding | 1 | 1722cb351df539ee4d48f3a7fafad1befc36b8c9330635dd590c1dcf3ec5b150 |

## Status
- Read-only inventory: PASS.
- Restorable source backup: NOT YET VERIFIED.
- Database restore: NOT YET VERIFIED.
- No runtime or schema modifications made.
- Micke50 is hosted in a separate Supabase project and is out of scope.

## Gate
Before modifying guest-link rotation, obtain an off-project recoverable copy of current database data and function sources, and prove restoration. Never commit real guest tokens, email addresses, or vault ciphertext to GitHub.

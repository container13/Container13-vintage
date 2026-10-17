# Remember Test — effective feature TEST / ON regression (2026-10-17)

Project: `kauxrvshxgpbvptdwhog` only. Original Remember untouched.

## Transactional SQL checks (ROLLBACK)
1. Insert temporary `guest_reports` feature with mode `TEST`.
2. Insert exact eligibility for test album `486b726f-01ae-4065-94f1-803c79159402`.
3. Read `public.remember_security_effective_feature_read`:
   - eligible album → `true` **PASS**
   - other album → `false` **PASS**
4. In a separate rolled-back transaction, set mode `ON` and read eligible album → `false` **PASS**.

## After rollback
- Feature flag rows: **0**
- Eligibility rows: **0**
- Ready photo records: **7**
- Stored photo objects: **7**

## Important limits
These checks validate the **decision reader**, not the guest HTTP runtime. The server's guest upload/gallery functions have not yet been wired to this reader. No mode is enabled and no change is made to original Remember.

# Remember backend implementation gate

The migration `sql/001_schema_DRAFT.sql` is a **draft only**, not executed or deployed. It creates isolated `remember` schema, owner-linked albums, webmaster membership, immutable audit entries, photo reservation metadata and default-deny RLS. No public client is authorized to modify data.

## Safe sequence
1. Confirm which Supabase test project can be used **without touching Micke50 production**. Do not assume the existing production project is a safe test environment.
2. Review migration and SQL role/grant behavior in a disposable database, including rollback and repeat execution.
3. Deploy a new dedicated Remember API function with verified Supabase JWT auth, server-side webmaster role lookup, rate limits and schema-qualified operations. Never trust an admin flag or user ID sent by the browser.
4. Only after security review, connect the webmaster UI with authenticated fetches. Keep demo mode clearly separate until backend is verified.
5. For schedule updates: compare album revision, validate UTC times and owner override, update row + append audit in one database transaction. On close, block both upload reservations and finalization.
6. Verify that an anonymous visitor cannot list albums, view owner emails, alter schedules or access another album's images.
7. Test on real devices and record deploy/runtime evidence before promoting release.

## Not implemented
No server auth, migrations, storage, live album listing, upload quota enforcement, or payments have been activated. The webmaster demo is illustrative and not an administrative endpoint.

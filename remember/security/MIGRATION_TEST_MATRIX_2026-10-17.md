# Remember Test – migration verification matrix (review only)

Target Supabase: kauxrvshxgpbvptdwhog. Original: never modify.
Status: **NOT EXECUTED**. No migration or runtime endpoint deployed.

## Pre-install checks
- Verify target project ID and backup.
- Confirm security tables and RPC do not exist.
- Confirm baseline RLS, owner_user_id and authenticated owner flow.
- Confirm SQL schema and RPC use correct owner and no public EXECUTE.
- Confirm rollback includes request ledger and function.

## Security blocker
The proposed RPC accepts p_actor supplied by the Edge Function. It MUST NOT be callable by clients and must only be used behind an endpoint that verifies a bearer token with Supabase Auth. Database service_role execution alone does not authenticate p_actor. Do not expose service-role key to browser.

## Negative tests after approved isolated installation
| Case | Expected |
| --- | --- |
| Missing bearer | 401 |
| Expired or malformed bearer | 401 |
| Owner of another album | 403, no writes |
| Unknown setting | 400, no writes |
| Missing request ID | 400, no writes |
| Same request ID, same payload | Same result, one audit row |
| Same request ID, different payload | Conflict, no writes |
| Forced audit error | Setting change rolled back |
| Anonymous or authenticated direct RPC | Permission denied |
| New album with no settings row | All settings false |
| Existing guest flow while feature flags OFF | Unchanged |
| Invalid global ON request | Denied until enforcement deployed |

## Post-install invariants
- Baseline album and photo counts unchanged.
- Existing guest links and photo storage untouched.
- New security tables have RLS enabled and no anon/authenticated table grants.
- Rollback must refuse to destroy nonempty audit/ledger/settings tables.

## Release gate
Do not mark PASS until HTTP tests and database assertions have been executed and results captured. No TEST/ON flag activation before upload and gallery enforcement exists.

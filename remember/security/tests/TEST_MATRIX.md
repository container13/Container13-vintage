# Security test matrix — Remember

| Case | Expected result | Status |
|---|---|---|
| No actor and no guest token requests gallery | authorized:false | PASS (DB negative check) |
| Null token and request ID reserve photo | accepted:false / invalid | PASS (DB negative check) |
| Anonymous role reads remember.albums | No direct access | PASS (grants/schema check, not HTTP) |
| Anonymous role reads private photo storage | Denied by RLS | STRUCTURAL PASS, HTTP pending |
| Owner A lists/renames/deletes Owner B album | Denied | CODE REVIEW, two-user test pending |
| Guest token rotated/revoked | Old token denied | CODE REVIEW, integration pending |
| Closed album upload | Denied | CODE REVIEW, integration pending |
| Full album concurrent upload | No over-quota | CODE REVIEW, load test pending |
| Vault write fails during token rotation | Both writes rollback | FAIL BY DESIGN in current implementation; replacement required |
| Pending photo visible in slideshow/gallery | Never visible | NOT IMPLEMENTED, future module |
| Owner changes security settings mid-event | New requests obey updated server setting | NOT IMPLEMENTED, future module |
| Expired signed URL | Cannot access image | NOT TESTED |

Do not execute tests that mutate production albums, guest links, or users. All production checks must remain read-only.

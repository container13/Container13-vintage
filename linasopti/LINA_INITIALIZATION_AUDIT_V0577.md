# LINA INITIALIZATION AUDIT – V0.57.7

## Scope
Inspected all V0.57.x initialization guards and startup behavior.

## Exact-version guards found
- V0.57.0 current app/dashboard init
- V0.57.1 flow audit init
- V0.57.2 workspace init
- V0.57.4 orientation init
- V0.57.5 context/next-step init
- V0.57.6 visible-view init

These were historical point-in-time initializers, but several permanent features depended on them.

## Legacy startup still active
The original application startup always called:
`show('data', false)`

Because the V0.57.0 dashboard initializer no longer ran after the version number changed, a fresh later release could end up showing Data by default.

## Correction
V0.57.7 adds `v0577InitCurrentArchitecture()` as the single authoritative boot for the current release.

It runs after legacy DOMContentLoaded handlers and forces the stable intended starting state: Dashboard.

## Related audit conclusion
The recent G2/Data confusion was not only a breadcrumb problem. It was an initialization-lifecycle problem. Fixing only CSS/body classes could never make it reliable across releases.

No trading/research engine changes.

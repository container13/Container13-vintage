# LINA BOOT/GUARD AUDIT – V0.58.4

## Previous finding
V0.58.3 contained 17 exact-version guards across historical/current UI initializers.

Critical permanent systems affected:
- unified boot
- workspace isolation
- orientation/context
- visible-view normalization
- G2 routing/panel wiring

## V0.58.4 correction
One current-family boot explicitly starts every permanent V0.58.x feature and renders Dashboard last.

Historical exact guards may remain in old functions for compatibility/history, but no permanent feature relies on them as the only activation path.

## Acceptance criterion
A future V0.58.x patch bump must not cause the first screen to regress to generic Data or disable workspace isolation/G2 controls solely because APP_VERSION changed.

No research engine changes.

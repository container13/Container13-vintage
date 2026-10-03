# Lina Clean Core V0.2.55

## Local Recovery + visible startup
- Visible startup screen replaces blank wait during GitHub-first bootstrap.
- Local Recovery Scan inventories compact Lina localStorage before canonical restore.
- GitHub is canonical on every conflict; old local state can never overwrite an existing GitHub key during startup.
- Local-only keys are preserved and uploaded, then reported for audit.
- Recovery report is session-only and does not alter frozen research decisions.
- Dashboard shows GitHub / State / Evidence / Handel status and Local Recovery result.
- Raw market data / IndexedDB remain local and are not uploaded by this feature.
- Gen2 candidate/holdout pipeline from V0.2.54 remains unchanged.
- Cloudflare Worker unchanged.

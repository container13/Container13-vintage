# LINA HANDOFF – CLEAN CORE V0.2.36
Datum: 2026-09-15

V0.2.36 är en avgränsad frontend-hotfix byggd från V0.2.35 COMPLETE.

Fix: Historik → Lina Arkiv kunde krascha vid rendering eftersom `archive-data.js` hade en sparse array-post (`undefined`) före G5. Den är borttagen och runtime-datastrukturen validerad.

Ingen forskningslogik ändrad. Handel AV. Robotmognad 48/100. Evidence-syncens Worker är fortsatt V0.2.35 och kräver ingen ändring.

Permanent release-regel: syntax-PASS räcker inte för datadrivna vyer; release-test ska även iterera/render-validera datamodellen så att sparse/null/undefined-poster fångas.

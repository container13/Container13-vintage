# LINA HANDOFF CLEAN CORE V0.2.21

UI-only structural watermark fix. V0.2.20 copied legacy CSS but Clean Core #app stacking context prevented the watermark from reliably painting above cards. In V0.2.21 the same lina-circle.png watermark is placed as the final child inside #app, with legacy V0.58.8 mask, multiply blend and final opacity. Header remains above it. G2/G3/G4/G5/forward logic and stored evidence are unchanged. Handel AV. Robotmognad 48/100.

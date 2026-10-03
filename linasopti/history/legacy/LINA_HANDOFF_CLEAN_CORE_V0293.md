# Lina Clean Core V0.2.93 — handoff

V0.2.93 är en samlad Generation Engine/Gen8-release, byggd från faktisk V0.2.92 FLAT COMPLETE.

Användaren har uttryckligen godkänt Gen8-planförslag `be68328d`. Generation Engine kan därför med ett enda Auto Pipeline-initiativ låsa planen, skapa/hash-låsa Gen8-runnerspec, verifiera Engine, köra full data-preflight, köra fyra Gen8-familjer med stabilitetsmedveten TRAIN-selektion, spara evidens före continuation, frysa summary, göra deterministiskt kandidatbeslut, skapa Gen9-underlag och verifiera GitHub-evidens.

Gen8 preregistrerade stabilitetsregler: OOS worst-fold PF >= 0.80, max 55 % av positiv fold-bruttovinst från en fold, weak-regime exposure <= 0.65. TRAIN-selektion använder kalenderårsdelregimer, föredrar min subregim-PF >= 0.70 och straffar PF-spread > 2.50. Ordinarie gates är oförändrade.

Gen7 är immutable och körs aldrig om. Gen9 startas inte automatiskt. Forward och Handel AV. Robotmognadsmodell `6e8908ca` oförändrad.

MASTER RULES och releasechecklistan är lästa/uppdaterade. Ny permanent paketregel: tidigare Lina-paket ska sökas fram innan användaren ombeds ladda upp igen; säkra utvecklingssteg ska samlas i kompletta releaser fram till nästa verkliga beslut.

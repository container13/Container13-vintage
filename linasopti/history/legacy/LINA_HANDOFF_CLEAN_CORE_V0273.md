# Lina Clean Core V0.2.73 handoff

V0.2.73 är Gen5:s formella planbeslut i Generation Engine. Den kompletta planen har hash `d501a5e1` och bygger på fryst Gen4-underlag. Den behåller gates och Handel AV, hard-stop 2024-12-31, kräver faktisk train→OOS per fold, verklig kombinerad portföljsimulering, inga oanvända parametrar, exakt rankingformel i hashad runnerspec och komplett variant/fold-evidens före continuation.

Knappen `Godkänn + lås Gen5-plan` fryser exakt denna plan och försöker GitHub-säkra planevidens. Den startar INTE research eller Forward. Nästa release ska bygga runnerspec + engine och verifiera dem mot planhashen innan research kan öppnas. Gen4 är immutable och får aldrig köras om.

# LINA HANDOFF · CLEAN CORE V0.2.69

## Syfte
Smal idempotensfix för immutable evidence efter V0.2.68-diagnostik.

## Verifierad grundorsak
V0.2.68 fick HTTP 409 med exakt API-fel `Evidencefilen finns redan – original skrivs inte över` för Gen4 Equal-risk pullback. Worker skyddar därmed befintlig evidence korrekt, men klienten klassade svaret som synkfel och stoppade kön.

## Ändring
- Endast exakt HTTP 409 + exakt immutable-exists-meddelande accepteras som serverbekräftad befintlig evidence.
- Ingen overwrite görs. Alla andra 409/fel fortsätter att stoppa synken.
- Pending item markeras `FROZEN · GITHUB ✓`, deterministisk GitHub-path sparas, lokalt SHA256 behålls och content tas bort ur kön efter serverbekräftad existens.
- Diagnostik markerar `SERVER_CONFIRMED_IMMUTABLE_EXISTS_409` och säger uttryckligen att nuvarande API verifierar existens men inte innehållslikhet.
- Gen4 family/summary evidence-metadata reconcileras från evidence-kön så UI inte ligger kvar på VÄNTAR PÅ SYNK efter lyckad idempotent synk.

## Forskningsdisciplin
Ingen Gen4-research, omräkning, rerun/rescue, ranking-, gate-, plan- eller runnerspecändring. Ingen kandidat vald. Forward stängd. Handel AV.

## Cloudflare Worker
INGEN ÄNDRING. Befintligt immutable-skydd används som det är.

## Verifiering
MASTER RULES, V0.2.68 handoff och berörd baskod lästa. JS syntaxkontrolleras. CHANGED FILES ONLY + FLAT COMPLETE skapas och innehåll verifieras.

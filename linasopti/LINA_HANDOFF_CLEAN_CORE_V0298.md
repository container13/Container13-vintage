# Lina Clean Core V0.2.98

Samlad stabiliserings- och lärdomsrelease efter incidentkedjan V0.2.93–V0.2.97.

## Ändringar
- Permanent incidentdokumentation och nya NON-NEGOTIABLE-regler i MASTER RULES.
- Releasechecklistan stoppar framtida state/recovery-releaser utan verkliga payload- och recovery-scenariotester.
- GitHub-sync får inte längre tyst hoppa över obligatoriskt state på grund av storleksgräns. Obligatorisk för stor post ger explicit fel. Den verifierade V0.2.92 Generation Engine-snapshoten är cirka 165 kB; Synkfel i V0.2.97 är därför inte tillskrivet storlek utan lämnas öppet för exakt diagnostik.
- Robotmognad använder låst modell `6e8908ca` plus monotont verifierat bevis från auktoritativ V0.2.92-export. Modellen/poängvikterna är oförändrade.
- Gen8-UI beskriver nu samma state överallt: planen är GODKÄND och nästa steg är Auto Pipeline; Gen7 märks FRYST.
- Gen7 research är immutable; ingen rerun. Gen8 research har inte startats. Forward och Handel AV.

## Incidentreferens
`LINA_INCIDENT_V0293_V0297.md` dokumenterar orsak, misslyckade försök, verifierad rotorsak och permanenta skydd.

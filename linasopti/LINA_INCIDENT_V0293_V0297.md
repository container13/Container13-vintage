# Lina incident V0.2.93–V0.2.97 — Generation Engine state/recovery

## Händelse
V0.2.93 introducerade en komplett Gen8 Auto Pipeline men Generation Engine kunde först inte öppnas (`Maximum call stack size exceeded`). Efter rekursionsfixen öppnades sidan, men ett gammalt/färskt Gen7 `PLAN_PROPOSAL` visades som aktuell generation och Robotmognad föll från verifierade 70/100.

## Misstag och lärdomar
1. V0.2.93: rekursion mellan state/integritetsvägar gav call-stack-fel. Lärdom: state-readers får inte indirekt återanropa state via integritetsfunktioner.
2. V0.2.94: sidan öppnades men fel state exponerades. Lärdom: "sidan öppnas" är inte ett end-to-end-test.
3. V0.2.95: recovery riktades mot antaget trasigt state men inte den faktiska producerande kedjan. Lärdom: spåra state-källa före fix.
4. V0.2.96: preboot recovery flyttades tidigare men träffade fortfarande inte saknad state. Lärdom: testa både saknad och trasig state.
5. V0.2.97: verifierad rotorsak var att Generation Engine använder `lina_generation_engine_v0273`, medan tidigare GitHub-filter byggde på `lina_clean_*`. Nyckeln lades till och monotonic merge infördes. Efter detta återkom Gen8 som `PLAN_APPROVED_AWAITING_LOCK`.
6. Ny kontroll i V0.2.98: `collect()` hade dessutom en generell tyst skip för poster över `MAX_ENTRY=400000`. Den auktoritativa V0.2.92-exportens Generation Engine-snapshot är cirka 165 kB och bevisar alltså **inte** att storleksgränsen orsakade Synkfel i V0.2.97. Men beteendet är en farlig felklass: en obligatorisk post får aldrig tyst försvinna. V0.2.98 gör därför för stor obligatorisk post till explicit fel och höjer marginalerna. Själva Synkfel-orsaken betraktas fortfarande som ej verifierad tills diagnostiken visar exakt HTTP/API-fel.
7. UI visade samtidigt Gen8 GODKÄND och texten "granska Gen8-planen". Lärdom: UI-status och nästa beslut ska härledas från samma state.
8. Robotmognad föll 70 → 10 → 55 trots låst modell. Lärdom: intjänade verifierade kriterier är monotona och måste ha ett bevarat bevislager. V0.2.98 använder det verifierade V0.2.92-mognadsbeviset utan att ändra modellhash eller poängregler.

## Permanenta skydd
Se `LINA_MASTER_RULES.md` avsnitt "Incidentlärdom V0.2.93–V0.2.97" och `LINA_RELEASE_CHECKLIST.md` avsnitt "Permanent incident-gate från V0.2.98".

## Forskningsintegritet
Ingen Gen7-research får köras om. Gen7 förblir fryst. Gen8 är mänskligt godkänd men research har inte startats. Forward och Handel förblir AV tills separata framtida beslut.

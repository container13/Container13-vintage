# LINA HANDOFF V0.2.99

- Bas: V0.2.98 FLAT COMPLETE.
- Verifierad rotorsak för kvarvarande Synkfel: Worker `validateAppState()` nekade `lina_generation_engine_v0273` medan frontend från V0.2.97 korrekt krävde att den synkades.
- Worker allowlistar nu exakt Generation Engine-nyckeln och behåller strikt avvisning av andra otillåtna nycklar.
- Frontend/Worker size limits harmoniserade: entry 2M, package 5M.
- Gen8-state/forskning ändras inte. Gen8 är fortsatt godkänd och väntar på planlås/Auto Pipeline. Handel AV, Forward stängd.
- Efter deploy: både webbpaketet och uppdaterad Cloudflare Worker måste vara aktiva innan Gen8 Auto Pipeline startas.


## Incidenttillägg — verifierat 2026-09-26
### Symptom
- V0.2.99 visade `Automatisk GitHub-återställning stoppad: Otillåten App-state nyckel`.
- Dashboard kunde samtidigt visa delvis grön systemstatus medan Robotmognad var `—/100`, vilket visade att bootstrap/hydrering inte var komplett.

### Misslyckade försök
- Tidigare blockerfixar fokuserade på frontend/recovery utan att först verifiera hela frontend↔Worker-kontraktet.
- Det gjordes även påståenden om byggda/verifierade paket utan tillräcklig faktisk verktygskontroll; detta får inte upprepas.

### Verifierad rotorsak
- Den Worker-kod som faktiskt lämnades in för kontroll hade i `validateAppState()` endast regeln `k.startsWith("lina_clean_")`.
- Generation Engine använder permanent state-nyckel `lina_generation_engine_v0273`, som därför avvisades med exakt felet `Otillåten App-state nyckel`.
- Workern ändrades till en explicit exact allowlist för just `lina_generation_engine_v0273` utöver `lina_clean_*`; inga bredare främmande prefix öppnades.

### Verifierat slutläge efter deploy
- GitHub ✓ och systemstatus GitHub ✓ · State ✓ · Evidence ✓.
- Generation Engine återställd till GEN8 V0.2.99.
- Robotmognad åter 70/100 efter full Engine-state-hydrering.
- Gen8 planhash `be68328d`, status `PLAN_APPROVED_AWAITING_LOCK`; runnerspec EJ LÅST och Engine EJ VERIFIERAD.
- Handel AV. Gen8 research hade inte startat. Gen7 ska aldrig rerunnas.

### Permanent skydd
- Full state-roundtrip och faktisk deployad Worker måste verifieras före nästa generationsstart.
- Feltext → producerande kodrad → rotorsak → fix → POST+GET/restore → full UI/state-integritet är obligatorisk ordning.
- Dokumentation och releasepåståenden måste vara verktygsgrundade.

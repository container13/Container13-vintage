# LINA HANDOFF V0.2.99

- Bas: V0.2.98 FLAT COMPLETE.
- Verifierad rotorsak för kvarvarande Synkfel: Worker `validateAppState()` nekade `lina_generation_engine_v0273` medan frontend från V0.2.97 korrekt krävde att den synkades.
- Worker allowlistar nu exakt Generation Engine-nyckeln och behåller strikt avvisning av andra otillåtna nycklar.
- Frontend/Worker size limits harmoniserade: entry 2M, package 5M.
- Gen8-state/forskning ändras inte. Gen8 är fortsatt godkänd och väntar på planlås/Auto Pipeline. Handel AV, Forward stängd.
- Efter deploy: både webbpaketet och uppdaterad Cloudflare Worker måste vara aktiva innan Gen8 Auto Pipeline startas.

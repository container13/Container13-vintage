# Lina Clean Core Architecture V0.1

Princip: liten explicit kärna. `app.js` bootar en gång. `router.js` äger navigation. `state.js` äger Clean Core-state. `api.js` äger nätverk. `modules/` äger forskningslogik. UI får anropa moduler men forskningsregler får inte gömmas i DOM/eventkod.

V0.58.8 ligger kvar som referens. Ingen legacy-initializer, versionsguard, MutationObserver-router eller clone/rebind-navigation har kopierats in.

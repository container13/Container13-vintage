CCC Vision v2.3 – Design Sync

Syfte
-----
Synka Vision visuellt med CCC Dashboard utan att ändra kamera-, Vision- eller local-first-logik.

Ändrat
-------
- Vision använder samma CCC-header som dashboarden: centrerad CCC-logga/halo, temaknapp och profilknapp.
- Tema (ljust/mörkt) delas via localStorage-nyckeln ccc-theme.
- Gemensam UI-fil skapad: ccc-core/demo-ui/css/ccc-ui.css.
- Dashboard och Vision använder samma shared shell-klasser för header, logga, ikoner och profilmeny.
- Vision v2.3 visas nu inne i modulens innehåll i stället för som en separat header-identitet.
- Vision-kort, knappar, ytor, radier, skuggor och färger har justerats mot dashboardens formspråk.
- Reset/Börja om finns kvar men är flyttad från huvudheadern till Vision-vyn.

Oförändrat
---------
- Kameraflödet.
- Bildserie/local-first.
- Tyst Vision-analys i bakgrunden.
- Granskning och godkännande.
- Ingen Firebase-uppladdning av råbilder har lagts till.

Nästa
-----
Testa designen på mobil och desktop. Finputsa därefter kameraflödet innan Firebase-integrationen påbörjas.

CCC Vision v2.3.1 — Flow + design sync

- Dashboardens "Lägg till bilder" går nu direkt till CCC Vision.
- Dashboardens äldre interna kameravy ligger kvar i koden men är inte längre huvudflödet.
- Vision-headern använder exakt samma gemensamma CCC-header-skal som dashboarden.
- Vision följer dashboardens ljusa/mörka färgpalett, ytor, radier och skuggor.
- Gemensamt versionsnummer v2.3.1 visas via ccc-core/demo-ui/js/version.js.
- Versionen visas i CCC-headern på sidor som har header, annars som en diskret badge.
- Kameralogik, local-first och Vision-granskning är i övrigt oförändrade.

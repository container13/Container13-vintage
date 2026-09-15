# Lina Clean Core V0.2.33 – handoff

Byggd från godkänd V0.2.32 COMPLETE. Nytt: global GitHub-synk i headern. `☁ Synka` kör först den etablerade Forward-state-synken och därefter kompakt app-state för `lina_clean_*` localStorage. IndexedDB/rå marknadsdata synkas inte. Konflikter utan säker tidsordning stoppas. Worker får `/app-state` parallellt med `/forward-state`; vanlig Lina-login används. Inga forskningsregler, parametrar, frysta resultat eller mognad ändrade. Handel AV, robotmognad 48/100.

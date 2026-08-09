CCC modulstruktur v2.8.2 – 2026-08-09

Aktiva CCC-moduler ligger i egna mappar under /ccc-core:
- /auth
- /dashboard
- /vision
- /publish
- /profile
- /settings
- /store
- /statistics

/demo-ui är borttagen.
Den får inte användas som aktiv modulplats eller som kompatibilitetslager framåt.
Dashboard och Vision ska länka direkt till respektive riktiga modul.

Princip:
- en modul = en mapp
- modulens HTML/CSS/JS ligger lokalt i modulmappen under utveckling
- mobil först
- local-first för opublicerat arbetsmaterial

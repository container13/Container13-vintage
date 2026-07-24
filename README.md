# Container 13 Vintage

**Projektversion:** 4.0.0  
**Basversion:** 3.6.1, som bekräftats fungera felfritt.

## Webbplatsen

Projektet är en mobilanpassad webbplats för Container 13 Vintage med:

- startsida med de fyra senaste Nyinkommet-bilderna
- butiksgalleri med högst åtta bilder
- Nyinkommet med titel och relativt datum
- kontakt och ordinarie öppettider
- avvikande öppettider
- informationsrad
- gemensam header, statusrad och footer
- Firebase/Firestore-baserad adminpanel
- lightbox, skeleton loading och responsiv bildlayout

## Aktiv mappstruktur

```text
Container13-vintage-main/
├── index.html
├── galleri.html
├── nyinkommet.html
├── kontakt.html
├── hittahit.html
├── includes/
│   ├── header.html
│   └── footer.html
├── css/
│   └── style.css
├── js/
│   ├── firebase.js
│   ├── layout.js
│   ├── status.js
│   ├── opening-hours.js
│   ├── senaste-nytt.js
│   ├── galleri.js
│   └── nyinkommet.js
├── admin/
│   ├── index.html
│   ├── panel.html
│   └── oppettider.js
├── bilder/
├── backup/
│   └── legacy-js/
├── docs/
│   └── TESTLISTA-V4.md
├── VERSION.txt
└── CHANGELOG.md
```

## Viktiga aktiva filer

- `js/layout.js` laddar gemensam header och footer.
- `js/status.js` hanterar öppet/stängt, informationsrad och avvikande tider i statusen.
- `js/opening-hours.js` visar öppettider på kontaktsidan.
- `js/senaste-nytt.js` visar de fyra senaste bilderna på startsidan.
- `js/galleri.js` hämtar butiksgalleriet från Firebase.
- `js/nyinkommet.js` hämtar Nyinkommet från Firebase.
- `admin/panel.html` innehåller adminpanelens funktioner.

## Säkerhetskopierade äldre filer

`backup/legacy-js/` innehåller äldre JavaScript som inte längre länkas från webbplatsen. De ligger kvar som reserv men laddas inte av de publika sidorna.

## Lokal testning

Header och footer laddas med `fetch()`. Sidorna bör därför testas via GitHub Pages eller en lokal webbserver, inte genom att dubbelklicka på HTML-filer med en `file://`-adress.

## Version 4.0.0

Den här versionen är en städ- och stabiliseringsversion. Den ska inte ändra webbplatsens utseende eller fungerande funktioner. Se `CHANGELOG.md` och `docs/TESTLISTA-V4.md`.

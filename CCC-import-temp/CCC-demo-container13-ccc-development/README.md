# Container 13 Vintage

**Projektversion:** 6.10.53  
**Basversion:** 6.10.51

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
- valbar startanimation och animationsförhandsvisning
- besökarens val mellan automatiskt, ljust och mörkt tema
- valbara Spotify-spellistor från adminpanelen
- PWA-stöd för webbplats och adminpanel
- lightbox, skeleton loading och responsiv bildlayout

## Aktiv mappstruktur

```text
Container13-vintage-main/
├── index.html
├── galleri.html
├── nyinkommet.html
├── omoss.html
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
│   ├── nyinkommet.js
│   ├── site-settings.js
│   ├── theme-init.js
│   └── theme-controls.js
├── admin/
│   ├── index.html
│   ├── panel.html
│   ├── sw.js
│   └── manifest.webmanifest
├── bilder/
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
- `js/site-settings.js` applicerar logotyp, kontaktuppgifter, sociala länkar och Spotify.
- `admin/panel.html` innehåller adminpanelens funktioner.

## Bilder

Galleri och Nyinkommet hämtas från Firestore/Firebase Storage. Gamla lokala exempelbilder ingår därför inte längre. Gatuvy-bilderna använder WebP för snabbare laddning.

## Lokal testning

Header och footer laddas med `fetch()`. Sidorna bör därför testas via GitHub Pages eller en lokal webbserver, inte genom att dubbelklicka på HTML-filer med en `file://`-adress.

## Version 6.10.53

Den här versionen synkroniserar projektets versionsuppgifter och tar bort verifierat oanvända filer. Den ändrar inte webbplatsens avsedda utseende eller funktioner. Se `CHANGELOG.md`.

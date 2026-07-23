# Container 13 Vintage

**Projektversion:** 2.0 – gemensam grundstruktur  
**Status:** Lokal utveckling. Publik testversion finns på GitHub Pages.

## Projektets syfte

Container 13 Vintage är en mobilanpassad webbplats för butiken Container 13 Vintage i Hudiksvall.

Webbplatsen innehåller:

- startsida
- butiksgalleri
- sidan Nyinkommet
- kontakt och öppettider
- vägbeskrivning
- gemensam header och footer
- öppet-/stängtstatus från Firebase
- administratörspanel

## Mappstruktur

```text
Container13/
├── index.html
├── galleri.html
├── nyinkommet.html
├── kontakt.html
├── hittahit.html
├── includes/
│   ├── header.html
│   └── footer.html
├── css/
│   ├── style.css
│   └── style_old*.css
├── js/
│   ├── layout.js
│   ├── status.js
│   ├── opening-hours.js
│   ├── firebase.js
│   ├── bilder.js
│   ├── script.js
│   └── nyinkommet.js
├── bilder/
│   ├── galleri/
│   ├── logotyp/
│   └── nyinkommet/
└── admin/
```

## Gemensam header och footer

Alla publika sidor innehåller:

```html
<div id="site-header"></div>
<div id="site-footer"></div>
<script type="module" src="js/layout.js"></script>
```

`js/layout.js` hämtar:

- `includes/header.html`
- `includes/footer.html`

Efter att headern har laddats startar `layout.js` även `js/status.js`.

### Viktigt vid lokal testning

Den gemensamma headern och footern hämtas med `fetch()`.

Därför fungerar de inte när en HTML-fil öppnas direkt via:

```text
file://
```

Projektet måste öppnas via en webbserver, exempelvis:

- GitHub Pages
- Firebase Hosting
- en lokal webbserver med en `http://localhost`-adress

## JavaScript-filer

### `js/layout.js`

Laddar den gemensamma headern och footern, markerar den aktiva menysidan och startar `status.js`.

### `js/status.js`

Hämtar öppettider och informationsrad från Firebase/Firestore och uppdaterar statusraden i headern.

Headern måste innehålla följande ID:n:

- `store-status`
- `opening-status-text`
- `information-divider`
- `information-message`
- `information-message-text`

### `js/opening-hours.js`

Används på `kontakt.html` och visar hela listan med öppettider i elementet:

```html
<div id="oppettider-lista"></div>
```

### `js/firebase.js`

Innehåller Firebase-konfigurationen som används av `opening-hours.js`.

### `js/bilder.js`

Innehåller filnamnen för bilderna i butiksgalleriet.

Den används tillsammans med `js/script.js` på `galleri.html`.

### `js/script.js`

Bygger butiksgalleriet och styr dess lightbox, pilar, tangentbord och svepning.

### `js/nyinkommet.js`

Bygger det nuvarande lokala Nyinkommet-galleriet och styr dess lightbox.

## CSS

### `css/style.css`

Detta är webbplatsens aktiva CSS-fil och används av samtliga publika HTML-sidor.

### `css/style_old.css` till `css/style_old4.css`

Dessa filer är äldre säkerhetskopior. Ingen av de publika HTML-sidorna länkar till dem.

De kan flyttas till en separat reservmapp eller tas bort först efter att version 2.0 har testats och godkänts på GitHub Pages.

## Bilder

### `bilder/galleri/`

Innehåller bilderna som används på sidan Butiken.

### `bilder/nyinkommet/`

Innehåller de lokala bilder som för närvarande används av `nyinkommet.js`.

### `bilder/logotyp/`

Innehåller webbplatsens logotyp och tillhörande originalbild.

### Bilder i roten av `bilder/`

Det finns flera gatuvybilder, varav två verkar vara identiska kopior:

- `gatuvy.png`
- `gatuvy (1).png`

De ska inte raderas förrän vi har bekräftat vilken fil `hittahit.html` använder.

## Adminpanelen

Adminpanelen ligger i `admin/` och ska inte länkas från den publika navigeringen.

Den används för bland annat:

- inloggning
- öppettider
- informationsrad
- galleri och bildhantering

Adminpanelen fungerar separat från den gemensamma publika headern och footern.

## Filer som inte ska ändras utan kontroll

Följande filer påverkar flera sidor eller Firebase-funktioner:

- `includes/header.html`
- `includes/footer.html`
- `js/layout.js`
- `js/status.js`
- `js/firebase.js`
- `admin/panel.html`
- `admin/oppettider.js`

Ta alltid en säkerhetskopia innan större ändringar.

## Kontrollerad städplan

### Steg 1 – klart

- Projektets filer inventerade.
- Gemensam header och footer dokumenterade.
- Aktiva CSS- och JavaScript-filer identifierade.

### Steg 2 – nästa

- Ladda upp version 2.0 till GitHub.
- Kontrollera alla fem publika sidor via GitHub Pages.
- Kontrollera meny, footer, statusrad och öppettider.

### Steg 3 – efter godkänt test

- Flytta eller radera `style_old*.css`.
- Kontrollera och ta bort dubbletten av gatuvybilden.
- Kontrollera om lokala Nyinkommet-bilder ska ersättas helt av Firebase.
- Optimera stora PNG-bilder för snabbare laddning.

## Testlista för GitHub Pages

Kontrollera följande på dator och mobil:

- [ ] Header visas på alla fem sidor.
- [ ] Rätt menylänk markeras som aktiv.
- [ ] Statusraden visar öppet eller stängt.
- [ ] Informationsmeddelandet visas när det är aktiverat.
- [ ] Footer visas på alla fem sidor.
- [ ] Butiksgalleriet fungerar.
- [ ] Nyinkommet fungerar.
- [ ] Öppettider visas på kontaktsidan.
- [ ] Kartan och vägbeskrivningen fungerar.
- [ ] Alla sociala länkar öppnas korrekt.

## Ändringslogg

### Version 2.0

- Gemensam header via `includes/header.html`.
- Gemensam footer via `includes/footer.html`.
- Gemensam inläsning via `js/layout.js`.
- Statusraden körs via `js/status.js`.
- Projektstruktur och testförfarande dokumenterade.

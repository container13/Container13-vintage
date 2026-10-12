# Test: Ny JPG direkt till GitHub

## Syfte
Skapa en ny JPG lokalt, överför dess Base64-innehåll via GitHub create_blob och placera den i en separat testmapp med create_tree, create_commit och update_ref utan force-push.

## Fil
- `ny-bild.jpg` – nygenererad JPEG 16 × 16 pixlar, enfärgad blå, 286 byte.

## Verifiering
- GitHub create_blob returnerade SHA `ff43c460bb40d8669c22c66383dc8330491b1bf8`.
- Kontrollera efter commit att filen finns på grenen och har samma blob-SHA.
- Öppna filen i GitHub/webbläsare för visuell kontroll.

## Säkerhet
Ingen befintlig produktionsfil ändras. Varje test får egen undermapp.

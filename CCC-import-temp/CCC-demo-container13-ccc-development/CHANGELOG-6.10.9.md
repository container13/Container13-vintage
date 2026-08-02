# Container13 6.10.9

## Korrigerad gatuvy på Hitta hit

### Bakgrund

Gatuvybilden på sidan Hitta hit hade börjat visas utdragen på höjden.
Felet syntes både på dator och mobil, men blev särskilt tydligt på smala
mobilskärmar.

### Orsak

Bildfilen är korrekt och har originalmåttet 1888 × 792 pixlar. I
`hittahit.html` fanns bildens bredd och höjd angivna, medan CSS-regeln
ändrade bredden till 100 procent utan att samtidigt låta höjden anpassas
automatiskt. Bilden blev därför smalare utan att höjden minskade i samma
proportion.

### Genomförd ändring

- `.gatuvy` har fått automatisk höjd så höjden alltid följer bildens bredd.
- Bildens naturliga proportioner har uttryckligen bevarats.
- Bilden kan inte längre beskäras eller sträckas av behållaren.
- Cacheversionen i `hittahit.html` har uppdaterats så den rättade CSS-filen
  hämtas direkt.

### Resultat

Gatuvyn visas åter i sitt naturliga breda format på både dator och mobil.
Själva bildfilen har inte ändrats.

### Kontroller

- Bildfilernas verkliga mått har verifierats till 1888 × 792 pixlar.
- CSS-regeln har kontrollerats så att bredd och höjd behåller samma
  proportioner.
- ZIP-paketets innehåll och mappstruktur har verifierats.

## Ändrade och nya filer

- `hittahit.html`
- `css/style.css`
- `CHANGELOG-6.10.9.md`

## Uppladdning

Packa upp ZIP-filen och ladda upp hela innehållet till roten i GitHub-projektet.
Behåll mappstrukturen och ersätt befintliga filer när GitHub frågar.

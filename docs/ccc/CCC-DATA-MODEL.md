# CCC Data Model

## Syfte

Detta dokument beskriver hur information ska organiseras och kopplas samman i CCC.

Målet är att skapa en gemensam informationsmodell som gör att olika CCC-moduler kan samarbeta utan att varje verksamhet behöver bygga egna lösningar.

Container13 används som första referensimplementation.

---

# Översikt

```
Company
 |
 ├── Users
 |
 ├── Profile
 |
 ├── Settings
 |
 ├── Content
 |
 ├── Resources
 |
 ├── Events
 |
 ├── Knowledge
 |
 ├── Workflows
 |
 └── Insights
```

---

# Company

## Ansvar

Representerar verksamheten.

Exempel:

- företagsnamn
- verksamhetstyp
- kontaktinformation
- konfiguration

Alla övriga delar kopplas till ett företag.

---

# Users

## Ansvar

Hanterar personer som använder CCC.

Exempel:

- användare
- roller
- behörigheter
- aktivitet

Grund från Container13:

- Firebase Authentication

---

# Profile

## Ansvar

Företagets identitet.

Exempel:

- beskrivning
- varumärke
- information
- kommunikation

---

# Settings

## Ansvar

Gemensamma regler och inställningar.

Exempel:

- funktioner
- preferenser
- systemval

Grund från Container13:

- Firestore settings

---

# Content

## Ansvar

Information som skapas och publiceras.

Exempel:

- texter
- inlägg
- sidor
- kommunikation

Grund från Container13:

- nyinkommet
- sidinnehåll

---

# Resources

## Ansvar

Digitala filer och material.

Exempel:

- bilder
- dokument
- media

Grund från Container13:

- Firebase Storage
- galleri

---

# Events

## Ansvar

Händelser och aktiviteter.

Exempel:

- besök
- ändringar
- användaråtgärder

Grund från Container13:

- analytics_events

---

# Knowledge

## Ansvar

Företagets minne.

Exempel:

- lärdomar
- beslut
- dokumentation
- erfarenheter

---

# Workflows

## Ansvar

Arbetsflöden.

Exempel:

- processer
- uppgifter
- automatisering
- förbättringsloopar

---

# Insights

## Ansvar

Omvandla data till förståelse.

Exempel:

- analyser
- mönster
- rekommendationer

---

# Grundprincip

CCC ska skapa en gemensam struktur där företagets information kan användas av flera moduler.

Data ska inte bara lagras.

Den ska skapa förståelse, förbättring och bättre beslut.

---

CCC gör det enklare.

Muskelkraft med små medel.

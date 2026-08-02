# Configuration Flow

## Flöde

Admin

↓

Configuration Service

↓

Configuration Model

↓

Configuration Adapter

↓

Datakälla

## Mål

Separera:

- gränssnitt
- affärslogik
- lagring

Det gör att CCC kan byta teknisk plattform utan att bygga om hela systemet.

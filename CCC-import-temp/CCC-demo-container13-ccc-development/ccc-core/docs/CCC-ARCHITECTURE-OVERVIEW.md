# CCC Architecture Overview v0.1

## Syfte

CCC är en återanvändbar plattform byggd för att förenkla verksamhetsdrift genom tydliga lager och återanvändbara komponenter.

## Lager

```
Application

↓

Modules

↓

Services

↓

Core

↓

Adapters

↓

External Systems
```

## Core

Core innehåller grundfunktioner:

- Identity
- Configuration
- Storage
- Security

## Services

Services innehåller gemensamma funktioner:

- Events
- Logging
- Notifications
- AI

## Modules

Modules representerar verksamhetsfunktioner som byggs ovanpå plattformen.

## Adapters

Adapters kopplar CCC till externa system utan att påverka kärnan.

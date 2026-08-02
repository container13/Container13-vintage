# Configuration Implementation Overview

## Syfte

Sammanfattar hur Configuration Core är uppbyggt från modell till lagring.

## Arkitektur

```
Models

↓

Services

↓

Adapter

↓

Datakälla
```

## Models

Configuration Core använder:

- Configuration
- Setting
- FeatureToggle

för att beskriva systemets konfiguration.

## Services

Ansvar:

- läsa konfiguration
- ändra inställningar
- hantera funktionsväxlar

## Adapter

Första referensadapter:

- FirestoreSettings

Container13 används som första beprövade implementation.

## Container13 Mapping

Container13:

- Firestore settings
- öppettider
- tema
- animation
- statusrad

CCC:

- Configuration Model
- Configuration Service
- Configuration Adapter

## Status

Configuration Core v0.1

Dokumenterad och förberedd för implementation.

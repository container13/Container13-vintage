# Firestore Implementation Notes

## Syfte

Första steget från schema till faktisk adapterlogik.

## Ansvar

FirestoreConfigurationAdapter ska:

- bygga rätt paths
- konvertera data via mapper
- läsa configuration
- spara configuration

## Viktig princip

Ingen service ska känna till Firestore direkt.

Flöde:

ConfigurationService

↓

ConfigurationAdapter

↓

FirestoreConfigurationAdapter

↓

Firestore

## Status

CCC Firestore Adapter v0.2

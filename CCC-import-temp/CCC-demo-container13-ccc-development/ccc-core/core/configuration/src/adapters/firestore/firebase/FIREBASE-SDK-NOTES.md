# Firebase SDK Integration Notes

## Syfte

Första steget mot riktig Firebase SDK-integration.

## Ansvar

Firebase Layer ansvarar för:

- initiering av Firebase
- Firestore-kommunikation
- isolering av SDK-specifik kod

## Flöde

FirebaseApp

↓

FirebaseFirestore

↓

Firebase SDK

↓

Firestore

## Status

CCC Firebase SDK Layer v0.1

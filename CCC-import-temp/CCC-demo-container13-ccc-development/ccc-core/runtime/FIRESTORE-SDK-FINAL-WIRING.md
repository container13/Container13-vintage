# Firestore SDK Final Wiring v0.1

## Syfte

Sista kopplingspunkten innan riktig Firebase SDK implementation.

## Flöde

Runtime

↓

FirebaseRuntimeClient

↓

FirestoreClient

↓

FirebaseFirestore

↓

Firebase SDK

↓

Firestore

## Nästa steg

Aktivera riktiga SDK-anrop:
- initializeApp()
- getFirestore()
- setDoc()
- getDoc()

Status:
Förberedd för första riktiga Firestore-test.

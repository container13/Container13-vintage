# Firestore Configuration Adapter

## Syfte

Första externa adapterimplementationen för Configuration Core.

## Ansvar

- läsa configuration från Firestore
- spara configuration till Firestore
- isolera Firebase-specifik kod

## Flöde

Configuration Service

↓

Firestore Configuration Adapter

↓

Firestore

## Status

CCC Configuration Adapter v0.1

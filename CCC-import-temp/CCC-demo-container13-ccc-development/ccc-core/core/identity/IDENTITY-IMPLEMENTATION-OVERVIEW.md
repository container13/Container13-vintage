# Identity Implementation Overview

## Syfte

Sammanfattar hur Identity Core är uppbyggt från modeller till autentisering.

## Arkitektur

```
Models

↓

Services

↓

Adapter

↓

Authentication Provider
```

## Models

Identity Core använder:

- User
- Company
- Role
- Permission

för att beskriva identitet och åtkomst.

## Services

Ansvar:

- autentisera användare
- hantera användare
- hantera roller
- hantera behörigheter

## Adapter

Första referensadapter:

- Firebase Authentication

Container13 används som första beprövade implementation.

## Container13 Mapping

Container13:

- Firebase Auth
- Admin login

CCC:

- Identity Model
- Identity Services
- Authentication Adapter

## Status

Identity Core v0.1

Dokumenterad och förberedd för implementation.

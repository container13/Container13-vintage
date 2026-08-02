# Storage Core Overview

## Syfte

Storage Core hanterar digitala resurser i CCC.

## Arkitektur

Resource

↓

File

↓

Storage Location

↓

Adapter

↓

Storage Provider

## Components

### Models

- Resource
- File
- StorageLocation

### Services

- StorageService
- UploadService
- ResourceManager

### Adapter

- FirebaseStorage

## Container13 Connection

Container13 har redan en fungerande grund:

- Firebase Storage
- galleri
- nyinkommet
- bildhantering

CCC generaliserar detta till en återanvändbar plattformskomponent.

## Status

Storage Core v0.1

Dokumenterad.

# CCC Integration Overview v0.1

## Syfte

Beskriver hur CCC:s olika lager kommunicerar med varandra.

## Grundflöde

```
Core

↓

Services

↓

Modules

↓

External Systems
```

## Identity Integration

Identity Core skapar händelser:

- user.created
- user.login
- role.changed
- permission.updated

Dessa skickas till:

Events Service

och kan loggas via:

Logging Service

---

## Configuration Integration

Configuration Core skapar händelser:

- settings.changed
- feature.enabled
- configuration.updated

Flöde:

Configuration Core

↓

Events Service

↓

Logging Service

---

## Princip

Events är CCC:s gemensamma kommunikationslager.

Logging skapar spårbarhet.

Services ska kunna användas oberoende av varandra.

## Status

CCC Integration Layer v0.1

Dokumenterad.

# Security Core Overview

## Syfte

Security Core skyddar CCC:s data, funktioner och användares åtkomst.

Security Core ansvarar för att rätt person får göra rätt saker i rätt sammanhang.

---

# Arkitektur

```
Security Policy

        |

Access Rules

        |

Security Services

        |

Adapter

        |

Security Provider
```

---

# Components

## Models

Definierar:

- SecurityPolicy
- AccessRule
- AuditEntry

---

## Services

Hanterar:

- AuthorizationService
- AccessControlService
- AuditService

---

## Adapter

Hanterar koppling till extern säkerhetslösning:

- Firebase Security Rules

---

# Container13 Connection

Container13 har redan beprövade delar:

- Firebase Authentication
- Firestore Rules
- Storage Rules

CCC generaliserar detta till en återanvändbar säkerhetsplattform.

---

# Status

Security Core v0.1

Dokumenterad.

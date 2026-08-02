# Identity Core Overview

## Syfte

Detta dokument sammanfattar Identity Core och hur delarna samverkar.

Identity Core ansvarar för att veta:

- vem användaren är
- vilket företag användaren tillhör
- vilka roller användaren har
- vilka rättigheter användaren har

---

# Arkitektur

```
Company

   |
   |

User

   |
   |

Role

   |
   |

Permission
```

---

# Authentication Flow

```
User

  |

Authentication Service

  |

Firebase Auth Adapter

  |

Firebase Authentication
```

---

# Components

## Models

Definierar information:

- User
- Company
- Role
- Permission

---

## Services

Hanterar funktioner:

- Authentication
- User Management
- Permission Control

---

## Adapter

Hanterar kopplingen mot extern identitetstjänst:

- Firebase Authentication

---

# Container13 Connection

Container13 har redan testat grunden:

- Firebase Authentication
- admininloggning
- användarhantering

CCC generaliserar denna lösning till en återanvändbar Core-komponent.

---

# Status

Identity Core v0.1

Dokumenterad.

Nästa steg:
Implementera eller flytta första funktionella byggblock.

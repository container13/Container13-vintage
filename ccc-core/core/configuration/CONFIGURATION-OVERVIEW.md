# Configuration Core Overview

## Syfte

Configuration Core hanterar CCC:s gemensamma konfiguration.

Den ansvarar för att företag och moduler kan ha egna inställningar utan att logik behöver byggas om.

---

# Arkitektur

```
Company

   |

Configuration

   |

Settings + Feature Toggles

   |

Services

   |

Adapter

   |

Firestore
```

---

# Components

## Models

Definierar information:

- Configuration
- Setting
- FeatureToggle

---

## Services

Hanterar funktioner:

- ConfigurationService
- SettingsManager
- FeatureToggleService

---

## Adapter

Hanterar kopplingen till datalager:

- FirestoreSettings

---

# Container13 Connection

Container13 har redan en fungerande grund:

- Firestore settings
- öppettider
- tema
- animation
- funktionsväxlar

CCC generaliserar detta till en återanvändbar plattformskomponent.

---

# Status

Configuration Core v0.1

Dokumenterad.

Nästa steg:
Implementera eller lyfta första funktionella byggblock.

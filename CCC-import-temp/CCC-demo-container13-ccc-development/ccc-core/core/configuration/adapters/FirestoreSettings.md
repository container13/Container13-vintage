# Firestore Settings Adapter

## Syfte

Kopplar CCC Configuration Core till ett externt datalager.

I första implementationen används Firestore eftersom det redan är beprövat i Container13.

---

## Ansvar

- läsa konfigurationsdata från Firestore
- spara ändringar
- översätta lagrad data till CCC Configuration-modeller
- isolera databasspecifik kod

---

## Arkitektur

```
CCC Configuration Core

        |

        v

Firestore Settings Adapter

        |

        v

Firestore Database
```

---

## Referens från Container13

- Firestore settings
- öppettider
- tema
- animation
- funktionsväxlar

---

## Framtida flexibilitet

CCC ska kunna byta datalager utan att Configuration Core behöver byggas om.

---

## Status

Planerad CCC Configuration Adapter.

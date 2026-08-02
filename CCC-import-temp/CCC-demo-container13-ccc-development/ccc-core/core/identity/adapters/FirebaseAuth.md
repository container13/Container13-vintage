# Firebase Auth Adapter

## Syfte

Kopplar CCC Identity till en extern identitetsleverantör.

I första implementationen används Firebase Authentication eftersom det redan är beprövat i Container13.

---

## Ansvar

- hantera koppling mot Firebase Authentication
- översätta externa användare till CCC User-modell
- isolera leverantörsspecifik kod från Core

---

## Arkitektur

```
CCC Identity

        |
        v

Firebase Auth Adapter

        |
        v

Firebase Authentication
```

---

## Referens från Container13

- Firebase Authentication
- admin login
- autentiserade användare

---

## Framtida flexibilitet

CCC ska kunna byta identitetsleverantör utan att övriga Core-komponenter behöver ändras.

Exempel:

Firebase Auth
        |
        v
Annat Identity-system

---

## Status

Planerad CCC Identity Adapter.

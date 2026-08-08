CCC AUTH
========

Syfte
-----
Auth-modulen innehåller inloggning, registreringsflöde, lösenordsåterställning och framtida sessions-/säkerhetsval.

Aktuellt – v2.5.0
------------------
- Logga in är primär handling.
- Skapa konto ligger direkt under Logga in som sekundär handling.
- Glömt lösenord? ligger som diskret textlänk.
- Firebase Auth använder persistent lokal session på normal/egen enhet.
- Om en giltig Firebase-session redan finns skickas auth/index.html direkt vidare till dashboard.
- Användaren ska normalt inte behöva logga in igen på sin egen enhet.

Inloggningsfilosofi
-------------------
CCC ska kännas som en app: öppna → jobba. Auth ska bara visas när inloggning faktiskt behövs.

Ny inloggning krävs när
-----------------------
- användaren själv loggar ut,
- sessionen blir ogiltig,
- eller en säkerhetshändelse kräver ny autentisering.

Planerat: Inställningar → Säkerhet
---------------------------------
- Håll mig inloggad på den här enheten (standard).
- Tillfällig/delad enhet: automatisk utloggning efter cirka 10 minuters inaktivitet.
- Logga ut nu.
- Senare: visa/hantera inloggade enheter.

Viktigt
-------
Valet för tillfällig enhet ska ligga i Inställningar, inte som en extra fråga vid varje inloggning. CCC ska använda ett bra standardval och undvika onödiga beslut.

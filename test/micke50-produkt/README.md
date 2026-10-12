# Gemensamma album – fiskeresa som pilot

Status: DRAFT / UI-prototyp. Ingen backend, kontoregistrering, lagring, publicering, betalning eller kvotkontroll är aktiverad.

## Beslut
- Micke50 är oförändrat original och referens.
- En gemensam mall för fiskeresor, fester och andra upplevelser.
- Hela upplevelsen gratis upp till 10 bilder per album; sedan erbjudande om köp.
- Fotobok och andra tillägg ligger i idébanken, ej scope nu.
- Utgå från project-template/PROJECT_RELEASE_STANDARD.md och solutions/.

## Levererat
- Mobilanpassad startsida med val av albumtyp.
- Formulär för namn, ägare, e-post, välkomsttext och lokal startbild.
- Omedelbar förhandsgranskning och tydlig status: inte publicerat.
- Ingen personinformation skickas till backend i denna prototyp.

## Innan riktig registrering
1. Välj backend efter kostnads- och säkerhetsjämförelse (Supabase Auth/DB + R2 eller annat). Inventera aktuell produktionskonfiguration först.
2. Implementera autentisering med verifierad e-post, event/album-schema, ägarskap och RLS.
3. Säker serverstyrd bildkvot med atomisk reservation (max 10), inklusive samtidiga uppladdningar och idempotens.
4. Separata privata objektprefix, säker delningsmodell, anti-spam, moderering och galleri.
5. Betalningsleverantör och serververifierad uppgradering, utan att ändra URL eller radera befintliga bilder.
6. Testa minst två oberoende album, mobil och desktop, integritet, radering och återställning.
7. Ange lagrings- och personuppgiftsvillkor, samtycke för offentliga demobilder, kostnadstak och bevakning.

## Verifieringsstatus
- GitHub commit/readback är inte samma sak som deploy eller användartest.
- Säkerhet och betalning klassas HIGH enligt projektstandarden.

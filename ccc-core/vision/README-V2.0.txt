CCC Vision v2.0 – bildserie / local-first test

Ny testlogik:
- Kamera: ta ett foto per plagg, välj Nästa plagg eller Klar.
- CCC förbereder varje förslag tyst i bakgrunden medan bildserien fortsätter.
- Kamerarulle: välj flera bilder; varje vald bild blir ett plagg i serien och analysen startar direkt när bildväljaren stängs.
- Efter Klar granskas bilderna en i taget med färdiga förslag.
- Godkänn & nästa går direkt vidare till nästa bild/plagg.
- Ändra öppnar den kompakta redigeringsvyn och Spara & nästa fortsätter serien.
- Fler bilder på samma plagg kan läggas till först på förslagsvyn (max två extra i denna testversion).
- Papperskorg är lokal under sessionen med Ångra i fem sekunder.
- Bilder laddas inte upp till Firebase i denna version. Endast lätt metadata om godkännanden/edits sparas i localStorage.

OBS: Vision-resultaten är fortfarande simulerade demoresultat. Syftet med v2.0 är att testa arbetsflödet innan riktig AI kopplas in.

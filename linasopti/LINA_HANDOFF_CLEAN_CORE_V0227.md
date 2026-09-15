# LINA HANDOFF – CLEAN CORE V0.2.27

## Status
G7–G12 Research Battery är **6/6 PASS · FRYST**. Kandidat `15efd75a` oförändrad. Handel AV. Robotmognad 48/100.

Planer: G7 247c474a; G8 46c80eee; G9 c82b5c2a; G10 80385a7e; G11 0cc6ede6; G12 403fef49.

Nyckelresultat: G7 6 positiva år (2023 negativt); G8 max positiv symbolandel 23,03 %, 11/16 icke-negativa; G9 10 000 seeded runs, p95 max-DD 4,69 %; G10 86,67 % positiva proxy-grannar; G11 BOTH_20 +1 133,08/PF 1,045; G12 1,5× DD −5,50 %.

G7–G12 är historisk diagnostik, inte oberoende OOS. G2/G3 Real Forward har högre evidens. Ingen rescue eller parameterändring.

## Permanent workflow
Oberoende förregistrerbara forskningssteg byggs som batterier i samma release och fryses gemensamt efter export. Resultatberoende steg hålls separata. Stora körningar använder IndexedDB/checkpoint; rådata/mellanresultat får inte fylla localStorage. Frysta resultat och restart-punkter ska bevaras.

## Nästa steg
Gör samlad Research Review G2–G12 och välj nästa forskningsfråga utifrån evidensen. Fortsätt Real Forward parallellt.

Cloudflare Worker: INGEN ÄNDRING.

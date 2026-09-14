# LINA HANDOFF – CLEAN CORE V0.2.4

V0.2.4 bygger vidare på verifierade V0.2.3.

## Ändring
- Fixar G2 localStorage quota under steg N utan strategiändring.
- När M är fryst rensas tung DEV-rådata (`devRows`), full `gridResults` och eventuell avslutad DEV-fetchcheckpoint.
- Fryst kandidat, A–M-resultat, trialLedger och pågående OOS-checkpoint bevaras.
- Vid Fortsätt efter ett quota-avbrott komprimeras befintligt state innan ny run-status sparas, så 13/15 kan fortsätta utan reset.
- Ingen ändring av G2-parametrar, urval, kostnad, risk, perioder eller domregler.
- Ny start/login landar fortsatt på Dashboard/index.
- Handel AV, robotmognad 48/100.

## Permanent arbetssätt
- Cloudflare Worker: ge komplett färdig Worker-kod direkt i chatten för copy/paste i befintlig Cloudflare-editor och Deploy, om inget annat uttryckligen behövs.
- Generera aldrig bild om användaren inte uttryckligen ber om bild.

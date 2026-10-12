# Remember – aktuell överlämning

## Starta här
Läs ../project-template/PROJECT_RELEASE_STANDARD.md, PROJECT_MASTER_RULES.md och PROJECT_RELEASE_CHECKLIST.md. Läs sedan README.md, DECISIONS.md, IDEBANK.md och PROJECT_CURRENT_STATE.json. Kontrollera branch-head, verklig deploy och klient innan fortsatt arbete. Sök ../solutions/ för verifierade lösningar.

## Produkt
Container13 är varumärket. Remember är arbets-/mappnamn. Adress avsedd: https://container13.se/remember/. Fiskeresa är första pilot. Gratis upp till 10 bilder, därefter eventuell betaluppgradering. Se DECISIONS.md för fastställt kontra öppet.

## Nuvarande leverans
remember/index.html är en fristående UI-prototyp kopierad från test/micke50-produkt/ med Remember-branding. Formuläret förhandsgranskar lokalt, skapar inga verkliga konton eller album. Micke50-originalet och tidigare test är orörda.

## Nästa steg
Verifiera faktisk deploy/UI och mobil; inventera befintlig backend innan registrering. Auth, kvoter och betalningar är HIGH-risk. Håll COMMITTED, DEPLOYED, RUNTIME PASS och DEVICE PASS åtskilda. Fortsätt från första ej verifierade steg, aldrig genom att återuppfinna ett parallellt system.

## Backendinventering och nästa kontroll
Micke50 har Supabase Storage och en separat admin Edge Function; dessa får inte användas som gemensam oskyddad fler-album-backend. Se BACKEND_ARCHITECTURE.md för ett föreslaget separat albumregister, ägarautentisering, skyddad gästdelning, atomisk kvot och betalningsflöde. Detta är en designkandidat, inte implementerat. Nästa steg: bekräfta faktisk hosting/testmiljö och Supabase-åtkomst, besluta albumens synlighet, därefter bygg och verifiera en isolerad migration med RLS och uppladdningsreservationer. Live- och enhetstest saknas fortfarande.

## Senaste beslut: tidsfonster
Alla med en delningslank eller QR kan delta under oppet fonster. Fest och brollop: 24 timmar fran start. Resor: fran start till 24 timmar efter slut. Sedan fortsatt visning men ingen uppladdning. Agaren kan stanga tidigare. Designbeslut, inte implementerat.

## Webmaster schedule requirement
Webmaster has secure, server-enforced authority to edit any album's upload window, close/reopen it and restore defaults after creation. Keep audit log and separate owner defaults from webmaster overrides. This is documented only; not implemented or deployed.

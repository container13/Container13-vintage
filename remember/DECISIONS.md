# Beslut – Container13 Remember

## Fastställda
- Huvudvarumärke: Container13. Vintagebutiken är fortsatt Container13 Vintage.
- Albumtjänstens arbetsnamn och mappnamn: Remember. Avsedd adress: https://container13.se/remember/.
- Tjänsten ska kunna användas för fiskeresor, fester, bröllop, resor och andra gemensamma upplevelser.
- Första verkliga pilot: fiskeresa. Micke50 är referens, ska inte modifieras.
- Gratis full upplevelse upp till 10 bilder per album; därefter möjlighet till uppgradering utan att förlora bilder eller URL.
- En gemensam återanvändbar produkt, inte en ny hårdkodad webbplats per tillfälle.
- Gemensam projektstandard och solutions-bibliotek ska återanvändas. Inga parallella system utan skäl.

## Öppet – inga antaganden som beslut
- Backend: Supabase/Auth/DB + Cloudflare R2 eller annan lösning, ej valt.
- Betalningsmodell/pris: engångsbetalning ca 199 kr för 200 bilder/90 dagar och årsmodell ca 149 kr har diskuterats som exempel, inte beslutats.
- Gästers behörigheter, albumens offentlighet, datalivslängd, GDPR-villkor och betalningsleverantör ska beslutas innan produktion.
- Remember är ett vanligt ord; mappnamn ger inte automatisk juridisk immunitet. Container13 ska vara tydlig avsändare.
- Ingen produktionslansering eller registrering är godkänd genom detta namnval.

## Album sharing and owner workflow - agreed
- Owner provides name and verified email for secure album administration and purchase communication.
- Guests can open the shared album URL or QR code and upload photos without registering, subject to abuse protection before launch.
- Every album has a stable unique share URL; the owner can copy and share it. QR points to that same URL. Owner administration uses separate protected access, never the public share link.
- Owner may suggest a readable URL slug if available; final format and protection against guessing/enumeration require backend design.
- First 10 photos remain free without purchase. On reaching the limit, offer the owner an optional upgrade by email; prices/provider remain undecided.
- Upgrading must preserve existing photos, album URL and QR code. Transaction email/receipt follows the payment provider.
- These are requirements, not implemented or verified features. Privacy, access, retention and anti-spam safeguards remain launch gates.

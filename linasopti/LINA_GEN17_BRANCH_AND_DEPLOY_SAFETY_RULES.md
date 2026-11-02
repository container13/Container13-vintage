# Linas Opti Gen17 – miljö- och deployregler

## Aktuell rättelse från användaren 2026-11-02
Linas Opti och Workern `linas-opti-api` är användarens TESTMILJÖ. Cloudflares etikett Production beskriver plattformens miljö, inte användarens klassning av tjänsten. Äldre beskrivningar av tjänsten som skyddad verklig produktion var missvisande.

Användaren har återaktiverat Cloudflare Workers Builds och bekräftat sparat. Dokumentationspushar kan därmed bygga/deploya befintlig oförändrad Worker. Säg inte att en repo-skrivning saknar deployeffekt.

## Gällande skydd
- Enda tillåtna arbetsgren är ccc-demo-public-test i container13/Container13-vintage. main får inte användas, ändras, mergas eller deployas.
- Handel och Forward förblir AV. Gen8–16 frysta. Gen17 DRAFT_ONLY / PIT_UNVERIFIED.
- Bevara befintlig autentisering, funktionalitet och secrets. Aldrig hemliga värden i chatt, kod eller loggar.
- Separata linas-opti-gen17-sse-staging är redan publicerad men saknar runtime-auth. Den är inte obligatoriskt nästa steg; be inte användaren konfigurera dubbla secrets enbart för att fortsätta denna tidigare valda väg.
- Kontrollera faktisk wrangler-konfiguration och exakt källa före kodändring. Gen17-kandidaten är inte automatiskt live i linas-opti-api bara för att den publicerats till separat staging.
- Miljörättelsen och återaktiveringen flyttar inte i sig Gen17-kod. Innan integrering: avgränsa ändringen, verifiera exakt kandidat med tester och dry-run och håll forsknings-/handelsgates stängda.
- Löpande staging-pushtrigger är borttagen. Ingen ny staging-publicering ska startas automatiskt.

Denna rättelse ersätter äldre miljöklassning och staging-only-antaganden i tidigare överlämningar. Tidigare deploykvitton kvarstår som historiska fakta.

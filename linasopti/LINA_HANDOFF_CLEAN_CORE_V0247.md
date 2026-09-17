# LINA HANDOFF – CLEAN CORE V0.2.47

Datum: 2026-09-17

## Status
V0.2.47 är en ren navigations-/infrastrukturfix byggd från V0.2.46 FLAT COMPLETE. Handel AV. Robotmognad 48/100.

## Fix
V0.2.46 hade en race i Forward Evidence Center: dess asynkrona auto-catch-up behöll referensen till den gemensamma #view och kunde rendera Forward efter att användaren navigerat till Dashboard eller Gen2. Symptom: Tillbaka/Linas Opti/Gen2 hoppade tillbaka.

V0.2.47 lägger route+navigation-sequence guard på alla fördröjda Forward-rerenders. Stale callbacks får inte längre skriva i vyn. Routern använder pushState vid navigation, replaceState endast vid initial route, samt popstate för browser-back.

## Forskning – OFÖRÄNDRAD
Gen2 planhash 1d5f8bc1. DEV 2020–2022. Validation 2023–2024. Holdout 2025-01-01–2026-09-10 SEALED. Inga forskningsregler, strategifamiljer, urvalskrav eller runners ändrade. Original G2/G3 + Real Forward orörda.

## Nästa test
1. Öppna Forward. 2. Tillbaka till Dashboard. 3. Tryck Linas Opti/header och verifiera Dashboard. 4. Forskning → Lina Generation 2 och stanna där minst några sekunder. 5. Browser Back ska följa faktisk historik utan studs.

Cloudflare Worker: INGEN ÄNDRING. V0.2.43-Workern lämnas orörd.

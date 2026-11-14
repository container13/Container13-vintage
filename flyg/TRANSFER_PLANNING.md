# Resort arrival planning — 2026-11-14, candidate0.1.32

User priority: reach ski resort same evening, check in and eat dinner before sleeping. City first-night is an optional fallback; city night after skiing is preferred. Default ready-for-dinner target20:00; editable hard hotel deadline remains22:00.

## Sourced road times to Cervinia

- TRN102min, MXP136min, LIN149min: official Cervino Ski Paradise, https://cervinia.it/en/ (How to get here), checked2026-11-14.
- BGY170min: transfer operator https://taxicervinia.com/en (Top connections), checked2026-11-14.

These are published estimates, NOT a reserved vehicle, availability, exact hotel endpoint, live weather/traffic, a train/bus timetable or a price. They must never acquire verified=true.

Ready-for-dinner estimate = local landing + airport/baggage60min + road estimate + road margin30min + check-in30min. Margins are editable planning assumptions, not source facts. Source airport/resort must match actual last segment. Unknown airports/resorts and public transport remain UNKNOWN in a collapsed separate list.

Main list requires existing flight constraints AND estimated readiness by dinner target; sorted price ascending within that set. Later arrivals are outside main list; optional collapsed reserves may require first-night city accommodation or altered plan. Max layover remains enforced in reserves. City lodging, travel next day, extra-night budget and full ski days are NOT automatically verified.

No additional provider calls on filter edits; no paid routing service, secret or backend change. Departure/return selection still required; baggage-inclusive total remains unknown. Full road-trip availability and actual device tests are separate gates.

## Whole skiing days and return planning —0.1.34

Default last night in city after skiing; alternative direct resort-to-airport return. Ski09:00–16:00, earliest hotel departure07:00, airport120min, city-hotel-to-airport90min are editable PLANNING ASSUMPTIONS, not verified operator rules or timetables. Count whole calendar days after resort arrival through last ski day compatible with departure; return flight nights count toward max nights away. No lift/season/weather verification.

Cervinia-city road planning uses the transfer operator https://taxicervinia.com/en published city-to-Cervinia estimates in reverse as an explicit modelling assumption: Milan146min;Turin101min. Airport transfer availability, exact hotel endpoints and traffic remain unknown. City is selected from return airport (Turin forTRN,Milano forMXP/LIN/BGY). A final city night is inside total nights, not added silently.

Reject plans requiring hotel departure before chosen earliest time, too few whole ski days, city arrival after hotel deadline, or too many nights. Unsupported transit stays UNKNOWN. Calendar comparisons retain all fetched return candidates and can choose a later qualifying return locally when assumptions change; no additional provider call for these edits. Quotes still exclude unknown required baggage and ground costs.

## Flexible stay and breakfast preference —0.1.36 (supersedes fixed four-night/default city-night rules)

User accepts one extra night even when the whole trip is about1000SEK more TOTAL FOR TWO. Three whole ski days suffice; any additional skiing is optional. Default compare4and5nights (editable base), not a fixed4night maximum. Each airport/night variant is a distinct calendar query; eight per batch, completion recorded per variant; resume skips completed work. Turning extra night off excludes pending longer variants. At most three distinct date pairs are time-enriched, deliberately including base and extra-night options. Existing server Free-only guard and30min cache remain unchanged.

Default return plan is AUTO: prefer direct resort transfer when earliest departure also allows calm breakfast (default breakfast ready09:00); otherwise assess last city night. City night remains selectable even with a late flight. City earliest05:00, resort earliest07:00, city-airport90min and airport120min are editable assumptions, not operator facts or a fixed08–12rule. Very early returns may still need different hotel location or margins; those are not invented.

Incremental cost compares a matched, qualifying baseline itinerary, never a calendar floor. Include flight-price difference plus entered whole-trip hotel, ground, baggage and other cost DIFFERENCES for TWO. Signed savings and explicitly entered zero allowed; any blank/unknown component leaves cost UNKNOWN. User estimates never become a verified all-in total. Within/over1000 classifications are estimates only; unknown extra-night trips are separate and cannot be presented as approved against the tolerance. The flight-only display ceiling may expand by the tolerance for inspection, while full incremental classification still needs all components.

## St. Anton road-time candidate — 2026-11-14 (UNRELEASED)

Added existing `journey-engine.js` mapping for **St. Anton am Arlberg** with airport-to-resort *private road* estimates: INN 75 min, ZRH 135 min, MUC 195 min, FDH 100 min. Source: [Taxi St. Anton published driving times](https://www.taxi-st-anton.at/most-driven-destinations/), accessed 2026-11-14. Independent [Ski Arlberg resort transport page](https://www.skiarlberg.at/en/st-anton/getting-here-parking) confirms these are regional gateways, not booked transport. These values are NOT live, weather-adjusted, a confirmed transfer, train departures or a fare; fixed baggage/road/check-in buffers remain editable modelling assumptions. The full itinerary is never verified by these estimates alone.

The previous city-night road model was **Cervinia-specific**. It now explicitly requires Cervinia before using Turin/Milan road assumptions. For St. Anton, city-night transfer remains UNKNOWN rather than incorrectly reusing Italian transfer values. Automatic mode may still select direct resort-to-airport return when model assumptions permit a relaxed breakfast. The optional 5th night, three minimum whole ski days and 1,000 SEK whole-trip difference for two remain intact. Unknown baggage/hotel/ground costs cannot be treated as 0.

**Release gate:** Source/tests committed on `flyg-alperna-init`; not public. CI run 43601889028 showed 92/93 PASS; the single failing service-worker test was caused by outdated `journey-engine.js` integrity entry, not a failing St. Anton itinerary assertion. Integrity run 43601889045 confirms this hash mismatch. Regenerate all 0.1.38 release hashes with existing `tools/prepare-release.mjs`, verify CI, release only Flyg, then browser/iPhone acceptance before any promotion. Until then public 0.1.37 and its state remain unchanged.

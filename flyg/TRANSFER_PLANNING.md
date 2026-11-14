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

# Flight data access — 2026-11-14

## Result
No provider selected or connected. No live-price calls, account creation, paid subscription or backend deployment performed. PWA stays at 0.1.10.

## Verified constraints
| Provider | Finding | Decision |
| --- | --- | --- |
| Skyscanner | Official application excludes non-commercial individuals and sites below 100K monthly active users. Baggage attributes need separate onboarding. | Not suitable for current personal app. |
| Duffel | Live account activation includes business/personal verification. Sandbox fares are not live. Current services agreement section 2.5(d) restricts metasearch; an express exception/permission would be necessary before considering this use. | Not selected. Do not build comparison/deeplink integration assuming permission. |
| Duffel pricing | Public pricing lists $0.005/excess search beyond 1500:1 search/order ratio; agreement treats zero orders as one. This is not a quote or guarantee of approved search-only access. | No costs authorized or incurred. |
| Amadeus Self-Service | Search engines still surface older signup/API docs. Official SDK repository archived July 17, 2026; current portal did not expose usable self-service onboarding in retrieval. | Do not rely on historical free-access instructions; fresh authorized access not verified. |
| Travelpayouts | Live search access requires approval; published usage rules require user-triggered searches, complete results, booking-button flow, conversions and server requests. Cached Data API is not equivalent to live fares. | No access or suitability verified. |
| Plugin discovery | No relevant flight-data integration returned by available plugin search. | No plugin installed. |

## Sources
- https://www.partners.skyscanner.net/contact/travel-api
- https://developers.skyscanner.net/api/flights-live-pricing
- https://duffel.com/services-agreement (sections 2.3 and 2.5)
- https://duffel.com/pricing
- https://duffel.com/guides/getting-started
- https://help.duffel.com/hc/en-gb/articles/4410085835282-Are-the-flight-prices-in-test-mode-sandbox-real
- https://github.com/amadeus4dev/amadeus-node
- https://support.travelpayouts.com/hc/en-us/articles/34788165535250-Search-API-usage-rules

## Existing app and required contract
Origin ARN, 2 adults; Alps 23kg checked bag per person, hotel cutoff 22:00 editable, connections allowed, weeks 11/13 2027. Football-Europe checked-bag exception preserved. Need fare currency/timestamp/expiry, passenger count, per-passenger per-segment weight and baggage cost, timezone-aware segment times and authorized booking/deeplink capability. Unknown weight/transfer must stay UNKNOWN. A fare API alone does not verify ground transfer or hotel arrival.

## Next decision
An interim free search hub may open user-triggered searches on suppliers' own websites. It cannot show their live prices in Flyg, verify baggage or assert hotel feasibility. This alternative is proposed only, not implemented. Full in-app comparison still requires a suitable provider's permission/account, a tested secret-bearing server endpoint, a cost ceiling and a successful live request before UI claims change. Do not put API keys in GitHub Pages.

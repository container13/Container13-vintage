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

## Zero-cost constraint and candidate — latest 2026-11-14
User requires 0 SEK setup and ongoing; account creation is acceptable. No paid activation, card, subscription upgrade or trial-only solution authorized.

SerpApi Free candidate: official pricing lists $0/month, 250 searches/month and 50/hour. Official flight-search guide explicitly describes use for price comparison and registering on Free. It is a third-party Google Flights scraping service, not an official Google API or a demonstrated upstream data licence; current legal terms reviewed and no legal guarantee asserted. No provider-specific connector found. Actual account eligibility, Free enforcement and live response remain unverified.

Important API details:
- Set adults=2 explicitly, ARN, SEK; multiple arrival airports possible, but complete round-trip and booking detail requests can consume extra searches. 250 API calls is not 250 full app-wide searches.
- The bags parameter is carry-on count, NOT 23kg checked baggage.
- Booking-options endpoint exposes baggage policy text, but weight may be absent. Missing weight/cost remains UNKNOWN, not included in an asserted all-in fare.
- no_cache=true requests fresh results; default cache can be up to one hour old.
- Live proof: ARN -> ZRH, 2027-03-14 / 2027-03-18, 2 adults, SEK. First verify account is Free with remaining quota, then one search only; record search ID/time and response summary, not key.
- No backend or UI implementation until useful real response; no accounts or live calls made this session.
- Alternatives reviewed: FlightAPI/Ignav offer initial credits, not demonstrated recurring free allowances; Travelpayouts Data is cached indicative data. LetsFG free MCP path differs from its product Developer API, which requires payment setup/look-to-book, so no assumed free embedded-app permission.

Sources:
- https://serpapi.com/pricing
- https://serpapi.com/blog/how-to-scrape-google-flights/
- https://serpapi.com/google-flights-api
- https://serpapi.com/google-flights-booking-options
- https://serpapi.com/account-api
- https://serpapi.com/legal
- https://serpapi.com/users/sign_up
- https://letsfg.co/developers/docs/getting-started/index.html

Next user step: create SerpApi Free account; establish secure server-side key handling and run the single proof before app integration. Runtime stays 0.1.10.

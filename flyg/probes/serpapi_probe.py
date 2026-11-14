"""One explicit, server-side free-plan probe. Never persist or print provider keys."""
import json
import os
import urllib.error
import urllib.parse
import urllib.request

VERSION = 'probe-0.1.0'
QUERY = dict(engine='google_flights', departure_id='ARN', arrival_id='ZRH',
             outbound_date='2027-03-14', return_date='2027-03-18', adults='2',
             currency='SEK', type='1', hl='sv', gl='se', no_cache='true')

class ProbeError(Exception):
    pass

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ProbeError('Provider redirect rejected; no key forwarded.')

def request_json(path, params):
    url = 'https://serpapi.com/' + path + '?' + urllib.parse.urlencode(params)
    try:
        with urllib.request.build_opener(NoRedirect).open(url, timeout=60) as response:
            raw = response.read(8_000_001)
            if len(raw) > 8_000_000:
                raise ProbeError('Provider response exceeds probe limit.')
            return json.loads(raw)
    except ProbeError:
        raise
    except Exception:
        # Provider errors and exception URLs can contain the key. Never log them.
        raise ProbeError('Provider request failed; details suppressed to protect the key.') from None

def verify_free(account):
    if account.get('plan_monthly_price') != 0 or str(account.get('plan_id', '')).lower() != 'free':
        raise ProbeError('Stopped: account must use the zero-cost Free plan.')
    left = account.get('plan_searches_left')
    if not isinstance(left, int) or isinstance(left, bool) or left < 1:
        raise ProbeError('Stopped: no verified monthly free search quota remains.')
    return left

def probe(key, fetch=request_json):
    if not key or not key.strip():
        return {'status': 'WAITING_FOR_SECRET', 'version': VERSION, 'searches_sent': 0}
    left = verify_free(fetch('account.json', {'api_key': key}))
    response = fetch('search.json', {**QUERY, 'api_key': key})
    if response.get('search_metadata', {}).get('status') != 'Success':
        raise ProbeError('Search did not succeed. Provider response omitted to protect the key.')
    echoed = response.get('search_parameters', {})
    for field in ('departure_id', 'arrival_id', 'outbound_date', 'return_date', 'adults', 'currency'):
        if str(echoed.get(field)) != QUERY[field]:
            raise ProbeError('Search response does not confirm requested route, dates, travelers and currency.')
    offers = response.get('best_flights', []) + response.get('other_flights', [])
    prices = [x.get('price') for x in offers if isinstance(x.get('price'), (int, float))
              and not isinstance(x.get('price'), bool) and x['price'] >= 0]
    return {'status': 'RESULTS_RECEIVED' if prices else 'NO_PRICED_RESULTS',
            'version': VERSION, 'searches_sent': 1, 'free_searches_before': left,
            'request': QUERY, 'priced_result_count': len(prices),
            'lowest_returned_price_field': min(prices) if prices else None,
            'price_scope': 'UNVERIFIED: do not label as total for two yet',
            'checked_baggage_23kg_each': 'UNVERIFIED', 'hotel_arrival': 'UNVERIFIED'}

def main():
    try:
        result = probe(os.environ.get('FLYG_SERPAPI_KEY', ''))
        safe = json.dumps(result, ensure_ascii=False, indent=2)
        print(safe)
        summary = os.environ.get('GITHUB_STEP_SUMMARY')
        if summary:
            with open(summary, 'a', encoding='utf8') as f:
                f.write('# Flyg provider proof\n\n```json\n' + safe + '\n```\n')
        return 0
    except ProbeError as exc:
        print(str(exc))  # Only our fixed, non-provider exception messages.
        return 1

if __name__ == '__main__':
    raise SystemExit(main())

"""One fixed Free-only FDH diagnostic; never print URLs, tokens or raw provider responses."""
import re
from serpapi_probe import request_json, verify_free
QUERY = dict(engine='google_flights_calendar', departure_id='ARN', arrival_id='FDH',
             date_range_start='2027-03-13', date_range_end='2027-03-21',
             round_trip_days='4', type='1', adults='2', currency='SEK',
             hl='en', gl='se', stops='0', no_cache='false', exclude_airlines='FR')
def safe_message(value, key):
    text=str(value or '').replace(key, '[REDACTED]') if key else str(value or '')
    text=re.sub(r'https?://\S+', '[URL_REMOVED]', text)
    text=re.sub(r'[A-Za-z0-9_-]{40,}', '[TOKEN_REMOVED]', text)
    return re.sub(r'[\x00-\x1f\x7f]', ' ', text)[:300]
def diagnostic(key, fetch=request_json):
    if not key:return {'status':'WAITING_FOR_SECRET','search_requests':0}
    before=verify_free(fetch('account.json',{'api_key':key}))
    data=fetch('search.json',{**QUERY,'api_key':key})
    echoed=data.get('search_parameters',{})
    matched=all(str(echoed.get(k))==str(QUERY[k]) for k in ('engine','departure_id','arrival_id','date_range_start','date_range_end','round_trip_days','adults','currency'))
    status=data.get('search_metadata',{}).get('status')
    return {'request':QUERY,'free_searches_before':before,'search_requests':1,
            'metadata_status':status if status in ('Success','Error','Processing') else 'OTHER',
            'context_match':matched,'price_rows':len(data.get('prices',[])) if isinstance(data.get('prices'),list) else None,
            'sanitized_provider_error':safe_message(data.get('error'),key)}

"""Bounded fare/baggage investigation; no booking, no arbitrary destinations or URLs."""
import html
import json
import os
import re
import urllib.parse
import urllib.request
from serpapi_probe import QUERY, ProbeError, NoRedirect, request_json, verify_free

VERSION='details-0.1.0'

def offers(data):
    return [x for x in data.get('best_flights',[])+data.get('other_flights',[])
            if isinstance(x.get('price'),(int,float)) and not isinstance(x.get('price'),bool)]

def minimal_offer(offer):
    return {'price_field':offer.get('price'),'type':offer.get('type'),
            'segments':[{'number':x.get('flight_number'),'from':x.get('departure_airport',{}).get('id'),
                         'to':x.get('arrival_airport',{}).get('id'),
                         'departure_local':x.get('departure_airport',{}).get('time'),
                         'arrival_local':x.get('arrival_airport',{}).get('time')}
                        for x in offer.get('flights',[])]}

def safe_html_evidence(data,key):
    url=data.get('search_metadata',{}).get('raw_html_file','')
    parsed=urllib.parse.urlparse(url)
    if parsed.scheme!='https' or parsed.hostname not in ('serpapi.com','www.serpapi.com') or not parsed.path.startswith('/searches/'):
        return []
    try:
        with urllib.request.build_opener(NoRedirect).open(url,timeout=30) as r:raw=r.read(4_000_000).decode('utf8','replace')
        raw=re.sub(r'<(script|style)\b.*?</\1>',' ',raw,flags=re.S|re.I)
        text=html.unescape(re.sub('<[^>]+>',' ',raw));text=re.sub(r'\s+',' ',text).replace(key,'[REDACTED]')
        snippets=[]
        for pattern in [r'Prices include.{0,180}',r'Prices are.{0,180}',r'Priserna.{0,180}',r'\b(?:1|2) adults?\b.{0,70}',r'\b(?:1|2) vuxna?\b.{0,70}']:
            snippets.extend(re.findall(pattern,text,re.I)[:3])
        return snippets[:10]
    except Exception:return ['HTML evidence unavailable; do not infer price scope.']

def details(key,fetch=request_json,evidence=safe_html_evidence):
    if not key:return {'status':'WAITING_FOR_SECRET','search_requests':0}
    before=verify_free(fetch('account.json',{'api_key':key}))
    if before<3:raise ProbeError('Stopped: need at least 3 remaining monthly free searches for bounded details proof.')
    count=0
    def search(extra=None):
        nonlocal count
        if count>=3:raise ProbeError('Stopped at 3-search proof limit.')
        count+=1
        data=fetch('search.json',{**QUERY,'no_cache':'false',**(extra or {}),'api_key':key})
        if data.get('search_metadata',{}).get('status')!='Success':raise ProbeError('Details search failed; raw provider error suppressed.')
        return data
    base=search()
    for field in ('departure_id','arrival_id','outbound_date','return_date','adults','currency'):
        if str(base.get('search_parameters',{}).get(field))!=QUERY[field]:raise ProbeError('Details response request mismatch.')
    choices=offers(base)
    if not choices:raise ProbeError('No priced flight available for details proof.')
    outbound=min(choices,key=lambda x:x['price'])
    result={'version':VERSION,'status':'OUTBOUND_ONLY','request':QUERY,'free_searches_before':before,
            'outbound':minimal_offer(outbound),'scope_evidence':evidence(base,key),
            'checked_baggage_23kg_each':'UNVERIFIED','price_scope':'UNVERIFIED'}
    token=outbound.get('departure_token')
    if token:
        returns=search({'departure_token':token})
        candidates=offers(returns)
        if candidates:
            selected=min(candidates,key=lambda x:x['price'])
            result['return']=minimal_offer(selected)
            result['return_scope_evidence']=evidence(returns,key)
            booking=selected.get('booking_token')
            if booking:
                data=search({'booking_token':booking})
                result['status']='BOOKING_DETAILS_RECEIVED'
                result['booking_scope_evidence']=evidence(data,key)
                result['baggage_policies']=data.get('baggage_prices',{})
                result['booking_options']=[]
                for entry in data.get('booking_options',[])[:6]:
                    for part in ('together','departing','returning'):
                        option=entry.get(part)
                        if isinstance(option,dict):
                            result['booking_options'].append({
                                'part':part,'seller':option.get('book_with'),
                                'airline':option.get('airline'), 'price_field':option.get('price'),
                                'fare':option.get('option_title'), 'baggage_policies':option.get('baggage_prices',[]),
                                'extensions':option.get('extensions',[])})
    after=fetch('account.json',{'api_key':key})
    verify_free(after)
    result.update(search_requests=count,free_searches_after=after.get('plan_searches_left'))
    # Do not include raw responses, account details, URL tokens or booking payloads.
    return result

if __name__=='__main__':
    try:
        key=os.environ.get('FLYG_SERPAPI_KEY','')
        result=details(key)
        safe=json.dumps(result,ensure_ascii=False,indent=2).replace(key,'[REDACTED]') if key else json.dumps(result)
        print(safe)
        if os.environ.get('GITHUB_STEP_SUMMARY'):
            with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as f:f.write('# Flyg fare and baggage proof\n\n```json\n'+safe+'\n```\n')
    except ProbeError as e:
        print(str(e));raise SystemExit(1)
    except Exception:
        print('Details proof stopped; provider details suppressed to protect key.');raise SystemExit(1)

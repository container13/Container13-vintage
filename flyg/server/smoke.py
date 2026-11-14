"""Bounded runtime check. No raw provider, secrets or selection tokens in output."""
import json,os,urllib.request,urllib.error
PHASE='startup'

def main():
    global PHASE
    url=os.environ.get('FLYG_RUNTIME_URL','https://flyg-search-api.mangaj73.workers.dev')
    assert url=='https://flyg-search-api.mangaj73.workers.dev'
    PHASE='health'
    with urllib.request.urlopen(url+'/health',timeout=30) as r:health=json.load(r)
    assert health['configured'] is True and health['enabled'] is True
    print('Runtime endpoint:',url)
    config=json.load(open('flyg/server/smoke-request.json'))
    if config.get('mode')=='calendar':
        assert health['version']=='0.1.21'
        for destination in ['BGY','ZRH,GVA,INN']:
            PHASE='calendar'
            query={'stage':'calendar','destination':destination,'from':'2027-03-13','to':'2027-03-21','nights':4}
            req=urllib.request.Request(url+'/search',data=json.dumps(query).encode(),headers={'Origin':'https://container13.se','Content-Type':'application/json'})
            with urllib.request.urlopen(req,timeout=90) as r:data=json.load(r)
            assert data['stage']=='calendar' and data['adults']==2 and data['currency']=='SEK'
            assert data['prices']
            assert all('2027-03-13'<=row['outbound']<='2027-03-21' and ( __import__('datetime').date.fromisoformat(row['return'])-__import__('datetime').date.fromisoformat(row['outbound'])).days==4 for row in data['prices'])
            print('PASS calendar',destination,'dated quotes',len(data['prices']),'first departure',min(row['outbound'] for row in data['prices']),'minimum',min(row['quotedPriceSEK'] for row in data['prices']),'cached',data['cached'])
        print('PASS bounded calendar smoke; two requests; fixed4nights/two adults/SEK')
        return
    query={'stage':'outbound','destination':'ZRH','outbound':'2027-03-14','return':'2027-03-18'}
    count=0
    for stage in ['outbound','returns','details']:
        PHASE=stage
        req=urllib.request.Request(url+'/search',data=json.dumps(query).encode(),headers={'Origin':'https://container13.se','Content-Type':'application/json'})
        with urllib.request.urlopen(req,timeout=90) as r: data=json.load(r)
        count+=1
        assert data['stage']==stage and data['adults']==2 and data['currency']=='SEK'
        if stage=='details':
            assert all(o['baggageStatus']=='UNVERIFIED' for o in data['options'])
            print('PASS',stage,'options',len(data['options']),'cached',data['cached'])
        else:
            flights=data['flights'];assert flights
            print('PASS',stage,'flights',len(flights),'cached',data['cached'])
            chosen=min((f for f in flights if f.get('selection')),key=lambda f:f['quotedPriceSEK'])
            query={'stage':'returns' if stage=='outbound' else 'details','selection':chosen['selection']}
    print('PASS bounded runtime smoke; stage requests',count,'no booking or payment')

if __name__=='__main__':
    try:main()
    except urllib.error.HTTPError as error:
        print('Runtime smoke FAIL at',PHASE,'HTTP',error.code)
        try:
            code=json.loads(error.read()).get('error')
            if code in ['SEARCH_FAILED','APP_QUOTA_REACHED','FREE_QUOTA_UNAVAILABLE','PROVIDER_UNAVAILABLE','SEARCH_NOT_ENABLED','INVALID_DATES','PROVIDER_CONTEXT_MISMATCH']:
                print('Safe runtime error:',code)
        except Exception:pass
        raise SystemExit(1)
    except Exception:
        print('Runtime smoke FAIL at',PHASE,'details suppressed to protect credentials');raise SystemExit(1)

"""Bounded runtime check. No raw provider, secrets or selection tokens in output."""
import json,os,urllib.request

def main():
    account=os.environ['CLOUDFLARE_ACCOUNT_ID'];token=os.environ['CLOUDFLARE_API_TOKEN']
    req=urllib.request.Request(f'https://api.cloudflare.com/client/v4/accounts/{account}/workers/subdomain',headers={'Authorization':'Bearer '+token})
    with urllib.request.urlopen(req,timeout=30) as r: cf=json.load(r)
    assert cf['success'] is True
    sub=cf['result']['subdomain']
    assert sub and all(c.isalnum() or c=='-' for c in sub)
    url='https://flyg-search-api.'+sub+'.workers.dev'
    with urllib.request.urlopen(url+'/health',timeout=30) as r:health=json.load(r)
    assert health=={'version':'0.1.11','configured':True,'enabled':True}
    print('Runtime endpoint:',url)
    query={'stage':'outbound','destination':'ZRH','outbound':'2027-03-14','return':'2027-03-18'}
    count=0
    for stage in ['outbound','returns','details']:
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
    except Exception:
        print('Runtime smoke FAIL; details suppressed to protect credentials');raise SystemExit(1)

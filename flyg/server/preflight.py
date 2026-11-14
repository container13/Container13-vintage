"""Read-only deployment feasibility check. Never print credentials or account responses."""
import json
import os
import urllib.request

def main():
    token=os.environ.get('CLOUDFLARE_API_TOKEN','')
    account=os.environ.get('CLOUDFLARE_ACCOUNT_ID','')
    if not token or not account:
        print('BLOCKED: existing Cloudflare deployment credentials missing'); return 1
    url=f'https://api.cloudflare.com/client/v4/accounts/{account}/subscriptions'
    req=urllib.request.Request(url,headers={'Authorization':'Bearer '+token})
    try:
        with urllib.request.urlopen(req,timeout=30) as response:
            data=json.load(response)
    except Exception:
        print('BLOCKED: cannot verify Cloudflare subscriptions with existing token; no deployment attempted'); return 1
    if data.get('success') is not True or not isinstance(data.get('result'),list):
        print('BLOCKED: subscription verification unavailable'); return 1
    active=[s for s in data['result'] if s.get('state') not in ('Cancelled','Expired','Failed')]
    # Conservative: stop for any non-zero or unknown account subscription price.
    if any(not isinstance(s.get('price'),(int,float)) or s['price']!=0 for s in active):
        print('BLOCKED: account subscription has non-zero or unknown price; no changes or upgrade'); return 1
    print('PASS: existing Cloudflare credentials accessible; account subscriptions have zero price; no changes made')
    return 0

if __name__=='__main__': raise SystemExit(main())

"""One request for one adult on the already observed exact KLM round trip."""
import json
from serpapi_probe import QUERY,ProbeError,request_json,verify_free
from serpapi_details import minimal_offer
PINNED={
 'outbound':[
 {'flight_number':'KL1214','departure_id':'ARN','arrival_id':'AMS','date':'2027-03-14'},
 {'flight_number':'KL1919','departure_id':'AMS','arrival_id':'ZRH','date':'2027-03-14'}],
 'return':[
 {'flight_number':'KL1922','departure_id':'ZRH','arrival_id':'AMS','date':'2027-03-18'},
 {'flight_number':'KL1225','departure_id':'AMS','arrival_id':'ARN','date':'2027-03-18'}]}
def scope_probe(key,fetch=request_json):
 if not key:return {'status':'WAITING_FOR_SECRET','search_requests':0}
 before=verify_free(fetch('account.json',{'api_key':key}))
 data=fetch('search.json',{**QUERY,'adults':'1','no_cache':'false','selected_flights_json':json.dumps(PINNED,separators=(',',':')),'api_key':key})
 if data.get('search_metadata',{}).get('status')!='Success':raise ProbeError('Pinned one-adult comparison did not succeed.')
 if str(data.get('search_parameters',{}).get('adults'))!='1':raise ProbeError('One-adult comparison input mismatch.')
 options=[]
 for entry in data.get('booking_options',[]):
  part=entry.get('together',{})
  if part.get('book_with')=='KLM' and part.get('airline') is True:
   options.append({'seller':'KLM','price_field':part.get('price'),'baggage_policies':part.get('baggage_prices',[])})
 after=fetch('account.json',{'api_key':key})
 verify_free(after)
 return {'version':'scope-0.1.0','status':'PINNED_COMPARISON_RECEIVED','search_requests':1,
         'previous_two_adult_KLM_price_field':3680,'one_adult_options':options,
         'selected_flights':[minimal_offer(x) for x in data.get('selected_flights',[])],
         'baggage_policies':data.get('baggage_prices',{}),
         'free_searches_before':before,'free_searches_after':after.get('plan_searches_left'),
         'checked_baggage_23kg_each':'UNVERIFIED'}

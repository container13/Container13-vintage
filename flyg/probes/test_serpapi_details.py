import unittest
from serpapi_details import details
from serpapi_probe import QUERY,ProbeError
class DetailsTests(unittest.TestCase):
 def test_bounded_flow_never_returns_key_or_booking_payload(self):
  calls=[]
  def fetch(path,params):
   calls.append((path,params))
   if path=='account.json':return {'plan_id':'free','plan_monthly_price':0,'plan_searches_left':100}
   if params.get('booking_token'):return {'search_metadata':{'status':'Success'},'booking_options':[{'together':{'price':100,'book_with':'fixture','booking_request':{'post_data':'fixture-secret'},'baggage_prices':['No checked bags']}}]}
   if params.get('departure_token'):return {'search_metadata':{'status':'Success'},'best_flights':[{'price':100,'booking_token':'private-booking-token'}]}
   return {'search_metadata':{'status':'Success'},'search_parameters':QUERY,'best_flights':[{'price':100,'departure_token':'private-return-token'}]}
  r=details('fixture-secret',fetch,lambda *_:[])
  self.assertEqual(r['search_requests'],3)
  for value in ['fixture-secret','private-booking-token','private-return-token','post_data']:self.assertNotIn(value,str(r))
  self.assertEqual(r['checked_baggage_23kg_each'],'UNVERIFIED')
 def test_no_secret_no_requests(self):
  self.assertEqual(details('',lambda *_:self.fail('network'))['search_requests'],0)
 def test_low_quota_stops_before_search(self):
  calls=[]
  def fetch(path,params):calls.append(path);return {'plan_id':'free','plan_monthly_price':0,'plan_searches_left':2}
  with self.assertRaises(ProbeError):details('fixture',fetch)
  self.assertEqual(calls,['account.json'])

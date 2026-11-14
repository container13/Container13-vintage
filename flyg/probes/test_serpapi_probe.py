import unittest
from serpapi_probe import probe, ProbeError

class ProbeTests(unittest.TestCase):
    def test_missing_key_never_calls_provider(self):
        self.assertEqual(probe('', lambda *a: self.fail('network called'))['searches_sent'], 0)
    def test_paid_plan_stops_before_search(self):
        calls=[]
        def fetch(path, params):
            calls.append(path)
            return dict(plan_id='starter', plan_monthly_price=25, plan_searches_left=10)
        with self.assertRaises(ProbeError): probe('fixture-secret', fetch)
        self.assertEqual(calls,['account.json'])
    def test_exhausted_free_quota_stops_before_search(self):
        with self.assertRaises(ProbeError):
            probe('fixture-secret', lambda *a: dict(plan_id='free',plan_monthly_price=0,plan_searches_left=0))
    def test_single_search_and_no_key_or_raw_response_in_report(self):
        calls=[]
        from serpapi_probe import QUERY
        def fetch(path, params):
            calls.append(path)
            if path=='account.json':return dict(plan_id='free',plan_monthly_price=0,plan_searches_left=200,api_key='fixture-secret')
            return dict(search_metadata={'status':'Success'},search_parameters=QUERY,best_flights=[{'price':3674}],api_key='fixture-secret')
        result=probe('fixture-secret',fetch)
        self.assertEqual(calls,['account.json','search.json'])
        self.assertNotIn('fixture-secret',str(result))
        self.assertEqual(result['checked_baggage_23kg_each'],'UNVERIFIED')
    def test_wrong_traveler_count_is_not_accepted(self):
        from serpapi_probe import QUERY
        def fetch(path, params):
            if path=='account.json':return dict(plan_id='free',plan_monthly_price=0,plan_searches_left=200)
            return dict(search_metadata={'status':'Success'},search_parameters={**QUERY,'adults':1})
        with self.assertRaises(ProbeError):probe('fixture-secret',fetch)

if __name__ == '__main__':unittest.main()

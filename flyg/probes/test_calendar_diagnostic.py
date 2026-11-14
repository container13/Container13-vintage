import unittest
from calendar_diagnostic import diagnostic,safe_message,QUERY
from serpapi_probe import ProbeError
class CalendarDiagnosticTests(unittest.TestCase):
    def test_key_and_urls_and_tokens_removed(self):
        value=safe_message('KEY https://x.test/?api_key=KEY '+'A'*60,'KEY')
        self.assertNotIn('KEY',value);self.assertNotIn('https:',value);self.assertNotIn('A'*40,value)
    def test_paid_account_sends_no_search(self):
        calls=[]
        def fetch(path,params):
            calls.append(path);return dict(plan_id='paid',plan_monthly_price=1,plan_searches_left=10)
        with self.assertRaises(ProbeError):diagnostic('KEY',fetch)
        self.assertEqual(calls,['account.json'])
    def test_exactly_one_fixed_search_and_only_safe_fields(self):
        calls=[]
        def fetch(path,params):
            calls.append((path,params))
            if path=='account.json':return dict(plan_id='free',plan_monthly_price=0,plan_searches_left=1)
            return {'search_metadata':{'status':'Success'},'search_parameters':QUERY,'error':"Google hasn't returned any results for this query.",'private':'KEY'}
        result=diagnostic('KEY',fetch)
        self.assertEqual(result['search_requests'],1);self.assertTrue(result['context_match'])
        self.assertEqual(len(calls),2);self.assertNotIn('private',result)

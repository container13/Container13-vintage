#!/usr/bin/env python3
"""Regression tests: deliberately corrupt release identity and ensure rejection."""
import importlib.util,pathlib,unittest
source=pathlib.Path(__file__).with_name('sync-release.py')
spec=importlib.util.spec_from_file_location('sync_release',source)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
class ReleaseSyncTests(unittest.TestCase):
    def test_repairs_outdated_meta(self):
        original='<meta name="remember-release" content="remember-0.1.172">'
        self.assertIn('remember-0.1.177',module.replacements(original,'0.1.177'))
    def test_repairs_outdated_cache(self):
        original='<script src="./auto-update.js?v=0.1.172"></script><script src="./remember-version.js?v=0.1.171"></script>'
        actual=module.replacements(original,'0.1.177')
        self.assertNotIn('0.1.172',actual)
        self.assertNotIn('0.1.171',actual)
        self.assertEqual(actual.count('v=0.1.177'),2)
    def test_rejects_unexpected_version(self):
        self.assertNotEqual(module.replacements('<meta name="remember-release" content="remember-0.1.172">','0.1.177'),'<meta name="remember-release" content="remember-0.1.172">')
if __name__=='__main__': unittest.main()

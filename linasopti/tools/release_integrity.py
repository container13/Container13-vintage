#!/usr/bin/env python3
"""Static Lina release-integrity gate. Read-only; never runs research."""
from pathlib import Path
import re, sys, json
ROOT=Path(__file__).resolve().parents[1]
fails=[]; checks=[]
def check(name, ok, detail):
    checks.append({"id":name,"pass":bool(ok),"detail":detail})
    if not ok: fails.append(name)
def read(p): return (ROOT/p).read_text(encoding="utf-8")
version=read("version.js")
mrel=re.search(r"const\\s+RELEASE\\s*=\\s*['\"](V[0-9.]+)['\"]",version)
mcache=re.search(r"const\\s+CACHE\\s*=\\s*['\"]([0-9.]+)['\"]",version)
release=mrel.group(1) if mrel else ""; cache=mcache.group(1) if mcache else ""
check("version_source", bool(release and cache and release=="V"+cache), release+"/"+cache)
index=read("index.html"); app=read("app.js"); gate=read("release-gate.js")
tokens=re.findall(r"[?&]v=([0-9]+(?:\.[0-9]+){2})",index)
check("index_cache_tokens", bool(tokens) and all(x==cache for x in tokens), str(sorted(set(tokens))))
check("release_gate_current", ("REQUIRED_RELEASE='"+release+"'" in gate or 'REQUIRED_RELEASE="'+release+'"' in gate) and ("REQUIRED_CACHE='"+cache+"'" in gate or 'REQUIRED_CACHE="'+cache+'"' in gate), "release-gate matches version.js")
check("gen16_historical_auth", "approvedRelease==='V0.3.95'" in gate, "Gen16 research authorization remains V0.3.95")
check("trade_label_off", "Handel AV" in index or "Handel AV" in app, "Handel AV label present")
wrangler=read("worker/wrangler.jsonc")
check("worker_source_explicit", 'WORKER_PENDING_RUNTIME_REPORT.js' in wrangler, "wrangler deploy source")
gen8_summary=ROOT/"evidence/2026-09-29/LINAS_GEN8_RESEARCH_SUMMARY_2026-09-29.json"
check("gen8_frozen_evidence", gen8_summary.exists() and gen8_summary.stat().st_size>0, "immutable Gen8 summary evidence present")
for n in range(9,17):
    hay=""
    for p in [f"gen{n}-workflow.js",f"gen{n}-workflow-data.js",f"gen{n}-engine.js",f"gen{n}-generation-engine.js"]:
        q=ROOT/p
        if q.exists(): hay+=q.read_text(encoding="utf-8",errors="ignore")+"\\n"
    check(f"gen{n}_present", bool(hay), f"Gen{n} implementation located")
manual=read("LINA_SYSTEM_MANUAL.md"); rules=read("LINA_MASTER_RULES.md")
check("manual_present", "SYSTEMMANUAL" in manual and "FIX → ROOT CAUSE" in manual, "authoritative manual")
check("meta_rule_present", "FIX → ROOT CAUSE" in rules, "permanent learning rule")
result={"schema":"LINA-STATIC-RELEASE-INTEGRITY-1","release":release,"cache":cache,"status":"FAIL" if fails else "PASS","failed":fails,"checks":checks}
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(1 if fails else 0)

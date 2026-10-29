#!/usr/bin/env python3
"""Read-only Alpaca SPY daily-bar acquisition preflight. No trades or strategy runs.

Usage: APCA_API_KEY_ID=... APCA_API_SECRET_KEY=... python3 audit_spy_bars.py --output-dir /secure/path
Never commit the downloaded payload; check vendor usage rights first.
"""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

BASE = "https://data.alpaca.markets/v2/stocks/SPY/bars"
PARAMS = {"timeframe": "1Day", "start": "2020-01-01", "end": "2025-01-01",
          "feed": "sip", "adjustment": "raw", "sort": "asc", "limit": "10000"}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--output-dir", required=True)
    args = ap.parse_args()
    key, secret = os.environ.get("APCA_API_KEY_ID"), os.environ.get("APCA_API_SECRET_KEY")
    if not key or not secret:
        raise SystemExit("BLOCKED_AUTH: missing APCA_API_KEY_ID/APCA_API_SECRET_KEY; no request sent")
    dest = Path(args.output_dir)
    dest.mkdir(parents=True, exist_ok=True)
    if any(dest.iterdir()):
        raise SystemExit("BLOCKED_OUTPUT: output directory must be empty; no overwrite")
    headers = {"APCA-API-KEY-ID": key, "APCA-API-SECRET-KEY": secret, "Accept": "application/json"}
    pages, allbars, token, seen = [], [], None, set()
    while True:
        params = dict(PARAMS)
        if token: params["page_token"] = token
        req = Request(BASE + "?" + urlencode(params), headers=headers, method="GET")
        try:
            with urlopen(req, timeout=30) as response:
                payload = response.read()
        except HTTPError as e:
            raise SystemExit("BLOCKED_HTTP: Alpaca HTTP " + str(e.code)) from None
        except URLError as e:
            raise SystemExit("BLOCKED_NETWORK: Alpaca endpoint unreachable") from None
        parsed = json.loads(payload)
        bars = parsed.get("bars")
        if not isinstance(bars, list):
            raise SystemExit("BLOCKED_SCHEMA: expected single-symbol bars list")
        allbars.extend(bars)
        pages.append({"page": len(pages)+1, "bytes": len(payload),
                      "sha256": hashlib.sha256(payload).hexdigest(), "rows": len(bars)})
        token = parsed.get("next_page_token")
        if not token: break
        if token in seen: raise SystemExit("BLOCKED_PAGINATION: repeated next_page_token")
        seen.add(token)
        if len(pages) >= 100: raise SystemExit("BLOCKED_PAGINATION: more than 100 pages")
    dates = [str(b.get("t", ""))[:10] for b in allbars]
    valid = all(isinstance(b, dict) and all(k in b for k in ("t","o","h","l","c","v"))
                for b in allbars)
    if not valid or len(dates) != len(set(dates)) or dates != sorted(dates):
        raise SystemExit("BLOCKED_DATA: malformed/duplicate/unsorted bars")
    data = json.dumps(allbars, sort_keys=True, separators=(",", ":")).encode()
    report = {"source": BASE, "params": PARAMS, "retrieved_utc": dt.datetime.now(dt.timezone.utc).isoformat(),
              "pages": pages, "bars": len(allbars), "first": dates[0] if dates else None,
              "last": dates[-1] if dates else None, "canonical_sha256": hashlib.sha256(data).hexdigest(),
              "status": "ACQUIRED_NOT_PIT_VALIDATED", "note": "Do not backtest before session, adjustment, availability and rights review"}
    (dest/"spy_raw_bars.json").write_bytes(data)
    (dest/"spy_preflight_report.json").write_text(json.dumps(report, indent=2)+"\n")
    print(json.dumps({k: report[k] for k in ("status","bars","first","last","canonical_sha256")}, indent=2))

if __name__ == "__main__": main()

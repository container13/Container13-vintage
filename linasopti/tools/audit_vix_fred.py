#!/usr/bin/env python3
"""Read-only Cboe VIX History vs FRED VIXCLS comparison. Python stdlib only.

Usage:
 python3 linasopti/tools/audit_vix_fred.py /path/VIX_History.csv /path/VIXCLS.csv
Download FRED's official CSV via https://fred.stlouisfed.org/graph/fredgraph.csv?id=VIXCLS&cosd=2020-01-01&coed=2024-12-31
Does not assume FRED is source-independent (both derive from Cboe).
"""
import csv
import hashlib
import json
import sys
from datetime import date

START, END = date(2020, 1, 1), date(2024, 12, 31)

def read_cboe(path):
    raw = open(path, "rb").read()
    result = {}
    for row in csv.DictReader(raw.decode("utf-8-sig").splitlines()):
        d = date.fromisoformat(row["DATE"]) if "-" in row["DATE"] else __import__("datetime").datetime.strptime(row["DATE"], "%m/%d/%Y").date()
        if START <= d <= END:
            if d.isoformat() in result:
                raise ValueError("duplicate Cboe date: " + str(d))
            result[d.isoformat()] = float(row["CLOSE"])
    return result, hashlib.sha256(raw).hexdigest()

def read_fred(path):
    result = {}
    with open(path, newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            ds = row.get("observation_date") or row.get("DATE")
            value = row.get("VIXCLS")
            if ds and value and value != "." and START <= date.fromisoformat(ds) <= END:
                if ds in result:
                    raise ValueError("duplicate FRED date: " + ds)
                result[ds] = float(value)
    return result

def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    cboe, digest = read_cboe(sys.argv[1])
    fred = read_fred(sys.argv[2])
    both = sorted(cboe.keys() & fred.keys())
    different = [{"date": d, "cboe": cboe[d], "fred": fred[d]} for d in both if round(cboe[d] - fred[d], 2) != 0]
    report = {
        "period": "2020-01-01..2024-12-31",
        "cboe_sha256": digest,
        "cboe_rows": len(cboe), "fred_numeric_rows": len(fred),
        "shared_dates": len(both), "exact_2dp_matches": len(both) - len(different),
        "mismatches": different,
        "only_cboe": sorted(cboe.keys() - fred.keys()),
        "only_fred": sorted(fred.keys() - cboe.keys()),
        "limitations": "Close agreement is not point-in-time availability or independent provenance proof."
    }
    print(json.dumps(report, indent=2, ensure_ascii=False))
    if different or report["only_cboe"] or report["only_fred"]:
        sys.exit(2)

if __name__ == "__main__":
    main()

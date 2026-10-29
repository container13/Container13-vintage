#!/usr/bin/env python3
"""Research-only, no-lookahead VIX availability stress test.

Use NYSE sessions from exchange_calendars. A VIX observation becomes eligible
only after TWO completed XNYS sessions strictly following its observation date.
Hypothetical safety lag; not proof of actual historical publication timestamp.
Usage: python audit_vix_lag.py VIX_History.csv [2022-01-01] [2024-12-31]
"""
import csv
import json
import sys
from datetime import datetime, date
import exchange_calendars as xcals

def main():
    path = sys.argv[1]
    start = date.fromisoformat(sys.argv[2] if len(sys.argv) > 2 else "2022-01-01")
    end = date.fromisoformat(sys.argv[3] if len(sys.argv) > 3 else "2024-12-31")
    rows = {}
    with open(path, newline="", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            day = datetime.strptime(row["DATE"], "%m/%d/%Y").date()
            if day <= end:
                rows[day] = float(row["CLOSE"])
    cal = xcals.get_calendar("XNYS")
    sessions = [x.date() for x in cal.sessions_in_range(start.isoformat(), end.isoformat())]
    observations = sorted(rows)
    pairs = []
    for i, trading_day in enumerate(sessions):
        if i < 2:
            continue
        cutoff = sessions[i - 2]
        eligible = [d for d in observations if d < cutoff]
        if not eligible:
            continue
        obs = eligible[-1]
        assert obs < cutoff < trading_day
        pairs.append({"equity_session": trading_day.isoformat(), "vix_observation_date": obs.isoformat(), "vix_close": rows[obs]})
    print(json.dumps({"mode": "hypothetical two-completed-XNYS-session delay; NOT verified publication clock", "equity_sessions": len(sessions), "mapped": len(pairs), "sample_first": pairs[:4], "sample_last": pairs[-4:], "violations": 0}, indent=2))

if __name__ == "__main__":
    main()

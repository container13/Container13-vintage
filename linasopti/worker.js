const ALLOWED_ORIGINS = new Set([
  "https://container13.se",
  "https://www.container13.se",
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.has(origin)
    ? origin
    : "https://container13.se";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
    "Cache-Control": "no-store",
  };
}

function json(data, status = 200, request) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request),
    },
  });
}

async function handleEodBars(url, env, request) {
  if (!env.EODHD_API_TOKEN) {
    return json(
      {
        ok: false,
        error: "EODHD är inte anslutet i Worker (saknar EODHD_API_TOKEN).",
      },
      503,
      request
    );
  }

  const symbols = (url.searchParams.get("symbols") || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const timeframe = url.searchParams.get("timeframe") || "1Day";
  const from = url.searchParams.get("start") || "";
  const to = url.searchParams.get("end") || "";

  if (timeframe !== "1Day") {
    return json(
      { ok: false, error: "V0.31 EODHD stöder endast dagsdata." },
      400,
      request
    );
  }

  if (
    !symbols.length ||
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to)
  ) {
    return json(
      { ok: false, error: "symbols, start och end krävs." },
      400,
      request
    );
  }

  if (symbols.length > 25) {
    return json(
      { ok: false, error: "Max 25 symboler per V0.31-anrop." },
      400,
      request
    );
  }

  const rows = [];
  const errors = [];

  // Medvetet sekventiellt i första versionen: enklare felsökning
  // och snällare mot EODHD:s rate limits.
  for (const symbol of symbols) {
    const api = new URL(
      `https://eodhd.com/api/eod/${encodeURIComponent(symbol)}`
    );

    api.searchParams.set("api_token", env.EODHD_API_TOKEN);
    api.searchParams.set("fmt", "json");
    api.searchParams.set("period", "d");
    api.searchParams.set("order", "a");
    api.searchParams.set("from", from);
    api.searchParams.set("to", to);

    try {
      const response = await fetch(api.toString(), {
        headers: { Accept: "application/json" },
      });

      const text = await response.text();
      let body;

      try {
        body = JSON.parse(text);
      } catch (_) {
        errors.push({
          symbol,
          status: response.status,
          error: "Ogiltigt JSON-svar från EODHD",
        });
        continue;
      }

      if (!response.ok || !Array.isArray(body)) {
        errors.push({
          symbol,
          status: response.status,
          error: body?.message || body?.error || "EODHD-data kunde inte hämtas",
        });
        continue;
      }

      for (const bar of body) {
        const o = Number(bar.open);
        const h = Number(bar.high);
        const l = Number(bar.low);
        const c = Number(bar.close);
        const v = Number(bar.volume || 0);

        if (!bar.date || ![o, h, l, c].every(Number.isFinite)) {
          continue;
        }

        rows.push({
          t: bar.date,
          symbol,
          o,
          h,
          l,
          c,
          v,
        });
      }
    } catch (error) {
      errors.push({
        symbol,
        status: 0,
        error: String(error),
      });
    }
  }

  rows.sort((a, b) => {
    if (a.t === b.t) {
      return a.symbol.localeCompare(b.symbol);
    }
    return a.t.localeCompare(b.t);
  });

  return json(
    {
      ok: true,
      source: "EODHD",
      provider: "eodhd",
      timeframe: "1Day",
      symbols,
      rows,
      rowCount: rows.length,
      errors,
    },
    200,
    request
  );
}


async function handleYahooBars(url, env, request) {
  const symbols = (url.searchParams.get("symbols") || "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const timeframe = url.searchParams.get("timeframe") || "1Day";
  const from = url.searchParams.get("start") || "";
  const to = url.searchParams.get("end") || "";

  if (timeframe !== "1Day") {
    return json(
      { ok:false, error:"Yahoo-rutten stöder endast dagsdata." },
      400,
      request
    );
  }

  if (
    !symbols.length ||
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to)
  ) {
    return json(
      { ok:false, error:"symbols, start och end krävs." },
      400,
      request
    );
  }

  if (symbols.length > 25) {
    return json(
      { ok:false, error:"Max 25 symboler per Yahoo-anrop." },
      400,
      request
    );
  }

  const period1 = Math.floor(Date.parse(from + "T00:00:00Z") / 1000);
  const period2 = Math.floor(Date.parse(to + "T23:59:59Z") / 1000) + 1;
  const rows = [];
  const errors = [];

  for (const symbol of symbols) {
    try {
      const api = new URL(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}`
      );
      api.searchParams.set("period1", String(period1));
      api.searchParams.set("period2", String(period2));
      api.searchParams.set("interval", "1d");
      api.searchParams.set("includePrePost", "false");
      api.searchParams.set("events", "div,splits");

      const response = await fetch(api.toString(), {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 Linas-Opti-Historical-Research"
        }
      });

      const text = await response.text();
      let body;
      try { body = JSON.parse(text); }
      catch (_) {
        errors.push({symbol,status:response.status,error:"Ogiltigt JSON-svar från Yahoo"});
        continue;
      }

      const result = body?.chart?.result?.[0];
      const err = body?.chart?.error;
      if (!response.ok || !result) {
        errors.push({
          symbol,
          status: response.status,
          error: err?.description || err?.code || "Yahoo-data kunde inte hämtas"
        });
        continue;
      }

      const ts = result.timestamp || [];
      const q = result.indicators?.quote?.[0] || {};
      for (let i=0;i<ts.length;i++) {
        const o=Number(q.open?.[i]);
        const h=Number(q.high?.[i]);
        const l=Number(q.low?.[i]);
        const c=Number(q.close?.[i]);
        const v=Number(q.volume?.[i] || 0);
        if (![o,h,l,c].every(Number.isFinite)) continue;
        rows.push({
          t:new Date(ts[i]*1000).toISOString(),
          symbol,
          o,h,l,c,v
        });
      }
    } catch (error) {
      errors.push({symbol,status:0,error:String(error)});
    }
  }

  rows.sort((a,b)=>a.t.localeCompare(b.t)||a.symbol.localeCompare(b.symbol));
  return json(
    {
      ok:true,
      source:"Yahoo Finance chart",
      provider:"yahoo",
      timeframe:"1Day",
      symbols,
      rows,
      rowCount:rows.length,
      errors
    },
    200,
    request
  );
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    if (request.method !== "GET") {
      return json(
        { ok: false, error: "Method not allowed" },
        405,
        request
      );
    }

    const url = new URL(request.url);

    // Hälsokontroll
    if (url.pathname === "/" || url.pathname === "/health") {
      return json(
        {
          ok: true,
          service: "Linas Opti API",
          version: "0.58.8",
          mode: "paper",
          tradingEnabled: false,
          alpacaConfigured: Boolean(
            env.APCA_API_KEY_ID && env.APCA_API_SECRET_KEY
          ),
          eodhdConfigured: Boolean(env.EODHD_API_TOKEN),
          yahooHistoricalConfigured: true,
        },
        200,
        request
      );
    }

    // Historiska dagsbars för USA utan API-nyckel via Yahoo chart.
    if (url.pathname === "/yahoo-bars") {
      return handleYahooBars(url, env, request);
    }

    // Historiska Alpaca-bars för USA
    if (url.pathname === "/bars") {
      const symbols = (url.searchParams.get("symbols") || "")
        .toUpperCase()
        .replace(/\s/g, "");

      const timeframe = url.searchParams.get("timeframe") || "1Day";
      const start = url.searchParams.get("start") || "";
      const end = url.searchParams.get("end") || "";

      if (!symbols) {
        return json(
          { ok: false, error: "symbols saknas" },
          400,
          request
        );
      }

      if (!["1Day", "5Min"].includes(timeframe)) {
        return json(
          {
            ok: false,
            error: "Endast 1Day och 5Min stöds just nu",
          },
          400,
          request
        );
      }

      if (!env.APCA_API_KEY_ID || !env.APCA_API_SECRET_KEY) {
        return json(
          {
            ok: false,
            error: "Alpaca är inte anslutet i Worker.",
          },
          503,
          request
        );
      }

      try {
        const rows = [];
        let pageToken = null;
        let pages = 0;

        do {
          const alpaca = new URL(
            "https://data.alpaca.markets/v2/stocks/bars"
          );

          alpaca.searchParams.set("symbols", symbols);
          alpaca.searchParams.set("timeframe", timeframe);
          alpaca.searchParams.set("feed", "iex");
          alpaca.searchParams.set("adjustment", "raw");
          alpaca.searchParams.set("limit", "10000");

          if (start) {
            const startValue = start.includes("T")
              ? start
              : `${start}T00:00:00Z`;
            alpaca.searchParams.set("start", startValue);
          }

          if (end) {
            const endValue = end.includes("T")
              ? end
              : `${end}T23:59:59Z`;
            alpaca.searchParams.set("end", endValue);
          }

          if (pageToken) {
            alpaca.searchParams.set("page_token", pageToken);
          }

          const response = await fetch(alpaca.toString(), {
            headers: {
              "APCA-API-KEY-ID": env.APCA_API_KEY_ID,
              "APCA-API-SECRET-KEY": env.APCA_API_SECRET_KEY,
            },
          });

          const text = await response.text();

          if (!response.ok) {
            return json(
              {
                ok: false,
                error: "Alpaca svarade med ett fel",
                status: response.status,
                details: text,
              },
              response.status,
              request
            );
          }

          const data = JSON.parse(text);
          const bars = data.bars || {};

          for (const [symbol, symbolBars] of Object.entries(bars)) {
            for (const bar of symbolBars) {
              rows.push({
                t: bar.t,
                symbol,
                o: bar.o,
                h: bar.h,
                l: bar.l,
                c: bar.c,
                v: bar.v,
              });
            }
          }

          pageToken = data.next_page_token || null;
          pages++;

          // Extra säkerhetsstopp
          if (pages >= 100) {
            return json(
              {
                ok: false,
                error: "För många datasidor från Alpaca",
              },
              500,
              request
            );
          }
        } while (pageToken);

        rows.sort((a, b) => {
          if (a.t === b.t) {
            return a.symbol.localeCompare(b.symbol);
          }
          return a.t.localeCompare(b.t);
        });

        return json(
          {
            ok: true,
            source: "Alpaca",
            feed: "iex",
            timeframe,
            symbols: symbols.split(","),
            rows,
            rowCount: rows.length,
            pages,
          },
          200,
          request
        );
      } catch (error) {
        return json(
          {
            ok: false,
            error: "Kunde inte kontakta Alpaca",
            details: String(error),
          },
          500,
          request
        );
      }
    }

    // Historiska dagsbars för Sverige/Norden via EODHD
    if (url.pathname === "/eod-bars") {
      return handleEodBars(url, env, request);
    }

    return json(
      {
        ok: false,
        error: "Endpoint finns inte",
      },
      404,
      request
    );
  },
};

/* Linas Opti V0.31 – EODHD Worker patch
   Lägg denna logik i befintlig Cloudflare Worker. Behåll befintliga /health och /bars.
   Secret: EODHD_API_TOKEN
   Ingen handel. Endast historisk dagsdata.
*/

async function handleEodBars(url, env) {
  if (!env.EODHD_API_TOKEN) {
    return json({ ok:false, error:"EODHD är inte anslutet i Worker (saknar EODHD_API_TOKEN)." }, 503);
  }
  const symbols = (url.searchParams.get("symbols") || "")
    .split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
  const timeframe = url.searchParams.get("timeframe") || "1Day";
  const from = url.searchParams.get("start") || "";
  const to = url.searchParams.get("end") || "";
  if (timeframe !== "1Day") return json({ok:false,error:"V0.31 EODHD stöder endast dagsdata."},400);
  if (!symbols.length || !/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return json({ok:false,error:"symbols, start och end krävs."},400);
  }
  if (symbols.length > 25) return json({ok:false,error:"Max 25 symboler per V0.31-anrop."},400);

  const rows = [];
  const errors = [];
  // Medvetet sekventiellt i första versionen: lättare att felsöka och snällare mot rate limits.
  for (const symbol of symbols) {
    const api = new URL(`https://eodhd.com/api/eod/${encodeURIComponent(symbol)}`);
    api.searchParams.set("api_token", env.EODHD_API_TOKEN);
    api.searchParams.set("fmt", "json");
    api.searchParams.set("period", "d");
    api.searchParams.set("order", "a");
    api.searchParams.set("from", from);
    api.searchParams.set("to", to);
    try {
      const r = await fetch(api.toString(), { headers:{"Accept":"application/json"} });
      const body = await r.json();
      if (!r.ok || !Array.isArray(body)) {
        errors.push({symbol,status:r.status});
        continue;
      }
      for (const b of body) {
        const o=Number(b.open),h=Number(b.high),l=Number(b.low),c=Number(b.close),v=Number(b.volume||0);
        if (!b.date || ![o,h,l,c].every(Number.isFinite)) continue;
        rows.push({t:b.date,symbol,o,h,l,c,v});
      }
    } catch (_) { errors.push({symbol,status:0}); }
  }
  rows.sort((a,b)=>a.t.localeCompare(b.t)||a.symbol.localeCompare(b.symbol));
  return json({ok:true,provider:"eodhd",timeframe:"1Day",rows,errors});
}

function json(data,status=200){
  return new Response(JSON.stringify(data),{
    status,
    headers:{"content-type":"application/json; charset=utf-8","access-control-allow-origin":"*","cache-control":"no-store"}
  });
}

/* I din befintliga fetch-handler, efter att URL skapats:

if (url.pathname === "/eod-bars") {
  return handleEodBars(url, env);
}

*/

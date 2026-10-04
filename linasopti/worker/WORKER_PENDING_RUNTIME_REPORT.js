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

    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",

    "Access-Control-Allow-Headers": "Content-Type, X-Lina-Login-Code",

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



async function handleTwelveBars(url, env, request) {
  const symbol = (url.searchParams.get("symbol") || "").toUpperCase();
  const start = url.searchParams.get("start") || "2020-01-01";
  const end = url.searchParams.get("end") || "2024-12-31";
  const adjust = url.searchParams.get("adjust") || "none";
  const validDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s) && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0,10) === s;
  if (!/^[A-Z]{1,8}$/.test(symbol) || !validDate(start) || !validDate(end) || start < "2020-01-01" || end > "2024-12-31" || start > end || !["none","splits","dividends","all"].includes(adjust)) {
    return json({ok:false,error:"INVALID_TWELVE_HISTORY_REQUEST"},400,request);
  }
  if (!env.TWELVE_DATA_API_KEY) return json({ok:false,error:"TWELVE_DATA_API_KEY saknas"},503,request);
  const upstream = new URL("https://api.twelvedata.com/time_series");
  for (const [k,v] of Object.entries({symbol,interval:"1day",start_date:start+"T00:00:00",end_date:end+"T23:59:59",timezone:"America/New_York",adjust,outputsize:"5000",order:"asc",format:"JSON",country:"United States",prepost:"false",dp:"8",apikey:env.TWELVE_DATA_API_KEY})) upstream.searchParams.set(k,v);
  let response, payload;
  try {
    response = await fetch(upstream.toString(), {signal:AbortSignal.timeout(20000)});
    payload = await response.json();
  } catch (_) { return json({ok:false,error:"TWELVE_UPSTREAM_UNAVAILABLE"},502,request); }
  if (!response.ok || payload.status === "error") {
    const code = Number(payload.code) || response.status;
    return json({ok:false,error:"TWELVE_PROVIDER_ERROR",upstreamStatus:response.status,providerCode:code},[400,401,403,404,429].includes(code)?code:502,request);
  }
  if (!Array.isArray(payload.values) || !payload.values.length || payload.meta?.symbol !== symbol || payload.meta?.interval !== "1day") return json({ok:false,error:"TWELVE_SCHEMA_OR_SYMBOL_MISMATCH"},502,request);
  const dates = new Set(), rows = [];
  for (const b of payload.values) {
    const d=b.datetime;
    const numbers=[b.open,b.high,b.low,b.close].map(v=>v === null || v === undefined || v === "" ? NaN : Number(v));
    const [o,h,l,c]=numbers;
    const reason = !validDate(d) ? "INVALID_DATE" : d < start || d > end ? "OUTSIDE_REQUESTED_RANGE" : dates.has(d) ? "DUPLICATE_DATE" : !numbers.every(v=>Number.isFinite(v)&&v>0) ? "INVALID_NUMERIC_PRICE" : h < Math.max(o,l,c) || l > Math.min(o,h,c) ? "INCONSISTENT_OHLC" : null;
    if (reason) return json({ok:false,error:"TWELVE_INVALID_PRICE_OR_DATE",reason,symbol,adjust,rowIndex:rows.length,invalidRow:{d:validDate(d)?d:null,o:Number.isFinite(o)?o:null,h:Number.isFinite(h)?h:null,l:Number.isFinite(l)?l:null,c:Number.isFinite(c)?c:null}},502,request);
    dates.add(d); rows.push({d,o,h,l,c});
  }
  rows.sort((a,b)=>a.d.localeCompare(b.d));
  return json({ok:true,source:"Twelve Data",workerDataRevision:"TWELVE-HISTORY-02",symbol,start,end,adjust,interval:"1day",rows,providerMeta:payload.meta,providerValues:payload.values,calendarVerified:false,corporateActionsVerified:false,adjustmentVerified:false},200,request);
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



      const outside = body.filter(bar => !/^\d{4}-\d{2}-\d{2}$/.test(String(bar.date || '')) || bar.date < from || bar.date > to);
    if (outside.length) {
      errors.push({symbol,status:response.status,error:'UPSTREAM_DATE_RANGE_MISMATCH',requestedRange:[from,to],returnedFirstDate:body[0]?.date||null,returnedLastDate:body.at(-1)?.date||null,outsideCount:outside.length});
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
        adjustedClose: Number.isFinite(Number(bar.adjusted_close)) && Number(bar.adjusted_close)>0 ? Number(bar.adjusted_close) : null,

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

      ok: errors.length === 0,

      source: "EODHD",

      provider: "eodhd",

      timeframe: "1Day",

      symbols,

      rows,

      rowCount: rows.length,

      errors,
      requestedRange:[from,to],
      adjustmentStatus:"RAW_OHLC_ADJUSTED_CLOSE_EXPOSED_NOT_VERIFIED",

    },

    errors.length ? 502 : 200,
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



      try {

        body = JSON.parse(text);

      } catch (_) {

        errors.push({

          symbol,

          status: response.status,

          error: "Ogiltigt JSON-svar från Yahoo"

        });

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



      for (let i = 0; i < ts.length; i++) {

        const o = Number(q.open?.[i]);

        const h = Number(q.high?.[i]);

        const l = Number(q.low?.[i]);

        const c = Number(q.close?.[i]);

        const v = Number(q.volume?.[i] || 0);



        if (![o, h, l, c].every(Number.isFinite)) continue;



        rows.push({

          t: new Date(ts[i] * 1000).toISOString(),

          symbol,

          o,

          h,

          l,

          c,

          v

        });

      }

    } catch (error) {

      errors.push({

        symbol,

        status: 0,

        error: String(error)

      });

    }

  }



  rows.sort((a, b) =>

    a.t.localeCompare(b.t) || a.symbol.localeCompare(b.symbol)

  );



  return json(

    {

      ok: true,

      source: "Yahoo Finance chart",

      provider: "yahoo",

      timeframe: "1Day",

      symbols,

      rows,

      rowCount: rows.length,

      errors

    },

    200,

    request

  );

}



const FORWARD_ANCHOR = "2026-09-11";

const FORWARD_G2_HASH = "15efd75a";

const FORWARD_G3_PLAN = "75838ed5";



function githubConfig(env) {

  return {

    owner: env.GITHUB_OWNER || "",

    repo: env.GITHUB_REPO || "",

    branch: env.GITHUB_BRANCH || "",

    path: env.GITHUB_FORWARD_STATE_PATH || "linasopti/data/forward-state.json",

    token: env.GITHUB_TOKEN || "",

  };

}



function githubHeaders(cfg) {

  return {

    "Accept": "application/vnd.github+json",

    "Authorization": `Bearer ${cfg.token}`,

    "X-GitHub-Api-Version": "2022-11-28",

    "User-Agent": "Linas-Opti-Forward-State",

  };

}



function b64decode(s) {

  const clean = String(s || "").replace(/\s/g, "");

  const bin = atob(clean);

  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));

  return new TextDecoder().decode(bytes);

}



function b64encode(s) {

  const bytes = new TextEncoder().encode(s);

  let bin = "";

  for (const b of bytes) bin += String.fromCharCode(b);

  return btoa(bin);

}



function canon(v) {

  if (v === null || typeof v !== "object") return JSON.stringify(v);

  if (Array.isArray(v)) return "[" + v.map(canon).join(",") + "]";

  return "{" + Object.keys(v).sort().map(k => JSON.stringify(k) + ":" + canon(v[k])).join(",") + "}";

}



function tradeKey(t, kind) {

  if (t?.tradeId) return String(t.tradeId);

  const n = x => Number(x || 0).toFixed(8);

  return [

    kind,

    t?.symbol || "",

    t?.entryDate || "",

    t?.exitDate || "",

    n(t?.entryRaw ?? t?.entry),

    n(t?.shares),

    t?.modelMonth || "",

    t?.modelHash || ""

  ].join("|");

}



function mergeTrades(a, b, kind, label) {

  const m = new Map();



  for (const raw of a || []) {

    const t = {...raw, tradeId:tradeKey(raw,kind)};

    m.set(t.tradeId,t);

  }



  for (const raw of b || []) {

    const t = {...raw, tradeId:tradeKey(raw,kind)};

    const old = m.get(t.tradeId);



    if (old && canon(old) !== canon(t)) {

      throw new Error(`${label}: konflikt för ${t.tradeId}`);

    }



    m.set(t.tradeId,t);

  }



  return [...m.values()];

}



function mergeHistory(a,b) {

  const key = x => [

    x?.at,

    x?.event,

    x?.marketDate,

    x?.closed,

    x?.model

  ].join("|");



  const m = new Map();



  for (const x of [...(a||[]),...(b||[])]) {

    m.set(key(x),x);

  }



  return [...m.values()]

    .sort((x,y) =>

      String(x?.at||"").localeCompare(String(y?.at||""))

    )

    .slice(-80);

}



function later(a,b) {

  return String(a||"") >= String(b||"") ? a : b;

}



function validateForwardPackage(p) {

  if (!p || p.schema !== "LINA-FORWARD-SYNC-1") {

    throw new Error("Fel Forward-schema");

  }



  if (p.anchor !== FORWARD_ANCHOR) {

    throw new Error("Fel Forward-anchor");

  }



  if (p.tradeEnabled !== false) {

    throw new Error("Handel måste vara AV");

  }



  if (p.g2?.candidateHash !== FORWARD_G2_HASH) {

    throw new Error("G2 kandidatkonflikt");

  }



  if (p.g3?.planHash !== FORWARD_G3_PLAN) {

    throw new Error("G3 plankonflikt");

  }



  if (

    p.g2?.anchor !== FORWARD_ANCHOR ||

    p.g3?.anchor !== FORWARD_ANCHOR

  ) {

    throw new Error("State-anchor konflikt");

  }



  return p;

}



function mergeForwardState(local, incoming) {

  if (!local) {

    return {

      ...validateForwardPackage(incoming),

      release:"V0.2.33",

      exportedAt:new Date().toISOString()

    };

  }



  local = validateForwardPackage(local);

  incoming = validateForwardPackage(incoming);



  const mergeOne = (a,b,kind) => {

    const ad = String(a?.lastMarketDate||"");

    const bd = String(b?.lastMarketDate||"");

    let base;



    if (bd > ad) {

      base = {...b};

    } else if (ad > bd) {

      base = {...a};

    } else {

      const closed = mergeTrades(

        a?.closed,

        b?.closed,

        "CLOSED",

        kind+" stängd"

      );


      const open = mergeTrades(

        a?.open,

        b?.open,

        "OPEN",

        kind+" öppen"

      );



      if (

        closed.length !== Math.max(

          a?.closed?.length||0,

          b?.closed?.length||0

        ) ||

        open.length !== Math.max(

          a?.open?.length||0,

          b?.open?.length||0

        )

      ) {

        throw new Error(

          `${kind}: olika snapshots för samma marknadsdag ${ad||"—"}`

        );

      }



      base = {

        ...(String(b?.lastRefreshAt||"") >

          String(a?.lastRefreshAt||"") ? b : a),

        closed,

        open

      };

    }



    base.history = mergeHistory(a?.history,b?.history);

    base.lastMarketDate = later(

      a?.lastMarketDate,

      b?.lastMarketDate

    );

    base.lastRefreshAt = later(

      a?.lastRefreshAt,

      b?.lastRefreshAt

    );



    base.milestones = {

      60:

        (base.closed?.length||0)>=60 ||

        a?.milestones?.[60] ||

        b?.milestones?.[60],

      120:

        (base.closed?.length||0)>=120 ||

        a?.milestones?.[120] ||

        b?.milestones?.[120],

      250:

        (base.closed?.length||0)>=250 ||

        a?.milestones?.[250] ||

        b?.milestones?.[250]

    };



    return base;

  };



  const g2 = mergeOne(local.g2,incoming.g2,"G2");

  const g3 = mergeOne(local.g3,incoming.g3,"G3");



  const mm = new Map(

    (local.g3?.models||[]).map(x=>[x.month,x])

  );



  for(const x of incoming.g3?.models||[]) {

    const old = mm.get(x.month);



    if(old && canon(old)!==canon(x)) {

      throw new Error(`G3 modellkonflikt ${x.month}`);

    }



    mm.set(x.month,x);

  }



  g3.models = [...mm.values()]

    .sort((a,b) =>

      String(a.month).localeCompare(String(b.month))

    );



  return {

    schema:"LINA-FORWARD-SYNC-1",

    release:"V0.2.33",

    exportedAt:new Date().toISOString(),

    anchor:FORWARD_ANCHOR,

    tradeEnabled:false,

    g2,

    g3

  };

}



async function githubReadForward(env) {

  const cfg = githubConfig(env);



  if(!cfg.token) {

    throw new Error("GITHUB_TOKEN saknas i Worker");

  }



  if(!cfg.owner||!cfg.repo||!cfg.branch) {

    throw new Error(

      "GITHUB_OWNER, GITHUB_REPO eller GITHUB_BRANCH saknas i Worker"

    );

  }



  const api =

    `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/` +

    `${encodeURIComponent(cfg.repo)}/contents/` +

    `${cfg.path.split('/').map(encodeURIComponent).join('/')}?ref=` +

    `${encodeURIComponent(cfg.branch)}`;



  const r = await fetch(api,{

    headers:githubHeaders(cfg)

  });



  if(r.status===404) {

    return {

      state:null,

      sha:null,

      cfg

    };

  }



  const body = await r.json();



  if(!r.ok) {

    throw new Error(

      body?.message||`GitHub HTTP ${r.status}`

    );

  }



  return {

    state:validateForwardPackage(

      JSON.parse(b64decode(body.content))

    ),

    sha:body.sha,

    cfg

  };

}



async function githubWriteForward(env,state,sha) {

  const cfg = githubConfig(env);



  const api =

    `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/` +

    `${encodeURIComponent(cfg.repo)}/contents/` +

    `${cfg.path.split('/').map(encodeURIComponent).join('/')}`;



  const payload = {

    message:`Lina Forward state ${new Date().toISOString()}`,

    content:b64encode(JSON.stringify(state,null,2)+"\n"),

    branch:cfg.branch

  };



  if(sha) {

    payload.sha=sha;

  }



  const r = await fetch(api,{

    method:"PUT",

    headers:{

      ...githubHeaders(cfg),

      "Content-Type":"application/json"

    },

    body:JSON.stringify(payload)

  });



  const body = await r.json();



  if(!r.ok) {

    throw new Error(

      body?.message||`GitHub write HTTP ${r.status}`

    );

  }



  return body;

}



async function handleForwardState(request,env) {

  if(request.method==="GET") {

    try {

      const x = await githubReadForward(env);



      return json({

        ok:true,

        exists:!!x.state,

        state:x.state,

        source:"github",

        path:x.cfg.path,

        branch:x.cfg.branch

      },200,request);

    } catch(e) {

      return json({

        ok:false,

        error:String(e?.message||e)

      },500,request);

    }

  }



  if(request.method!=="POST") {

    return json({

      ok:false,

      error:"Method not allowed"

    },405,request);

  }



  if(!env.LINA_LOGIN_CODE) {

    return json({

      ok:false,

      error:"LINA_LOGIN_CODE saknas i Worker"

    },503,request);

  }



  if(

    request.headers.get("X-Lina-Login-Code") !==

    env.LINA_LOGIN_CODE

  ) {

    return json({

      ok:false,

      error:"Lina-sessionen är inte godkänd"

    },401,request);

  }



  let incoming;



  try {

    incoming = validateForwardPackage(

      await request.json()

    );

  } catch(e) {

    return json({

      ok:false,

      error:String(e?.message||e)

    },400,request);

  }



  try {

    for(let attempt=0;attempt<2;attempt++) {

      const current = await githubReadForward(env);

      const merged = mergeForwardState(

        current.state,

        incoming

      );



      try {

        const wr = await githubWriteForward(

          env,

          merged,

          current.sha

        );



        return json({

          ok:true,

          state:merged,

          commit:wr?.commit?.sha||null,

          created:!current.state

        },200,request);

      } catch(e) {

        if(

          attempt===0 &&

          String(e?.message||e).includes("does not match")

        ) {

          continue;

        }



        throw e;

      }

    }



    throw new Error(

      "GitHub-state ändrades samtidigt – försök igen"

    );

  } catch(e) {

    return json({

      ok:false,

      error:String(e?.message||e)

    },409,request);

  }

}



function validateAppState(p) {

  if (!p || p.schema !== "LINA-APP-SYNC-1") {

    throw new Error("Fel App-state schema");

  }



  if (p.tradeEnabled !== false) {

    throw new Error("Handel måste vara AV");

  }



  if (

    !p.entries ||

    typeof p.entries !== "object" ||

    Array.isArray(p.entries)

  ) {

    throw new Error("App-state entries saknas");

  }



  const keys = Object.keys(p.entries);



  if (keys.length > 40) {

    throw new Error("För många App-state poster");

  }



  let total = 0;



  const allowedExactAppStateKeys = new Set([

    "lina_generation_engine_v0273"

  ]);



  for (const k of keys) {

    if (!k.startsWith("lina_clean_") && !allowedExactAppStateKeys.has(k)) {

      throw new Error("Otillåten App-state nyckel");

    }



    const x = p.entries[k];



    if (!x || typeof x.value !== "string") {

      throw new Error("Ogiltig App-state post");

    }



    if (x.value.length > 400000) {

      throw new Error("App-state post för stor");

    }



    total += x.value.length;

  }



  if (total > 1500000) {

    throw new Error("App-state paket för stort");

  }



  return p;

}



function appGithubConfig(env) {

  const cfg = githubConfig(env);



  return {

    ...cfg,

    path:

      env.GITHUB_APP_STATE_PATH ||

      "linasopti/data/app-state.json"

  };

}



async function githubReadAppState(env) {

  const cfg = appGithubConfig(env);



  if(!cfg.token) {

    throw new Error("GITHUB_TOKEN saknas i Worker");

  }



  if(!cfg.owner||!cfg.repo||!cfg.branch) {

    throw new Error(

      "GitHub-konfiguration saknas i Worker"

    );

  }



  const api =

    `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/` +

    `${encodeURIComponent(cfg.repo)}/contents/` +

    `${cfg.path.split("/").map(encodeURIComponent).join("/")}?ref=` +

    `${encodeURIComponent(cfg.branch)}`;



  const r = await fetch(api,{

    headers:githubHeaders(cfg)

  });



  if(r.status===404) {

    return {

      state:null,

      sha:null,

      cfg

    };

  }



  const body = await r.json();



  if(!r.ok) {

    throw new Error(

      body?.message||`GitHub HTTP ${r.status}`

    );

  }



  return {

    state:validateAppState(

      JSON.parse(b64decode(body.content))

    ),

    sha:body.sha,

    cfg

  };

}



async function githubWriteAppState(env,state,sha) {

  const cfg = appGithubConfig(env);



  const api =

    `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/` +

    `${encodeURIComponent(cfg.repo)}/contents/` +

    `${cfg.path.split("/").map(encodeURIComponent).join("/")}`;



  const payload = {

    message:`Lina App state ${new Date().toISOString()}`,

    content:b64encode(JSON.stringify(state,null,2)+"\n"),

    branch:cfg.branch

  };



  if(sha) {

    payload.sha=sha;

  }



  const r = await fetch(api,{

    method:"PUT",

    headers:{

      ...githubHeaders(cfg),

      "Content-Type":"application/json"

    },

    body:JSON.stringify(payload)

  });



  const body = await r.json();



  if(!r.ok) {

    throw new Error(

      body?.message||`GitHub write HTTP ${r.status}`

    );

  }



  return body;

}



async function handleAppState(request,env) {

  if(request.method==="GET") {

    try {

      const x = await githubReadAppState(env);



      return json({

        ok:true,

        exists:!!x.state,

        state:x.state,

        source:"github",

        path:x.cfg.path,

        branch:x.cfg.branch

      },200,request);

    } catch(e) {

      return json({

        ok:false,

        error:String(e?.message||e)

      },500,request);

    }

  }



  if(request.method!=="POST") {

    return json({

      ok:false,

      error:"Method not allowed"

    },405,request);

  }



  if(!env.LINA_LOGIN_CODE) {

    return json({

      ok:false,

      error:"LINA_LOGIN_CODE saknas i Worker"

    },503,request);

  }



  if(

    request.headers.get("X-Lina-Login-Code") !==

    env.LINA_LOGIN_CODE

  ) {

    return json({

      ok:false,

      error:"Lina-sessionen är inte godkänd"

    },401,request);

  }



  let incoming;



  try {

    incoming = validateAppState(

      await request.json()

    );

  } catch(e) {

    return json({

      ok:false,

      error:String(e?.message||e)

    },400,request);

  }



  try {

    const current = await githubReadAppState(env);



    const wr = await githubWriteAppState(

      env,

      incoming,

      current.sha

    );



    return json({

      ok:true,
      state:incoming,

      commit:wr?.commit?.sha||null,

      created:!current.state

    },200,request);

  } catch(e) {

    return json({

      ok:false,

      error:String(e?.message||e)

    },409,request);

  }

}



async function sha256Hex(text) {

  const b = await crypto.subtle.digest(

    "SHA-256",

    new TextEncoder().encode(text)

  );



  return [...new Uint8Array(b)]

    .map(x=>x.toString(16).padStart(2,"0"))

    .join("");

}



function safeEvidenceName(name) {

  const n = String(name||"");



  if(!/^[A-Za-z0-9._-]+\.(txt|json)$/i.test(n)) {

    throw new Error("Ogiltigt evidence-filnamn");

  }



  return n;

}



async function handleEvidence(request,env) {

  if(request.method!=="POST") {

    return json({

      ok:false,

      error:"Method not allowed"

    },405,request);

  }



  if(!env.LINA_LOGIN_CODE) {

    return json({

      ok:false,

      error:"LINA_LOGIN_CODE saknas i Worker"

    },503,request);

  }



  if(

    request.headers.get("X-Lina-Login-Code") !==

    env.LINA_LOGIN_CODE

  ) {

    return json({

      ok:false,

      error:"Lina-sessionen är inte godkänd"

    },401,request);

  }



  try {

    const x = await request.json();



    if(

      x?.schema!=="LINA-EVIDENCE-1" ||

      x?.status!=="FROZEN"

    ) {

      throw new Error(

        "Endast godkänd/frozen evidence får arkiveras"

      );

    }



    const name = safeEvidenceName(x.name);

    const content = String(x.content??"");



    if(!content || content.length>500000) {

      throw new Error(

        "Evidencefil saknas eller är för stor"

      );

    }



    const hash = await sha256Hex(content);



    if(hash!==String(x.sha256||"").toLowerCase()) {

      throw new Error("SHA256 stämmer inte");

    }



    const date =

      /^\d{4}-\d{2}-\d{2}/.test(

        String(x.approvedAt||"")

      )

        ? String(x.approvedAt).slice(0,10)

        : new Date().toISOString().slice(0,10);



    const path =

      `linasopti/evidence/${date}/${name}`;



    const cfg = githubConfig(env);



    if(

      !cfg.token ||

      !cfg.owner ||

      !cfg.repo ||

      !cfg.branch

    ) {

      throw new Error(

        "GitHub-konfiguration saknas"

      );

    }



    const api =

      `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/` +

      `${encodeURIComponent(cfg.repo)}/contents/` +

      `${path.split("/").map(encodeURIComponent).join("/")}`;



    const chk = await fetch(

      api+`?ref=${encodeURIComponent(cfg.branch)}`,

      {

        headers:githubHeaders(cfg)

      }

    );



    if(chk.ok) {

      throw new Error(

        "Evidencefilen finns redan – original skrivs inte över"

      );

    }



    if(chk.status!==404) {

      throw new Error(

        `GitHub kontroll HTTP ${chk.status}`

      );

    }



    const wrResp = await fetch(api,{

      method:"PUT",

      headers:{

        ...githubHeaders(cfg),

        "Content-Type":"application/json"

      },

      body:JSON.stringify({

        message:`Lina frozen evidence ${name}`,

        content:b64encode(content),

        branch:cfg.branch

      })

    });



    const wr = await wrResp.json();



    if(!wrResp.ok) {

      throw new Error(

        wr?.message||

        `GitHub write HTTP ${wrResp.status}`

      );

    }



    return json({

      ok:true,

      path,

      sha256:hash,

      commit:wr?.commit?.sha||null

    },200,request);

  } catch(e) {

    return json({

      ok:false,

      error:String(e?.message||e)

    },409,request);

  }

}



function safeRuntimeReportName(name) {
  const n = String(name || "").trim().toUpperCase();
  if (!/^[A-Z0-9_-]{1,80}$/.test(n)) throw new Error("Ogiltigt runtime-report namn");
  return n;
}

async function handleRuntimeReport(request, env) {
  if (request.method !== "POST") return json({ok:false,error:"Method not allowed"},405,request);
  if (!env.LINA_LOGIN_CODE) return json({ok:false,error:"LINA_LOGIN_CODE saknas i Worker"},503,request);
  if (request.headers.get("X-Lina-Login-Code") !== env.LINA_LOGIN_CODE) return json({ok:false,error:"Lina-sessionen är inte godkänd"},401,request);
  try {
    const x = await request.json();
    if (x?.schema !== "LINA-RUNTIME-REPORT-1") throw new Error("Fel runtime-report schema");
    const name = safeRuntimeReportName(x.name);
    if (!x.report || typeof x.report !== "object" || Array.isArray(x.report)) throw new Error("Runtime-report saknas");
    const content = JSON.stringify(x.report,null,2) + "\n";
    if (content.length > 2000000) throw new Error("Runtime-report är för stor");
    const hash = await sha256Hex(content);
    const stamp = new Date().toISOString().replace(/[:.]/g,"-");
    const path = `linasopti/runtime-reports/${name}_${stamp}_${hash.slice(0,12)}.json`;
    const cfg = githubConfig(env);
    if (!cfg.token || !cfg.owner || !cfg.repo || !cfg.branch) throw new Error("GitHub-konfiguration saknas");
    const api = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
    const wrResp = await fetch(api,{method:"PUT",headers:{...githubHeaders(cfg),"Content-Type":"application/json"},body:JSON.stringify({message:`Lina runtime report ${name}`,content:b64encode(content),branch:cfg.branch})});
    const wr = await wrResp.json();
    if (!wrResp.ok) throw new Error(wr?.message || `GitHub write HTTP ${wrResp.status}`);
    return json({ok:true,path,sha256:hash,commit:wr?.commit?.sha||null,contentSha:wr?.content?.sha||null},200,request);
  } catch(e) {
    return json({ok:false,error:String(e?.message||e)},409,request);
  }
}

async function handleAuthCheck(request,env) {

  if(request.method!=="POST") {

    return json({

      ok:false,

      error:"Method not allowed"

    },405,request);

  }



  if(!env.LINA_LOGIN_CODE) {

    return json({

      ok:false,

      error:"LINA_LOGIN_CODE saknas i Worker"

    },503,request);

  }



  let body;



  try {

    body = await request.json();

  } catch {

    return json({

      ok:false,

      error:"Ogiltig begäran"

    },400,request);

  }



  if(

    String(body?.code||"") !==

    String(env.LINA_LOGIN_CODE)

  ) {

    return json({

      ok:false,

      error:"Fel lösenkod"

    },401,request);

  }



  return json({

    ok:true

  },200,request);

}



async function handleGen9Data(url, env, request) {
  const from=url.searchParams.get('start')||'2020-01-01',to=url.searchParams.get('end')||'2024-12-31';
  const symbols=(url.searchParams.get('symbols')||'AMD').split(',').map(s=>s.trim().toUpperCase());
  const allowed=new Set(['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA']);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(from)||!/^\d{4}-\d{2}-\d{2}$/.test(to)||!Number.isFinite(Date.parse(from))||!Number.isFinite(Date.parse(to))||from>to||from<'2020-01-01'||to>'2024-12-31'||symbols.length>16||symbols.some(s=>!allowed.has(s))||new Set(symbols).size!==symbols.length)return json({ok:false,error:'GEN9_DATA_REQUEST_BLOCKED'},400,request);
  const data={},provenance={},errors=[];
  for(const symbol of symbols){
    const api=new URL('https://query1.finance.yahoo.com/v8/finance/chart/'+encodeURIComponent(symbol));
    api.searchParams.set('period1',String(Math.floor(Date.parse(from+'T00:00:00Z')/1000)));
    api.searchParams.set('period2',String(Math.floor(Date.parse(to+'T23:59:59Z')/1000)+1));
    api.searchParams.set('interval','1d');api.searchParams.set('includePrePost','false');api.searchParams.set('events','div,splits');api.searchParams.set('includeAdjustedClose','true');
    try{
      const response=await fetch(api,{headers:{Accept:'application/json','User-Agent':'Mozilla/5.0 Lina-Gen9-Data'}});const body=await response.json();const r=body?.chart?.result?.[0];
      if(!response.ok||!r)throw Error('UPSTREAM_HTTP_'+response.status);
      const q=r.indicators?.quote?.[0],adj=r.indicators?.adjclose?.[0]?.adjclose,ts=r.timestamp;
      if(!q||!Array.isArray(adj)||!Array.isArray(ts)||!ts.length)throw Error('MISSING_ADJUSTED_CLOSE_OR_BARS');
      const rows=[];for(let i=0;i<ts.length;i++){
        const d=new Date(ts[i]*1000).toISOString().slice(0,10);if(d<from||d>to)throw Error('UPSTREAM_DATE_RANGE_MISMATCH');
        const raw=[q.open?.[i],q.high?.[i],q.low?.[i],q.close?.[i],adj[i]];
        if(raw.some(v=>typeof v!=='number'||!Number.isFinite(v)||v<=0))throw Error('INVALID_OR_MISSING_OHLC_ADJUSTMENT');
        const [o,h,l,c,ac]=raw,factor=ac/c;if(l>Math.min(o,c)||h<Math.max(o,c)||l>h)throw Error('INVALID_OHLC');
        rows.push({d,o:o*factor,h:h*factor,l:l*factor,c:ac,raw:{o,h,l,c,adjustedClose:ac},adjustmentFactor:factor});
      }
      if(new Set(rows.map(r=>r.d)).size!==rows.length)throw Error('DUPLICATE_DATES');
      data[symbol]=rows;provenance[symbol]={source:'Yahoo chart',currency:r.meta?.currency||null,exchange:r.meta?.exchangeName||null,timezone:r.meta?.exchangeTimezoneName||null,events:r.events||{},rowCount:rows.length,firstDate:rows[0].d,lastDate:rows.at(-1).d,method:'OHLC multiplied by adjustedClose / quote.close; raw source retained'};
    }catch(e){errors.push({symbol,error:String(e.message||e)})}
  }
  return json({ok:errors.length===0,schema:'LINA-GEN9-RAW-DATA-1',workerDataRevision:'GEN9-DATA-01',requestedRange:[from,to],data,provenance,errors,adjustmentStatus:'PROVIDER_ADJUSTED_OHLC_REQUIRES_VERIFICATION',calendarVerified:false,corporateActionsVerified:false,researchStarted:false,tradeEnabled:false},errors.length?502:200,request);
}

export default {

  async fetch(request, env) {

    if (request.method === "OPTIONS") {

      return new Response(null, {

        status: 204,

        headers: corsHeaders(request),

      });

    }



    const preUrl = new URL(request.url);



    if (preUrl.pathname === "/auth-check") {

      return handleAuthCheck(request, env);

    }



    if (preUrl.pathname === "/app-state") {

      return handleAppState(request, env);

    }



    if (preUrl.pathname === "/evidence") {

      return handleEvidence(request, env);

    }



    if (preUrl.pathname === "/runtime-report") {
      return handleRuntimeReport(request, env);
    }

    if (preUrl.pathname === "/forward-state") {

      return handleForwardState(request, env);

    }



    if (request.method !== "GET") {

      return json(

        {

          ok: false,

          error: "Method not allowed"

        },

        405,

        request

      );

    }



    const url = new URL(request.url);



    if (

      url.pathname === "/" ||

      url.pathname === "/health"

    ) {

      return json(

        {

          ok: true,

          service: "Linas Opti API",

          version: "0.58.8 + evidence-sync-v0235 + alpaca-history-v02 + twelve-history-v02 + runtime-report-v0321",

          mode: "paper",

          tradingEnabled: false,

          alpacaConfigured: Boolean(

            env.APCA_API_KEY_ID &&

            env.APCA_API_SECRET_KEY

          ),

          eodhdConfigured: Boolean(

            env.EODHD_API_TOKEN

          ),

          twelveDataConfigured: Boolean(env.TWELVE_DATA_API_KEY),

          yahooHistoricalConfigured: true,

          loginCodeConfigured:

            !!env.LINA_LOGIN_CODE,

          githubForwardConfigured:

            Boolean(env.GITHUB_TOKEN),

        },

        200,

        request

      );

    }



    if (url.pathname === "/twelve-bars") return handleTwelveBars(url, env, request);

    if (url.pathname === "/gen9-data") return handleGen9Data(url, env, request);

    if (url.pathname === "/yahoo-bars") {

      return handleYahooBars(

        url,

        env,

        request

      );

    }



    if (url.pathname === "/bars") {

      const feed = url.searchParams.get("feed") || "iex";
      const adjustment = url.searchParams.get("adjustment") || "raw";
      if (!["iex", "sip"].includes(feed) || !["raw", "split", "dividend", "spin-off", "all"].includes(adjustment)) {
        return json({ok:false,error:"Ogiltig feed eller adjustment"},400,request);
      }

      const symbols =

        (url.searchParams.get("symbols") || "")

          .toUpperCase()

          .replace(/\s/g, "");



      const timeframe =

        url.searchParams.get("timeframe") ||

        "1Day";



      const start =

        url.searchParams.get("start") || "";



      const end =

        url.searchParams.get("end") || "";



      if (!symbols) {

        return json(

          {

            ok: false,

            error: "symbols saknas"

          },

          400,

          request

        );

      }



      if (!["1Day", "5Min"].includes(timeframe)) {

        return json(

          {

            ok: false,

            error:

              "Endast 1Day och 5Min stöds just nu",

          },

          400,

          request

        );

      }



      if (

        !env.APCA_API_KEY_ID ||

        !env.APCA_API_SECRET_KEY

      ) {

        return json(

          {

            ok: false,

            error:

              "Alpaca är inte anslutet i Worker.",

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



          alpaca.searchParams.set(

            "symbols",

            symbols

          );



          alpaca.searchParams.set(

            "timeframe",

            timeframe

          );



          alpaca.searchParams.set(

            "feed",

            feed

          );



          alpaca.searchParams.set(

            "adjustment",

            adjustment

          );



          alpaca.searchParams.set(

            "limit",

            "10000"

          );



          if (start) {

            const startValue =

              start.includes("T")

                ? start

                : `${start}T00:00:00Z`;



            alpaca.searchParams.set(

              "start",

              startValue

            );

          }



          if (end) {

            const endValue =

              end.includes("T")

                ? end

                : `${end}T23:59:59Z`;



            alpaca.searchParams.set(

              "end",

              endValue

            );

          }



          if (pageToken) {

            alpaca.searchParams.set(

              "page_token",

              pageToken

            );

          }



          const response = await fetch(

            alpaca.toString(),

            {

              headers: {

                "APCA-API-KEY-ID":

                  env.APCA_API_KEY_ID,

                "APCA-API-SECRET-KEY":

                  env.APCA_API_SECRET_KEY,

              },

            }

          );



          const text = await response.text();



          if (!response.ok) {

            return json(

              {

                ok: false,

                error:

                  "Alpaca svarade med ett fel",

                status: response.status,

                details: text,

              },

              response.status,

              request

            );

          }



          const data = JSON.parse(text);

          const bars = data.bars || {};



          for (

            const [symbol, symbolBars]

            of Object.entries(bars)

          ) {

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



          pageToken =

            data.next_page_token || null;



          pages++;



          if (pages >= 100) {

            return json(

              {

                ok: false,

                error:

                  "För många datasidor från Alpaca",

              },

              500,

              request

            );

          }

        } while (pageToken);



        rows.sort((a, b) => {

          if (a.t === b.t) {

            return a.symbol.localeCompare(

              b.symbol

            );

          }


          return a.t.localeCompare(b.t);

        });



        return json(

          {

            ok: true,

            source: "Alpaca",

            feed,
            adjustment,
            workerDataRevision: "ALPACA-HISTORY-02",

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

            error:

              "Kunde inte kontakta Alpaca",

            details: String(error),

          },

          500,

          request

        );

      }

    }



    if (url.pathname === "/eod-bars") {

      return handleEodBars(

        url,

        env,

        request

      );

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
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
  return [kind, t?.symbol || "", t?.entryDate || "", t?.exitDate || "", n(t?.entryRaw ?? t?.entry), n(t?.shares), t?.modelMonth || "", t?.modelHash || ""].join("|");
}

function mergeTrades(a, b, kind, label) {
  const m = new Map();
  for (const raw of a || []) { const t={...raw,tradeId:tradeKey(raw,kind)}; m.set(t.tradeId,t); }
  for (const raw of b || []) {
    const t={...raw,tradeId:tradeKey(raw,kind)}, old=m.get(t.tradeId);
    if (old && canon(old) !== canon(t)) throw new Error(`${label}: konflikt för ${t.tradeId}`);
    m.set(t.tradeId,t);
  }
  return [...m.values()];
}

function mergeHistory(a,b) {
  const key=x=>[x?.at,x?.event,x?.marketDate,x?.closed,x?.model].join("|"), m=new Map();
  for (const x of [...(a||[]),...(b||[])]) m.set(key(x),x);
  return [...m.values()].sort((x,y)=>String(x?.at||"").localeCompare(String(y?.at||""))).slice(-80);
}

function later(a,b){ return String(a||"") >= String(b||"") ? a : b; }

function validateForwardPackage(p) {
  if (!p || p.schema !== "LINA-FORWARD-SYNC-1") throw new Error("Fel Forward-schema");
  if (p.anchor !== FORWARD_ANCHOR) throw new Error("Fel Forward-anchor");
  if (p.tradeEnabled !== false) throw new Error("Handel måste vara AV");
  if (p.g2?.candidateHash !== FORWARD_G2_HASH) throw new Error("G2 kandidatkonflikt");
  if (p.g3?.planHash !== FORWARD_G3_PLAN) throw new Error("G3 plankonflikt");
  if (p.g2?.anchor !== FORWARD_ANCHOR || p.g3?.anchor !== FORWARD_ANCHOR) throw new Error("State-anchor konflikt");
  return p;
}

function mergeForwardState(local, incoming) {
  if (!local) return {...validateForwardPackage(incoming),release:"V0.2.33",exportedAt:new Date().toISOString()};
  local=validateForwardPackage(local); incoming=validateForwardPackage(incoming);
  const mergeOne=(a,b,kind)=>{
    const ad=String(a?.lastMarketDate||""), bd=String(b?.lastMarketDate||"");
    let base;
    if(bd>ad) base={...b}; else if(ad>bd) base={...a}; else {
      const closed=mergeTrades(a?.closed,b?.closed,"CLOSED",kind+" stängd");
      const open=mergeTrades(a?.open,b?.open,"OPEN",kind+" öppen");
      if(closed.length!==Math.max(a?.closed?.length||0,b?.closed?.length||0)||open.length!==Math.max(a?.open?.length||0,b?.open?.length||0)) throw new Error(`${kind}: olika snapshots för samma marknadsdag ${ad||"—"}`);
      base={...(String(b?.lastRefreshAt||"")>String(a?.lastRefreshAt||"")?b:a),closed,open};
    }
    base.history=mergeHistory(a?.history,b?.history);base.lastMarketDate=later(a?.lastMarketDate,b?.lastMarketDate);base.lastRefreshAt=later(a?.lastRefreshAt,b?.lastRefreshAt);
    base.milestones={60:(base.closed?.length||0)>=60||a?.milestones?.[60]||b?.milestones?.[60],120:(base.closed?.length||0)>=120||a?.milestones?.[120]||b?.milestones?.[120],250:(base.closed?.length||0)>=250||a?.milestones?.[250]||b?.milestones?.[250]};
    return base;
  };
  const g2=mergeOne(local.g2,incoming.g2,"G2"), g3=mergeOne(local.g3,incoming.g3,"G3");
  const mm=new Map((local.g3?.models||[]).map(x=>[x.month,x]));
  for(const x of incoming.g3?.models||[]){const old=mm.get(x.month);if(old&&canon(old)!==canon(x))throw new Error(`G3 modellkonflikt ${x.month}`);mm.set(x.month,x)}
  g3.models=[...mm.values()].sort((a,b)=>String(a.month).localeCompare(String(b.month)));
  return {schema:"LINA-FORWARD-SYNC-1",release:"V0.2.33",exportedAt:new Date().toISOString(),anchor:FORWARD_ANCHOR,tradeEnabled:false,g2,g3};
}

async function githubReadForward(env) {
  const cfg=githubConfig(env);
  if(!cfg.token) throw new Error("GITHUB_TOKEN saknas i Worker");
  if(!cfg.owner||!cfg.repo||!cfg.branch) throw new Error("GITHUB_OWNER, GITHUB_REPO eller GITHUB_BRANCH saknas i Worker");
  const api=`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(cfg.branch)}`;
  const r=await fetch(api,{headers:githubHeaders(cfg)});
  if(r.status===404) return {state:null,sha:null,cfg};
  const body=await r.json();
  if(!r.ok) throw new Error(body?.message||`GitHub HTTP ${r.status}`);
  return {state:validateForwardPackage(JSON.parse(b64decode(body.content))),sha:body.sha,cfg};
}

async function githubWriteForward(env,state,sha) {
  const cfg=githubConfig(env);
  const api=`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path.split('/').map(encodeURIComponent).join('/')}`;
  const payload={message:`Lina Forward state ${new Date().toISOString()}`,content:b64encode(JSON.stringify(state,null,2)+"\n"),branch:cfg.branch};
  if(sha) payload.sha=sha;
  const r=await fetch(api,{method:"PUT",headers:{...githubHeaders(cfg),"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const body=await r.json();
  if(!r.ok) throw new Error(body?.message||`GitHub write HTTP ${r.status}`);
  return body;
}

async function handleForwardState(request,env) {
  if(request.method==="GET"){
    try{const x=await githubReadForward(env);return json({ok:true,exists:!!x.state,state:x.state,source:"github",path:x.cfg.path,branch:x.cfg.branch},200,request)}
    catch(e){return json({ok:false,error:String(e?.message||e)},500,request)}
  }
  if(request.method!=="POST") return json({ok:false,error:"Method not allowed"},405,request);
  if(!env.LINA_LOGIN_CODE) return json({ok:false,error:"LINA_LOGIN_CODE saknas i Worker"},503,request);
  if(request.headers.get("X-Lina-Login-Code")!==env.LINA_LOGIN_CODE) return json({ok:false,error:"Lina-sessionen är inte godkänd"},401,request);
  let incoming; try{incoming=validateForwardPackage(await request.json())}catch(e){return json({ok:false,error:String(e?.message||e)},400,request)}
  try{
    for(let attempt=0;attempt<2;attempt++){
      const current=await githubReadForward(env), merged=mergeForwardState(current.state,incoming);
      try{const wr=await githubWriteForward(env,merged,current.sha);return json({ok:true,state:merged,commit:wr?.commit?.sha||null,created:!current.state},200,request)}
      catch(e){if(attempt===0&&String(e?.message||e).includes("does not match"))continue;throw e}
    }
    throw new Error("GitHub-state ändrades samtidigt – försök igen");
  }catch(e){return json({ok:false,error:String(e?.message||e)},409,request)}
}



function validateAppState(p) {
  if (!p || p.schema !== "LINA-APP-SYNC-1") throw new Error("Fel App-state schema");
  if (p.tradeEnabled !== false) throw new Error("Handel måste vara AV");
  if (!p.entries || typeof p.entries !== "object" || Array.isArray(p.entries)) throw new Error("App-state entries saknas");
  const keys = Object.keys(p.entries);
  if (keys.length > 40) throw new Error("För många App-state poster");
  let total = 0;
  for (const k of keys) {
    if (!k.startsWith("lina_clean_")) throw new Error("Otillåten App-state nyckel");
    const x = p.entries[k];
    if (!x || typeof x.value !== "string") throw new Error("Ogiltig App-state post");
    if (x.value.length > 400000) throw new Error("App-state post för stor");
    total += x.value.length;
  }
  if (total > 1500000) throw new Error("App-state paket för stort");
  return p;
}
function appGithubConfig(env){
  const cfg=githubConfig(env);
  return {...cfg,path:env.GITHUB_APP_STATE_PATH||"linasopti/data/app-state.json"};
}
async function githubReadAppState(env){
  const cfg=appGithubConfig(env);
  if(!cfg.token) throw new Error("GITHUB_TOKEN saknas i Worker");
  if(!cfg.owner||!cfg.repo||!cfg.branch) throw new Error("GitHub-konfiguration saknas i Worker");
  const api=`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(cfg.branch)}`;
  const r=await fetch(api,{headers:githubHeaders(cfg)});
  if(r.status===404)return {state:null,sha:null,cfg};
  const body=await r.json();
  if(!r.ok)throw new Error(body?.message||`GitHub HTTP ${r.status}`);
  return {state:validateAppState(JSON.parse(b64decode(body.content))),sha:body.sha,cfg};
}
async function githubWriteAppState(env,state,sha){
  const cfg=appGithubConfig(env);
  const api=`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${cfg.path.split("/").map(encodeURIComponent).join("/")}`;
  const payload={message:`Lina App state ${new Date().toISOString()}`,content:b64encode(JSON.stringify(state,null,2)+"\n"),branch:cfg.branch};
  if(sha)payload.sha=sha;
  const r=await fetch(api,{method:"PUT",headers:{...githubHeaders(cfg),"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const body=await r.json();
  if(!r.ok)throw new Error(body?.message||`GitHub write HTTP ${r.status}`);
  return body;
}
async function handleAppState(request,env){
  if(request.method==="GET"){
    try{const x=await githubReadAppState(env);return json({ok:true,exists:!!x.state,state:x.state,source:"github",path:x.cfg.path,branch:x.cfg.branch},200,request)}
    catch(e){return json({ok:false,error:String(e?.message||e)},500,request)}
  }
  if(request.method!=="POST")return json({ok:false,error:"Method not allowed"},405,request);
  if(!env.LINA_LOGIN_CODE)return json({ok:false,error:"LINA_LOGIN_CODE saknas i Worker"},503,request);
  if(request.headers.get("X-Lina-Login-Code")!==env.LINA_LOGIN_CODE)return json({ok:false,error:"Lina-sessionen är inte godkänd"},401,request);
  let incoming;try{incoming=validateAppState(await request.json())}catch(e){return json({ok:false,error:String(e?.message||e)},400,request)}
  try{const current=await githubReadAppState(env);const wr=await githubWriteAppState(env,incoming,current.sha);return json({ok:true,state:incoming,commit:wr?.commit?.sha||null,created:!current.state},200,request)}
  catch(e){return json({ok:false,error:String(e?.message||e)},409,request)}
}


async function sha256Hex(text){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function safeEvidenceName(name){const n=String(name||"");if(!/^[A-Za-z0-9._-]+\.(txt|json)$/i.test(n))throw new Error("Ogiltigt evidence-filnamn");return n}
async function handleEvidence(request,env){
 if(request.method!=="POST")return json({ok:false,error:"Method not allowed"},405,request);
 if(!env.LINA_LOGIN_CODE)return json({ok:false,error:"LINA_LOGIN_CODE saknas i Worker"},503,request);
 if(request.headers.get("X-Lina-Login-Code")!==env.LINA_LOGIN_CODE)return json({ok:false,error:"Lina-sessionen är inte godkänd"},401,request);
 try{
  const x=await request.json();
  if(x?.schema!=="LINA-EVIDENCE-1"||x?.status!=="FROZEN")throw new Error("Endast godkänd/frozen evidence får arkiveras");
  const name=safeEvidenceName(x.name), content=String(x.content??"");
  if(!content||content.length>500000)throw new Error("Evidencefil saknas eller är för stor");
  const hash=await sha256Hex(content); if(hash!==String(x.sha256||"").toLowerCase())throw new Error("SHA256 stämmer inte");
  const date=/^\d{4}-\d{2}-\d{2}/.test(String(x.approvedAt||""))?String(x.approvedAt).slice(0,10):new Date().toISOString().slice(0,10);
  const path=`linasopti/evidence/${date}/${name}`, cfg=githubConfig(env);
  if(!cfg.token||!cfg.owner||!cfg.repo||!cfg.branch)throw new Error("GitHub-konfiguration saknas");
  const api=`https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const chk=await fetch(api+`?ref=${encodeURIComponent(cfg.branch)}`,{headers:githubHeaders(cfg)});
  if(chk.ok)throw new Error("Evidencefilen finns redan – original skrivs inte över"); if(chk.status!==404)throw new Error(`GitHub kontroll HTTP ${chk.status}`);
  const wrResp=await fetch(api,{method:"PUT",headers:{...githubHeaders(cfg),"Content-Type":"application/json"},body:JSON.stringify({message:`Lina frozen evidence ${name}`,content:b64encode(content),branch:cfg.branch})});
  const wr=await wrResp.json(); if(!wrResp.ok)throw new Error(wr?.message||`GitHub write HTTP ${wrResp.status}`);
  return json({ok:true,path,sha256:hash,commit:wr?.commit?.sha||null},200,request);
 }catch(e){return json({ok:false,error:String(e?.message||e)},409,request)}
}

async function handleAuthCheck(request,env){
  if(request.method!=="POST") return json({ok:false,error:"Method not allowed"},405,request);
  if(!env.LINA_LOGIN_CODE) return json({ok:false,error:"LINA_LOGIN_CODE saknas i Worker"},503,request);
  let body; try{body=await request.json()}catch{return json({ok:false,error:"Ogiltig begäran"},400,request)}
  if(String(body?.code||"")!==String(env.LINA_LOGIN_CODE)) return json({ok:false,error:"Fel lösenkod"},401,request);
  return json({ok:true},200,request);
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
    if (preUrl.pathname === "/auth-check") return handleAuthCheck(request, env);
    if (preUrl.pathname === "/app-state") return handleAppState(request, env);
    if (preUrl.pathname === "/evidence") return handleEvidence(request, env);

    if (preUrl.pathname === "/forward-state") {
      return handleForwardState(request, env);
    }

    if (request.method !== "GET") {
      return json(
        { ok: false, error: "Method not allowed" },
        405,
        request
      );
    }

    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "/health") {
      return json(
        {
          ok: true,
          service: "Linas Opti API",
          version: "0.58.8 + evidence-sync-v0235",
          mode: "paper",
          tradingEnabled: false,
          alpacaConfigured: Boolean(
            env.APCA_API_KEY_ID && env.APCA_API_SECRET_KEY
          ),
          eodhdConfigured: Boolean(env.EODHD_API_TOKEN),
          yahooHistoricalConfigured: true,
          loginCodeConfigured: !!env.LINA_LOGIN_CODE,
          githubForwardConfigured: Boolean(env.GITHUB_TOKEN),
        },
        200,
        request
      );
    }

    if (url.pathname === "/yahoo-bars") {
      return handleYahooBars(url, env, request);
    }

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
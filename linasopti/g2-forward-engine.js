(function(){
'use strict';
const VERSION='0.2.33';
const KEY='lina_clean_swing_g2_forward_v0207';
const API='https://linas-opti-api.mangaj73.workers.dev';
const ANCHOR='2026-09-11';
const WARMUP_START='2025-09-01';
const COST_SIDE=.001,CAPITAL=100000,RISK=.005,MAXPOS=5,MAXPOSPCT=.20;
const PARAMS={breakout:55,trend:'sma200',volume:1.5,regime:'spy200',stop:.07,target:.15,hold:10};
const HASH='15efd75a';
const SYMBOLS=['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA'];
function today(){return new Date().toISOString().slice(0,10)}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function fresh(){return{schema:'LINA-G2-REAL-FORWARD-1',version:'V0.2.33',candidateHash:HASH,anchor:ANCHOR,params:PARAMS,capital:CAPITAL,costSide:COST_SIDE,createdAt:new Date().toISOString(),lastMarketDate:null,lastRefreshAt:null,provider:null,closed:[],open:[],stats:null,milestones:{60:false,120:false,250:false},history:[]}}
function save(x){x.savedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(x));document.dispatchEvent(new CustomEvent('lina:g2forwardchange'));return x}
function rowsOf(j){return Array.isArray(j)?j:(j?.rows||j?.data||[])}
function norm(rows,symbol,provider){return rows.map(r=>({symbol:String(r.symbol||r.s||symbol).toUpperCase(),t:String(r.t||r.time||r.timestamp||''),o:+r.o,h:+r.h,l:+r.l,c:+r.c,v:+(r.v||0),provider})).filter(r=>r.symbol&&r.t&&[r.o,r.h,r.l,r.c].every(Number.isFinite))}
async function getSymbol(symbol,start,end){
 const tries=[
  ['Worker Yahoo daily',`/yahoo-bars?symbols=${encodeURIComponent(symbol)}&timeframe=1Day&start=${start}&end=${end}`],
  ['EODHD .US',`/eod-bars?symbols=${encodeURIComponent(symbol+'.US')}&timeframe=1Day&start=${start}&end=${end}`],
  ['Alpaca daily',`/bars?symbols=${encodeURIComponent(symbol)}&timeframe=1Day&start=${start}T00:00:00Z&end=${end}T23:59:59Z`]
 ];
 let errors=[];
 for(const [name,path] of tries){try{const r=await fetch(API+path,{cache:'no-store'});let j={};try{j=await r.json()}catch{}if(!r.ok)throw new Error(j.error||('HTTP '+r.status));const a=norm(rowsOf(j),symbol,name);if(a.length)return a;throw new Error('0 dagsrader')}catch(e){errors.push(name+': '+(e.message||e))}}
 throw new Error(symbol+' – '+errors.join(' | '));
}
function dateOf(r){return String(r.t).slice(0,10)}
function prep(rows){const by={};for(const r of rows)(by[r.symbol]??=[]).push(r);for(const a of Object.values(by))a.sort((x,y)=>x.t.localeCompare(y.t));return by}
function sma(a,i,n){if(i-n+1<0)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=a[k].c;return s/n}
function avgVol(a,i,n=20){if(i-n+1<0)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=+a[k].v||0;return s/n}
function prevHigh(a,i,n){if(i-n<0)return null;let h=-Infinity;for(let k=i-n;k<=i-1;k++)h=Math.max(h,a[k].c);return h}
function calcStats(closed,open,lastPrices){
 const n=closed.length,w=closed.filter(t=>t.pnl>0),l=closed.filter(t=>t.pnl<0),gp=w.reduce((s,t)=>s+t.pnl,0),gl=-l.reduce((s,t)=>s+t.pnl,0),pl=closed.reduce((s,t)=>s+t.pnl,0);
 let eq=CAPITAL,peak=CAPITAL,dd=0;for(const t of closed.slice().sort((a,b)=>a.exitDate.localeCompare(b.exitDate))){eq+=t.pnl;peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1)}
 const unrealized=open.reduce((s,q)=>{const px=lastPrices[q.symbol]||q.entryRaw;return s+q.shares*px-q.cost},0);
 return{n,pl,pf:gl?gp/gl:(gp?Infinity:0),wr:n?w.length/n:0,dd,unrealized,open:open.length,equity:CAPITAL+pl+unrealized};
}
function simulate(rows){
 const by=prep(rows),spy=by.SPY||[],symbols=SYMBOLS.filter(s=>by[s]?.length),dates=[...new Set(rows.map(dateOf))].sort(),maps={};for(const s of symbols)maps[s]=new Map(by[s].map((r,i)=>[dateOf(r),i]));const spyMap=new Map(spy.map((r,i)=>[dateOf(r),i]));
 let cash=CAPITAL,pos={},closed=[];
 for(let di=1;di<dates.length;di++){
  const date=dates[di],sigDate=dates[di-1];
  if(date<ANCHOR)continue;
  for(const s of Object.keys(pos)){const idx=maps[s].get(date);if(idx==null)continue;const bar=by[s][idx],q=pos[s],age=di-q.entryDI,stop=q.entryRaw*(1-PARAMS.stop),target=q.entryRaw*(1+PARAMS.target);let raw=null,why='';if(bar.l<=stop){raw=stop;why='stop'}else if(bar.h>=target){raw=target;why='target'}else if(age>=PARAMS.hold){raw=bar.c;why='maxhold'}if(raw!=null){const exit=raw*(1-COST_SIDE),value=q.shares*exit,pnl=value-q.cost;cash+=value;closed.push({symbol:s,entryDate:q.entryDate,exitDate:date,entry:q.entry,exit,entryRaw:q.entryRaw,shares:q.shares,pnl,ret:exit/q.entry-1,why});delete pos[s]}}
  let cand=[];
  for(const s of symbols){if(pos[s])continue;const si=maps[s].get(sigDate),ti=maps[s].get(date);if(si==null||ti==null)continue;const a=by[s];if(si<205)continue;const close=a[si].c,ph=prevHigh(a,si,PARAMS.breakout);if(!(ph&&close>ph))continue;const sm=sma(a,si,200);if(!(sm&&close>sm))continue;const av=avgVol(a,si-1,20);if(!(av>0&&a[si].v>=av*PARAMS.volume))continue;const spi=spyMap.get(sigDate),ss=spi==null?null:sma(spy,spi,200);if(!(ss&&spy[spi].c>ss))continue;const mom20=si>=20?close/a[si-20].c-1:0,breakoutPct=close/ph-1;cand.push({s,score:mom20+breakoutPct*2,open:a[ti].o})}
  cand.sort((a,b)=>b.score-a.score);
  while(cand.length&&Object.keys(pos).length<MAXPOS){const c=cand.shift(),mark=Object.values(pos).reduce((s,q)=>s+q.cost,0),eq=cash+mark,entryRaw=c.open,entry=entryRaw*(1+COST_SIDE),riskCash=eq*RISK,riskPerShare=Math.max(.0001,entryRaw*PARAMS.stop),shares=Math.min(riskCash/riskPerShare,(eq*MAXPOSPCT)/entry,cash/entry);if(!(shares>0))break;const cost=shares*entry;if(cost>cash)break;cash-=cost;pos[c.s]={symbol:c.s,entryRaw,entry,shares,cost,entryDate:date,entryDI:di}}
 }
 const last=dates.at(-1),lastPrices={};if(last)for(const s of symbols){const idx=maps[s].get(last);if(idx!=null)lastPrices[s]=by[s][idx].c}
 const open=Object.values(pos).map(q=>({...q,lastPrice:lastPrices[q.symbol]||q.entryRaw,unrealized:q.shares*(lastPrices[q.symbol]||q.entryRaw)-q.cost}));
 return{closed,open,lastMarketDate:last,stats:calcStats(closed,open,lastPrices)};
}
async function refresh(progress){
 let rows=[],providers=new Set(),end=today(),all=[...SYMBOLS,'SPY'];
 for(let i=0;i<all.length;i++){const s=all[i];progress?.(`Hämtar ${s} · ${i+1}/${all.length}`);const a=await getSymbol(s,WARMUP_START,end);a.forEach(r=>providers.add(r.provider));rows.push(...a)}
 rows.sort((a,b)=>a.t.localeCompare(b.t)||a.symbol.localeCompare(b.symbol));
 const sim=simulate(rows),x=load()||fresh(),oldN=x.closed?.length||0,oldDate=x.lastMarketDate;
 x.closed=sim.closed;x.open=sim.open;x.stats=sim.stats;x.lastMarketDate=sim.lastMarketDate;x.lastRefreshAt=new Date().toISOString();x.provider=[...providers].join(' → ');
 for(const m of [60,120,250])if(x.closed.length>=m)x.milestones[m]=true;
 if(oldN!==x.closed.length||oldDate!==x.lastMarketDate)x.history.push({at:x.lastRefreshAt,event:'REFRESH',marketDate:x.lastMarketDate,closed:x.closed.length,pl:x.stats.pl,pf:x.stats.pf});
 if(x.history.length>80)x.history=x.history.slice(-80);
 return save(normalizeState(x));
}
function stableNum(n){return Number(n||0).toFixed(8)}
function tradeId(t,kind='CLOSED'){
 const parts=[kind,String(t.symbol||''),String(t.entryDate||''),String(t.exitDate||''),stableNum(t.entryRaw??t.entry),stableNum(t.shares),String(t.modelMonth||''),String(t.modelHash||'')];
 return parts.join('|');
}
function normalizeState(x){
 if(!x)return x;
 x.closed=(x.closed||[]).map(t=>({...t,tradeId:t.tradeId||tradeId(t,'CLOSED')}));
 x.open=(x.open||[]).map(t=>({...t,tradeId:t.tradeId||tradeId(t,'OPEN')}));
 x.history=Array.isArray(x.history)?x.history:[];
 x.milestones=x.milestones||{60:false,120:false,250:false};
 return x;
}
function report(){
 const x=load()||fresh(),s=x.stats||{n:0,pl:0,pf:0,wr:0,dd:0,unrealized:0,open:0,equity:CAPITAL};
 const f=n=>Number(n).toLocaleString('sv-SE',{maximumFractionDigits:2}),pct=n=>(100*Number(n)).toFixed(2)+'%';
 return ['LINAS OPTI – G2 REAL FORWARD / PAPER','Clean Core: V0.2.33','Kandidat: '+HASH,'Anchor: '+ANCHOR,'Handel: AVSTÄNGD','Regler: FRYSTA · ingen rescue/optimering','',
 'Senaste marknadsdag: '+(x.lastMarketDate||'ingen ännu'),'Senast hämtad: '+(x.lastRefreshAt||'aldrig'),'Provider: '+(x.provider||'—'),'',
 `Stängda affärer: ${s.n} · P/L ${f(s.pl)} · PF ${f(s.pf)} · WR ${pct(s.wr)} · DD ${pct(s.dd)}`,
 `Öppna positioner: ${s.open} · orealiserat ${f(s.unrealized)} · modell-equity ${f(s.equity)}`,
 `Milstolpar: 60 ${x.milestones[60]?'✓':'—'} · 120 ${x.milestones[120]?'✓':'—'} · 250 ${x.milestones[250]?'✓':'—'}`,'',
 'FRYSTA PARAMETRAR',JSON.stringify(PARAMS),'',
 'OBS: Forward räknar endast entries från och med 2026-09-11. Warmup-data före anchor används bara för SMA/breakout/volymhistorik. Ingen historisk affär före anchor får räknas.'].join('\n');
}
function download(text,name,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function exportReport(){download(report(),`LINAS_OPTI_G2_REAL_FORWARD_V0232_${today()}.txt`)}
function exportRaw(){const x=load()||fresh();download(JSON.stringify(x,null,2),`LINAS_OPTI_G2_REAL_FORWARD_RAW_V0232_${today()}.json`,'application/json')}
window.LinaG2ForwardEngine={VERSION,KEY,ANCHOR,HASH,PARAMS,SYMBOLS,load,fresh,save,refresh,report,exportReport,exportRaw,tradeId,normalizeState};
})();
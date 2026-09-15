(function(){
'use strict';
const VERSION='0.2.9',KEY='lina_clean_swing_g3_walkforward_v0209';
const API='https://linas-opti-api.mangaj73.workers.dev';
const DEV_START='2020-01-01',DEV_END='2022-12-31',WF_START='2023-01-01',WF_END='2026-09-10';
const COST=.001,CAPITAL=100000,RISK=.005,MAXPOS=5,MAXPOSPCT=.20,POOL_SIZE=12;
const SYMBOLS=['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA'];
const PLAN={
 name:'G3 Walk-Forward Learner',
 dev:[DEV_START,DEV_END],walkForward:[WF_START,WF_END],
 initialGrid:648,poolSize:POOL_SIZE,retrain:'första handelsdagen varje månad',
 learning:'expanding window; endast data t.o.m. föregående handelsdag',
 execution:'dagliga beslut; vald månadsmodell gäller nya entries tills nästa omträning',
 positionRule:'öppen position behåller stop/target/hold från modellen som gällde vid entry',
 noRescue:true
};
function emit(){document.dispatchEvent(new CustomEvent('lina:g3change'))}
function hash(obj){return window.LinaG2Engine.hash(obj)}
function fresh(){return{schema:'LINA-SWING-G3-WF-1',version:'V0.2.9',planLocked:false,planHash:null,lockedAt:null,status:'new',phase:'plan',candidatePool:null,retrains:[],closed:[],open:[],result:null,simulationCount:0,lastCompletedMonth:null,lastError:null,createdAt:new Date().toISOString()}}
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
function save(x){x.savedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(x));emit();return x}
function lock(){let x=load()||fresh();if(x.planLocked)return x;x.planLocked=true;x.lockedAt=new Date().toISOString();x.planHash=hash(PLAN);x.status='locked';x.phase='fetch';return save(x)}
function rowsOf(j){return Array.isArray(j)?j:(j?.rows||j?.data||[])}
function norm(rows,symbol,provider){return rows.map(r=>({symbol:String(r.symbol||r.s||symbol).replace('.US','').toUpperCase(),t:String(r.t||r.time||r.timestamp||''),o:+r.o,h:+r.h,l:+r.l,c:+r.c,v:+(r.v||0),provider})).filter(r=>r.symbol&&r.t&&[r.o,r.h,r.l,r.c].every(Number.isFinite))}
async function bridge(path){const r=await fetch(API+path,{cache:'no-store'});let j={};try{j=await r.json()}catch{}if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j}
async function fetchSymbol(symbol,start,end,progress){
 const attempts=[
  ['Worker Yahoo daily',`/yahoo-bars?symbols=${encodeURIComponent(symbol)}&timeframe=1Day&start=${start}&end=${end}`],
  ['EODHD .US',`/eod-bars?symbols=${encodeURIComponent(symbol+'.US')}&timeframe=1Day&start=${start}&end=${end}`],
  ['Alpaca daily',`/bars?symbols=${encodeURIComponent(symbol)}&timeframe=1Day&start=${start}T00:00:00Z&end=${end}T23:59:59Z`]
 ];
 let errs=[];
 for(let cycle=1;cycle<=2;cycle++)for(const [name,path] of attempts){try{progress?.(`${symbol} · ${name} · försök ${cycle}/2`);const j=await Promise.race([bridge(path),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout 60 s')),60000))]);const a=norm(rowsOf(j),symbol,name);if(a.length)return a;throw new Error('0 dagsrader')}catch(e){errs.push(name+': '+(e.message||e))}}
 throw new Error(symbol+': '+errs.slice(-3).join(' | '));
}
async function fetchAll(progress){
 let rows=[],providers=new Set(),all=[...SYMBOLS,'SPY'];
 for(let i=0;i<all.length;i++){progress?.(`Data ${i+1}/${all.length} · ${all[i]} · ${DEV_START} → ${WF_END}`);const a=await fetchSymbol(all[i],DEV_START,WF_END,progress);a.forEach(r=>providers.add(r.provider));rows.push(...a)}
 return{rows:window.LinaG2Engine.normRows(rows),providers:[...providers]};
}
function dateOf(r){return String(r.t).slice(0,10)}
function cut(rows,end,start=DEV_START){return rows.filter(r=>{const d=dateOf(r);return d>=start&&d<=end})}
function yearsIn(rows){return[...new Set(rows.map(r=>dateOf(r).slice(0,4)))].sort()}
function statsYears(rows,p){
 return yearsIn(rows).map(year=>{const a=cut(rows,year+'-12-31',year+'-01-01'),r=window.LinaG2Engine.engine(a,p);return{year,n:r.n,pl:r.pl,pf:r.pf,wr:r.wr,dd:r.dd}});
}
function score(r,ys){
 if(!r||r.n<30||!Number.isFinite(r.pf))return-1e12;
 const positive=ys.filter(y=>y.pl>0).length,worst=Math.min(...ys.map(y=>y.pl)),ratio=ys.length?positive/ys.length:0;
 return(r.pf-1)*100+ratio*24+Math.min(20,r.n/12)+r.dd*160+Math.min(0,worst/600);
}
async function initialPool(rows,x,progress){
 const dev=cut(rows,DEV_END),vars=window.LinaG2Engine.variants(),results=[];
 for(let i=0;i<vars.length;i++){const p=vars[i],r=window.LinaG2Engine.engine(dev,p),ys=statsYears(dev,p);results.push({p,score:score(r,ys),n:r.n,pl:r.pl,pf:r.pf,dd:r.dd});x.simulationCount++;if(i%12===0){progress?.(`G3 träning 2020–2022 · ${i+1}/${vars.length}`);await new Promise(r=>setTimeout(r,0))}}
 results.sort((a,b)=>b.score-a.score);
 x.candidatePool=results.slice(0,POOL_SIZE).map((z,i)=>({rank:i+1,hash:hash(z.p),...z}));
 x.phase='walk-forward';save(x);return x.candidatePool;
}
function monthKeys(rows){return[...new Set(rows.map(r=>dateOf(r)).filter(d=>d>=WF_START&&d<=WF_END).map(d=>d.slice(0,7)))].sort()}
function lastDateBefore(rows,month){const ds=[...new Set(rows.map(dateOf))].filter(d=>d<month+'-01').sort();return ds.at(-1)||DEV_END}
async function chooseMonth(rows,pool,month,x,progress){
 const trainEnd=lastDateBefore(rows,month),train=cut(rows,trainEnd),rank=[];
 for(let i=0;i<pool.length;i++){const z=pool[i],r=window.LinaG2Engine.engine(train,z.p),ys=statsYears(train,z.p);rank.push({hash:z.hash,p:z.p,score:score(r,ys),n:r.n,pl:r.pl,pf:r.pf,dd:r.dd});x.simulationCount++;progress?.(`Omträning ${month} · ${i+1}/${pool.length}`);if(i%4===0)await new Promise(r=>setTimeout(r,0))}
 rank.sort((a,b)=>b.score-a.score);const best=rank[0];
 const rec={month,trainEnd,selectedHash:best.hash,params:best.p,score:best.score,train:{n:best.n,pl:best.pl,pf:best.pf,dd:best.dd},evaluated:pool.length};
 x.retrains.push(rec);x.lastCompletedMonth=month;save(x);return rec;
}
function prep(rows){const by={};for(const r of rows)(by[r.symbol]??=[]).push(r);for(const a of Object.values(by))a.sort((x,y)=>x.t.localeCompare(y.t));return by}
function sma(a,i,n){if(i-n+1<0)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=a[k].c;return s/n}
function avgVol(a,i,n=20){if(i-n+1<0)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=a[k].v||0;return s/n}
function prevHigh(a,i,n){if(i-n<0)return null;let h=-Infinity;for(let k=i-n;k<=i-1;k++)h=Math.max(h,a[k].c);return h}
function tradeStats(closed){
 const n=closed.length,w=closed.filter(t=>t.pnl>0),l=closed.filter(t=>t.pnl<0),gp=w.reduce((s,t)=>s+t.pnl,0),gl=-l.reduce((s,t)=>s+t.pnl,0),pl=closed.reduce((s,t)=>s+t.pnl,0);
 let eq=CAPITAL,peak=CAPITAL,dd=0;for(const t of closed.slice().sort((a,b)=>a.exitDate.localeCompare(b.exitDate))){eq+=t.pnl;peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1)}
 return{n,pl,pf:gl?gp/gl:(gp?Infinity:0),wr:n?w.length/n:0,dd,avg:n?pl/n:0,final:CAPITAL+pl};
}
function execute(rows,retrains){
 const by=prep(rows),spy=by.SPY||[],symbols=SYMBOLS.filter(s=>by[s]?.length),dates=[...new Set(rows.map(dateOf))].sort(),maps={},spyMap=new Map(spy.map((r,i)=>[dateOf(r),i]));
 for(const s of symbols)maps[s]=new Map(by[s].map((r,i)=>[dateOf(r),i]));
 const modelByMonth=new Map(retrains.map(r=>[r.month,r]));
 let cash=CAPITAL,pos={},closed=[];
 for(let di=1;di<dates.length;di++){
  const date=dates[di];if(date<WF_START||date>WF_END)continue;const sigDate=dates[di-1],model=modelByMonth.get(date.slice(0,7));if(!model)continue;
  for(const s of Object.keys(pos)){const idx=maps[s].get(date);if(idx==null)continue;const bar=by[s][idx],q=pos[s],p=q.params,age=di-q.entryDI,stop=q.entryRaw*(1-p.stop),target=q.entryRaw*(1+p.target);let raw=null,why='';if(bar.l<=stop){raw=stop;why='stop'}else if(bar.h>=target){raw=target;why='target'}else if(age>=p.hold){raw=bar.c;why='maxhold'}if(raw!=null){const exit=raw*(1-COST),value=q.shares*exit,pnl=value-q.cost;cash+=value;closed.push({symbol:s,entryDate:q.entryDate,exitDate:date,entry:q.entry,exit,entryRaw:q.entryRaw,shares:q.shares,pnl,ret:exit/q.entry-1,why,modelMonth:q.modelMonth,modelHash:q.modelHash,params:q.params});delete pos[s]}}
  let cand=[],p=model.params;
  for(const s of symbols){if(pos[s])continue;const si=maps[s].get(sigDate),ti=maps[s].get(date);if(si==null||ti==null)continue;const a=by[s],need=Math.max(p.breakout+1,p.trend==='sma200'?205:p.trend==='sma100'?105:25,25);if(si<need)continue;const close=a[si].c,ph=prevHigh(a,si,p.breakout);if(!(ph&&close>ph))continue;if(p.trend!=='off'){const n=p.trend==='sma200'?200:100,sm=sma(a,si,n);if(!(sm&&close>sm))continue}if(p.volume!=='off'){const av=avgVol(a,si-1,20);if(!(av>0&&a[si].v>=av*p.volume))continue}if(p.regime!=='off'){const spi=spyMap.get(sigDate),n=p.regime==='spy200'?200:100;if(spi==null)continue;const ss=sma(spy,spi,n);if(!(ss&&spy[spi].c>ss))continue}const mom20=si>=20?close/a[si-20].c-1:0,breakoutPct=close/ph-1;cand.push({s,score:mom20+breakoutPct*2,open:a[ti].o})}
  cand.sort((a,b)=>b.score-a.score);
  while(cand.length&&Object.keys(pos).length<MAXPOS){const c=cand.shift(),mark=Object.values(pos).reduce((s,q)=>s+q.cost,0),eq=cash+mark,entryRaw=c.open,entry=entryRaw*(1+COST),riskCash=eq*RISK,riskPerShare=Math.max(.0001,entryRaw*p.stop),shares=Math.min(riskCash/riskPerShare,(eq*MAXPOSPCT)/entry,cash/entry);if(!(shares>0))break;const cost=shares*entry;if(cost>cash)break;cash-=cost;pos[c.s]={symbol:c.s,entryRaw,entry,shares,cost,entryDate:date,entryDI:di,params:{...p},modelMonth:model.month,modelHash:model.selectedHash}}
 }
 const last=dates.filter(d=>d<=WF_END).at(-1);if(last)for(const s of Object.keys(pos)){const idx=maps[s].get(last);if(idx==null)continue;const q=pos[s],raw=by[s][idx].c,exit=raw*(1-COST),value=q.shares*exit,pnl=value-q.cost;closed.push({symbol:s,entryDate:q.entryDate,exitDate:last,entry:q.entry,exit,entryRaw:q.entryRaw,shares:q.shares,pnl,ret:exit/q.entry-1,why:'periodend',modelMonth:q.modelMonth,modelHash:q.modelHash,params:q.params})}
 return{...tradeStats(closed),closed};
}
async function run(progress){
 let x=load();if(!x?.planLocked)throw new Error('Lås G3-planen först.');x.status='running';x.lastError=null;save(x);
 try{
  progress?.('Hämtar en gemensam daglig datasnapshot 2020–2026…');const data=await fetchAll(progress),rows=data.rows;
  if(!x.candidatePool){x.phase='training';save(x);await initialPool(rows,x,progress);x=load()}
  const months=monthKeys(rows),done=new Set((x.retrains||[]).map(r=>r.month));
  for(let i=0;i<months.length;i++){const m=months[i];if(done.has(m))continue;progress?.(`Walk-forward ${i+1}/${months.length} · ${m}`);await chooseMonth(rows,x.candidatePool,m,x,progress);x=load()}
  progress?.('Spelar nu 2023–2026 dag för dag med endast då känd månadsmodell…');
  const result=execute(rows,x.retrains);x=load();x.result={start:WF_START,end:WF_END,n:result.n,pl:result.pl,pf:result.pf,wr:result.wr,dd:result.dd,avg:result.avg,final:result.final,closed:result.closed};x.providers=data.providers;x.status='complete';x.phase='complete';x.finishedAt=new Date().toISOString();save(x);return x;
 }catch(e){x=load()||x||fresh();x.status='error';x.lastError={at:new Date().toISOString(),message:e?.message||String(e)};save(x);throw e}
}
function report(){
 const x=load()||fresh(),r=x.result;const f=n=>Number(n).toLocaleString('sv-SE',{maximumFractionDigits:2}),pct=n=>(100*Number(n)).toFixed(2)+'%';
 const L=['LINAS OPTI – G3 WALK-FORWARD LEARNER','Clean Core: V0.2.9','Handel: AVSTÄNGD','Plan låst: '+(x.planLocked?'JA':'NEJ')+' · '+(x.planHash||'—'),'',
 'METOD','Träning/pool: 2020-01-01 → 2022-12-31.','648 G2-gridvarianter rankas endast på 2020–2022; topp 12 blir permanent kandidatpool.','Från 2023 väljs modell på första handelsdagen varje månad, endast från topp-12-poolen och endast med data t.o.m. föregående handelsdag.','Dagliga entries använder månadens valda modell. Öppna positioner behåller reglerna från sin entry.','Ingen rescue eller efteroptimering efter resultat.','',
 `Simuleringar i just G3: ${x.simulationCount||0}`,`Omträningar: ${(x.retrains||[]).length}`,`Provider: ${(x.providers||[]).join(' → ')||'—'}`,'',
 'VIKTIGT','2023–2026 är inte längre helt orörd data eftersom tidigare Lina/G2-resultat redan har observerats. G3 är därför ett walk-forward-metodtest, inte ny oberoende OOS-evidens.'];
 if(r)L.push('','RESULTAT',`${r.n} affärer · P/L ${f(r.pl)} · PF ${f(r.pf)} · WR ${pct(r.wr)} · DD ${pct(r.dd)} · slut ${f(r.final)}`,'','JÄMFÖRELSEFACIT','G2 fryst pseudo-forward: 144 affärer · +13 708,85 · PF 1,467 · WR 50,0 % · DD -2,34 %.','G3 får inte ersätta G2 enbart för att den råkar slå detta historiska facit.');
 if(x.retrains?.length){L.push('','MÅNADSMODELLER');for(const q of x.retrains)L.push(`${q.month} · ${q.selectedHash} · train t.o.m. ${q.trainEnd} · PF ${Number(q.train.pf).toFixed(2)} · P/L ${f(q.train.pl)}`)}
 return L.join('\n');
}
function download(text,name,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function exportReport(){download(report(),`LINAS_OPTI_G3_WALK_FORWARD_V0209_${new Date().toISOString().slice(0,10)}.txt`)}
function exportRaw(){const x=load();if(x)download(JSON.stringify(x,null,2),`LINAS_OPTI_G3_WALK_FORWARD_RAW_V0209_${new Date().toISOString().slice(0,10)}.json`,'application/json')}
function reset(){localStorage.removeItem(KEY);emit()}
window.LinaG3Engine={VERSION,KEY,PLAN,load,fresh,save,lock,run,report,exportReport,exportRaw,reset};
})();
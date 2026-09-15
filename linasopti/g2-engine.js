(function(){
  'use strict';
  const API_BASE='https://linas-opti-api.mangaj73.workers.dev';
  const KEY='lina_clean_swing_g2_v0200';
  const LEGACY_KEY='linasopti_swing_g2_v0560';
  const GENERATION='SWING-G2';
  const DEV_START='2020-01-01', DEV_END='2022-12-31';
  const OOS_START='2023-01-01', OOS_END='2026-09-10';
  const COST_SIDE=.001, CAPITAL=100000, RISK=.005, MAXPOS=5, MAXPOSPCT=.20;
  const SYMBOLS=['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA'];
  const GRID={breakout:[20,55,100],trend:['off','sma100','sma200'],volume:['off',1.2,1.5],regime:['off','spy100','spy200'],stop:[.05,.07],target:[.10,.15],hold:[10,20]};
  const STAGES=[
    ['A','Dataintegritet','DEV hämtas och granskas utan pseudo-forward'],['B','Baseline','Förregistrerad 55d breakout-baslinje'],
    ['C','Breakoutfamilj','20 / 55 / 100 handelsdagar'],['D','Trendfilter','off / SMA100 / SMA200'],
    ['E','Volymbekräftelse','off / 1,2× / 1,5× 20d'],['F','SPY-regim','off / SMA100 / SMA200'],
    ['G','Exitfamilj','stop / mål / hålltid + bästa DEV-kandidat'],['H','Friktion','1× / 1,5× / 2× kostnad'],
    ['I','Kapital/risk','kapitalutnyttjande och blockerade signaler'],['J','Årsstabilitet','2020 / 2021 / 2022'],
    ['K','Leave-one-symbol-out','alla 16 symboler'],['L','Bootstrap','2 000 omsamplingar av DEV-affärer'],
    ['M','Kandidatfrysning','exakt G2-kandidat + hash låses'],['N','Låst pseudo-forward','2023 → 2026-09-10 öppnas först efter M'],
    ['O','Slutrapport','ingen rescue eller efteroptimering']
  ];
  function emit(){document.dispatchEvent(new CustomEvent('lina:g2change'));}
  function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch{return null}}
  function fresh(){return{schema:'LINA-SWING-G2-1',version:'V0.56.0',generation:GENERATION,planLocked:false,lockedAt:null,dev:[DEV_START,DEV_END],lockedPseudoForward:[OOS_START,OOS_END],stages:{},stage:0,fetch:{},devRows:null,gridResults:null,candidate:null,pseudoForward:null,final:null,trialLedger:[]}}
  function save(x){x.savedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(x));emit();return x}
  function hash(obj){const s=typeof obj==='string'?obj:JSON.stringify(obj);let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return(h>>>0).toString(16).padStart(8,'0')}
  function variants(){const out=[];for(const breakout of GRID.breakout)for(const trend of GRID.trend)for(const volume of GRID.volume)for(const regime of GRID.regime)for(const stop of GRID.stop)for(const target of GRID.target)for(const hold of GRID.hold)out.push({breakout,trend,volume,regime,stop,target,hold});return out}
  function lock(){let x=load()||fresh();if(x.planLocked)return x;x.planLocked=true;x.lockedAt=new Date().toISOString();x.planHash=hash({generation:GENERATION,dev:x.dev,oos:x.lockedPseudoForward,grid:GRID,costSide:COST_SIDE,risk:RISK,maxPos:MAXPOS,maxPosPct:MAXPOSPCT,signal:'prior close > highest prior N closes; next-day open entry'});x.trialLedger.push({at:x.lockedAt,event:'PLAN_LOCK',planHash:x.planHash,gridVariants:variants().length});return save(x)}
  function rowsOf(j){return Array.isArray(j)?j:(j?.rows||j?.data||[])}
  function normRows(rows){return rows.map(r=>({symbol:String(r.symbol||r.s||'').toUpperCase(),t:String(r.t||r.time||r.timestamp||''),o:+r.o,h:+r.h,l:+r.l,c:+r.c,v:+(r.v||0),provider:r.provider||r.source||null})).filter(r=>r.symbol&&r.t&&[r.o,r.h,r.l,r.c].every(Number.isFinite)).sort((a,b)=>a.t.localeCompare(b.t)||a.symbol.localeCompare(b.symbol))}
  function prep(rows){const by={};for(const r of rows)(by[r.symbol]??=[]).push(r);for(const a of Object.values(by))a.sort((x,y)=>x.t.localeCompare(y.t));return by}
  function dateOf(r){return String(r.t).slice(0,10)}
  function sma(a,i,n){if(i-n+1<0)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=a[k].c;return s/n}
  function avgVol(a,i,n=20){if(i-n+1<0)return null;let s=0;for(let k=i-n+1;k<=i;k++)s+=(+a[k].v||0);return s/n}
  function prevCloseHigh(a,i,n){if(i-n<0)return null;let h=-Infinity;for(let k=i-n;k<=i-1;k++)h=Math.max(h,a[k].c);return h}
  function tradeStats(closed,capital=CAPITAL){const n=closed.length,w=closed.filter(x=>x.pnl>0),l=closed.filter(x=>x.pnl<0),gw=w.reduce((s,x)=>s+x.pnl,0),gl=-l.reduce((s,x)=>s+x.pnl,0),pl=closed.reduce((s,x)=>s+x.pnl,0);let eq=capital,peak=capital,dd=0;for(const t of closed.slice().sort((a,b)=>a.exitDate.localeCompare(b.exitDate))){eq+=t.pnl;peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1)}return{n,pl,final:capital+pl,pf:gl?gw/gl:(gw?Infinity:0),wr:n?w.length/n:0,dd,avg:n?pl/n:0}}
  function engine(rows,p,costSide=COST_SIDE,allowedSymbols=null){
    const by=prep(rows),spy=by.SPY||[],symbols=(allowedSymbols||SYMBOLS).filter(s=>by[s]?.length),spyMap=new Map(spy.map((r,i)=>[dateOf(r),i])),dates=[...new Set(rows.map(dateOf))].sort(),maps={};for(const s of symbols)maps[s]=new Map(by[s].map((r,i)=>[dateOf(r),i]));
    let cash=CAPITAL,pos={},closed=[],capitalUseSum=0,capitalUseN=0,blocked=0;
    for(let di=1;di<dates.length;di++){
      const date=dates[di],sigDate=dates[di-1];
      for(const s of Object.keys(pos)){const idx=maps[s].get(date);if(idx==null)continue;const bar=by[s][idx],q=pos[s],age=di-q.entryDI,stop=q.entryRaw*(1-p.stop),target=q.entryRaw*(1+p.target);let raw=null,why='';if(bar.l<=stop){raw=stop;why='stop'}else if(bar.h>=target){raw=target;why='target'}else if(age>=p.hold){raw=bar.c;why='maxhold'}if(raw!=null){const exit=raw*(1-costSide),value=q.shares*exit,pnl=value-q.cost;cash+=value;closed.push({symbol:s,entryDate:q.entryDate,exitDate:date,entry:q.entry,exit,entryRaw:q.entryRaw,shares:q.shares,pnl,ret:exit/q.entry-1,why});delete pos[s]}}
      let cand=[];
      for(const s of symbols){if(pos[s])continue;const si=maps[s].get(sigDate),ti=maps[s].get(date);if(si==null||ti==null)continue;const a=by[s],need=Math.max(p.breakout+1,p.trend==='sma200'?205:p.trend==='sma100'?105:25,25);if(si<need)continue;const close=a[si].c,priorHigh=prevCloseHigh(a,si,p.breakout);if(!(priorHigh&&close>priorHigh))continue;if(p.trend!=='off'){const n=p.trend==='sma200'?200:100,s=sma(a,si,n);if(!(s&&close>s))continue}if(p.volume!=='off'){const av=avgVol(a,si-1,20);if(!(av>0&&a[si].v>=av*p.volume))continue}if(p.regime!=='off'){const spi=spyMap.get(sigDate),n=p.regime==='spy200'?200:100;if(spi==null)continue;const ss=sma(spy,spi,n);if(!(ss&&spy[spi].c>ss))continue}const mom20=si>=20?close/a[si-20].c-1:0,breakoutPct=close/priorHigh-1;cand.push({s,score:mom20+breakoutPct*2,open:a[ti].o})}
      cand.sort((a,b)=>b.score-a.score);while(cand.length&&Object.keys(pos).length<MAXPOS){const c=cand.shift(),mark=Object.values(pos).reduce((s,q)=>s+q.cost,0),eq=cash+mark,entryRaw=c.open,entry=entryRaw*(1+costSide),riskCash=eq*RISK,riskPerShare=Math.max(.0001,entryRaw*p.stop),shares=Math.min(riskCash/riskPerShare,(eq*MAXPOSPCT)/entry,cash/entry);if(!(shares>0))break;const cost=shares*entry;if(cost>cash)break;cash-=cost;pos[c.s]={entryRaw,entry,shares,cost,entryDate:date,entryDI:di}}
      if(cand.length)blocked+=cand.length;const mark=Object.entries(pos).reduce((s,[sym,q])=>{const idx=maps[sym].get(date);return s+(idx==null?q.cost:q.shares*by[sym][idx].c)},0),eq=cash+mark;capitalUseSum+=eq?mark/eq:0;capitalUseN++
    }
    const last=dates.at(-1);if(last)for(const s of Object.keys(pos)){const idx=maps[s].get(last);if(idx==null)continue;const q=pos[s],raw=by[s][idx].c,exit=raw*(1-costSide),value=q.shares*exit,pnl=value-q.cost;cash+=value;closed.push({symbol:s,entryDate:q.entryDate,exitDate:last,entry:q.entry,exit,entryRaw:q.entryRaw,shares:q.shares,pnl,ret:exit/q.entry-1,why:'periodend'})}
    return {...tradeStats(closed,CAPITAL),closed,capitalUse:capitalUseN?capitalUseSum/capitalUseN:0,blocked,params:p,costSide}
  }
  function filter(rows,a,b){return rows.filter(r=>{const d=dateOf(r);return d>=a&&d<=b})}
  function yearStats(rows,p,cost=COST_SIDE){return ['2020','2021','2022'].map(year=>{const r=engine(filter(rows,year+'-01-01',year+'-12-31'),p,cost);return{year,n:r.n,pl:r.pl,pf:r.pf,wr:r.wr,dd:r.dd}})}
  function score(r,ys){if(!r||r.n<30||!Number.isFinite(r.pf))return-1e12;const positive=ys.filter(y=>y.pl>0).length,worst=Math.min(...ys.map(y=>y.pl));return(r.pf-1)*100+positive*8+Math.min(20,r.n/12)+r.dd*160+Math.min(0,worst/600)}
  function bootstrap(closed,n=2000){const vals=closed.map(t=>+t.pnl||0);if(!vals.length)return null;let sums=[];for(let i=0;i<n;i++){let s=0;for(let k=0;k<vals.length;k++)s+=vals[Math.floor(Math.random()*vals.length)];sums.push(s)}sums.sort((a,b)=>a-b);const q=p=>sums[Math.min(sums.length-1,Math.floor((sums.length-1)*p))];return{runs:n,p05:q(.05),median:q(.5),p95:q(.95),pPositive:sums.filter(x=>x>0).length/sums.length}}
  function monthChunks(start,end){const out=[];let d=new Date(start+'T00:00:00Z'),last=new Date(end+'T00:00:00Z');d=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),1));while(d<=last){const y=d.getUTCFullYear(),m=d.getUTCMonth(),a=`${y}-${String(m+1).padStart(2,'0')}-01`,e=new Date(Date.UTC(y,m+1,0)),b=`${e.getUTCFullYear()}-${String(e.getUTCMonth()+1).padStart(2,'0')}-${String(e.getUTCDate()).padStart(2,'0')}`;out.push([a<start?start:a,b>end?end:b]);d=new Date(Date.UTC(y,m+1,1))}return out}
  async function bridge(path){const r=await fetch(API_BASE+path,{cache:'no-store'});let j={};try{j=await r.json()}catch{}if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j}
  function live(stage,detail=''){document.dispatchEvent(new CustomEvent('lina:g2live',{detail:{stage,detail}}))}
  async function fetchSymbol(symbol,start,end,label){let last=null;const failures=[],attempts=[{name:'Worker Yahoo daily',path:`/yahoo-bars?symbols=${encodeURIComponent(symbol)}&timeframe=1Day&start=${start}&end=${end}`},{name:'EODHD .US',path:`/eod-bars?symbols=${encodeURIComponent(symbol+'.US')}&timeframe=1Day&start=${start}&end=${end}`},{name:'Alpaca daily',path:`/bars?symbols=${encodeURIComponent(symbol)}&timeframe=1Day&start=${start}T00:00:00Z&end=${end}T23:59:59Z`}];for(let cycle=1;cycle<=2;cycle++){for(const src of attempts){try{live(label,`${symbol} · ${start} → ${end} · ${src.name} · försök ${cycle}/2`);const j=await Promise.race([bridge(src.path),new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout 60 s')),60000))]);let rows=rowsOf(j);if(!rows.length){const details=Array.isArray(j?.errors)&&j.errors.length?j.errors.map(x=>`${x.symbol||symbol}: ${x.error||x.status||'fel'}`).join('; '):'0 dagsrader';throw new Error(details)}rows=rows.map(r=>({...r,symbol,s:symbol,provider:src.name}));return rows}catch(e){const msg=`${src.name}: ${e?.message||e}`;failures.push(msg);last=e}}if(cycle<2)await new Promise(r=>setTimeout(r,1800))}throw new Error(`${symbol} ${start}–${end}: ${failures.slice(-3).join(' | ')||last?.message||'ingen dagsdata'}`)}
  async function fetchChunked(x,key,start,end,label){const chunks=monthChunks(start,end),symbols=[...SYMBOLS,'SPY'];x.fetch??={};if(!x.fetch[key]||x.fetch[key].mode!=='g2-symbol-month-daily-4'){x.fetch[key]={mode:'g2-symbol-month-daily-4',month:0,symbol:0,rows:[]};save(x)}const f=x.fetch[key];while(f.month<chunks.length){const[a,b]=chunks[f.month];while(f.symbol<symbols.length){const sym=symbols[f.symbol];live(label,`Månad ${f.month+1}/${chunks.length} · symbol ${f.symbol+1}/${symbols.length} ${sym} · dagsdata · ${a} → ${b}`);const daily=await fetchSymbol(sym,a,b,label);if(!daily.length)throw new Error(`0 dagsrader: ${sym} ${a}–${b}`);f.rows.push(...daily);f.symbol++;x.fetch[key]=f;save(x);await new Promise(r=>setTimeout(r,20))}f.month++;f.symbol=0;x.fetch[key]=f;save(x)}const rows=f.rows;delete x.fetch[key];save(x);return rows}
  function means(grid,key,values){const o={};for(const v of values){const q=grid.filter(z=>z.p[key]===v);o[String(v)]=q.length?q.reduce((s,z)=>s+z.score,0)/q.length:null}return o}
  function done(x,letter,data,label='KLAR'){x.stages[letter]={status:label,at:new Date().toISOString(),...data};x.stage=Math.max(x.stage,STAGES.findIndex(s=>s[0]===letter)+1);save(x)}
  function compactAfterM(x){
    if(!x?.stages?.M)return x;
    let changed=false;
    if(x.devRows){delete x.devRows;changed=true}
    if(x.gridResults){delete x.gridResults;changed=true}
    if(x.fetch?.dev){delete x.fetch.dev;changed=true}
    if(changed){x.storageCompactedAt=new Date().toISOString();x.trialLedger??=[];x.trialLedger.push({at:x.storageCompactedAt,event:'STORAGE_COMPACT_AFTER_M',keptOosCheckpoint:Boolean(x.fetch?.oos)});}
    return x;
  }
  async function run(){let x=load();if(!x?.planLocked)throw new Error('Lås G2-planen först.');if(x.stages?.M&&!x.stages?.N){x=compactAfterM(x);save(x)}x.runStatus='running';x.runStartedAt=new Date().toISOString();x.lastError=null;save(x);live('STARTAR G2','Förbereder A · Dataintegritet');try{
    if(!x.stages.A){const raw=await fetchChunked(x,'dev',DEV_START,DEV_END,'A · Dataintegritet'),rows=normRows(raw),dupes=rows.length-new Map(rows.map(r=>[r.symbol+'|'+dateOf(r),r])).size,symbols=[...new Set(rows.map(r=>r.symbol))],dates=[...new Set(rows.map(dateOf))],providers=[...new Set(rows.map(r=>r.provider).filter(Boolean))];x.devRows=rows;done(x,'A',{summary:`${rows.length.toLocaleString('sv-SE')} dagsrader · ${symbols.length} symboler · ${dates.length} datum · ${dupes} dubletter`,rows:rows.length,symbols,dates:dates.length,duplicates:dupes,providers});}
    x=load();const rows=x.devRows;
    if(!x.stages.B){const p={breakout:55,trend:'sma100',volume:'off',regime:'spy100',stop:.07,target:.15,hold:20},r=engine(rows,p);done(x,'B',{summary:`Baseline · ${r.n} affärer · P/L ${r.pl.toFixed(0)} · PF ${r.pf.toFixed(2)} · DD ${(r.dd*100).toFixed(1)}%`,params:p,result:{n:r.n,pl:r.pl,pf:r.pf,wr:r.wr,dd:r.dd}})}
    x=load();if(!x.stages.G&&!x.gridResults){const vars=variants(),results=[];for(let i=0;i<vars.length;i++){const p=vars[i],r=engine(rows,p),ys=yearStats(rows,p),sc=score(r,ys);results.push({i,p,n:r.n,pl:r.pl,pf:r.pf,wr:r.wr,dd:r.dd,avg:r.avg,score:sc,years:ys});if(i%12===0){live('B–G · DEV-grid',`${i+1}/${vars.length} varianter`);await new Promise(r=>setTimeout(r,0))}}x.gridResults=results;x.trialLedger.push({at:new Date().toISOString(),event:'DEV_GRID_COMPLETE',trials:results.length});save(x)}
    x=load();const grid=x.gridResults;if(!x.stages.C)done(x,'C',{summary:'Breakout 20/55/100d kartlagd',means:means(grid,'breakout',GRID.breakout)});x=load();if(!x.stages.D)done(x,'D',{summary:'Trendfilter off/SMA100/SMA200 kartlagt',means:means(grid,'trend',GRID.trend)});x=load();if(!x.stages.E)done(x,'E',{summary:'Volymbekräftelse off/1,2×/1,5× kartlagd',means:means(grid,'volume',GRID.volume)});x=load();if(!x.stages.F)done(x,'F',{summary:'SPY-regim off/SMA100/SMA200 kartlagd',means:means(grid,'regime',GRID.regime)});
    x=load();if(!x.stages.G){const best=grid.slice().sort((a,b)=>b.score-a.score)[0];done(x,'G',{summary:`Bästa DEV-kandidat · ${best.n} affärer · P/L ${best.pl.toFixed(0)} · PF ${best.pf.toFixed(2)} · DD ${(best.dd*100).toFixed(1)}%`,best})}
    x=load();const best=x.stages.G.best;if(!x.stages.H){const stress=[1,1.5,2].map(mult=>{const r=engine(rows,best.p,COST_SIDE*mult);return{mult,n:r.n,pl:r.pl,pf:r.pf,dd:r.dd}});done(x,'H',{summary:`Friktion 1×/1,5×/2×: ${stress.map(s=>s.pl.toFixed(0)).join(' / ')} kr`,stress})}
    x=load();if(!x.stages.I){const r=engine(rows,best.p);done(x,'I',{summary:`Kapital i arbete avg ${(r.capitalUse*100).toFixed(1)}% · ${r.blocked} blockerade kandidater`,capitalUse:r.capitalUse,blocked:r.blocked})}
    x=load();if(!x.stages.J){const ys=yearStats(rows,best.p),positive=ys.filter(y=>y.pl>0).length;done(x,'J',{summary:`${positive}/3 positiva år · ${ys.map(y=>`${y.year} ${y.pl.toFixed(0)}`).join(' | ')}`,years:ys})}
    x=load();if(!x.stages.K){const loo=[];for(const s of SYMBOLS){const rr=engine(rows,best.p,COST_SIDE,SYMBOLS.filter(x=>x!==s));loo.push({removed:s,n:rr.n,pl:rr.pl,pf:rr.pf,dd:rr.dd})}const worst=loo.slice().sort((a,b)=>a.pl-b.pl)[0];done(x,'K',{summary:`16/16 leave-one-symbol-out klara · sämst utan ${worst.removed}: ${worst.pl.toFixed(0)} kr`,loo})}
    x=load();if(!x.stages.L){const r=engine(rows,best.p),boot=bootstrap(r.closed,2000);done(x,'L',{summary:`Bootstrap 2 000 · P05 ${boot.p05.toFixed(0)} · median ${boot.median.toFixed(0)} · P>0 ${(boot.pPositive*100).toFixed(1)}%`,bootstrap:boot})}
    x=load();if(!x.stages.M){const r=engine(rows,best.p),h=hash({generation:GENERATION,params:best.p,costSide:COST_SIDE,risk:RISK,maxPos:MAXPOS,maxPosPct:MAXPOSPCT});x.candidate={frozenAt:new Date().toISOString(),hash:h,params:best.p,dev:{n:r.n,pl:r.pl,pf:r.pf,wr:r.wr,dd:r.dd,avg:r.avg}};x.trialLedger.push({at:x.candidate.frozenAt,event:'CANDIDATE_FREEZE',hash:h,params:best.p});done(x,'M',{summary:`FRYST · hash ${h} · ${r.n} affärer · PF ${r.pf.toFixed(2)} · P/L ${r.pl.toFixed(0)} kr`,candidate:x.candidate});x=load();x=compactAfterM(x);save(x)}
    x=load();if(!x.stages.N){if(!x.candidate?.hash)throw new Error('N får inte öppnas före kandidatfrysning M.');x.trialLedger.push({at:new Date().toISOString(),event:'LOCKED_PSEUDO_FORWARD_OPEN',start:OOS_START,end:OOS_END,candidateHash:x.candidate.hash});save(x);const raw=await fetchChunked(x,'oos',OOS_START,OOS_END,'N · Låst pseudo-forward'),oosRows=normRows(raw),r=engine(oosRows,x.candidate.params);x=load();x.pseudoForward={start:OOS_START,end:OOS_END,hash:x.candidate.hash,n:r.n,pl:r.pl,pf:r.pf,wr:r.wr,dd:r.dd,avg:r.avg,closed:r.closed};save(x);done(x,'N',{summary:`LÅST pseudo-forward · ${r.n} affärer · P/L ${r.pl.toFixed(0)} · PF ${r.pf.toFixed(2)} · DD ${(r.dd*100).toFixed(1)}%`,result:{n:r.n,pl:r.pl,pf:r.pf,wr:r.wr,dd:r.dd,avg:r.avg}})}
    x=load();if(!x.stages.O){const d=x.candidate.dev,o=x.pseudoForward;let verdict='SVAG / EJ VIDARE';if(o.n>=60&&o.pl>0&&o.pf>=1.08)verdict='POSITIV KANDIDAT';else if(o.n>=40&&o.pl>0&&o.pf>=1.00)verdict='POSITIV MEN TUNN';x.final={verdict,devPF:d.pf,pseudoPF:o.pf,devPL:d.pl,pseudoPL:o.pl,candidateHash:x.candidate.hash,noRescue:true};x.trialLedger.push({at:new Date().toISOString(),event:'FINAL',verdict,noRescue:true});done(x,'O',{summary:`${verdict} · DEV PF ${d.pf.toFixed(2)} → pseudo-forward PF ${o.pf.toFixed(2)} · ingen rescue`,final:x.final})}
    x=load();x.runStatus='complete';x.runFinishedAt=new Date().toISOString();x.lastError=null;save(x);live('A–O KLART',`${load().final.verdict} · nästa beslut tas utan att ändra G2-reglerna.`);return load();
  }catch(e){x=load()||x||fresh();x.runStatus='error';x.lastError={at:new Date().toISOString(),message:e?.message||String(e)};x.trialLedger??=[];x.trialLedger.push({at:x.lastError.at,event:'RUN_ERROR',stage:x.stage||0,message:x.lastError.message});save(x);live('KÖRFEL',x.lastError.message);throw e}}

  function pfOf(trades){const gp=trades.filter(t=>t.pnl>0).reduce((s,t)=>s+t.pnl,0),gl=-trades.filter(t=>t.pnl<0).reduce((s,t)=>s+t.pnl,0);return gl?gp/gl:(gp?Infinity:0)}
  function summarizeTrades(trades){
    const n=trades.length,pl=trades.reduce((s,t)=>s+t.pnl,0),wins=trades.filter(t=>t.pnl>0).length;
    return {n,pl,pf:pfOf(trades),wr:n?wins/n:0,avg:n?pl/n:0};
  }
  function robustAnalysis(){
    const x=load(),trades=x?.pseudoForward?.closed||[];
    if(!x?.stages?.O||!trades.length)return null;
    const years={};for(const t of trades){const y=String(t.exitDate||t.entryDate||'').slice(0,4);(years[y]??=[]).push(t)}
    const symbols={};for(const t of trades)(symbols[t.symbol]??=[]).push(t);
    const exits={};for(const t of trades)(exits[t.why||'okänd']??=[]).push(t);
    const yearRows=Object.entries(years).sort().map(([year,a])=>({year,...summarizeTrades(a)}));
    const symbolRows=Object.entries(symbols).map(([symbol,a])=>({symbol,...summarizeTrades(a)})).sort((a,b)=>b.pl-a.pl);
    const exitRows=Object.entries(exits).map(([why,a])=>({why,...summarizeTrades(a)})).sort((a,b)=>b.pl-a.pl);
    const grossProfit=trades.filter(t=>t.pnl>0).reduce((s,t)=>s+t.pnl,0),grossLoss=-trades.filter(t=>t.pnl<0).reduce((s,t)=>s+t.pnl,0);
    const sorted=trades.slice().sort((a,b)=>b.pnl-a.pnl),top10=sorted.slice(0,10).reduce((s,t)=>s+t.pnl,0);
    let mw=0,ml=0,cw=0,cl=0;for(const t of trades.slice().sort((a,b)=>String(a.exitDate).localeCompare(String(b.exitDate)))){if(t.pnl>0){cw++;cl=0;mw=Math.max(mw,cw)}else if(t.pnl<0){cl++;cw=0;ml=Math.max(ml,cl)}}
    return {candidateHash:x.candidate.hash,total:summarizeTrades(trades),years:yearRows,symbols:symbolRows,exits:exitRows,grossProfit,grossLoss,maxWin:Math.max(...trades.map(t=>t.pnl)),maxLoss:Math.min(...trades.map(t=>t.pnl)),maxWinStreak:mw,maxLossStreak:ml,top10GrossProfitShare:grossProfit?top10/grossProfit:0};
  }
  function robustReport(){
    const r=robustAnalysis();if(!r)return'Ingen färdig pseudo-forward att analysera.';
    const f=n=>Number(n).toLocaleString('sv-SE',{maximumFractionDigits:2}),pct=n=>(100*n).toFixed(1)+'%';
    const L=['LINAS OPTI – G2 ROBUSTHETSANALYS','Clean Core: V0.2.10','Kandidat: '+r.candidateHash,'Handel: AVSTÄNGD','',
      `TOTALT · ${r.total.n} affärer · P/L ${f(r.total.pl)} kr · PF ${f(r.total.pf)} · WR ${pct(r.total.wr)}`,'',
      'ÅR FÖR ÅR'];
    r.years.forEach(y=>L.push(`${y.year} · ${y.n} affärer · P/L ${f(y.pl)} kr · PF ${f(y.pf)} · WR ${pct(y.wr)}`));
    L.push('','SYMBOLER');r.symbols.forEach(z=>L.push(`${z.symbol} · ${z.n} affärer · P/L ${f(z.pl)} kr · PF ${f(z.pf)} · WR ${pct(z.wr)}`));
    L.push('','EXITTYP');r.exits.forEach(z=>L.push(`${z.why} · ${z.n} affärer · P/L ${f(z.pl)} kr · PF ${Number.isFinite(z.pf)?f(z.pf):'∞'}`));
    L.push('','KONCENTRATION',`Gross profit ${f(r.grossProfit)} kr · gross loss ${f(r.grossLoss)} kr`,`Största vinst ${f(r.maxWin)} kr · största förlust ${f(r.maxLoss)} kr`,`Längsta vinstsvit ${r.maxWinStreak} · förlustsvit ${r.maxLossStreak}`,`Top 10 vinnare = ${pct(r.top10GrossProfitShare)} av gross profit`,'','BESLUT','G2 förblir FRYST. Ingen parameterändring. Nästa Gate: Broker/Cost Gate → därefter riktig forward/paper trading om kandidaten håller.');
    return L.join('\n');
  }
  function exportRobust(){download(robustReport(),`LINAS_OPTI_G2_ROBUSTHET_CLEAN_V0209_${new Date().toISOString().slice(0,10)}.txt`)}

  function report(){const x=load();if(!x)return'Ingen G2-körning.';const L=['LINAS OPTI – SWING G2 BREAKOUT/MOMENTUM ALPHABET A–O','Clean Core: V0.2.10','Generation: '+GENERATION,'Handel: AVSTÄNGD','Plan låst: '+(x.planLocked?'JA':'NEJ')+' · planhash '+(x.planHash||'—'),'DEV: '+DEV_START+' → '+DEV_END,'Låst historisk pseudo-forward: '+OOS_START+' → '+OOS_END,'Viktigt: pseudo-forward är historik, inte färsk framtida OOS.',''];for(const s of STAGES){const z=x.stages?.[s[0]];L.push(`${s[0]} · ${s[1]} | ${z?.status||'EJ KÖRD'} | ${z?.summary||''}`)}if(x.candidate)L.push('','FRYST KANDIDAT','Hash: '+x.candidate.hash,'Params: '+JSON.stringify(x.candidate.params),'DEV: '+JSON.stringify(x.candidate.dev));if(x.pseudoForward)L.push('','PSEUDO-FORWARD',JSON.stringify({n:x.pseudoForward.n,pl:x.pseudoForward.pl,pf:x.pseudoForward.pf,wr:x.pseudoForward.wr,dd:x.pseudoForward.dd}));if(x.final)L.push('','SLUTBEDÖMNING: '+x.final.verdict,'Ingen automatisk rescue/efteroptimering: JA');return L.join('\n')}
  function download(text,name,type='text/plain'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  function exportReport(){download(report(),`LINAS_OPTI_SWING_G2_A_O_CLEAN_V0209_${new Date().toISOString().slice(0,10)}.txt`)}
  function exportRaw(){const x=load();if(x)download(JSON.stringify(x,null,2),`LINAS_OPTI_SWING_G2_RAW_CLEAN_V0209_${new Date().toISOString().slice(0,10)}.json`,'application/json')}
  function reset(){localStorage.removeItem(KEY);emit()}
  window.LinaG2Engine={KEY,LEGACY_KEY,GENERATION,DEV_START,DEV_END,OOS_START,OOS_END,GRID,STAGES,SYMBOLS,load,fresh,save,lock,run,report,robustAnalysis,robustReport,exportRobust,exportReport,exportRaw,reset,variants,engine,normRows,hash};
})();

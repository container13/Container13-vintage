
const APP_VERSION = "V0.29";
window.addEventListener("DOMContentLoaded", () => {
  const v = document.getElementById("appVersion");
  if (v) v.textContent = APP_VERSION;
});


// V0.29 – marknadsgrupper. Strategilogiken ändras inte; endast symboluniversum byts.
const MARKET_GROUPS={
 usa10:{name:"USA Core",symbols:["AAPL","MSFT","NVDA","AMZN","META","TSLA","AMD","NFLX","AVGO","JPM","SPY"]},
 usa20:{name:"USA 20",symbols:["AAPL","MSFT","NVDA","AMZN","META","TSLA","AMD","NFLX","AVGO","JPM","GOOGL","ORCL","CRM","INTC","QCOM","MU","BAC","GS","WMT","COST","SPY"]},
 usa30:{name:"USA 30",symbols:["AAPL","MSFT","NVDA","AMZN","META","TSLA","AMD","NFLX","AVGO","JPM","GOOGL","ORCL","CRM","INTC","QCOM","MU","BAC","GS","WMT","COST","HD","DIS","UBER","PLTR","PYPL","ADBE","CSCO","PEP","KO","XOM","SPY"]}
};
let ACTIVE_MARKET="usa10";
function setMarketGroup(key){
 const g=MARKET_GROUPS[key]; if(!g)return; ACTIVE_MARKET=key;
 const el=document.getElementById("symbols"); if(el)el.value=g.symbols.join(",");
 document.querySelectorAll(".market-btn[data-market]").forEach(b=>b.classList.toggle("active",b.dataset.market===key));
 const info=document.getElementById("marketGroupInfo"); if(info)info.textContent=`${g.name} · ${g.symbols.length-1} aktier + SPY`;
 DAILY=[]; INTRA=[]; LAST=null; updateTestDataStatus(); updateDataStatus();
 const bs=document.getElementById("bridgeStatus"); if(bs)bs.textContent=`${g.name} vald. Hämta data för att testa gruppen.`;
}
window.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".market-btn[data-market]:not([disabled])").forEach(b=>b.addEventListener("click",()=>setMarketGroup(b.dataset.market)));
});
let DAILY=[], INTRA=[], LAST=null;
const API_BASE = "https://linas-opti-api.mangaj73.workers.dev";
const $=id=>document.getElementById(id);
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>show(b.dataset.pane));
function show(p){document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.pane===p));["data","test","result"].forEach(x=>$("pane-"+x).classList.toggle("hidden",x!==p))}
function fmt(x){return new Intl.NumberFormat("sv-SE",{style:"currency",currency:"SEK",maximumFractionDigits:0}).format(x)}
function pct(x){return Number.isFinite(x)?(x*100).toFixed(2).replace(".",",")+"%":"—"}
function parseCSV(text){
 let lines=text.trim().split(/\r?\n/); if(lines.length<2)return [];
 let hdr=lines[0].split(/[,;]/).map(x=>x.trim().toLowerCase().replaceAll('"',''));
 let idx=n=>hdr.indexOf(n);
 let req=["timestamp","symbol","open","high","low","close","volume"];
 if(req.some(n=>idx(n)<0))throw new Error("CSV måste ha: "+req.join(", "));
 return lines.slice(1).map(line=>{
   let a=line.split(/[,;]/).map(x=>x.trim().replace(/^"|"$/g,""));
   return {t:a[idx("timestamp")],symbol:a[idx("symbol")].toUpperCase(),o:+a[idx("open")],h:+a[idx("high")],l:+a[idx("low")],c:+a[idx("close")],v:+a[idx("volume")]};
 }).filter(x=>x.t&&x.symbol&&Number.isFinite(x.c)).sort((a,b)=>new Date(a.t)-new Date(b.t));
}
async function loadFile(input,kind){
 let f=input.files[0];if(!f)return;try{let rows=parseCSV(await f.text());if(kind==="daily"){
  DAILY=rows;
}else{
  INTRA=rows;
}
updateTestDataStatus();
updateDataStatus()}catch(e){$("csvStatus").innerHTML='<span class="bad">'+e.message+"</span>"}
}
$("dailyFile").onchange=e=>loadFile(e.target,"daily");$("intraFile").onchange=e=>loadFile(e.target,"intra");
function updateDataStatus(){
 $("csvStatus").innerHTML=`Dagsdata: <b>${DAILY.length}</b> rader • 5-minutersdata: <b>${INTRA.length}</b> rader`;
 $("modeBadge").textContent=(DAILY.length||INTRA.length)?"VERKLIG DATA INLÄST":"DATA EJ INLÄST";
 $("modeBadge").style.background=(DAILY.length||INTRA.length)?"#e8f6ef":"#eaf4fd";
}
async function bridge(path){
 if(!API_BASE) throw new Error("Kunde inte nå Linas Opti API.");
 let r=await fetch(API_BASE+path);let j=await r.json();if(!r.ok)throw new Error(j.error||("HTTP "+r.status));return j
}
$("healthBtn").onclick=async()=>{try{
  let j=await checkLinasOptiApi();
  const mode=j.mode==="paper"?"Alpaca Paper":(j.mode||"Alpaca");
  const trading=j.tradingEnabled===false?"Handel avstängd":"Handelsläge okänt";
  $("bridgeStatus").innerHTML='<span class="good">🟢 '+(j.service||"Linas Opti API")+' anslutet · '+mode+' · '+trading+'</span>';
}catch(e){
  $("bridgeStatus").innerHTML='<span class="bad">🔴 Kunde inte nå Linas Opti API: '+e.message+"</span>";
}};
function params(tf){let s=$("symbols").value.split(",").map(x=>x.trim().toUpperCase()).filter(Boolean).join(",");return `/bars?symbols=${encodeURIComponent(s)}&timeframe=${tf}&start=${$("start").value}&end=${$("end").value}`}
function expectedDailyFloor(){
  const symbols=$("symbols").value.split(",").map(x=>x.trim()).filter(Boolean).length;
  const a=new Date($("start").value), b=new Date($("end").value);
  if(!symbols || !Number.isFinite(a.getTime()) || !Number.isFinite(b.getTime()) || b<a) return 0;
  const calendarDays=Math.floor((b-a)/86400000)+1;
  // Grov underkant: ca 5/7 vardagar och extra marginal för helgdagar/saknade bars.
  return Math.floor(calendarDays*(5/7)*symbols*.72);
}
function paintBridgeDone(count,tf){
  const el=$("bridgeStatus");
  if(!el)return;
  const text=`Klart: ${count} rader (${tf})`;
  el.className="status good";
  el.textContent=text;
  // iOS Safari har ibland lämnat statusraden halvritad efter en lång fetch.
  // Måla om samma text i nästa frame och strax därefter så ett enda tryck räcker.
  requestAnimationFrame(()=>{ el.textContent=text; void el.offsetWidth; });
  setTimeout(()=>{ if(el.textContent!==text) el.textContent=text; },120);
}
async function getBars(tf){
 const btn=tf==="1Day"?$("dailyBtn"):$("intraBtn");
 const old=btn?.textContent;
 try{
   if(btn){btn.disabled=true;btn.textContent="Hämtar…";}
   $("bridgeStatus").className="status";
   $("bridgeStatus").textContent="Hämtar...";
   let j=await bridge(params(tf));
   let rows=j.rows||[];
   // Om en lång dagsdatahämtning mot förmodan kommer tillbaka uppenbart ofullständig,
   // gör en automatisk verifieringshämtning. Användaren ska aldrig behöva trycka två gånger.
   if(tf==="1Day" && rows.length<expectedDailyFloor()) {
     $("bridgeStatus").textContent=`Verifierar dagsdata… (${rows.length} rader först)`;
     const j2=await bridge(params(tf));
     const rows2=j2.rows||[];
     if(rows2.length>rows.length) rows=rows2;
   }
   if(tf==="1Day") DAILY=rows; else INTRA=rows;
   updateTestDataStatus();
   updateDataStatus();
   paintBridgeDone(rows.length,tf);
 } catch(e){
   $("bridgeStatus").className="status bad";
   $("bridgeStatus").textContent=e.message;
 } finally {
   if(btn){btn.disabled=false;btn.textContent=old;}
 }
}
$("dailyBtn").onclick=()=>getBars("1Day");$("intraBtn").onclick=()=>getBars("5Min");

function grouped(rows){let m={};rows.forEach(r=>(m[r.symbol]??=[]).push(r));return m}
function sd(a){if(a.length<2)return 0;let m=a.reduce((s,x)=>s+x,0)/a.length;return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/a.length)}
function swing(rows,capital,maxPos,evalStart){
 if(!rows.length)return null;
 let g=grouped(rows),symbols=Object.keys(g),tradeSymbols=symbols.filter(s=>s!=="SPY"),
 dates=[...new Set(rows.map(r=>r.t.slice(0,10)))].sort(),
 cash=capital,pos={},log=[],curve=[],peak=capital,dd=0,w=0,l=0,closed=[];
 let map={};symbols.forEach(s=>{map[s]={};g[s].forEach(r=>map[s][r.t.slice(0,10)]=r)});
 let firstEval=dates.findIndex(d=>!evalStart||d>=evalStart);
 if(firstEval<0) firstEval=dates.length;
 let firstTrade=Math.max(20,firstEval);

 for(let di=firstTrade;di<dates.length;di++){
  let date=dates[di],signalDate=dates[di-1];

  // 1) OPEN: signalen är känd från gårdagens stängning.
  // Befintliga positioner räknas fortfarande som öppna och dagens framtida exit får
  // varken frigöra kapital eller plats retroaktivt till dagens öppning.
  let candidates=[];
  for(let s of tradeSymbols){
   if(pos[s])continue;
   let hist=g[s].filter(r=>r.t.slice(0,10)<=signalDate);
   if(hist.length<21)continue;
   let sig=hist[hist.length-1],today=map[s][date];
   if(!today)continue;
   let c0=sig.c,c20=hist[hist.length-21].c,c5=hist[hist.length-6].c;
   let r20=c0/c20-1,r5=c0/c5-1;
   let rets=hist.slice(-20).map((x,i,a)=>i?Math.log(x.c/a[i-1].c):0).slice(1);
   let vol=sd(rets)*Math.sqrt(252),score=.65*r20+.20*r5-.15*vol;
   if(score>.015)candidates.push({s,score,price:today.o});
  }
  candidates.sort((a,b)=>b.score-a.score);
  while(Object.keys(pos).length<5&&candidates.length){
   let x=candidates.shift();
   let eq=cash+Object.values(pos).reduce((q,p)=>q+p.shares*(map[p.s][signalDate]?.c||p.entry),0);
   let budget=Math.min(cash,eq*maxPos); if(budget<eq*.04)break;
   let shares=budget/x.price; cash-=budget;
   pos[x.s]={s:x.s,entry:x.price,entryDate:date,shares,cost:budget,di};
   log.push({t:date,robot:"Opti Swing",s:x.s,a:"KÖP",price:x.price,amount:budget,why:"Signal föregående stängning → köp dagens öppning",pnl:null});
  }

  // 2) INTRADAY/CLOSE: först efter öppningsköpen får dagens OHLC avgöra exit.
  // Därmed kan en försäljning senare under dagen aldrig följas av ett köp bakåt i tiden
  // på samma dags öppningskurs.
  for(let s of Object.keys(pos)){
   let bar=map[s][date]; if(!bar)continue;
   let p=pos[s],age=di-p.di,exit=null,exitPrice=null;
   let stop=p.entry*.93,target=p.entry*1.12;
   if(bar.l<=stop){exit="Stop −7%";exitPrice=stop}
   else if(bar.h>=target){exit="Vinst +12%";exitPrice=target}
   else if(age>=20){exit="20 dagar";exitPrice=bar.c}
   if(exit){
    let value=p.shares*exitPrice,pl=value-p.cost;
    cash+=value;pl>=0?w++:l++;
    closed.push({symbol:s,entryDate:p.entryDate,exitDate:date,entry:p.entry,exit:exitPrice,shares:p.shares,pnl:pl,ret:exitPrice/p.entry-1,why:exit});
    log.push({t:date,robot:"Opti Swing",s,a:"SÄLJ",price:exitPrice,amount:value,why:exit,pnl:pl});
    delete pos[s];
   }
  }

  let eq=cash+Object.values(pos).reduce((q,p)=>q+p.shares*(map[p.s][date]?.c||p.entry),0);
  peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:date,v:eq});
 }

 let last=dates.at(-1);
 for(let s of Object.keys(pos)){
  let bar=map[s][last];if(!bar)continue;
  let p=pos[s],value=p.shares*bar.c,pl=value-p.cost;
  cash+=value;pl>=0?w++:l++;
  closed.push({symbol:s,entryDate:p.entryDate,exitDate:last,entry:p.entry,exit:bar.c,shares:p.shares,pnl:pl,ret:bar.c/p.entry-1,why:"Period slut"});
  log.push({t:last,robot:"Opti Swing",s,a:"SÄLJ",price:bar.c,amount:value,why:"Period slut",pnl:pl});
 }
 let bench=null;
 if(g.SPY?.length){
   let b=g.SPY.filter(r=>r.t.slice(0,10)>=dates[firstTrade]);
   if(b.length>1)bench=b.at(-1).c/b[0].o-1;
 }
 let wins=closed.filter(x=>x.pnl>0),losses=closed.filter(x=>x.pnl<0);
 let grossWin=wins.reduce((a,x)=>a+x.pnl,0),grossLoss=Math.abs(losses.reduce((a,x)=>a+x.pnl,0));
 let pf=grossLoss?grossWin/grossLoss:(grossWin?Infinity:0);
 return {eq:cash,ret:cash/capital-1,dd,n:closed.length,wr:closed.length?wins.length/closed.length:0,
   log,curve,bench,closed,pf,
   avgWin:wins.length?grossWin/wins.length:0,
   avgLoss:losses.length?losses.reduce((a,x)=>a+x.pnl,0)/losses.length:0,
   best:closed.length?Math.max(...closed.map(x=>x.pnl)):0,
   worst:closed.length?Math.min(...closed.map(x=>x.pnl)):0,
   openAtEnd:0,evalStart:dates[firstTrade]||evalStart||null};
}

function swingWorld(rows,capital,maxPos,evalStart){
 if(!rows.length)return null;
 let g=grouped(rows),symbols=Object.keys(g),tradeSymbols=symbols.filter(s=>s!=="SPY"),
 dates=[...new Set(rows.map(r=>r.t.slice(0,10)))].sort(),
 cash=capital,pos={},log=[],curve=[],peak=capital,dd=0,w=0,l=0,closed=[],
 regimeDays={green:0,yellow:0,red:0},blocked=0,blockedYellow=0,blockedRed=0,regimeSignalDays=0,regimeSamples=[];
 let map={};symbols.forEach(s=>{map[s]={};g[s].forEach(r=>map[s][r.t.slice(0,10)]=r)});
 let firstEval=dates.findIndex(d=>!evalStart||d>=evalStart); if(firstEval<0)firstEval=dates.length;
 let firstTrade=Math.max(20,firstEval);
 for(let di=firstTrade;di<dates.length;di++){
  let date=dates[di],signalDate=dates[di-1];
  // V0.26 treläges-omvärld. Endast data känd vid föregående stängning används.
  let spyHist=(g.SPY||[]).filter(r=>r.t.slice(0,10)<=signalDate),regime="green",spyClose=null,sma20=null,drawdown=null;
  if(spyHist.length>=20){
   let recent=spyHist.slice(-20); spyClose=recent.at(-1).c; sma20=recent.reduce((a,x)=>a+x.c,0)/recent.length;
   let high20=Math.max(...recent.map(x=>x.c)); drawdown=spyClose/high20-1;
   if(drawdown<=-.05 || (spyClose<sma20 && drawdown<=-.03)) regime="red";
   else if(spyClose<sma20 || drawdown<=-.03) regime="yellow";
  }
  regimeDays[regime]++;
  let regimeCap=regime==="green"?5:regime==="yellow"?3:0;
  let candidates=[],rawToday=[],blockedToday=[];
  for(let s of tradeSymbols){
   let hist=g[s].filter(r=>r.t.slice(0,10)<=signalDate); if(hist.length<21)continue;
   let sig=hist.at(-1),today=map[s][date]; if(!today)continue;
   let c0=sig.c,c20=hist[hist.length-21].c,c5=hist[hist.length-6].c;
   let r20=c0/c20-1,r5=c0/c5-1;
   let rets=hist.slice(-20).map((x,i,a)=>i?Math.log(x.c/a[i-1].c):0).slice(1);
   let vol=sd(rets)*Math.sqrt(252),score=.65*r20+.20*r5-.15*vol;
   if(score<=.015)continue;
   rawToday.push(s);
   if(pos[s])continue;
   if(Object.keys(pos).length>=regimeCap){
    blocked++; if(regime==="red")blockedRed++; else if(regime==="yellow")blockedYellow++;
    blockedToday.push(s); continue;
   }
   candidates.push({s,score,price:today.o});
  }
  if(rawToday.length && regime!=="green")regimeSignalDays++;
  if(regime!=="green" && regimeSamples.length<20)regimeSamples.push({date,signalDate,regime,spyClose,sma20,drawdownPct:drawdown==null?null:drawdown*100,positionsAtOpen:Object.keys(pos).length,rawSignals:rawToday,blockedSignals:blockedToday});
  candidates.sort((a,b)=>b.score-a.score);
  // Diagnostik: kandidater som inte ryms i gult räknas som blockerade även om någon annan kandidat får den sista platsen.
  if(regime==="yellow"){let slots=Math.max(0,regimeCap-Object.keys(pos).length),extra=Math.max(0,candidates.length-slots);blocked+=extra;blockedYellow+=extra;}
  while(Object.keys(pos).length<regimeCap&&candidates.length){
   let x=candidates.shift();
   let eq=cash+Object.values(pos).reduce((q,p)=>q+p.shares*(map[p.s][signalDate]?.c||p.entry),0);
   let budget=Math.min(cash,eq*maxPos); if(budget<eq*.04)break;
   let shares=budget/x.price; cash-=budget; pos[x.s]={s:x.s,entry:x.price,entryDate:date,shares,cost:budget,di};
   log.push({t:date,robot:"Opti Swing + omvärld",s:x.s,a:"KÖP",price:x.price,amount:budget,why:`${regime.toUpperCase()} · signal föregående stängning → köp dagens öppning`,pnl:null});
  }
  for(let s of Object.keys(pos)){
   let bar=map[s][date]; if(!bar)continue; let p=pos[s],age=di-p.di,exit=null,exitPrice=null;
   let stop=p.entry*.93,target=p.entry*1.12;
   if(bar.l<=stop){exit="Stop −7%";exitPrice=stop}else if(bar.h>=target){exit="Vinst +12%";exitPrice=target}else if(age>=20){exit="20 dagar";exitPrice=bar.c}
   if(exit){let value=p.shares*exitPrice,pl=value-p.cost;cash+=value;pl>=0?w++:l++;closed.push({symbol:s,entryDate:p.entryDate,exitDate:date,entry:p.entry,exit:exitPrice,shares:p.shares,pnl:pl,ret:exitPrice/p.entry-1,why:exit});log.push({t:date,robot:"Opti Swing + omvärld",s,a:"SÄLJ",price:exitPrice,amount:value,why:exit,pnl:pl});delete pos[s]}
  }
  let eq=cash+Object.values(pos).reduce((q,p)=>q+p.shares*(map[p.s][date]?.c||p.entry),0);peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:date,v:eq});
 }
 let last=dates.at(-1);for(let s of Object.keys(pos)){let bar=map[s][last];if(!bar)continue;let p=pos[s],value=p.shares*bar.c,pl=value-p.cost;cash+=value;pl>=0?w++:l++;closed.push({symbol:s,entryDate:p.entryDate,exitDate:last,entry:p.entry,exit:bar.c,shares:p.shares,pnl:pl,ret:bar.c/p.entry-1,why:"Period slut"});log.push({t:last,robot:"Opti Swing + omvärld",s,a:"SÄLJ",price:bar.c,amount:value,why:"Period slut",pnl:pl})}
 let bench=null;if(g.SPY?.length){let b=g.SPY.filter(r=>r.t.slice(0,10)>=dates[firstTrade]);if(b.length>1)bench=b.at(-1).c/b[0].o-1}
 let wins=closed.filter(x=>x.pnl>0),losses=closed.filter(x=>x.pnl<0),grossWin=wins.reduce((a,x)=>a+x.pnl,0),grossLoss=Math.abs(losses.reduce((a,x)=>a+x.pnl,0));let pf=grossLoss?grossWin/grossLoss:(grossWin?Infinity:0);
 return {eq:cash,ret:cash/capital-1,dd,n:closed.length,wr:closed.length?wins.length/closed.length:0,log,curve,bench,closed,pf,regimeDays,blocked,blockedYellow,blockedRed,regimeSignalDays,regimeSamples,avgWin:wins.length?grossWin/wins.length:0,avgLoss:losses.length?losses.reduce((a,x)=>a+x.pnl,0)/losses.length:0,best:closed.length?Math.max(...closed.map(x=>x.pnl)):0,worst:closed.length?Math.min(...closed.map(x=>x.pnl)):0,openAtEnd:0,evalStart:dates[firstTrade]||evalStart||null};
}
function daytrade(rows,capital,riskPct){
 if(!rows.length)return null;
 let days={};rows.forEach(r=>{let d=r.t.slice(0,10);(days[d]??={});(days[d][r.symbol]??=[]).push(r)});
 let eq=capital,peak=capital,dd=0,w=0,l=0,log=[],curve=[],closed=[];
 let dayCount=0,maxTradesDay=12,maxTradesSymbol=3;
 const spread=.00035,slip=.00025,costSide=spread/2+slip;
 for(let d of Object.keys(days).sort()){
  let tradesToday=0;dayCount++;
  for(let [s,bars] of Object.entries(days[d])){
   if(s==="SPY")continue;
   bars.sort((a,b)=>new Date(a.t)-new Date(b.t));
   if(bars.length<18||tradesToday>=maxTradesDay)continue;
   let symTrades=0,nextAllowed=4;
   for(let i=12;i<bars.length-1 && tradesToday<maxTradesDay && symTrades<maxTradesSymbol;i++){
    if(i<nextAllowed)continue;
    // All signal inputs come from the completed bar i; execution is next bar open.
    let hist=bars.slice(Math.max(0,i-11),i+1);
    let sma=hist.reduce((a,b)=>a+b.c,0)/hist.length;
    let r3=bars[i].c/bars[i-3].c-1;
    let r1=bars[i].c/bars[i-1].c-1;
    let signal=null,why=null;
    if(r3>.0045 && bars[i].c>sma && r1>0){signal="LONG";why="momentum 15 min"}
    else if(r3<-.008 && r1>0 && bars[i].c<sma){signal="LONG";why="återhämtning efter snabb nedgång"}
    if(!signal)continue;
    let entryBar=bars[i+1],entry=entryBar.o*(1+costSide);
    let stop=entry*.992,target=entry*1.012,maxExit=Math.min(bars.length-1,i+13);
    let exitBar=bars[maxExit],exitWhy="max 60 min",exitRaw=exitBar.c;
    for(let k=i+1;k<=maxExit;k++){
      let b=bars[k];
      if(b.l<=stop){exitBar=b;exitWhy="stop −0,8%";exitRaw=stop;break}
      if(b.h>=target){exitBar=b;exitWhy="mål +1,2%";exitRaw=target;break}
      if(k===bars.length-1){exitBar=b;exitWhy="stängning";exitRaw=b.c;break}
    }
    let exit=exitRaw*(1-costSide);
    let risk=Math.max(0,eq*riskPct),riskPerShare=Math.max(.0001,entry-stop);
    let shares=Math.min((eq*.20)/entry,risk/riskPerShare);
    if(!(shares>0))continue;
    let pl=shares*(exit-entry);eq+=pl;pl>=0?w++:l++;tradesToday++;symTrades++;
    let ret=exit/entry-1;
    closed.push({symbol:s,entryTime:entryBar.t,exitTime:exitBar.t,entry,exit,shares,pnl:pl,ret,why:exitWhy,setup:why});
    log.push({t:exitBar.t,robot:"Opti Day",s,a:"LONG",price:entry,amount:shares*entry,why:why+" / "+exitWhy,pnl:pl});
    // Re-entry only after the exit bar plus two complete 5-min bars.
    let exitIdx=bars.indexOf(exitBar);nextAllowed=Math.max(i+2,exitIdx+2);i=Math.max(i,exitIdx);
   }
  }
  peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq});
 }
 let wins=closed.filter(x=>x.pnl>0),losses=closed.filter(x=>x.pnl<0),grossWin=wins.reduce((a,x)=>a+x.pnl,0),grossLoss=Math.abs(losses.reduce((a,x)=>a+x.pnl,0));
 let pf=grossLoss?grossWin/grossLoss:(grossWin?Infinity:0);
 return {eq,ret:eq/capital-1,dd,n:closed.length,wr:closed.length?wins.length/closed.length:0,avg:closed.length?(eq-capital)/closed.length:0,log,curve,closed,pf,tradesPerDay:dayCount?closed.length/dayCount:0,maxTradesDay,maxTradesSymbol};
}

function daytradeConfirm(rows,capital,riskPct){
 if(!rows.length)return null;
 let days={};rows.forEach(r=>{let d=r.t.slice(0,10);(days[d]??={});(days[d][r.symbol]??=[]).push(r)});
 let eq=capital,peak=capital,dd=0,w=0,l=0,log=[],curve=[],closed=[];
 let dayCount=0,maxTradesDay=12,maxTradesSymbol=3,rawSignals=0,passedSignals=0;
 const spread=.00035,slip=.00025,costSide=spread/2+slip;
 for(let d of Object.keys(days).sort()){
  let tradesToday=0;dayCount++;
  for(let [s,bars] of Object.entries(days[d])){
   if(s==="SPY")continue;
   bars.sort((a,b)=>new Date(a.t)-new Date(b.t));
   if(bars.length<18||tradesToday>=maxTradesDay)continue;
   let symTrades=0,nextAllowed=4;
   for(let i=12;i<bars.length-1 && tradesToday<maxTradesDay && symTrades<maxTradesSymbol;i++){
    if(i<nextAllowed)continue;
    let hist=bars.slice(Math.max(0,i-11),i+1);
    let sma=hist.reduce((a,b)=>a+b.c,0)/hist.length;
    let r3=bars[i].c/bars[i-3].c-1;
    let r1=bars[i].c/bars[i-1].c-1;
    // A:s råa signal, räknas bara för diagnostik.
    let baseSignal=(r3>.0045 && bars[i].c>sma && r1>0) || (r3<-.008 && r1>0 && bars[i].c<sma);
    if(baseSignal)rawSignals++;
    // B testar endast starkare momentum med bekräftelse i pris och volym.
    // Allt är känt när bar i har stängt; köp sker fortfarande först på nästa bars öppning.
    let range=Math.max(.000001,bars[i].h-bars[i].l);
    let closeLocation=(bars[i].c-bars[i].l)/range;
    let avgVol=hist.reduce((a,b)=>a+(Number(b.v)||0),0)/hist.length;
    let volumeOk=(Number(bars[i].v)||0)>=avgVol;
    let signal=r3>.006 && bars[i].c>sma && r1>0 && closeLocation>=.65 && volumeOk;
    if(!signal)continue;
    passedSignals++;
    let why="bekräftat momentum 15 min";
    let entryBar=bars[i+1],entry=entryBar.o*(1+costSide);
    let stop=entry*.992,target=entry*1.012,maxExit=Math.min(bars.length-1,i+13);
    let exitBar=bars[maxExit],exitWhy="max 60 min",exitRaw=exitBar.c;
    for(let k=i+1;k<=maxExit;k++){
      let b=bars[k];
      if(b.l<=stop){exitBar=b;exitWhy="stop −0,8%";exitRaw=stop;break}
      if(b.h>=target){exitBar=b;exitWhy="mål +1,2%";exitRaw=target;break}
      if(k===bars.length-1){exitBar=b;exitWhy="stängning";exitRaw=b.c;break}
    }
    let exit=exitRaw*(1-costSide);
    let risk=Math.max(0,eq*riskPct),riskPerShare=Math.max(.0001,entry-stop);
    let shares=Math.min((eq*.20)/entry,risk/riskPerShare);
    if(!(shares>0))continue;
    let pl=shares*(exit-entry);eq+=pl;pl>=0?w++:l++;tradesToday++;symTrades++;
    let ret=exit/entry-1;
    closed.push({symbol:s,entryTime:entryBar.t,exitTime:exitBar.t,entry,exit,shares,pnl:pl,ret,why:exitWhy,setup:why});
    log.push({t:exitBar.t,robot:"Opti Day B",s,a:"LONG",price:entry,amount:shares*entry,why:why+" / "+exitWhy,pnl:pl});
    let exitIdx=bars.indexOf(exitBar);nextAllowed=Math.max(i+2,exitIdx+2);i=Math.max(i,exitIdx);
   }
  }
  peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq});
 }
 let wins=closed.filter(x=>x.pnl>0),losses=closed.filter(x=>x.pnl<0),grossWin=wins.reduce((a,x)=>a+x.pnl,0),grossLoss=Math.abs(losses.reduce((a,x)=>a+x.pnl,0));
 let pf=grossLoss?grossWin/grossLoss:(grossWin?Infinity:0);
 return {eq,ret:eq/capital-1,dd,n:closed.length,wr:closed.length?wins.length/closed.length:0,avg:closed.length?(eq-capital)/closed.length:0,log,curve,closed,pf,tradesPerDay:dayCount?closed.length/dayCount:0,maxTradesDay,maxTradesSymbol,rawSignals,passedSignals};
}

function render(s,d,capital){
 $("kStart").textContent=fmt(capital);$("kDaily").textContent=DAILY.length;$("kIntra").textContent=INTRA.length;
 let ts=[...DAILY,...INTRA].map(x=>x.t).sort();$("kPeriod").textContent=ts.length?ts[0].slice(0,10)+" → "+ts.at(-1).slice(0,10):"—";
 if(s){$("sEq").textContent=fmt(s.eq);$("sRet").textContent=(s.ret>=0?"+":"")+pct(s.ret);$("sRet").className=s.ret>=0?"good":"bad";$("sDD").textContent=pct(s.dd);$("sN").textContent=s.n;$("sWR").textContent=pct(s.wr);$("sBench").textContent=s.bench==null?"—":pct(s.ret-s.bench)}
 else ["sEq","sRet","sDD","sN","sWR","sBench"].forEach(x=>$(x).textContent="Ingen dagsdata");
 if(d){$("dEq").textContent=fmt(d.eq);$("dRet").textContent=(d.ret>=0?"+":"")+pct(d.ret);$("dRet").className=d.ret>=0?"good":"bad";$("dDD").textContent=pct(d.dd);$("dN").textContent=d.n;$("dWR").textContent=pct(d.wr);$("dAvg").textContent=fmt(d.avg);$("dPF").textContent=d.pf===Infinity?"∞":Number(d.pf||0).toFixed(2);$("dPerDay").textContent=Number(d.tradesPerDay||0).toFixed(2)}
 else ["dEq","dRet","dDD","dN","dWR","dAvg","dPF","dPerDay"].forEach(x=>$(x).textContent="Ingen 5-min-data");
 let logs=[...(s?.log||[]),...(d?.log||[])].sort((a,b)=>new Date(b.t)-new Date(a.t));$("tbody").innerHTML=logs.map(x=>`<tr><td>${x.t}</td><td>${x.robot}</td><td>${x.s}</td><td>${x.a}</td><td>${x.price.toFixed(2)}</td><td>${fmt(x.amount)}</td><td>${x.why}</td><td class="${x.pnl==null?"":x.pnl>=0?"good":"bad"}">${x.pnl==null?"—":fmt(x.pnl)}</td></tr>`).join("");draw(s,d,capital);show("result")
}
function draw(s,d,capital){let c=$("chart"),ctx=c.getContext("2d"),q=devicePixelRatio||1,W=c.clientWidth,H=c.clientHeight;c.width=W*q;c.height=H*q;ctx.scale(q,q);ctx.clearRect(0,0,W,H);let curves=[s?.curve,d?.curve].filter(Boolean),vals=curves.flatMap(x=>x.map(q=>q.v));if(!vals.length)return;let mn=Math.min(capital,...vals)*.98,mx=Math.max(capital,...vals)*1.02;ctx.strokeStyle="#dfe3e8";for(let i=0;i<5;i++){let y=12+i*(H-24)/4;ctx.beginPath();ctx.moveTo(10,y);ctx.lineTo(W-10,y);ctx.stroke()}[s?.curve,d?.curve].forEach((arr,j)=>{if(!arr?.length)return;ctx.strokeStyle=j?"#8a4f9e":"#1f5f99";ctx.lineWidth=2;ctx.beginPath();arr.forEach((p,i)=>{let x=10+i*(W-20)/Math.max(1,arr.length-1),y=10+(mx-p.v)*(H-20)/(mx-mn);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});ctx.fillStyle="#59636e";ctx.font="12px -apple-system";ctx.fillText("Blå = Opti Swing • Lila = Opti Day",14,18)}
function renderWorld(w,s){
 const set=(id,v,cls)=>{let e=document.getElementById(id);if(e){e.textContent=v;if(cls)e.className=cls}};
 if(!w){["wEq","wRet","wDD","wN","wPF","wVsBase","wGreen","wYellow","wRed","wBlocked","wBlockedYellow","wBlockedRed"].forEach(id=>set(id,"Ingen dagsdata"));return}
 set("wEq",fmt(w.eq));set("wRet",(w.ret>=0?"+":"")+pct(w.ret),w.ret>=0?"good":"bad");set("wDD",pct(w.dd));set("wN",String(w.n));set("wPF",w.pf===Infinity?"∞":Number(w.pf||0).toFixed(2));
 let diff=s?w.ret-s.ret:null;set("wVsBase",diff==null?"—":(diff>=0?"+":"")+pct(diff),diff==null?"":diff>=0?"good":"bad");
 set("wGreen",String(w.regimeDays?.green||0));set("wYellow",String(w.regimeDays?.yellow||0));set("wRed",String(w.regimeDays?.red||0));set("wBlocked",String(w.blocked||0));set("wBlockedYellow",String(w.blockedYellow||0));set("wBlockedRed",String(w.blockedRed||0));
}
function renderDayAB(a,b){
 const set=(id,v,cls)=>{let e=document.getElementById(id);if(e){e.textContent=v;if(cls!==undefined)e.className=cls}};
 if(!a||!b){["daRet","dbRet","daPF","dbPF","daN","dbN","daWR","dbWR","dbVsA","dbPassed"].forEach(id=>set(id,"Ingen 5-min-data"));return;}
 set("daRet",(a.ret>=0?"+":"")+pct(a.ret),a.ret>=0?"good":"bad");
 set("dbRet",(b.ret>=0?"+":"")+pct(b.ret),b.ret>=0?"good":"bad");
 set("daPF",a.pf===Infinity?"∞":Number(a.pf||0).toFixed(2)); set("dbPF",b.pf===Infinity?"∞":Number(b.pf||0).toFixed(2));
 set("daN",String(a.n)); set("dbN",String(b.n)); set("daWR",pct(a.wr)); set("dbWR",pct(b.wr));
 let diff=b.ret-a.ret; set("dbVsA",(diff>=0?"+":"")+pct(diff),diff>=0?"good":"bad");
 set("dbPassed",`${b.passedSignals||0} / ${b.rawSignals||0}`);
}

window.addEventListener("DOMContentLoaded",()=>{
 const btn=$("runBtn");
 if(!btn)return;
 btn.addEventListener("click",()=>{
  const status=$("testDataStatus");
  try{
   let cap=+$("capital").value;
   if(!DAILY.length&&!INTRA.length){if(status)status.innerHTML='<span class="bad">Ingen data inläst.</span>';return;}
   btn.disabled=true; const oldText=btn.textContent; btn.textContent="Kör test…";
   let start=$("evalStart")?.value||"",mp=+$("maxpos").value;
   let s=swing(DAILY,cap,mp,start);
   let w=swingWorld(DAILY,cap,mp,start);
   let d=daytrade(INTRA,cap,+$("risk").value);
   let dB=daytradeConfirm(INTRA,cap,+$("risk").value);
   LAST={s,w,d,dB}; render(s,d,cap); renderWorld(w,s); renderDayAB(d,dB); renderV015Audit(s);
   btn.textContent=oldText; btn.disabled=false;
  }catch(err){
   console.error("Linas Opti run error",err);
   btn.disabled=false; btn.textContent="Kör Linas Opti";
   if(status)status.innerHTML='<span class="bad">Testet kunde inte köras: '+String(err?.message||err)+'</span>';
  }
 });
});
window.onresize=()=>LAST&&draw(LAST.s,LAST.d,+$("capital").value);
let now=new Date(),ago=new Date(now);ago.setMonth(ago.getMonth()-1);$("end").value=now.toISOString().slice(0,10);$("start").value=ago.toISOString().slice(0,10);


async function checkLinasOptiApi(){
  const el = document.getElementById("bridgeStatus");
  if (el) {
    el.classList.remove("good","bad");
    el.textContent = "Kontrollerar Linas Opti API…";
  }
  try{
    const r = await fetch(API_BASE + "/health", { cache: "no-store" });
    const data = await r.json();
    if(!r.ok || !data.ok) throw new Error(data.error || ("HTTP " + r.status));

    const mode = data.mode === "paper" ? "Alpaca Paper" : (data.mode || "Alpaca");
    const trading = data.tradingEnabled === false ? "Handel avstängd" : "Handelsläge okänt";
    const service = data.service || "Linas Opti API";

    if (el) {
      el.classList.add("good");
      el.textContent = "🟢 " + service + " anslutet · " + mode + " · " + trading;
    }
    return data;
  }catch(err){
    if (el) {
      el.classList.add("bad");
      el.textContent = "🔴 Kunde inte nå Linas Opti API: " + err.message;
    }
    throw err;
  }
}



function updateTestDataStatus(){
  const dailyCount = Array.isArray(DAILY) ? DAILY.length : 0;
  const intraCount = Array.isArray(INTRA) ? INTRA.length : 0;

  const status = document.getElementById("testDataStatus");
  if (status) {
    const dailyText = dailyCount > 0
      ? "🟢 Dagsdata: " + dailyCount + " rader"
      : "⚪ Dagsdata: ej hämtad";
    const intraText = intraCount > 0
      ? "🟢 5-min-data: " + intraCount + " rader"
      : "⚪ 5-min-data: ej hämtad";

    status.innerHTML = dailyText + "<br>" + intraText;
  }

  const runBtn = document.getElementById("runBothBtn");
  if (runBtn) {
    runBtn.disabled = dailyCount === 0 && intraCount === 0;
  }
}



window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("button, a").forEach(el => {
    if ((el.textContent || "").trim().includes("Test")) {
      el.addEventListener("click", () => setTimeout(updateTestDataStatus, 0));
    }
  });
  updateTestDataStatus();
});


window.addEventListener("DOMContentLoaded",()=>{
 const e=document.getElementById("evalStart"), w=document.getElementById("warmupInfo");
 if(e&&w){const f=()=>w.textContent="före "+e.value; e.addEventListener("change",f); f();}
});

function renderV015Audit(s){
 const set=(id,v)=>{let e=document.getElementById(id);if(e)e.textContent=v};
 if(!s){return}
 set("v15PF",s.pf===Infinity?"∞":Number(s.pf||0).toFixed(2));
 set("v15AvgWin",fmt(s.avgWin||0)); set("v15AvgLoss",fmt(s.avgLoss||0));
 set("v15Best",fmt(s.best||0)); set("v15Worst",fmt(s.worst||0));
 set("v15Open",String(s.openAtEnd||0)); set("v15Eval",s.evalStart||"—");
 let cards=document.getElementById("v16TradeCards");
 if(cards)cards.innerHTML=(s.closed||[]).map((x,i)=>{
  const positive=x.pnl>=0;
  return `<article class="v16-tradecard ${positive?"win":"loss"}">
    <div class="v16-tradehead"><strong>Affär #${i+1}</strong><span class="v16-symbol">${x.symbol}</span></div>
    <div class="v16-dates">${x.entryDate} → ${x.exitDate}</div>
    <div class="v16-tradegrid">
      <div><span>In</span><strong>${x.entry.toFixed(2)}</strong></div>
      <div><span>Ut</span><strong>${x.exit.toFixed(2)}</strong></div>
      <div><span>Resultat</span><strong class="${positive?"good":"bad"}">${fmt(x.pnl)}</strong></div>
      <div><span>Avkastning</span><strong class="${positive?"good":"bad"}">${pct(x.ret)}</strong></div>
    </div>
    <div class="v16-reason"><span>Orsak</span><strong>${x.why}</strong></div>
  </article>`;
 }).join("");
}

function v17DateOnly(v){return String(v||"").slice(0,10)}
function v17Symbols(){const e=document.getElementById("symbols");return e?e.value:""}
function v17BaseReport(full){
 const s=LAST?.s||null,d=LAST?.d||null,dB=LAST?.dB||null;
 const payload={
  app:"Linas Opti",
  version:APP_VERSION,
  exportedAt:new Date().toISOString(),
  mode:"Backtest / paper only",
  tradingEnabled:false,
  data:{
   symbols:v17Symbols(),
   marketGroup:MARKET_GROUPS[ACTIVE_MARKET]?.name||"Egen lista",
   from:document.getElementById("start")?.value||"",
   to:document.getElementById("end")?.value||"",
   evaluationStart:document.getElementById("evalStart")?.value||"",
   dailyRows:Array.isArray(DAILY)?DAILY.length:0,
   fiveMinuteRows:Array.isArray(INTRA)?INTRA.length:0
  },
  settings:{
   startCapital:Number(document.getElementById("capital")?.value||0),
   swingMaxPosition:Number(document.getElementById("maxpos")?.value||0),
   dayRiskPerTrade:Number(document.getElementById("risk")?.value||0)
  },
  swing:s?{
   endingCapital:s.eq,returnPct:s.ret*100,maxDrawdownPct:s.dd*100,
   trades:s.n,winRatePct:s.wr*100,
   benchmark:"SPY",benchmarkReturnPct:Number.isFinite(s.bench)?s.bench*100:null,
   vsBenchmarkPct:Number.isFinite(s.bench)?(s.ret-s.bench)*100:null,
   profitFactor:s.pf===Infinity?"Infinity":s.pf,
   averageWin:s.avgWin,averageLoss:s.avgLoss,bestTrade:s.best,worstTrade:s.worst,
   openAtEnd:s.openAtEnd,effectiveTestStart:s.evalStart
  }:null,
  worldTest:LAST?.w?{
   rule:"Tre marknadslägen från SPY föregående stängning: GRÖN = max 5 positioner, GUL = max 3, RÖD = inga nya köp. Gul/röd bestäms av SMA20 och nedgång från 20-dagarshögsta.",
   endingCapital:LAST.w.eq,returnPct:LAST.w.ret*100,maxDrawdownPct:LAST.w.dd*100,
   trades:LAST.w.n,winRatePct:LAST.w.wr*100,profitFactor:LAST.w.pf===Infinity?"Infinity":LAST.w.pf,
   vsBaselinePct:s?(LAST.w.ret-s.ret)*100:null,regimeDays:LAST.w.regimeDays,blockedSignals:LAST.w.blocked,
   blockedYellow:LAST.w.blockedYellow,blockedRed:LAST.w.blockedRed,regimeSignalDays:LAST.w.regimeSignalDays,regimeSamples:LAST.w.regimeSamples
  }:null,
  day:d?{
   variant:"A · V0.27-baslinje",
   rule:"Signal på avslutad 5-minutersbar → köp nästa bars öppning. Long-only momentum/återhämtning, stop 0,8%, mål 1,2%, max 60 min, ingen övernattning, max 12 affärer/dag och 3/symbol.",
   endingCapital:d.eq,returnPct:d.ret*100,maxDrawdownPct:d.dd*100,
   trades:d.n,winRatePct:d.wr*100,profitFactor:d.pf===Infinity?"Infinity":d.pf,averageTrade:d.avg,tradesPerDay:d.tradesPerDay
  }:null,
  dayConfirm:dB?{
   variant:"B · Bekräftad momentum",
   rule:"Samma exekvering/risk/exit som A. Endast momentum: r3 > 0,6%, pris över SMA12, positiv senaste bar, stängning i övre 35% av baren och volym minst 12-bars-snitt. Köp nästa bars öppning.",
   endingCapital:dB.eq,returnPct:dB.ret*100,maxDrawdownPct:dB.dd*100,
   trades:dB.n,winRatePct:dB.wr*100,profitFactor:dB.pf===Infinity?"Infinity":dB.pf,averageTrade:dB.avg,tradesPerDay:dB.tradesPerDay,
   vsBaselinePct:d?(dB.ret-d.ret)*100:null,rawSignals:dB.rawSignals,passedSignals:dB.passedSignals
  }:null
 };
 if(full && s){
  payload.swing.closedTrades=(s.closed||[]).map(x=>({
   symbol:x.symbol,entryDate:x.entryDate,exitDate:x.exitDate,
   entryPrice:x.entry,exitPrice:x.exit,shares:x.shares,
   pnl:x.pnl,returnPct:x.ret*100,exitReason:x.why
  }));
  payload.swing.eventLog=s.log||[];
  if(LAST?.w){
   payload.worldTest.closedTrades=(LAST.w.closed||[]).map(x=>({symbol:x.symbol,entryDate:x.entryDate,exitDate:x.exitDate,entryPrice:x.entry,exitPrice:x.exit,shares:x.shares,pnl:x.pnl,returnPct:x.ret*100,exitReason:x.why}));
   payload.worldTest.eventLog=LAST.w.log||[];
  }
 }
 if(full && d){
   payload.day.closedTrades=(d.closed||[]).map(x=>({symbol:x.symbol,entryTime:x.entryTime,exitTime:x.exitTime,entryPrice:x.entry,exitPrice:x.exit,shares:x.shares,pnl:x.pnl,returnPct:x.ret*100,setup:x.setup,exitReason:x.why}));
   payload.day.eventLog=d.log||[];
 }
 if(full && dB){
   payload.dayConfirm.closedTrades=(dB.closed||[]).map(x=>({symbol:x.symbol,entryTime:x.entryTime,exitTime:x.exitTime,entryPrice:x.entry,exitPrice:x.exit,shares:x.shares,pnl:x.pnl,returnPct:x.ret*100,setup:x.setup,exitReason:x.why}));
   payload.dayConfirm.eventLog=dB.log||[];
 }
 return payload;
}
function v17TextReport(full){
 const p=v17BaseReport(full),s=p.swing,d=p.day,dB=p.dayConfirm;
 let a=[];
 a.push("LINAS OPTI – TESTRAPPORT",`Version: ${p.version}`,`Exporterad: ${p.exportedAt}`,"Handel: AVSTÄNGD (backtest/paper)","");
 a.push("DATA",`Marknadsgrupp: ${p.data.marketGroup||"Egen lista"}`,`Symboler: ${p.data.symbols}`,`Data: ${p.data.from} → ${p.data.to}`,`Teststart: ${p.data.evaluationStart}`,`Dagsrader: ${p.data.dailyRows}`,`5-min-rader: ${p.data.fiveMinuteRows}`,"");
 a.push("INSTÄLLNINGAR",`Startkapital: ${p.settings.startCapital}`,`Max position swing: ${p.settings.swingMaxPosition}`,`Risk/affär day: ${p.settings.dayRiskPerTrade}`,"");
 if(s){
  a.push("OPTI SWING",`Slutkapital: ${s.endingCapital}`,`Avkastning: ${s.returnPct.toFixed(2)}%`,`Max drawdown: ${s.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${s.trades}`,`Vinstfrekvens: ${s.winRatePct.toFixed(2)}%`,`Benchmark: SPY`,`SPY: ${s.benchmarkReturnPct==null?"—":s.benchmarkReturnPct.toFixed(2)+"%"}`,`Mot benchmark: ${s.vsBenchmarkPct==null?"—":s.vsBenchmarkPct.toFixed(2)+"%"}`,`Profit factor: ${s.profitFactor}`,`Snittvinst: ${s.averageWin}`,`Snittförlust: ${s.averageLoss}`,`Bästa affär: ${s.bestTrade}`,`Sämsta affär: ${s.worstTrade}`,`Öppna vid slut: ${s.openAtEnd}`,"");
 }
 if(p.worldTest){let w=p.worldTest;a.push("OMVÄRLDSTEST V0.26",`Regel: ${w.rule}`,`Slutkapital: ${w.endingCapital}`,`Avkastning: ${w.returnPct.toFixed(2)}%`,`Max drawdown: ${w.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${w.trades}`,`Vinstfrekvens: ${w.winRatePct.toFixed(2)}%`,`Profit factor: ${w.profitFactor}`,`Mot baslinjen: ${w.vsBaselinePct==null?"—":w.vsBaselinePct.toFixed(2)+"%"}`,`Gröna dagar: ${w.regimeDays?.green||0}`,`Gula dagar: ${w.regimeDays?.yellow||0}`,`Röda dagar: ${w.regimeDays?.red||0}`,`Blockerade signaler totalt: ${w.blockedSignals}`,`Blockerade i gult: ${w.blockedYellow}`,`Blockerade i rött: ${w.blockedRed}`,`Gul/röd-dagar med rå signal: ${w.regimeSignalDays}`,`Regimdiagnostik (första 20): ${JSON.stringify(w.regimeSamples)}`,"");}
 if(d)a.push("OPTI DAY A – BASLINJE",`Regel: ${d.rule}`,`Slutkapital: ${d.endingCapital}`,`Avkastning: ${d.returnPct.toFixed(2)}%`,`Max drawdown: ${d.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${d.trades}`,`Vinstfrekvens: ${d.winRatePct.toFixed(2)}%`,`Profit factor: ${d.profitFactor}`,`Snitt/affär: ${d.averageTrade}`,`Affärer/dag: ${d.tradesPerDay}`,"");

 if(dB)a.push("OPTI DAY B – BEKRÄFTAD MOMENTUM",`Regel: ${dB.rule}`,`Slutkapital: ${dB.endingCapital}`,`Avkastning: ${dB.returnPct.toFixed(2)}%`,`Max drawdown: ${dB.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${dB.trades}`,`Vinstfrekvens: ${dB.winRatePct.toFixed(2)}%`,`Profit factor: ${dB.profitFactor}`,`Snitt/affär: ${dB.averageTrade}`,`Affärer/dag: ${dB.tradesPerDay}`,`Mot A: ${dB.vsBaselinePct==null?"—":dB.vsBaselinePct.toFixed(2)+"%"}`,`Godkända / råa A-signaler: ${dB.passedSignals} / ${dB.rawSignals}`,"");
 if(full&&s){
  a.push("AVSLUTADE SWING-AFFÄRER");
  (s.closedTrades||[]).forEach((x,i)=>a.push(`${i+1}. ${x.symbol} | ${x.entryDate} → ${x.exitDate} | in ${x.entryPrice} | ut ${x.exitPrice} | P/L ${x.pnl} | ${x.returnPct.toFixed(2)}% | ${x.exitReason}`));
  a.push("","HÄNDELSELOGG",JSON.stringify(s.eventLog,null,2));
  if(p.worldTest?.eventLog)a.push("","OMVÄRLDSTEST – HÄNDELSELOGG",JSON.stringify(p.worldTest.eventLog,null,2));
 }
 if(full&&d){
  a.push("","AVSLUTADE OPTI DAY-AFFÄRER");
  (d.closedTrades||[]).forEach((x,i)=>a.push(`${i+1}. ${x.symbol} | ${x.entryTime} → ${x.exitTime} | in ${x.entryPrice} | ut ${x.exitPrice} | P/L ${x.pnl} | ${x.returnPct.toFixed(2)}% | ${x.setup} / ${x.exitReason}`));
  a.push("","OPTI DAY – HÄNDELSELOGG",JSON.stringify(d.eventLog||[],null,2));
 }
 if(full&&dB){
  a.push("","AVSLUTADE OPTI DAY B-AFFÄRER");
  (dB.closedTrades||[]).forEach((x,i)=>a.push(`${i+1}. ${x.symbol} | ${x.entryTime} → ${x.exitTime} | in ${x.entryPrice} | ut ${x.exitPrice} | P/L ${x.pnl} | ${x.returnPct.toFixed(2)}% | ${x.setup} / ${x.exitReason}`));
  a.push("","OPTI DAY B – HÄNDELSELOGG",JSON.stringify(dB.eventLog||[],null,2));
 }
 return a.join("\n");
}
async function v17Share(full){
 const status=document.getElementById("v17ExportStatus");
 if(!LAST?.s&&!LAST?.d){if(status)status.textContent="Kör ett test först.";return}
 const txt=v17TextReport(full);
 const stamp=new Date().toISOString().slice(0,10);
 const name=`linasopti_v028_${full?"full":"snabb"}_${stamp}.txt`;
 const file=new File([txt],name,{type:"text/plain;charset=utf-8"});
 try{
  if(navigator.share && (!navigator.canShare || navigator.canShare({files:[file]}))){
   await navigator.share({title:"Linas Opti test",text:"Linas Opti testrapport",files:[file]});
   if(status)status.textContent="Delningsrutan öppnades.";
   return;
  }
 }catch(e){
  if(e?.name==="AbortError"){if(status)status.textContent="Delning avbruten.";return}
 }
 const url=URL.createObjectURL(file),a=document.createElement("a");
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 if(status)status.textContent="Rapporten laddades ner. Dela filen via AirDrop.";
}
window.addEventListener("DOMContentLoaded",()=>{
 document.getElementById("v17ShareQuick")?.addEventListener("click",()=>v17Share(false));
 document.getElementById("v17ShareFull")?.addEventListener("click",()=>v17Share(true));
});


window.addEventListener("DOMContentLoaded",()=>{
 const toggle=document.getElementById("v23ShareToggle"),menu=document.getElementById("v23ShareMenu");
 if(toggle&&menu)toggle.addEventListener("click",()=>{
   menu.hidden=!menu.hidden;
   toggle.setAttribute("aria-expanded",String(!menu.hidden));
 });
});

// V0.21 – lata snabbval för testperioder
(function(){
 const pad=n=>String(n).padStart(2,"0");
 const localISO=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
 const setPeriod=(p)=>{
   const start=document.getElementById("start"), end=document.getElementById("end"), ev=document.getElementById("evalStart");
   if(!start||!end)return;
   const now=new Date();
   let from,to,testStart;
   if(p==="2024"){from="2024-01-01";to="2024-12-31";testStart="2024-02-01";}
   else if(p==="2025"){from="2025-01-01";to="2025-12-31";testStart="2025-02-01";}
   else if(p==="2026"){from="2026-01-01";to=localISO(now);testStart="2026-02-01";}
   else {from="2024-01-01";to=localISO(now);testStart="2024-02-01";}
   start.value=from; end.value=to; if(ev)ev.value=testStart;
   document.querySelectorAll(".period-btn").forEach(b=>b.classList.toggle("active",b.dataset.period===p));
 };
 document.querySelectorAll(".period-btn").forEach(b=>b.addEventListener("click",()=>setPeriod(b.dataset.period)));
})();


// V0.27 – snabbval för mindre 5-minutersperioder så intradagsdata inte blir onödigt tung.
window.addEventListener("DOMContentLoaded",()=>{
 const pad=n=>String(n).padStart(2,"0"), iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
 document.querySelectorAll(".day-period-btn").forEach(b=>b.addEventListener("click",()=>{
   const n=+b.dataset.days, end=document.getElementById("end"), start=document.getElementById("start"); if(!start||!end)return;
   let to=end.value?new Date(end.value+"T12:00:00"):new Date(), from=new Date(to); from.setDate(from.getDate()-Math.max(1,n*1.45));
   start.value=iso(from); end.value=iso(to);
   document.querySelectorAll(".day-period-btn").forEach(x=>x.classList.toggle("active",x===b));
   document.querySelectorAll(".period-btn").forEach(x=>x.classList.remove("active"));
 }));
});

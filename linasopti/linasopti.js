
const APP_VERSION = "V0.35.1";
window.addEventListener("DOMContentLoaded", () => {
  const v = document.getElementById("appVersion");
  if (v) v.textContent = APP_VERSION;
});


// V0.29.2 – marknadsgrupper. Strategilogiken ändras inte; endast symboluniversum byts.
const MARKET_GROUPS={
  linaSelection16:{name:"Lina Selection 16",provider:"alpaca",benchmark:"SPY",selectionDerived:true,symbols:["HD","BAC","AMD","INTC","GOOGL","NVDA","CRM","UBER","ADBE","MU","PYPL","AMZN","WMT","CSCO","KO","QCOM","SPY"]},
  usa10:{name:"USA Core",provider:"alpaca",benchmark:"SPY",symbols:["AAPL","MSFT","NVDA","AMZN","META","TSLA","AMD","NFLX","AVGO","JPM","SPY"]},
 usa20:{name:"USA 20",provider:"alpaca",benchmark:"SPY",symbols:["AAPL","MSFT","NVDA","AMZN","META","TSLA","AMD","NFLX","AVGO","JPM","GOOGL","ORCL","CRM","INTC","QCOM","MU","BAC","GS","WMT","COST","SPY"]},
 usa30:{name:"USA 30",provider:"alpaca",benchmark:"SPY",symbols:["AAPL","MSFT","NVDA","AMZN","META","TSLA","AMD","NFLX","AVGO","JPM","GOOGL","ORCL","CRM","INTC","QCOM","MU","BAC","GS","WMT","COST","HD","DIS","UBER","PLTR","PYPL","ADBE","CSCO","PEP","KO","XOM","SPY"]},
 sweden20:{name:"Sverige 20",provider:"eodhd",benchmark:"XACT-OMXS30.ST",symbols:["ABB.ST","ALFA.ST","ASSA-B.ST","ATCO-A.ST","AZN.ST","BOL.ST","ERIC-B.ST","EQT.ST","ESSITY-B.ST","HEXA-B.ST","HMB.ST","INVE-B.ST","SAAB-B.ST","SAND.ST","SEB-A.ST","SHB-A.ST","SWED-A.ST","TEL2-B.ST","TELIA.ST","VOLV-B.ST","XACT-OMXS30.ST"]},
 denmark20:{name:"Danmark 20",provider:"eodhd",benchmark:"SPIC25KL.CO",symbols:["CARL-B.CO","COLO-B.CO","DANSKE.CO","DEMANT.CO","DSV.CO","FLS.CO","GMAB.CO","GN.CO","ISS.CO","JYSK.CO","MAERSK-B.CO","NOVO-B.CO","NZYM-B.CO","ORSTED.CO","PNDORA.CO","ROCK-B.CO","TRYG.CO","VWS.CO","ZEAL.CO","AMBU-B.CO","SPIC25KL.CO"]},
 finland20:{name:"Finland 20",provider:"eodhd",benchmark:"SLGOMXH25.HE",symbols:["ELISA.HE","FORTUM.HE","HARVIA.HE","HIAB.HE","HUH1V.HE","KALMAR.HE","KCR.HE","KEMIRA.HE","KESKOB.HE","KNEBV.HE","MANTA.HE","METSB.HE","METSO.HE","NDA-FI.HE","NESTE.HE","NOKIA.HE","ORNBV.HE","OUT1V.HE","QTCOM.HE","SAMPO.HE","SLGOMXH25.HE"]},
 norway20:{name:"Norge 20",provider:"eodhd",benchmark:"OBX.OL",symbols:["AKRBP.OL","AUSS.OL","AUTO.OL","BRG.OL","BWLPG.OL","DNB.OL","EQNR.OL","GJF.OL","KIT.OL","KOG.OL","MOWI.OL","NHY.OL","ORK.OL","PROT.OL","SALM.OL","STB.OL","SUBC.OL","TEL.OL","TOM.OL","VAR.OL","OBX.OL"]},
 globalNordic:{name:"Opti Global · Norden 80",provider:"eodhd",benchmark:"NORDIC-4",benchmarks:["XACT-OMXS30.ST","SPIC25KL.CO","SLGOMXH25.HE","OBX.OL"],symbols:["ABB.ST","ALFA.ST","ASSA-B.ST","ATCO-A.ST","AZN.ST","BOL.ST","ERIC-B.ST","EQT.ST","ESSITY-B.ST","HEXA-B.ST","HMB.ST","INVE-B.ST","SAAB-B.ST","SAND.ST","SEB-A.ST","SHB-A.ST","SWED-A.ST","TEL2-B.ST","TELIA.ST","VOLV-B.ST","CARL-B.CO","COLO-B.CO","DANSKE.CO","DEMANT.CO","DSV.CO","FLS.CO","GMAB.CO","GN.CO","ISS.CO","JYSK.CO","MAERSK-B.CO","NOVO-B.CO","NZYM-B.CO","ORSTED.CO","PNDORA.CO","ROCK-B.CO","TRYG.CO","VWS.CO","ZEAL.CO","AMBU-B.CO","ELISA.HE","FORTUM.HE","HARVIA.HE","HIAB.HE","HUH1V.HE","KALMAR.HE","KCR.HE","KEMIRA.HE","KESKOB.HE","KNEBV.HE","MANTA.HE","METSB.HE","METSO.HE","NDA-FI.HE","NESTE.HE","NOKIA.HE","ORNBV.HE","OUT1V.HE","QTCOM.HE","SAMPO.HE","AKRBP.OL","AUSS.OL","AUTO.OL","BRG.OL","BWLPG.OL","DNB.OL","EQNR.OL","GJF.OL","KIT.OL","KOG.OL","MOWI.OL","NHY.OL","ORK.OL","PROT.OL","SALM.OL","STB.OL","SUBC.OL","TEL.OL","TOM.OL","VAR.OL","XACT-OMXS30.ST","SPIC25KL.CO","SLGOMXH25.HE","OBX.OL"]},
 worldRegions20:{name:"Världsregioner 20",provider:"alpaca",benchmark:"VT",symbols:["VEA","VWO","VGK","VPL","VEU","EFA","EEM","EWJ","EWG","EWU","EWQ","EWC","EWA","INDA","EWY","EWT","EWZ","EWW","EWH","EWS","VT"]},
 worldExUs20:{name:"Global ex-USA 20",provider:"alpaca",benchmark:"VEU",symbols:["VEA","VWO","VGK","VPL","EFA","EEM","EWJ","EWG","EWU","EWQ","EWC","EWA","INDA","EWY","EWT","EWZ","EWW","EWH","EWS","EZA","VEU"]},
 usaWorld50:{name:"USA + Värld 50",provider:"alpaca",benchmark:"VT",symbols:["AAPL","MSFT","NVDA","AMZN","META","TSLA","AMD","NFLX","AVGO","JPM","GOOGL","ORCL","CRM","INTC","QCOM","MU","BAC","GS","WMT","COST","HD","DIS","UBER","PLTR","PYPL","ADBE","CSCO","PEP","KO","XOM","VEA","VWO","VGK","VPL","VEU","EFA","EEM","EWJ","EWG","EWU","EWQ","EWC","EWA","INDA","EWY","EWT","EWZ","EWW","EWH","EWS","VT"]},
 globalStocks100:{name:"Global Stocks 100",provider:"alpaca",benchmark:"VT",symbols:["AAPL", "MSFT", "NVDA", "AMZN", "META", "TSLA", "AVGO", "GOOGL", "JPM", "V", "MA", "LLY", "WMT", "COST", "ORCL", "NFLX", "AMD", "CRM", "ADBE", "CSCO", "IBM", "INTC", "QCOM", "MU", "GS", "BAC", "MS", "HD", "LOW", "NKE", "MCD", "SBUX", "KO", "PEP", "XOM", "CVX", "CAT", "GE", "BA", "RTX", "UBER", "PLTR", "PYPL", "ABNB", "SHOP", "MELI", "TSM", "ASML", "SAP", "NVO", "AZN", "TM", "SONY", "HMC", "BABA", "PDD", "JD", "BIDU", "NTES", "SE", "GRAB", "INFY", "HDB", "IBN", "VALE", "PBR", "NU", "UL", "DEO", "BP", "SHEL", "GSK", "SNY", "NVS", "UBS", "DB", "ING", "BCS", "RY", "TD", "BMO", "BNS", "ENB", "CNQ", "CP", "CNI", "RELX", "FERG", "CCEP", "ARGX", "BEKE", "TCOM", "ZTO", "LI", "XPEV", "NIO", "ARM", "SPOT", "CRH", "VT"]}
};
function currentGroup(){return MARKET_GROUPS[ACTIVE_MARKET]||MARKET_GROUPS.usa10}
function currentBenchmark(){return currentGroup().benchmark||"SPY"}
function currentBenchmarks(){return currentGroup().benchmarks||[currentBenchmark()]}
function currentProvider(){return currentGroup().provider||"alpaca"}
function isUsMarket(){return currentProvider()==="alpaca"}

let ACTIVE_MARKET="usa10";
function setMarketGroup(key){
 const g=MARKET_GROUPS[key]; if(!g)return; ACTIVE_MARKET=key;
 const el=document.getElementById("symbols"); if(el)el.value=g.symbols.join(",");
 document.querySelectorAll(".market-btn[data-market]").forEach(b=>b.classList.toggle("active",b.dataset.market===key));
 const info=document.getElementById("marketGroupInfo"); if(info)info.textContent=`${g.name} · ${g.symbols.length-currentBenchmarks().length} aktier + ${g.benchmark}`;
 const pi=document.getElementById("providerInfo"); if(pi)pi.textContent=`Datakälla: ${g.provider==="eodhd"?"EODHD":"Alpaca"} · Benchmark: ${g.benchmark}`;
 const ib=document.getElementById("intraBtn"); if(ib){ib.disabled=g.provider!=="alpaca";ib.title=g.provider!=="alpaca"?"Opti Day är tills vidare endast USA":"";}
 DAILY=[]; INTRA=[]; LAST=null; updateTestDataStatus(); updateDataStatus();
 const bs=document.getElementById("bridgeStatus"); if(bs)bs.textContent=`${g.name} vald. Hämta data för att testa gruppen.`;
}
window.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".market-btn[data-market]:not([disabled])").forEach(b=>b.addEventListener("click",()=>setMarketGroup(b.dataset.market)));
});
let DAILY=[], INTRA=[], LAST=null;
const API_BASE = "https://linas-opti-api.mangaj73.workers.dev";
const $=id=>document.getElementById(id);
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>show(b.dataset.pane,true));
function show(p,fromTab=false){
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.pane===p));
  ["data","test","result"].forEach(x=>$("pane-"+x).classList.toggle("hidden",x!==p));
  if(fromTab){
    requestAnimationFrame(()=>{
      const target=p==="test" ? $("runBtn") : $("pane-"+p);
      if(target) target.scrollIntoView({behavior:"smooth",block:p==="test"?"center":"start"});
    });
  }
}
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
function params(tf){let s=$("symbols").value.split(",").map(x=>x.trim().toUpperCase()).filter(Boolean).join(",");const base=currentProvider()==="eodhd"?"/eod-bars":"/bars";return `${base}?symbols=${encodeURIComponent(s)}&timeframe=${tf}&start=${$("start").value}&end=${$("end").value}` }
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
 if(currentProvider()==="eodhd" && tf!=="1Day"){const el=$("bridgeStatus");if(el){el.className="status bad";el.textContent="Opti Day/5-min är tills vidare endast USA.";}return;}
 const btn=tf==="1Day"?$("dailyBtn"):$("intraBtn"); const old=btn?.textContent;
 try{
  if(btn){btn.disabled=true;btn.textContent="Hämtar…";} $("bridgeStatus").className="status"; $("bridgeStatus").textContent="Hämtar...";
  let rows=[];
  if(currentProvider()==="eodhd" && tf==="1Day"){
   const syms=$("symbols").value.split(",").map(x=>x.trim().toUpperCase()).filter(Boolean);
   const chunks=[]; for(let i=0;i<syms.length;i+=25)chunks.push(syms.slice(i,i+25));
   for(let i=0;i<chunks.length;i++){
    $("bridgeStatus").textContent=`Hämtar del ${i+1}/${chunks.length}…`;
    const url=`/eod-bars?symbols=${encodeURIComponent(chunks[i].join(","))}&timeframe=1Day&start=${$("start").value}&end=${$("end").value}`;
    const j=await bridge(url); rows.push(...(j.rows||[]));
   }
  }else{ const j=await bridge(params(tf)); rows=j.rows||[]; }
  if(tf==="1Day")DAILY=rows;else INTRA=rows; updateTestDataStatus();updateDataStatus();paintBridgeDone(rows.length,tf);
 }catch(e){$("bridgeStatus").className="status bad";$("bridgeStatus").textContent=e.message;}finally{if(btn){btn.disabled=false;btn.textContent=old;}}
}
$("dailyBtn").onclick=()=>getBars("1Day");$("intraBtn").onclick=()=>getBars("5Min");

function grouped(rows){let m={};rows.forEach(r=>(m[r.symbol]??=[]).push(r));return m}
function sd(a){if(a.length<2)return 0;let m=a.reduce((s,x)=>s+x,0)/a.length;return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/a.length)}
function swing(rows,capital,maxPos,evalStart){
 if(!rows.length)return null;
 let g=grouped(rows),symbols=Object.keys(g),benchSym=currentBenchmark(),benchSyms=currentBenchmarks(),tradeSymbols=symbols.filter(s=>!benchSyms.includes(s)),
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
 const benchReturns=benchSyms.map(bs=>{const b=(g[bs]||[]).filter(r=>r.t.slice(0,10)>=dates[firstTrade]);return b.length>1?b.at(-1).c/b[0].o-1:null;}).filter(Number.isFinite);
 if(benchReturns.length)bench=benchReturns.reduce((a,x)=>a+x,0)/benchReturns.length;
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


function v342AnalyzeSwing(s){
 const rows=[...(s?.closed||[])];
 const by={};
 for(const x of rows){
  const q=by[x.symbol]??={symbol:x.symbol,trades:0,wins:0,losses:0,pnl:0,targets:0,stops:0,time:0,best:-Infinity,worst:Infinity};
  q.trades++; q.pnl+=Number(x.pnl||0); if(x.pnl>0)q.wins++; else if(x.pnl<0)q.losses++;
  if(String(x.why||'').includes('Vinst +12%'))q.targets++;
  if(String(x.why||'').includes('Stop'))q.stops++;
  if(String(x.why||'').includes('20 dagar'))q.time++;
  q.best=Math.max(q.best,Number(x.pnl||0)); q.worst=Math.min(q.worst,Number(x.pnl||0));
 }
 const symbols=Object.values(by).map(q=>({...q,winRate:q.trades?q.wins/q.trades:0})).sort((a,b)=>b.pnl-a.pnl);
 const positives=symbols.filter(x=>x.pnl>0), negatives=symbols.filter(x=>x.pnl<0).sort((a,b)=>a.pnl-b.pnl);
 const grossPositive=positives.reduce((a,x)=>a+x.pnl,0);
 const top3=positives.slice(0,3).reduce((a,x)=>a+x.pnl,0);
 const top3Share=grossPositive>0?top3/grossPositive:0;
 const concentration=top3Share>=.70?'Hög':top3Share>=.45?'Medel':'Bred';
 return {symbols,positives,negatives,grossPositive,top3Share,concentration};
}
function v342RenderAnalysis(s){
 const A=v342AnalyzeSwing(s),set=(id,v,cls)=>{const e=$(id);if(e){e.textContent=v;if(cls!==undefined)e.className=cls}};
 if(!s?.closed?.length){set('aWinSymbols','—');set('aLossSymbols','—');set('aTop3Share','—');set('aConcentration','—');if($('aWinners'))$('aWinners').innerHTML='<div class="muted">Kör ett Swing-test först.</div>';if($('aLosers'))$('aLosers').innerHTML='<div class="muted">Kör ett Swing-test först.</div>';if($('aSymbolTable'))$('aSymbolTable').innerHTML='';return A}
 set('aWinSymbols',`${A.positives.length} / ${A.symbols.length}`);
 set('aLossSymbols',`${A.negatives.length} / ${A.symbols.length}`);
 set('aTop3Share',`${(A.top3Share*100).toFixed(0)}%`);
 set('aConcentration',A.concentration,A.concentration==='Hög'?'bad':A.concentration==='Bred'?'good':'');
 const item=x=>`<div class="v342-item"><div><b>${x.symbol}</b><span>${x.trades} affärer · ${(x.winRate*100).toFixed(0)}% vinst</span></div><strong class="${x.pnl>=0?'good':'bad'}">${x.pnl>=0?'+':''}${fmt(x.pnl)}</strong></div>`;
 $('aWinners').innerHTML=A.positives.slice(0,6).map(item).join('')||'<div class="muted">Inga vinstgivande symboler.</div>';
 $('aLosers').innerHTML=A.negatives.slice(0,6).map(item).join('')||'<div class="muted">Inga förlustsymboler.</div>';
 $('aSymbolTable').innerHTML=A.symbols.map(x=>`<tr><td><b>${x.symbol}</b></td><td>${x.trades}</td><td>${(x.winRate*100).toFixed(0)}%</td><td class="${x.pnl>=0?'good':'bad'}">${x.pnl>=0?'+':''}${fmt(x.pnl)}</td><td>${x.targets}</td><td>${x.stops}</td></tr>`).join('');
 return A;
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
function optiTrend(rows,capital,evalStart){
 if(!rows.length)return null;
 const g=grouped(rows), symbols=Object.keys(g), benchSym=currentBenchmark(), benchSyms=currentBenchmarks(), tradeSymbols=symbols.filter(s=>!benchSyms.includes(s));
 const dates=[...new Set(rows.map(r=>r.t.slice(0,10)))].sort();
 const map={}; symbols.forEach(s=>{map[s]={};g[s].forEach(r=>map[s][r.t.slice(0,10)]=r)});
 const firstEval=dates.findIndex(d=>!evalStart||d>=evalStart); if(firstEval<0)return null;
 const firstTrade=Math.max(252,firstEval), topN=5;
 if(firstTrade>=dates.length)return {eq:capital,ret:0,dd:0,n:0,bench:null,cagr:0,curve:[],log:[],note:"Minst cirka 252 handelsdagars uppvärmning behövs."};
 let cash=capital,pos={},curve=[],log=[],peak=capital,dd=0,rebalances=0,firstTradeDate=null;
 const px=(s,di)=>map[s]?.[dates[di]];
 const closeAgo=(s,di,n)=>px(s,di-n)?.c;
 const sma=(s,di,n)=>{let a=[];for(let k=0;k<n;k++){let r=px(s,di-k);if(!r)return null;a.push(r.c)}return a.reduce((x,y)=>x+y,0)/a.length};
 function equity(di,atOpen=false){let e=cash;for(const [s,p] of Object.entries(pos)){let r=px(s,di);e+=p.qty*(r?(atOpen?r.o:r.c):p.last)}return e}
 for(let di=firstTrade;di<dates.length;di++){
   // Signal from previous close; execute at today's open. Rebalance every 5 trading days.
   if((di-firstTrade)%5===0){
     const sig=di-1,cands=[];
     for(const s of tradeSymbols){
       const r=px(s,sig), c63=closeAgo(s,sig,63),c126=closeAgo(s,sig,126),c252=closeAgo(s,sig,252),ma=sma(s,sig,200);
       if(!r||!c63||!c126||!c252||!ma||r.c<=ma)continue;
       const score=.20*(r.c/c63-1)+.30*(r.c/c126-1)+.50*(r.c/c252-1);
       if(score>0)cands.push({s,score});
     }
     cands.sort((a,b)=>b.score-a.score); const wanted=cands.slice(0,topN).map(x=>x.s);
     // sell names leaving top 5 at today's open
     for(const s of Object.keys(pos))if(!wanted.includes(s)){const r=px(s,di);if(r){cash+=pos[s].qty*r.o;log.push({t:dates[di],robot:"Trend",symbol:s,action:"SÄLJ",price:r.o,amount:pos[s].qty*r.o,reason:"Utanför Top 5",result:null});delete pos[s]}}
     const slots=wanted.filter(s=>!pos[s]&&px(s,di));
     if(slots.length){const targetEquity=equity(di,true),target=targetEquity/topN;for(const s of slots){const r=px(s,di);const spend=Math.min(target,cash);if(spend>0){const qty=spend/r.o;cash-=qty*r.o;pos[s]={qty,last:r.o};log.push({t:dates[di],robot:"Trend",symbol:s,action:"KÖP",price:r.o,amount:spend,reason:"Top 5 momentum",result:null});if(!firstTradeDate)firstTradeDate=dates[di]}}}
     rebalances++;
   }
   for(const [s,p] of Object.entries(pos)){const r=px(s,di);if(r)p.last=r.c}
   const e=equity(di,false);peak=Math.max(peak,e);dd=Math.min(dd,e/peak-1);curve.push({t:dates[di],v:e});
 }
 const lastDi=dates.length-1,eq=equity(lastDi,false),ret=eq/capital-1;
 let bench=null; const br=benchSyms.map(bs=>{const a=map[bs]?.[dates[firstTrade]],z=map[bs]?.[dates[lastDi]];return a&&z?z.c/a.o-1:null;}).filter(Number.isFinite);if(br.length)bench=br.reduce((a,x)=>a+x,0)/br.length;
 const days=firstTradeDate?Math.max(1,(new Date(dates[lastDi])-new Date(firstTradeDate))/86400000):0;
 const cagr=days?Math.pow(eq/capital,365.25/days)-1:0;
 return {eq,ret,dd,n:rebalances,bench,cagr,curve,log,firstTrade:dates[firstTrade]};
}
function renderTrend(t){
 const set=(id,v)=>{const e=$(id);if(e)e.textContent=v};
 if(!t){["tEq","tRet","tDD","tN","tBench","tCagr"].forEach(id=>set(id,"Ingen dagsdata"));return;}
 set("tEq",fmt(t.eq));set("tRet",(t.ret>=0?"+":"")+pct(t.ret));set("tDD",pct(t.dd));set("tN",String(t.n));set("tCagr",pct(t.cagr));
 set("tBench",t.bench==null?"—":((t.ret-t.bench)>=0?"+":"")+pct(t.ret-t.bench));
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
   let t=optiTrend(DAILY,cap,start);
   let w=isUsMarket()?swingWorld(DAILY,cap,mp,start):null;
   let d=isUsMarket()?daytrade(INTRA,cap,+$("risk").value):null;
   let dB=isUsMarket()?daytradeConfirm(INTRA,cap,+$("risk").value):null;
   let audit=auditSwing(DAILY,s,cap); LAST={s,t,w,d,dB,audit}; render(s,d,cap); renderTrend(t); renderWorld(w,s); renderDayAB(d,dB); renderV015Audit(s); renderSwingAudit(audit); v342RenderAnalysis(s); v0344RenderValidation(s,cap); v035RenderHero(s); setTimeout(()=>v035ClickTab("3"),80);
   btn.textContent=oldText; btn.disabled=false;
  }catch(err){
   console.error("Linas Opti run error",err);
   btn.disabled=false; btn.textContent="Kör Linas Opti";
   if(status)status.innerHTML='<span class="bad">Testet kunde inte köras: '+String(err?.message||err)+'</span>';
  }
 });
});

// V0.34 – fristående globala experiment. Baseline Swing ovan är orörd.
let V034_MODE="baseline", V034_LAST=null;
function v034Map(rows){const m={};for(const r of rows){(m[r.symbol]??={})[String(r.t).slice(0,10)]=r}return m}
function v034Dates(rows,start){return [...new Set(rows.map(r=>String(r.t).slice(0,10)).filter(d=>!start||d>=start))].sort()}
function v034SimpleMomentum(rows,capital,start,defensive=false){
 const map=v034Map(rows), bench=currentBenchmark(), symbols=[...new Set(rows.map(r=>r.symbol))].filter(s=>s!==bench), dates=v034Dates(rows,start); if(!dates.length)return null;
 const allDates=[...new Set(rows.map(r=>String(r.t).slice(0,10)))].sort(), idx=Object.fromEntries(allDates.map((d,i)=>[d,i])); let cash=capital,pos={},peak=capital,dd=0,curve=[],trades=0,lastMonth="";
 const close=(s,i)=>map[s]?.[allDates[i]]?.c;
 for(const d of dates){let i=idx[d]; if(i<126)continue; let month=d.slice(0,7); if(month!==lastMonth){lastMonth=month; let ranks=[]; for(const s of symbols){let c=close(s,i-1),c126=close(s,i-127);if(c&&c126)ranks.push([s,c/c126-1])} ranks.sort((a,b)=>b[1]-a[1]); let top=ranks.filter(x=>x[1]>0).slice(0,5).map(x=>x[0]);
   if(defensive){let positive=ranks.filter(x=>x[1]>0).length; if(positive<Math.max(10,Math.floor(ranks.length*.35)))top=[]}
   for(const s of Object.keys(pos))if(!top.includes(s)){let r=map[s]?.[d];if(r){cash+=pos[s]*r.o;delete pos[s];trades++}}
   let eq=cash+Object.entries(pos).reduce((q,[s,n])=>q+n*(map[s]?.[d]?.o||0),0),target=eq/5;
   for(const s of top)if(!pos[s]){let r=map[s]?.[d];if(r&&cash>0){let spend=Math.min(target,cash);pos[s]=spend/r.o;cash-=spend}}
 }
 let eq=cash+Object.entries(pos).reduce((q,[s,n])=>q+n*(map[s]?.[d]?.c||0),0);peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq}) }
 let eq=curve.at(-1)?.v||capital; return {eq,ret:eq/capital-1,dd,trades,curve,rule:defensive?'Månadsvis 6m momentum, top 5; cash om <35% av universum har positivt 6m-momentum.':'Månadsvis 6m momentum, top 5 positiva instrument.'};
}
function v034RankedSwing(rows,capital,maxPos,start){
 // Samma signalmått som Swing, men kräver starkare relativ ranking: endast dagens toppkvintil av positiva kandidater får öppnas.
 const map=v034Map(rows),bench=currentBenchmark(),symbols=[...new Set(rows.map(r=>r.symbol))].filter(s=>s!==bench),dates=[...new Set(rows.map(r=>String(r.t).slice(0,10)))].sort();let cash=capital,pos={},peak=capital,dd=0,curve=[],closed=[];
 for(let di=21;di<dates.length;di++){let d=dates[di];if(start&&d<start)continue;let sig=dates[di-1],cands=[];for(const s of symbols){let b0=map[s]?.[sig],b5=map[s]?.[dates[di-6]],b20=map[s]?.[dates[di-21]],bo=map[s]?.[d];if(!b0||!b5||!b20||!bo)continue;let rs=[];for(let k=di-20;k<=di-1;k++){let a=map[s]?.[dates[k]],z=map[s]?.[dates[k-1]];if(a&&z)rs.push(Math.log(a.c/z.c))}let mean=rs.reduce((a,b)=>a+b,0)/(rs.length||1),vol=Math.sqrt(rs.reduce((q,x)=>q+(x-mean)**2,0)/(rs.length||1))*Math.sqrt(252),score=.65*(b0.c/b20.c-1)+.20*(b0.c/b5.c-1)-.15*vol;if(score>.015)cands.push({s,score,price:bo.o})}
 cands.sort((a,b)=>b.score-a.score);cands=cands.slice(0,Math.max(1,Math.ceil(cands.length*.20)));let slots=5-Object.keys(pos).length;for(const x of cands){if(slots<=0)break;if(pos[x.s])continue;let eq=cash+Object.entries(pos).reduce((q,[s,p])=>q+p.shares*(map[s]?.[sig]?.c||p.entry),0),budget=Math.min(eq*maxPos,cash);if(budget<=0)break;pos[x.s]={entry:x.price,shares:budget/x.price,cost:budget,di};cash-=budget;slots--}
 for(const s of Object.keys(pos)){let p=pos[s],b=map[s]?.[d];if(!b)continue;let ep=null;if(b.l<=p.entry*.93)ep=p.entry*.93;else if(b.h>=p.entry*1.12)ep=p.entry*1.12;else if(di-p.di>=20)ep=b.c;if(ep){let val=p.shares*ep;cash+=val;closed.push(val-p.cost);delete pos[s]}}
 let eq=cash+Object.entries(pos).reduce((q,[s,p])=>q+p.shares*(map[s]?.[d]?.c||p.entry),0);peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq})}
 let eq=curve.at(-1)?.v||capital;return {eq,ret:eq/capital-1,dd,trades:closed.length,curve,rule:'Fryst Swing-signal; endast topp 20% av dagens positiva kandidater får öppna nya positioner.'}
}
function v034Run(){if(ACTIVE_MARKET!=="globalStocks100"||!DAILY.length){V034_LAST=null;return}let cap=+$('capital').value,start=$('evalStart')?.value||'',mp=+$('maxpos').value;if(V034_MODE==='momentum')V034_LAST=v034RankedSwing(DAILY,cap,mp,start);else if(V034_MODE==='defensive')V034_LAST=v034SimpleMomentum(DAILY,cap,start,true);else if(V034_MODE==='simple')V034_LAST=v034SimpleMomentum(DAILY,cap,start,false);else V034_LAST=null;v034Render()}
function v034Render(){let e=document.getElementById('v034Result');if(!e)return;if(!V034_LAST){e.innerHTML='<span class="muted">Välj ett V0.34-experiment och kör Global Stocks 100.</span>';return}let x=V034_LAST;e.innerHTML=`<b>${V034_MODE==='momentum'?'⚡ Global Momentum':V034_MODE==='defensive'?'🛡️ Global Defensive':'🥊 Enkel momentum-kontroll'}</b><div class="v27-day-pills"><span>Slut ${fmt(x.eq)}</span><span>Avkastning ${(x.ret>=0?'+':'')+pct(x.ret)}</span><span>DD ${pct(x.dd)}</span><span>Avslut ${x.trades}</span></div><div class="muted">${x.rule}</div>`}
window.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-v034-mode]').forEach(b=>b.addEventListener('click',()=>{V034_MODE=b.dataset.v034Mode;document.querySelectorAll('[data-v034-mode]').forEach(x=>x.classList.toggle('active',x===b));setMarketGroup('globalStocks100')}));const rb=$('runBtn');if(rb)rb.addEventListener('click',()=>setTimeout(v034Run,0));});

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

function auditSwing(rows,s,capital){
 if(!rows?.length||!s)return null;
 const eps=1e-6, issues=[], warnings=[];
 const dates=[...new Set(rows.map(r=>r.t.slice(0,10)))].sort();
 const dateIndex=Object.fromEntries(dates.map((d,i)=>[d,i]));
 const g=grouped(rows), map={};
 let invalidBars=0,duplicateBars=0,unsortedSeries=0;
 for(const [sym,arr] of Object.entries(g)){
  map[sym]={}; let prev='';
  for(const r of arr){
   const d=r.t.slice(0,10);
   if(prev&&d<prev)unsortedSeries++;
   prev=d;
   if(map[sym][d])duplicateBars++;
   map[sym][d]=r;
   const vals=[r.o,r.h,r.l,r.c];
   if(vals.some(v=>!Number.isFinite(v)||v<=0)||r.l>Math.min(r.o,r.c)+eps||r.h<Math.max(r.o,r.c)-eps||r.l>r.h+eps)invalidBars++;
  }
 }
 if(invalidBars)issues.push(`${invalidBars} ogiltiga OHLC-rader`);
 if(duplicateBars)issues.push(`${duplicateBars} dubbla symbol/datum-rader`);
 if(unsortedSeries)issues.push(`${unsortedSeries} rader ligger i fel datumordning inom symbol`);

 let cash=capital,maxPositions=0,minCash=capital,capitalViolations=0,positionViolations=0,orphanSells=0,spyTrades=0; const benchmarkSymbol=currentBenchmark(), benchmarkSymbols=currentBenchmarks();
 const positions=new Set();
 for(const e of (s.log||[])){
  if(benchmarkSymbols.includes(e.s))spyTrades++;
  if(e.a==='KÖP'){
   if(e.amount>cash+0.01)capitalViolations++;
   cash-=e.amount; positions.add(e.s);
   maxPositions=Math.max(maxPositions,positions.size);
   if(positions.size>5)positionViolations++;
  }else if(e.a==='SÄLJ'){
   if(!positions.has(e.s))orphanSells++;
   cash+=e.amount; positions.delete(e.s);
  }
  minCash=Math.min(minCash,cash);
 }
 if(capitalViolations)issues.push(`${capitalViolations} köp använde mer kontanter än fanns före köpet`);
 if(positionViolations)issues.push(`${positionViolations} händelser överskred 5 samtidiga positioner`);
 if(orphanSells)issues.push(`${orphanSells} försäljningar saknade öppen position i loggreplay`);
 if(spyTrades)issues.push(`${benchmarkSymbol} handlades ${spyTrades} gånger`);
 if(minCash < -0.01)issues.push(`negativ kontantnivå: ${minCash.toFixed(2)}`);

 let entries=0,entryOpenMismatch=0,signalFailures=0,sameDay=0,sameDayStop=0,bothTouched=0,exitRuleFailures=0,chronologyFailures=0;
 const buyLogs=(s.log||[]).filter(e=>e.a==='KÖP');
 for(const e of buyLogs){
  entries++;
  const di=dateIndex[e.t];
  if(!(di>0)){chronologyFailures++;continue;}
  const signalDate=dates[di-1], bar=map[e.s]?.[e.t];
  if(!bar||Math.abs(bar.o-e.price)>Math.max(1e-8,Math.abs(e.price)*1e-10))entryOpenMismatch++;
  const hist=(g[e.s]||[]).filter(r=>r.t.slice(0,10)<=signalDate);
  if(hist.length<21){signalFailures++;continue;}
  const sig=hist.at(-1),c0=sig.c,c20=hist.at(-21).c,c5=hist.at(-6).c;
  const r20=c0/c20-1,r5=c0/c5-1;
  const rets=hist.slice(-20).map((x,i,a)=>i?Math.log(x.c/a[i-1].c):0).slice(1);
  const vol=sd(rets)*Math.sqrt(252),score=.65*r20+.20*r5-.15*vol;
  if(!(score>.015))signalFailures++;
 }
 for(const x of (s.closed||[])){
  const ei=dateIndex[x.entryDate],xi=dateIndex[x.exitDate];
  if(ei==null||xi==null||xi<ei)chronologyFailures++;
  if(x.entryDate===x.exitDate){sameDay++;if(x.why==='Stop −7%')sameDayStop++;}
  const bar=map[x.symbol]?.[x.exitDate];
  if(!bar)continue;
  const stop=x.entry*.93,target=x.entry*1.12;
  if(bar.l<=stop&&bar.h>=target)bothTouched++;
  if(x.why==='Stop −7%' && !(bar.l<=stop+eps && Math.abs(x.exit-stop)<=Math.max(1e-8,stop*1e-10)))exitRuleFailures++;
  if(x.why==='Vinst +12%' && !(bar.l>stop-eps && bar.h>=target-eps && Math.abs(x.exit-target)<=Math.max(1e-8,target*1e-10)))exitRuleFailures++;
  if(x.why==='20 dagar' && !(xi-ei>=20 && Math.abs(x.exit-bar.c)<=Math.max(1e-8,bar.c*1e-10)))exitRuleFailures++;
 }
 if(entryOpenMismatch)issues.push(`${entryOpenMismatch} köp matchar inte dagens öppningskurs`);
 if(signalFailures)issues.push(`${signalFailures} köp kunde inte återskapas från föregående dags data`);
 if(exitRuleFailures)issues.push(`${exitRuleFailures} exits matchar inte stop/mål/tidsregel`);
 if(chronologyFailures)issues.push(`${chronologyFailures} datum/kronologifel`);
 if(currentGroup().selectionDerived){
  warnings.push("Lina Selection 16 är härledd från tidigare backtester. Resultat på samma/överlappande historik är därför ett urvalstest och inte oberoende validering; nästa bevis måste vara en period som inte användes vid urvalet.");
 } else {
  warnings.push(`${currentGroup().name} är en statisk vald aktielista. Resultatet kan därför innehålla urvals-/survivorship bias.`);
 }
 warnings.push('Swing modellerar ännu inte courtage, spread eller slippage.');
 if(currentProvider()==='eodhd')warnings.push('EODHD:s vanliga EOD-OHLC är råa priser. Splits/dividender och valutaväxling är inte slutligt modellerade; Norden är därför ett datatest, inte en verifierad strategi.');
 return {
  pass:issues.length===0,issues,warnings,entries,closed:(s.closed||[]).length,
  sameDay,sameDayStop,bothTouched,maxPositions,minCash,capitalViolations,positionViolations,
  spyTrades,invalidBars,duplicateBars,unsortedSeries,entryOpenMismatch,signalFailures,exitRuleFailures,chronologyFailures
 };
}

function renderSwingAudit(a){
 const set=(id,v,cls)=>{const e=document.getElementById(id);if(e){e.textContent=v;if(cls!==undefined)e.className=cls}};
 if(!a){['auditStatus','auditEntries','auditSignals','auditCash','auditPos','auditSameDay','auditBoth','auditBars','auditSpy'].forEach(id=>set(id,'—'));return;}
 set('auditStatus',a.pass?'PASS · inga mekaniska fel hittade':'FLAG · kontrollera fel',a.pass?'good':'bad');
 set('auditEntries',`${a.entries} / ${a.closed}`);
 set('auditSignals',a.signalFailures===0?'0 fel':`${a.signalFailures} fel`,a.signalFailures===0?'good':'bad');
 set('auditCash',`${a.capitalViolations} fel · min ${fmt(a.minCash)}`,a.capitalViolations===0?'good':'bad');
 set('auditPos',`${a.maxPositions} max · ${a.positionViolations} fel`,a.positionViolations===0?'good':'bad');
 set('auditSameDay',`${a.sameDay} (${a.sameDayStop} stop)`);
 set('auditBoth',`${a.bothTouched} · stop väljs först`);
 set('auditBars',`${a.invalidBars+a.duplicateBars+a.unsortedSeries} fel`,(a.invalidBars+a.duplicateBars+a.unsortedSeries)===0?'good':'bad');
 set('auditSpy',a.spyTrades===0?'0 affärer':'⚠ '+a.spyTrades,a.spyTrades===0?'good':'bad');
 const issues=document.getElementById('auditIssues');
 if(issues)issues.innerHTML=a.issues.length?'<b>FLAG:</b> '+a.issues.join(' · '):'<b>PASS:</b> signal → nästa öppning, kapital, maxpositioner, exitregler och SPY-handelsförbud klarade kontrollen.';
 const warn=document.getElementById('auditWarnings');
 if(warn)warn.innerHTML=a.warnings.map(x=>'• '+x).join('<br>');
}

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


// V0.34.4 – valideringshjälp. Baslinjens Swing-motor är fortsatt orörd.
const V0344_COST_SIDE=0.001; // 0,10% på köp och 0,10% på sälj.
function v0344CostShadow(s,capital){
 if(!s?.closed?.length)return null;
 let totalCost=0;
 for(const x of s.closed){
  const buy=Math.abs((x.entry||0)*(x.shares||0));
  const sell=Math.abs((x.exit||0)*(x.shares||0));
  totalCost+=(buy+sell)*V0344_COST_SIDE;
 }
 const netEq=s.eq-totalCost,netRet=netEq/capital-1;
 return {totalCost,netEq,netRet,netVsBench:Number.isFinite(s.bench)?netRet-s.bench:null};
}
function v0344RenderValidation(s,capital){
 const c=v0344CostShadow(s,capital),set=(id,v,cls)=>{const e=document.getElementById(id);if(e){e.textContent=v;if(cls)e.className=cls}};
 if(!c){["v0344Gross","v0344Net","v0344Cost","v0344NetVsBench"].forEach(id=>set(id,"—"));return;}
 set("v0344Gross",(s.ret>=0?"+":"")+pct(s.ret),s.ret>=0?"good":"bad");
 set("v0344Net",(c.netRet>=0?"+":"")+pct(c.netRet),c.netRet>=0?"good":"bad");
 set("v0344Cost",fmt(c.totalCost));
 set("v0344NetVsBench",c.netVsBench==null?"—":((c.netVsBench>=0?"+":"")+pct(c.netVsBench)),c.netVsBench>=0?"good":"bad");
 const box=document.getElementById("v0344StockCards");
 if(box){
  const a=v342BuildAnalysis(s);
  box.innerHTML=(a?.symbols||[]).map((x,i)=>`<div class="v0344-stock ${x.totalPnl>=0?"win":"loss"}"><b>${i+1}. ${x.symbol}</b><span>${x.trades} affärer · ${x.winRatePct.toFixed(0)}% vinst</span><strong>${x.totalPnl>=0?"+":""}${fmt(x.totalPnl)}</strong></div>`).join("");
 }
}


function v035SelectPeriodButton(id){
 document.querySelectorAll(".v035-period-choice").forEach(b=>{
   b.classList.remove("active","v035-selected");
   b.removeAttribute("aria-current");
   if(b.dataset.v035OriginalText) b.textContent=b.dataset.v035OriginalText;
 });
 const btn=document.getElementById(id);
 if(btn){
   if(!btn.dataset.v035OriginalText) btn.dataset.v035OriginalText=btn.textContent.replace(/^✓\s*/,"");
   btn.classList.add("active","v035-selected");
   btn.setAttribute("aria-current","true");
   btn.textContent="✓ "+btn.dataset.v035OriginalText;
 }
}
function v035ClearFireSelection(){
 ["v0344FireTest","v035Fire2022"].forEach(id=>{
   const b=document.getElementById(id);
   if(b){
     b.classList.remove("active","v035-selected");
     b.removeAttribute("aria-current");
     if(b.dataset.v035OriginalText) b.textContent=b.dataset.v035OriginalText;
   }
 });
}
function v035SetFire2022(){
 v035SelectPeriodButton("v035Fire2022");
 const start=document.getElementById("start"),end=document.getElementById("end"),ev=document.getElementById("evalStart");
 if(start)start.value="2021-12-01";
 if(ev)ev.value="2022-01-03";
 if(end)end.value="2022-12-30";
 v035RefreshGuide("🔥 Eldprov 2022");
}
function v035ClickTab(n){
 const el=[...document.querySelectorAll("button,a")].find(x=>x.textContent.trim().startsWith(n+"."));
 if(el) el.click();
}
function v035PeriodName(){
 const s=document.getElementById("start")?.value,e=document.getElementById("end")?.value;
 if(s==="2022-12-01"&&e==="2023-12-29")return "🔥 Eldprov 2023";
 if(s==="2021-12-01"&&e==="2022-12-30")return "🔥 Eldprov 2022";
 return s&&e?`${s} → ${e}`:"Välj period";
}
function v035RefreshGuide(label){
 const g=currentGroup?.(), rows=(window.DAILY||[]).length;
 const summary=document.getElementById("v035DataSummary"),check=document.getElementById("v035DataCheck"),next=document.getElementById("v035ToTest");
 const name=g?.name||"Ingen grupp", p=label||v035PeriodName();
 if(summary) summary.innerHTML=`<b>${name}</b><br>${p}${rows?`<br><span class="good">✓ ${rows.toLocaleString("sv-SE")} dagsrader hämtade</span>`:""}`;
 if(check) check.textContent=rows?"Data klar ✓":"Välj grupp och period";
 if(next) next.hidden=!rows;
 const ts=document.getElementById("v035TestSummary");
 if(ts) ts.innerHTML=rows?`<b>${name}</b><br>${p}<br>${rows.toLocaleString("sv-SE")} dagsrader · 100 000 startkapital<br><span class="good">Swing · fryst strategi</span>`:"Data måste hämtas först.";
}
function v035RenderHero(s){
 const lead=document.getElementById("v035ResultLead"),hero=document.getElementById("v035HeroResult");
 if(!lead||!hero||!s)return;
 const cap=Number(document.getElementById("capital")?.value||100000),c=v0344CostShadow(s,cap);
 lead.hidden=false;
 hero.innerHTML=`<div><span>LINA</span><strong>${s.ret>=0?"+":""}${pct(s.ret)}</strong></div>
 <div><span>${currentBenchmark()}</span><strong>${s.bench>=0?"+":""}${pct(s.bench)}</strong></div>
 <div><span>Skillnad</span><strong>${s.vs>=0?"+":""}${pct(s.vs)}</strong></div>
 ${c?`<div><span>Efter kostnader</span><strong>${c.netRet>=0?"+":""}${pct(c.netRet)}</strong></div>`:""}`;
}
window.addEventListener("DOMContentLoaded",()=>{
 document.getElementById("v035Fire2022")?.addEventListener("click",v035SetFire2022);
 document.getElementById("v035ToTest")?.addEventListener("click",()=>v035ClickTab("2"));
 document.getElementById("v035NextTest")?.addEventListener("click",()=>{v035ClickTab("1");setTimeout(v035SetFire2022,60);});
 document.querySelectorAll(".v035-period-choice[data-period]").forEach(btn=>{
   if(!btn.dataset.v035OriginalText) btn.dataset.v035OriginalText=btn.textContent;
   btn.addEventListener("click",()=>{
     document.querySelectorAll(".v035-period-choice").forEach(b=>{
       b.classList.remove("active","v035-selected");
       b.removeAttribute("aria-current");
       if(b.dataset.v035OriginalText) b.textContent=b.dataset.v035OriginalText;
     });
     btn.classList.add("active","v035-selected");
     btn.setAttribute("aria-current","true");
     btn.textContent="✓ "+btn.dataset.v035OriginalText;
   });
 });
 setTimeout(v035RefreshGuide,100);
});
function v0344SetFireTest(){
 v035SelectPeriodButton("v0344FireTest");
 const start=document.getElementById("start"),end=document.getElementById("end"),ev=document.getElementById("evalStart");
 if(start)start.value="2022-12-01"; // uppvärmning före testet
 if(ev)ev.value="2023-01-03";
 if(end)end.value="2023-12-29";
 v035RefreshGuide("🔥 Eldprov 2023");
 const st=document.getElementById("testDataStatus");
 if(st)st.innerHTML='<span class="good">🔥 Eldprov 2023 valt · helt före urvalsperioderna 2024–2026. Hämta dagsdata och kör utan att ändra Swing.</span>';
}
window.addEventListener("DOMContentLoaded",()=>document.getElementById("v0344FireTest")?.addEventListener("click",v0344SetFireTest));

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
   provider:currentProvider(),benchmark:currentBenchmark(),
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
  audit:LAST?.audit||null,
  costShadow:s?v0344CostShadow(s,Number(document.getElementById("capital")?.value||0)):null,
  swing:s?{
   endingCapital:s.eq,returnPct:s.ret*100,maxDrawdownPct:s.dd*100,
   trades:s.n,winRatePct:s.wr*100,
   benchmark:currentBenchmark(),benchmarkReturnPct:Number.isFinite(s.bench)?s.bench*100:null,
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
 if(s){
  const a342=v342AnalyzeSwing(s);
  payload.symbolAnalysis={
   profitableSymbols:a342.positives.length,losingSymbols:a342.negatives.length,totalSymbols:a342.symbols.length,
   top3ShareOfGrossProfitPct:a342.top3Share*100,concentration:a342.concentration,
   symbols:a342.symbols.map(x=>({symbol:x.symbol,trades:x.trades,wins:x.wins,losses:x.losses,winRatePct:x.winRate*100,totalPnl:x.pnl,targets:x.targets,stops:x.stops,timeExits:x.time,bestTrade:x.best,worstTrade:x.worst}))
  };
 }
 payload.v034Experiment=V034_LAST?{mode:V034_MODE,endingCapital:V034_LAST.eq,returnPct:V034_LAST.ret*100,maxDrawdownPct:V034_LAST.dd*100,trades:V034_LAST.trades,rule:V034_LAST.rule}:null;
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
 a.push("DATA",`Marknadsgrupp: ${p.data.marketGroup||"Egen lista"}`,`Datakälla: ${p.data.provider||"—"}`,`Benchmark: ${p.data.benchmark||"—"}`,`Symboler: ${p.data.symbols}`,`Data: ${p.data.from} → ${p.data.to}`,`Teststart: ${p.data.evaluationStart}`,`Dagsrader: ${p.data.dailyRows}`,`5-min-rader: ${p.data.fiveMinuteRows}`,"");
 a.push("INSTÄLLNINGAR",`Startkapital: ${p.settings.startCapital}`,`Max position swing: ${p.settings.swingMaxPosition}`,`Risk/affär day: ${p.settings.dayRiskPerTrade}`,"");
 if(p.audit){let z=p.audit;a.push("SWING REVISION V0.31",`Status: ${z.pass?"PASS":"FLAG"}`,`Kontrollerade köp / avslut: ${z.entries} / ${z.closed}`,`Signalfel: ${z.signalFailures}`,`Kapitalfel: ${z.capitalViolations}`,`Max samtidiga positioner: ${z.maxPositions}`,`Positionsfel: ${z.positionViolations}`,`Samma-dag exits: ${z.sameDay}`,`Samma-dag stop: ${z.sameDayStop}`,`Både stop och mål berörda samma dag: ${z.bothTouched}`,`OHLC/duplikat/sorteringsfel: ${z.invalidBars+z.duplicateBars+z.unsortedSeries}`,`SPY-affärer: ${z.spyTrades}`,`Exitregelfel: ${z.exitRuleFailures}`,`Kronologifel: ${z.chronologyFailures}`,`Varningar: ${z.warnings.join(" | ")}`,"");}
 if(s){
  a.push("OPTI SWING",`Slutkapital: ${s.endingCapital}`,`Avkastning: ${s.returnPct.toFixed(2)}%`,`Max drawdown: ${s.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${s.trades}`,`Vinstfrekvens: ${s.winRatePct.toFixed(2)}%`,`Benchmark: ${s.benchmark}`,`${s.benchmark}: ${s.benchmarkReturnPct==null?"—":s.benchmarkReturnPct.toFixed(2)+"%"}`,`Mot benchmark: ${s.vsBenchmarkPct==null?"—":s.vsBenchmarkPct.toFixed(2)+"%"}`,`Profit factor: ${s.profitFactor}`,`Snittvinst: ${s.averageWin}`,`Snittförlust: ${s.averageLoss}`,`Bästa affär: ${s.bestTrade}`,`Sämsta affär: ${s.worstTrade}`,`Öppna vid slut: ${s.openAtEnd}`,"");
 }
 if(p.costShadow){let c=p.costShadow;a.push("KOSTNADSTEST V0.34.4","Antagande: 0.10% köp + 0.10% sälj",`Total modellerad kostnad: ${c.totalCost}`,`Slutkapital efter kostnad: ${c.netEq}`,`Avkastning efter kostnad: ${(c.netRet*100).toFixed(2)}%`,`Mot benchmark efter kostnad: ${c.netVsBench==null?"—":(c.netVsBench*100).toFixed(2)+"%"}`,"");}
 if(p.worldTest){let w=p.worldTest;a.push("OMVÄRLDSTEST V0.26",`Regel: ${w.rule}`,`Slutkapital: ${w.endingCapital}`,`Avkastning: ${w.returnPct.toFixed(2)}%`,`Max drawdown: ${w.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${w.trades}`,`Vinstfrekvens: ${w.winRatePct.toFixed(2)}%`,`Profit factor: ${w.profitFactor}`,`Mot baslinjen: ${w.vsBaselinePct==null?"—":w.vsBaselinePct.toFixed(2)+"%"}`,`Gröna dagar: ${w.regimeDays?.green||0}`,`Gula dagar: ${w.regimeDays?.yellow||0}`,`Röda dagar: ${w.regimeDays?.red||0}`,`Blockerade signaler totalt: ${w.blockedSignals}`,`Blockerade i gult: ${w.blockedYellow}`,`Blockerade i rött: ${w.blockedRed}`,`Gul/röd-dagar med rå signal: ${w.regimeSignalDays}`,`Regimdiagnostik (första 20): ${JSON.stringify(w.regimeSamples)}`,"");}
 if(d)a.push("OPTI DAY A – BASLINJE",`Regel: ${d.rule}`,`Slutkapital: ${d.endingCapital}`,`Avkastning: ${d.returnPct.toFixed(2)}%`,`Max drawdown: ${d.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${d.trades}`,`Vinstfrekvens: ${d.winRatePct.toFixed(2)}%`,`Profit factor: ${d.profitFactor}`,`Snitt/affär: ${d.averageTrade}`,`Affärer/dag: ${d.tradesPerDay}`,"");

 if(dB)a.push("OPTI DAY B – BEKRÄFTAD MOMENTUM",`Regel: ${dB.rule}`,`Slutkapital: ${dB.endingCapital}`,`Avkastning: ${dB.returnPct.toFixed(2)}%`,`Max drawdown: ${dB.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${dB.trades}`,`Vinstfrekvens: ${dB.winRatePct.toFixed(2)}%`,`Profit factor: ${dB.profitFactor}`,`Snitt/affär: ${dB.averageTrade}`,`Affärer/dag: ${dB.tradesPerDay}`,`Mot A: ${dB.vsBaselinePct==null?"—":dB.vsBaselinePct.toFixed(2)+"%"}`,`Godkända / råa A-signaler: ${dB.passedSignals} / ${dB.rawSignals}`,"");
 if(p.symbolAnalysis){let x=p.symbolAnalysis;a.push("SYMBOLANALYS",`Vinstgivande symboler: ${x.profitableSymbols} / ${x.totalSymbols}`,`Förlustsymboler: ${x.losingSymbols} / ${x.totalSymbols}`,`Topp 3 andel av bruttovinsten: ${x.top3ShareOfGrossProfitPct.toFixed(1)}%`,`Koncentration: ${x.concentration}`);(x.symbols||[]).forEach((q,i)=>a.push(`${i+1}. ${q.symbol} | affärer ${q.trades} | vinster ${q.wins} | förluster ${q.losses} | vinstfrekvens ${q.winRatePct.toFixed(1)}% | total P/L ${q.totalPnl} | mål ${q.targets} | stop ${q.stops}`));a.push("")}
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
 if(p.v034Experiment){let x=p.v034Experiment;a.push("","V0.34 GLOBAL EXPERIMENT",`Läge: ${x.mode}`,`Slutkapital: ${x.endingCapital}`,`Avkastning: ${x.returnPct.toFixed(2)}%`,`Max drawdown: ${x.maxDrawdownPct.toFixed(2)}%`,`Avslut: ${x.trades}`,`Regel: ${x.rule}`)}
 return a.join("\n");
}
async function v17Share(full){
 const status=document.getElementById("v17ExportStatus");
 const menu=document.getElementById("v23ShareMenu"),toggle=document.getElementById("v23ShareToggle");
 const closeMenu=()=>{if(menu)menu.hidden=true;if(toggle)toggle.setAttribute("aria-expanded","false");};
 if(!LAST?.s&&!LAST?.d){if(status)status.textContent="Kör ett test först.";return}
 closeMenu();
 const txt=v17TextReport(full);
 const stamp=new Date().toISOString().slice(0,10);
 const name=`linasopti_v0301_${full?"full":"snabb"}_${stamp}.txt`;
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
   if(p==="1y"){
     const toDate=new Date(now.getFullYear(),now.getMonth(),now.getDate());
     const fromDate=new Date(toDate); fromDate.setFullYear(fromDate.getFullYear()-1);
     const testDate=new Date(fromDate); testDate.setMonth(testDate.getMonth()+5);
     from=localISO(fromDate); to=localISO(toDate); testStart=localISO(testDate);
   }
   else if(p==="2024"){from="2024-01-01";to="2024-12-31";testStart="2024-02-01";}
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

// V0.35 guided-flow observer: UI-only; does not alter data or strategy.
window.addEventListener("DOMContentLoaded",()=>{
 const root=document.body;
 const obs=new MutationObserver(()=>{ if((window.DAILY||[]).length) v035RefreshGuide(); });
 obs.observe(root,{subtree:true,childList:true,characterData:true});
});

window.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".v035-period-choice").forEach(btn=>{
   if(!btn.dataset.v035OriginalText) btn.dataset.v035OriginalText=btn.textContent.replace(/^✓\s*/,"");
 });
});

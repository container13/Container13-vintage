
const APP_VERSION = "V0.42.4";
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
 const g=MARKET_GROUPS[key]; if(!g)return;
 // V0.38.7: ge touch/klick omedelbar visuell respons innan övrig UI-städning.
 ACTIVE_MARKET=key;
 document.querySelectorAll(".market-btn[data-market]").forEach(b=>b.classList.toggle("active",b.dataset.market===key));
 const bs=document.getElementById("bridgeStatus"); if(bs)bs.textContent=`${g.name} vald. Hämta data för att testa gruppen.`;
 requestAnimationFrame(()=>{
   const el=document.getElementById("symbols"); if(el)el.value=g.symbols.join(",");
   const info=document.getElementById("marketGroupInfo"); if(info)info.textContent=`${g.name} · ${g.symbols.length-currentBenchmarks().length} aktier + ${g.benchmark}`;
   const pi=document.getElementById("providerInfo"); if(pi)pi.textContent=`Datakälla: ${g.provider==="eodhd"?"EODHD":"Alpaca"} · Benchmark: ${g.benchmark}`;
   const ib=document.getElementById("intraBtn"); if(ib){ib.disabled=g.provider!=="alpaca";ib.title=g.provider!=="alpaca"?"Opti Day är tills vidare endast USA":"";}
   DAILY=[]; INTRA=[]; LAST=null;
   updateTestDataStatus(); updateDataStatus(); if(window.V0404_REFRESH_DATATYPE)window.V0404_REFRESH_DATATYPE();
 });
}
window.addEventListener("DOMContentLoaded",()=>{
 document.querySelectorAll(".market-btn[data-market]:not([disabled])").forEach(b=>b.addEventListener("click",()=>setMarketGroup(b.dataset.market)));
});
let DAILY=[], INTRA=[], LAST=null;
const API_BASE = "https://linas-opti-api.mangaj73.workers.dev";
const $=id=>document.getElementById(id);
let V0404_TEST_READY_ACK=false;
let V0405_TEST_COMPLETED=false;
function show(p,fromTab=false){
  if(p==="data" && fromTab && LAST){
    V0404_TEST_READY_ACK=true;
    const tt=document.querySelector('.tab[data-pane="test"]');
    if(tt){tt.classList.remove("data-ready");tt.setAttribute("data-ready-label","");}
    if(V0405_TEST_COMPLETED){
      const bs=document.getElementById("bridgeStatus");
      if(bs){bs.className="status";bs.textContent="Senaste test klart · välj ny period och hämta data.";}
    }
  }
  const engine=document.getElementById("v0423Engine");
  const labPick=document.getElementById("v0423LabPick");
  const testerNav=document.getElementById("v0424TesterNav");
  const inLab=p==="testlab";
  if(engine) engine.value=inLab?"testlab":"tester";
  if(labPick) labPick.hidden=!inLab;
  if(testerNav) testerNav.hidden=inLab;
  document.querySelectorAll(".v0424-subtab").forEach(b=>b.classList.toggle("active",b.dataset.pane===p));
  ["data","test","result","testlab"].forEach(x=>$("pane-"+x).classList.toggle("hidden",x!==p));
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
updateDataStatus();v035RefreshGuide()}catch(e){$("csvStatus").innerHTML='<span class="bad">'+e.message+"</span>"}
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
function v0406Busy(el, text){
 if(!el)return;
 el.className="status v0406-live";
 el.innerHTML='<span class="v0406-spinner" aria-hidden="true"></span><span>'+text+'</span><span class="v0406-dots" aria-hidden="true"></span>';
}
function v0406SetTestStage(text){
 const el=document.getElementById("v0406RunStatus");
 if(!el)return;
 el.hidden=false;
 el.className="v0406-run-status v0406-live";
 el.innerHTML='<span class="v0406-spinner" aria-hidden="true"></span><strong>'+text+'</strong><span class="v0406-dots" aria-hidden="true"></span>';
}
function v0406Yield(ms=35){return new Promise(r=>setTimeout(r,ms));}
function v0406ResultContext(hasDaily,has5){
 document.querySelectorAll(".v0406-daily-only").forEach(el=>el.style.display=hasDaily?"":"none");
 document.querySelectorAll(".v0406-intra-only").forEach(el=>el.style.display=has5?"":"none");
 const both=hasDaily&&has5;
 const label=document.getElementById("v0406ResultType");
 if(label){label.textContent=both?"Dagsdata + 5-min-data":has5?"5-min-data · Lina Day":"Dagsdata · Swing / Trend";label.hidden=false;}
}

async function getBars(tf){
 V0404_TEST_READY_ACK=false;
 V0405_TEST_COMPLETED=false;
 if(currentProvider()==="eodhd" && tf!=="1Day"){const el=$("bridgeStatus");if(el){el.className="status bad";el.textContent="Opti Day/5-min är tills vidare endast USA.";}return;}
 const btn=tf==="1Day"?$("dailyBtn"):$("intraBtn"); const old=btn?.textContent;
 try{
  if(btn){btn.disabled=true;btn.textContent="Hämtar…";}
  const fetchBtn=document.getElementById("fetchDataBtn"); if(fetchBtn){fetchBtn.disabled=true;fetchBtn.innerHTML='<span class="v0406-spinner small"></span> Hämtar data…';}
  const bs=$("bridgeStatus"); v0406Busy(bs,"Kontaktar datakällan");
  let secs=0; const ticker=setInterval(()=>{secs++; const live=$("bridgeStatus"); if(live&&live.classList.contains("v0406-live")){const txt=tf==="5Min"?"Hämtar 5-min-data":"Hämtar dagsdata";v0406Busy(live,txt+" · "+secs+" s");}},1000);
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
  if(tf==="5Min" && window.V0403_DAY_WINDOW?.days){
    const w=window.V0403_DAY_WINDOW;
    const dates=[...new Set(rows.map(r=>String(r.t).slice(0,10)))].filter(d=>d>=w.start).sort().slice(0,w.days);
    const keep=new Set(dates); rows=rows.filter(r=>keep.has(String(r.t).slice(0,10)));
    const st=document.getElementById("dayPeriodStatus");
    if(st) st.textContent=dates.length?`✓ ${dates.length} handelsdagar: ${dates[0]} → ${dates[dates.length-1]}`:`Inga handelsdagar hittades från ${w.start}.`;
  }
  if(tf==="1Day")DAILY=rows;else INTRA=rows; updateTestDataStatus();updateDataStatus();v035RefreshGuide();paintBridgeDone(rows.length,tf);
 }catch(e){$("bridgeStatus").className="status bad";$("bridgeStatus").textContent=e.message;}finally{
  try{clearInterval(ticker);}catch(e){}
  if(btn){btn.disabled=false;btn.textContent=old;}
  const fetchBtn=document.getElementById("fetchDataBtn"); if(fetchBtn){fetchBtn.disabled=false;fetchBtn.textContent="Hämta data";}
 }
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
 // V0.39.4 Lina Day – Jägaren. Mekanisk korrigering ovanpå fryst forskningsmotor.
 // Princip: avslutad 5-minbar -> ranka alla symboler -> köp nästa bars open.
 // En position åt gången för entydig kapital/kronologi. Ingen hävstång, ingen övernattning.
 if(!rows.length)return null;
 const nyParts=(iso)=>{const a=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(iso));const o={};a.forEach(x=>o[x.type]=x.value);return {d:o.year+"-"+o.month+"-"+o.day,m:(+o.hour)*60+(+o.minute)}};
 const byDay={};
 for(const r of rows){if(r.symbol==="SPY")continue;const z=nyParts(r.t);if(z.m<570||z.m>=960)continue;(byDay[z.d]??={});(byDay[z.d][r.symbol]??=[]).push({...r,_m:z.m});}
 let eq=capital,peak=capital,dd=0,closed=[],log=[],curve=[];
 const spread=.00035,slip=.00025,costSide=spread/2+slip;
 const maxTradesDay=6,maxPosPct=.20,stopPct=.006,targetPct=.010,maxHoldBars=8;
 let dayCount=0;
 for(const d of Object.keys(byDay).sort()){
   dayCount++; let tradesToday=0,position=null;
   const syms=byDay[d]; Object.values(syms).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));
   const timeline=[...new Set(Object.values(syms).flat().map(b=>b.t))].sort((a,b)=>new Date(a)-new Date(b));
   const idx={}; for(const [sym,a] of Object.entries(syms)){idx[sym]=new Map(a.map((b,i)=>[b.t,i]));}
   for(let ti=0;ti<timeline.length;ti++){
     const ts=timeline[ti];
     // Hantera öppen position först på aktuell bars OHLC.
     if(position){
       const a=syms[position.s], i=idx[position.s].get(ts); if(i!=null){
         const b=a[i]; let raw=null,why=null;
         // V0.39.4 konservativ entrybar: köp sker vid barens open, men stop/mål
         // utvärderas först från efterföljande 5-minutersbar. Detta tar bort
         // beroendet av okänd intrabar-ordning i själva entrybaren.
         if(i>position.entryIdx){
           if(b.l<=position.stop){raw=position.stop;why="stop −0,6%";}
           else if(b.h>=position.target){raw=position.target;why="mål +1,0%";}
           else if(i-position.entryIdx>=maxHoldBars){raw=b.c;why="max 40 min";}
           else if(b._m>=950){raw=b.c;why="stängning 15:50";}
         }
         if(raw!=null){const exit=raw*(1-costSide),pl=position.shares*(exit-position.entry);eq+=pl;closed.push({symbol:position.s,entryTime:position.entryTime,exitTime:b.t,entry:position.entry,exit,shares:position.shares,pnl:pl,ret:exit/position.entry-1,why,setup:position.setup,score:position.score,entryEquity:position.entryEquity});log.push({t:b.t,robot:"Lina Day Jägaren",s:position.s,a:"SÄLJ",price:exit,amount:position.shares*exit,why,pnl:pl});position=null;tradesToday++;}
       }
     }
     if(position||tradesToday>=maxTradesDay)continue;
     // Ranka signaler på helt avslutad bar. Köp får ske först på nästa bars open.
     let candidates=[];
     for(const [sym,a] of Object.entries(syms)){
       const i=idx[sym].get(ts); if(i==null||i<12||i>=a.length-1)continue;
       const b=a[i]; if(b._m<630||b._m>930)continue; // 10:30–15:30 NY
       const hist=a.slice(i-11,i+1),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/Math.max(1,hist.length-1);
       const r3=b.c/a[i-3].c-1,r1=b.c/a[i-1].c-1,range=Math.max(.000001,b.h-b.l),closeLoc=(b.c-b.l)/range,volRatio=avgVol?((+b.v||0)/avgVol):0;
       const sma=hist.reduce((q,x)=>q+x.c,0)/hist.length;
       if(r3<.004||r1<=0||b.c<=sma||closeLoc<.60||volRatio<1.15)continue;
       const score=r3*100 + r1*55 + Math.min(volRatio,3)*.18 + closeLoc*.12;
       candidates.push({sym,i,score,setup:`momentum ${(r3*100).toFixed(2)}% / volym ${volRatio.toFixed(2)}x`});
     }
     candidates.sort((a,b)=>b.score-a.score); const c=candidates[0]; if(!c)continue;
     const next=syms[c.sym][c.i+1]; if(!next||next._m>=950)continue;
     const entry=next.o*(1+costSide),stop=entry*(1-stopPct),target=entry*(1+targetPct);
     const risk=Math.max(0,eq*riskPct),riskPerShare=Math.max(.0001,entry-stop),shares=Math.min((eq*maxPosPct)/entry,risk/riskPerShare);
     if(!(shares>0))continue;
     position={s:c.sym,entry,entryTime:next.t,entryIdx:c.i+1,shares,stop,target,score:c.score,setup:c.setup,entryEquity:eq};
     log.push({t:next.t,robot:"Lina Day Jägaren",s:c.sym,a:"KÖP",price:entry,amount:shares*entry,why:c.setup});
   }
   // Säkerhetsstängning på sista tillgängliga bar – aldrig över natt.
   if(position){const a=syms[position.s],b=a[a.length-1],exit=b.c*(1-costSide),pl=position.shares*(exit-position.entry);eq+=pl;closed.push({symbol:position.s,entryTime:position.entryTime,exitTime:b.t,entry:position.entry,exit,shares:position.shares,pnl:pl,ret:exit/position.entry-1,why:"dagsslut",setup:position.setup,score:position.score,entryEquity:position.entryEquity});log.push({t:b.t,robot:"Lina Day Jägaren",s:position.s,a:"SÄLJ",price:exit,amount:position.shares*exit,why:"dagsslut",pnl:pl});position=null;tradesToday++;}
   peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq});
 }
 const wins=closed.filter(x=>x.pnl>0),losses=closed.filter(x=>x.pnl<0),grossWin=wins.reduce((a,x)=>a+x.pnl,0),grossLoss=Math.abs(losses.reduce((a,x)=>a+x.pnl,0)),pf=grossLoss?grossWin/grossLoss:(grossWin?Infinity:0);
 return {eq,ret:eq/capital-1,dd,n:closed.length,wr:closed.length?wins.length/closed.length:0,avg:closed.length?(eq-capital)/closed.length:0,log,curve,closed,pf,tradesPerDay:dayCount?closed.length/dayCount:0,maxTradesDay,maxTradesSymbol:1,engine:"Lina Day Jägaren V1",rules:{maxPosPct,stopPct,targetPct,maxHoldBars,costSide}};
}



function daytradePro(rows,capital,riskPct){
 // V0.40.2 Lina Day PRO 2 – tids-/regimmedveten challenger.
 // Hypotesen kommer från V0.40.1-analysen. Baseline daytrade() är orörd.
 if(!rows.length)return null;
 const nyParts=(iso)=>{const a=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(iso));const o={};a.forEach(x=>o[x.type]=x.value);return {d:o.year+"-"+o.month+"-"+o.day,m:(+o.hour)*60+(+o.minute)}};
 const byDay={};for(const r of rows){if(r.symbol==="SPY")continue;const z=nyParts(r.t);if(z.m<570||z.m>=960)continue;(byDay[z.d]??={});(byDay[z.d][r.symbol]??=[]).push({...r,_m:z.m});}
 let eq=capital,peak=capital,dd=0,closed=[],log=[],curve=[];
 const spread=.00035,slip=.00025,costSide=spread/2+slip,maxTradesDay=4,maxPosPct=.20,stopPct=.006,targetPct=.010,maxHoldBars=8;
 let dayCount=0,rawSignals=0,passedSignals=0,blockedMidday=0;
 for(const d of Object.keys(byDay).sort()){
  dayCount++;let tradesToday=0,position=null;const syms=byDay[d];Object.values(syms).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));
  const timeline=[...new Set(Object.values(syms).flat().map(b=>b.t))].sort((a,b)=>new Date(a)-new Date(b));const idx={};for(const [sym,a] of Object.entries(syms))idx[sym]=new Map(a.map((b,i)=>[b.t,i]));
  for(const ts of timeline){
   if(position){const a=syms[position.s],i=idx[position.s].get(ts);if(i!=null){const b=a[i];let raw=null,why=null;if(i>position.entryIdx){if(b.l<=position.stop){raw=position.stop;why="stop −0,6%"}else if(b.h>=position.target){raw=position.target;why="mål +1,0%"}else if(i-position.entryIdx>=maxHoldBars){raw=b.c;why="max 40 min"}else if(b._m>=950){raw=b.c;why="stängning 15:50"}}if(raw!=null){const exit=raw*(1-costSide),pl=position.shares*(exit-position.entry);eq+=pl;closed.push({...position,symbol:position.s,exitTime:b.t,exit,pnl:pl,ret:exit/position.entry-1,why});log.push({t:b.t,robot:"Lina Day PRO 2",s:position.s,a:"SÄLJ",price:exit,amount:position.shares*exit,why,pnl:pl});position=null;tradesToday++;}}}
   if(position||tradesToday>=maxTradesDay)continue;
   let candidates=[];
   for(const [sym,a] of Object.entries(syms)){
    const i=idx[sym].get(ts);if(i==null||i<15||i>=a.length-1)continue;const b=a[i];if(b._m<630||b._m>915)continue;
    const hist=a.slice(i-14,i+1),prev=hist.at(-2),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/14;
    const r1=b.c/prev.c-1,r3=b.c/a[i-3].c-1,r6=b.c/a[i-6].c-1,prev2=prev.c/a[i-2].c-1,range=Math.max(.000001,b.h-b.l),closeLoc=(b.c-b.l)/range,volRatio=avgVol?((+b.v||0)/avgVol):0,sma=hist.reduce((q,x)=>q+x.c,0)/hist.length,stretch=b.c/sma-1;
    if(r3>=.004&&r1>0&&b.c>sma&&closeLoc>=.60&&volRatio>=1.15)rawSignals++;
    // PRO 2: undvik den svaga lunchregimen 12–14 NY. Behåll öppnings-/senregim.
    if(b._m>=720&&b._m<840){blockedMidday++;continue;}
    // Undvik extrema jaktlägen. Volym används som kvalitet, inte "ju mer desto bättre".
    if(r3<.004||r3> .012||r1<=0||r6<.0025||b.c<=sma||closeLoc<.62||volRatio<1.15||volRatio>3.0||stretch>.020||prev2<-.005)continue;
    passedSignals++;
    const late=b._m>=900, sweet=(r3>=.0075&&r3<.0100)?0.55:0, volSweet=(volRatio>=2&&volRatio<3)?0.25:0, timeBoost=late?0.70:(b._m<720?0.20:0.10), accel=r1-prev2;
    const score=r3*105+r6*35+Math.max(-.01,Math.min(.01,accel))*40+Math.min(volRatio,3)*.12+closeLoc*.12+sweet+volSweet+timeBoost-Math.max(0,stretch-.012)*70;
    candidates.push({sym,i,score,setup:`PRO2 ${score.toFixed(2)} · m3 ${(r3*100).toFixed(2)}% · m6 ${(r6*100).toFixed(2)}% · vol ${volRatio.toFixed(2)}x · close ${(closeLoc*100).toFixed(0)}% · ${late?'sen':'normal'} regim`});
   }
   candidates.sort((a,b)=>b.score-a.score);const c=candidates[0];if(!c)continue;const next=syms[c.sym][c.i+1];if(!next||next._m>=950)continue;
   const entry=next.o*(1+costSide),stop=entry*(1-stopPct),target=entry*(1+targetPct),risk=Math.max(0,eq*riskPct),riskPerShare=Math.max(.0001,entry-stop),shares=Math.min((eq*maxPosPct)/entry,risk/riskPerShare);if(!(shares>0))continue;
   position={s:c.sym,entry,entryTime:next.t,entryIdx:c.i+1,shares,stop,target,score:c.score,setup:c.setup,entryEquity:eq};log.push({t:next.t,robot:"Lina Day PRO 2",s:c.sym,a:"KÖP",price:entry,amount:shares*entry,why:c.setup});
  }
  if(position){const a=syms[position.s],b=a[a.length-1],exit=b.c*(1-costSide),pl=position.shares*(exit-position.entry);eq+=pl;closed.push({...position,symbol:position.s,exitTime:b.t,exit,pnl:pl,ret:exit/position.entry-1,why:"dagsslut"});log.push({t:b.t,robot:"Lina Day PRO 2",s:position.s,a:"SÄLJ",price:exit,amount:position.shares*exit,why:"dagsslut",pnl:pl});}
  peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq});
 }
 const wins=closed.filter(x=>x.pnl>0),losses=closed.filter(x=>x.pnl<0),gw=wins.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(losses.reduce((a,x)=>a+x.pnl,0)),pf=gl?gw/gl:(gw?Infinity:0);
 return {eq,ret:eq/capital-1,dd,n:closed.length,wr:closed.length?wins.length/closed.length:0,avg:closed.length?(eq-capital)/closed.length:0,log,curve,closed,pf,tradesPerDay:dayCount?closed.length/dayCount:0,rawSignals,passedSignals,blockedMidday,maxTradesDay,maxTradesSymbol:1,engine:"Lina Day PRO 2 V0.40.2",rules:{maxPosPct,stopPct,targetPct,maxHoldBars,costSide}};
}


function v0401DayAnalysis(base,pro){
 const nyMin=iso=>{const a=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(iso)),o={};a.forEach(x=>o[x.type]=x.value);return (+o.hour)*60+(+o.minute)};
 const stats=arr=>{const n=arr.length,w=arr.filter(x=>x.pnl>0),l=arr.filter(x=>x.pnl<0),gp=w.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(l.reduce((a,x)=>a+x.pnl,0));return {n,wr:n?w.length/n:0,pnl:arr.reduce((a,x)=>a+x.pnl,0),avg:n?arr.reduce((a,x)=>a+x.pnl,0)/n:0,pf:gl?gp/gl:(gp?Infinity:0)}};
 const group=(arr,key)=>{const m={};for(const x of arr){const k=key(x);(m[k]??=[]).push(x)}return Object.entries(m).map(([name,a])=>({name,...stats(a)})).sort((a,b)=>b.n-a.n)};
 const enrich=(arr,isPro)=>arr.map(x=>{let m3=null,vol=null,m6=null,cl=null;const q=String(x.setup||"");let m=q.match(/(?:m3 |momentum )([0-9.]+)%/);if(m)m3=+m[1];m=q.match(/(?:vol |volym )([0-9.]+)x/);if(m)vol=+m[1];m=q.match(/m6 ([0-9.]+)%/);if(m)m6=+m[1];m=q.match(/close ([0-9.]+)%/);if(m)cl=+m[1];return {...x,m3,vol,m6,cl,min:nyMin(x.entryTime),hold:(new Date(x.exitTime)-new Date(x.entryTime))/60000,isPro}});
 const bucket=(v,cuts,labels)=>{for(let i=0;i<cuts.length;i++)if(v<cuts[i])return labels[i];return labels.at(-1)};
 const one=(arr,isPro)=>{const a=enrich(arr||[],isPro);return {overall:stats(a),time:group(a,x=>x.min<660?'10:30–11:00':x.min<720?'11:00–12:00':x.min<780?'12:00–13:00':x.min<840?'13:00–14:00':x.min<900?'14:00–15:00':'15:00–15:30'),momentum:group(a,x=>x.m3==null?'okänd':bucket(x.m3,[.55,.75,1.0,1.5],['<0,55%','0,55–0,75%','0,75–1,00%','1,00–1,50%','≥1,50%'])),volume:group(a,x=>x.vol==null?'okänd':bucket(x.vol,[1.3,1.6,2.0,3.0],['<1,30x','1,30–1,60x','1,60–2,00x','2,00–3,00x','≥3,00x'])),symbol:group(a,x=>x.symbol),hold:group(a,x=>bucket(x.hold,[10,20,30,40],['<10 min','10–20 min','20–30 min','30–40 min','40 min'])),exit:group(a,x=>String(x.why||'okänd').replace(/ −0,6%| \+1,0%/g,''))};};
 const B=one(base?.closed,false),P=one(pro?.closed,true);
 const best=rows=>[...rows].filter(x=>x.n>=3).sort((a,b)=>b.avg-a.avg).slice(0,3),worst=rows=>[...rows].filter(x=>x.n>=3).sort((a,b)=>a.avg-b.avg).slice(0,3);
 return {baseline:B,pro:P,proBestTime:best(P.time),proWorstTime:worst(P.time),proBestMomentum:best(P.momentum),proWorstMomentum:worst(P.momentum),proBestVolume:best(P.volume),proWorstVolume:worst(P.volume),note:'Deskriptiv analys av samma testperiod – används för hypoteser, inte som oberoende validering.'};
}
function v0401RenderAnalysis(A){
 const root=document.getElementById('v0401Analysis');if(!root)return;if(!A){root.innerHTML='<span class="muted">Kör ett Day-test för analys.</span>';return}
 const tbl=(title,rows)=>`<div class="v0401-block"><h3>${title}</h3><div style="overflow:auto"><table><thead><tr><th>Grupp</th><th>N</th><th>WR</th><th>PF</th><th>Snitt</th><th>P/L</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${x.name}</b></td><td>${x.n}</td><td>${(x.wr*100).toFixed(0)}%</td><td>${x.pf===Infinity?'∞':x.pf.toFixed(2)}</td><td class="${x.avg>=0?'good':'bad'}">${x.avg>=0?'+':''}${fmt(x.avg)}</td><td class="${x.pnl>=0?'good':'bad'}">${x.pnl>=0?'+':''}${fmt(x.pnl)}</td></tr>`).join('')}</tbody></table></div></div>`;
 root.innerHTML=`<div class="muted" style="margin-bottom:10px">${A.note}</div>${tbl('PRO · tid på dagen',A.pro.time)}${tbl('PRO · momentumintervall',A.pro.momentum)}${tbl('PRO · relativ volym',A.pro.volume)}${tbl('PRO · exittyp',A.pro.exit)}${tbl('PRO · symboler',A.pro.symbol)}${tbl('Baseline · tid på dagen',A.baseline.time)}`;
}
function v0401AnalysisText(A){if(!A)return[];const f=x=>`${x.name}: n=${x.n}, WR=${(x.wr*100).toFixed(1)}%, PF=${x.pf===Infinity?'∞':x.pf.toFixed(3)}, snitt=${x.avg.toFixed(2)}, P/L=${x.pnl.toFixed(2)}`;const sec=(name,rows)=>[name,...rows.map(f),''];return ['PRO ANALYS V0.40.2',A.note,'',...sec('PRO – TID PÅ DAGEN',A.pro.time),...sec('PRO – MOMENTUMINTERVALL',A.pro.momentum),...sec('PRO – RELATIV VOLYM',A.pro.volume),...sec('PRO – HÅLLTID',A.pro.hold),...sec('PRO – EXITTYP',A.pro.exit),...sec('PRO – SYMBOLER',A.pro.symbol),...sec('BASELINE – TID PÅ DAGEN',A.baseline.time),...sec('BASELINE – MOMENTUMINTERVALL',A.baseline.momentum),...sec('BASELINE – RELATIV VOLYM',A.baseline.volume)];}

function auditDay(rows,d,capital){
 if(!d)return null;
 const ny=(iso)=>{const a=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(iso)),o={};a.forEach(x=>o[x.type]=x.value);return {day:o.year+"-"+o.month+"-"+o.day,min:(+o.hour)*60+(+o.minute)}};
 const by={}; let invalidBars=0,duplicateBars=0,unsortedSeries=0;
 for(const r of rows){if(!(Number.isFinite(+r.o)&&Number.isFinite(+r.h)&&Number.isFinite(+r.l)&&Number.isFinite(+r.c)&&+r.h>=Math.max(+r.o,+r.c,+r.l)&&+r.l<=Math.min(+r.o,+r.c,+r.h)))invalidBars++; const k=r.symbol+"|"+r.t;if(by[k])duplicateBars++;by[k]=r;}
 const series={}; for(const r of rows){(series[r.symbol]??=[]).push(r)}; for(const a of Object.values(series)){for(let i=1;i<a.length;i++)if(new Date(a[i].t)<=new Date(a[i-1].t)){unsortedSeries++;break} a.sort((x,y)=>new Date(x.t)-new Date(y.t));}
 let chronologyFailures=0,entryRuleFailures=0,exitRuleFailures=0,marketHoursFailures=0,spyTrades=0,positionViolations=0,capitalViolations=0,sameBarExits=0,bothTouched=0,maxPositionPct=0;
 const issues=[];
 for(const x of d.closed||[]){
   if(x.symbol==="SPY")spyTrades++;
   const a=series[x.symbol]||[], ei=a.findIndex(b=>b.t===x.entryTime), xi=a.findIndex(b=>b.t===x.exitTime);
   if(ei<1||xi<ei){chronologyFailures++;issues.push(`${x.symbol}: ogiltig entry/exit-ordning`);continue;}
   const sig=a[ei-1], ent=a[ei], ez=ny(ent.t), xz=ny(a[xi].t);
   if(ez.day!==xz.day||ez.min<570||ez.min>=950||xz.min<570||xz.min>950)marketHoursFailures++;
   // Entry måste vara nästa bars open efter signalbaren (med modellens köpfriktion).
   const expected=+ent.o*(1+(d.rules?.costSide||0)); if(Math.abs(x.entry-expected)>Math.max(.000001,Math.abs(expected)*1e-9))entryRuleFailures++;
   if(new Date(ent.t)<=new Date(sig.t))chronologyFailures++;
   const notional=x.entry*x.shares, entryEquity=Math.max(1,+x.entryEquity||capital);
   maxPositionPct=Math.max(maxPositionPct,notional/entryEquity);
   if(notional>entryEquity*(d.rules?.maxPosPct||.20)*1.000001)capitalViolations++;
   if(xi===ei)sameBarExits++;
   const stop=x.entry*(1-(d.rules?.stopPct||.006)),target=x.entry*(1+(d.rules?.targetPct||.010)),bar=a[xi];
   if(+bar.l<=stop && +bar.h>=target)bothTouched++;
   if(x.why?.includes('stop') && +bar.l>stop)exitRuleFailures++;
   if(x.why?.includes('mål') && +bar.h<target)exitRuleFailures++;
   if(x.why==='max 40 min' && xi-ei<(d.rules?.maxHoldBars||8))exitRuleFailures++;
 }
 // En position åt gången är en invariant i Jägaren V1; överlapp kan kontrolleras direkt från affärerna.
 const c=[...(d.closed||[])].sort((a,b)=>new Date(a.entryTime)-new Date(b.entryTime)); for(let i=1;i<c.length;i++)if(new Date(c[i].entryTime)<new Date(c[i-1].exitTime))positionViolations++;
 const pass=![chronologyFailures,entryRuleFailures,exitRuleFailures,marketHoursFailures,spyTrades,positionViolations,capitalViolations,invalidBars,duplicateBars,unsortedSeries].some(Boolean);
 const warnings=[]; if(sameBarExits)warnings.push(`${sameBarExits} exit på samma 5-minutersbar som köp; möjligt med OHLC men intrabar-ordningen är okänd.`); if(bothTouched)warnings.push(`${bothTouched} exitbar(ar) berörde både stop och mål; motorn väljer stop först.`); warnings.push('Revisionen verifierar mekanik och kronologi, inte att strategin har framtida edge.');
 return {pass,trades:(d.closed||[]).length,chronologyFailures,entryRuleFailures,exitRuleFailures,marketHoursFailures,spyTrades,positionViolations,capitalViolations,invalidBars,duplicateBars,unsortedSeries,sameBarExits,bothTouched,maxPositionPct,warnings,issues:issues.slice(0,20)};
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
function renderDayPro(base,pro){
 const set=(id,v,cls)=>{const e=$(id);if(e){e.textContent=v;if(cls!==undefined)e.className=cls}};
 if(!pro){["dpEq","dpRet","dpDD","dpN","dpWR","dpPF","dpVs","dpPass"].forEach(id=>set(id,"Ingen 5-min-data"));return;}
 set("dpEq",fmt(pro.eq));set("dpRet",(pro.ret>=0?"+":"")+pct(pro.ret),pro.ret>=0?"good":"bad");set("dpDD",pct(pro.dd));set("dpN",String(pro.n));set("dpWR",pct(pro.wr));set("dpPF",pro.pf===Infinity?"∞":Number(pro.pf||0).toFixed(2));
 const diff=base?pro.ret-base.ret:null;set("dpVs",diff==null?"—":(diff>=0?"+":"")+pct(diff),diff==null?"":diff>=0?"good":"bad");set("dpPass",`${pro.passedSignals} / ${pro.rawSignals}`);
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


const V036_SETTINGS_KEY="linasopti_v036_settings";
function v036GetSettings(){
  try{
    var s=Object.assign({afterRun:"prompt",showShareBar:false},JSON.parse(localStorage.getItem(V036_SETTINGS_KEY)||"{}"));
    if(s.afterRun==="share-full"||s.afterRun==="share-quick")s.afterRun="prompt";
    return s;
  }catch(e){return {afterRun:"prompt",showShareBar:false}}
}
function v036SaveSettings(){
  var old=v036GetSettings();
  var s={afterRun:"prompt",showShareBar:!!document.getElementById("v036ShowShareBar")?.checked};
  localStorage.setItem(V036_SETTINGS_KEY,JSON.stringify(s));
  v036ApplySettings();
}
function v036ApplySettings(){
  var s=v036GetSettings(),bar=document.getElementById("v23ShareBar");
  if(bar)bar.classList.toggle("v036-share-hidden",!s.showShareBar);
  var chk=document.getElementById("v036ShowShareBar"); if(chk)chk.checked=s.showShareBar;
}
function v036OpenSettings(open=true){ /* V0.36.4: settings use native details/summary */ }
function v036AfterRun(){
  v035ClickTab("3");
  var c=document.getElementById("v0365DoneCard");
  if(c){
    c.hidden=false;
    c.style.display="block";
    try{c.scrollIntoView({behavior:"smooth",block:"start"});}catch(e){c.scrollIntoView();}
  }
}
function v036OpenSharePrompt(){
  var c=document.getElementById("v0365DoneCard");
  if(c){c.hidden=false;c.style.display="block";}
}
function v036CloseSharePrompt(){ /* V0.36.5 uses inline share card */ }
async function v036ShareFromPrompt(full){
  v036CloseSharePrompt();
  await v17Share(full);
}
window.addEventListener("DOMContentLoaded",()=>{
  v036ApplySettings();
  
  
  
  
  document.getElementById("v036ShowShareBar")?.addEventListener("change",v036SaveSettings);
  document.getElementById("v036ShareResult")?.addEventListener("click",()=>v036OpenSharePrompt());
});

window.addEventListener("DOMContentLoaded",()=>{
 const btn=$("runBtn");
 if(!btn)return;
 btn.addEventListener("click",async ()=>{
  const status=$("testDataStatus");
  try{
   let cap=+$("capital").value;
   if(!DAILY.length&&!INTRA.length){if(status)status.innerHTML='<span class="bad">Ingen data inläst.</span>';return;}
   btn.disabled=true; const oldText=btn.textContent; btn.textContent="Kör test…";
   v0406SetTestStage("Startar Linas Opti"); await v0406Yield(60);
   let start=$("evalStart")?.value||"",mp=+$("maxpos").value;
   let s=null,t=null,w=null,d=null;
   if(DAILY.length){v0406SetTestStage("Kör Swing-baseline");await v0406Yield();s=swing(DAILY,cap,mp,start);}
   if(DAILY.length){v0406SetTestStage("Kör Trend");await v0406Yield();t=optiTrend(DAILY,cap,start);}
   if(DAILY.length&&isUsMarket()){v0406SetTestStage("Kör omvärldstest");await v0406Yield();w=swingWorld(DAILY,cap,mp,start);}
   if(INTRA.length&&isUsMarket()){v0406SetTestStage("Kör Lina Day · Jägaren");await v0406Yield();d=daytrade(INTRA,cap,+$("risk").value);}
   let dB=null; // gamla Day A/B är fryst
   let dPro=null;
   if(INTRA.length&&isUsMarket()){v0406SetTestStage("Kör Lina Day PRO 2");await v0406Yield();dPro=daytradePro(INTRA,cap,+$("risk").value);}
   v0406SetTestStage("Bygger analys och resultat"); await v0406Yield();
   let audit=(DAILY.length&&s)?auditSwing(DAILY,s,cap):null;
   let dayAudit=d?auditDay(INTRA,d,cap):null;
   let dayProAudit=dPro?auditDay(INTRA,dPro,cap):null; let dayAnalysis=v0401DayAnalysis(d,dPro); LAST={s,t,w,d,dB,dPro,audit,dayAudit,dayProAudit,dayAnalysis};
   V0405_TEST_COMPLETED=true;

   v0406ResultContext(!!DAILY.length,!!INTRA.length);
   v0406SetTestStage("✓ Test klart"); await v0406Yield(180);
   // V0.36.6: detta är den verkliga slutpunkten för användarens test.
   // Visa Resultat + färdigkortet INNAN sekundära resultatpaneler renderas.
   show("result",false);
   var done=document.getElementById("v0365DoneCard");
   if(done){done.hidden=false;done.style.display="block";}

   render(s,d,cap);
   renderTrend(t);
   renderWorld(w,s);
   renderDayAB(d,dB);
   renderDayPro(d,dPro);
   v0401RenderAnalysis(dayAnalysis);
   renderV015Audit(s);
   renderSwingAudit(audit);
   v342RenderAnalysis(s);
   v0344RenderValidation(s,cap);
   v035RenderHero(s);

   if(done){done.hidden=false;done.style.display="block";}
   window.scrollTo({top:0,behavior:"smooth"});
   btn.textContent=oldText; btn.disabled=false;
   const rs=document.getElementById("v0406RunStatus"); if(rs)rs.hidden=true;
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
 const d=document.getElementById("testDataStatus"); if(!d)return;
 d.innerHTML=`${DAILY.length?"🟢":"⚪"} Dagsdata: ${DAILY.length?DAILY.length+" rader":"ej hämtad"}<br>${INTRA.length?"🟢":"⚪"} 5-min-data: ${INTRA.length?INTRA.length+" rader":"ej hämtad"}`;
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
 const g=currentGroup?.(), dailyRows=DAILY.length, intraRows=INTRA.length, rows=dailyRows||intraRows;
 const summary=document.getElementById("v035DataSummary"),check=document.getElementById("v035DataCheck"),next=document.getElementById("v035ToTest");
 const name=g?.name||"Ingen grupp", p=label||v035PeriodName();
 const readyText=dailyRows?`✓ ${dailyRows.toLocaleString("sv-SE")} dagsrader hämtade`:`✓ ${intraRows.toLocaleString("sv-SE")} 5-min-rader hämtade`;
 if(summary) summary.innerHTML=`<b>${name}</b><br>${p}${rows?`<br><span class="good">${readyText}</span>`:""}`;
 if(check) check.textContent=rows?"Data klar ✓":"Välj grupp och period";
 if(next) next.hidden=!rows;
 const testTab=document.querySelector('.tab[data-pane="test"]');
 if(testTab){const ready=!!rows&&!V0404_TEST_READY_ACK;testTab.classList.toggle("data-ready",ready);testTab.setAttribute("data-ready-label",ready?"REDO":"");}
 const ts=document.getElementById("v035TestSummary");
 if(ts){
   if(dailyRows) ts.innerHTML=`<div class="v036-ready-line"><b>${name}</b><span>✓ Data klar</span></div><div>${p}</div><div>${dailyRows.toLocaleString("sv-SE")} dagsrader · ${Number(document.getElementById("capital")?.value||100000).toLocaleString("sv-SE")} startkapital</div><div class="good">Opti Swing · fryst strategi</div>`;
   else if(intraRows) ts.innerHTML=`<div class="v036-ready-line"><b>${name}</b><span>✓ 5-min-data klar</span></div><div>${intraRows.toLocaleString("sv-SE")} 5-min-rader · ${Number(document.getElementById("capital")?.value||100000).toLocaleString("sv-SE")} startkapital</div><div class="good">⚡ Lina Day · Jägaren redo</div>`;
   else ts.textContent="Data måste hämtas först.";
 }
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
 const s=LAST?.s||null,d=LAST?.d||null,dB=LAST?.dB||null,dPro=LAST?.dPro||null;
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
  dayAudit:LAST?.dayAudit||null,
  dayProAudit:LAST?.dayProAudit||null,
  dayAnalysis:LAST?.dayAnalysis||null,
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
  dayPro:dPro?{
   variant:"PRO 2 · Tids-/regimmedveten V0.40.2",
   rule:"PRO 2: tids-/regimmedveten momentum. Ingen ny entry 12:00–14:00 NY; m3 0,40–1,20%, bekräftad m6, relativ volym 1,15–3,0x, översträckningsfilter och extra rankingvikt för 15:00–15:30. Samma 20% maxposition, stop −0,6%, mål +1,0%, max 40 min och kostnadsmodell som fryst baseline.",
   endingCapital:dPro.eq,returnPct:dPro.ret*100,maxDrawdownPct:dPro.dd*100,trades:dPro.n,winRatePct:dPro.wr*100,profitFactor:dPro.pf===Infinity?"Infinity":dPro.pf,averageTrade:dPro.avg,tradesPerDay:dPro.tradesPerDay,vsBaselinePct:d?(dPro.ret-d.ret)*100:null,rawSignals:dPro.rawSignals,passedSignals:dPro.passedSignals
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
   payload.day.closedTrades=(d.closed||[]).map(x=>({symbol:x.symbol,entryTime:x.entryTime,exitTime:x.exitTime,entryPrice:x.entry,exitPrice:x.exit,shares:x.shares,pnl:x.pnl,returnPct:x.ret*100,setup:x.setup,exitReason:x.why,entryEquity:x.entryEquity}));
   payload.day.eventLog=d.log||[];
 }
 if(full && dB){
   payload.dayConfirm.closedTrades=(dB.closed||[]).map(x=>({symbol:x.symbol,entryTime:x.entryTime,exitTime:x.exitTime,entryPrice:x.entry,exitPrice:x.exit,shares:x.shares,pnl:x.pnl,returnPct:x.ret*100,setup:x.setup,exitReason:x.why}));
   payload.dayConfirm.eventLog=dB.log||[];
 }
 return payload;
}
function v17TextReport(full){
 const p=v17BaseReport(full),s=p.swing,d=p.day,dB=p.dayConfirm,dPro=p.dayPro;
 let a=[];
 a.push("LINAS OPTI – TESTRAPPORT",`Version: ${p.version}`,`Exporterad: ${p.exportedAt}`,"Handel: AVSTÄNGD (backtest/paper)","");
 a.push("DATA",`Marknadsgrupp: ${p.data.marketGroup||"Egen lista"}`,`Datakälla: ${p.data.provider||"—"}`,`Benchmark: ${p.data.benchmark||"—"}`,`Symboler: ${p.data.symbols}`,`Data: ${p.data.from} → ${p.data.to}`,`Teststart: ${p.data.evaluationStart}`,`Dagsrader: ${p.data.dailyRows}`,`5-min-rader: ${p.data.fiveMinuteRows}`,"");
 a.push("INSTÄLLNINGAR",`Startkapital: ${p.settings.startCapital}`,`Max position swing: ${p.settings.swingMaxPosition}`,`Risk/affär day: ${p.settings.dayRiskPerTrade}`,"");
 if(p.dayAudit){let z=p.dayAudit;a.push("DAY REVISION V0.40.2",`Status: ${z.pass?"PASS":"FLAG"}`,`Kontrollerade affärer: ${z.trades}`,`Kronologifel: ${z.chronologyFailures}`,`Entry nästa bar-fel: ${z.entryRuleFailures}`,`Exitregelfel: ${z.exitRuleFailures}`,`Börstid/dag-fel: ${z.marketHoursFailures}`,`Kapitalfel: ${z.capitalViolations}`,`Positionsöverlapp: ${z.positionViolations}`,`SPY-affärer: ${z.spyTrades}`,`OHLC/duplikat/sorteringsfel: ${z.invalidBars+z.duplicateBars+z.unsortedSeries}`,`Samma 5-min-bar köp/sälj: ${z.sameBarExits}`,`Både stop + mål på exitbar: ${z.bothTouched}`,`Största positionsandel: ${(z.maxPositionPct*100).toFixed(2)}%`,`Varningar: ${z.warnings.join(" | ")}`,"");}
 if(p.audit){let z=p.audit;a.push("SWING REVISION V0.31",`Status: ${z.pass?"PASS":"FLAG"}`,`Kontrollerade köp / avslut: ${z.entries} / ${z.closed}`,`Signalfel: ${z.signalFailures}`,`Kapitalfel: ${z.capitalViolations}`,`Max samtidiga positioner: ${z.maxPositions}`,`Positionsfel: ${z.positionViolations}`,`Samma-dag exits: ${z.sameDay}`,`Samma-dag stop: ${z.sameDayStop}`,`Både stop och mål berörda samma dag: ${z.bothTouched}`,`OHLC/duplikat/sorteringsfel: ${z.invalidBars+z.duplicateBars+z.unsortedSeries}`,`SPY-affärer: ${z.spyTrades}`,`Exitregelfel: ${z.exitRuleFailures}`,`Kronologifel: ${z.chronologyFailures}`,`Varningar: ${z.warnings.join(" | ")}`,"");}
 if(s){
  a.push("OPTI SWING",`Slutkapital: ${s.endingCapital}`,`Avkastning: ${s.returnPct.toFixed(2)}%`,`Max drawdown: ${s.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${s.trades}`,`Vinstfrekvens: ${s.winRatePct.toFixed(2)}%`,`Benchmark: ${s.benchmark}`,`${s.benchmark}: ${s.benchmarkReturnPct==null?"—":s.benchmarkReturnPct.toFixed(2)+"%"}`,`Mot benchmark: ${s.vsBenchmarkPct==null?"—":s.vsBenchmarkPct.toFixed(2)+"%"}`,`Profit factor: ${s.profitFactor}`,`Snittvinst: ${s.averageWin}`,`Snittförlust: ${s.averageLoss}`,`Bästa affär: ${s.bestTrade}`,`Sämsta affär: ${s.worstTrade}`,`Öppna vid slut: ${s.openAtEnd}`,"");
 }
 if(p.costShadow){let c=p.costShadow;a.push("KOSTNADSTEST V0.34.4","Antagande: 0.10% köp + 0.10% sälj",`Total modellerad kostnad: ${c.totalCost}`,`Slutkapital efter kostnad: ${c.netEq}`,`Avkastning efter kostnad: ${(c.netRet*100).toFixed(2)}%`,`Mot benchmark efter kostnad: ${c.netVsBench==null?"—":(c.netVsBench*100).toFixed(2)+"%"}`,"");}
 if(p.worldTest){let w=p.worldTest;a.push("OMVÄRLDSTEST V0.26",`Regel: ${w.rule}`,`Slutkapital: ${w.endingCapital}`,`Avkastning: ${w.returnPct.toFixed(2)}%`,`Max drawdown: ${w.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${w.trades}`,`Vinstfrekvens: ${w.winRatePct.toFixed(2)}%`,`Profit factor: ${w.profitFactor}`,`Mot baslinjen: ${w.vsBaselinePct==null?"—":w.vsBaselinePct.toFixed(2)+"%"}`,`Gröna dagar: ${w.regimeDays?.green||0}`,`Gula dagar: ${w.regimeDays?.yellow||0}`,`Röda dagar: ${w.regimeDays?.red||0}`,`Blockerade signaler totalt: ${w.blockedSignals}`,`Blockerade i gult: ${w.blockedYellow}`,`Blockerade i rött: ${w.blockedRed}`,`Gul/röd-dagar med rå signal: ${w.regimeSignalDays}`,`Regimdiagnostik (första 20): ${JSON.stringify(w.regimeSamples)}`,"");}
 if(d)a.push("OPTI DAY A – BASLINJE",`Regel: ${d.rule}`,`Slutkapital: ${d.endingCapital}`,`Avkastning: ${d.returnPct.toFixed(2)}%`,`Max drawdown: ${d.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${d.trades}`,`Vinstfrekvens: ${d.winRatePct.toFixed(2)}%`,`Profit factor: ${d.profitFactor}`,`Snitt/affär: ${d.averageTrade}`,`Affärer/dag: ${d.tradesPerDay}`,"");

 if(dPro)a.push("LINA DAY PRO – CHALLENGER",`Regel: ${dPro.rule}`,`Slutkapital: ${dPro.endingCapital}`,`Avkastning: ${dPro.returnPct.toFixed(2)}%`,`Max drawdown: ${dPro.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${dPro.trades}`,`Vinstfrekvens: ${dPro.winRatePct.toFixed(2)}%`,`Profit factor: ${dPro.profitFactor}`,`Snitt/affär: ${dPro.averageTrade}`,`Affärer/dag: ${dPro.tradesPerDay}`,`Mot baseline: ${dPro.vsBaselinePct==null?"—":dPro.vsBaselinePct.toFixed(2)+"%"}`,`Godkända / råa signaler: ${dPro.passedSignals} / ${dPro.rawSignals}`,"");
 if(LAST?.dayAnalysis)a.push(...v0401AnalysisText(LAST.dayAnalysis),"");
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
 if(full&&dPro){
  a.push("","AVSLUTADE LINA DAY PRO-AFFÄRER");
  (dPro.closedTrades||[]).forEach((x,i)=>a.push(`${i+1}. ${x.symbol} | ${x.entryTime} → ${x.exitTime} | in ${x.entryPrice} | ut ${x.exitPrice} | P/L ${x.pnl} | ${x.returnPct.toFixed(2)}% | ${x.setup} / ${x.exitReason}`));
  a.push("","LINA DAY PRO – HÄNDELSELOGG",JSON.stringify(dPro.eventLog||[],null,2));
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


// V0.40.6 – välj först datatyp, därefter visas endast relevanta perioder och en gemensam Hämta data-knapp.
window.addEventListener("DOMContentLoaded",()=>{
 let type="daily";
 const buttons=[...document.querySelectorAll(".v0404-type-btn")];
 const daily=document.getElementById("dailyPeriodPanel"), intra=document.getElementById("intraPeriodPanel"), fetch=document.getElementById("fetchDataBtn");
 const paint=()=>{
   buttons.forEach(b=>b.classList.toggle("active",b.dataset.type===type));
   daily?.classList.toggle("hidden",type!=="daily");
   intra?.classList.toggle("hidden",type!=="intra");
   if(fetch){
     const blocked=type==="intra" && currentProvider()!=="alpaca";
     fetch.disabled=blocked; fetch.textContent=blocked?"5-min-data finns tills vidare bara för USA":"Hämta data";
   }
 };
 buttons.forEach(b=>b.addEventListener("click",()=>{type=b.dataset.type;paint();}));
 fetch?.addEventListener("click",()=>getBars(type==="daily"?"1Day":"5Min"));
 window.V0404_REFRESH_DATATYPE=paint;
 paint();
});

// V0.40.3 – valfri Day-period. Hämtar extra kalenderdagar och trimmar sedan till exakt antal handelsdagar.
window.addEventListener("DOMContentLoaded",()=>{
 const pad=n=>String(n).padStart(2,"0"), iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
 const dayStart=document.getElementById("dayStart"), start=document.getElementById("start"), end=document.getElementById("end"), status=document.getElementById("dayPeriodStatus");
 if(dayStart && !dayStart.value){ const d=new Date(); d.setDate(d.getDate()-29); dayStart.value=iso(d); }
 const apply=n=>{
   if(!dayStart||!dayStart.value||!start||!end)return;
   const from=new Date(dayStart.value+"T12:00:00"), to=new Date(from);
   // Extra marginal för helger/helgdagar; getBars trimmar svaret till exakt N handelsdagar.
   to.setDate(to.getDate()+Math.ceil(n*1.65)+7);
   start.value=dayStart.value; end.value=iso(to);
   window.V0403_DAY_WINDOW={start:dayStart.value,days:n};
   document.querySelectorAll(".day-period-btn").forEach(x=>x.classList.toggle("active",+x.dataset.days===n));
   document.querySelectorAll(".period-btn").forEach(x=>x.classList.remove("active"));
   if(status)status.textContent=`Redo att hämta ${n} handelsdagar från ${dayStart.value}.`;
 };
 document.querySelectorAll(".day-period-btn").forEach(b=>b.addEventListener("click",()=>apply(+b.dataset.days)));
 dayStart?.addEventListener("change",()=>{ const a=document.querySelector(".day-period-btn.active"); if(a)apply(+a.dataset.days); });
 const initial=document.querySelector(".day-period-btn.active"); if(initial)apply(+initial.dataset.days);
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




async function v0365Share(full){
  var st=document.getElementById("v0365ShareStatus");
  if(st) st.textContent="Öppnar delning…";
  // iOS kan hålla native-delningen öppen efter AirDrop. Byt därför vår egen
  // statustext i bakgrunden så användaren möts av ett färdigt läge när den stängs.
  var doneTimer=setTimeout(function(){
    if(st && st.textContent==="Öppnar delning…") st.textContent="✓ Rapporten är klar · Dela igen vid behov";
  },700);
  try{
    await v17Share(full);
    clearTimeout(doneTimer);
    if(st) st.textContent="✓ Rapporten är klar · Dela igen vid behov";
  }catch(e){
    clearTimeout(doneTimer);
    if(st) st.textContent="Delningen kunde inte öppnas. Försök igen.";
  }
}

(function v0365FinalInit(){
  function bind(){
    var full=document.getElementById("v0365ShareFull");
    var quick=document.getElementById("v0365ShareQuick");
    
    var chk=document.getElementById("v036ShowShareBar");
    if(full) full.onclick=function(e){e.preventDefault();v0365Share(true);};
    if(quick) quick.onclick=function(e){e.preventDefault();v0365Share(false);};
    
    if(chk) chk.addEventListener("change",v036SaveSettings);
    v036ApplySettings();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bind);
  else bind();
})();

// V0.38.6: safe one-shot UI refresh after a completed data fetch.
// No MutationObserver calls this function. The V0.36.7 fetch path remains untouched.
const v0385OriginalPaintBridgeDone = paintBridgeDone;
paintBridgeDone = function(count, tf){
  v0385OriginalPaintBridgeDone(count, tf);
  if(tf === "1Day") v0368UpdateContextUI();
};

function v0368UpdateContextUI(){
  var ready=document.getElementById("v0368DataReady");
  if(ready && typeof DAILY!=="undefined" && DAILY.length){
    ready.hidden=false; ready.style.display="block";
    var label="";
    var active=document.querySelector(".market-btn.active");
    if(active) label=active.textContent.trim().replace(/^[^\p{L}\p{N}]+/u,"");
    var a=DAILY[0], b=DAILY[DAILY.length-1];
    var mr=document.getElementById("v0368ReadyMarket"), rr=document.getElementById("v0368ReadyRows"), pr=document.getElementById("v0368ReadyPeriod");
    if(mr)mr.textContent=label;
    if(rr)rr.textContent=DAILY.length.toLocaleString("sv-SE")+" rader";
    if(pr)pr.textContent=(a&&a.t?String(a.t).slice(0,10):"")+" → "+(b&&b.t?String(b.t).slice(0,10):"");
  }
  var has5=false;
  try{has5=typeof INTRA!=="undefined" && INTRA && INTRA.length>0;}catch(e){}
  document.querySelectorAll(".v0368-day-result").forEach(function(el){el.style.display=has5?"":"none";});
  document.querySelectorAll(".v0368-trend-result").forEach(function(el){
    var txt=el.textContent||"";
    var empty=/100\s*000\s*kr/.test(txt) && /(\+0[,.]00%|0[,.]00%)/.test(txt);
    el.style.display=empty?"none":"";
  });
}

// V0.38.3 – fixed header spacing only. No fetch logic changed.
(function v0383HeaderMeasure(){
  function sync(){
    const h=document.querySelector(".sticky-top");
    if(!h)return;
    document.documentElement.style.setProperty("--v0383-head-h",Math.ceil(h.getBoundingClientRect().height)+"px");
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync);else sync();
  window.addEventListener("load",sync);
  window.addEventListener("resize",sync);
})();

// V0.38.3 – period UI only. Sets the existing start/end/evalStart fields.
// Does not alter bridge(), params() or getBars().
(function v0383PeriodPicker(){
  function iso(d){return d.toISOString().slice(0,10)}
  function buttons(){return Array.from(document.querySelectorAll("[data-range-years],[data-year]"))}
  function mark(btn){
    buttons().forEach(b=>b.removeAttribute("data-selected"));
    if(btn)btn.setAttribute("data-selected","true");
  }
  function apply(first,last,btn){
    const s=document.getElementById("start"),e=document.getElementById("end"),v=document.getElementById("evalStart");
    if(!s||!e||!v)return;
    // V0.38.7: markera valet först så iPhone hinner måla knappen direkt.
    mark(btn);
    requestAnimationFrame(()=>{
      const now=new Date(),cy=now.getFullYear();
      s.value=`${first-1}-12-01`;
      v.value=`${first}-01-01`;
      e.value=last>=cy?iso(now):`${last}-12-31`;
      if(typeof DAILY!=="undefined")DAILY=[];
      if(typeof updateTestDataStatus==="function")updateTestDataStatus();
    });
  }
  function init(){
    const holder=document.getElementById("v0383Years");
    if(holder){
      const cy=new Date().getFullYear();
      for(let y=cy;y>=cy-9;y--){
        const b=document.createElement("button");
        b.type="button"; b.textContent=String(y); b.dataset.year=String(y);
        b.addEventListener("click",()=>apply(y,y,b));
        holder.appendChild(b);
      }
    }
    document.querySelectorAll("[data-range-years]").forEach(b=>{
      b.addEventListener("click",()=>{
        const n=Number(b.dataset.rangeYears),cy=new Date().getFullYear();
        apply(cy-n+1,cy,b);
      });
    });
    [document.getElementById("start"),document.getElementById("end")].forEach(el=>{
      el?.addEventListener("change",()=>{
        mark(null);
        if(typeof DAILY!=="undefined")DAILY=[];
        if(typeof updateTestDataStatus==="function")updateTestDataStatus();
      });
    });
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();


// ============================================================
// V0.41.1 – LINA TESTLAB · automatisk kontrollserie
// PRO2 och baseline ovan är medvetet orörda. Testlab anropar dem bara.
// ============================================================
const V0410_SYMBOLS="HD,BAC,AMD,INTC,GOOGL,NVDA,CRM,UBER,ADBE,MU,PYPL,AMZN,WMT,CSCO,KO,QCOM,SPY";
const V0410_WINDOWS=[
 {n:1,start:"2026-01-01",label:"jan 2026",base:-1.49,pro:-0.60},
 {n:2,start:"2024-08-11",label:"aug–sep 2024",base:-2.32,pro:-0.99},
 {n:3,start:"2022-01-11",label:"jan–feb 2022",base:-2.03,pro:-1.34},
 {n:4,start:"2024-12-11",label:"dec 2024–jan 2025",base:-2.57,pro:-0.73},
 {n:5,start:"2022-04-11",label:"apr–maj 2022",base:-2.30,pro:-1.69},
 {n:6,start:"2023-07-11",label:"jul–aug 2023",base:-1.22,pro:-0.31},
 {n:7,start:"2025-05-11",label:"maj–jun 2025",base:-2.22,pro:-0.66},
 {n:8,start:"2023-10-02",label:"okt–nov 2023",base:-1.55,pro:-0.10},
 {n:9,start:"2024-02-02",label:"feb–mar 2024",base:-1.28,pro:-0.43},
 {n:10,start:"2021-09-02",label:"sep–okt 2021",base:-0.49,pro:-0.24}
];
let V0410_RESULTS=[],V0410_ABORT=false,V0410_RUNNING=false;
function v0410DatePlus(iso,days){const d=new Date(iso+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
function v0410Pct(x){return Number.isFinite(x)?(x>=0?"+":"")+x.toFixed(2).replace(".",",")+"%":"—"}
function v0410Trim20(rows,start){const dates=[...new Set(rows.map(r=>String(r.t).slice(0,10)))].filter(d=>d>=start).sort().slice(0,20);const keep=new Set(dates);return {rows:rows.filter(r=>keep.has(String(r.t).slice(0,10))),dates};}
function v0410PaintRows(){
 const body=document.getElementById("v0410Rows");if(!body)return;
 body.innerHTML=V0410_WINDOWS.map(w=>{
  const r=V0410_RESULTS.find(x=>x.n===w.n);
  if(!r)return `<tr data-v0410="${w.n}"><td>${w.n}</td><td>${w.label}<small>${w.start}</small></td><td>—</td><td>—</td><td>—</td><td class="v0410-wait">väntar</td></tr>`;
  const cls=r.pass?"v0410-pass":"v0410-fail";
  return `<tr data-v0410="${w.n}"><td>${w.n}</td><td>${w.label}<small>${r.from||w.start} → ${r.to||"—"}</small></td><td>${v0410Pct(r.base)}</td><td>${v0410Pct(r.pro)}</td><td class="${r.diff>=0?'good':'bad'}">${v0410Pct(r.diff)}</td><td class="${cls}">${r.pass?'✓ PASS':'⚠ AVVIKELSE'}</td></tr>`;
 }).join("");
}
function v0410UpdateSummary(){
 const el=document.getElementById("v0410Summary"),share=document.getElementById("v0410Share");if(!el)return;
 if(!V0410_RESULTS.length){el.className="v0410-summary muted";el.textContent="Ingen kontrollserie körd ännu.";if(share)share.disabled=true;return;}
 const valid=V0410_RESULTS.filter(x=>Number.isFinite(x.base)&&Number.isFinite(x.pro)),done=V0410_RESULTS.length,passes=V0410_RESULTS.filter(x=>x.pass).length,wins=valid.filter(x=>x.pro>x.base).length;
 const ab=valid.length?valid.reduce((a,x)=>a+x.base,0)/valid.length:NaN,ap=valid.length?valid.reduce((a,x)=>a+x.pro,0)/valid.length:NaN;
 el.className="v0410-summary";el.innerHTML=`<b>${done}/10 körda</b> · mekanik/facit PASS ${passes}/${done} · PRO2 bättre ${wins}/${valid.length}<br><span>Snitt hittills: baseline ${v0410Pct(ab)} · PRO2 ${v0410Pct(ap)} · förbättring ${v0410Pct(ap-ab)}</span>`;
 if(share)share.disabled=done<1;
}
function v0410Report(){
 const lines=["LINAS OPTI – TESTLABBRAPPORT",`Version: ${APP_VERSION}`,`Skapad: ${new Date().toISOString()}`,"Handel: AVSTÄNGD (backtest/paper)","","KONTROLLSERIE · FRYST PRO2","Lina Selection 16 · 20 handelsdagar per fönster","",...V0410_RESULTS.map(r=>`${r.n}. ${r.from} → ${r.to} | rows ${r.rows} | baseline ${Number.isFinite(r.base)?r.base.toFixed(2):'ERR'}% | PRO2 ${Number.isFinite(r.pro)?r.pro.toFixed(2):'ERR'}% | diff ${Number.isFinite(r.diff)?r.diff.toFixed(2):'ERR'}pp | audit ${r.auditBase&&r.auditPro?'PASS':'FAIL'} | facit ${r.facit?'PASS':'AVVIKELSE'}${r.error?' | fel '+r.error:''}`),""];
 const valid=V0410_RESULTS.filter(x=>Number.isFinite(x.base)&&Number.isFinite(x.pro));
 if(valid.length){const n=valid.length,ab=valid.reduce((a,x)=>a+x.base,0)/n,ap=valid.reduce((a,x)=>a+x.pro,0)/n;lines.push(`PRO2 bättre: ${valid.filter(x=>x.pro>x.base).length}/${n}`,`PASS: ${V0410_RESULTS.filter(x=>x.pass).length}/${V0410_RESULTS.length}`,`Snitt baseline: ${ab.toFixed(3)}%`,`Snitt PRO2: ${ap.toFixed(3)}%`,`Snitt förbättring: ${(ap-ab).toFixed(3)}pp`)}
 return lines.join("\n");
}
async function v0410Share(){
 const text=v0410Report(),file=new File([text],`linasopti_testlab_${new Date().toISOString().slice(0,10)}.txt`,{type:"text/plain"});
 try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:"Linas Opti Testlab",text:"Lina Testlab kontrollserie",files:[file]});return}}catch(e){if(e?.name==="AbortError")return}
 const a=document.createElement("a");a.href=URL.createObjectURL(file);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500);
}
async function v0410FetchWindow(w){
 const end=v0410DatePlus(w.start,40),url=`/bars?symbols=${encodeURIComponent(V0410_SYMBOLS)}&timeframe=5Min&start=${w.start}&end=${end}`;
 const j=await bridge(url),raw=j.rows||[],cut=v0410Trim20(raw,w.start);if(cut.dates.length<18)throw new Error(`bara ${cut.dates.length} handelsdagar`);return cut;
}
async function v0410RunControl(){
 if(V0410_RUNNING)return;V0410_RUNNING=true;V0410_ABORT=false;V0410_RESULTS=[];v0410PaintRows();v0410UpdateSummary();
 const run=document.getElementById("v0410RunControl"),stop=document.getElementById("v0410StopControl"),status=document.getElementById("v0410LabStatus"),bar=document.getElementById("v0410ProgressBar");if(run)run.disabled=true;if(stop)stop.hidden=false;
 try{
  for(let i=0;i<V0410_WINDOWS.length;i++){
   if(V0410_ABORT)break;const w=V0410_WINDOWS[i];if(status)status.innerHTML=`<span class="v0406-spinner small"></span> Eldprov ${w.n}/10 · hämtar ${w.label}…`;if(bar)bar.style.width=`${(i/10)*100}%`;await v0406Yield(60);
   try{
    const cut=await v0410FetchWindow(w);if(status)status.innerHTML=`<span class="v0406-spinner small"></span> Eldprov ${w.n}/10 · kör baseline + PRO2…`;await v0406Yield(40);
    const base=daytrade(cut.rows,100000,.005),pro=daytradePro(cut.rows,100000,.005);v0413AddSims(2);const aBase=auditDay(cut.rows,base,100000),aPro=auditDay(cut.rows,pro,100000);
    const br=base.ret*100,pr=pro.ret*100,facit=Math.abs(br-w.base)<=.02&&Math.abs(pr-w.pro)<=.02,pass=!!aBase?.pass&&!!aPro?.pass&&facit;
    V0410_RESULTS.push({n:w.n,from:cut.dates[0],to:cut.dates.at(-1),rows:cut.rows.length,base:br,pro:pr,diff:pr-br,auditBase:!!aBase?.pass,auditPro:!!aPro?.pass,facit,pass,baseTrades:base.n,proTrades:pro.n,basePF:base.pf,proPF:pro.pf});
   }catch(e){V0410_RESULTS.push({n:w.n,from:w.start,to:"—",rows:0,base:NaN,pro:NaN,diff:NaN,auditBase:false,auditPro:false,facit:false,pass:false,error:String(e?.message||e)});}
   v0410PaintRows();v0410UpdateSummary();if(bar)bar.style.width=`${((i+1)/10)*100}%`;await v0406Yield(80);
  }
  const passes=V0410_RESULTS.filter(x=>x.pass).length;if(status)status.innerHTML=V0410_ABORT?`Stoppad efter ${V0410_RESULTS.length}/10 perioder.`:`✓ Kontrollserie klar · ${passes}/10 reproducerade exakt.`;
 }finally{V0410_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true;}
}
window.addEventListener("DOMContentLoaded",()=>{
 v0410PaintRows();v0410UpdateSummary();
 document.getElementById("v0410RunControl")?.addEventListener("click",v0410RunControl);
 document.getElementById("v0410StopControl")?.addEventListener("click",()=>{V0410_ABORT=true;const s=document.getElementById("v0410LabStatus");if(s)s.textContent="Stoppar efter pågående period…"});
 document.getElementById("v0410Share")?.addEventListener("click",v0410Share);
});


// ============================================================
// V0.41.1 – EXIT LAB · shadow-replay på EXAKT samma PRO2-entries
// PRO2-signaler, entrypris, shares och friktion lämnas orörda.
// Varianten ändrar bara vad som händer EFTER entry.
// ============================================================
const V0411_VARIANTS=[
 {id:"P2",name:"PRO2 original",stop:.006,target:.010,hold:8,delay:0},
 {id:"A",name:"PRO3-A · stop efter 15 min",stop:.006,target:.010,hold:8,delay:3},
 {id:"B",name:"PRO3-B · ingen stop",stop:null,target:.010,hold:8,delay:999}
];
let V0411_RESULTS=[],V0411_RUNNING=false,V0411_ABORT=false;
function v0411Replay(rows,pro,v){
 const series={};for(const r of rows){if(r.symbol==="SPY")continue;(series[r.symbol]??=[]).push(r)};Object.values(series).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));
 const costSide=pro?.rules?.costSide??(.00035/2+.00025), out=[];
 for(const tr of (pro?.closed||[])){
  const a=series[tr.symbol]||[],ei=a.findIndex(b=>b.t===tr.entryTime);if(ei<0)continue;
  let raw=null,why=null,bar=null;
  for(let j=ei+1;j<a.length;j++){
   const b=a[j]; if(String(b.t).slice(0,10)!==String(tr.entryTime).slice(0,10))break;
   const age=j-ei;
   if(v.stop!=null && age>v.delay && +b.l<=tr.entry*(1-v.stop)){raw=tr.entry*(1-v.stop);why=`stop −${(v.stop*100).toFixed(1)}%`;bar=b;break;}
   if(+b.h>=tr.entry*(1+v.target)){raw=tr.entry*(1+v.target);why=`mål +${(v.target*100).toFixed(1)}%`;bar=b;break;}
   if(age>=v.hold){raw=+b.c;why=`max ${v.hold*5} min`;bar=b;break;}
   const ny=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date(b.t));const o={};ny.forEach(x=>o[x.type]=x.value);if((+o.hour)*60+(+o.minute)>=950){raw=+b.c;why="stängning 15:50";bar=b;break;}
  }
  if(raw==null){const same=a.filter(b=>String(b.t).slice(0,10)===String(tr.entryTime).slice(0,10));bar=same.at(-1);if(!bar)continue;raw=+bar.c;why="dagsslut";}
  const exit=raw*(1-costSide),pnl=tr.shares*(exit-tr.entry);out.push({...tr,exitTime:bar.t,exit,pnl,ret:exit/tr.entry-1,why});
 }
 const wins=out.filter(x=>x.pnl>0),loss=out.filter(x=>x.pnl<0),gw=wins.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(loss.reduce((a,x)=>a+x.pnl,0));
 let eq=100000,peak=eq,dd=0;for(const x of [...out].sort((a,b)=>new Date(a.exitTime)-new Date(b.exitTime))){eq+=x.pnl;peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1)}
 return {closed:out,n:out.length,pnl:out.reduce((a,x)=>a+x.pnl,0),ret:(eq/100000-1),dd,pf:gl?gw/gl:(gw?Infinity:0),wr:out.length?wins.length/out.length:0};
}
function v0411FmtPF(x){return x===Infinity?'∞':Number.isFinite(x)?x.toFixed(2):'—'}
function v0411Paint(){
 const body=document.getElementById('v0411Rows'),sum=document.getElementById('v0411Summary'),share=document.getElementById('v0411Share');if(!body)return;
 body.innerHTML=V0411_VARIANTS.map(v=>{const rs=V0411_RESULTS.filter(x=>x.variant===v.id),n=rs.reduce((a,x)=>a+x.n,0),pnl=rs.reduce((a,x)=>a+x.pnl,0),gw=rs.reduce((a,x)=>a+x.gw,0),gl=rs.reduce((a,x)=>a+x.gl,0),pf=gl?gw/gl:(gw?Infinity:0),wr=n?rs.reduce((a,x)=>a+x.wins,0)/n:0,wins=rs.filter(x=>x.ret>0).length;return `<tr><td><b>${v.name}</b></td><td>${rs.length}/10</td><td>${n||'—'}</td><td class="${pnl>=0?'good':'bad'}">${rs.length?(pnl>=0?'+':'')+pnl.toFixed(0):'—'}</td><td>${rs.length?v0411FmtPF(pf):'—'}</td><td>${rs.length?(wr*100).toFixed(1)+'%':'—'}</td><td>${rs.length?wins+'/10':'—'}</td></tr>`}).join('');
 if(!V0411_RESULTS.length){if(sum)sum.textContent='Ingen Exit Lab-körning ännu.';if(share)share.disabled=true;return}
 const done=Math.max(...V0411_RESULTS.map(x=>x.window));if(sum)sum.innerHTML=`<b>${done}/10 perioder klara</b> · samma PRO2-entries återspelas genom ${V0411_VARIANTS.length} exitregler.`;if(share)share.disabled=false;
}
function v0411Report(){
 const L=['LINAS OPTI – EXIT LAB','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Shadow-replay på exakt samma frysta PRO2-entries. Entrypris, shares, signalurval och kostnadsmodell är låsta. Endast exit efter entry ändras.',''];
 for(const v of V0411_VARIANTS){const rs=V0411_RESULTS.filter(x=>x.variant===v.id),n=rs.reduce((a,x)=>a+x.n,0),pnl=rs.reduce((a,x)=>a+x.pnl,0),gw=rs.reduce((a,x)=>a+x.gw,0),gl=rs.reduce((a,x)=>a+x.gl,0),pf=gl?gw/gl:(gw?Infinity:0);L.push(v.name,`Perioder: ${rs.length}/10 | affärer ${n} | P/L ${pnl.toFixed(2)} | PF ${v0411FmtPF(pf)} | positiva perioder ${rs.filter(x=>x.ret>0).length}/10`,...rs.map(x=>`  #${x.window} ${x.from}→${x.to} | n ${x.n} | P/L ${x.pnl.toFixed(2)} | PF ${v0411FmtPF(x.pf)} | WR ${(x.wr*100).toFixed(1)}% | DD ${(x.dd*100).toFixed(2)}%`),'');}
 L.push('OBS: Exit Lab är ett forsknings-/shadowtest. Varianten får inte kallas oberoende validerad efter att dessa perioder använts för urval.');return L.join('\n');
}
async function v0411Share(){const text=v0411Report(),file=new File([text],`linasopti_exitlab_${new Date().toISOString().slice(0,10)}.txt`,{type:'text/plain'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Exit Lab',files:[file]});return}}catch(e){if(e?.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function v0411Run(){if(V0411_RUNNING)return;V0411_RUNNING=true;V0411_ABORT=false;V0411_RESULTS=[];v0411Paint();const run=document.getElementById('v0411Run'),stop=document.getElementById('v0411Stop'),st=document.getElementById('v0411Status'),bar=document.getElementById('v0411Bar');if(run)run.disabled=true;if(stop)stop.hidden=false;try{for(let i=0;i<V0410_WINDOWS.length;i++){if(V0411_ABORT)break;const w=V0410_WINDOWS[i];if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar ${w.label}…`;if(bar)bar.style.width=`${i*10}%`;await v0406Yield(40);const cut=await v0410FetchWindow(w);if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · bygger frysta PRO2-entries + ${V0411_VARIANTS.length} exits…`;await v0406Yield(30);const pro=daytradePro(cut.rows,100000,.005);for(const v of V0411_VARIANTS){const r=v0411Replay(cut.rows,pro,v),wins=r.closed.filter(x=>x.pnl>0).length,gw=r.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(r.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));V0411_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),variant:v.id,...r,wins,gw,gl});v0413AddSims(1);}v0411Paint();if(bar)bar.style.width=`${(i+1)*10}%`;await v0406Yield(50)}if(st)st.textContent=V0411_ABORT?`Stoppad efter ${Math.max(0,...V0411_RESULTS.map(x=>x.window))}/10 perioder.`:'✓ Exit Lab klart · 10/10 perioder analyserade.';}catch(e){if(st)st.textContent='⚠ Exit Lab: '+String(e?.message||e)}finally{V0411_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true}}
window.addEventListener('DOMContentLoaded',()=>{v0411Paint();document.getElementById('v0411Run')?.addEventListener('click',v0411Run);document.getElementById('v0411Stop')?.addEventListener('click',()=>V0411_ABORT=true);document.getElementById('v0411Share')?.addEventListener('click',v0411Share)});


// ============================================================
// V0.41.2 – EXIT LAB 2 · förregistrerad parameterkarta
// 5 stop × 5 delay × 5 target × 5 hold = 625 kombinationer.
// Exakt samma frysta PRO2-entries återspelas. Ingen entryoptimering.
// ============================================================
const V0412_STOPS=[.004,.006,.008,.010,.012];
const V0412_DELAYS=[0,1,2,3,4]; // 5-min bars: 0,5,10,15,20 min
const V0412_TARGETS=[.006,.008,.010,.012,.015];
const V0412_HOLDS=[4,6,8,10,12]; // 20,30,40,50,60 min
const V0412_VARIANTS=[];
for(const stop of V0412_STOPS)for(const delay of V0412_DELAYS)for(const target of V0412_TARGETS)for(const hold of V0412_HOLDS){
 V0412_VARIANTS.push({id:`S${stop}_D${delay}_T${target}_H${hold}`,stop,delay,target,hold,name:`S−${(stop*100).toFixed(1)}% · D${delay*5}m · M+${(target*100).toFixed(1)}% · H${hold*5}m`});
}
let V0412_RESULTS=[],V0412_RUNNING=false,V0412_ABORT=false,V0412_RANKED=[];
function v0412Agg(){
 const by=new Map();
 for(const x of V0412_RESULTS){let a=by.get(x.variant);if(!a){a={variant:x.variant,rs:[],n:0,pnl:0,gw:0,gl:0,wins:0,maxDD:0};by.set(x.variant,a)}a.rs.push(x);a.n+=x.n;a.pnl+=x.pnl;a.gw+=x.gw;a.gl+=x.gl;a.wins+=x.wins;a.maxDD=Math.min(a.maxDD,x.dd)}
 const all=[...by.values()].map(a=>{const v=V0412_VARIANTS.find(z=>z.id===a.variant),pf=a.gl?a.gw/a.gl:(a.gw?Infinity:0),pos=a.rs.filter(x=>x.ret>0).length,wr=a.n?a.wins/a.n:0;return {...a,v,pf,pos,wr}});
 // transparent ranking: PF capped 2.0 + positive periods + normalized pnl - DD penalty.
 if(!all.length)return [];
 const pn=all.map(a=>a.pnl),lo=Math.min(...pn),hi=Math.max(...pn),norm=x=>hi===lo?.5:(x-lo)/(hi-lo);
 for(const a of all){a.score=35*Math.min(a.pf,2)/2 + 30*(a.pos/10) + 25*norm(a.pnl) + 10*Math.max(0,1-Math.abs(a.maxDD)/.05)}
 all.sort((a,b)=>b.score-a.score||b.pnl-a.pnl);return all;
}
function v0412NeighborCount(a,ranked){
 // Robust zone: nearby grid points (one step in exactly one parameter) that are PF>=1 and pnl>0.
 const idx=(arr,x)=>arr.indexOf(x), ai=[idx(V0412_STOPS,a.v.stop),idx(V0412_DELAYS,a.v.delay),idx(V0412_TARGETS,a.v.target),idx(V0412_HOLDS,a.v.hold)];
 let good=0,total=0;
 for(let d=0;d<4;d++)for(const step of [-1,1]){const z=[...ai];z[d]+=step;const arrays=[V0412_STOPS,V0412_DELAYS,V0412_TARGETS,V0412_HOLDS];if(z[d]<0||z[d]>=arrays[d].length)continue;total++;const id=`S${arrays[0][z[0]]}_D${arrays[1][z[1]]}_T${arrays[2][z[2]]}_H${arrays[3][z[3]]}`,n=ranked.find(x=>x.variant===id);if(n&&n.pf>=1&&n.pnl>0)good++}
 return {good,total};
}
function v0412Paint(){
 const body=document.getElementById('v0412Rows'),sum=document.getElementById('v0412Summary'),share=document.getElementById('v0412Share');if(!body)return;
 V0412_RANKED=v0412Agg();
 body.innerHTML=V0412_RANKED.slice(0,20).map((a,i)=>{const nb=v0412NeighborCount(a,V0412_RANKED);return `<tr><td>${i+1}</td><td><b>${a.v.name}</b></td><td class="${a.pnl>=0?'good':'bad'}">${a.pnl>=0?'+':''}${a.pnl.toFixed(0)}</td><td>${v0411FmtPF(a.pf)}</td><td>${a.pos}/10</td><td>${(a.maxDD*100).toFixed(2)}%</td><td>${nb.good}/${nb.total}</td></tr>`}).join('');
 if(!V0412_RESULTS.length){sum.textContent='Ingen masskörning ännu.';if(share)share.disabled=true;return}
 const done=Math.max(...V0412_RESULTS.map(x=>x.window)),best=V0412_RANKED[0],positive=V0412_RANKED.filter(x=>x.pnl>0).length,pf1=V0412_RANKED.filter(x=>x.pf>=1).length;
 sum.innerHTML=`<b>${done}/10 perioder · ${(V0412_RESULTS.length).toLocaleString('sv-SE')} simuleringar klara</b>${best?`<br>Bäst hittills: <b>${best.v.name}</b> · P/L ${best.pnl>=0?'+':''}${best.pnl.toFixed(0)} · PF ${v0411FmtPF(best.pf)} · +perioder ${best.pos}/10`:''}<br><span class="muted">Positiv P/L: ${positive}/625 · PF ≥ 1: ${pf1}/625. Robusthet = lönsamma närmaste grannar i parameterkartan.</span>`;
 if(share)share.disabled=done<10;
}
function v0412Report(){
 const R=v0412Agg(),L=['LINAS OPTI – EXIT LAB 2 · PARAMETERKARTA','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Förregistrerad grid: stop 0,4/0,6/0,8/1,0/1,2%; delay 0/5/10/15/20 min; mål 0,6/0,8/1,0/1,2/1,5%; max hålltid 20/30/40/50/60 min.','625 kombinationer × 10 historiska 20-handelsdagarsperioder. Exakt samma frysta PRO2-entries; endast exit ändras.','Ranking används för forskning och är INTE oberoende validering.',''];
 const positive=R.filter(x=>x.pnl>0).length,pf1=R.filter(x=>x.pf>=1).length;L.push(`SAMMANFATTNING | kombinationer ${R.length}/625 | positiv P/L ${positive} | PF>=1 ${pf1}`,'','TOPP 50');
 R.slice(0,50).forEach((a,i)=>{const nb=v0412NeighborCount(a,R);L.push(`${i+1}. ${a.v.name} | P/L ${a.pnl.toFixed(2)} | PF ${v0411FmtPF(a.pf)} | WR ${(a.wr*100).toFixed(1)}% | +perioder ${a.pos}/10 | värsta DD ${(a.maxDD*100).toFixed(2)}% | robusta grannar ${nb.good}/${nb.total} | score ${a.score.toFixed(2)}`)});
 L.push('','ALLA 625 KOMBINATIONER');R.forEach((a,i)=>{const nb=v0412NeighborCount(a,R);L.push(`${i+1}|${a.v.stop}|${a.v.delay*5}|${a.v.target}|${a.v.hold*5}|${a.pnl.toFixed(2)}|${v0411FmtPF(a.pf)}|${(a.wr*100).toFixed(2)}|${a.pos}|${(a.maxDD*100).toFixed(3)}|${nb.good}/${nb.total}|${a.score.toFixed(3)}`)});
 L.push('','OBS: Dessa 10 perioder är nu utvecklingsdata för Exit Lab 2. En vald kandidat måste senare frysas och testas på nya orörda perioder.');return L.join('\n');
}
async function v0412Share(){const text=v0412Report(),file=new File([text],`linasopti_exitlab2_${new Date().toISOString().slice(0,10)}.txt`,{type:'text/plain'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Exit Lab 2',files:[file]});return}}catch(e){if(e?.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function v0412Run(){
 if(V0412_RUNNING)return;V0412_RUNNING=true;V0412_ABORT=false;V0412_RESULTS=[];V0412_RANKED=[];v0412Paint();
 const run=document.getElementById('v0412Run'),stop=document.getElementById('v0412Stop'),st=document.getElementById('v0412Status'),bar=document.getElementById('v0412Bar');if(run)run.disabled=true;if(stop)stop.hidden=false;
 try{for(let i=0;i<V0410_WINDOWS.length;i++){if(V0412_ABORT)break;const w=V0410_WINDOWS[i];if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar ${w.label}…`;if(bar)bar.style.width=`${i*10}%`;await v0406Yield(40);const cut=await v0410FetchWindow(w);if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · kör 625 exitkombinationer…`;await v0406Yield(20);const pro=daytradePro(cut.rows,100000,.005);let k=0;for(const v of V0412_VARIANTS){if(V0412_ABORT)break;const r=v0411Replay(cut.rows,pro,v),wins=r.closed.filter(x=>x.pnl>0).length,gw=r.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(r.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));V0412_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),variant:v.id,...r,wins,gw,gl});v0413AddSims(1);if(++k%75===0){if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · ${k}/625 kombinationer…`;await v0406Yield(0)}}v0412Paint();if(bar)bar.style.width=`${(i+1)*10}%`;await v0406Yield(40)}if(st)st.textContent=V0412_ABORT?`Stoppad efter ${Math.max(0,...V0412_RESULTS.map(x=>x.window))}/10 perioder.`:'✓ Exit Lab 2 klart · 6 250 simuleringar analyserade.';
 }catch(e){if(st)st.textContent='⚠ Exit Lab 2: '+String(e?.message||e)}finally{V0412_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true}
}
window.addEventListener('DOMContentLoaded',()=>{v0412Paint();document.getElementById('v0412Run')?.addEventListener('click',v0412Run);document.getElementById('v0412Stop')?.addEventListener('click',()=>V0412_ABORT=true);document.getElementById('v0412Share')?.addEventListener('click',v0412Share)});


// ============================================================
// V0.41.3 – synlig robotmognad + kumulativ simuleringsräknare
// + snabbval i Testlab. Mognadspoäng är medvetet trög och
// beskriver bevisläge/teknisk beredskap, inte utlovad avkastning.
// ============================================================
const V0413_SIM_KEY='linasopti_simulations_v0413';
const V0413_SIM_SEED=18890;
function v0413GetSims(){let n=Number(localStorage.getItem(V0413_SIM_KEY));if(!Number.isFinite(n)||n<V0413_SIM_SEED){n=V0413_SIM_SEED;localStorage.setItem(V0413_SIM_KEY,String(n))}return n}
function v0413PaintSims(){const e=document.getElementById('v0413SimValue');if(e)e.textContent=v0413GetSims().toLocaleString('sv-SE')}
function v0413AddSims(n){if(!n||n<0)return;localStorage.setItem(V0413_SIM_KEY,String(v0413GetSims()+n));v0413PaintSims()}
function v0413ShowInfo(kind){
 const box=document.getElementById('v0413Info');if(!box)return;
 if(!box.hidden && box.dataset.kind===kind){box.hidden=true;return}
 box.dataset.kind=kind;box.hidden=false;
 if(kind==='maturity')box.innerHTML=`<h3>🤖 Lina är i forskningsfas · 38/100</h3><div class="v0413-meter"><i></i></div><p><b>Det vi har:</b> fungerande datamotor, reproducerbart backtest, mekanisk audit, fryst PRO2, Testlab, OOS-kontroller och automatiserad parameterforskning.</p><p><b>Det som håller tillbaka poängen:</b> Entry B var nära break-even i första OOS-provet. Regim Lab 1 hittade därefter ett lovande förregistrerat Strong-filter, men det resultatet kommer från utvecklingsdata och är ännu inte oberoende validerat.</p><p><b>Nästa steg mot högre mognad:</b> Entry B + Strong måste klara Regim Lab 2 på 10 nya orörda perioder utan parameterändringar.</p><p><b>Kvar till mäklarredo:</b> robust strategi → walk-forward/orörd validering → realtids-paper → riskmotor → ordermotor → brokerintegration → felhantering/kill-switch → längre stabil paperdrift.</p><p><small>100/100 betyder att vår broker-ready-checklista är uppfylld – inte garanterad lönsamhet. Senast omvärderad: V0.42.3.</small></p>`;
 else box.innerHTML=`<h3>🧪 ${v0413GetSims().toLocaleString('sv-SE')} registrerade simuleringar</h3><p>Historiska omkörningar gör att det exakta äldre totalantalet inte kan rekonstrueras. V0.42.3 använder ett konservativt dokumenterat golv på minst 18 890 simuleringar (inklusive den genomförda Regim Lab 1-körningen); därefter adderas varje faktisk Testlab-simulering lokalt.</p><p>Från V0.41.3 ökar den automatiskt för varje faktiskt genomförd Testlab-simulering. Antalet är ett aktivitetsmått – fler simuleringar höjer inte Robotmognaden automatiskt.</p>`;
}
window.addEventListener('DOMContentLoaded',()=>{
 v0413PaintSims();
 document.getElementById('v0413Maturity')?.addEventListener('click',()=>v0413ShowInfo('maturity'));
 document.getElementById('v0413Sims')?.addEventListener('click',()=>v0413ShowInfo('sims'));
 const engine=document.getElementById('v0423Engine'),jump=document.getElementById('v0413LabJump');
 const LAB_KEY='linasopti_testlab_selected_v0423';
 function showSelectedLab(){if(!jump)return;const val=jump.value;document.querySelectorAll('[class*=\"vlab-v04\"]').forEach(el=>{el.style.display=el.classList.contains('vlab-'+val)?'':'none'});document.querySelectorAll('.vlab-extra').forEach(el=>el.style.display='none');localStorage.setItem(LAB_KEY,val);}
 if(jump){const saved=localStorage.getItem(LAB_KEY);if(saved&&[...jump.options].some(o=>o.value===saved))jump.value=saved;else jump.value='v0423Lab';jump.addEventListener('change',showSelectedLab);showSelectedLab();}
 document.querySelectorAll('.v0424-subtab').forEach(b=>b.addEventListener('click',()=>show(b.dataset.pane,true)));
 if(engine){engine.addEventListener('change',()=>{
   if(engine.value==='testlab') show('testlab',true);
   else {const active=document.querySelector('.v0424-subtab.active')?.dataset.pane||'data';show(active,true);}
 });engine.value='tester';}
 show('data',false);
});


// V0.42.0 – Entry Lab 1. Shadow-filter på exakt samma frysta PRO2-entries.
const V0420_M3=[.40,.55,.70,.80,.90], V0420_VOL=[1.15,1.30,1.50,1.80,2.00], V0420_CLOSE=[62,68,74,80,86];
const V0420_TIME=[
 {id:'all',name:'hela PRO2-tiden',ok:m=>true},
 {id:'open',name:'10:30–12:00',ok:m=>m<720},
 {id:'aft',name:'14:00–15:30',ok:m=>m>=840},
 {id:'late',name:'15:00–15:30',ok:m=>m>=900},
 {id:'edges',name:'10:30–12 + 15:00–15:30',ok:m=>m<720||m>=900}
];
const V0420_VARIANTS=[];for(const m3 of V0420_M3)for(const vol of V0420_VOL)for(const close of V0420_CLOSE)for(const tm of V0420_TIME)V0420_VARIANTS.push({id:`${m3}-${vol}-${close}-${tm.id}`,m3,vol,close,tm,name:`m3≥${m3.toFixed(2)}% · vol≥${vol.toFixed(2)}x · close≥${close}% · ${tm.name}`});
let V0420_RESULTS=[],V0420_RANKED=[],V0420_RUNNING=false,V0420_ABORT=false;
function v0420Meta(t){const q=String(t.setup||'');let m=q.match(/m3 ([0-9.]+)%/),v=q.match(/vol ([0-9.]+)x/),c=q.match(/close ([0-9.]+)%/);const z=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(t.entryTime)),o={};z.forEach(x=>o[x.type]=x.value);return {m3:m?+m[1]:NaN,vol:v?+v[1]:NaN,close:c?+c[1]:NaN,min:(+o.hour)*60+(+o.minute)}}
function v0420Filter(pro,v){return (pro.closed||[]).filter(t=>{const x=v0420Meta(t);return x.m3>=v.m3&&x.vol>=v.vol&&x.close>=v.close&&v.tm.ok(x.min)})}
function v0420Replay(rows,trades){const variant={stop:.004,delay:4,target:.008,hold:12};return v0411Replay(rows,{closed:trades},variant)}
function v0420Agg(){return V0420_VARIANTS.map(v=>{const a=V0420_RESULTS.filter(x=>x.variant===v.id),pnl=a.reduce((q,x)=>q+x.pnl,0),gw=a.reduce((q,x)=>q+x.gw,0),gl=a.reduce((q,x)=>q+x.gl,0),n=a.reduce((q,x)=>q+x.n,0),wins=a.reduce((q,x)=>q+x.wins,0),pos=a.filter(x=>x.pnl>0).length,maxDD=a.length?Math.min(...a.map(x=>x.dd)):0,pf=gl?gw/gl:(gw?Infinity:0);return {v,pnl,pf,n,wr:n?wins/n:0,pos,maxDD,score:(Number.isFinite(pf)?Math.min(pf,2):2)*25+pos*4+Math.max(-20,Math.min(20,pnl/500))-Math.abs(maxDD)*120}}).sort((a,b)=>b.score-a.score)}
function v0420Paint(){const body=document.getElementById('v0420Rows'),sum=document.getElementById('v0420Summary'),share=document.getElementById('v0420Share');if(!body)return;V0420_RANKED=v0420Agg();body.innerHTML=V0420_RANKED.slice(0,20).map((a,i)=>`<tr><td>${i+1}</td><td><b>${a.v.name}</b></td><td>${a.n}</td><td class="${a.pnl>=0?'good':'bad'}">${a.pnl>=0?'+':''}${a.pnl.toFixed(0)}</td><td>${v0411FmtPF(a.pf)}</td><td>${a.pos}/10</td><td>${(a.maxDD*100).toFixed(2)}%</td></tr>`).join('');if(!V0420_RESULTS.length){sum.textContent='Ingen Entry Lab-körning ännu.';if(share)share.disabled=true;return}const done=new Set(V0420_RESULTS.map(x=>x.window)).size,best=V0420_RANKED[0],positive=V0420_RANKED.filter(x=>x.pnl>0).length,pf1=V0420_RANKED.filter(x=>x.pf>=1).length;sum.innerHTML=`Perioder ${done}/10 · kombinationer ${V0420_RANKED.length}/625 · positiv P/L <b>${positive}</b> · PF≥1 <b>${pf1}</b>${best?`<br>Bäst hittills: <b>${best.v.name}</b> · P/L ${best.pnl.toFixed(0)} · PF ${v0411FmtPF(best.pf)} · ${best.pos}/10 positiva perioder`:''}`;if(share)share.disabled=done<1}
function v0420Report(){const R=v0420Agg(),L=['LINAS OPTI – ENTRY LAB 1 · ENTRYKARTA','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Shadow-filter på exakt samma frysta PRO2-entries. Inga nya signaler skapas när en entry filtreras bort.','Exit låst till forskningsregion från Exit Lab 2: stop -0,4%, delay 20 min, mål +0,8%, max 60 min.','625 entryfilter × 10 historiska 20-handelsdagarsperioder. Inga symbol-specifika regler.','Resultatet är utvecklingsforskning och INTE oberoende validering.','',`SAMMANFATTNING | kombinationer ${R.length}/625 | positiv P/L ${R.filter(x=>x.pnl>0).length} | PF>=1 ${R.filter(x=>x.pf>=1).length}`,'','TOPP 50'];R.slice(0,50).forEach((a,i)=>L.push(`${i+1}. ${a.v.name} | n ${a.n} | P/L ${a.pnl.toFixed(2)} | PF ${v0411FmtPF(a.pf)} | WR ${(a.wr*100).toFixed(1)}% | +perioder ${a.pos}/10 | värsta DD ${(a.maxDD*100).toFixed(2)}% | score ${a.score.toFixed(2)}`));L.push('','ALLA 625 KOMBINATIONER');R.forEach((a,i)=>L.push(`${i+1}|${a.v.m3}|${a.v.vol}|${a.v.close}|${a.v.tm.id}|${a.n}|${a.pnl.toFixed(2)}|${v0411FmtPF(a.pf)}|${(a.wr*100).toFixed(2)}|${a.pos}|${(a.maxDD*100).toFixed(3)}|${a.score.toFixed(3)}`));return L.join('\n')}
async function v0420Share(){const text=v0420Report(),file=new File([text],`linasopti_entrylab1_${new Date().toISOString().slice(0,10)}.txt`,{type:'text/plain'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Entry Lab 1',files:[file]});return}}catch(e){if(e?.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function v0420Run(){if(V0420_RUNNING)return;V0420_RUNNING=true;V0420_ABORT=false;V0420_RESULTS=[];V0420_RANKED=[];v0420Paint();const run=document.getElementById('v0420Run'),stop=document.getElementById('v0420Stop'),st=document.getElementById('v0420Status'),bar=document.getElementById('v0420Bar');if(run)run.disabled=true;if(stop)stop.hidden=false;try{for(let i=0;i<V0410_WINDOWS.length;i++){if(V0420_ABORT)break;const w=V0410_WINDOWS[i];if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar ${w.label}…`;if(bar)bar.style.width=`${i*10}%`;await v0406Yield(40);const cut=await v0410FetchWindow(w),pro=daytradePro(cut.rows,100000,.005);let k=0;for(const v of V0420_VARIANTS){if(V0420_ABORT)break;const trades=v0420Filter(pro,v),r=v0420Replay(cut.rows,trades),wins=r.closed.filter(x=>x.pnl>0).length,gw=r.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(r.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));V0420_RESULTS.push({window:w.n,variant:v.id,...r,wins,gw,gl});v0413AddSims(1);if(++k%75===0){if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · ${k}/625 entryfilter…`;await v0406Yield(0)}}v0420Paint();if(bar)bar.style.width=`${(i+1)*10}%`;await v0406Yield(30)}if(st)st.textContent=V0420_ABORT?'Entry Lab stoppad efter pågående period.':'✓ Entry Lab 1 klart · 6 250 simuleringar analyserade.';}catch(e){if(st)st.textContent='Fel: '+(e?.message||e)}finally{V0420_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true;v0420Paint()}}
window.addEventListener('DOMContentLoaded',()=>{v0420Paint();document.getElementById('v0420Run')?.addEventListener('click',v0420Run);document.getElementById('v0420Stop')?.addEventListener('click',()=>V0420_ABORT=true);document.getElementById('v0420Share')?.addEventListener('click',v0420Share)});


// ============================================================
// V0.42.1 – ENTRY LAB 2 · förregistrerad OOS-kontroll
// Fyra kandidater valdes från den breda robusta zonen i Entry Lab 1.
// Perioderna nedan har inte använts i Entry/Exit Lab 1–2 eller de 10 eldproven.
// ============================================================
const V0421_WINDOWS=[
 {n:1,start:'2021-03-01',label:'mar 2021'},
 {n:2,start:'2021-12-01',label:'dec 2021'},
 {n:3,start:'2022-08-01',label:'aug 2022'},
 {n:4,start:'2022-11-01',label:'nov 2022'},
 {n:5,start:'2023-03-01',label:'mar 2023'},
 {n:6,start:'2023-12-01',label:'dec 2023'},
 {n:7,start:'2024-05-01',label:'maj 2024'},
 {n:8,start:'2025-02-03',label:'feb 2025'},
 {n:9,start:'2025-09-02',label:'sep 2025'},
 {n:10,start:'2026-04-01',label:'apr 2026'}
];
const V0421_CANDIDATES=[
 {id:'A',m3:.55,vol:1.15,close:80,tm:V0420_TIME.find(x=>x.id==='open'),name:'A · m3≥0,55% · vol≥1,15x · close≥80% · 10:30–12:00'},
 {id:'B',m3:.40,vol:1.15,close:86,tm:V0420_TIME.find(x=>x.id==='open'),name:'B · m3≥0,40% · vol≥1,15x · close≥86% · 10:30–12:00'},
 {id:'C',m3:.40,vol:1.15,close:80,tm:V0420_TIME.find(x=>x.id==='open'),name:'C · m3≥0,40% · vol≥1,15x · close≥80% · 10:30–12:00'},
 {id:'D',m3:.55,vol:1.15,close:86,tm:V0420_TIME.find(x=>x.id==='open'),name:'D · m3≥0,55% · vol≥1,15x · close≥86% · 10:30–12:00'}
];
let V0421_RESULTS=[],V0421_RUNNING=false,V0421_ABORT=false;
function v0421Agg(){return V0421_CANDIDATES.map(v=>{const a=V0421_RESULTS.filter(x=>x.variant===v.id),pnl=a.reduce((q,x)=>q+x.pnl,0),gw=a.reduce((q,x)=>q+x.gw,0),gl=a.reduce((q,x)=>q+x.gl,0),n=a.reduce((q,x)=>q+x.n,0),wins=a.reduce((q,x)=>q+x.wins,0),pos=a.filter(x=>x.pnl>0).length,maxDD=a.length?Math.min(...a.map(x=>x.dd)):0,pf=gl?gw/gl:(gw?Infinity:0);return {v,pnl,pf,n,wr:n?wins/n:0,pos,maxDD,periods:a.length}})}
function v0421Paint(){const body=document.getElementById('v0421Rows'),sum=document.getElementById('v0421Summary'),share=document.getElementById('v0421Share');if(!body)return;const A=v0421Agg();body.innerHTML=A.map(a=>`<tr><td><b>${a.v.name}</b></td><td>${a.n}</td><td class="${a.pnl>=0?'good':'bad'}">${a.pnl>=0?'+':''}${a.pnl.toFixed(0)}</td><td>${v0411FmtPF(a.pf)}</td><td>${a.pos}/${a.periods||10}</td><td>${(a.maxDD*100).toFixed(2)}%</td></tr>`).join('');const done=Math.max(0,...A.map(x=>x.periods));if(!V0421_RESULTS.length){sum.textContent='Ingen OOS-körning ännu.';if(share)share.disabled=true;return}const pass=A.filter(x=>x.periods===10&&x.pnl>0&&x.pf>=1&&x.pos>=6).length;sum.innerHTML=`Orörda perioder ${done}/10 · frysta kandidater 4 · preliminärt OOS-kriterium: positiv P/L + PF≥1 + minst 6/10 positiva perioder.<br><b>${pass}/4 kandidater klarar kriteriet${done<10?' hittills':''}.</b>`;if(share)share.disabled=done<1}
function v0421Report(){const A=v0421Agg(),L=['LINAS OPTI – ENTRY LAB 2 · ORÖRDA PERIODER','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Fyra entrykandidater förregistrerades från den robusta zonen i Entry Lab 1 innan denna körning.','10 nya historiska 20-handelsdagarsperioder som inte användes i tidigare Entry/Exit Lab eller kontrollserien.','Samma Lina Selection 16 + SPY, fryst PRO2-signalmotor och forsknings-exit: stop -0,4%, delay 20 min, mål +0,8%, max 60 min.','Ingen ny optimering görs i Entry Lab 2.','','KANDIDATER'];A.forEach(a=>L.push(`${a.v.id}. ${a.v.name} | perioder ${a.periods}/10 | n ${a.n} | P/L ${a.pnl.toFixed(2)} | PF ${v0411FmtPF(a.pf)} | WR ${(a.wr*100).toFixed(1)}% | +perioder ${a.pos}/${a.periods} | värsta DD ${(a.maxDD*100).toFixed(2)}%`));L.push('','PERIODRESULTAT');for(const w of V0421_WINDOWS){for(const c of V0421_CANDIDATES){const r=V0421_RESULTS.find(x=>x.window===w.n&&x.variant===c.id);if(r)L.push(`#${w.n} ${r.from}→${r.to} | ${c.id} | n ${r.n} | P/L ${r.pnl.toFixed(2)} | PF ${v0411FmtPF(r.gl?r.gw/r.gl:(r.gw?Infinity:0))} | WR ${r.n?(r.wins/r.n*100).toFixed(1):'0.0'}% | DD ${(r.dd*100).toFixed(2)}%`)}}L.push('','OBS: Dessa perioder är oberoende av Entry Lab 1-urvalet. Efter denna körning är de förbrukade som orörd valideringsdata för dessa kandidater.');return L.join('\n')}
async function v0421Share(){const text=v0421Report(),file=new File([text],`linasopti_entrylab2_oos_${new Date().toISOString().slice(0,10)}.txt`,{type:'text/plain'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Entry Lab 2',files:[file]});return}}catch(e){if(e?.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function v0421Run(){if(V0421_RUNNING)return;V0421_RUNNING=true;V0421_ABORT=false;V0421_RESULTS=[];v0421Paint();const run=document.getElementById('v0421Run'),stop=document.getElementById('v0421Stop'),st=document.getElementById('v0421Status'),bar=document.getElementById('v0421Bar');if(run)run.disabled=true;if(stop)stop.hidden=false;try{for(let i=0;i<V0421_WINDOWS.length;i++){if(V0421_ABORT)break;const w=V0421_WINDOWS[i];if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar orörd period ${w.label}…`;if(bar)bar.style.width=`${i*10}%`;await v0406Yield(40);const cut=await v0410FetchWindow(w),pro=daytradePro(cut.rows,100000,.005);for(const v of V0421_CANDIDATES){const trades=v0420Filter(pro,v),r=v0420Replay(cut.rows,trades),wins=r.closed.filter(x=>x.pnl>0).length,gw=r.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(r.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));V0421_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),variant:v.id,...r,wins,gw,gl});v0413AddSims(1)}v0421Paint();if(bar)bar.style.width=`${(i+1)*10}%`;await v0406Yield(30)}if(st)st.textContent=V0421_ABORT?'Entry Lab 2 stoppad efter pågående period.':'✓ Entry Lab 2 klart · 40 OOS-simuleringar.';}catch(e){if(st)st.textContent='Fel: '+(e?.message||e)}finally{V0421_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true;v0421Paint()}}
window.addEventListener('DOMContentLoaded',()=>{v0421Paint();document.getElementById('v0421Run')?.addEventListener('click',v0421Run);document.getElementById('v0421Stop')?.addEventListener('click',()=>V0421_ABORT=true);document.getElementById('v0421Share')?.addEventListener('click',v0421Share)});


// ============================================================
// V0.42.2 – Regim Lab 1
// Kandidat B från Entry Lab 2 hålls fryst. Vi filtrerar dess exakta
// entries med endast SPY-information som var känd vid entry.
// De 10 Entry Lab 2-perioderna är nu utvecklingsdata, inte ny OOS.
// ============================================================
const V0422_REGIMES=[
 {id:'all',name:'Ingen regimfilter',ok:x=>true},
 {id:'dayup',name:'SPY sedan öppning ≥ 0%',ok:x=>x.dayRet>=0},
 {id:'m15up',name:'SPY 15m momentum ≥ 0%',ok:x=>x.m15>=0},
 {id:'both',name:'SPY öppning ≥0% + 15m ≥0%',ok:x=>x.dayRet>=0&&x.m15>=0},
 {id:'strong',name:'SPY öppning ≥+0,10% + 15m ≥+0,05%',ok:x=>x.dayRet>=.001&&x.m15>=.0005}
];
let V0422_RESULTS=[],V0422_RUNNING=false,V0422_ABORT=false;
function v0422NYDate(t){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t))}
function v0422SpyFeature(rows,t){
 const et=+new Date(t),day=v0422NYDate(t),spy=rows.filter(r=>r.symbol==='SPY'&&v0422NYDate(r.t)===day&&+new Date(r.t)<=et).sort((a,b)=>+new Date(a.t)-+new Date(b.t));
 if(!spy.length)return {dayRet:NaN,m15:NaN};
 const now=spy.at(-1),op=spy[0].o||spy[0].c,cut=et-15*60*1000,prev=[...spy].reverse().find(r=>+new Date(r.t)<=cut)||spy[0];
 return {dayRet:now.c/op-1,m15:now.c/prev.c-1};
}
function v0422Filter(rows,pro,reg){const b=V0421_CANDIDATES.find(x=>x.id==='B');return v0420Filter(pro,b).filter(t=>reg.ok(v0422SpyFeature(rows,t.entryTime)))}
function v0422Agg(){return V0422_REGIMES.map(v=>{const a=V0422_RESULTS.filter(x=>x.variant===v.id),pnl=a.reduce((q,x)=>q+x.pnl,0),gw=a.reduce((q,x)=>q+x.gw,0),gl=a.reduce((q,x)=>q+x.gl,0),n=a.reduce((q,x)=>q+x.n,0),wins=a.reduce((q,x)=>q+x.wins,0),pos=a.filter(x=>x.pnl>0).length,maxDD=a.length?Math.min(...a.map(x=>x.dd)):0,pf=gl?gw/gl:(gw?Infinity:0);return {v,pnl,pf,n,wr:n?wins/n:0,pos,maxDD,periods:a.length}})}
function v0422Paint(){const body=document.getElementById('v0422Rows'),sum=document.getElementById('v0422Summary'),share=document.getElementById('v0422Share');if(!body)return;const A=v0422Agg();body.innerHTML=A.map(a=>`<tr><td><b>${a.v.name}</b></td><td>${a.n}</td><td class="${a.pnl>=0?'good':'bad'}">${a.pnl>=0?'+':''}${a.pnl.toFixed(0)}</td><td>${v0411FmtPF(a.pf)}</td><td>${a.pos}/${a.periods||10}</td><td>${(a.maxDD*100).toFixed(2)}%</td></tr>`).join('');if(!V0422_RESULTS.length){sum.textContent='Ingen Regim Lab-körning ännu.';if(share)share.disabled=true;return}const done=Math.max(0,...A.map(x=>x.periods)),best=[...A].sort((a,b)=>b.pnl-a.pnl)[0];sum.innerHTML=`Perioder ${done}/10 · regimer 5 · kandidat B fryst.${best?`<br>Bäst hittills: <b>${best.v.name}</b> · P/L ${best.pnl.toFixed(0)} · PF ${v0411FmtPF(best.pf)} · ${best.pos}/${best.periods} positiva perioder`:''}`;if(share)share.disabled=done<1}
function v0422Report(){const A=v0422Agg(),L=['LINAS OPTI – REGIM LAB 1 · MARKNADSFILTER','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Entrykandidat B är fryst: m3>=0,40%, vol>=1,15x, close>=86%, 10:30–12:00 NY.','Samma forsknings-exit: stop -0,4%, delay 20 min, mål +0,8%, max 60 min.','Fem förregistrerade regimlägen filtrerar endast med SPY-information känd vid entry: avkastning sedan dagsöppning och 15-minuters momentum.','10 Entry Lab 2-perioder återanvänds som UTVECKLINGSDATA. Detta är INTE oberoende validering.','','REGIMRESULTAT'];A.forEach(a=>L.push(`${a.v.name} | perioder ${a.periods}/10 | n ${a.n} | P/L ${a.pnl.toFixed(2)} | PF ${v0411FmtPF(a.pf)} | WR ${(a.wr*100).toFixed(1)}% | +perioder ${a.pos}/${a.periods} | värsta DD ${(a.maxDD*100).toFixed(2)}%`));L.push('','PERIODRESULTAT');for(const w of V0421_WINDOWS){for(const r of V0422_REGIMES){const x=V0422_RESULTS.find(q=>q.window===w.n&&q.variant===r.id);if(x)L.push(`#${w.n} ${x.from}→${x.to} | ${r.id} | n ${x.n} | P/L ${x.pnl.toFixed(2)} | PF ${v0411FmtPF(x.gl?x.gw/x.gl:(x.gw?Infinity:0))} | WR ${x.n?(x.wins/x.n*100).toFixed(1):'0.0'}% | DD ${(x.dd*100).toFixed(2)}%`)}}L.push('','OBS: Om ett regimfilter ser lovande ut måste det frysas och testas på helt nya perioder innan Robotmognad kan höjas.');return L.join('\n')}
async function v0422Share(){const text=v0422Report(),file=new File([text],`linasopti_regimlab1_${new Date().toISOString().slice(0,10)}.txt`,{type:'text/plain'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Regim Lab 1',files:[file]});return}}catch(e){if(e?.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function v0422Run(){if(V0422_RUNNING)return;V0422_RUNNING=true;V0422_ABORT=false;V0422_RESULTS=[];v0422Paint();const run=document.getElementById('v0422Run'),stop=document.getElementById('v0422Stop'),st=document.getElementById('v0422Status'),bar=document.getElementById('v0422Bar');if(run)run.disabled=true;if(stop)stop.hidden=false;try{for(let i=0;i<V0421_WINDOWS.length;i++){if(V0422_ABORT)break;const w=V0421_WINDOWS[i];if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar ${w.label} och mäter SPY-regim…`;if(bar)bar.style.width=`${i*10}%`;await v0406Yield(40);const cut=await v0410FetchWindow(w),pro=daytradePro(cut.rows,100000,.005);for(const reg of V0422_REGIMES){const trades=v0422Filter(cut.rows,pro,reg),r=v0420Replay(cut.rows,trades),wins=r.closed.filter(x=>x.pnl>0).length,gw=r.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(r.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));V0422_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),variant:reg.id,...r,wins,gw,gl});v0413AddSims(1)}v0422Paint();if(bar)bar.style.width=`${(i+1)*10}%`;await v0406Yield(30)}if(st)st.textContent=V0422_ABORT?'Regim Lab stoppad efter pågående period.':'✓ Regim Lab 1 klart · 50 simuleringar.';}catch(e){if(st)st.textContent='Fel: '+(e?.message||e)}finally{V0422_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true;v0422Paint()}}
window.addEventListener('DOMContentLoaded',()=>{v0422Paint();document.getElementById('v0422Run')?.addEventListener('click',v0422Run);document.getElementById('v0422Stop')?.addEventListener('click',()=>V0422_ABORT=true);document.getElementById('v0422Share')?.addEventListener('click',v0422Share)});


// ============================================================
// V0.42.3 – Regim Lab 2 · förregistrerad OOS-kontroll
// Entry B och Strong-regimen från V0.42.2 är frysta före körning.
// Tio helt nya 20-handelsdagarsperioder används. Ingen optimering.
// ============================================================
const V0423_WINDOWS=[
 {n:1,start:'2021-05-03',label:'maj 2021'},
 {n:2,start:'2021-11-01',label:'nov 2021'},
 {n:3,start:'2022-06-01',label:'jun 2022'},
 {n:4,start:'2022-09-01',label:'sep 2022'},
 {n:5,start:'2023-01-03',label:'jan 2023'},
 {n:6,start:'2023-05-01',label:'maj 2023'},
 {n:7,start:'2023-09-01',label:'sep 2023'},
 {n:8,start:'2024-04-01',label:'apr 2024'},
 {n:9,start:'2025-04-01',label:'apr 2025'},
 {n:10,start:'2026-06-01',label:'jun 2026'}
];
const V0423_VARIANTS=[
 {id:'base',name:'Entry B · inget regimfilter',ok:x=>true},
 {id:'strong',name:'Entry B + Strong',ok:x=>x.dayRet>=.001&&x.m15>=.0005}
];
let V0423_RESULTS=[],V0423_RUNNING=false,V0423_ABORT=false;
function v0423Trades(rows,pro,v){const b=V0421_CANDIDATES.find(x=>x.id==='B');return v0420Filter(pro,b).filter(t=>v.ok(v0422SpyFeature(rows,t.entryTime)))}
function v0423Agg(){return V0423_VARIANTS.map(v=>{const a=V0423_RESULTS.filter(x=>x.variant===v.id),pnl=a.reduce((q,x)=>q+x.pnl,0),gw=a.reduce((q,x)=>q+x.gw,0),gl=a.reduce((q,x)=>q+x.gl,0),n=a.reduce((q,x)=>q+x.n,0),wins=a.reduce((q,x)=>q+x.wins,0),pos=a.filter(x=>x.pnl>0).length,maxDD=a.length?Math.min(...a.map(x=>x.dd)):0,pf=gl?gw/gl:(gw?Infinity:0);return {v,pnl,pf,n,wr:n?wins/n:0,pos,maxDD,periods:a.length}})}
function v0423Paint(){const body=document.getElementById('v0423Rows'),sum=document.getElementById('v0423Summary'),share=document.getElementById('v0423Share');if(!body)return;const A=v0423Agg();body.innerHTML=A.map(a=>`<tr><td><b>${a.v.name}</b></td><td>${a.n}</td><td class="${a.pnl>=0?'good':'bad'}">${a.pnl>=0?'+':''}${a.pnl.toFixed(0)}</td><td>${v0411FmtPF(a.pf)}</td><td>${(a.wr*100).toFixed(1)}%</td><td>${a.pos}/${a.periods||10}</td><td>${(a.maxDD*100).toFixed(2)}%</td></tr>`).join('');if(!V0423_RESULTS.length){sum.textContent='Ingen OOS-körning ännu.';if(share)share.disabled=true;return}const done=Math.max(0,...A.map(x=>x.periods)),base=A.find(x=>x.v.id==='base'),strong=A.find(x=>x.v.id==='strong'),delta=(strong&&base)?strong.pnl-base.pnl:0;sum.innerHTML=`Perioder ${done}/10 · två frysta varianter.${strong&&base?`<br><b>Strong mot baseline:</b> P/L ${delta>=0?'+':''}${delta.toFixed(0)} · PF ${v0411FmtPF(strong.pf)} mot ${v0411FmtPF(base.pf)} · +perioder ${strong.pos}/${strong.periods}`:''}`;if(share)share.disabled=done<1}
function v0423Report(){const A=v0423Agg(),L=['LINAS OPTI – REGIM LAB 2 · ORÖRT PROV','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Entrykandidat B är fryst: m3>=0,40%, vol>=1,15x, close>=86%, 10:30–12:00 NY.','Strong-regimen är fryst före denna körning: SPY sedan öppning >= +0,10% OCH SPY 15m momentum >= +0,05%.','Samma forsknings-exit: stop -0,4%, delay 20 min, mål +0,8%, max 60 min.','10 nya historiska 20-handelsdagarsperioder som inte användes i tidigare kontroll-, Exit-, Entry- eller Regim Lab 1.','Ingen parameteroptimering görs. Baseline Entry B utan regimfilter körs endast som förregistrerad jämförelse.','','OOS-RESULTAT'];A.forEach(a=>L.push(`${a.v.name} | perioder ${a.periods}/10 | n ${a.n} | P/L ${a.pnl.toFixed(2)} | PF ${v0411FmtPF(a.pf)} | WR ${(a.wr*100).toFixed(1)}% | +perioder ${a.pos}/${a.periods} | värsta DD ${(a.maxDD*100).toFixed(2)}%`));L.push('','PERIODRESULTAT');for(const w of V0423_WINDOWS){for(const v of V0423_VARIANTS){const x=V0423_RESULTS.find(q=>q.window===w.n&&q.variant===v.id);if(x)L.push(`#${w.n} ${x.from}→${x.to} | ${v.id} | n ${x.n} | P/L ${x.pnl.toFixed(2)} | PF ${v0411FmtPF(x.gl?x.gw/x.gl:(x.gw?Infinity:0))} | WR ${x.n?(x.wins/x.n*100).toFixed(1):'0.0'}% | DD ${(x.dd*100).toFixed(2)}%`)}}L.push('','OBS: Dessa 10 perioder är efter körningen förbrukade som orörd valideringsdata för Entry B + Strong. Robotmognad ska endast omvärderas efter att hela serien är färdig.');return L.join('\n')}
async function v0423Share(){const text=v0423Report(),file=new File([text],`linasopti_regimlab2_oos_${new Date().toISOString().slice(0,10)}.txt`,{type:'text/plain'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Regim Lab 2',files:[file]});return}}catch(e){if(e?.name==='AbortError')return}const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
async function v0423Run(){if(V0423_RUNNING)return;V0423_RUNNING=true;V0423_ABORT=false;V0423_RESULTS=[];v0423Paint();const run=document.getElementById('v0423Run'),stop=document.getElementById('v0423Stop'),st=document.getElementById('v0423Status'),bar=document.getElementById('v0423Bar');if(run)run.disabled=true;if(stop)stop.hidden=false;try{for(let i=0;i<V0423_WINDOWS.length;i++){if(V0423_ABORT)break;const w=V0423_WINDOWS[i];if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar orörd period ${w.label}…`;if(bar)bar.style.width=`${i*10}%`;await v0406Yield(40);const cut=await v0410FetchWindow(w),pro=daytradePro(cut.rows,100000,.005);for(const v of V0423_VARIANTS){const trades=v0423Trades(cut.rows,pro,v),r=v0420Replay(cut.rows,trades),wins=r.closed.filter(x=>x.pnl>0).length,gw=r.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(r.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));V0423_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),variant:v.id,...r,wins,gw,gl});v0413AddSims(1)}v0423Paint();if(bar)bar.style.width=`${(i+1)*10}%`;await v0406Yield(30)}if(st)st.textContent=V0423_ABORT?'Regim Lab 2 stoppad efter pågående period.':'✓ Regim Lab 2 klart · 20 OOS-simuleringar.';}catch(e){if(st)st.textContent='Fel: '+(e?.message||e)}finally{V0423_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true;v0423Paint()}}
window.addEventListener('DOMContentLoaded',()=>{v0423Paint();document.getElementById('v0423Run')?.addEventListener('click',v0423Run);document.getElementById('v0423Stop')?.addEventListener('click',()=>V0423_ABORT=true);document.getElementById('v0423Share')?.addEventListener('click',v0423Share)});

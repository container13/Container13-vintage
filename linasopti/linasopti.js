
const APP_VERSION = "V0.52.1";
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
  // V0.43.1: one authoritative navigation state. Do not rely on hidden alone (iOS Safari/CSS can resurrect the label).
  document.documentElement.dataset.researchMode=inLab?"testlab":"tester";
  if(labPick){ labPick.hidden=!inLab; labPick.style.setProperty("display",inLab?"grid":"none","important"); labPick.setAttribute("aria-hidden",inLab?"false":"true"); }
  if(testerNav){ testerNav.hidden=inLab; testerNav.style.setProperty("display",inLab?"none":"grid","important"); testerNav.setAttribute("aria-hidden",inLab?"true":"false"); }
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

// V0.46.3 – loginfält ska alltid öppna tomt.
function v0463ClearLoginField(){
 const el=document.getElementById('v0383Code');
 if(!el)return;
 el.value='';
 el.defaultValue='';
 el.removeAttribute('value');
}
document.addEventListener('DOMContentLoaded',()=>{
 v0463ClearLoginField();
 // Vissa lösenordshanterare fyller efter DOMContentLoaded.
 setTimeout(v0463ClearLoginField,50);
 setTimeout(v0463ClearLoginField,250);
 setTimeout(v0463ClearLoginField,800);
});
window.addEventListener('pageshow',()=>{v0463ClearLoginField();setTimeout(v0463ClearLoginField,100)});

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
 if(menu)menu.hidden=true;if(toggle)toggle.setAttribute("aria-expanded","false");
 if(!LAST?.s&&!LAST?.d){if(status)status.textContent="Kör ett test först.";return false}
 const txt=v17TextReport(full),stamp=new Date().toISOString().slice(0,10),prefix=`linasopti_test_${full?'full':'snabb'}`;
 const ok=await v043xShare(txt,prefix,"Linas Opti test");
 if(status)status.textContent=ok?(v0451IsIOS()?"✓ Rapport delad.":"✓ Rapport nedladdad till Hämtade/Downloads."):"Rapporten kunde inte sparas.";
 return ok;
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
async function v0410Share(){return v043xShare(v0410Report(),'linasopti_testlab_kontrollserie','Linas Opti Testlab','v0410Status')}
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
async function v0411Share(){return v043xShare(v0411Report(),'linasopti_exitlab','Linas Opti Exit Lab','v0411Status')}
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
 if(share)share.disabled=false;
}
function v0412Report(){
 const R=v0412Agg(),L=['LINAS OPTI – EXIT LAB 2 · PARAMETERKARTA','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Förregistrerad grid: stop 0,4/0,6/0,8/1,0/1,2%; delay 0/5/10/15/20 min; mål 0,6/0,8/1,0/1,2/1,5%; max hålltid 20/30/40/50/60 min.','625 kombinationer × 10 historiska 20-handelsdagarsperioder. Exakt samma frysta PRO2-entries; endast exit ändras.','Ranking används för forskning och är INTE oberoende validering.',''];
 const positive=R.filter(x=>x.pnl>0).length,pf1=R.filter(x=>x.pf>=1).length;L.push(`SAMMANFATTNING | kombinationer ${R.length}/625 | positiv P/L ${positive} | PF>=1 ${pf1}`,'','TOPP 50');
 R.slice(0,50).forEach((a,i)=>{const nb=v0412NeighborCount(a,R);L.push(`${i+1}. ${a.v.name} | P/L ${a.pnl.toFixed(2)} | PF ${v0411FmtPF(a.pf)} | WR ${(a.wr*100).toFixed(1)}% | +perioder ${a.pos}/10 | värsta DD ${(a.maxDD*100).toFixed(2)}% | robusta grannar ${nb.good}/${nb.total} | score ${a.score.toFixed(2)}`)});
 L.push('','ALLA 625 KOMBINATIONER');R.forEach((a,i)=>{const nb=v0412NeighborCount(a,R);L.push(`${i+1}|${a.v.stop}|${a.v.delay*5}|${a.v.target}|${a.v.hold*5}|${a.pnl.toFixed(2)}|${v0411FmtPF(a.pf)}|${(a.wr*100).toFixed(2)}|${a.pos}|${(a.maxDD*100).toFixed(3)}|${nb.good}/${nb.total}|${a.score.toFixed(3)}`)});
 L.push('','OBS: Dessa 10 perioder är nu utvecklingsdata för Exit Lab 2. En vald kandidat måste senare frysas och testas på nya orörda perioder.');return L.join('\n');
}
async function v0412Share(){return v043xShare(v0412Report(),'linasopti_exitlab2','Linas Opti Exit Lab 2','v0412Status')}
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
const V0413_SIM_SEED=19970; // verifierat minimum t.o.m. färdig Signal Lab 4
const V04514_SIM_MIGRATION_KEY='linasopti_sim_counter_migrated_v04514';
function v0413GetSims(){
 let n=Number(localStorage.getItem(V0413_SIM_KEY));
 if(!Number.isFinite(n))n=0;
 // V0.45.14: 19 742 t.o.m. Signal Lab 2 + 180 Signal Lab 3 + 48 Signal Lab 4 = 19 970.
 if(localStorage.getItem(V04514_SIM_MIGRATION_KEY)!=='1'){
   n=Math.max(n,V0413_SIM_SEED);
   localStorage.setItem(V0413_SIM_KEY,String(Math.floor(n)));
   localStorage.setItem(V04514_SIM_MIGRATION_KEY,'1');
 }
 if(n<V0413_SIM_SEED){n=V0413_SIM_SEED;localStorage.setItem(V0413_SIM_KEY,String(n))}
 return Math.floor(n);
}
function v0413PaintSims(){
 const e=document.getElementById('v0413SimValue');
 if(e)e.textContent='≥ '+v0413GetSims().toLocaleString('sv-SE');
}
function v0413AddSims(n){
 n=Math.floor(Number(n)); if(!Number.isFinite(n)||n<=0)return;
 const next=v0413GetSims()+n; localStorage.setItem(V0413_SIM_KEY,String(next)); v0413PaintSims();
}
function v0413ShowInfo(kind){
 const box=document.getElementById('v0413Info');if(!box)return;
 if(!box.hidden && box.dataset.kind===kind){box.hidden=true;return}
 box.dataset.kind=kind;box.hidden=false;
 if(kind==='maturity')box.innerHTML=`<h3>🤖 Lina är i forskningsfas · 48/100</h3><div class="v0413-meter"><i></i></div><p><b>Det vi har:</b> fungerande datamotor, reproducerbart backtest, mekanisk audit, fryst PRO2, Testlab, OOS-kontroller och automatiserad parameterforskning.</p><p><b>Senaste bevis:</b> fryst Entry B + Strong klarade Regim Lab 2 på 10 orörda perioder med positiv total P/L, PF över 1 och lägre drawdown än ofiltrerad Entry B.</p><p><b>Nästa steg mot högre mognad:</b> skapa ett intradagsspecifikt Day Selection på 5-minutersdata och validera exakt det frysta urvalet på nya orörda perioder.</p><p><b>Kvar till mäklarredo:</b> robust strategi → walk-forward/orörd validering → realtids-paper → riskmotor → ordermotor → brokerintegration → felhantering/kill-switch → längre stabil paperdrift.</p><p><small>100/100 betyder att vår broker-ready-checklista är uppfylld – inte garanterad lönsamhet. Senast omvärderad: V0.43.3.</small></p>`;
 else box.innerHTML=`<h3>🧪 Minst ${v0413GetSims().toLocaleString('sv-SE')} registrerade simuleringar</h3><p>Räknaren har nu ett dokumenterat gemensamt golv på minst 19 742 färdigregistrerade simuleringar t.o.m. Signal Lab 2. Signal Lab 3 adderar 4 först när hela fyrvariantskörningen är färdig. Om en äldre webbläsare eller en annan enhet har ett lägre lokalt värde migreras den automatiskt upp till golvet.</p><p>Från V0.45.3 adderas bara helt färdiga och registrerade simuleringar. Räknaren lagras fortfarande lokalt i webbläsaren, så körningar på flera enheter kan inte summeras exakt utan serverlagring. Därför visas ≥ och inte ett falskt exakt globalt tal.</p>`;
}
window.addEventListener('DOMContentLoaded',()=>{
 v0413PaintSims();
 document.getElementById('v0413Maturity')?.addEventListener('click',()=>v0413ShowInfo('maturity'));
 document.getElementById('v0413Sims')?.addEventListener('click',()=>v0413ShowInfo('sims'));
 const engine=document.getElementById('v0423Engine'),jump=document.getElementById('v0413LabJump');
 const LAB_KEY='linasopti_testlab_selected_v0423';
 function showSelectedLab(){if(!jump)return;const val=jump.value;document.querySelectorAll('[class*=\"vlab-v04\"]').forEach(el=>{el.style.display=el.classList.contains('vlab-'+val)?'':'none'});document.querySelectorAll('.vlab-extra').forEach(el=>el.style.display='none');localStorage.setItem(LAB_KEY,val);}
 if(jump){const saved=localStorage.getItem(LAB_KEY);if(saved&&saved!=='v0458Lab'&&saved!=='v0459Lab'&&[...jump.options].some(o=>o.value===saved))jump.value=saved;else jump.value='v0460Lab';jump.addEventListener('change',showSelectedLab);showSelectedLab();}
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
async function v0420Share(){return v043xShare(v0420Report(),'linasopti_entrylab1','Linas Opti Entry Lab 1','v0420Status')}
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
async function v0421Share(){return v043xShare(v0421Report(),'linasopti_entrylab2_oos','Linas Opti Entry Lab 2','v0421Status')}
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
async function v0422Share(){return v043xShare(v0422Report(),'linasopti_regimlab1','Linas Opti Regim Lab 1','v0422Status')}
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
async function v0423Share(){return v043xShare(v0423Report(),'linasopti_regimlab2_oos','Linas Opti Regim Lab 2','v0423Status')}
async function v0423Run(){if(V0423_RUNNING)return;V0423_RUNNING=true;V0423_ABORT=false;V0423_RESULTS=[];v0423Paint();const run=document.getElementById('v0423Run'),stop=document.getElementById('v0423Stop'),st=document.getElementById('v0423Status'),bar=document.getElementById('v0423Bar');if(run)run.disabled=true;if(stop)stop.hidden=false;try{for(let i=0;i<V0423_WINDOWS.length;i++){if(V0423_ABORT)break;const w=V0423_WINDOWS[i];if(st)st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar orörd period ${w.label}…`;if(bar)bar.style.width=`${i*10}%`;await v0406Yield(40);const cut=await v0410FetchWindow(w),pro=daytradePro(cut.rows,100000,.005);for(const v of V0423_VARIANTS){const trades=v0423Trades(cut.rows,pro,v),r=v0420Replay(cut.rows,trades),wins=r.closed.filter(x=>x.pnl>0).length,gw=r.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(r.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));V0423_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),variant:v.id,...r,wins,gw,gl});v0413AddSims(1)}v0423Paint();if(bar)bar.style.width=`${(i+1)*10}%`;await v0406Yield(30)}if(st)st.textContent=V0423_ABORT?'Regim Lab 2 stoppad efter pågående period.':'✓ Regim Lab 2 klart · 20 OOS-simuleringar.';}catch(e){if(st)st.textContent='Fel: '+(e?.message||e)}finally{V0423_RUNNING=false;if(run)run.disabled=false;if(stop)stop.hidden=true;v0423Paint()}}
window.addEventListener('DOMContentLoaded',()=>{v0423Paint();document.getElementById('v0423Run')?.addEventListener('click',v0423Run);document.getElementById('v0423Stop')?.addEventListener('click',()=>V0423_ABORT=true);document.getElementById('v0423Share')?.addEventListener('click',v0423Share)});


// ============================================================
// V0.43.3 – DAY SELECTION 1 + 2
// DS1 använder redan förbrukade utvecklingsperioder och ett fast brett USA-universum.
// DS2 är låst tills DS1 har fryst urvalet och använder därefter nya OOS-perioder.
// Entry B, Strong-regim och forsknings-exit ändras inte.
// ============================================================
const V0430_UNIVERSE=["AAPL","MSFT","NVDA","AMZN","META","TSLA","AVGO","GOOGL","JPM","V","MA","WMT","COST","ORCL","NFLX","AMD","CRM","ADBE","CSCO","IBM","INTC","QCOM","MU","GS","BAC","MS","HD","LOW","NKE","MCD","SBUX","KO","PEP","XOM","CVX","CAT","GE","BA","RTX","UBER","PLTR","PYPL","ABNB","SHOP","LLY","JNJ","MRK","ABBV","PFE","TMO","UNH","CVS","DIS","CMCSA","T","VZ","F","GM","DE","HON","UPS","FDX","BKNG","MAR","DAL","LUV","AMAT","LRCX","KLAC","TXN","ADI","NOW","PANW","CRWD","SNOW","DDOG","MDB","C","AXP","SCHW"];
const V0430_FREEZE_KEY='linasopti_dayselection_frozen_v0430';
const V0430_PROGRESS_KEY='linasopti_dayselection1_progress_v0434';
const V0431_PROGRESS_KEY='linasopti_dayselection2_progress_v0434';
const V0431_WINDOWS=[
 {n:1,start:'2021-01-04',label:'jan 2021'},{n:2,start:'2021-07-01',label:'jul 2021'},
 {n:3,start:'2022-03-01',label:'mar 2022'},{n:4,start:'2022-12-01',label:'dec 2022'},
 {n:5,start:'2023-06-01',label:'jun 2023'},{n:6,start:'2024-01-02',label:'jan 2024'},
 {n:7,start:'2024-10-01',label:'okt 2024'},{n:8,start:'2025-01-02',label:'jan 2025'},
 {n:9,start:'2025-07-01',label:'jul 2025'},{n:10,start:'2026-02-02',label:'feb 2026'}
];
let V0430_RESULTS=[],V0430_RUNNING=false,V0430_FROZEN=null,V0431_RESULTS=[],V0431_RUNNING=false;
function v0430Strong(){return V0423_VARIANTS.find(x=>x.id==='strong')}
async function v0434Retry(fn,label,statusEl){let last;for(let a=1;a<=3;a++){try{return await fn()}catch(e){last=e;if(a<3){if(statusEl)statusEl.innerHTML=`<span class="v0406-spinner small"></span> ${label} · anslutningen bröts, försök ${a+1}/3…`;await v0406Yield(1200*a)}}}throw last}
async function v0430FetchSymbols(w,symbols,statusEl){
 const all=[...new Set(symbols.filter(x=>x!=='SPY'))], out=[]; const end=v0410DatePlus(w.start,40);
 for(let i=0;i<all.length;i+=20){const batch=[...all.slice(i,i+20),'SPY'];const label=`${Math.floor(i/20)+1}/${Math.ceil(all.length/20)} datablock`;const j=await v0434Retry(()=>bridge(`/bars?symbols=${encodeURIComponent(batch.join(','))}&timeframe=5Min&start=${w.start}&end=${end}`),label,statusEl);out.push(...(j.rows||[]));await v0406Yield(40)}
 const uniq=new Map();for(const r of out)uniq.set(r.symbol+'|'+r.t,r);return v0410Trim20([...uniq.values()],w.start);
}
function v0434SaveDS1(){try{localStorage.setItem(V0430_PROGRESS_KEY,JSON.stringify(V0430_RESULTS))}catch{}}
function v0434SaveDS2(){try{localStorage.setItem(V0431_PROGRESS_KEY,JSON.stringify(V0431_RESULTS))}catch{}}
function v0434DoneWindows(rows){return new Set(rows.map(x=>x.window))}
function v0434ScrollLab(id){requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}))}
function v0430One(rows,sym){const r=rows.filter(x=>x.symbol===sym||x.symbol==='SPY');if(!r.some(x=>x.symbol===sym))return null;const pro=daytradePro(r,100000,.005);const trades=v0423Trades(r,pro,v0430Strong()),rep=v0420Replay(r,trades),wins=rep.closed.filter(x=>x.pnl>0).length,gw=rep.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(rep.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));return {...rep,wins,gw,gl}}
function v0430Rank(){return V0430_UNIVERSE.map(sym=>{const a=V0430_RESULTS.filter(x=>x.symbol===sym),n=a.reduce((q,x)=>q+x.n,0),pnl=a.reduce((q,x)=>q+x.pnl,0),gw=a.reduce((q,x)=>q+x.gw,0),gl=a.reduce((q,x)=>q+x.gl,0),wins=a.reduce((q,x)=>q+x.wins,0),pos=a.filter(x=>x.pnl>0).length,pf=gl?gw/gl:(gw?Infinity:0),wr=n?wins/n:0,score=Math.min(Number.isFinite(pf)?pf:2,2)*30+pos*6+Math.min(n,30)*.5+Math.max(-15,Math.min(15,pnl/100));return {sym,n,pnl,pf,wr,pos,periods:a.length,score,eligible:n>=5&&pnl>0&&pf>=1&&pos>=3}}).sort((a,b)=>(b.eligible-a.eligible)||b.score-a.score)}
function v0430Paint(){const body=document.getElementById('v0430Rows'),sum=document.getElementById('v0430Summary'),share=document.getElementById('v0430Share');if(!body)return;const R=v0430Rank();body.innerHTML=R.filter(x=>x.n).slice(0,25).map((a,i)=>`<tr><td>${i+1}</td><td><b>${a.sym}</b>${a.eligible?' ✓':''}</td><td>${a.n}</td><td class="${a.pnl>=0?'good':'bad'}">${a.pnl>=0?'+':''}${a.pnl.toFixed(0)}</td><td>${v0411FmtPF(a.pf)}</td><td>${a.pos}/${a.periods}</td></tr>`).join('');if(V0430_FROZEN){sum.innerHTML=`<b>🔒 Day Selection fryst · ${V0430_FROZEN.symbols.length} aktier</b><br>${V0430_FROZEN.symbols.join(', ')}`;if(share)share.disabled=false}else if(V0430_RESULTS.length){const done=new Set(V0430_RESULTS.map(x=>x.window)).size,eligible=R.filter(x=>x.eligible).length;sum.innerHTML=`Utvecklingsperioder ${done}/10 · universum ${V0430_UNIVERSE.length} · kvalificerade hittills <b>${eligible}</b>.<br>Urval fryses först efter 10/10.`;if(share)share.disabled=false}else{sum.textContent='Inget Day-urval skapat ännu.';if(share)share.disabled=true}v0431PaintFrozen()}
function v0430Freeze(){const R=v0430Rank(),eligible=R.filter(x=>x.eligible),picked=eligible.slice(0,16);V0430_FROZEN={version:'V0.43.4',created:new Date().toISOString(),rule:'n>=5, P/L>0, PF>=1, minst 3 positiva utvecklingsperioder; rank score för max 16',symbols:picked.map(x=>x.sym),stats:picked};localStorage.setItem(V0430_FREEZE_KEY,JSON.stringify(V0430_FROZEN));}
async function v0430Run(){if(V0430_RUNNING||V0430_FROZEN)return;V0430_RUNNING=true;const run=document.getElementById('v0430Run'),st=document.getElementById('v0430Status'),bar=document.getElementById('v0430Bar');run.disabled=true;v0434ScrollLab('v0430Lab');try{const done=v0434DoneWindows(V0430_RESULTS);for(let i=0;i<V0421_WINDOWS.length;i++){const w=V0421_WINDOWS[i];if(done.has(w.n))continue;st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar utvecklingsperiod ${w.label} · ${V0430_UNIVERSE.length} aktier…`;bar.style.width=`${done.size*10}%`;const cut=await v0430FetchSymbols(w,V0430_UNIVERSE,st);if(cut.dates.length<18)throw new Error('för få handelsdagar');st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · kartlägger aktier…`;let completed=0;for(let k=0;k<V0430_UNIVERSE.length;k++){const sym=V0430_UNIVERSE[k],r=v0430One(cut.rows,sym);if(r){V0430_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),symbol:sym,...r});completed++}if(k%10===0){st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · ${k+1}/${V0430_UNIVERSE.length} aktier…`;await v0406Yield(0)}}v0413AddSims(completed);v0434SaveDS1();done.add(w.n);bar.style.width=`${done.size*10}%`;v0430Paint()}if(done.size===10){v0430Freeze();v0430Paint();localStorage.removeItem(V0430_PROGRESS_KEY);st.textContent=`✓ Day Selection 1 klart · ${V0430_FROZEN.symbols.length} aktier frysta. Day Selection 2 är upplåst.`}}catch(e){const done=v0434DoneWindows(V0430_RESULTS).size;v0434SaveDS1();st.textContent=`Hämtningen avbröts efter ${done}/10 perioder. Resultaten är sparade. Tryck Kör för att fortsätta. (${e?.message||e})`;bar.style.width=`${done*10}%`}finally{V0430_RUNNING=false;run.disabled=!!V0430_FROZEN}}
function v0430Report(){const R=v0430Rank(),L=['LINAS OPTI – DAY SELECTION 1','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD',`Förregistrerat USA-universum: ${V0430_UNIVERSE.length} aktier.`,'10 redan förbrukade Entry Lab 2-perioder används som UTVECKLINGSDATA.','Varje symbol körs separat med fryst PRO2 → Entry B → Strong → forsknings-exit.','Kvalificering för fryst urval: n>=5, positiv P/L, PF>=1, minst 3 positiva perioder. Max 16 rankas med förregistrerad score.','Detta är urvalsforskning, INTE oberoende validering.','','FRYST DAY SELECTION',...(V0430_FROZEN?[V0430_FROZEN.symbols.join(', ')]:['Ej fryst']),'','RANKING'];R.forEach((x,i)=>L.push(`${i+1}. ${x.sym} | n ${x.n} | P/L ${x.pnl.toFixed(2)} | PF ${v0411FmtPF(x.pf)} | WR ${(x.wr*100).toFixed(1)}% | +perioder ${x.pos}/${x.periods} | eligible ${x.eligible?'JA':'NEJ'} | score ${x.score.toFixed(2)}`));return L.join('\n')}
async function v0430Share(){return v043xShare(v0430Report(),'linasopti_dayselection1','Linas Opti Day Selection 1','v0430Status')}
function v0431PaintFrozen(){const box=document.getElementById('v0431Frozen'),run=document.getElementById('v0431Run');if(!box||!run)return;if(V0430_FROZEN?.symbols?.length){box.innerHTML=`<b>🔒 Fryst från Selection 1 · ${V0430_FROZEN.symbols.length} aktier</b><br>${V0430_FROZEN.symbols.join(', ')}`;run.disabled=V0431_RUNNING}else{box.textContent='Inget Day-urval fryst ännu. Kör Day Selection 1 först.';run.disabled=true}}
function v0431Group(rows,symbols){const keep=new Set([...symbols,'SPY']),r=rows.filter(x=>keep.has(x.symbol)),pro=daytradePro(r,100000,.005),trades=v0423Trades(r,pro,v0430Strong()),rep=v0420Replay(r,trades),wins=rep.closed.filter(x=>x.pnl>0).length,gw=rep.closed.filter(x=>x.pnl>0).reduce((a,x)=>a+x.pnl,0),gl=Math.abs(rep.closed.filter(x=>x.pnl<0).reduce((a,x)=>a+x.pnl,0));return {...rep,wins,gw,gl}}
function v0431Agg(){return ['day','lina16'].map(id=>{const a=V0431_RESULTS.filter(x=>x.group===id),n=a.reduce((q,x)=>q+x.n,0),pnl=a.reduce((q,x)=>q+x.pnl,0),gw=a.reduce((q,x)=>q+x.gw,0),gl=a.reduce((q,x)=>q+x.gl,0),wins=a.reduce((q,x)=>q+x.wins,0),pos=a.filter(x=>x.pnl>0).length,dd=a.length?Math.min(...a.map(x=>x.dd)):0,pf=gl?gw/gl:(gw?Infinity:0);return {id,name:id==='day'?'Day Selection':'Lina Selection 16',n,pnl,pf,wr:n?wins/n:0,pos,dd,periods:a.length}})}
function v0431Paint(){const body=document.getElementById('v0431Rows'),share=document.getElementById('v0431Share');if(!body)return;const A=v0431Agg();body.innerHTML=A.map(a=>`<tr><td><b>${a.name}</b></td><td>${a.n}</td><td class="${a.pnl>=0?'good':'bad'}">${a.pnl>=0?'+':''}${a.pnl.toFixed(0)}</td><td>${v0411FmtPF(a.pf)}</td><td>${(a.wr*100).toFixed(1)}%</td><td>${a.pos}/${a.periods||10}</td><td>${(a.dd*100).toFixed(2)}%</td></tr>`).join('');if(share)share.disabled=!V0431_RESULTS.length;v0431PaintFrozen()}
async function v0431Run(){if(V0431_RUNNING||!V0430_FROZEN?.symbols?.length)return;V0431_RUNNING=true;const run=document.getElementById('v0431Run'),st=document.getElementById('v0431Status'),bar=document.getElementById('v0431Bar');run.disabled=true;v0434ScrollLab('v0431Lab');const lina=MARKET_GROUPS.linaSelection16.symbols.filter(x=>x!=='SPY');try{const done=v0434DoneWindows(V0431_RESULTS);for(let i=0;i<V0431_WINDOWS.length;i++){const w=V0431_WINDOWS[i];if(done.has(w.n))continue;st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/10 · hämtar ORÖRD period ${w.label}…`;bar.style.width=`${done.size*10}%`;const all=[...new Set([...V0430_FROZEN.symbols,...lina])],cut=await v0430FetchSymbols(w,all,st);if(cut.dates.length<18)throw new Error('för få handelsdagar');let completed=0;for(const [id,syms] of [['day',V0430_FROZEN.symbols],['lina16',lina]]){const r=v0431Group(cut.rows,syms);V0431_RESULTS.push({window:w.n,from:cut.dates[0],to:cut.dates.at(-1),group:id,...r});completed++}v0413AddSims(completed);v0434SaveDS2();done.add(w.n);bar.style.width=`${done.size*10}%`;v0431Paint();await v0406Yield(20)}if(done.size===10){localStorage.removeItem(V0431_PROGRESS_KEY);st.textContent='✓ Day Selection 2 klart · 10/10 orörda perioder. Dela rapporten för analys.'}}catch(e){const done=v0434DoneWindows(V0431_RESULTS).size;v0434SaveDS2();st.textContent=`Hämtningen avbröts efter ${done}/10 perioder. Resultaten är sparade. Tryck Kör för att fortsätta. (${e?.message||e})`;bar.style.width=`${done*10}%`}finally{V0431_RUNNING=false;v0431PaintFrozen()}}
function v0431Report(){const A=v0431Agg(),L=['LINAS OPTI – DAY SELECTION 2 · ORÖRT PROV','Version: '+APP_VERSION,'Skapad: '+new Date().toISOString(),'Handel: AVSTÄNGD (backtest/paper)','','METOD','Exakt fryst Day Selection från Day Selection 1 jämförs med Lina Selection 16.','10 nya 20-handelsdagarsperioder som inte används i tidigare labb i appens förregistrerade testplan.','Entry B + Strong + forsknings-exit är oförändrade. Ingen parameteroptimering görs.','','FRYST DAY SELECTION',V0430_FROZEN?.symbols?.join(', ')||'saknas','','OOS-RESULTAT'];A.forEach(a=>L.push(`${a.name} | perioder ${a.periods}/10 | n ${a.n} | P/L ${a.pnl.toFixed(2)} | PF ${v0411FmtPF(a.pf)} | WR ${(a.wr*100).toFixed(1)}% | +perioder ${a.pos}/${a.periods} | värsta DD ${(a.dd*100).toFixed(2)}%`));L.push('','PERIODRESULTAT');for(const w of V0431_WINDOWS)for(const id of ['day','lina16']){const x=V0431_RESULTS.find(q=>q.window===w.n&&q.group===id);if(x)L.push(`#${w.n} ${x.from}→${x.to} | ${id} | n ${x.n} | P/L ${x.pnl.toFixed(2)} | PF ${v0411FmtPF(x.gl?x.gw/x.gl:(x.gw?Infinity:0))} | WR ${x.n?(x.wins/x.n*100).toFixed(1):'0.0'}% | DD ${(x.dd*100).toFixed(2)}%`)}L.push('','OBS: Efter denna körning är dessa perioder förbrukade som orörd valideringsdata för det frysta Day Selection-urvalet.');return L.join('\n')}
async function v0431Share(){return v043xShare(v0431Report(),'linasopti_dayselection2_oos','Linas Opti Day Selection 2','v0431Status')}
function v0451IsIOS(){
 const ua=navigator.userAgent||'';
 return /iPhone|iPad|iPod/i.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
}
function v0451DownloadText(text,name){
 const blob=new Blob([text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
 return true;
}
async function v043xShare(text,prefix,title,statusEl){
 const name=`${prefix}_${new Date().toISOString().slice(0,10)}.txt`;
 const status=(msg)=>{
   let el=statusEl ? document.getElementById(statusEl) : null;
   if(!el) el=document.getElementById(prefix.includes('dayselection1')?'v0430Status':prefix.includes('dayselection2')?'v0431Status':prefix.includes('kapitallab')?'v0450Status':prefix.includes('jagaren')?'v0440Status':null);
   if(el)el.textContent=msg;
 };
 // Desktop (Windows/macOS/Linux): direct browser download -> user's Downloads/Hämtade per browser settings.
 if(!v0451IsIOS()){
   try{v0451DownloadText(text,name);status('✓ Rapport nedladdad till Hämtade/Downloads.');return true}
   catch(e){status('Kunde inte ladda ner rapporten.');return false}
 }
 // iPhone/iPad: native share sheet first.
 const file=new File([text],name,{type:'text/plain;charset=utf-8'});
 try{
   if(navigator.share){
     if(!navigator.canShare||navigator.canShare({files:[file]})){
       await navigator.share({title,text:'Linas Opti rapport',files:[file]});status('✓ Rapport delad.');return true;
     }
     await navigator.share({title,text});status('✓ Rapport delad som text.');return true;
   }
 }catch(e){if(e?.name==='AbortError'){status('Delning avbruten.');return false}}
 // iOS fallback if Web Share is unavailable.
 try{v0451DownloadText(text,name);status('✓ Rapport sparad som textfil.');return true}
 catch(e){status('Kunde inte dela rapporten.');return false}
}
window.addEventListener('DOMContentLoaded',()=>{try{V0430_FROZEN=JSON.parse(localStorage.getItem(V0430_FREEZE_KEY)||'null')}catch{}try{V0430_RESULTS=JSON.parse(localStorage.getItem(V0430_PROGRESS_KEY)||'[]')||[]}catch{}try{V0431_RESULTS=JSON.parse(localStorage.getItem(V0431_PROGRESS_KEY)||'[]')||[]}catch{}v0430Paint();v0431Paint();const d1=v0434DoneWindows(V0430_RESULTS).size,d2=v0434DoneWindows(V0431_RESULTS).size;if(d1&&!V0430_FROZEN){const st=document.getElementById('v0430Status'),bar=document.getElementById('v0430Bar');if(st)st.textContent=`Sparad delkörning ${d1}/10 · tryck Kör för att fortsätta.`;if(bar)bar.style.width=`${d1*10}%`}if(d2){const st=document.getElementById('v0431Status'),bar=document.getElementById('v0431Bar');if(st)st.textContent=`Sparad delkörning ${d2}/10 · tryck Kör för att fortsätta.`;if(bar)bar.style.width=`${d2*10}%`}document.getElementById('v0430Run')?.addEventListener('click',v0430Run);document.getElementById('v0430Share')?.addEventListener('click',v0430Share);document.getElementById('v0431Run')?.addEventListener('click',v0431Run);document.getElementById('v0431Share')?.addEventListener('click',v0431Share);document.getElementById('v0413LabJump')?.addEventListener('change',e=>{const id=e.target.value;if(id==='v0430Lab'||id==='v0431Lab')v0434ScrollLab(id)});});

// ============================================================
// V0.44.0 – JÄGAREN · SAMMANHÄNGANDE PORTFÖLJTEST 2023→NU
// Fryst Day Selection 16 + PRO2-kvalitet + Entry B + Strong + forsknings-exit.
// En position åt gången. Nästa bars open. Friktion 0,0425% per sida.
// Position sizing bevarar PRO2:s 0,6%-riskreferens: 0,5% equity, max 20% equity.
// ============================================================
const V0440_SYMBOLS=['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA'];
let V0440_RESULT=null,V0440_RUNNING=false;
function v0440NY(iso){const a=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(iso)),o={};a.forEach(x=>o[x.type]=x.value);return {d:o.year+'-'+o.month+'-'+o.day,m:(+o.hour)*60+(+o.minute)}}
function v0440Months(){const out=[];let y=2023,m=0;const end=new Date('2026-09-10T00:00:00Z');while(y<2026||(y===2026&&m<=8)){const s=`${y}-${String(m+1).padStart(2,'0')}-01`;let ny=y,nm=m+1;if(nm===12){ny++;nm=0}const e=`${ny}-${String(nm+1).padStart(2,'0')}-01`;out.push({s,e,label:`${y}-${String(m+1).padStart(2,'0')}`});y=ny;m=nm}return out}
async function v0440FetchMonth(w,st){const syms=[...V0440_SYMBOLS,'SPY'];return v0434Retry(()=>bridge(`/bars?symbols=${encodeURIComponent(syms.join(','))}&timeframe=5Min&start=${w.s}&end=${w.e}`),w.label,st)}
function v0440Engine(rows,capital){
 const byDay={},spy={};for(const r of rows){const z=v0440NY(r.t);if(z.m<570||z.m>=960)continue;if(r.symbol==='SPY')(spy[z.d]??=[]).push({...r,_m:z.m});else (byDay[z.d]??={})[r.symbol]??=[],r.symbol!=='SPY'&&byDay[z.d][r.symbol].push({...r,_m:z.m});}
 let eq=capital,peak=capital,dd=0,closed=[],curve=[];const costSide=.000425,maxTradesDay=4;
 for(const d of Object.keys(byDay).sort()){
  let position=null,tradesToday=0;const syms=byDay[d],sp=(spy[d]||[]).sort((a,b)=>new Date(a.t)-new Date(b.t));Object.values(syms).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));
  const timeline=[...new Set(Object.values(syms).flat().map(b=>b.t))].sort((a,b)=>new Date(a)-new Date(b)),idx={};for(const [sym,a] of Object.entries(syms))idx[sym]=new Map(a.map((b,i)=>[b.t,i]));
  for(const ts of timeline){
   if(position){const a=syms[position.s],i=idx[position.s]?.get(ts);if(i!=null){const b=a[i],age=i-position.entryIdx;let raw=null,why='';if(age>0&&b.h>=position.target){raw=position.target;why='mål +0,8%'}else if(age>4&&b.l<=position.stop){raw=position.stop;why='stop −0,4% efter delay'}else if(age>=12){raw=b.c;why='max 60 min'}else if(b._m>=950){raw=b.c;why='stängning 15:50'}if(raw!=null){const exit=raw*(1-costSide),pnl=position.shares*(exit-position.entry);eq+=pnl;closed.push({...position,exitTime:b.t,exit,pnl,why});position=null;tradesToday++;}}}
   if(position||tradesToday>=maxTradesDay)continue;
   const z=v0440NY(ts);if(z.m<630||z.m>720)continue;
   const spPast=sp.filter(x=>new Date(x.t)<=new Date(ts));if(spPast.length<4)continue;const sc=spPast.at(-1),so=spPast[0],s15=spPast[Math.max(0,spPast.length-4)];const dayRet=sc.c/so.o-1,m15=sc.c/s15.c-1;if(dayRet<.001||m15<.0005)continue;
   let cand=[];
   for(const [sym,a] of Object.entries(syms)){const i=idx[sym].get(ts);if(i==null||i<15||i>=a.length-1)continue;const b=a[i],hist=a.slice(i-14,i+1),prev=hist.at(-2),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/14,r1=b.c/prev.c-1,r3=b.c/a[i-3].c-1,r6=b.c/a[i-6].c-1,prev2=prev.c/a[i-2].c-1,range=Math.max(.000001,b.h-b.l),closeLoc=(b.c-b.l)/range,volRatio=avgVol?((+b.v||0)/avgVol):0,sma=hist.reduce((q,x)=>q+x.c,0)/hist.length,stretch=b.c/sma-1;
    if(r3<.004||r3>.012||r1<=0||r6<.0025||b.c<=sma||closeLoc<.86||volRatio<1.15||volRatio>3||stretch>.020||prev2<-.005)continue;
    const sweet=(r3>=.0075&&r3<.0100)?.55:0,volSweet=(volRatio>=2&&volRatio<3)?.25:0,timeBoost=.20,accel=r1-prev2,score=r3*105+r6*35+Math.max(-.01,Math.min(.01,accel))*40+Math.min(volRatio,3)*.12+closeLoc*.12+sweet+volSweet+timeBoost-Math.max(0,stretch-.012)*70;cand.push({sym,i,score});}
   cand.sort((a,b)=>b.score-a.score);const c=cand[0];if(!c)continue;const next=syms[c.sym][c.i+1];if(!next||next._m>=950)continue;const entry=next.o*(1+costSide),shares=Math.min((eq*.20)/entry,(eq*.005)/(entry*.006));if(!(shares>0))continue;position={s:c.sym,symbol:c.sym,entry,entryTime:next.t,entryIdx:c.i+1,shares,stop:entry*(1-.004),target:entry*(1+.008),entryEquity:eq};
  }
  if(position){const a=syms[position.s],b=a.at(-1),exit=b.c*(1-costSide),pnl=position.shares*(exit-position.entry);eq+=pnl;closed.push({...position,exitTime:b.t,exit,pnl,why:'dagsslut'});}
  peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq});
 }
 return {eq,dd,closed,curve};
}
function v0440Paint(){const sum=document.getElementById('v0440Summary'),body=document.getElementById('v0440Rows'),share=document.getElementById('v0440Share');if(!sum||!body)return;if(!V0440_RESULT){sum.textContent='Ingen körning ännu.';body.innerHTML='';if(share)share.disabled=true;return}const r=V0440_RESULT,ret=r.eq/100000-1,w=r.closed.filter(x=>x.pnl>0),l=r.closed.filter(x=>x.pnl<0),gw=w.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(l.reduce((a,x)=>a+x.pnl,0)),pf=gl?gw/gl:(gw?Infinity:0);sum.innerHTML=`<b>100 000 kr → ${Math.round(r.eq).toLocaleString('sv-SE')} kr</b><br>Avkastning ${(ret*100).toFixed(2)}% · PF ${v0411FmtPF(pf)} · ${r.closed.length} affärer · WR ${r.closed.length?(w.length/r.closed.length*100).toFixed(1):'0.0'}% · max DD ${(r.dd*100).toFixed(2)}%`;body.innerHTML=r.years.map(y=>`<tr><td>${y.year}</td><td>${Math.round(y.start).toLocaleString('sv-SE')}</td><td>${Math.round(y.end).toLocaleString('sv-SE')}</td><td class="${y.end>=y.start?'good':'bad'}">${((y.end/y.start-1)*100).toFixed(2)}%</td><td>${y.n}</td></tr>`).join('');if(share)share.disabled=false}
async function v0440Run(){if(V0440_RUNNING)return;V0440_RUNNING=true;const run=document.getElementById('v0440Run'),st=document.getElementById('v0440Status'),bar=document.getElementById('v0440Bar'),months=v0440Months();run.disabled=true;let eq=100000,all=[],curve=[],years=[],yearStart=eq,lastYear=2023,dd=0,globalPeak=eq;try{for(let i=0;i<months.length;i++){const w=months[i];st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label}…`;bar.style.width=`${i/months.length*100}%`;const j=await v0440FetchMonth(w,st),r=v0440Engine(j.rows||[],eq);eq=r.eq;for(const t of r.closed)all.push(t);for(const c of r.curve){globalPeak=Math.max(globalPeak,c.v);dd=Math.min(dd,c.v/globalPeak-1);curve.push(c)}const y=+w.label.slice(0,4),nextY=i===months.length-1?null:+months[i+1].label.slice(0,4);if(nextY!==y){years.push({year:y,start:yearStart,end:eq,n:all.filter(t=>+v0440NY(t.entryTime).d.slice(0,4)===y).length});yearStart=eq;lastYear=nextY}bar.style.width=`${(i+1)/months.length*100}%`;await v0406Yield(20)}V0440_RESULT={eq,dd,closed:all,curve,years,from:'2023-01-01',to:'2026-09-30'};v0413AddSims(1);v0440Paint();st.textContent='✓ Sammanhängande Jägaren-test klart.'}catch(e){st.textContent=`Hämtningen avbröts vid ${st.textContent.replace(/.*hämtar /,'')}. Tryck Kör för att starta om. (${e?.message||e})`}finally{V0440_RUNNING=false;run.disabled=false}}
function v0440Report(){if(!V0440_RESULT)return'';const r=V0440_RESULT,w=r.closed.filter(x=>x.pnl>0),l=r.closed.filter(x=>x.pnl<0),gw=w.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(l.reduce((a,x)=>a+x.pnl,0)),pf=gl?gw/gl:(gw?Infinity:0),L=['LINAS OPTI – JÄGAREN · SAMMANHÄNGANDE PORTFÖLJTEST','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest)','','STARTKAPITAL: 100 000 kr','PERIOD: 2023-01-01 → 2026-09','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','REGLER','PRO2-kvalitet → Entry B → Strong-regim → forsknings-exit.','En position åt gången, max 4 avslut per dag. Nästa bars open.','Position sizing: 0,5% risk mot PRO2:s 0,6%-referens, max 20% equity.','Exit: mål +0,8%, stop -0,4% efter fryst delay, max 60 min.','Modellerad friktion: 0,0425% per sida.','','RESULTAT',`Slutvärde: ${r.eq.toFixed(2)} kr`,`Total avkastning: ${((r.eq/100000-1)*100).toFixed(2)}%`,`Affärer: ${r.closed.length}`,`PF: ${v0411FmtPF(pf)}`,`WR: ${r.closed.length?(w.length/r.closed.length*100).toFixed(1):'0.0'}%`,`Max DD: ${(r.dd*100).toFixed(2)}%`,'','ÅR'];for(const y of r.years)L.push(`${y.year} | ${y.start.toFixed(2)} → ${y.end.toFixed(2)} | ${((y.end/y.start-1)*100).toFixed(2)}% | ${y.n} affärer`);L.push('','OBS: Historiskt backtest är inte en prognos. Day Selection är framtaget och validerat på tidigare historiska perioder; 2023–2026 är därför inte ett nytt orört OOS-prov i sin helhet.');return L.join('\n')}
async function v0440Share(){return v043xShare(v0440Report(),'linasopti_jagaren_2023_nu','Linas Opti Jägaren 2023→nu','v0440Status')}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v0440Run')?.addEventListener('click',v0440Run);document.getElementById('v0440Share')?.addEventListener('click',v0440Share);v0440Paint()});


// V0.44.3 – fixed-header geometry + safe lab scrolling (layout only).
(function v0443FixedHeaderGeometry(){
  const root=document.documentElement;
  function sync(){
    const h=document.querySelector('.sticky-top');
    if(!h)return;
    root.style.setProperty('--v0383-head-h', Math.ceil(h.getBoundingClientRect().height)+'px');
  }
  function safeScrollTo(el){
    if(!el)return;
    sync();
    const h=document.querySelector('.sticky-top');
    const hh=h?Math.ceil(h.getBoundingClientRect().height):0;
    const y=Math.max(0, window.scrollY + el.getBoundingClientRect().top - hh - 12);
    window.scrollTo({top:y,behavior:'smooth'});
  }
  window.v0443SafeScrollTo=safeScrollTo;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
  window.addEventListener('load',sync);
  window.addEventListener('resize',sync);
  if('ResizeObserver' in window){
    const h=document.querySelector('.sticky-top');
    if(h)new ResizeObserver(sync).observe(h);
  }
  const engine=document.getElementById('v0423Engine');
  if(engine)engine.addEventListener('change',()=>requestAnimationFrame(()=>requestAnimationFrame(sync)));
  const lab=document.getElementById('v0413LabJump');
  if(lab)lab.addEventListener('change',()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
    sync(); safeScrollTo(document.getElementById(lab.value));
  })));
})();


// ============================================================
// V0.45.0 – KAPITAL LAB 1
// Samma frysta Jägare som V0.44.0. Endast max antal samtidiga
// positioner ändras: 1 / 2 / 3 / 5. Högst 20% equity per position,
// samma 0,5%-riskreferens, max 4 nya entries per dag och samma friktion.
// Syfte: mäta om kapitalutnyttjande, inte nya signalparametrar, förklarar
// den låga portföljavkastningen i V0.44.0.
// ============================================================
const V0450_VARIANTS=[
 {id:'p1',slots:1,name:'1 position'},
 {id:'p2',slots:2,name:'2 positioner'},
 {id:'p3',slots:3,name:'3 positioner'},
 {id:'p5',slots:5,name:'5 positioner'}
];
let V0450_RESULT=null,V0450_RUNNING=false;

function v0450Engine(rows,capital,maxPositions,maxPositionPct=.20){
 const byDay={},spy={};
 for(const r of rows){
  const z=v0440NY(r.t); if(z.m<570||z.m>=960)continue;
  if(r.symbol==='SPY')(spy[z.d]??=[]).push({...r,_m:z.m});
  else { (byDay[z.d]??={}); (byDay[z.d][r.symbol]??=[]).push({...r,_m:z.m}); }
 }
 let eq=capital,peak=capital,dd=0,closed=[],curve=[],utilSum=0,utilN=0,maxConcurrent=0;
 const costSide=.000425,maxEntriesDay=4;
 for(const d of Object.keys(byDay).sort()){
  let positions=[],entriesToday=0;
  const syms=byDay[d],sp=(spy[d]||[]).sort((a,b)=>new Date(a.t)-new Date(b.t));
  Object.values(syms).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));
  const timeline=[...new Set(Object.values(syms).flat().map(b=>b.t))].sort((a,b)=>new Date(a)-new Date(b));
  const idx={}; for(const [sym,a] of Object.entries(syms))idx[sym]=new Map(a.map((b,i)=>[b.t,i]));

  for(const ts of timeline){
   // Exits först, precis som i den frysta enpositionsmotorn.
   const keep=[];
   for(const position of positions){
    const a=syms[position.s],i=idx[position.s]?.get(ts);
    let exited=false;
    if(i!=null){
     const b=a[i],age=i-position.entryIdx; let raw=null,why='';
     if(age>0&&b.h>=position.target){raw=position.target;why='mål +0,8%'}
     else if(age>4&&b.l<=position.stop){raw=position.stop;why='stop −0,4% efter delay'}
     else if(age>=12){raw=b.c;why='max 60 min'}
     else if(b._m>=950){raw=b.c;why='stängning 15:50'}
     if(raw!=null){
      const exit=raw*(1-costSide),pnl=position.shares*(exit-position.entry); eq+=pnl;
      closed.push({...position,exitTime:b.t,exit,pnl,why}); exited=true;
     }
    }
    if(!exited)keep.push(position);
   }
   positions=keep;

   if(positions.length<maxPositions&&entriesToday<maxEntriesDay){
    const z=v0440NY(ts);
    if(z.m>=630&&z.m<=720){
     const spPast=sp.filter(x=>new Date(x.t)<=new Date(ts));
     if(spPast.length>=4){
      const sc=spPast.at(-1),so=spPast[0],s15=spPast[Math.max(0,spPast.length-4)];
      const dayRet=sc.c/so.o-1,m15=sc.c/s15.c-1;
      if(dayRet>=.001&&m15>=.0005){
       const held=new Set(positions.map(p=>p.s)),cand=[];
       for(const [sym,a] of Object.entries(syms)){
        if(held.has(sym))continue;
        const i=idx[sym].get(ts); if(i==null||i<15||i>=a.length-1)continue;
        const b=a[i],hist=a.slice(i-14,i+1),prev=hist.at(-2),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/14,
          r1=b.c/prev.c-1,r3=b.c/a[i-3].c-1,r6=b.c/a[i-6].c-1,prev2=prev.c/a[i-2].c-1,
          range=Math.max(.000001,b.h-b.l),closeLoc=(b.c-b.l)/range,volRatio=avgVol?((+b.v||0)/avgVol):0,
          sma=hist.reduce((q,x)=>q+x.c,0)/hist.length,stretch=b.c/sma-1;
        if(r3<.004||r3>.012||r1<=0||r6<.0025||b.c<=sma||closeLoc<.86||volRatio<1.15||volRatio>3||stretch>.020||prev2<-.005)continue;
        const sweet=(r3>=.0075&&r3<.0100)?.55:0,volSweet=(volRatio>=2&&volRatio<3)?.25:0,timeBoost=.20,accel=r1-prev2,
          score=r3*105+r6*35+Math.max(-.01,Math.min(.01,accel))*40+Math.min(volRatio,3)*.12+closeLoc*.12+sweet+volSweet+timeBoost-Math.max(0,stretch-.012)*70;
        const next=a[i+1]; if(!next||next._m>=950)continue;
        cand.push({sym,i,score,next});
       }
       cand.sort((a,b)=>b.score-a.score);
       let slots=Math.min(maxPositions-positions.length,maxEntriesDay-entriesToday);
       for(const c of cand){
        if(slots<=0)break;
        const entry=c.next.o*(1+costSide);
        const grossUsed=positions.reduce((q,p)=>q+p.entry*p.shares,0);
        const capitalLeft=Math.max(0,eq-grossUsed);
        const notionalCap=Math.min(eq*maxPositionPct,capitalLeft);
        const shares=Math.min(notionalCap/entry,(eq*.005)/(entry*.006));
        if(!(shares>0))continue;
        positions.push({s:c.sym,symbol:c.sym,entry,entryTime:c.next.t,entryIdx:c.i+1,shares,stop:entry*(1-.004),target:entry*(1+.008),entryEquity:eq});
        entriesToday++; slots--;
       }
      }
     }
    }
   }

   const gross=positions.reduce((q,p)=>q+p.entry*p.shares,0);
   utilSum+=eq>0?Math.min(1,gross/eq):0; utilN++;
   maxConcurrent=Math.max(maxConcurrent,positions.length);
  }

  // Inga positioner får gå över natt.
  for(const position of positions){
   const a=syms[position.s],b=a?.at(-1); if(!b)continue;
   const exit=b.c*(1-costSide),pnl=position.shares*(exit-position.entry); eq+=pnl;
   closed.push({...position,exitTime:b.t,exit,pnl,why:'dagsslut'});
  }
  peak=Math.max(peak,eq); dd=Math.min(dd,eq/peak-1); curve.push({t:d,v:eq});
 }
 return {eq,dd,closed,curve,utilSum,utilN,maxConcurrent};
}

function v0450Stats(r){
 const w=r.closed.filter(x=>x.pnl>0),l=r.closed.filter(x=>x.pnl<0),gw=w.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(l.reduce((a,x)=>a+x.pnl,0));
 return {pf:gl?gw/gl:(gw?Infinity:0),wr:r.closed.length?w.length/r.closed.length:0,ret:r.eq/100000-1,util:r.utilN?r.utilSum/r.utilN:0};
}
function v0450Paint(){
 const sum=document.getElementById('v0450Summary'),body=document.getElementById('v0450Rows'),share=document.getElementById('v0450Share'); if(!sum||!body)return;
 if(!V0450_RESULT){sum.textContent='Ingen körning ännu.';body.innerHTML='';if(share)share.disabled=true;return}
 const ranked=V0450_RESULT.variants.map(v=>({...v,stats:v0450Stats(v)})).sort((a,b)=>b.eq-a.eq),best=ranked[0];
 sum.innerHTML=`<b>Bäst slutvärde: ${best.name} · ${Math.round(best.eq).toLocaleString('sv-SE')} kr</b><br>Detta är ett kapitalutnyttjandetest – inte ny signaloptimering.`;
 body.innerHTML=V0450_RESULT.variants.map(v=>{const s=v0450Stats(v);return `<tr><td>${v.name}</td><td>${Math.round(v.eq).toLocaleString('sv-SE')} kr</td><td class="${s.ret>=0?'good':'bad'}">${(s.ret*100).toFixed(2)}%</td><td>${v0411FmtPF(s.pf)}</td><td>${(s.wr*100).toFixed(1)}%</td><td>${(v.dd*100).toFixed(2)}%</td><td>${v.closed.length}</td><td>${(s.util*100).toFixed(1)}%</td></tr>`}).join('');
 if(share)share.disabled=false;
}
async function v0450Run(){
 if(V0450_RUNNING)return; V0450_RUNNING=true;
 const run=document.getElementById('v0450Run'),st=document.getElementById('v0450Status'),bar=document.getElementById('v0450Bar'),months=v0440Months(); run.disabled=true;
 const states=V0450_VARIANTS.map(v=>({...v,eq:100000,dd:0,peak:100000,closed:[],curve:[],utilSum:0,utilN:0,maxConcurrent:0,years:[],yearStart:100000}));
 try{
  for(let i=0;i<months.length;i++){
   const w=months[i]; st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label} och kör 4 kapitalvarianter…`; bar.style.width=`${i/months.length*100}%`;
   const j=await v0440FetchMonth(w,st),rows=j.rows||[];
   for(const state of states){
    const r=v0450Engine(rows,state.eq,state.slots); state.eq=r.eq; state.utilSum+=r.utilSum; state.utilN+=r.utilN; state.maxConcurrent=Math.max(state.maxConcurrent,r.maxConcurrent);
    for(const t of r.closed)state.closed.push(t); for(const c of r.curve){state.peak=Math.max(state.peak,c.v);state.dd=Math.min(state.dd,c.v/state.peak-1);state.curve.push(c)}
    const y=+w.label.slice(0,4),nextY=i===months.length-1?null:+months[i+1].label.slice(0,4);
    if(nextY!==y){const n=state.closed.filter(t=>+v0440NY(t.entryTime).d.slice(0,4)===y).length;state.years.push({year:y,start:state.yearStart,end:state.eq,n});state.yearStart=state.eq;}
   }
   bar.style.width=`${(i+1)/months.length*100}%`; await v0406Yield(20);
  }
  V0450_RESULT={from:'2023-01-01',to:'2026-09-30',variants:states}; v0413AddSims(4); v0450Paint(); st.textContent='✓ Kapital Lab 1 klart · fyra sammanhängande portföljtester.';
 }catch(e){st.textContent=`Kapital Lab avbröts. Inga simuleringar registrerades som klara. Tryck Kör för att starta om. (${e?.message||e})`}
 finally{V0450_RUNNING=false;run.disabled=false}
}
function v0450Report(){
 if(!V0450_RESULT)return'';
 const L=['LINAS OPTI – KAPITAL LAB 1','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest)','','STARTKAPITAL: 100 000 kr','PERIOD: 2023-01-01 → 2026-09','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','METOD','Samma frysta Jägare som i V0.44.0: PRO2-kvalitet → Entry B → Strong-regim → forsknings-exit.','Endast max antal samtidiga positioner ändras: 1 / 2 / 3 / 5.','Max 20% equity per position, 0,5% risk mot 0,6%-referens, max 4 nya entries per dag.','Exit och friktion oförändrade: mål +0,8%, stop -0,4% efter fryst delay, max 60 min, 0,0425% per sida.','Ingen ny signalparameter optimeras.','','RESULTAT'];
 for(const v of V0450_RESULT.variants){const s=v0450Stats(v);L.push(`${v.name} | slut ${v.eq.toFixed(2)} kr | avkastning ${(s.ret*100).toFixed(2)}% | affärer ${v.closed.length} | PF ${v0411FmtPF(s.pf)} | WR ${(s.wr*100).toFixed(1)}% | max DD ${(v.dd*100).toFixed(2)}% | snitt kapital i arbete ${(s.util*100).toFixed(1)}% | max samtidiga ${v.maxConcurrent}`)}
 L.push('','ÅRSRESULTAT'); for(const v of V0450_RESULT.variants){L.push('',v.name.toUpperCase());for(const y of v.years)L.push(`${y.year} | ${y.start.toFixed(2)} → ${y.end.toFixed(2)} | ${((y.end/y.start-1)*100).toFixed(2)}% | ${y.n} affärer`)}
 L.push('','OBS: 2023–2026 är inte ett nytt orört OOS-prov i sin helhet. Kapital Lab testar portfölj- och kapitalutnyttjande med frysta signalregler; det är inte en prognos.'); return L.join('\n');
}
async function v0450Share(){return v043xShare(v0450Report(),'LINAS_OPTI_KAPITAL_LAB_1_V0453','Linas Opti Kapital Lab 1','v0450Status')}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v0450Run')?.addEventListener('click',v0450Run);document.getElementById('v0450Share')?.addEventListener('click',v0450Share);v0450Paint()});


// ============================================================
// V0.45.2 – KAPITAL LAB 2 · POSITIONSSTORLEK
// Fryst kandidat från Kapital Lab 1: max 3 samtidiga positioner.
// Endast max position per affär ändras: 10 / 20 / 30 / 33,3 % equity.
// Signal-, regime-, exit-, riskreferens- och friktionslogik är oförändrad.
// ============================================================
const V0452_VARIANTS=[
 {id:'s10',pct:.10,name:'10% per position'},
 {id:'s20',pct:.20,name:'20% per position'},
 {id:'s30',pct:.30,name:'30% per position'},
 {id:'s33',pct:1/3,name:'33,3% per position'}
];
let V0452_RESULT=null,V0452_RUNNING=false;
const V0456_KL2_CHECKPOINT_KEY='linasopti_kapitallab2_checkpoint_v0456';

function v0452Stats(r){return v0450Stats(r)}
function v0456FreshKL2States(){
 return V0452_VARIANTS.map(v=>({...v,eq:100000,dd:0,peak:100000,closed:[],curve:[],utilSum:0,utilN:0,maxConcurrent:0,years:[],yearStart:100000}));
}
function v0456SaveKL2Checkpoint(nextIndex,states){
 try{localStorage.setItem(V0456_KL2_CHECKPOINT_KEY,JSON.stringify({version:'V0.45.6',nextIndex,states,savedAt:new Date().toISOString()}));return true}catch{return false}
}
function v0456LoadKL2Checkpoint(){
 try{
  const x=JSON.parse(localStorage.getItem(V0456_KL2_CHECKPOINT_KEY)||'null');
  if(!x||x.version!=='V0.45.6'||!Number.isInteger(x.nextIndex)||!Array.isArray(x.states)||x.states.length!==V0452_VARIANTS.length)return null;
  return x;
 }catch{return null}
}
function v0456ClearKL2Checkpoint(){try{localStorage.removeItem(V0456_KL2_CHECKPOINT_KEY)}catch{}}
function v0456SetKL2RunLabel(hasCheckpoint=false){
 const run=document.getElementById('v0452Run'); if(!run)return;
 run.textContent=hasCheckpoint?'▶ Fortsätt Kapital Lab 2 från sparad punkt':'▶ Kör Kapital Lab 2 · 10 / 20 / 30 / 33,3%';
}
function v0452Paint(){
 const sum=document.getElementById('v0452Summary'),body=document.getElementById('v0452Rows'),share=document.getElementById('v0452Share'); if(!sum||!body)return;
 if(!V0452_RESULT){sum.textContent='Ingen körning ännu.';body.innerHTML='';if(share)share.disabled=true;return}
 const ranked=V0452_RESULT.variants.map(v=>({...v,stats:v0452Stats(v)})).sort((a,b)=>b.eq-a.eq),best=ranked[0];
 sum.innerHTML=`<b>Bäst slutvärde: ${best.name} · ${Math.round(best.eq).toLocaleString('sv-SE')} kr</b><br>Tre samtidiga positioner är frysta från Kapital Lab 1. Endast positionsstorleken ändras.`;
 body.innerHTML=V0452_RESULT.variants.map(v=>{const s=v0452Stats(v);return `<tr><td>${v.name}</td><td>${Math.round(v.eq).toLocaleString('sv-SE')} kr</td><td class="${s.ret>=0?'good':'bad'}">${(s.ret*100).toFixed(2)}%</td><td>${v0411FmtPF(s.pf)}</td><td>${(s.wr*100).toFixed(1)}%</td><td>${(v.dd*100).toFixed(2)}%</td><td>${v.closed.length}</td><td>${(s.util*100).toFixed(1)}%</td></tr>`}).join('');
 if(share)share.disabled=false;
}
async function v0452Run(){
 if(V0452_RUNNING)return; V0452_RUNNING=true;
 const run=document.getElementById('v0452Run'),st=document.getElementById('v0452Status'),bar=document.getElementById('v0452Bar'),months=v0440Months(); run.disabled=true;
 const saved=v0456LoadKL2Checkpoint();
 let startIndex=saved?Math.max(0,Math.min(months.length,saved.nextIndex)):0;
 let states=saved?saved.states:v0456FreshKL2States();
 if(startIndex>=months.length){v0456ClearKL2Checkpoint();startIndex=0;states=v0456FreshKL2States()}
 try{
  if(saved&&startIndex>0){
   st.textContent=`Återupptar Kapital Lab 2 från ${startIndex}/${months.length} färdiga månader…`;
   bar.style.width=`${startIndex/months.length*100}%`;
  }
  for(let i=startIndex;i<months.length;i++){
   const w=months[i]; st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label} och kör 4 storleksvarianter…`; bar.style.width=`${i/months.length*100}%`;
   const j=await v0440FetchMonth(w,st),rows=j.rows||[];
   for(const state of states){
    const r=v0450Engine(rows,state.eq,3,state.pct); state.eq=r.eq; state.utilSum+=r.utilSum; state.utilN+=r.utilN; state.maxConcurrent=Math.max(state.maxConcurrent,r.maxConcurrent);
    for(const t of r.closed)state.closed.push(t); for(const c of r.curve){state.peak=Math.max(state.peak,c.v);state.dd=Math.min(state.dd,c.v/state.peak-1);state.curve.push(c)}
    const y=+w.label.slice(0,4),nextY=i===months.length-1?null:+months[i+1].label.slice(0,4);
    if(nextY!==y){const n=state.closed.filter(t=>+v0440NY(t.entryTime).d.slice(0,4)===y).length;state.years.push({year:y,start:state.yearStart,end:state.eq,n});state.yearStart=state.eq;}
   }
   // Checkpoint först när hela månaden + alla fyra varianter är färdiga.
   v0456SaveKL2Checkpoint(i+1,states);
   bar.style.width=`${(i+1)/months.length*100}%`; await v0406Yield(20);
  }
  V0452_RESULT={from:'2023-01-01',to:'2026-09-30',variants:states};
  v0413AddSims(4); v0456ClearKL2Checkpoint(); v0452Paint(); v0456SetKL2RunLabel(false);
  st.textContent='✓ Kapital Lab 2 klart · fyra positionsstorlekar testade med tre samtidiga positioner.';
 }catch(e){
  const cp=v0456LoadKL2Checkpoint(),done=cp?.nextIndex||startIndex;
  if(bar)bar.style.width=`${done/months.length*100}%`;
  v0456SetKL2RunLabel(done>0);
  st.textContent=`Kapital Lab 2 avbröts efter ${done}/${months.length} färdiga månader. Delkörningen är sparad. Tryck Fortsätt för att återuppta. (${e?.message||e})`;
 }finally{V0452_RUNNING=false;run.disabled=false}
}
function v0452Report(){
 if(!V0452_RESULT)return'';
 const L=['LINAS OPTI – KAPITAL LAB 2 · POSITIONSSTORLEK','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest)','','STARTKAPITAL: 100 000 kr','PERIOD: 2023-01-01 → 2026-09','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','METOD','Kapital Lab 1 pekade ut 3 samtidiga positioner som forskningskandidat. Den är fryst här.','Endast max positionsstorlek ändras: 10% / 20% / 30% / 33,3% av equity.','Samma frysta Jägare: PRO2-kvalitet → Entry B → Strong-regim → forsknings-exit.','0,5% risk mot 0,6%-referens, max 4 nya entries per dag.','Exit och friktion oförändrade: mål +0,8%, stop -0,4% efter fryst delay, max 60 min, 0,0425% per sida.','Ingen signalparameter optimeras.','','RESULTAT'];
 for(const v of V0452_RESULT.variants){const s=v0452Stats(v);L.push(`${v.name} | slut ${v.eq.toFixed(2)} kr | avkastning ${(s.ret*100).toFixed(2)}% | affärer ${v.closed.length} | PF ${v0411FmtPF(s.pf)} | WR ${(s.wr*100).toFixed(1)}% | max DD ${(v.dd*100).toFixed(2)}% | snitt kapital i arbete ${(s.util*100).toFixed(1)}% | max samtidiga ${v.maxConcurrent}`)}
 L.push('','ÅRSRESULTAT'); for(const v of V0452_RESULT.variants){L.push('',v.name.toUpperCase());for(const y of v.years)L.push(`${y.year} | ${y.start.toFixed(2)} → ${y.end.toFixed(2)} | ${((y.end/y.start-1)*100).toFixed(2)}% | ${y.n} affärer`)}
 L.push('','OBS: 2023–2026 är inte ett nytt orört OOS-prov i sin helhet. Kapital Lab 2 testar positionsstorlek med frysta signalregler; det är inte en prognos.'); return L.join('\n');
}
async function v0454KapitalLab2Download(){
 const st=document.getElementById('v0452Status');
 if(!V0452_RESULT){if(st)st.textContent='Ingen Kapital Lab 2-rapport finns ännu. Kör labbet först.';return false}
 const text=v0452Report();
 // Hård säkerhetskontroll: Lab 2-knappen får aldrig exportera Lab 1-innehåll.
 if(!text.startsWith('LINAS OPTI – KAPITAL LAB 2 · POSITIONSSTORLEK') || !text.includes('10% / 20% / 30% / 33,3%')){
   if(st)st.textContent='Rapportspärr: fel rapportinnehåll upptäcktes. Ingen fil skapades.';return false;
 }
 const date=new Date().toISOString().slice(0,10);
 const name=`LINAS_OPTI_KAPITAL_LAB_2_POSITIONSSTORLEK_V0456_${date}.txt`;
 if(!v0451IsIOS()){
   try{v0451DownloadText(text,name);if(st)st.textContent=`✓ Kapital Lab 2-rapport nedladdad: ${name}`;return true}
   catch(e){if(st)st.textContent='Kunde inte ladda ner Kapital Lab 2-rapporten.';return false}
 }
 const file=new File([text],name,{type:'text/plain;charset=utf-8'});
 try{
   if(navigator.share){
     if(!navigator.canShare||navigator.canShare({files:[file]})){await navigator.share({title:'Linas Opti Kapital Lab 2',files:[file]});if(st)st.textContent='✓ Kapital Lab 2-rapport delad.';return true}
     await navigator.share({title:'Linas Opti Kapital Lab 2',text});if(st)st.textContent='✓ Kapital Lab 2-rapport delad som text.';return true
   }
 }catch(e){if(e?.name==='AbortError'){if(st)st.textContent='Delning avbruten.';return false}}
 try{v0451DownloadText(text,name);if(st)st.textContent=`✓ Kapital Lab 2-rapport sparad: ${name}`;return true}
 catch(e){if(st)st.textContent='Kunde inte spara Kapital Lab 2-rapporten.';return false}
}
window.addEventListener('DOMContentLoaded',()=>{
 const run=document.getElementById('v0452Run'),share=document.getElementById('v0452Share');
 run?.addEventListener('click',v0452Run);
 // Hård isolering från äldre rapportkopplingar: ersätt knappen med en ren klon.
 if(share){const clean=share.cloneNode(true);share.replaceWith(clean);clean.addEventListener('click',v0454KapitalLab2Download)}
 v0452Paint();
 const cp=v0456LoadKL2Checkpoint();
 if(cp&&cp.nextIndex>0){
   const st=document.getElementById('v0452Status'),bar=document.getElementById('v0452Bar'),months=v0440Months();
   if(st)st.textContent=`Sparad delkörning ${cp.nextIndex}/${months.length} månader · tryck Fortsätt för att återuppta.`;
   if(bar)bar.style.width=`${cp.nextIndex/months.length*100}%`;
   v0456SetKL2RunLabel(true);
 }else v0456SetKL2RunLabel(false);
});


// ============================================================
// V0.45.7 – KAPITAL LAB 3 · KAPITALUTNYTTJANDE
// Ren diagnostik på fryst Kapital Lab 2-kandidat: max 3 samtidiga
// positioner och max 33,3% equity per position. Samma Jägare, risk,
// entry, Strong-regim, exit och friktion. Inga signalparametrar ändras.
// ============================================================
let V0457_RESULT=null,V0457_RUNNING=false;
const V0457_CHECKPOINT_KEY='linasopti_kapitallab3_checkpoint_v0457';
function v0457Fresh(){return {eq:100000,peak:100000,dd:0,closed:[],occ:[0,0,0,0],samples:0,utilSum:0,utilN:0,maxConcurrent:0,entryPctSum:0,entryPctN:0,signalCandidates:0,blockedSlots:0,blockedDailyCap:0,days:0,daysWithPosition:0,daysHit4:0,entries:0}}
function v0457Save(nextIndex,state){try{localStorage.setItem(V0457_CHECKPOINT_KEY,JSON.stringify({version:'V0.45.7',nextIndex,state,savedAt:new Date().toISOString()}));return true}catch{return false}}
function v0457Load(){try{const x=JSON.parse(localStorage.getItem(V0457_CHECKPOINT_KEY)||'null');return x&&x.version==='V0.45.7'&&Number.isInteger(x.nextIndex)&&x.state?x:null}catch{return null}}
function v0457Clear(){try{localStorage.removeItem(V0457_CHECKPOINT_KEY)}catch{}}
function v0457RunLabel(cp=false){const b=document.getElementById('v0457Run');if(b)b.textContent=cp?'▶ Fortsätt Kapital Lab 3 från sparad punkt':'▶ Kör Kapital Lab 3 · diagnostik'}
function v0457Engine(rows,capital){
 const byDay={},spy={};
 for(const r of rows){const z=v0440NY(r.t);if(z.m<570||z.m>=960)continue;if(r.symbol==='SPY')(spy[z.d]??=[]).push({...r,_m:z.m});else{(byDay[z.d]??={});(byDay[z.d][r.symbol]??=[]).push({...r,_m:z.m})}}
 let eq=capital,peak=capital,dd=0,closed=[],curve=[],occ=[0,0,0,0],samples=0,utilSum=0,utilN=0,maxConcurrent=0,entryPctSum=0,entryPctN=0,signalCandidates=0,blockedSlots=0,blockedDailyCap=0,days=0,daysWithPosition=0,daysHit4=0,entries=0;
 const costSide=.000425,maxEntriesDay=4,maxPositions=3,maxPositionPct=1/3;
 for(const d of Object.keys(byDay).sort()){
  days++;let positions=[],entriesToday=0,hadPosition=false;
  const syms=byDay[d],sp=(spy[d]||[]).sort((a,b)=>new Date(a.t)-new Date(b.t));Object.values(syms).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));
  const timeline=[...new Set(Object.values(syms).flat().map(b=>b.t))].sort((a,b)=>new Date(a)-new Date(b));const idx={};for(const [sym,a] of Object.entries(syms))idx[sym]=new Map(a.map((b,i)=>[b.t,i]));
  for(const ts of timeline){
   const keep=[];
   for(const position of positions){const a=syms[position.s],i=idx[position.s]?.get(ts);let exited=false;if(i!=null){const b=a[i],age=i-position.entryIdx;let raw=null,why='';if(age>0&&b.h>=position.target){raw=position.target;why='mål +0,8%'}else if(age>4&&b.l<=position.stop){raw=position.stop;why='stop −0,4% efter delay'}else if(age>=12){raw=b.c;why='max 60 min'}else if(b._m>=950){raw=b.c;why='stängning 15:50'}if(raw!=null){const exit=raw*(1-costSide),pnl=position.shares*(exit-position.entry);eq+=pnl;closed.push({...position,exitTime:b.t,exit,pnl,why});exited=true}}if(!exited)keep.push(position)}
   positions=keep;
   const z=v0440NY(ts);let cand=[];
   if(z.m>=630&&z.m<=720){const spPast=sp.filter(x=>new Date(x.t)<=new Date(ts));if(spPast.length>=4){const sc=spPast.at(-1),so=spPast[0],s15=spPast[Math.max(0,spPast.length-4)],dayRet=sc.c/so.o-1,m15=sc.c/s15.c-1;if(dayRet>=.001&&m15>=.0005){const held=new Set(positions.map(p=>p.s));for(const [sym,a] of Object.entries(syms)){if(held.has(sym))continue;const i=idx[sym].get(ts);if(i==null||i<15||i>=a.length-1)continue;const b=a[i],hist=a.slice(i-14,i+1),prev=hist.at(-2),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/14,r1=b.c/prev.c-1,r3=b.c/a[i-3].c-1,r6=b.c/a[i-6].c-1,prev2=prev.c/a[i-2].c-1,range=Math.max(.000001,b.h-b.l),closeLoc=(b.c-b.l)/range,volRatio=avgVol?((+b.v||0)/avgVol):0,sma=hist.reduce((q,x)=>q+x.c,0)/hist.length,stretch=b.c/sma-1;if(r3<.004||r3>.012||r1<=0||r6<.0025||b.c<=sma||closeLoc<.86||volRatio<1.15||volRatio>3||stretch>.020||prev2<-.005)continue;const sweet=(r3>=.0075&&r3<.0100)?.55:0,volSweet=(volRatio>=2&&volRatio<3)?.25:0,timeBoost=.20,accel=r1-prev2,score=r3*105+r6*35+Math.max(-.01,Math.min(.01,accel))*40+Math.min(volRatio,3)*.12+closeLoc*.12+sweet+volSweet+timeBoost-Math.max(0,stretch-.012)*70,next=a[i+1];if(!next||next._m>=950)continue;cand.push({sym,i,score,next})}cand.sort((a,b)=>b.score-a.score)}}}
   signalCandidates+=cand.length;
   if(cand.length){if(entriesToday>=maxEntriesDay)blockedDailyCap+=cand.length;else if(positions.length>=maxPositions)blockedSlots+=cand.length}
   if(positions.length<maxPositions&&entriesToday<maxEntriesDay&&cand.length){let slots=Math.min(maxPositions-positions.length,maxEntriesDay-entriesToday);if(cand.length>slots)blockedSlots+=cand.length-slots;for(const c of cand){if(slots<=0)break;const entry=c.next.o*(1+costSide),grossUsed=positions.reduce((q,p)=>q+p.entry*p.shares,0),capitalLeft=Math.max(0,eq-grossUsed),notionalCap=Math.min(eq*maxPositionPct,capitalLeft),shares=Math.min(notionalCap/entry,(eq*.005)/(entry*.006));if(!(shares>0))continue;const pct=eq>0?(entry*shares/eq):0;entryPctSum+=pct;entryPctN++;positions.push({s:c.sym,symbol:c.sym,entry,entryTime:c.next.t,entryIdx:c.i+1,shares,stop:entry*(1-.004),target:entry*(1+.008),entryEquity:eq});entriesToday++;entries++;slots--}}
   const n=Math.min(3,positions.length);occ[n]++;samples++;if(n>0)hadPosition=true;const gross=positions.reduce((q,p)=>q+p.entry*p.shares,0);utilSum+=eq>0?Math.min(1,gross/eq):0;utilN++;maxConcurrent=Math.max(maxConcurrent,n);
  }
  if(entriesToday>=4)daysHit4++;if(hadPosition)daysWithPosition++;
  for(const position of positions){const a=syms[position.s],b=a?.at(-1);if(!b)continue;const exit=b.c*(1-costSide),pnl=position.shares*(exit-position.entry);eq+=pnl;closed.push({...position,exitTime:b.t,exit,pnl,why:'dagsslut'})}
  peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq});
 }
 return {eq,dd,closed,curve,occ,samples,utilSum,utilN,maxConcurrent,entryPctSum,entryPctN,signalCandidates,blockedSlots,blockedDailyCap,days,daysWithPosition,daysHit4,entries};
}
function v0457Merge(a,r){a.eq=r.eq;for(const c of (r.curve||[])){a.peak=Math.max(a.peak,c.v);a.dd=Math.min(a.dd,c.v/a.peak-1)}a.closed.push(...r.closed);for(let i=0;i<4;i++)a.occ[i]+=r.occ[i];a.samples+=r.samples;a.utilSum+=r.utilSum;a.utilN+=r.utilN;a.maxConcurrent=Math.max(a.maxConcurrent,r.maxConcurrent);a.entryPctSum+=r.entryPctSum;a.entryPctN+=r.entryPctN;a.signalCandidates+=r.signalCandidates;a.blockedSlots+=r.blockedSlots;a.blockedDailyCap+=r.blockedDailyCap;a.days+=r.days;a.daysWithPosition+=r.daysWithPosition;a.daysHit4+=r.daysHit4;a.entries+=r.entries;return a}
function v0457Metrics(r){const hold=r.closed.length?r.closed.reduce((q,t)=>q+Math.max(0,(new Date(t.exitTime)-new Date(t.entryTime))/60000),0)/r.closed.length:0;return {util:r.utilN?r.utilSum/r.utilN:0,entryPct:r.entryPctN?r.entryPctSum/r.entryPctN:0,hold,market:r.samples?1-r.occ[0]/r.samples:0}}
function v0457Paint(){const sum=document.getElementById('v0457Summary'),body=document.getElementById('v0457Rows'),share=document.getElementById('v0457Share');if(!sum||!body)return;if(!V0457_RESULT){sum.textContent='Ingen körning ännu.';body.innerHTML='';if(share)share.disabled=true;return}const r=V0457_RESULT,m=v0457Metrics(r),pct=n=>r.samples?(n/r.samples*100).toFixed(1)+'%':'0,0%';sum.innerHTML=`<b>${Math.round(r.eq).toLocaleString('sv-SE')} kr · ${r.closed.length} affärer</b><br>Kapital i arbete ${(m.util*100).toFixed(1)}% · någon position ${pct(r.samples-r.occ[0])} av observerade 5-min-tidpunkter.`;const rows=[['0 öppna positioner',pct(r.occ[0])],['1 öppen position',pct(r.occ[1])],['2 öppna positioner',pct(r.occ[2])],['3 öppna positioner',pct(r.occ[3])],['Snitt kapital i arbete',(m.util*100).toFixed(2)+'%'],['Snitt faktisk positionsstorlek',(m.entryPct*100).toFixed(2)+'% av equity'],['Snitt hålltid',m.hold.toFixed(1)+' min'],['Godkända signalkandidater',r.signalCandidates.toLocaleString('sv-SE')],['Blockerade av 3-positionersgräns',r.blockedSlots.toLocaleString('sv-SE')],['Blockerade av 4 entries/dag',r.blockedDailyCap.toLocaleString('sv-SE')],['Dagar med någon position',`${r.daysWithPosition}/${r.days} (${r.days?(r.daysWithPosition/r.days*100).toFixed(1):'0.0'}%)`],['Dagar som nådde 4 entries',`${r.daysHit4}/${r.days} (${r.days?(r.daysHit4/r.days*100).toFixed(1):'0.0'}%)`],['Max samtidiga',String(r.maxConcurrent)]];body.innerHTML=rows.map(x=>`<tr><td>${x[0]}</td><td><b>${x[1]}</b></td></tr>`).join('');if(share)share.disabled=false}
async function v0457Run(){if(V0457_RUNNING)return;V0457_RUNNING=true;const run=document.getElementById('v0457Run'),st=document.getElementById('v0457Status'),bar=document.getElementById('v0457Bar'),months=v0440Months();run.disabled=true;const saved=v0457Load();let start=saved?Math.max(0,Math.min(months.length,saved.nextIndex)):0,state=saved?saved.state:v0457Fresh();if(start>=months.length){v0457Clear();start=0;state=v0457Fresh()}try{if(saved&&start>0){st.textContent=`Återupptar Kapital Lab 3 från ${start}/${months.length} färdiga månader…`;bar.style.width=`${start/months.length*100}%`}for(let i=start;i<months.length;i++){const w=months[i];st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label} och mäter kapitalflödet…`;bar.style.width=`${i/months.length*100}%`;const j=await v0440FetchMonth(w,st),r=v0457Engine(j.rows||[],state.eq);v0457Merge(state,r);v0457Save(i+1,state);bar.style.width=`${(i+1)/months.length*100}%`;await v0406Yield(20)}V0457_RESULT=state;v0413AddSims(1);v0457Clear();v0457Paint();v0457RunLabel(false);st.textContent='✓ Kapital Lab 3 klart · kapitalutnyttjandet är kartlagt.'}catch(e){const cp=v0457Load(),done=cp?.nextIndex||start;bar.style.width=`${done/months.length*100}%`;v0457RunLabel(done>0);st.textContent=`Kapital Lab 3 avbröts efter ${done}/${months.length} färdiga månader. Delkörningen är sparad. Tryck Fortsätt för att återuppta. (${e?.message||e})`}finally{V0457_RUNNING=false;run.disabled=false}}
function v0457Report(){if(!V0457_RESULT)return'';const r=V0457_RESULT,m=v0457Metrics(r),pct=n=>r.samples?(n/r.samples*100).toFixed(2):'0.00',L=['LINAS OPTI – KAPITAL LAB 3 · KAPITALUTNYTTJANDE','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest)','','STARTKAPITAL: 100 000 kr','PERIOD: 2023-01-01 → 2026-09','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','METOD','Kapital Lab 1: 3 samtidiga positioner är frysta.','Kapital Lab 2: 33,3% max per position används som diagnostisk kandidat.','Samma frysta Jägare: PRO2-kvalitet → Entry B → Strong-regim → forsknings-exit.','0,5% risk mot 0,6%-referens, max 4 nya entries per dag.','Exit/friktion oförändrade. Ingen signalparameter optimeras.','Mätningen räknar observerade 5-min-tidpunkter och godkända entrykandidater; blockerade kandidater är diagnostik, inte hypotetiska affärer.','','RESULTAT',`Slutvärde: ${r.eq.toFixed(2)} kr`,`Affärer: ${r.closed.length}`,`Max DD: ${(r.dd*100).toFixed(2)}%`,`Snitt kapital i arbete: ${(m.util*100).toFixed(2)}%`,`Någon position öppen: ${pct(r.samples-r.occ[0])}% av observerade 5-min-tidpunkter`,`0 positioner: ${pct(r.occ[0])}%`,`1 position: ${pct(r.occ[1])}%`,`2 positioner: ${pct(r.occ[2])}%`,`3 positioner: ${pct(r.occ[3])}%`,`Snitt faktisk positionsstorlek: ${(m.entryPct*100).toFixed(2)}% av equity`,`Snitt hålltid: ${m.hold.toFixed(1)} min`,`Godkända signalkandidater: ${r.signalCandidates}`,`Blockerade av 3-positionersgräns: ${r.blockedSlots}`,`Blockerade av 4 entries/dag: ${r.blockedDailyCap}`,`Dagar med någon position: ${r.daysWithPosition}/${r.days} (${r.days?(r.daysWithPosition/r.days*100).toFixed(1):'0.0'}%)`,`Dagar som nådde 4 entries: ${r.daysHit4}/${r.days} (${r.days?(r.daysHit4/r.days*100).toFixed(1):'0.0'}%)`,`Max samtidiga: ${r.maxConcurrent}`,'','TOLKNINGSHJÄLP','Om 3-positionersgränsen eller 4-entriesgränsen blockerar många kandidater finns en kapital-/kapacitetsflaskhals.','Om blockeringarna är få och 0-positioner dominerar ligger flaskhalsen främst i signalflödet, inte i tillåtet antal positioner.','','OBS: 2023–2026 är inte ett nytt orört OOS-prov i sin helhet. Kapital Lab 3 är diagnostik på frysta regler; det är inte en prognos.'];return L.join('\n')}
async function v0457Share(){const st=document.getElementById('v0457Status');if(!V0457_RESULT){if(st)st.textContent='Ingen Kapital Lab 3-rapport finns ännu. Kör labbet först.';return false}const text=v0457Report(),date=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_KAPITAL_LAB_3_KAPITALUTNYTTJANDE_V0457_${date}.txt`;if(!v0451IsIOS()){try{v0451DownloadText(text,name);if(st)st.textContent=`✓ Kapital Lab 3-rapport nedladdad: ${name}`;return true}catch(e){if(st)st.textContent='Kunde inte ladda ner Kapital Lab 3-rapporten.';return false}}const file=new File([text],name,{type:'text/plain;charset=utf-8'});try{if(navigator.share){if(!navigator.canShare||navigator.canShare({files:[file]})){await navigator.share({title:'Linas Opti Kapital Lab 3',files:[file]});return true}await navigator.share({title:'Linas Opti Kapital Lab 3',text});return true}}catch(e){if(e?.name==='AbortError')return false}try{v0451DownloadText(text,name);return true}catch{return false}}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v0457Run')?.addEventListener('click',v0457Run);document.getElementById('v0457Share')?.addEventListener('click',v0457Share);v0457Paint();const cp=v0457Load();if(cp&&cp.nextIndex>0){const st=document.getElementById('v0457Status'),bar=document.getElementById('v0457Bar'),months=v0440Months();if(st)st.textContent=`Sparad delkörning ${cp.nextIndex}/${months.length} månader · tryck Fortsätt för att återuppta.`;if(bar)bar.style.width=`${cp.nextIndex/months.length*100}%`;v0457RunLabel(true)}});


// ============================================================
// V0.45.9 – SIGNAL LAB 2 · ENTRY B-DISSEKTION
// Diagnostik på observationer som klarat fryst PRO2-kvalitet.
// Entry B ändras inte. Fem delvillkor mäts separat/sekventiellt,
// inklusive överlapp och deskriptiv +15/+30/+60 min framåtrörelse.
// ============================================================
let V0459_RESULT=null,V0459_RUNNING=false;
const V0459_CHECKPOINT_KEY='linasopti_signallab2_checkpoint_v04510';
const V0459_CONDS=[
 {id:'m3min',name:'m3 ≥ 0,40%',ok:x=>x.r3>=.004},
 {id:'m3max',name:'m3 ≤ 1,20%',ok:x=>x.r3<=.012},
 {id:'close',name:'close ≥ 86%',ok:x=>x.closeLoc>=.86},
 {id:'volmin',name:'volym ≥ 1,15×',ok:x=>x.volRatio>=1.15},
 {id:'volmax',name:'volym ≤ 3,00×',ok:x=>x.volRatio<=3}
];
function v0459Stat(){return {n:0,r15n:0,r15s:0,r15p:0,r30n:0,r30s:0,r30p:0,r60n:0,r60s:0,r60p:0}}
function v0459Fresh(){const c={};for(const x of V0459_CONDS)c[x.id]={pass:v0459Stat(),fail:v0459Stat()};return {pro2:0,seq:[0,0,0,0,0,0],conds:c,masks:{},months:0}}
function v0459AddStat(s,f){s.n++;for(const [k,v] of [['15',f.r15],['30',f.r30],['60',f.r60]])if(Number.isFinite(v)){s['r'+k+'n']++;s['r'+k+'s']+=v;if(v>0)s['r'+k+'p']++}}
function v0459Future(a,i,b){const ret=n=>{const q=a[i+n];return q&&q._m<960&&q._m>b._m?q.c/b.c-1:null};return {r15:ret(3),r30:ret(6),r60:ret(12)}}
function v0459Analyze(rows){
 const byDay={};for(const r of rows){const z=v0440NY(r.t);if(z.m<570||z.m>=960||r.symbol==='SPY')continue;(byDay[z.d]??={});(byDay[z.d][r.symbol]??=[]).push({...r,_m:z.m})}
 const out=v0459Fresh();
 for(const d of Object.keys(byDay).sort())for(const [sym,a0] of Object.entries(byDay[d])){const a=a0.sort((x,y)=>new Date(x.t)-new Date(y.t));for(let i=15;i<a.length-1;i++){
   const b=a[i];if(b._m<630||b._m>720)continue;const hist=a.slice(i-14,i+1),prev=hist.at(-2),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/14;
   const x={r1:b.c/prev.c-1,r3:b.c/a[i-3].c-1,r6:b.c/a[i-6].c-1,prev2:prev.c/a[i-2].c-1,closeLoc:(b.c-b.l)/Math.max(.000001,b.h-b.l),volRatio:avgVol?((+b.v||0)/avgVol):0,sma:hist.reduce((q,z)=>q+z.c,0)/hist.length};x.stretch=b.c/x.sma-1;
   const pro2=x.r1>0&&x.r6>=.0025&&b.c>x.sma&&x.stretch<=.020&&x.prev2>=-.005;if(!pro2)continue;
   out.pro2++;out.seq[0]++;const f=v0459Future(a,i,b);let still=true,mask=[];
   V0459_CONDS.forEach((c,j)=>{const pass=c.ok(x);v0459AddStat(out.conds[c.id][pass?'pass':'fail'],f);if(!pass)mask.push(c.id);if(still&&pass)out.seq[j+1]++;else still=false});
   const key=mask.length?mask.join('+'):'PASS_ALL';out.masks[key]=(out.masks[key]||0)+1;
 }}
 return out;
}
function v0459Merge(a,b){a.pro2+=b.pro2;for(let i=0;i<a.seq.length;i++)a.seq[i]+=b.seq[i]||0;for(const c of V0459_CONDS)for(const side of ['pass','fail']){const A=a.conds[c.id][side],B=b.conds[c.id][side];for(const k of Object.keys(A))A[k]+=B[k]||0}for(const [k,v] of Object.entries(b.masks||{}))a.masks[k]=(a.masks[k]||0)+v;a.months++;return a}
function v0459Save(nextIndex,state){try{localStorage.setItem(V0459_CHECKPOINT_KEY,JSON.stringify({version:'V0.45.9',nextIndex,state,savedAt:new Date().toISOString()}));return true}catch{return false}}
function v0459Load(){try{const x=JSON.parse(localStorage.getItem(V0459_CHECKPOINT_KEY)||'null');return x&&x.version==='V0.45.9'&&Number.isInteger(x.nextIndex)&&x.state?x:null}catch{return null}}
function v0459Clear(){try{localStorage.removeItem(V0459_CHECKPOINT_KEY)}catch{}}
function v0459RunLabel(cp=false){const b=document.getElementById('v0459Run');if(b)b.textContent=cp?'▶ Fortsätt Signal Lab 2 från sparad punkt':'▶ Kör Signal Lab 2 · Entry B-dissektion'}
function v0459Avg(s,k){const n=s['r'+k+'n'];return n?s['r'+k+'s']/n:null}
function v0459Fmt(v){return Number.isFinite(v)?`${v>=0?'+':''}${(v*100).toFixed(3)}%`:'—'}
function v0459Paint(){const sum=document.getElementById('v0459Summary'),seq=document.getElementById('v0459SeqRows'),conds=document.getElementById('v0459CondRows'),masks=document.getElementById('v0459MaskRows'),share=document.getElementById('v0459Share');if(!sum||!seq)return;if(!V0459_RESULT){sum.textContent='Ingen körning ännu.';seq.innerHTML='';if(conds)conds.innerHTML='';if(masks)masks.innerHTML='';if(share)share.disabled=true;return}const r=V0459_RESULT,names=['PRO2-kvalitet',...V0459_CONDS.map(x=>x.name)];seq.innerHTML=r.seq.map((v,i)=>`<tr><td>${names[i]}</td><td><b>${v.toLocaleString('sv-SE')}</b></td><td>${i?((r.seq[i-1]?v/r.seq[i-1]*100:0).toFixed(2)+'%'):'100,00%'}</td></tr>`).join('');const all=r.seq.at(-1)||0;sum.innerHTML=`<b>${all.toLocaleString('sv-SE')} av ${r.pro2.toLocaleString('sv-SE')} PRO2-observationer klarar hela Entry B</b><br>${r.pro2?(all/r.pro2*100).toFixed(2):'0.00'}% passerar samtliga fem frysta villkor.`;if(conds)conds.innerHTML=V0459_CONDS.map(c=>{const x=r.conds[c.id],p=x.pass.n/(x.pass.n+x.fail.n||1)*100,cell=k=>`${v0459Fmt(v0459Avg(x.pass,k))} / ${v0459Fmt(v0459Avg(x.fail,k))}`;return `<tr><td><b>${c.name}</b></td><td>${x.pass.n}</td><td>${x.fail.n}</td><td>${p.toFixed(2)}%</td><td>${cell('15')}</td><td>${cell('30')}</td><td>${cell('60')}</td></tr>`}).join('');if(masks)masks.innerHTML=Object.entries(r.masks).filter(([k])=>k!=='PASS_ALL').sort((a,b)=>b[1]-a[1]).slice(0,15).map(([k,v])=>`<tr><td>${k.split('+').map(id=>V0459_CONDS.find(c=>c.id===id)?.name||id).join(' + ')}</td><td><b>${v}</b></td><td>${r.pro2?(v/r.pro2*100).toFixed(2):'0.00'}%</td></tr>`).join('');if(share)share.disabled=false}
async function v0459Run(){if(V0459_RUNNING)return;V0459_RUNNING=true;const run=document.getElementById('v0459Run'),st=document.getElementById('v0459Status'),bar=document.getElementById('v0459Bar'),months=v0440Months();run.disabled=true;const saved=v0459Load();let start=saved?Math.max(0,Math.min(months.length,saved.nextIndex)):0,state=saved?saved.state:v0459Fresh();if(start>=months.length){v0459Clear();start=0;state=v0459Fresh()}try{if(saved&&start>0){st.textContent=`Återupptar Signal Lab 2 från ${start}/${months.length} färdiga månader…`;bar.style.width=`${start/months.length*100}%`}for(let i=start;i<months.length;i++){const w=months[i];st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label} och dissekerar Entry B…`;bar.style.width=`${i/months.length*100}%`;const j=await v0440FetchMonth(w,st),q=v0459Analyze(j.rows||[]);v0459Merge(state,q);v0459Save(i+1,state);bar.style.width=`${(i+1)/months.length*100}%`;await v0406Yield(20)}V0459_RESULT=state;v0413AddSims(1);v0459Clear();v0459Paint();v0459RunLabel(false);st.textContent='✓ Signal Lab 2 klart · Entry B är dissekerad.'}catch(e){const cp=v0459Load(),done=cp?.nextIndex||start;bar.style.width=`${done/months.length*100}%`;v0459RunLabel(done>0);st.textContent=`Signal Lab 2 avbröts efter ${done}/${months.length} färdiga månader. Delkörningen är sparad. Tryck Fortsätt för att återuppta. (${e?.message||e})`}finally{V0459_RUNNING=false;run.disabled=false}}
function v0459Report(){if(!V0459_RESULT)return'';const r=V0459_RESULT,L=['LINAS OPTI – SIGNAL LAB 2 · ENTRY B-DISSEKTION','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest/diagnostik)','','PERIOD: 2023-01-01 → 2026-09','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','METOD','Ingen strategi- eller signalparameter ändras. Entry B är exakt fryst.','Endast observationer som redan klarat PRO2-kvalitet analyseras.','Entry B:s fem villkor mäts separat och sekventiellt. Framåtrörelse +15/+30/+60 min från observationsbarens close är deskriptiv diagnostik, inte hypotetiska affärer.','','SEKVENTIELLT BORTFALL'];const names=['PRO2-kvalitet',...V0459_CONDS.map(x=>x.name)];r.seq.forEach((v,i)=>L.push(`${names[i]}: ${v} | ${i?(r.seq[i-1]?v/r.seq[i-1]*100:0).toFixed(2):'100.00'}% av föregående steg`));L.push('','VARJE VILLKOR SEPARAT','villkor|pass|fail|pass_pct|avg15_pass|avg15_fail|avg30_pass|avg30_fail|avg60_pass|avg60_fail');for(const c of V0459_CONDS){const x=r.conds[c.id],pct=x.pass.n/(x.pass.n+x.fail.n||1)*100;L.push(`${c.name}|${x.pass.n}|${x.fail.n}|${pct.toFixed(2)}|${v0459Fmt(v0459Avg(x.pass,'15'))}|${v0459Fmt(v0459Avg(x.fail,'15'))}|${v0459Fmt(v0459Avg(x.pass,'30'))}|${v0459Fmt(v0459Avg(x.fail,'30'))}|${v0459Fmt(v0459Avg(x.pass,'60'))}|${v0459Fmt(v0459Avg(x.fail,'60'))}`)}L.push('','BORTFALLSKOMBINATIONER','missade_villkor|antal|andel_av_PRO2');for(const [k,v] of Object.entries(r.masks).sort((a,b)=>b[1]-a[1]))L.push(`${k}|${v}|${r.pro2?(v/r.pro2*100).toFixed(2):'0.00'}%`);L.push('','TOLKNING','Det hårdaste villkoret är inte automatiskt ett dåligt villkor. Framåtrörelsen används för att formulera nästa förregistrerade test, inte för att efterhandsändra Entry B.','','OBS: 2023–2026 är inte ett nytt orört OOS-prov. Signal Lab 2 är diagnostik på frysta regler; det är inte en prognos.');return L.join('\n')}
async function v0459Share(){const st=document.getElementById('v0459Status');if(!V0459_RESULT){if(st)st.textContent='Ingen Signal Lab 2-rapport finns ännu. Kör labbet först.';return false}const text=v0459Report(),date=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_SIGNAL_LAB_2_ENTRY_B_DISSEKTION_V04510_${date}.txt`;if(!v0451IsIOS()){try{v0451DownloadText(text,name);if(st)st.textContent=`✓ Signal Lab 2-rapport nedladdad: ${name}`;return true}catch(e){if(st)st.textContent='Kunde inte ladda ner Signal Lab 2-rapporten.';return false}}const file=new File([text],name,{type:'text/plain;charset=utf-8'});try{if(navigator.share){if(!navigator.canShare||navigator.canShare({files:[file]})){await navigator.share({title:'Linas Opti Signal Lab 2',files:[file]});return true}await navigator.share({title:'Linas Opti Signal Lab 2',text});return true}}catch(e){if(e?.name==='AbortError')return false}try{v0451DownloadText(text,name);return true}catch{return false}}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v0459Run')?.addEventListener('click',v0459Run);document.getElementById('v0459Share')?.addEventListener('click',v0459Share);v0459Paint();const jump=document.getElementById('v0413LabJump');if(jump){try{const saved=localStorage.getItem('linasopti_testlab_selected_v0423');if(!saved||saved==='v0458Lab')jump.value='v0459Lab'}catch{}}const cp=v0459Load();if(cp&&cp.nextIndex>0){const st=document.getElementById('v0459Status'),bar=document.getElementById('v0459Bar'),months=v0440Months();if(st)st.textContent=`Sparad delkörning ${cp.nextIndex}/${months.length} månader · tryck Fortsätt för att återuppta.`;if(bar)bar.style.width=`${cp.nextIndex/months.length*100}%`;v0459RunLabel(true)}});


// ============================================================
// V0.45.11 – SIGNAL LAB 3 · CLOSE-TESTET
// Förregistrerat parameterprov efter Signal Lab 2. Exakt samma frysta
// Jägare används och endast Entry B:s close-location-minimum varierar:
// 77 / 80 / 83 / 86%. 86% är den frysta kontrollen.
// ============================================================
const V04511_VARIANTS=[
 {id:'c77',close:.77,name:'77%'},
 {id:'c80',close:.80,name:'80%'},
 {id:'c83',close:.83,name:'83%'},
 {id:'c86',close:.86,name:'86% · kontroll'}
];
let V04511_RESULT=null,V04511_RUNNING=false;
const V04511_CHECKPOINT_KEY='linasopti_signallab3_close_checkpoint_v04511';
function v04511FreshStates(){return V04511_VARIANTS.map(v=>({id:v.id,name:v.name,close:v.close,eq:100000,peak:100000,dd:0,closed:[],curve:[],utilSum:0,utilN:0,maxConcurrent:0,years:[],yearStart:100000}))}
function v04511Save(nextIndex,states){try{localStorage.setItem(V04511_CHECKPOINT_KEY,JSON.stringify({version:'V0.45.11',nextIndex,states,savedAt:new Date().toISOString()}));return true}catch{return false}}
function v04511Load(){try{const x=JSON.parse(localStorage.getItem(V04511_CHECKPOINT_KEY)||'null');return x&&x.version==='V0.45.11'&&Number.isInteger(x.nextIndex)&&Array.isArray(x.states)?x:null}catch{return null}}
function v04511Clear(){try{localStorage.removeItem(V04511_CHECKPOINT_KEY)}catch{}}
function v04511RunLabel(cp=false){const b=document.getElementById('v04511Run');if(b)b.textContent=cp?'▶ Fortsätt Signal Lab 3 från sparad punkt':'▶ Kör Signal Lab 3 · 77 / 80 / 83 / 86%'}
function v04511Engine(rows,capital,closeMin){
 const byDay={},spy={};
 for(const r of rows){const z=v0440NY(r.t);if(z.m<570||z.m>=960)continue;if(r.symbol==='SPY')(spy[z.d]??=[]).push({...r,_m:z.m});else{(byDay[z.d]??={});(byDay[z.d][r.symbol]??=[]).push({...r,_m:z.m})}}
 let eq=capital,peak=capital,dd=0,closed=[],curve=[],utilSum=0,utilN=0,maxConcurrent=0;
 const costSide=.000425,maxEntriesDay=4,maxPositions=3,maxPositionPct=1/3;
 for(const d of Object.keys(byDay).sort()){
  let positions=[],entriesToday=0;const syms=byDay[d],sp=(spy[d]||[]).sort((a,b)=>new Date(a.t)-new Date(b.t));Object.values(syms).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));const timeline=[...new Set(Object.values(syms).flat().map(b=>b.t))].sort((a,b)=>new Date(a)-new Date(b));const idx={};for(const [sym,a] of Object.entries(syms))idx[sym]=new Map(a.map((b,i)=>[b.t,i]));
  for(const ts of timeline){
   const keep=[];for(const position of positions){const a=syms[position.s],i=idx[position.s]?.get(ts);let exited=false;if(i!=null){const b=a[i],age=i-position.entryIdx;let raw=null,why='';if(age>0&&b.h>=position.target){raw=position.target;why='mål +0,8%'}else if(age>4&&b.l<=position.stop){raw=position.stop;why='stop −0,4% efter delay'}else if(age>=12){raw=b.c;why='max 60 min'}else if(b._m>=950){raw=b.c;why='stängning 15:50'}if(raw!=null){const exit=raw*(1-costSide),pnl=position.shares*(exit-position.entry);eq+=pnl;closed.push({...position,exitTime:b.t,exit,pnl,why});exited=true}}if(!exited)keep.push(position)}positions=keep;
   if(positions.length<maxPositions&&entriesToday<maxEntriesDay){const z=v0440NY(ts);if(z.m>=630&&z.m<=720){const spPast=sp.filter(x=>new Date(x.t)<=new Date(ts));if(spPast.length>=4){const sc=spPast.at(-1),so=spPast[0],s15=spPast[Math.max(0,spPast.length-4)],dayRet=sc.c/so.o-1,m15=sc.c/s15.c-1;if(dayRet>=.001&&m15>=.0005){const held=new Set(positions.map(p=>p.s)),cand=[];for(const [sym,a] of Object.entries(syms)){if(held.has(sym))continue;const i=idx[sym].get(ts);if(i==null||i<15||i>=a.length-1)continue;const b=a[i],hist=a.slice(i-14,i+1),prev=hist.at(-2),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/14,r1=b.c/prev.c-1,r3=b.c/a[i-3].c-1,r6=b.c/a[i-6].c-1,prev2=prev.c/a[i-2].c-1,range=Math.max(.000001,b.h-b.l),closeLoc=(b.c-b.l)/range,volRatio=avgVol?((+b.v||0)/avgVol):0,sma=hist.reduce((q,x)=>q+x.c,0)/hist.length,stretch=b.c/sma-1;if(r3<.004||r3>.012||r1<=0||r6<.0025||b.c<=sma||closeLoc<closeMin||volRatio<1.15||volRatio>3||stretch>.020||prev2<-.005)continue;const sweet=(r3>=.0075&&r3<.0100)?.55:0,volSweet=(volRatio>=2&&volRatio<3)?.25:0,timeBoost=.20,accel=r1-prev2,score=r3*105+r6*35+Math.max(-.01,Math.min(.01,accel))*40+Math.min(volRatio,3)*.12+closeLoc*.12+sweet+volSweet+timeBoost-Math.max(0,stretch-.012)*70,next=a[i+1];if(!next||next._m>=950)continue;cand.push({sym,i,score,next})}cand.sort((a,b)=>b.score-a.score);let slots=Math.min(maxPositions-positions.length,maxEntriesDay-entriesToday);for(const c of cand){if(slots<=0)break;const entry=c.next.o*(1+costSide),grossUsed=positions.reduce((q,p)=>q+p.entry*p.shares,0),capitalLeft=Math.max(0,eq-grossUsed),notionalCap=Math.min(eq*maxPositionPct,capitalLeft),shares=Math.min(notionalCap/entry,(eq*.005)/(entry*.006));if(!(shares>0))continue;positions.push({s:c.sym,symbol:c.sym,entry,entryTime:c.next.t,entryIdx:c.i+1,shares,stop:entry*(1-.004),target:entry*(1+.008),entryEquity:eq});entriesToday++;slots--}}}}}
   const gross=positions.reduce((q,p)=>q+p.entry*p.shares,0);utilSum+=eq>0?Math.min(1,gross/eq):0;utilN++;maxConcurrent=Math.max(maxConcurrent,positions.length);
  }
  for(const position of positions){const a=syms[position.s],b=a?.at(-1);if(!b)continue;const exit=b.c*(1-costSide),pnl=position.shares*(exit-position.entry);eq+=pnl;closed.push({...position,exitTime:b.t,exit,pnl,why:'dagsslut'})}peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq});
 }
 return {eq,dd,closed,curve,utilSum,utilN,maxConcurrent};
}
function v04511Stats(v){const w=v.closed.filter(x=>x.pnl>0),l=v.closed.filter(x=>x.pnl<0),gw=w.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(l.reduce((a,x)=>a+x.pnl,0));return {ret:v.eq/100000-1,pf:gl?gw/gl:(gw?Infinity:0),wr:v.closed.length?w.length/v.closed.length:0,util:v.utilN?v.utilSum/v.utilN:0}}
function v04511Paint(){const sum=document.getElementById('v04511Summary'),body=document.getElementById('v04511Rows'),yb=document.getElementById('v04511YearRows'),share=document.getElementById('v04511Share');if(!sum||!body||!yb)return;if(!V04511_RESULT){sum.textContent='Ingen körning ännu.';body.innerHTML='';yb.innerHTML='';if(share)share.disabled=true;return}const ranked=[...V04511_RESULT.variants].sort((a,b)=>b.eq-a.eq),best=ranked[0];sum.innerHTML=`<b>Högst slutvärde: ${best.name} · ${Math.round(best.eq).toLocaleString('sv-SE')} kr</b><br>86% är fryst kontroll. Ingen annan Entry B-, Strong-, exit-, risk- eller kapitalparameter har ändrats.`;body.innerHTML=V04511_RESULT.variants.map(v=>{const s=v04511Stats(v);return `<tr><td>${v.name}</td><td>${Math.round(v.eq).toLocaleString('sv-SE')} kr</td><td class="${s.ret>=0?'good':'bad'}">${(s.ret*100).toFixed(2)}%</td><td>${v.closed.length}</td><td>${v0411FmtPF(s.pf)}</td><td>${(s.wr*100).toFixed(1)}%</td><td>${(v.dd*100).toFixed(2)}%</td><td>${(s.util*100).toFixed(1)}%</td></tr>`}).join('');yb.innerHTML=V04511_RESULT.variants.flatMap(v=>v.years.map(y=>`<tr><td>${v.name}</td><td>${y.year}</td><td>${Math.round(y.start).toLocaleString('sv-SE')}</td><td>${Math.round(y.end).toLocaleString('sv-SE')}</td><td>${((y.end/y.start-1)*100).toFixed(2)}%</td><td>${y.n}</td></tr>`)).join('');if(share)share.disabled=false}
async function v04511Run(){if(V04511_RUNNING)return;V04511_RUNNING=true;const run=document.getElementById('v04511Run'),st=document.getElementById('v04511Status'),bar=document.getElementById('v04511Bar'),months=v0440Months();run.disabled=true;const saved=v04511Load();let start=saved?Math.max(0,Math.min(months.length,saved.nextIndex)):0,states=saved?saved.states:v04511FreshStates();if(start>=months.length){v04511Clear();start=0;states=v04511FreshStates()}try{if(saved&&start>0){st.textContent=`Återupptar Signal Lab 3 från ${start}/${months.length} färdiga månader…`;bar.style.width=`${start/months.length*100}%`}for(let i=start;i<months.length;i++){const w=months[i];st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label} och kör fyra close-varianter…`;bar.style.width=`${i/months.length*100}%`;const j=await v0440FetchMonth(w,st),rows=j.rows||[];for(const state of states){const r=v04511Engine(rows,state.eq,state.close);state.eq=r.eq;state.utilSum+=r.utilSum;state.utilN+=r.utilN;state.maxConcurrent=Math.max(state.maxConcurrent,r.maxConcurrent);for(const t of r.closed)state.closed.push(t);for(const c of r.curve){state.peak=Math.max(state.peak,c.v);state.dd=Math.min(state.dd,c.v/state.peak-1);state.curve.push(c)}const y=+w.label.slice(0,4),nextY=i===months.length-1?null:+months[i+1].label.slice(0,4);if(nextY!==y){const n=state.closed.filter(t=>+v0440NY(t.entryTime).d.slice(0,4)===y).length;state.years.push({year:y,start:state.yearStart,end:state.eq,n});state.yearStart=state.eq}}v04511Save(i+1,states);bar.style.width=`${(i+1)/months.length*100}%`;await v0406Yield(20)}V04511_RESULT={from:'2023-01-01',to:'2026-09-30',variants:states};v0413AddSims(4);v04511Clear();v04511Paint();v04511RunLabel(false);st.textContent='✓ Signal Lab 3 klart · fyra förregistrerade close-trösklar jämförda.'}catch(e){const cp=v04511Load(),done=cp?.nextIndex||start;bar.style.width=`${done/months.length*100}%`;v04511RunLabel(done>0);st.textContent=`Signal Lab 3 avbröts efter ${done}/${months.length} färdiga månader. Delkörningen är sparad. Tryck Fortsätt för att återuppta. (${e?.message||e})`}finally{V04511_RUNNING=false;run.disabled=false}}
function v04511Report(){if(!V04511_RESULT)return'';const L=['LINAS OPTI – SIGNAL LAB 3 · CLOSE-TESTET','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest/förregistrerat experiment)','','STARTKAPITAL: 100 000 kr','PERIOD: 2023-01-01 → 2026-09','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','FÖRREGISTRERAD HYPOTES','Signal Lab 2 visade att close ≥86% halverar observationerna men att fail-gruppen hade något bättre deskriptiv +15/+30/+60 min-rörelse. Därför testas en liten förutbestämd familj utan efterhandsändring.','','METOD','Endast Entry B:s close-location-minimum ändras: 77% / 80% / 83% / 86%.','86% är fryst kontroll.','Samma frysta Jägare i övrigt: PRO2-kvalitet → Entry B → Strong-regim → forsknings-exit.','m3, volymkrav, Strong, Day Selection, exit, 0,5% risk, tre samtidiga positioner, 33,3% max per position, max 4 entries/dag och friktion är oförändrade.','','RESULTAT'];for(const v of V04511_RESULT.variants){const s=v04511Stats(v);L.push(`${v.name} | slut ${v.eq.toFixed(2)} kr | avkastning ${(s.ret*100).toFixed(2)}% | affärer ${v.closed.length} | PF ${v0411FmtPF(s.pf)} | WR ${(s.wr*100).toFixed(1)}% | max DD ${(v.dd*100).toFixed(2)}% | snitt kapital i arbete ${(s.util*100).toFixed(1)}% | max samtidiga ${v.maxConcurrent}`)}L.push('','ÅRSRESULTAT');for(const v of V04511_RESULT.variants){L.push('',v.name.toUpperCase());for(const y of v.years)L.push(`${y.year} | ${y.start.toFixed(2)} → ${y.end.toFixed(2)} | ${((y.end/y.start-1)*100).toFixed(2)}% | ${y.n} affärer`)}L.push('','FORSKNINGSDISCIPLIN','Detta är ett förregistrerat jämförelsetest på redan använd 2023–2026-historik. Vinnande close-tröskel får inte kallas oberoende OOS-resultat; en kandidat måste frysas och därefter valideras på data som inte användes för att formulera eller välja hypotesen.');return L.join('\n')}
async function v04511Share(){const st=document.getElementById('v04511Status');if(!V04511_RESULT){if(st)st.textContent='Ingen Signal Lab 3-rapport finns ännu. Kör labbet först.';return false}const text=v04511Report(),date=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_SIGNAL_LAB_3_CLOSE_TESTET_V04513_${date}.txt`;if(!v0451IsIOS()){try{v0451DownloadText(text,name);if(st)st.textContent=`✓ Signal Lab 3-rapport nedladdad: ${name}`;return true}catch(e){if(st)st.textContent='Kunde inte ladda ner Signal Lab 3-rapporten.';return false}}const file=new File([text],name,{type:'text/plain;charset=utf-8'});try{if(navigator.share){if(!navigator.canShare||navigator.canShare({files:[file]})){await navigator.share({title:'Linas Opti Signal Lab 3',files:[file]});return true}await navigator.share({title:'Linas Opti Signal Lab 3',text});return true}}catch(e){if(e?.name==='AbortError')return false}try{v0451DownloadText(text,name);return true}catch{return false}}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v04511Run')?.addEventListener('click',v04511Run);document.getElementById('v04511Share')?.addEventListener('click',v04511Share);v04511Paint();const jump=document.getElementById('v0413LabJump');if(jump){try{const saved=localStorage.getItem('linasopti_testlab_selected_v0423');if(!saved||saved==='v0459Lab')jump.value='v04511Lab'}catch{}}const cp=v04511Load();if(cp&&cp.nextIndex>0){const st=document.getElementById('v04511Status'),bar=document.getElementById('v04511Bar'),months=v0440Months();if(st)st.textContent=`Sparad delkörning ${cp.nextIndex}/${months.length} månader · tryck Fortsätt för att återuppta.`;if(bar)bar.style.width=`${cp.nextIndex/months.length*100}%`;v04511RunLabel(true)}});




// ============================================================
// V0.46.2 – VALIDATION SUITE · UX / progress / reproducibility
// ============================================================
const V0460_KEY='linasopti_validation_suite_v0462',V0460_OLD_KEY='linasopti_validation_suite_v0461',V0460_BACKUP_SCHEMA='lina-v0462-backup-v1';
const V0460_SIM_LEDGER_KEY='linasopti_validation_sim_ledger_v0462',V0460_OLD_SIM_LEDGER_KEY='linasopti_validation_sim_ledger_v0461';
function v0460CountSims(id,n){
 try{
  const ledger=JSON.parse(localStorage.getItem(V0460_SIM_LEDGER_KEY)||'{}');
  if(ledger[id])return false;
  // Mark ledger and update counter together as closely as localStorage allows.
  ledger[id]={n,at:new Date().toISOString()};
  localStorage.setItem(V0460_SIM_LEDGER_KEY,JSON.stringify(ledger));
  v0413AddSims(n);
  return true;
 }catch{return false}
}

const V0460_RULES={close:.83,strongDayRet:.001,strongM15:.0005,m3Min:.004,m3Max:.012,volMin:1.15,volMax:3,target:.008,stop:.004,delay:4,maxBars:12,maxPositions:3,maxEntries:4,maxPositionPct:1/3,costSide:.000425,symbols:['AMD','SHOP','ADBE','MU','FDX','TSLA','LUV','NFLX','C','NOW','QCOM','BAC','GM','DDOG','PYPL','NVDA']};
function v0460Hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return ('00000000'+(h>>>0).toString(16)).slice(-8)}
const V0460_RULE_HASH=v0460Hash(JSON.stringify(V0460_RULES));
const V0460_HELP={
suite:['Vad testar vi här?','Validation Suite försöker slå hål på Lina innan vi litar på henne. Reglerna är låsta och ett dåligt resultat startar aldrig automatisk optimering.'],
integrity:['Integrity Audit','Kontrollerar datatäckning, dubbletter, tidsordning och reproducerbarhet. Grundfel gör senare backtestresultat opålitliga.'],
pbo:['PBO / DSR','PBO uppskattar hur ofta en in-sample-vinnare blir svag out-of-sample. Lägre är bättre. DSR justerar Sharpe för flera jämförbara försök. DSR är inte sannolikheten att Lina tjänar pengar.'],
time:['Tidsstabilitet','Samma frysta 83%-strategi bedöms år för år utan att parametrarna ändras mellan blocken.'],
friction:['Friktionsstress','Stressar redan observerade affärer med högre modellerade kostnader. Om liten kostnadsökning förstör resultatet är strategin skör.'],
concentration:['Koncentration','Visar om resultatet är beroende av enstaka aktier eller perioder. Mer spridning är normalt robustare.'],
monte:['Monte Carlo','Blandar ordningen på observerade affärer 2 000 gånger och visar möjliga drawdownbanor. Affärernas P/L ändras inte.'],
final:['Slutrapport','Samlar PASS, VARNING och FAIL. Ingen artificiell totalscore och ingen automatisk parameterjakt.']};
const V0460_STEPS=[['integrity','Integrity Audit · data / leakage / reproducerbarhet'],['pbo','Robustness · PBO / DSR'],['time','Tidsblock · walk-forward stability'],['friction','Stress · friktion / execution'],['concentration','Stabilitet · symbol / tid'],['monte','Monte Carlo · drawdown stress'],['final','Final Validation Report']];
function v0460New(){return{schema:'V0.46.2',rulesHash:V0460_RULE_HASH,createdAt:new Date().toISOString(),steps:{},base:null,completed:false}}
function v0460Load(){
 try{
  let x=JSON.parse(localStorage.getItem(V0460_KEY)||'null');
  if(x&&x.schema==='V0.46.2'&&x.rulesHash===V0460_RULE_HASH)return x;
  const old=JSON.parse(localStorage.getItem(V0460_OLD_KEY)||'null');
  if(old&&old.schema==='V0.46.1'&&old.rulesHash===V0460_RULE_HASH){
    old.schema='V0.46.2';old.migratedFrom='V0.46.1';old.migratedAt=new Date().toISOString();
    localStorage.setItem(V0460_KEY,JSON.stringify(old));
    try{
      const ol=JSON.parse(localStorage.getItem(V0460_OLD_SIM_LEDGER_KEY)||'{}');
      if(Object.keys(ol).length&&!localStorage.getItem(V0460_SIM_LEDGER_KEY))localStorage.setItem(V0460_SIM_LEDGER_KEY,JSON.stringify(ol));
    }catch{}
    return old;
  }
  return v0460New();
 }catch{return v0460New()}
}
function v0460Save(x){x.updatedAt=new Date().toISOString();localStorage.setItem(V0460_KEY,JSON.stringify(x));return x}

const V0462_PBO_CP_KEY='linasopti_validation_pbo_checkpoint_v0462';
let V0462_ACTIVE={id:null,index:0,total:0,label:''},V0462_DETAIL_ID=null,V0462_RERUN_MODE=false;

function v0462StatusMarkup(status,progress=''){
 if(status==='PASS')return '<span class="v0462-status v0462-pass">✅ GODKÄND</span>';
 if(status==='VARNING')return '<span class="v0462-status v0462-warning">⚠️ VARNING</span>';
 if(status==='FAIL')return '<span class="v0462-status v0462-fail">❌ KRAV EJ UPPFYLLT</span>';
 if(status==='PÅGÅR')return `<span class="v0462-status v0462-running">⚙️ KÖRS${progress?' · '+progress:''}</span>`;
 return '<span class="v0462-status v0462-muted">○ EJ KÖRD</span>';
}
function v0462SetActive(id,index=0,total=0,label=''){
 V0462_ACTIVE={id,index,total,label};
 const pct=total?Math.round(index/total*100):0;
 const al=document.getElementById('v0462ActiveLabel'),ap=document.getElementById('v0462ActivePct'),bar=document.getElementById('v0460Bar');
 const step=V0460_STEPS.find(s=>s[0]===id);
 if(al)al.textContent=step?step[1]:'Aktuellt test';
 if(ap)ap.textContent=total?`${index}/${total} · ${pct}%`:(id?'Pågår':'0%');
 if(bar&&total)bar.style.width=`${pct}%`;
 v0460Paint();
}
function v0462SuiteProgress(done){
 const b=document.getElementById('v0462SuiteBar'),t=document.getElementById('v0462SuiteText');
 if(b)b.style.width=`${done/7*100}%`;if(t)t.textContent=`${done}/7 tester klara`;
}
function v0462LoadPboCp(){
 try{const x=JSON.parse(localStorage.getItem(V0462_PBO_CP_KEY)||'null');return x&&x.version==='V0.46.2'&&x.rulesHash===V0460_RULE_HASH?x:null}catch{return null}
}
function v0462SavePboCp(nextIndex,states){
 const compact=states.map(s=>({id:s.id,name:s.name,close:s.close,eq:s.eq,monthly:s.monthly}));
 const x={version:'V0.46.2',rulesHash:V0460_RULE_HASH,nextIndex,total:v0440Months().length,states:compact,savedAt:new Date().toISOString()};
 localStorage.setItem(V0462_PBO_CP_KEY,JSON.stringify(x));
 const e=document.getElementById('v0461Checkpoint');if(e)e.textContent=`Checkpoint: PBO ${nextIndex}/${x.total} · sparat ${new Date(x.savedAt).toLocaleTimeString('sv-SE')}`;
}
function v0462ClearPboCp(){try{localStorage.removeItem(V0462_PBO_CP_KEY)}catch{}}
function v0462TestReport(id,r){
 const s=V0460_STEPS.find(x=>x[0]===id),L=['LINAS OPTI – VALIDATION TEST','Version: '+APP_VERSION,'Test: '+(s?.[1]||id),'Status: '+(r?.status||'—'),'Regelhash: '+V0460_RULE_HASH,'Datafingerprint: '+(r?.dataFingerprint||v0460Load().base?.dataFingerprint||'—'),''];
 if(r?.explain)L.push('Tolkning:',r.explain,'');
 L.push('Mätvärden:',JSON.stringify(r?.metrics||{},null,2));
 if(r?.reruns?.length){L.push('','KONTROLLKÖRNINGAR');r.reruns.forEach((q,i)=>L.push(`${i+1}. ${q.completedAt} | ${q.status} | ${q.explain||''}`))}
 L.push('','Ingen parameter har ändrats av denna export.');
 return L.join('\n');
}

function v0470FriendlyMetrics(id,m){
 const f=n=>Number.isFinite(n)?n.toLocaleString('sv-SE',{maximumFractionDigits:2}):'—';
 const pct=n=>Number.isFinite(n)?(n*100).toFixed(1)+'%':'—';
 let rows=[];
 if(id==='integrity')rows=[['Dubbletter',m.duplicates??'—'],['Tidsordningsfel',m.order??'—'],['Reproducerbar',m.reproducible?'Ja':'Nej']];
 else if(id==='pbo')rows=[['PBO',pct(m.pbo)],['DSR',pct(m.dsr)],['Train/test-kombinationer',m.combos??'—']];
 else if(id==='time')rows=(m.years||[]).flatMap(y=>[[`${y.year} avkastning`,pct(y.ret)],[`${y.year} affärer`,y.trades]]);
 else if(id==='friction')rows=(m.levels||[]).flatMap(x=>[[`${x.mult}× friktion · P/L`,f(x.pnl)+' kr'],[`${x.mult}× friktion · PF`,f(x.pf)]]);
 else if(id==='concentration')rows=[['Största vinstkoncentration',pct(m.bestShare)],['Bästa symbol',m.symbols?.[0]?.[0]||'—']];
 else if(id==='monte')rows=[['Monte Carlo-körningar',m.runs??'—'],['5:e percentil slutvärde',f(m.finalP05)+' kr'],['Svagaste 5% drawdown',pct(m.ddWorst5)]];
 else if(id==='final')rows=[['Godkända',m.passes??0],['Varningar',m.warnings??0],['Krav ej uppfyllda',m.fails??0]];
 return `<div class="v0470-metricgrid">${rows.map(r=>`<div>${r[0]}</div><div>${r[1]}</div>`).join('')}</div>`;
}
function v0462ShowDetail(id){
 const x=v0460Load(),r=x.steps[id],s=V0460_STEPS.find(q=>q[0]===id);V0462_DETAIL_ID=id;
 const m=document.getElementById('v0462DetailModal'),title=document.getElementById('v0462DetailTitle'),body=document.getElementById('v0462DetailBody'),rerun=document.getElementById('v0462RerunTest');
 if(title)title.textContent=s?.[1]||id;
 if(body)body.innerHTML=r?`${v0462StatusMarkup(r.status)}<p>${r.explain||''}</p>${v0470FriendlyMetrics(id,r.metrics||{})}<details class="v0470-tech"><summary>Visa tekniska detaljer</summary><pre>${JSON.stringify(r.metrics||{},null,2)}</pre></details>${r.reruns?.length?`<p><b>Kontrollkörningar:</b> ${r.reruns.length}</p>`:''}`:'<p>Testet är inte kört ännu.</p>';
 if(rerun)rerun.disabled=!r||V0460_RUNNING||id==='final';
 if(m)m.hidden=false;
}
async function v0462Rerun(id){
 if(V0460_RUNNING)return;const x=v0460Load(),orig=x.steps[id];if(!orig)return;
 if(id==='pbo')v0462ClearPboCp();
 V0462_RERUN_MODE=true;V0460_RUNNING=true;V0461_PAUSED=false;V0461_CANCEL=false;v0461StartClock();v0461Buttons(true);document.body.classList.add('v0462-running');
 const st=document.getElementById('v0460Status');try{
   st.textContent='Kontrollkör '+(V0460_STEPS.find(s=>s[0]===id)?.[1]||id);
   const r=await v0460Step(id,x),entry={...r,completedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:x.base?.dataFingerprint};
   orig.reruns=orig.reruns||[];orig.reruns.push(entry);v0460Save(x);
   const same=orig.status===entry.status&&JSON.stringify(orig.metrics)===JSON.stringify(entry.metrics);
   st.textContent=`✓ Kontrollkörning klar · ${same?'identiskt resultat':'RESULTATET SKILJER SIG – kontrollera reproducerbarhet'}`;v0461Log(`Kontrollkörning ${id} · ${entry.status} · ${same?'identisk':'avvikelse'}`);
 }catch(e){st.textContent='Kontrollkörning stoppad: '+(e?.message||e)}finally{V0462_RERUN_MODE=false;V0460_RUNNING=false;v0461Buttons(false);v0461StopClock();document.body.classList.remove('v0462-running');v0462SetActive(null,0,0,'');v0460Paint();v0462ShowDetail(id)}
}
function v0460Help(k,extra=''){const x=V0460_HELP[k]||['Förklaring','Ingen hjälptext.'],m=document.getElementById('v0460HelpModal');document.getElementById('v0460HelpTitle').textContent=x[0];document.getElementById('v0460HelpBody').innerHTML=`<p>${x[1]}</p>${extra?`<p><b>Ditt resultat:</b> ${extra}</p>`:''}`;m.hidden=false}
function v0460Paint(){
 const x=v0460Load(),tb=document.getElementById('v0460Steps'),done=V0460_STEPS.filter(s=>x.steps[s[0]]).length;
 v0462SuiteProgress(done);
 if(tb)tb.innerHTML=V0460_STEPS.map((s,i)=>{
   const r=x.steps[s[0]],isRun=V0460_RUNNING&&V0462_ACTIVE.id===s[0],progress=isRun&&V0462_ACTIVE.total?`${V0462_ACTIVE.index}/${V0462_ACTIVE.total}`:'';
   const stat=isRun?v0462StatusMarkup('PÅGÅR',progress):v0462StatusMarkup(r?.status||'');
   return `<tr><td>${i+1}/7</td><td>${r?`<button class="v0462-rowbtn" data-detail="${s[0]}">${s[1]}</button>`:s[1]}</td><td>${stat}</td><td><button class="v0460-help" data-help="${s[0]}">?</button></td></tr>`
 }).join('');
 const z=document.getElementById('v0460Result');if(z)z.innerHTML=`Regelhash <b>${V0460_RULE_HASH}</b> · ${done}/7 sparade${x.completed?' · <b>SVIT KLAR</b>':''}`;const complete=document.getElementById('v0470SuiteAComplete');if(complete)complete.hidden=!x.completed;
 const st=document.getElementById('v0460Storage');if(st)st.textContent=`Lokal Safari-lagring · ${done}/7 test sparade`;
 const bcp=v0461LoadBaseCp(),pcp=v0462LoadPboCp(),runAll=document.getElementById('v0460RunAll'),runNext=document.getElementById('v0460RunNext'),cpel=document.getElementById('v0461Checkpoint');
 if(!V0460_RUNNING){
   if(bcp){if(runAll)runAll.textContent=`▶ Fortsätt Validation Suite · basdata ${Math.min(bcp.nextIndex+1,bcp.total)}/${bcp.total}`;if(runNext)runNext.textContent='▶ Fortsätt nästa test';if(cpel)cpel.textContent=`Checkpoint: basdata ${bcp.nextIndex}/${bcp.total} · ${new Date(bcp.savedAt).toLocaleTimeString('sv-SE')}`}
   else if(pcp){if(runAll)runAll.textContent=`▶ Fortsätt Validation Suite · PBO ${Math.min(pcp.nextIndex+1,pcp.total)}/${pcp.total}`;if(runNext)runNext.textContent=`▶ Fortsätt PBO · ${Math.min(pcp.nextIndex+1,pcp.total)}/${pcp.total}`;if(cpel)cpel.textContent=`Checkpoint: PBO ${pcp.nextIndex}/${pcp.total} · ${new Date(pcp.savedAt).toLocaleTimeString('sv-SE')}`}
   else{if(runAll){runAll.textContent='▶ Kör hela Validation Suite';runAll.hidden=!!x.completed}if(runNext){runNext.textContent='▶ Kör nästa test';runNext.hidden=!!x.completed}if(cpel)cpel.textContent='Checkpoint: ingen pågående delkörning.'}
 }
 ['v0460FinalReport','v0460Raw'].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=!x.completed});
 document.querySelectorAll('.v0460-help').forEach(b=>b.onclick=()=>v0460Help(b.dataset.help,x.steps[b.dataset.help]?.explain||''));
 document.querySelectorAll('.v0462-rowbtn').forEach(b=>b.onclick=()=>v0462ShowDetail(b.dataset.detail));
}
function v0460Stats(c){const w=c.filter(t=>t.pnl>0),l=c.filter(t=>t.pnl<0),gw=w.reduce((a,t)=>a+t.pnl,0),gl=Math.abs(l.reduce((a,t)=>a+t.pnl,0));return{n:c.length,pnl:c.reduce((a,t)=>a+t.pnl,0),pf:gl?gw/gl:(gw?Infinity:0),wr:c.length?w.length/c.length:0}}

const V0461_BASE_CP_KEY='linasopti_validation_base_checkpoint_v0462';
const V0461_RUN_KEY='linasopti_validation_run_state_v0462';
let V0461_PAUSED=false,V0461_CANCEL=false,V0461_TIMER=null,V0461_STARTED=0;
function v0461Now(){return new Date().toLocaleTimeString('sv-SE')}
function v0461Log(msg){
 const el=document.getElementById('v0461Log');if(!el)return;
 const d=document.createElement('div');d.textContent=`${v0461Now()} · ${msg}`;el.prepend(d);
 while(el.children.length>5)el.removeChild(el.lastChild);
}
function v0461Live(msg,active=true){
 const t=document.getElementById('v0461LiveText'),p=document.getElementById('v0461Pulse');
 if(t)t.textContent=msg;if(p)p.classList.toggle('active',active);
}
function v0461StartClock(){
 V0461_STARTED=Date.now();clearInterval(V0461_TIMER);
 V0461_TIMER=setInterval(()=>{const e=document.getElementById('v0461Elapsed');if(!e)return;const s=Math.floor((Date.now()-V0461_STARTED)/1000);e.textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`},1000);
}
function v0461StopClock(){clearInterval(V0461_TIMER);V0461_TIMER=null;const p=document.getElementById('v0461Pulse');if(p)p.classList.remove('active')}
function v0461Buttons(running){
 const p=document.getElementById('v0461Pause'),r=document.getElementById('v0461Resume'),c=document.getElementById('v0461Cancel');
 if(!p||!r||!c)return;
 if(!running){p.hidden=r.hidden=c.hidden=true;return}
 c.hidden=false;
 if(V0461_PAUSED){p.hidden=true;r.hidden=false}
 else{p.hidden=false;r.hidden=true}
 p.disabled=false;r.disabled=false;c.disabled=false;
}
async function v0461WaitIfPaused(){
 while(V0461_PAUSED&&!V0461_CANCEL){v0461Live('Pausad · checkpoint sparad',false);await new Promise(r=>setTimeout(r,300))}
 if(V0461_CANCEL)throw new Error('Avbruten av användaren');
}
function v0461LoadBaseCp(){
 try{const x=JSON.parse(localStorage.getItem(V0461_BASE_CP_KEY)||'null');return x&&x.version==='V0.46.2'&&x.rulesHash===V0460_RULE_HASH?x:null}catch{return null}
}
function v0461SaveBaseCp(cp){
 cp.savedAt=new Date().toISOString();localStorage.setItem(V0461_BASE_CP_KEY,JSON.stringify(cp));
 const e=document.getElementById('v0461Checkpoint');if(e)e.textContent=`Checkpoint: ${cp.nextIndex}/${cp.total} månader · sparat ${new Date(cp.savedAt).toLocaleTimeString('sv-SE')}`;
}
function v0461ClearBaseCp(){try{localStorage.removeItem(V0461_BASE_CP_KEY)}catch{}}
async function v0461FetchRetry(w,st,tries=3){
 let last;
 for(let a=1;a<=tries;a++){
   await v0461WaitIfPaused();
   try{
     v0461Live(`${w.label} · hämtning försök ${a}/${tries}`);
     const timeout=new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout 90 s')),90000));
     return await Promise.race([v0440FetchMonth(w,st),timeout]);
   }catch(e){
     last=e;v0461Log(`${w.label} · fel ${a}/${tries}: ${e?.message||e}`);
     if(a<tries){v0461Live(`${w.label} · väntar före retry`);await new Promise(r=>setTimeout(r,1500*a))}
   }
 }
 throw last||new Error('Datakörning misslyckades');
}
async function v0460Base(st){
 const M=v0440Months(),saved=v0461LoadBaseCp();
 let state=saved?.state||{eq:100000,closed:[],monthly:[],meta:[],hash:[]};
 let start=saved?.nextIndex||0;
 const bar=document.getElementById('v0460Bar'),sub=document.getElementById('v0461SubProgress');
 if(start>0)v0461Log(`Fortsätter basdata från ${start+1}/${M.length}`);
 for(let i=start;i<M.length;i++){
   await v0461WaitIfPaused();
   const w=M[i];
   st.textContent=`Basdata ${i+1}/${M.length} · ${w.label}`;v0462SetActive('integrity',i,M.length,w.label);
   v0461Live(`Arbetar · basdata ${i+1}/${M.length} · ${w.label}`);
   if(sub)sub.textContent=`Aktiv del: basdata · månad ${i+1}/${M.length} · ${Math.round(i/M.length*100)}% klar före denna månad`;
   if(bar)bar.style.width=`${i/M.length*100}%`;
   const j=await v0461FetchRetry(w,st),rows=j.rows||[];
   if(!rows.length)throw Error('Ingen data '+w.label);
   const seen=new Set(),dup=new Set();let order=0,last={};
   for(const r of rows){const k=r.symbol+'|'+r.t;if(seen.has(k))dup.add(k);seen.add(k);if(last[r.symbol]&&new Date(r.t)<new Date(last[r.symbol]))order++;last[r.symbol]=r.t}
   const before=state.eq,r=v04511Engine(rows,state.eq,.83);state.eq=r.eq;state.closed.push(...r.closed);
   state.monthly.push({label:w.label,ret:state.eq/before-1,trades:r.closed.length});
   state.meta.push({label:w.label,rows:rows.length,duplicates:dup.size,order});
   state.hash.push(`${w.label}:${rows.length}:${rows[0]?.t}:${rows.at(-1)?.t}`);
   v0461SaveBaseCp({version:'V0.46.2',rulesHash:V0460_RULE_HASH,nextIndex:i+1,total:M.length,state});
   v0461Log(`BASDATA · ${w.label} klar · ${rows.length.toLocaleString('sv-SE')} rader · ${i+1}/${M.length}`);v0462SetActive('integrity',i+1,M.length,w.label);
   if(bar)bar.style.width=`${(i+1)/M.length*100}%`;
   if(sub)sub.textContent=`Basdata ${i+1}/${M.length} klar · nästa ${i+2<=M.length?M[i+1].label:'—'}`;
   await new Promise(r=>setTimeout(r,20));
 }
 state.dataFingerprint=v0460Hash(state.hash.join('|'));v0461ClearBaseCp();
 if(sub)sub.textContent=`Basdata klar · ${M.length}/${M.length} månader`;
 return state
}
function v0460Rng(seed){let x=seed>>>0;return()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296}}
function v0460Q(a,p){const b=[...a].sort((x,y)=>x-y);return b[Math.floor((b.length-1)*p)]}
async function v0460Step(id,x){const st=document.getElementById('v0460Status');if(!x.base&&id!=='final'){x.base=await v0460Base(st);v0460Save(x);v0460CountSims('base83-months',x.base.monthly.length)}const b=x.base;
if(id==='integrity'){const d=b.meta.reduce((a,z)=>a+z.duplicates,0),o=b.meta.reduce((a,z)=>a+z.order,0),same=JSON.stringify(v0460Stats(b.closed))===JSON.stringify(v0460Stats(b.closed)),status=d===0&&o===0&&same?'PASS':'FAIL';return{status,metrics:{duplicates:d,order:o,reproducible:same,dataFingerprint:b.dataFingerprint},explain:`Dubbletter ${d}, tidsordningsfel ${o}, reproducerbar ${same?'ja':'nej'}. Motorn använder signalbar och entry på nästa bars open.`}}
if(id==='pbo'){
 const M=v0440Months(),saved=V0462_RERUN_MODE?null:v0462LoadPboCp();
 let states=saved?saved.states:V04514_VARIANTS.map(v=>({id:v.id,name:v.name,close:v.close,eq:100000,monthly:[]}));
 let start=saved?Math.max(0,Math.min(M.length,saved.nextIndex)):0;
 if(saved&&start>0)v0461Log(`PBO · fortsätter från ${start+1}/${M.length}`);
 for(let i=start;i<M.length;i++){
   await v0461WaitIfPaused();const w=M[i];
   st.textContent=`PBO ${i+1}/${M.length} · ${w.label}`;v0462SetActive('pbo',i,M.length,w.label);
   v0461Live(`Arbetar · PBO/DSR · ${i+1}/${M.length} · ${w.label}`);
   const sub=document.getElementById('v0461SubProgress');if(sub)sub.textContent=`PBO/DSR · månad ${i+1}/${M.length} · ${Math.round(i/M.length*100)}% klar före denna månad`;
   const rows=(await v0461FetchRetry(w,st)).rows||[];if(!rows.length)throw Error('Ingen data '+w.label);
   for(const s of states){const q=s.eq,r=v04511Engine(rows,s.eq,s.close);s.eq=r.eq;s.monthly.push({label:w.label,ret:s.eq/q-1})}
   if(!V0462_RERUN_MODE)v0462SavePboCp(i+1,states);
   v0461Log(`PBO · ${w.label} klar · ${i+1}/${M.length}`);
   v0462SetActive('pbo',i+1,M.length,w.label);
   await new Promise(r=>setTimeout(r,20));
 }
 const a=v04514Analyze(states),p=a.cscv.pbo,d=a.dsr.dsr,status=p<=.2&&d>=.95?'PASS':p<=.5&&d>=.8?'VARNING':'FAIL';
 if(!V0462_RERUN_MODE){v0462ClearPboCp();v0460CountSims('pbo-close-family',states.reduce((q,s)=>q+s.monthly.length,0))}
 return{status,metrics:{pbo:p,dsr:d,combos:a.cscv.combos},explain:`PBO ${(p*100).toFixed(1)}%, DSR ${(d*100).toFixed(1)}%. Gäller endast close-familjen.`}
}
if(id==='time'){v0462SetActive('time',0,1,'beräknar');const y={};b.monthly.forEach(m=>(y[m.label.slice(0,4)]??=[]).push(m));const years=Object.entries(y).map(([year,a])=>({year,ret:a.reduce((q,z)=>q*(1+z.ret),1)-1,trades:a.reduce((q,z)=>q+z.trades,0)})),pos=years.filter(z=>z.ret>0).length,min=Math.min(...years.map(z=>z.trades)),status=pos>=3&&min>=50?'PASS':pos>=2&&min>=30?'VARNING':'FAIL';return{status,metrics:{years},explain:`${pos}/${years.length} positiva år; minsta årsblock ${min} affärer.`}}
if(id==='friction'){v0462SetActive('friction',0,1,'beräknar');const not=t=>Math.abs((t.shares||0)*(t.entry||0)),levels=[1,1.5,2].map(mult=>{const c=b.closed.map(t=>({...t,pnl:t.pnl-not(t)*2*V0460_RULES.costSide*(mult-1)}));return{mult,...v0460Stats(c)}}),z=levels.at(-1),status=z.pf>=1?'PASS':z.pf>=.95?'VARNING':'FAIL';return{status,metrics:{levels},explain:`Vid 2× friktion PF ${Number.isFinite(z.pf)?z.pf.toFixed(2):'∞'}, P/L ${z.pnl.toFixed(0)} kr.`}}
if(id==='concentration'){v0462SetActive('concentration',0,1,'beräknar');const s={};b.closed.forEach(t=>s[t.symbol]=(s[t.symbol]||0)+t.pnl);const arr=Object.entries(s).sort((a,z)=>z[1]-a[1]),gross=b.closed.filter(t=>t.pnl>0).reduce((a,t)=>a+t.pnl,0)||1,share=Math.max(0,arr[0]?.[1]||0)/gross,status=share<=.35?'PASS':share<=.5?'VARNING':'FAIL';return{status,metrics:{symbols:arr,bestShare:share},explain:`Största positiva symbolbidrag ${arr[0]?.[0]||'—'}: ${Math.round(share*100)}% av bruttovinsten.`}}
if(id==='monte'){v0462SetActive('monte',0,2000,'simulationer');const pnl=b.closed.map(t=>t.pnl),rng=v0460Rng(parseInt(V0460_RULE_HASH,16)),dds=[],ends=[];for(let k=0;k<2000;k++){if(k%100===0){v0462SetActive('monte',k,2000,'simulationer');v0461Live(`Arbetar · Monte Carlo ${k}/2000`);await new Promise(r=>setTimeout(r,0))}const a=[...pnl];for(let i=a.length-1;i;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}let eq=100000,pk=eq,dd=0;a.forEach(p=>{eq+=p;pk=Math.max(pk,eq);dd=Math.min(dd,eq/pk-1)});ends.push(eq);dds.push(dd)}const d=v0460Q(dds,.05),status=d>=-.15?'PASS':d>=-.25?'VARNING':'FAIL';v0460CountSims('monte-carlo-permutations',2000);return{status,metrics:{runs:2000,finalP05:v0460Q(ends,.05),ddWorst5:d},explain:`2 000 körningar; 5:e percentil slut ${v0460Q(ends,.05).toFixed(0)} kr, drawdown ${(d*100).toFixed(1)}%.`}}
if(id==='final'){v0462SetActive('final',0,1,'sammanställer');const a=V0460_STEPS.slice(0,6).map(s=>x.steps[s[0]]?.status),f=a.filter(z=>z==='FAIL').length,w=a.filter(z=>z==='VARNING').length,p=a.filter(z=>z==='PASS').length;return{status:f?'FAIL':w?'VARNING':'PASS',metrics:{passes:p,warnings:w,fails:f},explain:`${p} PASS, ${w} VARNING, ${f} FAIL. Ingen automatisk optimering.`}}}

let V0460_RUNNING=false;
async function v0460Run(all){
 if(V0460_RUNNING)return;V0460_RUNNING=true;V0461_PAUSED=false;V0461_CANCEL=false;document.body.classList.add('v0462-running');v0461StartClock();v0461Buttons(true);
 const A=document.getElementById('v0460RunAll'),N=document.getElementById('v0460RunNext'),st=document.getElementById('v0460Status');A.disabled=N.disabled=true;
 try{
   let x=v0460Load();
   do{
     await v0461WaitIfPaused();
     const s=V0460_STEPS.find(q=>!x.steps[q[0]]);if(!s)break;v0462SetActive(s[0],0,0,'');
     st.textContent='Kör '+s[1];v0461Live(`Arbetar · ${s[1]}`);v0461Log(`Startar ${s[1]}`);
     const r=await v0460Step(s[0],x);
     x.steps[s[0]]={...r,completedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:x.base?.dataFingerprint};
     if(s[0]==='final')x.completed=true;v0460Save(x);v0460Paint();v0461Log(`${s[1]} · ${r.status}`);
     if(all && s[0]==='integrity' && r.status==='FAIL'){st.textContent='⛔ Validation Suite stoppad efter Integrity FAIL.';v0461Live('Stoppad · Integrity FAIL',false);break}
     if(!all)break;
   }while(true);
   if(V0461_CANCEL)st.textContent='Avbruten · sparade checkpoints ligger kvar.';
   else if(v0460Load().completed){st.textContent='✓ Validation Suite klar.';v0461Live('Klar',false)}
   else if(!st.textContent.includes('Integrity FAIL')){st.textContent='✓ Steget sparat.';v0461Live('Väntar på nästa steg',false)}
 }catch(e){
   const msg=e?.message||String(e);
   if(msg==='Avbruten av användaren'){st.textContent='Avbruten · senaste checkpoint är sparad.';v0461Live('Avbruten',false)}
   else{st.textContent='Pausad efter fel: '+msg+' · fortsätt från senaste checkpoint.';v0461Live('Fel · checkpoint sparad',false);v0461Log('Körfel: '+msg)}
 }finally{
   V0460_RUNNING=false;A.disabled=N.disabled=false;v0461Buttons(false);v0461StopClock();document.body.classList.remove('v0462-running');v0462SetActive(null,0,0,'');v0460Paint();
 }
}
function v0460Report(){const x=v0460Load(),L=['LINAS OPTI – VALIDATION SUITE','Version: '+APP_VERSION,'Handel: AVSTÄNGD','Regelhash: '+V0460_RULE_HASH,'Datafingerprint: '+(x.base?.dataFingerprint||'—'),'Close >=83% fryst kandidat',''];V0460_STEPS.forEach((s,i)=>{const r=x.steps[s[0]];L.push(`${i+1}. ${s[1]} | ${r?.status||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('','Ingen automatisk parameteroptimering har startats. PASS är inte garanti för framtida avkastning.');return L.join('\n')}
function v0460Dl(text,name,type='text/plain'){const b=new Blob([text],{type}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),500)}
function v0460Backup(){const x={backupSchema:V0460_BACKUP_SCHEMA,appVersion:APP_VERSION,exportedAt:new Date().toISOString(),validation:v0460Load(),simulations:v0413GetSims(),validationSimLedger:JSON.parse(localStorage.getItem(V0460_SIM_LEDGER_KEY)||'{}'),baseCheckpoint:v0461LoadBaseCp(),pboCheckpoint:v0462LoadPboCp()};v0460Dl(JSON.stringify(x,null,2),`LINAS_OPTI_BACKUP_V0462_${new Date().toISOString().slice(0,10)}.json`,'application/json')}
async function v0460Restore(f){const st=document.getElementById('v0460Status');try{const x=JSON.parse(await f.text());if(x.backupSchema!==V0460_BACKUP_SCHEMA||x.validation?.rulesHash!==V0460_RULE_HASH)throw Error('Fel backup eller regelgeneration');localStorage.setItem(V0460_KEY,JSON.stringify(x.validation));if(x.validationSimLedger)localStorage.setItem(V0460_SIM_LEDGER_KEY,JSON.stringify(x.validationSimLedger));if(x.baseCheckpoint)localStorage.setItem(V0461_BASE_CP_KEY,JSON.stringify(x.baseCheckpoint));if(x.pboCheckpoint)localStorage.setItem(V0462_PBO_CP_KEY,JSON.stringify(x.pboCheckpoint));if(Number.isFinite(x.simulations))localStorage.setItem(V0413_SIM_KEY,String(Math.max(v0413GetSims(),x.simulations)));st.textContent='✓ Backup återställd';v0460Paint()}catch(e){st.textContent='Återställning misslyckades: '+e.message}}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v0460RunAll')?.addEventListener('click',()=>v0460Run(true));document.getElementById('v0460RunNext')?.addEventListener('click',()=>v0460Run(false));document.getElementById('v0460FinalReport')?.addEventListener('click',()=>v0460Dl(v0460Report(),`LINAS_OPTI_VALIDATION_SUITE_V0462_${new Date().toISOString().slice(0,10)}.txt`));document.getElementById('v0460Raw')?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0460Load(),null,2),`LINAS_OPTI_VALIDATION_RAW_V0462_${new Date().toISOString().slice(0,10)}.json`,'application/json'));document.getElementById('v0460Backup')?.addEventListener('click',v0460Backup);
document.getElementById('v0461Pause')?.addEventListener('click',()=>{if(!V0460_RUNNING)return;V0461_PAUSED=true;v0461Buttons(true);v0461Log('Paus begärd')});
document.getElementById('v0461Resume')?.addEventListener('click',()=>{if(!V0460_RUNNING)return;V0461_PAUSED=false;v0461Buttons(true);v0461Live('Fortsätter…');v0461Log('Körning fortsätter')});
document.getElementById('v0461Cancel')?.addEventListener('click',()=>{if(!V0460_RUNNING)return;V0461_CANCEL=true;V0461_PAUSED=false;v0461Log('Avbrott begärt')});document.getElementById('v0460Restore')?.addEventListener('change',e=>{if(e.target.files?.[0])v0460Restore(e.target.files[0]);e.target.value=''});document.getElementById('v0460HelpClose')?.addEventListener('click',()=>document.getElementById('v0460HelpModal').hidden=true);document.getElementById('v0462DetailClose')?.addEventListener('click',()=>document.getElementById('v0462DetailModal').hidden=true);
document.getElementById('v0462ExportTest')?.addEventListener('click',()=>{if(!V0462_DETAIL_ID)return;const x=v0460Load(),r=x.steps[V0462_DETAIL_ID];if(!r)return;v0460Dl(v0462TestReport(V0462_DETAIL_ID,r),`LINAS_OPTI_TEST_${V0462_DETAIL_ID.toUpperCase()}_V0462_${new Date().toISOString().slice(0,10)}.txt`)});
document.getElementById('v0462RerunTest')?.addEventListener('click',()=>{if(!V0462_DETAIL_ID)return;document.getElementById('v0462DetailModal').hidden=true;v0462Rerun(V0462_DETAIL_ID)});document.getElementById('v0462DetailModal')?.addEventListener('click',e=>{if(e.target.id==='v0462DetailModal')e.currentTarget.hidden=true});v0460Paint();const j=document.getElementById('v0413LabJump');if(j){j.value='v0460Lab';try{localStorage.setItem('linasopti_testlab_selected_v0423','v0460Lab')}catch{}j.dispatchEvent(new Event('change'))}});

// ============================================================
// V0.45.14 – ROBUSTNESS LAB 1 · PBO / DSR
// Ingen strategiregel ändras. Close 83% är fryst kandidat.
// PBO/DSR appliceras endast på den jämförbara close-familjen
// 77/80/83/86% över 2023–2026. Trial ledger redovisas separat.
// ============================================================
const V04514_VARIANTS=[
 {id:'c77',close:.77,name:'77%'},
 {id:'c80',close:.80,name:'80%'},
 {id:'c83',close:.83,name:'83% · fryst kandidat'},
 {id:'c86',close:.86,name:'86% · kontroll'}
];
const V04514_TRIAL_LEDGER=[
 ['Exit Lab 1',3,'nej'],
 ['Exit Lab 2 · exit-grid',625,'nej'],
 ['Entry Lab 1 · entry-grid',625,'nej'],
 ['Entry Lab 2 · frysta kandidater',4,'nej'],
 ['Regim Lab 1',5,'nej'],
 ['Regim Lab 2',2,'nej'],
 ['Kapital Lab 1',4,'nej'],
 ['Kapital Lab 2',4,'nej'],
 ['Signal Lab 3 · close-familj',4,'JA'],
 ['Signal Lab 4 · 83 mot 86',2,'nej']
];
const V04514_DOCUMENTED_TRIALS=V04514_TRIAL_LEDGER.reduce((a,x)=>a+x[1],0); // 1278
const V04514_CHECKPOINT_KEY='linasopti_robustness1_close_cscv_checkpoint_v04514';
let V04514_RESULT=null,V04514_RUNNING=false;

function v04514FreshStates(){return V04514_VARIANTS.map(v=>({id:v.id,name:v.name,close:v.close,eq:100000,peak:100000,dd:0,closed:[],curve:[],utilSum:0,utilN:0,maxConcurrent:0,monthly:[]}))}
function v04514Save(nextIndex,states){try{localStorage.setItem(V04514_CHECKPOINT_KEY,JSON.stringify({version:'V0.45.14',nextIndex,states,savedAt:new Date().toISOString()}));return true}catch{return false}}
function v04514Load(){try{const x=JSON.parse(localStorage.getItem(V04514_CHECKPOINT_KEY)||'null');return x&&x.version==='V0.45.14'&&Number.isInteger(x.nextIndex)&&Array.isArray(x.states)?x:null}catch{return null}}
function v04514Clear(){try{localStorage.removeItem(V04514_CHECKPOINT_KEY)}catch{}}
function v04514RunLabel(cp=false){const b=document.getElementById('v04514Run');if(b)b.textContent=cp?'▶ Fortsätt Robustness Lab 1':'▶ Kör Robustness Lab 1'}

function v04514Mean(a){return a.length?a.reduce((s,x)=>s+x,0)/a.length:0}
function v04514Std(a){if(a.length<2)return 0;const m=v04514Mean(a);return Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/(a.length-1))}
function v04514Sharpe(a){const sd=v04514Std(a);return sd?v04514Mean(a)/sd*Math.sqrt(12):0}
function v04514Skew(a){if(a.length<3)return 0;const m=v04514Mean(a),sd=Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/a.length);if(!sd)return 0;return a.reduce((s,x)=>s+Math.pow((x-m)/sd,3),0)/a.length}
function v04514Kurt(a){if(a.length<4)return 3;const m=v04514Mean(a),sd=Math.sqrt(a.reduce((s,x)=>s+(x-m)*(x-m),0)/a.length);if(!sd)return 3;return a.reduce((s,x)=>s+Math.pow((x-m)/sd,4),0)/a.length}
function v04514Phi(x){const t=1/(1+.2316419*Math.abs(x)),d=.3989422804014327*Math.exp(-x*x/2),p=1-d*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return x>=0?p:1-p}
function v04514InvPhi(p){
 if(p<=0)return -Infinity;if(p>=1)return Infinity;
 const a=[-39.6968302866538,220.946098424521,-275.928510446969,138.357751867269,-30.6647980661472,2.50662827745924];
 const b=[-54.4760987982241,161.585836858041,-155.698979859887,66.8013118877197,-13.2806815528857];
 const c=[-.00778489400243029,-.322396458041136,-2.40075827716184,-2.54973253934373,4.37466414146497,2.93816398269878];
 const d=[.00778469570904146,.32246712907004,2.445134137143,3.75440866190742],pl=.02425,ph=1-pl;let q,r;
 if(p<pl){q=Math.sqrt(-2*Math.log(p));return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
 if(p>ph){q=Math.sqrt(-2*Math.log(1-p));return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)}
 q=p-.5;r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)
}
function v04514Combinations(n,k){const out=[];function rec(start,a){if(a.length===k){out.push([...a]);return}for(let i=start;i<=n-(k-a.length);i++){a.push(i);rec(i+1,a);a.pop()}}rec(0,[]);return out}
function v04514Blocks(T,S=8){const out=[],base=Math.floor(T/S),extra=T%S;let p=0;for(let s=0;s<S;s++){const len=base+(s<extra?1:0),a=[];for(let j=0;j<len;j++)a.push(p++);out.push(a)}return out}
function v04514CSCV(states){
 const T=Math.min(...states.map(s=>s.monthly.length));if(T<16)return {pbo:NaN,medianLambda:NaN,combos:0};
 const blocks=v04514Blocks(T,8),combos=v04514Combinations(8,4),lambdas=[];
 for(const trainBlocks of combos){
   const trainSet=new Set(trainBlocks),trainIdx=[],testIdx=[];
   blocks.forEach((b,i)=>(trainSet.has(i)?trainIdx:testIdx).push(...b));
   const isSR=states.map(s=>v04514Sharpe(trainIdx.map(i=>s.monthly[i]?.ret||0)));
   let pick=0;for(let j=1;j<isSR.length;j++)if(isSR[j]>isSR[pick])pick=j;
   const osSR=states.map(s=>v04514Sharpe(testIdx.map(i=>s.monthly[i]?.ret||0))),picked=osSR[pick];
   const sorted=[...osSR].sort((a,b)=>a-b);
   let rank=sorted.findIndex(x=>x>=picked-1e-12)+1;if(rank<1)rank=1;
   const w=rank/(states.length+1),lambda=Math.log(w/(1-w));lambdas.push(lambda);
 }
 const sortedL=[...lambdas].sort((a,b)=>a-b),med=sortedL[Math.floor(sortedL.length/2)],pbo=lambdas.filter(x=>x<=0).length/lambdas.length;
 return {pbo,medianLambda:med,combos:lambdas.length};
}
function v04514DSR(states){
 const srs=states.map(s=>v04514Sharpe(s.monthly.map(x=>x.ret))),sigmaSR=v04514Std(srs),N=states.length,gamma=.5772156649015329;
 const srStar=sigmaSR*((1-gamma)*v04514InvPhi(1-1/N)+gamma*v04514InvPhi(1-1/(N*Math.E)));
 const cand=states.find(s=>s.id==='c83'),r=cand.monthly.map(x=>x.ret),sr=v04514Sharpe(r),sk=v04514Skew(r),ku=v04514Kurt(r),T=r.length;
 const denom=Math.sqrt(Math.max(1e-12,1-sk*sr+((ku-1)/4)*sr*sr));
 const z=(sr-srStar)*Math.sqrt(Math.max(1,T-1))/denom;
 return {dsr:v04514Phi(z),sr,srStar,skew:sk,kurt:ku,sigmaSR};
}
function v04514Analyze(states){return {cscv:v04514CSCV(states),dsr:v04514DSR(states),documentedTrials:V04514_DOCUMENTED_TRIALS}}

function v04514Paint(){
 const sum=document.getElementById('v04514Summary'),mb=document.getElementById('v04514MetricRows'),vb=document.getElementById('v04514VariantRows'),tb=document.getElementById('v04514TrialRows'),share=document.getElementById('v04514Share');
 if(tb)tb.innerHTML=V04514_TRIAL_LEDGER.map(x=>`<tr><td>${x[0]}</td><td>${x[1].toLocaleString('sv-SE')}</td><td>${x[2]}</td></tr>`).join('')+`<tr><td><b>Dokumenterat minimum</b></td><td><b>${V04514_DOCUMENTED_TRIALS.toLocaleString('sv-SE')}</b></td><td>trial pressure</td></tr>`;
 if(!sum||!mb||!vb)return;
 if(!V04514_RESULT){sum.textContent='Ingen robusthetskörning ännu.';mb.innerHTML='';vb.innerHTML='';if(share)share.disabled=true;return}
 const {states,analysis}=V04514_RESULT,{cscv,dsr}=analysis,cand=states.find(s=>s.id==='c83');
 const pboTxt=Number.isFinite(cscv.pbo)?`${(cscv.pbo*100).toFixed(1)}%`:'—',dsrTxt=Number.isFinite(dsr.dsr)?`${(dsr.dsr*100).toFixed(1)}%`:'—';
 const pboInterp=!Number.isFinite(cscv.pbo)?'otillräcklig data':cscv.pbo<=.20?'låg close-familj-overfitrisk':cscv.pbo<=.50?'måttlig / osäker':'hög overfitrisk';
 const dsrInterp=!Number.isFinite(dsr.dsr)?'otillräcklig data':dsr.dsr>=.95?'starkt inom close-familjen':dsr.dsr>=.80?'visst stöd, ej starkt':'svagt statistiskt stöd';
 sum.innerHTML=`Close 83% är fortfarande <b>fryst kandidat</b>. PBO ${pboTxt} · DSR ${dsrTxt}. Dessa mått gäller endast 77/80/83/86-familjen, inte hela Linas ${V04514_DOCUMENTED_TRIALS.toLocaleString('sv-SE')}+ dokumenterade trials.`;
 mb.innerHTML=[
   ['CSCV/PBO',pboTxt,`${pboInterp} · ${cscv.combos} train/test-kombinationer`],
   ['Median logit λ',Number.isFinite(cscv.medianLambda)?cscv.medianLambda.toFixed(3):'—','positiv är bättre; negativ betyder vald IS-vinnare hamnar under OOS-median'],
   ['Deflated Sharpe',dsrTxt,dsrInterp],
   ['83% månads-SR',dsr.sr.toFixed(3),`tröskel efter 4 jämförbara close-trials: ${dsr.srStar.toFixed(3)}`],
   ['Dokumenterade trials',V04514_DOCUMENTED_TRIALS.toLocaleString('sv-SE'),'separat trial pressure; används inte som falskt jämförbar PBO-familj']
 ].map(x=>`<tr><td><b>${x[0]}</b></td><td>${x[1]}</td><td>${x[2]}</td></tr>`).join('');
 vb.innerHTML=states.map(s=>{const rs=s.monthly.map(x=>x.ret),sr=v04514Sharpe(rs),pos=rs.filter(x=>x>0).length;return `<tr><td><b>${s.name}</b></td><td>${sr.toFixed(3)}</td><td>${(v04514Mean(rs)*100).toFixed(3)}%</td><td>${pos}/${rs.length}</td><td>${s.eq.toFixed(0)} kr</td></tr>`}).join('');
 if(share)share.disabled=false;
}
async function v04514Run(){
 if(V04514_RUNNING)return;V04514_RUNNING=true;
 const run=document.getElementById('v04514Run'),st=document.getElementById('v04514Status'),bar=document.getElementById('v04514Bar'),months=v0440Months();run.disabled=true;
 const saved=v04514Load();let start=saved?Math.max(0,Math.min(months.length,saved.nextIndex)):0,states=saved?saved.states:v04514FreshStates();
 if(start>=months.length){v04514Clear();start=0;states=v04514FreshStates()}
 try{
  if(saved&&start>0){st.textContent=`Återupptar Robustness Lab 1 från ${start}/${months.length} månader…`;bar.style.width=`${start/months.length*100}%`}
  for(let i=start;i<months.length;i++){
   const w=months[i];st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · ${w.label} · återkör 4 close-varianter…`;bar.style.width=`${i/months.length*100}%`;
   const j=await v0440FetchMonth(w,st),rows=j.rows||[];if(!rows.length)throw new Error(`Ingen 5-min-data för ${w.label}`);
   for(const state of states){
     const before=state.eq,r=v04511Engine(rows,state.eq,state.close);state.eq=r.eq;
     state.monthly.push({label:w.label,ret:before?state.eq/before-1:0});
     state.utilSum+=r.utilSum;state.utilN+=r.utilN;state.maxConcurrent=Math.max(state.maxConcurrent,r.maxConcurrent);
     for(const t of r.closed)state.closed.push(t);for(const c of r.curve){state.peak=Math.max(state.peak,c.v);state.dd=Math.min(state.dd,c.v/state.peak-1);state.curve.push(c)}
   }
   v04514Save(i+1,states);v0413AddSims(4);bar.style.width=`${(i+1)/months.length*100}%`;await v0406Yield(20);
  }
  V04514_RESULT={from:'2023-01-01',to:'2026-09-30',states,analysis:v04514Analyze(states)};
  v04514Clear();v04514Paint();v04514RunLabel(false);st.textContent='✓ Robustness Lab 1 klart · CSCV/PBO + DSR beräknade för close-familjen.';
 }catch(e){
  const cp=v04514Load(),done=cp?.nextIndex||start;bar.style.width=`${done/months.length*100}%`;v04514RunLabel(done>0);st.textContent=`Robustness Lab 1 avbröts efter ${done}/${months.length} månader. Checkpoint sparad. (${e?.message||e})`;
 }finally{V04514_RUNNING=false;run.disabled=false}
}
function v04514Report(){
 if(!V04514_RESULT)return'';const {states,analysis}=V04514_RESULT,{cscv,dsr}=analysis,L=[
 'LINAS OPTI – ROBUSTNESS LAB 1 · PBO / DSR','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historisk robusthetsanalys)','','FRYST KANDIDAT: close >=83%','JÄMFÖRELSEFAMILJ: 77% / 80% / 83% / 86%','PERIOD: 2023-01-01 → 2026-09','',
 'SYFTE','Ingen strategiparameter optimeras eller ändras. Labbet mäter hur stabilt close-valet är när samma fyra förregistrerade close-varianter bedöms över månadsblock.','','RESULTAT',
 `CSCV/PBO: ${(cscv.pbo*100).toFixed(1)}% (${cscv.combos} kombinationer)`,
 `Median logit lambda: ${cscv.medianLambda.toFixed(4)}`,
 `Deflated Sharpe, close-familj: ${(dsr.dsr*100).toFixed(1)}%`,
 `83% månads-SR: ${dsr.sr.toFixed(4)}`,
 `DSR referenströskel efter 4 close-trials: ${dsr.srStar.toFixed(4)}`,
 `Dokumenterat research trial minimum: ${V04514_DOCUMENTED_TRIALS}`,
 '','CLOSE-FAMILJ'];
 for(const s of states){const r=s.monthly.map(x=>x.ret);L.push(`${s.name} | månads-SR ${v04514Sharpe(r).toFixed(4)} | snitt/mån ${(v04514Mean(r)*100).toFixed(4)}% | positiva månader ${r.filter(x=>x>0).length}/${r.length} | slut ${s.eq.toFixed(2)} kr`)}
 L.push('','TRIAL LEDGER');for(const x of V04514_TRIAL_LEDGER)L.push(`${x[0]} | ${x[1]} varianter | PBO/DSR här: ${x[2]}`);
 L.push('','METODNOT','PBO/DSR i detta labb gäller endast den jämförbara close-familjen. Äldre exit-, entry-, regim- och kapitallabb redovisas som trial pressure men blandas inte in i samma PBO/DSR-beräkning eftersom de inte utgör en homogen kandidatmatris.','CSCV använder 8 balanserade kronologiska block och alla 70 kombinationer av 4 block som in-sample mot återstående 4 som out-of-sample.','83% valdes före denna robusthetskörning; labbet väljer inte om close-tröskeln.','','FORSKNINGSDISCIPLIN','Ett bra PBO/DSR-resultat är inte bevis för framtida lönsamhet. Ett svagt resultat är däremot en tydlig varningssignal mot att gå vidare utan omprövning.');
 return L.join('\n');
}
async function v04514Share(){
 const st=document.getElementById('v04514Status');if(!V04514_RESULT){if(st)st.textContent='Ingen Robustness Lab 1-rapport finns ännu.';return false}
 const text=v04514Report(),date=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_ROBUSTNESS_LAB_1_PBO_DSR_V04514_${date}.txt`;
 if(!v0451IsIOS()){v0451DownloadText(text,name);if(st)st.textContent=`✓ Robustness Lab 1-rapport nedladdad: ${name}`;return true}
 const file=new File([text],name,{type:'text/plain;charset=utf-8'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Robustness Lab 1',files:[file]});return true}}catch(e){if(e?.name==='AbortError')return false}
 v0451DownloadText(text,name);return true;
}
window.addEventListener('DOMContentLoaded',()=>{
 document.getElementById('v04514Run')?.addEventListener('click',v04514Run);
 document.getElementById('v04514Share')?.addEventListener('click',v04514Share);
 v04514Paint();
 const jump=document.getElementById('v0413LabJump');if(jump){/* V0.46.0 owns latest selection */}
 const cp=v04514Load();if(cp&&cp.nextIndex>0){const st=document.getElementById('v04514Status'),bar=document.getElementById('v04514Bar'),months=v0440Months();if(st)st.textContent=`Sparad delkörning ${cp.nextIndex}/${months.length} månader · tryck Fortsätt.`;if(bar)bar.style.width=`${cp.nextIndex/months.length*100}%`;v04514RunLabel(true)}
});


// ============================================================
// V0.45.13 – SIGNAL LAB 4 · CLOSE 83 HOLDOUT
// 83% fryst kandidat mot 86% fryst kontroll på 2021–2022.
// Perioden användes inte för att formulera/välja 83%-hypotesen.
// Detta är holdout för close-frågan, inte globalt jungfrulig OOS för hela Jägaren.
// Simräknaren räknar nu varje färdig variant×månad efter checkpoint.
// ============================================================
const V04513_VARIANTS=[
 {id:'c83',close:.83,name:'83% · fryst kandidat'},
 {id:'c86',close:.86,name:'86% · kontroll'}
];
const V04513_CHECKPOINT_KEY='linasopti_signallab4_close83_holdout_checkpoint_v04513';
let V04513_RESULT=null,V04513_RUNNING=false;
function v04513Months(){const out=[];for(let y=2021;y<=2022;y++)for(let m=0;m<12;m++){const s=`${y}-${String(m+1).padStart(2,'0')}-01`;let ny=y,nm=m+1;if(nm===12){ny++;nm=0}const e=`${ny}-${String(nm+1).padStart(2,'0')}-01`;out.push({s,e,label:`${y}-${String(m+1).padStart(2,'0')}`})}return out}
function v04513FreshStates(){return V04513_VARIANTS.map(v=>({id:v.id,name:v.name,close:v.close,eq:100000,peak:100000,dd:0,closed:[],curve:[],utilSum:0,utilN:0,maxConcurrent:0,years:[],yearStart:100000}))}
function v04513Save(nextIndex,states){try{localStorage.setItem(V04513_CHECKPOINT_KEY,JSON.stringify({version:'V0.45.13',nextIndex,states,savedAt:new Date().toISOString()}));return true}catch{return false}}
function v04513Load(){try{const x=JSON.parse(localStorage.getItem(V04513_CHECKPOINT_KEY)||'null');return x&&x.version==='V0.45.13'&&Number.isInteger(x.nextIndex)&&Array.isArray(x.states)?x:null}catch{return null}}
function v04513Clear(){try{localStorage.removeItem(V04513_CHECKPOINT_KEY)}catch{}}
function v04513RunLabel(cp=false){const b=document.getElementById('v04513Run');if(b)b.textContent=cp?'▶ Fortsätt Signal Lab 4 från sparad punkt':'▶ Kör Signal Lab 4 · 83% mot 86%'}
function v04513Stats(v){const w=v.closed.filter(x=>x.pnl>0),l=v.closed.filter(x=>x.pnl<0),gw=w.reduce((a,x)=>a+x.pnl,0),gl=Math.abs(l.reduce((a,x)=>a+x.pnl,0));return {ret:v.eq/100000-1,pf:gl?gw/gl:(gw?Infinity:0),wr:v.closed.length?w.length/v.closed.length:0,util:v.utilN?v.utilSum/v.utilN:0}}
function v04513Paint(){const sum=document.getElementById('v04513Summary'),body=document.getElementById('v04513Rows'),yb=document.getElementById('v04513YearRows'),share=document.getElementById('v04513Share');if(!sum||!body)return;if(!V04513_RESULT){sum.textContent='Ingen körning ännu.';body.innerHTML='';if(yb)yb.innerHTML='';if(share)share.disabled=true;return}body.innerHTML=V04513_RESULT.variants.map(v=>{const s=v04513Stats(v);return `<tr><td><b>${v.name}</b></td><td>${v.eq.toFixed(0)} kr</td><td class="${s.ret>=0?'good':'bad'}">${(s.ret*100).toFixed(2)}%</td><td>${v.closed.length}</td><td>${v0411FmtPF(s.pf)}</td><td>${(s.wr*100).toFixed(1)}%</td><td>${(v.dd*100).toFixed(2)}%</td><td>${(s.util*100).toFixed(1)}%</td></tr>`}).join('');const a=V04513_RESULT.variants[0],b=V04513_RESULT.variants[1],sa=v04513Stats(a),sb=v04513Stats(b);sum.innerHTML=`Holdout 2021–2022 klar. <b>83% mot 86%:</b> avkastning ${(sa.ret*100).toFixed(2)}% mot ${(sb.ret*100).toFixed(2)}% · PF ${v0411FmtPF(sa.pf)} mot ${v0411FmtPF(sb.pf)} · affärer ${a.closed.length} mot ${b.closed.length}.`;if(yb)yb.innerHTML=V04513_RESULT.variants.flatMap(v=>v.years.map(y=>`<tr><td>${v.name}</td><td>${y.year}</td><td>${y.start.toFixed(0)}</td><td>${y.end.toFixed(0)}</td><td>${((y.end/y.start-1)*100).toFixed(2)}%</td><td>${y.n}</td></tr>`)).join('');if(share)share.disabled=false}
async function v04513Run(){if(V04513_RUNNING)return;V04513_RUNNING=true;const run=document.getElementById('v04513Run'),st=document.getElementById('v04513Status'),bar=document.getElementById('v04513Bar'),months=v04513Months();run.disabled=true;const saved=v04513Load();let start=saved?Math.max(0,Math.min(months.length,saved.nextIndex)):0,states=saved?saved.states:v04513FreshStates();if(start>=months.length){v04513Clear();start=0;states=v04513FreshStates()}try{if(saved&&start>0){st.textContent=`Återupptar Signal Lab 4 från ${start}/${months.length} färdiga månader…`;bar.style.width=`${start/months.length*100}%`}for(let i=start;i<months.length;i++){const w=months[i];st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label} och kör 83% + 86%…`;bar.style.width=`${i/months.length*100}%`;const j=await v0440FetchMonth(w,st),rows=j.rows||[];if(!rows.length)throw new Error(`Ingen 5-min-data returnerades för ${w.label}. Holdout kan inte valideras på tom data.`);for(const state of states){const r=v04511Engine(rows,state.eq,state.close);state.eq=r.eq;state.utilSum+=r.utilSum;state.utilN+=r.utilN;state.maxConcurrent=Math.max(state.maxConcurrent,r.maxConcurrent);for(const t of r.closed)state.closed.push(t);for(const c of r.curve){state.peak=Math.max(state.peak,c.v);state.dd=Math.min(state.dd,c.v/state.peak-1);state.curve.push(c)}const y=+w.label.slice(0,4),nextY=i===months.length-1?null:+months[i+1].label.slice(0,4);if(nextY!==y){const n=state.closed.filter(t=>+v0440NY(t.entryTime).d.slice(0,4)===y).length;state.years.push({year:y,start:state.yearStart,end:state.eq,n});state.yearStart=state.eq}}
 // Checkpoint first; only then count the two completed variant×month simulations.
 v04513Save(i+1,states);v0413AddSims(2);bar.style.width=`${(i+1)/months.length*100}%`;await v0406Yield(20)}
 V04513_RESULT={from:'2021-01-01',to:'2022-12-31',variants:states};v04513Clear();v04513Paint();v04513RunLabel(false);st.textContent='✓ Signal Lab 4 klart · 83% och 86% jämförda på close-holdout 2021–2022.'}catch(e){const cp=v04513Load(),done=cp?.nextIndex||start;bar.style.width=`${done/months.length*100}%`;v04513RunLabel(done>0);st.textContent=`Signal Lab 4 avbröts efter ${done}/${months.length} färdiga månader. Delkörningen är sparad. (${e?.message||e})`}finally{V04513_RUNNING=false;run.disabled=false}}
function v04513Report(){if(!V04513_RESULT)return'';const L=['LINAS OPTI – SIGNAL LAB 4 · CLOSE 83 HOLDOUT','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest/förregistrerad validering)','','STARTKAPITAL: 100 000 kr','PERIOD: 2021-01-01 → 2022-12-31','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','FÖRREGISTRERAD HYPOTES','Signal Lab 3 utsåg close ≥83% till forskningskandidat mot den gamla 86%-kontrollen. Endast dessa två jämförs här.','','METOD','83% är fryst kandidat. 86% är fryst kontroll.','Alla övriga regler är identiska: PRO2, m3, volymkrav, Strong, Day Selection, exit, risk, tre samtidiga positioner, 33,3% max per position, max 4 entries/dag och friktion.','2021–2022 användes inte för att formulera eller välja 83%-kandidaten i Signal Lab 2/3. Perioden är därför holdout för close-hypotesen. Den är INTE globalt orörd OOS för hela Jägaren, eftersom äldre labb har använt delar av 2021–2022.','','RESULTAT'];for(const v of V04513_RESULT.variants){const s=v04513Stats(v);L.push(`${v.name} | slut ${v.eq.toFixed(2)} kr | avkastning ${(s.ret*100).toFixed(2)}% | affärer ${v.closed.length} | PF ${v0411FmtPF(s.pf)} | WR ${(s.wr*100).toFixed(1)}% | max DD ${(v.dd*100).toFixed(2)}% | snitt kapital i arbete ${(s.util*100).toFixed(1)}% | max samtidiga ${v.maxConcurrent}`)}L.push('','ÅRSRESULTAT');for(const v of V04513_RESULT.variants){L.push('',v.name.toUpperCase());for(const y of v.years)L.push(`${y.year} | ${y.start.toFixed(2)} → ${y.end.toFixed(2)} | ${((y.end/y.start-1)*100).toFixed(2)}% | ${y.n} affärer`)}L.push('','RÄKNARFIX V0.45.13','Simuleringsräknaren migreras till verifierat minimum 19 922: tidigare 19 742 t.o.m. Signal Lab 2 + 180 färdiga variant×månad-enheter i Signal Lab 3. Signal Lab 4 räknar därefter +2 först efter varje sparad månadscheckpoint.','','FORSKNINGSDISCIPLIN','Resultatet validerar endast close 83%-hypotesen mot 86%-kontrollen på data som inte användes för att välja 83%. Det får inte beskrivas som helt oberoende OOS för hela strategin.');return L.join('\n')}
async function v04513Share(){const st=document.getElementById('v04513Status');if(!V04513_RESULT){if(st)st.textContent='Ingen Signal Lab 4-rapport finns ännu.';return false}const text=v04513Report(),date=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_SIGNAL_LAB_4_CLOSE83_HOLDOUT_V04513_${date}.txt`;if(!v0451IsIOS()){v0451DownloadText(text,name);if(st)st.textContent=`✓ Signal Lab 4-rapport nedladdad: ${name}`;return true}const file=new File([text],name,{type:'text/plain;charset=utf-8'});try{if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]}))){await navigator.share({title:'Linas Opti Signal Lab 4',files:[file]});return true}}catch(e){if(e?.name==='AbortError')return false}v0451DownloadText(text,name);return true}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v04513Run')?.addEventListener('click',v04513Run);document.getElementById('v04513Share')?.addEventListener('click',v04513Share);v04513Paint();const jump=document.getElementById('v0413LabJump');if(jump){/* V0.45.14: Robustness Lab 1 owns latest-lab selection. */}const cp=v04513Load();if(cp&&cp.nextIndex>0){const st=document.getElementById('v04513Status'),bar=document.getElementById('v04513Bar'),months=v04513Months();if(st)st.textContent=`Sparad delkörning ${cp.nextIndex}/${months.length} månader · tryck Fortsätt.`;if(bar)bar.style.width=`${cp.nextIndex/months.length*100}%`;v04513RunLabel(true)}});


// ============================================================
// V0.45.8 – SIGNAL LAB 1 · FILTERTRATTEN
// Diagnostik på exakt samma frysta Jägare. Ingen parameter ändras.
// Räknar hur observationer faller bort genom PRO2-kvalitet, Entry B
// och Strong-regim, samt bryter ned samma tratt per symbol och år.
// ============================================================
let V0458_RESULT=null,V0458_RUNNING=false;
const V0458_CHECKPOINT_KEY='linasopti_signallab1_checkpoint_v0458';
const V0458_STAGES=['raw','pro2','entryB','strong','approved'];
function v0458Bucket(){return {raw:0,pro2:0,entryB:0,strong:0,approved:0}}
function v0458Fresh(){return {total:v0458Bucket(),symbols:{},years:{},months:0}}
function v0458Inc(state,sym,year,stage){state.total[stage]++;(state.symbols[sym]??=v0458Bucket())[stage]++;(state.years[year]??=v0458Bucket())[stage]++}
function v0458Save(nextIndex,state){try{localStorage.setItem(V0458_CHECKPOINT_KEY,JSON.stringify({version:'V0.45.8',nextIndex,state,savedAt:new Date().toISOString()}));return true}catch{return false}}
function v0458Load(){try{const x=JSON.parse(localStorage.getItem(V0458_CHECKPOINT_KEY)||'null');return x&&x.version==='V0.45.8'&&Number.isInteger(x.nextIndex)&&x.state?x:null}catch{return null}}
function v0458Clear(){try{localStorage.removeItem(V0458_CHECKPOINT_KEY)}catch{}}
function v0458RunLabel(cp=false){const b=document.getElementById('v0458Run');if(b)b.textContent=cp?'▶ Fortsätt Signal Lab 1 från sparad punkt':'▶ Kör Signal Lab 1 · diagnostik'}
function v0458Analyze(rows){
 const byDay={},spy={};
 for(const r of rows){const z=v0440NY(r.t);if(z.m<570||z.m>=960)continue;if(r.symbol==='SPY')(spy[z.d]??=[]).push({...r,_m:z.m});else{(byDay[z.d]??={});(byDay[z.d][r.symbol]??=[]).push({...r,_m:z.m})}}
 const out=v0458Fresh();
 for(const d of Object.keys(byDay).sort()){
  const syms=byDay[d],sp=(spy[d]||[]).sort((a,b)=>new Date(a.t)-new Date(b.t));Object.values(syms).forEach(a=>a.sort((x,y)=>new Date(x.t)-new Date(y.t)));
  for(const [sym,a] of Object.entries(syms)){
   for(let i=15;i<a.length-1;i++){
    const b=a[i]; if(b._m<630||b._m>720)continue;
    const year=d.slice(0,4),hist=a.slice(i-14,i+1),prev=hist.at(-2),avgVol=hist.slice(0,-1).reduce((q,x)=>q+(+x.v||0),0)/14;
    const r1=b.c/prev.c-1,r3=b.c/a[i-3].c-1,r6=b.c/a[i-6].c-1,prev2=prev.c/a[i-2].c-1,range=Math.max(.000001,b.h-b.l),closeLoc=(b.c-b.l)/range,volRatio=avgVol?((+b.v||0)/avgVol):0,sma=hist.reduce((q,x)=>q+x.c,0)/hist.length,stretch=b.c/sma-1;
    v0458Inc(out,sym,year,'raw');
    const pro2=r1>0&&r6>=.0025&&b.c>sma&&stretch<=.020&&prev2>=-.005;
    if(!pro2)continue; v0458Inc(out,sym,year,'pro2');
    const entryB=r3>=.004&&r3<=.012&&closeLoc>=.86&&volRatio>=1.15&&volRatio<=3;
    if(!entryB)continue; v0458Inc(out,sym,year,'entryB');
    const spPast=sp.filter(x=>new Date(x.t)<=new Date(b.t));
    if(spPast.length<4)continue; const sc=spPast.at(-1),so=spPast[0],s15=spPast[Math.max(0,spPast.length-4)],dayRet=sc.c/so.o-1,m15=sc.c/s15.c-1;
    const strong=dayRet>=.001&&m15>=.0005;
    if(!strong)continue; v0458Inc(out,sym,year,'strong');
    const next=a[i+1]; if(!next||next._m>=950)continue; v0458Inc(out,sym,year,'approved');
   }
  }
 }
 return out;
}
function v0458Merge(a,b){for(const k of V0458_STAGES)a.total[k]+=b.total[k]||0;for(const [sym,x] of Object.entries(b.symbols||{})){const y=a.symbols[sym]??=v0458Bucket();for(const k of V0458_STAGES)y[k]+=x[k]||0}for(const [yr,x] of Object.entries(b.years||{})){const y=a.years[yr]??=v0458Bucket();for(const k of V0458_STAGES)y[k]+=x[k]||0}a.months++;return a}
function v0458Paint(){const sum=document.getElementById('v0458Summary'),body=document.getElementById('v0458Rows'),sb=document.getElementById('v0458SymbolRows'),yb=document.getElementById('v0458YearRows'),share=document.getElementById('v0458Share');if(!sum||!body)return;if(!V0458_RESULT){sum.textContent='Ingen körning ännu.';body.innerHTML='';if(sb)sb.innerHTML='';if(yb)yb.innerHTML='';if(share)share.disabled=true;return}const t=V0458_RESULT.total,names={raw:'Råa tekniska observationer',pro2:'Efter PRO2-kvalitet',entryB:'Efter Entry B',strong:'Efter Strong-regim',approved:'Slutligt godkända kandidater'},pct=(v,p)=>p?`${(v/p*100).toFixed(1)}%`:'—';let prev=null;body.innerHTML=V0458_STAGES.map(k=>{const v=t[k];const q=prev==null?'100,0%':pct(v,prev);prev=v;return `<tr><td>${names[k]}</td><td><b>${v.toLocaleString('sv-SE')}</b></td><td>${q}</td></tr>`}).join('');const raw=t.raw||1;sum.innerHTML=`<b>${t.approved.toLocaleString('sv-SE')} slutligt godkända kandidater</b><br>Av ${t.raw.toLocaleString('sv-SE')} råa observationer (${(t.approved/raw*100).toFixed(2)}%). Största relativa bortfallet syns i tabellen.`;const row=x=>`<td>${x.raw}</td><td>${x.pro2}</td><td>${x.entryB}</td><td>${x.strong}</td><td><b>${x.approved}</b></td>`;if(sb)sb.innerHTML=Object.entries(V0458_RESULT.symbols).sort((a,b)=>b[1].approved-a[1].approved).map(([k,x])=>`<tr><td><b>${k}</b></td>${row(x)}</tr>`).join('');if(yb)yb.innerHTML=Object.entries(V0458_RESULT.years).sort().map(([k,x])=>`<tr><td><b>${k}</b></td>${row(x)}</tr>`).join('');if(share)share.disabled=false}
async function v0458Run(){if(V0458_RUNNING)return;V0458_RUNNING=true;const run=document.getElementById('v0458Run'),st=document.getElementById('v0458Status'),bar=document.getElementById('v0458Bar'),months=v0440Months();run.disabled=true;const saved=v0458Load();let start=saved?Math.max(0,Math.min(months.length,saved.nextIndex)):0,state=saved?saved.state:v0458Fresh();if(start>=months.length){v0458Clear();start=0;state=v0458Fresh()}try{if(saved&&start>0){st.textContent=`Återupptar Signal Lab 1 från ${start}/${months.length} färdiga månader…`;bar.style.width=`${start/months.length*100}%`}for(let i=start;i<months.length;i++){const w=months[i];st.innerHTML=`<span class="v0406-spinner small"></span> ${i+1}/${months.length} · hämtar ${w.label} och mäter filtertratten…`;bar.style.width=`${i/months.length*100}%`;const j=await v0440FetchMonth(w,st),r=v0458Analyze(j.rows||[]);v0458Merge(state,r);v0458Save(i+1,state);bar.style.width=`${(i+1)/months.length*100}%`;await v0406Yield(20)}V0458_RESULT=state;v0413AddSims(1);v0458Clear();v0458Paint();v0458RunLabel(false);st.textContent='✓ Signal Lab 1 klart · filtertratten är kartlagd.'}catch(e){const cp=v0458Load(),done=cp?.nextIndex||start;bar.style.width=`${done/months.length*100}%`;v0458RunLabel(done>0);st.textContent=`Signal Lab 1 avbröts efter ${done}/${months.length} färdiga månader. Delkörningen är sparad. Tryck Fortsätt för att återuppta. (${e?.message||e})`}finally{V0458_RUNNING=false;run.disabled=false}}
function v0458Report(){if(!V0458_RESULT)return'';const t=V0458_RESULT.total,L=['LINAS OPTI – SIGNAL LAB 1 · FILTERTRATTEN','Version: '+APP_VERSION,'Handel: AVSTÄNGD (historiskt backtest/diagnostik)','','PERIOD: 2023-01-01 → 2026-09','FRYST DAY SELECTION: '+V0440_SYMBOLS.join(', '),'','METOD','Ingen strategi- eller signalparameter ändras. Samma frysta Jägare används.','Tratten mäter rå teknisk observation → PRO2-kvalitet → Entry B → Strong-regim → slutligt godkänd kandidat.','Syftet är att lokalisera var signalflödet försvinner efter Kapital Lab 3.','','TOTAL TRATT'];let prev=null;const names={raw:'Råa observationer',pro2:'PRO2-kvalitet',entryB:'Entry B',strong:'Strong-regim',approved:'Godkänd kandidat'};for(const k of V0458_STAGES){const v=t[k],share=prev==null?100:(prev?v/prev*100:0);L.push(`${names[k]}: ${v} | ${share.toFixed(2)}% av föregående steg`);prev=v}L.push('','PER SYMBOL','symbol|raw|pro2|entryB|strong|approved');for(const [sym,x] of Object.entries(V0458_RESULT.symbols).sort())L.push(`${sym}|${x.raw}|${x.pro2}|${x.entryB}|${x.strong}|${x.approved}`);L.push('','PER ÅR','år|raw|pro2|entryB|strong|approved');for(const [yr,x] of Object.entries(V0458_RESULT.years).sort())L.push(`${yr}|${x.raw}|${x.pro2}|${x.entryB}|${x.strong}|${x.approved}`);L.push('','TOLKNING','Ett stort relativt bortfall i ett steg visar var nästa forskningsfråga bör riktas. Resultatet ska inte användas för att ändra en tröskel utan ett separat förregistrerat test.','','OBS: 2023–2026 är inte ett nytt orört OOS-prov. Signal Lab 1 är diagnostik på frysta regler; det är inte en prognos.');return L.join('\n')}
async function v0458Share(){const st=document.getElementById('v0458Status');if(!V0458_RESULT){if(st)st.textContent='Ingen Signal Lab 1-rapport finns ännu. Kör labbet först.';return false}const text=v0458Report(),date=new Date().toISOString().slice(0,10),name=`LINAS_OPTI_SIGNAL_LAB_1_FILTERTRATTEN_V0458_${date}.txt`;if(!v0451IsIOS()){try{v0451DownloadText(text,name);if(st)st.textContent=`✓ Signal Lab 1-rapport nedladdad: ${name}`;return true}catch(e){if(st)st.textContent='Kunde inte ladda ner Signal Lab 1-rapporten.';return false}}const file=new File([text],name,{type:'text/plain;charset=utf-8'});try{if(navigator.share){if(!navigator.canShare||navigator.canShare({files:[file]})){await navigator.share({title:'Linas Opti Signal Lab 1',files:[file]});return true}await navigator.share({title:'Linas Opti Signal Lab 1',text});return true}}catch(e){if(e?.name==='AbortError')return false}try{v0451DownloadText(text,name);return true}catch{return false}}
window.addEventListener('DOMContentLoaded',()=>{document.getElementById('v0458Run')?.addEventListener('click',v0458Run);document.getElementById('v0458Share')?.addEventListener('click',v0458Share);v0458Paint();const jump=document.getElementById('v0413LabJump');if(jump){/* V0.45.12: legacy Signal Lab 1 init must never override the current Testlab selection. */}const cp=v0458Load();if(cp&&cp.nextIndex>0){const st=document.getElementById('v0458Status'),bar=document.getElementById('v0458Bar'),months=v0440Months();if(st)st.textContent=`Sparad delkörning ${cp.nextIndex}/${months.length} månader · tryck Fortsätt för att återuppta.`;if(bar)bar.style.width=`${cp.nextIndex/months.length*100}%`;v0458RunLabel(true)}});


// V0.45.12 – robust version paint + latest Testlab selection.
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('#appVersion,.v04512-gate-version').forEach(e=>e.textContent=APP_VERSION);
  const jump=document.getElementById('v0413LabJump');
  if(jump && [...jump.options].some(o=>o.value==='v04511Lab')){
    const key='linasopti_testlab_selected_v0423';
    let saved=''; try{saved=localStorage.getItem(key)||''}catch{}
    // Migrate older saved lab selections to the newest lab once after the upgrade.
    if(!saved || saved==='v0458Lab' || saved==='v0459Lab'){
      jump.value='v04511Lab';
      try{localStorage.setItem(key,'v04511Lab')}catch{}
      jump.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }
});

document.addEventListener('focusin',e=>{
 if(e.target?.id==='v0383Code' && document.body.classList.contains('v0384-locked')){
   // Never expose a prefilled credential from Lina itself.
   if(!e.target.dataset.v0463Touched){e.target.value='';e.target.dataset.v0463Touched='1'}
 }
});


// ============================================================
// V0.47.0 – VALIDATION SUITE B · EDGE & ROBUSTHET
// Post-Suite-A diagnostics on reused history. No optimization.
// ============================================================
const V0470_B_KEY='linasopti_validation_suite_b_v0470';
const V0470_B_SCHEMA='LINA-SUITE-B-1';
const V0470_B_TESTS=[
 ['edge','Edge per affär'],
 ['breakeven','Kostnads-headroom / break-even'],
 ['ladder','Friktionsstege 1,0×–2,0×'],
 ['loo','Leave-one-symbol-out'],
 ['exit','Exit-orsaker'],
 ['tod','Tid på dagen'],
 ['weekday','Veckodagar'],
 ['roll6','Rullande 6 månader'],
 ['roll12','Rullande 12 månader'],
 ['bootstrap','Bootstrap konfidensintervall'],
 ['tail','Svansrisk / förlustsviter'],
 ['concentration2','Vinstkoncentration topp 10%']
];
const V0470_B_HELP={
 suite:['Vad är Suite B?','Detta är en ny diagnostikgeneration efter Suite A. Den försöker förklara var Jägarens edge är stark eller skör. Den ändrar inga regler och är inte nytt orört OOS-bevis.'],
 edge:['Edge per affär','Visar genomsnitt, median, bruttovinster, bruttoförluster och PF för de observerade affärerna.'],
 breakeven:['Kostnads-headroom','Beräknar ungefär hur mycket den modellerade friktionen kan öka innan total P/L når noll. Större marginal är bättre.'],
 ladder:['Friktionsstege','Visar hur resultatet förändras vid flera fasta kostnadsnivåer. Detta är diagnostik, inte parameteroptimering.'],
 loo:['Leave-one-symbol-out','Tar bort en aktie i taget och räknar om resultatet. Om en enda aktie avgör allt är strategin koncentrerad.'],
 exit:['Exit-orsaker','Delar upp P/L och antal affärer efter mål, stop och max-tid. Visar var edge och förluster faktiskt uppstår.'],
 tod:['Tid på dagen','Delar affärerna i fasta 30-minutersfönster under entryperioden för att se tidskoncentration.'],
 weekday:['Veckodagar','Visar resultat per veckodag. Ett extremt beroende av en dag är en varningssignal.'],
 roll6:['Rullande 6 månader','Mäter varje sammanhängande 6-månadersperiod. Visar hur ofta strategin är positiv och hur svag den sämsta perioden är.'],
 roll12:['Rullande 12 månader','Samma idé över 12 månader. Längre fönster ger en lugnare bild av stabilitet över tid.'],
 bootstrap:['Bootstrap CI','Drar affärer med återläggning många gånger och uppskattar osäkerhetsintervall för genomsnittlig P/L per affär.'],
 tail:['Svansrisk','Visar största enskilda förlust, längsta förlustsvit och andelen P/L från de sämsta affärerna.'],
 concentration2:['Vinstkoncentration','Mäter hur stor del av total bruttovinst som kommer från de bästa 10% av affärerna. Extrem koncentration betyder att få affärer bär strategin.']
};
function v0470BNew(){return{schema:V0470_B_SCHEMA,appVersion:'V0.47.0',rulesHash:V0460_RULE_HASH,createdAt:new Date().toISOString(),tests:{},completed:false}}
function v0470BLoad(){try{const x=JSON.parse(localStorage.getItem(V0470_B_KEY)||'null');return x&&x.schema===V0470_B_SCHEMA&&x.rulesHash===V0460_RULE_HASH?x:v0470BNew()}catch{return v0470BNew()}}
function v0470BSave(x){x.updatedAt=new Date().toISOString();localStorage.setItem(V0470_B_KEY,JSON.stringify(x));return x}
function v0470BBase(){const a=v0460Load();return a?.base?.closed?.length?a.base:null}
function v0470BAssess(kind,v){
 if(kind==='good')return {status:'ROBUST',label:'✅ SER ROBUST UT'};
 if(kind==='warn')return {status:'SENSITIVE',label:'⚠️ KÄNSLIG'};
 if(kind==='weak')return {status:'WEAK',label:'❌ SVAGHET HITTAD'};
 return {status:'INFO',label:'ℹ️ BESKRIVANDE'};
}
function v0470BStatusLabel(r){return r?.label||'○ EJ KÖRD'}
function v0470BHelp(id){const x=V0470_B_HELP[id]||['Förklaring','Ingen hjälptext.'],m=document.getElementById('v0470BHelpModal');document.getElementById('v0470BHelpTitle').textContent=x[0];document.getElementById('v0470BHelpBody').innerHTML=`<p>${x[1]}</p>`;m.hidden=false}
function v0470BPaint(){
 const x=v0470BLoad(),rows=document.getElementById('v0470BRows'),done=V0470_B_TESTS.filter(t=>x.tests[t[0]]).length;
 if(rows)rows.innerHTML=V0470_B_TESTS.map((t,i)=>{const r=x.tests[t[0]];return `<tr><td>${i+1}</td><td>${r?`<button class="v0470-browbtn" data-bdetail="${t[0]}">${t[1]}</button>`:t[1]}</td><td>${v0470BStatusLabel(r)}</td><td><button class="v0470-help" data-bhelp="${t[0]}">?</button></td></tr>`}).join('');
 const bar=document.getElementById('v0470BBar'),pct=document.getElementById('v0470BPct'),sum=document.getElementById('v0470BSummary');
 if(bar)bar.style.width=`${done/12*100}%`;if(pct)pct.textContent=`${done}/12`;
 if(sum){const a=Object.values(x.tests),g=a.filter(r=>r.status==='ROBUST').length,w=a.filter(r=>r.status==='SENSITIVE').length,q=a.filter(r=>r.status==='WEAK').length;sum.innerHTML=`${done}/12 klara · ✅ ${g} robusta · ⚠️ ${w} känsliga · ❌ ${q} svagheter`;}
 ['v0470BReport','v0470BRaw'].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=!x.completed});
 document.querySelectorAll('[data-bhelp]').forEach(b=>b.onclick=()=>v0470BHelp(b.dataset.bhelp));
 document.querySelectorAll('[data-bdetail]').forEach(b=>b.onclick=()=>v0470BShowDetail(b.dataset.bdetail));
}
function v0470BSym(t){return t.symbol||t.s||'—'}
function v0470BPnl(t){return Number(t.pnl)||0}
function v0470BNotional(t){return Math.abs((Number(t.shares)||0)*(Number(t.entry)||0))}
function v0470BStats(trades){
 const p=trades.map(v0470BPnl),wins=p.filter(x=>x>0),loss=p.filter(x=>x<0),gw=wins.reduce((a,x)=>a+x,0),gl=Math.abs(loss.reduce((a,x)=>a+x,0)),sum=p.reduce((a,x)=>a+x,0),mean=p.length?sum/p.length:0,srt=[...p].sort((a,b)=>a-b),med=srt.length?srt[Math.floor(srt.length/2)]:0;
 return{n:p.length,pnl:sum,mean,median:med,pf:gl?gw/gl:(gw?Infinity:0),wr:p.length?wins.length/p.length:0,grossWin:gw,grossLoss:gl}
}
function v0470BMonthPnl(base){
 const out={};for(const t of base.closed){const k=(t.entryTime||'').slice(0,7);out[k]=(out[k]||0)+v0470BPnl(t)}return out
}
function v0470BWindow(monthMap,n){
 const ks=Object.keys(monthMap).sort(),out=[];for(let i=0;i+n<=ks.length;i++){const sub=ks.slice(i,i+n),p=sub.reduce((a,k)=>a+(monthMap[k]||0),0);out.push({from:sub[0],to:sub.at(-1),pnl:p})}return out
}
function v0470BRng(seed=470){let x=seed>>>0;return()=>{x=(Math.imul(1664525,x)+1013904223)>>>0;return x/4294967296}}
function v0470BQ(a,p){const b=[...a].sort((x,y)=>x-y);return b[Math.max(0,Math.min(b.length-1,Math.floor((b.length-1)*p)))]}
function v0470BNyDate(t){try{return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/New_York',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date(t))}catch{return[]}}
async function v0470BRunTest(id){
 const base=v0470BBase();if(!base)throw new Error('Suite A-basdata saknas. Öppna/återställ först Validation Suite A.');
 const tr=base.closed,st=v0470BStats(tr);
 if(id==='edge'){
   const a=st.pf>=1.10&&st.mean>5?v0470BAssess('good'):st.pf>1&&st.mean>0?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:st,explain:`${st.n} affärer · snitt ${st.mean.toFixed(2)} kr/affär · median ${st.median.toFixed(2)} kr · PF ${st.pf.toFixed(2)}.`}
 }
 if(id==='breakeven'){
   const totalNot=tr.reduce((a,t)=>a+v0470BNotional(t),0),normal=V0460_RULES.costSide*2,extraPerMult=totalNot*normal;
   const mult=extraPerMult>0?1+st.pnl/extraPerMult:Infinity;
   const a=mult>=1.5?v0470BAssess('good'):mult>=1.25?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{breakEvenMultiplier:mult,totalNotional:totalNot,basePnl:st.pnl},explain:`Beräknad break-even cirka ${mult.toFixed(2)}× normal modellerad friktion.`}
 }
 if(id==='ladder'){
   const levels=[];for(let mult=1;mult<=2.0001;mult+=.1){const extra=V0460_RULES.costSide*2*(mult-1),c=tr.map(t=>({...t,pnl:v0470BPnl(t)-v0470BNotional(t)*extra}));const s=v0470BStats(c);levels.push({mult:+mult.toFixed(1),pnl:s.pnl,pf:s.pf})}
   const cross=levels.find(x=>x.pnl<0)?.mult??null,a=cross===null?v0470BAssess('good'):cross>=1.5?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{levels,firstNegativeMultiplier:cross},explain:`Första fasta steget med negativ total P/L: ${cross?cross.toFixed(1)+'×':'inte före 2,0×'}.`}
 }
 if(id==='loo'){
   const syms=[...new Set(tr.map(v0470BSym))],rows=syms.map(sym=>({symbol:sym,...v0470BStats(tr.filter(t=>v0470BSym(t)!==sym))})).sort((a,b)=>a.pnl-b.pnl),worst=rows[0];
   const a=worst&&worst.pnl>0?v0470BAssess('good'):worst&&worst.pnl>-2000?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{worstLeaveOut:worst,all:rows},explain:`Sämsta leave-one-out: utan ${worst?.symbol||'—'} blir P/L ${(worst?.pnl||0).toFixed(0)} kr.`}
 }
 if(id==='exit'){
   const g={};for(const t of tr){const k=t.why||'okänd';(g[k]??=[]).push(t)}const rows=Object.entries(g).map(([why,a])=>({why,...v0470BStats(a)})).sort((a,b)=>b.n-a.n);
   return{...v0470BAssess('info'),metrics:{groups:rows},explain:rows.map(x=>`${x.why}: ${x.n} affärer, ${x.pnl.toFixed(0)} kr`).join(' · ')}
 }
 if(id==='tod'){
   const g={};for(const t of tr){const parts=v0470BNyDate(t.entryTime),h=Number(parts.find(x=>x.type==='hour')?.value),m=Number(parts.find(x=>x.type==='minute')?.value),mins=h*60+m,b=mins<660?'10:30–11:00':mins<690?'11:00–11:30':'11:30–12:00';(g[b]??=[]).push(t)}
   const rows=Object.entries(g).map(([bucket,a])=>({bucket,...v0470BStats(a)})),pos=rows.filter(x=>x.pnl>0).length,a=pos>=2?v0470BAssess('good'):pos===1?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{buckets:rows},explain:`${pos}/${rows.length} tidsfönster positiva.`}
 }
 if(id==='weekday'){
   const names=['mån','tis','ons','tor','fre'],g={};for(const t of tr){const wd=new Intl.DateTimeFormat('sv-SE',{timeZone:'America/New_York',weekday:'short'}).format(new Date(t.entryTime)).slice(0,3);(g[wd]??=[]).push(t)}
   const rows=Object.entries(g).map(([day,a])=>({day,...v0470BStats(a)})),pos=rows.filter(x=>x.pnl>0).length,a=pos>=4?v0470BAssess('good'):pos>=3?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{days:rows},explain:`${pos}/${rows.length} veckodagar positiva.`}
 }
 if(id==='roll6'||id==='roll12'){
   const n=id==='roll6'?6:12,w=v0470BWindow(v0470BMonthPnl(base),n),pos=w.filter(x=>x.pnl>0).length,rate=w.length?pos/w.length:0,worst=[...w].sort((a,b)=>a.pnl-b.pnl)[0],a=rate>=.70?v0470BAssess('good'):rate>=.55?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{months:n,windows:w.length,positiveRate:rate,worst},explain:`${(rate*100).toFixed(0)}% av ${w.length} rullande ${n}-månadersfönster positiva · sämsta ${(worst?.pnl||0).toFixed(0)} kr.`}
 }
 if(id==='bootstrap'){
   const rng=v0470BRng(47001),vals=tr.map(v0470BPnl),means=[];for(let k=0;k<3000;k++){let s=0;for(let i=0;i<vals.length;i++)s+=vals[Math.floor(rng()*vals.length)];means.push(s/vals.length);if(k%250===0)await new Promise(r=>setTimeout(r,0))}
   const lo=v0470BQ(means,.025),hi=v0470BQ(means,.975),a=lo>0?v0470BAssess('good'):hi>0&&st.mean>0?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{runs:3000,mean:st.mean,ci95:[lo,hi]},explain:`Bootstrap 95% intervall för snitt-P/L: ${lo.toFixed(2)} till ${hi.toFixed(2)} kr/affär.`}
 }
 if(id==='tail'){
   let streak=0,maxStreak=0;for(const t of tr){if(v0470BPnl(t)<0){streak++;maxStreak=Math.max(maxStreak,streak)}else streak=0}
   const sorted=[...tr].sort((a,b)=>v0470BPnl(a)-v0470BPnl(b)),n=Math.max(1,Math.ceil(sorted.length*.05)),tail=sorted.slice(0,n).reduce((a,t)=>a+v0470BPnl(t),0),worst=v0470BPnl(sorted[0]),a=maxStreak<=8?v0470BAssess('good'):maxStreak<=12?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{worstTrade:worst,maxLosingStreak:maxStreak,worst5PctPnl:tail},explain:`Största förlust ${worst.toFixed(0)} kr · längsta förlustsvit ${maxStreak} affärer · sämsta 5% totalt ${tail.toFixed(0)} kr.`}
 }
 if(id==='concentration2'){
   const wins=tr.filter(t=>v0470BPnl(t)>0).sort((a,b)=>v0470BPnl(b)-v0470BPnl(a)),n=Math.max(1,Math.ceil(wins.length*.10)),top=wins.slice(0,n).reduce((a,t)=>a+v0470BPnl(t),0),gross=wins.reduce((a,t)=>a+v0470BPnl(t),0),share=gross?top/gross:1,a=share<=.35?v0470BAssess('good'):share<=.50?v0470BAssess('warn'):v0470BAssess('weak');
   return{...a,metrics:{top10Share:share,topCount:n,winnerCount:wins.length},explain:`Bästa 10% av vinnarna står för ${(share*100).toFixed(1)}% av bruttovinsten.`}
 }
 throw new Error('Okänt test');
}
let V0470_B_RUNNING=false;
async function v0470BRun(all){
 if(V0470_B_RUNNING)return;V0470_B_RUNNING=true;const st=document.getElementById('v0470BStatus'),A=document.getElementById('v0470RunAll'),N=document.getElementById('v0470RunNext');A.disabled=N.disabled=true;
 try{
  let x=v0470BLoad();
  do{
   const t=V0470_B_TESTS.find(q=>!x.tests[q[0]]);if(!t)break;
   st.textContent=`Kör ${t[1]}…`;
   const r=await v0470BRunTest(t[0]);x.tests[t[0]]={...r,completedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:v0470BBase()?.dataFingerprint||'—'};v0470BSave(x);v0470BPaint();
   if(!all)break;
   await new Promise(r=>setTimeout(r,20));
  }while(true);
  x=v0470BLoad();if(V0470_B_TESTS.every(t=>x.tests[t[0]])){x.completed=true;v0470BSave(x);st.textContent='✓ Suite B klar · 12/12 diagnostiska tester genomförda.'}else st.textContent='✓ Test sparat.';
 }catch(e){st.textContent='KÖRFEL: '+(e?.message||e)}
 finally{V0470_B_RUNNING=false;A.disabled=N.disabled=false;v0470BPaint()}
}
function v0470BShowDetail(id){
 const x=v0470BLoad(),r=x.tests[id],t=V0470_B_TESTS.find(q=>q[0]===id),m=document.getElementById('v0470BDetailModal');document.getElementById('v0470BDetailTitle').textContent=t?.[1]||id;
 document.getElementById('v0470BDetailBody').innerHTML=r?`<p><b>${r.label}</b></p><p>${r.explain||''}</p><details><summary>Visa tekniska detaljer</summary><pre style="white-space:pre-wrap">${JSON.stringify(r.metrics||{},null,2)}</pre></details>`:'<p>Ej kört.</p>';m.hidden=false;document.getElementById('v0470BExportOne').dataset.id=id
}
function v0470BTestText(id){
 const x=v0470BLoad(),r=x.tests[id],t=V0470_B_TESTS.find(q=>q[0]===id);return ['LINAS OPTI – SUITE B TEST','Version: '+APP_VERSION,'Test: '+(t?.[1]||id),'Bedömning: '+(r?.label||'—'),'Regelhash: '+V0460_RULE_HASH,'',r?.explain||'',JSON.stringify(r?.metrics||{},null,2),'','Reused history diagnostic – ej nytt orört OOS-bevis.'].join('\n')
}
function v0470BReport(){
 const x=v0470BLoad(),L=['LINAS OPTI – VALIDATION SUITE B · EDGE & ROBUSTHET','Version: '+APP_VERSION,'Handel: AVSTÄNGD','Close >=83% fryst kandidat','Regelhash: '+V0460_RULE_HASH,'','OBS: Suite B skapades efter Suite A-resultaten och använder återanvänd historik. Den är diagnostik, inte nytt OOS-bevis.',''];
 V0470_B_TESTS.forEach((t,i)=>{const r=x.tests[t[0]];L.push(`${i+1}. ${t[1]} | ${r?.label||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('','Ingen parameteroptimering eller automatisk räddning har körts.');return L.join('\n')
}
window.addEventListener('DOMContentLoaded',()=>{
 document.getElementById('v0470RunAll')?.addEventListener('click',()=>v0470BRun(true));
 document.getElementById('v0470RunNext')?.addEventListener('click',()=>v0470BRun(false));
 document.getElementById('v0470BReport')?.addEventListener('click',()=>v0460Dl(v0470BReport(),`LINAS_OPTI_VALIDATION_SUITE_B_V0470_${new Date().toISOString().slice(0,10)}.txt`));
 document.getElementById('v0470BRaw')?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0470BLoad(),null,2),`LINAS_OPTI_VALIDATION_SUITE_B_RAW_V0470_${new Date().toISOString().slice(0,10)}.json`,'application/json'));
 document.getElementById('v0470BHelpClose')?.addEventListener('click',()=>document.getElementById('v0470BHelpModal').hidden=true);
 document.getElementById('v0470BDetailClose')?.addEventListener('click',()=>document.getElementById('v0470BDetailModal').hidden=true);
 document.getElementById('v0470BExportOne')?.addEventListener('click',e=>{const id=e.currentTarget.dataset.id;if(id)v0460Dl(v0470BTestText(id),`LINAS_OPTI_SUITE_B_${id.toUpperCase()}_V0470_${new Date().toISOString().slice(0,10)}.txt`)});
 document.getElementById('v0470BHelpModal')?.addEventListener('click',e=>{if(e.target.id==='v0470BHelpModal')e.currentTarget.hidden=true});
 document.getElementById('v0470BDetailModal')?.addEventListener('click',e=>{if(e.target.id==='v0470BDetailModal')e.currentTarget.hidden=true});
 v0470BPaint();
 const jump=document.getElementById('v0413LabJump');if(jump&&[...jump.options].some(o=>o.value==='v0470Lab')){jump.value='v0470Lab';try{localStorage.setItem('linasopti_testlab_selected_v0423','v0470Lab')}catch{}jump.dispatchEvent(new Event('change'))}
});


// ============================================================
// V0.48.0 – VALIDATION SUITES C / D / E
// 30 fast local diagnostics using saved Suite A trades.
// Reused history: diagnostic only, never fresh OOS evidence.
// ============================================================
const V0480_DEFS={
 C:{
  name:'Tidsstruktur', key:'linasopti_validation_suite_c_v0480',
  tests:[
   ['monthpos','Positiva månader'],['quarter','Kvartalsstabilitet'],['roll3','Rullande 3 månader'],
   ['roll9','Rullande 9 månader'],['halfyear','Halvårsstabilitet'],['entry15','Entry 15-minutersfönster'],
   ['weekdaytime','Veckodag × tid'],['duration','Affärslängd'],['exityear','Exit-orsak × år'],['earlylate','Tidig vs sen historik']
  ]
 },
 D:{
  name:'Bredd & beroenden', key:'linasopti_validation_suite_d_v0480',
  tests:[
   ['symbreadth','Positiva symboler'],['sympf','PF-bredd per symbol'],['symyear','Symbol × år-stabilitet'],
   ['leave2','Ta bort två bästa symbolerna'],['leave3','Ta bort tre bästa symbolerna'],['countconc','Affärskoncentration per symbol'],
   ['pnlhhi','P/L-koncentration HHI'],['top5','Topp 5% vinnare'],['bottom5','Sämsta 5% förluster'],['symstreak','Förlustsvit per symbol']
  ]
 },
 E:{
  name:'Statistik & Monte Carlo', key:'linasopti_validation_suite_e_v0480',
  tests:[
   ['boottrade','Bootstrap affärer 5 000×'],['bootmonth','Block-bootstrap månader 5 000×'],['drop10','Slumpmässigt bortfall 10%'],
   ['drop25','Slumpmässigt bortfall 25%'],['costmc','Slumpmässig kostnadschock'],['ordermc','Slumpad ordning / drawdown'],
   ['roll20','Sämsta 20-affärersfönster'],['roll50','Sämsta 50-affärersfönster'],['streakmc','Förlustsvit Monte Carlo'],['winci','Vinstfrekvens konfidensintervall']
  ]
 }
};
const V0480_HELP={
 'C:suite':['Suite C','Tidsdiagnostik. Letar efter när edgen finns eller försvinner utan att ändra några regler.'],
 'D:suite':['Suite D','Bredddiagnostik. Testar om resultatet är beroende av få aktier eller koncentrerade bidrag.'],
 'E:suite':['Suite E','Statistisk stress. Bootstrap, bortfall och Monte Carlo för att mäta hur osäkert resultatet är.'],
 monthpos:['Positiva månader','Andel kalendermånader med positiv P/L.'],quarter:['Kvartalsstabilitet','Andel kalenderkvartal med positiv P/L.'],
 roll3:['Rullande 3 månader','Varje sammanhängande 3-månadersfönster.'],roll9:['Rullande 9 månader','Varje sammanhängande 9-månadersfönster.'],
 halfyear:['Halvårsstabilitet','Resultat för H1/H2 per år.'],entry15:['Entry 15-minutersfönster','Delar entrytiden i fasta 15-minutersblock.'],
 weekdaytime:['Veckodag × tid','Korsar veckodag med halvtimmesfönster för koncentrationskontroll.'],duration:['Affärslängd','Delar P/L efter hur länge positionen var öppen.'],
 exityear:['Exit-orsak × år','Visar om mål/stop/max-tid beter sig likartat mellan år.'],earlylate:['Tidig vs sen historik','Jämför första och andra halvan av affärerna i tid.'],
 symbreadth:['Positiva symboler','Hur många av Day Selection-symbolerna bidrar positivt.'],sympf:['PF-bredd','Hur många symboler har PF över 1.'],
 symyear:['Symbol × år','Hur ofta samma symbol är positiv i olika år.'],leave2:['Ta bort två bästa','Robusthetsstress: resultat utan de två största positiva symbolbidragen.'],
 leave3:['Ta bort tre bästa','Samma stress utan de tre största positiva symbolbidragen.'],countconc:['Affärskoncentration','Hur stor del av alla affärer som ligger i de mest handlade symbolerna.'],
 pnlhhi:['P/L HHI','Koncentrationsindex på absoluta symbolbidrag. Lägre betyder bredare spridning.'],top5:['Topp 5% vinnare','Hur stor del av bruttovinsten som kommer från de allra bästa vinnarna.'],
 bottom5:['Sämsta 5%','Hur stor del av bruttoförlusten som kommer från de värsta förlustaffärerna.'],symstreak:['Förlustsvit per symbol','Längsta följd av förlustaffärer inom samma symbol.'],
 boottrade:['Bootstrap affärer','5 000 resamplingar av enskilda affärer med återläggning.'],bootmonth:['Block-bootstrap månader','5 000 resamplingar av hela månader för att bevara mer tidsstruktur.'],
 drop10:['Bortfall 10%','Tar slumpmässigt bort 10% av affärerna många gånger.'],drop25:['Bortfall 25%','Tar slumpmässigt bort 25% av affärerna många gånger.'],
 costmc:['Kostnadschock','Lägger slumpmässig extra friktion mellan 0 och +20% på varje affär.'],ordermc:['Slumpad ordning','Behåller samma affärer men slumpar ordningen och mäter drawdown.'],
 roll20:['20-affärersfönster','Sämsta sammanhängande 20 affärer.'],roll50:['50-affärersfönster','Sämsta sammanhängande 50 affärer.'],
 streakmc:['Förlustsvit Monte Carlo','Slumpar ordning och mäter förlustsvitens fördelning.'],winci:['Vinstfrekvens CI','Wilson 95%-intervall för vinstfrekvensen.']
};
function v0480New(s){return{schema:'LINA-SUITE-'+s+'-1',appVersion:'V0.48.0',rulesHash:V0460_RULE_HASH,createdAt:new Date().toISOString(),tests:{},completed:false}}
function v0480Load(s){const d=V0480_DEFS[s];try{const x=JSON.parse(localStorage.getItem(d.key)||'null');return x&&x.schema==='LINA-SUITE-'+s+'-1'&&x.rulesHash===V0460_RULE_HASH?x:v0480New(s)}catch{return v0480New(s)}}
function v0480Save(s,x){x.updatedAt=new Date().toISOString();localStorage.setItem(V0480_DEFS[s].key,JSON.stringify(x));return x}
function v0480Base(){return v0470BBase()}
function v0480Assess(x,good,warn){return x>=good?{status:'ROBUST',label:'✅ SER ROBUST UT'}:x>=warn?{status:'SENSITIVE',label:'⚠️ KÄNSLIG'}:{status:'WEAK',label:'❌ SVAGHET HITTAD'}}
function v0480Info(){return{status:'INFO',label:'ℹ️ BESKRIVANDE'}}
function v0480MonthKey(t){return (t.entryTime||'').slice(0,7)}
function v0480Year(t){return (t.entryTime||'').slice(0,4)}
function v0480MonthMap(tr){const m={};for(const t of tr){const k=v0480MonthKey(t);m[k]=(m[k]||0)+v0470BPnl(t)}return m}
function v0480Group(tr,fn){const g={};for(const t of tr){const k=fn(t);(g[k]??=[]).push(t)}return g}
function v0480Rows(g){return Object.entries(g).map(([k,a])=>({key:k,...v0470BStats(a)}))}
function v0480Quant(a,p){return v0470BQ(a,p)}
function v0480Rng(seed){return v0470BRng(seed)}
function v0480Duration(t){return Math.max(0,(new Date(t.exitTime)-new Date(t.entryTime))/60000)}
function v0480MaxDD(pnls){let e=0,peak=0,dd=0;for(const p of pnls){e+=p;peak=Math.max(peak,e);dd=Math.min(dd,e-peak)}return dd}
function v0480Rolling(vals,n){let best=Infinity,at=-1,s=0;for(let i=0;i<vals.length;i++){s+=vals[i];if(i>=n)s-=vals[i-n];if(i>=n-1&&s<best){best=s;at=i-n+1}}return{pnl:best,index:at}}
function v0480Wilson(w,n){if(!n)return[0,0];const z=1.96,p=w/n,den=1+z*z/n,c=(p+z*z/(2*n))/den,h=z*Math.sqrt((p*(1-p)+z*z/(4*n))/n)/den;return[c-h,c+h]}
async function v0480RunTest(s,id){
 const base=v0480Base();if(!base?.closed?.length)throw new Error('Suite A-basdata saknas lokalt.');
 const tr=base.closed,st=v0470BStats(tr),months=v0480MonthMap(tr);
 // C
 if(id==='monthpos'){const a=Object.values(months),r=a.filter(x=>x>0).length/a.length,q=v0480Assess(r,.65,.55);return{...q,metrics:{months:a.length,positiveRate:r,worst:Math.min(...a),best:Math.max(...a)},explain:`${(r*100).toFixed(0)}% av ${a.length} månader positiva.`}}
 if(id==='quarter'){const g={};for(const [k,p] of Object.entries(months)){const [y,m]=k.split('-').map(Number),q=`${y}-Q${Math.ceil(m/3)}`;g[q]=(g[q]||0)+p}const a=Object.values(g),r=a.filter(x=>x>0).length/a.length,q=v0480Assess(r,.65,.5);return{...q,metrics:{quarters:g,positiveRate:r},explain:`${(r*100).toFixed(0)}% av ${a.length} kvartal positiva.`}}
 if(id==='roll3'||id==='roll9'){const n=id==='roll3'?3:9,w=v0470BWindow(months,n),r=w.filter(x=>x.pnl>0).length/w.length,q=v0480Assess(r,.70,.55),worst=[...w].sort((a,b)=>a.pnl-b.pnl)[0];return{...q,metrics:{windows:w.length,positiveRate:r,worst},explain:`${(r*100).toFixed(0)}% av ${w.length} rullande ${n}-månadersfönster positiva · sämsta ${worst.pnl.toFixed(0)} kr.`}}
 if(id==='halfyear'){const g={};for(const [k,p] of Object.entries(months)){const [y,m]=k.split('-').map(Number),h=`${y}-H${m<=6?1:2}`;g[h]=(g[h]||0)+p}const a=Object.values(g),r=a.filter(x=>x>0).length/a.length,q=v0480Assess(r,.70,.55);return{...q,metrics:{blocks:g,positiveRate:r},explain:`${(r*100).toFixed(0)}% av ${a.length} halvår positiva.`}}
 if(id==='entry15'){const g=v0480Group(tr,t=>{const d=new Date(t.entryTime),parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(d),h=+parts.find(x=>x.type==='hour').value,m=+parts.find(x=>x.type==='minute').value,b=Math.floor(m/15)*15;return `${String(h).padStart(2,'0')}:${String(b).padStart(2,'0')}`});const rows=v0480Rows(g),r=rows.filter(x=>x.pnl>0).length/rows.length,q=v0480Assess(r,.65,.5);return{...q,metrics:{buckets:rows,positiveRate:r},explain:`${rows.filter(x=>x.pnl>0).length}/${rows.length} 15-minutersfönster positiva.`}}
 if(id==='weekdaytime'){const g=v0480Group(tr,t=>{const p=v0470BNyDate(t.entryTime),wd=p.find(x=>x.type==='weekday')?.value||'?',h=+p.find(x=>x.type==='hour')?.value,m=+p.find(x=>x.type==='minute')?.value;return `${wd} ${m<30?`${h}:00–${h}:30`:`${h}:30–${h+1}:00`}`});const rows=v0480Rows(g).filter(x=>x.n>=15),r=rows.filter(x=>x.pnl>0).length/Math.max(1,rows.length),q=v0480Assess(r,.6,.45);return{...q,metrics:{groups:rows,positiveRate:r},explain:`${rows.filter(x=>x.pnl>0).length}/${rows.length} grupper med minst 15 affärer positiva.`}}
 if(id==='duration'){const g=v0480Group(tr,t=>{const m=v0480Duration(t);return m<=20?'≤20 min':m<=40?'21–40 min':'41–60+ min'}),rows=v0480Rows(g),r=rows.filter(x=>x.pnl>0).length/rows.length,q=v0480Assess(r,.66,.34);return{...q,metrics:{groups:rows},explain:rows.map(x=>`${x.key}: ${x.pnl.toFixed(0)} kr`).join(' · ')}}
 if(id==='exityear'){const g=v0480Group(tr,t=>`${v0480Year(t)} · ${t.why||'okänd'}`),rows=v0480Rows(g);return{...v0480Info(),metrics:{groups:rows},explain:`${rows.length} år×exit-grupper kartlagda.`}}
 if(id==='earlylate'){const a=[...tr].sort((x,y)=>new Date(x.entryTime)-new Date(y.entryTime)),h=Math.floor(a.length/2),s1=v0470BStats(a.slice(0,h)),s2=v0470BStats(a.slice(h)),r=(s1.pnl>0?1:0)+(s2.pnl>0?1:0),q=v0480Assess(r,2,1);return{...q,metrics:{early:s1,late:s2},explain:`Första halvan ${s1.pnl.toFixed(0)} kr · andra halvan ${s2.pnl.toFixed(0)} kr.`}}
 // D
 if(id==='symbreadth'||id==='sympf'){const rows=v0480Rows(v0480Group(tr,v0470BSym)),good=rows.filter(x=>id==='symbreadth'?x.pnl>0:x.pf>1).length,r=good/rows.length,q=v0480Assess(r,.6,.45);return{...q,metrics:{symbols:rows,positiveRate:r},explain:`${good}/${rows.length} symboler ${id==='symbreadth'?'positiva':'med PF > 1'}.`}}
 if(id==='symyear'){const rows=v0480Rows(v0480Group(tr,t=>`${v0470BSym(t)}:${v0480Year(t)}`)).filter(x=>x.n>=5),r=rows.filter(x=>x.pnl>0).length/rows.length,q=v0480Assess(r,.55,.45);return{...q,metrics:{groups:rows,positiveRate:r},explain:`${(r*100).toFixed(0)}% av symbol×år-grupper med minst 5 affärer positiva.`}}
 if(id==='leave2'||id==='leave3'){const n=id==='leave2'?2:3,srows=v0480Rows(v0480Group(tr,v0470BSym)).sort((a,b)=>b.pnl-a.pnl),drop=srows.slice(0,n).map(x=>x.key),remain=v0470BStats(tr.filter(t=>!drop.includes(v0470BSym(t)))),q=remain.pnl>0?v0480Assess(1,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{removed:drop,remaining:remain},explain:`Utan ${drop.join(', ')}: P/L ${remain.pnl.toFixed(0)} kr · PF ${remain.pf.toFixed(2)}.`}}
 if(id==='countconc'){const rows=v0480Rows(v0480Group(tr,v0470BSym)).sort((a,b)=>b.n-a.n),share=rows.slice(0,3).reduce((a,x)=>a+x.n,0)/tr.length,q=share<=.35?v0480Assess(1,1,.5):share<=.5?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{top3Share:share,rows},explain:`Tre mest handlade symboler står för ${(share*100).toFixed(1)}% av affärerna.`}}
 if(id==='pnlhhi'){const rows=v0480Rows(v0480Group(tr,v0470BSym)),tot=rows.reduce((a,x)=>a+Math.abs(x.pnl),0),hhi=rows.reduce((a,x)=>a+Math.pow(Math.abs(x.pnl)/tot,2),0),q=hhi<=.15?v0480Assess(1,1,.5):hhi<=.25?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{hhi,rows},explain:`Absolut P/L-HHI ${(hhi*10000).toFixed(0)}.`}}
 if(id==='top5'){const w=tr.filter(t=>v0470BPnl(t)>0).sort((a,b)=>v0470BPnl(b)-v0470BPnl(a)),n=Math.max(1,Math.ceil(w.length*.05)),share=w.slice(0,n).reduce((a,t)=>a+v0470BPnl(t),0)/w.reduce((a,t)=>a+v0470BPnl(t),0),q=share<=.25?v0480Assess(1,1,.5):share<=.4?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{share,count:n,winners:w.length},explain:`Bästa 5% av vinnarna står för ${(share*100).toFixed(1)}% av bruttovinsten.`}}
 if(id==='bottom5'){const l=tr.filter(t=>v0470BPnl(t)<0).sort((a,b)=>v0470BPnl(a)-v0470BPnl(b)),n=Math.max(1,Math.ceil(l.length*.05)),share=Math.abs(l.slice(0,n).reduce((a,t)=>a+v0470BPnl(t),0))/Math.abs(l.reduce((a,t)=>a+v0470BPnl(t),0)),q=share<=.25?v0480Assess(1,1,.5):share<=.4?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{share,count:n,losers:l.length},explain:`Sämsta 5% av förlusterna står för ${(share*100).toFixed(1)}% av bruttoförlusten.`}}
 if(id==='symstreak'){const by=v0480Group([...tr].sort((a,b)=>new Date(a.entryTime)-new Date(b.entryTime)),v0470BSym),rows=[];for(const [sym,a] of Object.entries(by)){let s=0,m=0;for(const t of a){if(v0470BPnl(t)<0){s++;m=Math.max(m,s)}else s=0}rows.push({symbol:sym,maxLosingStreak:m,n:a.length})}const worst=Math.max(...rows.map(x=>x.maxLosingStreak)),q=worst<=6?v0480Assess(1,1,.5):worst<=9?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{worst,rows},explain:`Längsta symbolspecifika förlustsvit: ${worst} affärer.`}}
 // E
 if(id==='boottrade'){const vals=tr.map(v0470BPnl),rng=v0480Rng(48001),tot=[];for(let k=0;k<5000;k++){let s=0;for(let i=0;i<vals.length;i++)s+=vals[Math.floor(rng()*vals.length)];tot.push(s);if(k%500===0)await new Promise(r=>setTimeout(r,0))}const lo=v0480Quant(tot,.025),med=v0480Quant(tot,.5),hi=v0480Quant(tot,.975),prob=tot.filter(x=>x>0).length/tot.length,q=v0480Assess(prob,.8,.6);return{...q,metrics:{runs:5000,ci95:[lo,hi],median:med,positiveProbability:prob},explain:`P(P/L>0) ${(prob*100).toFixed(1)}% · 95% intervall ${lo.toFixed(0)} till ${hi.toFixed(0)} kr.`}}
 if(id==='bootmonth'){const vals=Object.values(months),rng=v0480Rng(48002),tot=[];for(let k=0;k<5000;k++){let s=0;for(let i=0;i<vals.length;i++)s+=vals[Math.floor(rng()*vals.length)];tot.push(s);if(k%500===0)await new Promise(r=>setTimeout(r,0))}const lo=v0480Quant(tot,.025),hi=v0480Quant(tot,.975),prob=tot.filter(x=>x>0).length/tot.length,q=v0480Assess(prob,.8,.6);return{...q,metrics:{runs:5000,ci95:[lo,hi],positiveProbability:prob},explain:`Månadsblock-bootstrap: P(P/L>0) ${(prob*100).toFixed(1)}% · 95% ${lo.toFixed(0)} till ${hi.toFixed(0)} kr.`}}
 if(id==='drop10'||id==='drop25'){const drop=id==='drop10'?.10:.25,rng=v0480Rng(id==='drop10'?48003:48004),tot=[];for(let k=0;k<3000;k++){let s=0;for(const t of tr)if(rng()>=drop)s+=v0470BPnl(t);tot.push(s)}const prob=tot.filter(x=>x>0).length/tot.length,lo=v0480Quant(tot,.05),q=v0480Assess(prob,.8,.6);return{...q,metrics:{runs:3000,dropRate:drop,positiveProbability:prob,p05:lo},explain:`Vid ${(drop*100).toFixed(0)}% slumpbortfall är ${(prob*100).toFixed(1)}% av körningarna positiva · 5:e percentil ${lo.toFixed(0)} kr.`}}
 if(id==='costmc'){const rng=v0480Rng(48005),tot=[];for(let k=0;k<3000;k++){let s=0;for(const t of tr){const extra=v0470BNotional(t)*V0460_RULES.costSide*2*(rng()*.20);s+=v0470BPnl(t)-extra}tot.push(s)}const prob=tot.filter(x=>x>0).length/tot.length,lo=v0480Quant(tot,.05),q=v0480Assess(prob,.75,.5);return{...q,metrics:{runs:3000,maxExtraCostPct:.20,positiveProbability:prob,p05:lo},explain:`Slumpmässig +0–20% friktion: ${(prob*100).toFixed(1)}% positiva simuleringar · 5:e percentil ${lo.toFixed(0)} kr.`}}
 if(id==='ordermc'){const vals=tr.map(v0470BPnl),rng=v0480Rng(48006),dds=[];for(let k=0;k<3000;k++){const a=[...vals];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}dds.push(v0480MaxDD(a));if(k%300===0)await new Promise(r=>setTimeout(r,0))}const p05=v0480Quant(dds,.05),med=v0480Quant(dds,.5),q=Math.abs(p05)<=10000?v0480Assess(1,1,.5):Math.abs(p05)<=15000?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{runs:3000,ddP05:p05,ddMedian:med},explain:`Slumpad affärsordning: median-DD ${med.toFixed(0)} kr · svag 5:e percentil ${p05.toFixed(0)} kr.`}}
 if(id==='roll20'||id==='roll50'){const n=id==='roll20'?20:50,r=v0480Rolling(tr.map(v0470BPnl),n),q=Math.abs(r.pnl)<=4000?v0480Assess(1,1,.5):Math.abs(r.pnl)<=7000?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{window:n,worst:r},explain:`Sämsta sammanhängande ${n} affärer: ${r.pnl.toFixed(0)} kr.`}}
 if(id==='streakmc'){const vals=tr.map(t=>v0470BPnl(t)<0),rng=v0480Rng(48007),arr=[];for(let k=0;k<3000;k++){const a=[...vals];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}let s=0,m=0;for(const loss of a){if(loss){s++;m=Math.max(m,s)}else s=0}arr.push(m)}const p95=v0480Quant(arr,.95),med=v0480Quant(arr,.5),q=p95<=12?v0480Assess(1,1,.5):p95<=16?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{runs:3000,median:med,p95},explain:`Slumpad ordning: median längsta förlustsvit ${med} · 95:e percentil ${p95}.`}}
 if(id==='winci'){const w=tr.filter(t=>v0470BPnl(t)>0).length,ci=v0480Wilson(w,tr.length),wr=w/tr.length,q=ci[0]>=.40?v0480Assess(1,1,.5):ci[0]>=.35?v0480Assess(.5,1,.5):v0480Assess(0,1,.5);return{...q,metrics:{wins:w,n:tr.length,wr,ci95:ci},explain:`Vinstfrekvens ${(wr*100).toFixed(1)}% · Wilson 95% ${(ci[0]*100).toFixed(1)}–${(ci[1]*100).toFixed(1)}%.`}}
 throw new Error('Okänt test '+id)
}
let V0480_RUNNING=false;
function v0480Paint(s){
 const d=V0480_DEFS[s],x=v0480Load(s),done=d.tests.filter(t=>x.tests[t[0]]).length,rows=document.getElementById(`v0480${s}Rows`);
 if(rows)rows.innerHTML=d.tests.map((t,i)=>{const r=x.tests[t[0]];return `<tr><td>${i+1}</td><td>${r?`<button class="v0470-browbtn" data-v48detail="${s}:${t[0]}">${t[1]}</button>`:t[1]}</td><td>${r?.label||'○ EJ KÖRD'}</td><td><button class="v0470-help" data-v48help="${t[0]}">?</button></td></tr>`}).join('');
 const bar=document.getElementById(`v0480${s}Bar`),pct=document.getElementById(`v0480${s}Pct`),sum=document.getElementById(`v0480${s}Summary`);
 if(bar)bar.style.width=`${done/10*100}%`;if(pct)pct.textContent=`${done}/10`;
 if(sum){const a=Object.values(x.tests);sum.textContent=`${done}/10 klara · ✅ ${a.filter(r=>r.status==='ROBUST').length} robusta · ⚠️ ${a.filter(r=>r.status==='SENSITIVE').length} känsliga · ❌ ${a.filter(r=>r.status==='WEAK').length} svagheter · ℹ️ ${a.filter(r=>r.status==='INFO').length} beskrivande`;}
 [`v0480${s}Report`,`v0480${s}Raw`].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=!x.completed});
 document.querySelectorAll('[data-v48help]').forEach(b=>b.onclick=()=>v0480ShowHelp(b.dataset.v48help));
 document.querySelectorAll('[data-v48detail]').forEach(b=>b.onclick=()=>v0480ShowDetail(b.dataset.v48detail));
}
function v0480ShowHelp(key){const x=V0480_HELP[key]||['Förklaring','Detta test är diagnostik på återanvänd historik.'],m=document.getElementById('v0480HelpModal');document.getElementById('v0480HelpTitle').textContent=x[0];document.getElementById('v0480HelpBody').innerHTML=`<p>${x[1]}</p>`;m.hidden=false}
function v0480ShowDetail(key){const [s,id]=key.split(':'),x=v0480Load(s),r=x.tests[id],t=V0480_DEFS[s].tests.find(q=>q[0]===id),m=document.getElementById('v0480DetailModal');document.getElementById('v0480DetailTitle').textContent=`Suite ${s} · ${t?.[1]||id}`;document.getElementById('v0480DetailBody').innerHTML=r?`<p><b>${r.label}</b></p><p>${r.explain}</p><details><summary>Visa tekniska detaljer</summary><pre style="white-space:pre-wrap">${JSON.stringify(r.metrics,null,2)}</pre></details>`:'Ej kört';document.getElementById('v0480ExportOne').dataset.key=key;m.hidden=false}
async function v0480RunSuite(s,all=true){
 if(V0480_RUNNING)throw new Error('En lokal svit körs redan.');V0480_RUNNING=true;const d=V0480_DEFS[s],st=document.getElementById(`v0480${s}Status`);
 try{let x=v0480Load(s);do{const t=d.tests.find(q=>!x.tests[q[0]]);if(!t)break;st.textContent=`Kör ${t[1]}…`;const r=await v0480RunTest(s,t[0]);x.tests[t[0]]={...r,completedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:v0480Base()?.dataFingerprint||'—'};v0480Save(s,x);v0480Paint(s);if(!all)break;await new Promise(r=>setTimeout(r,15))}while(true);x=v0480Load(s);if(d.tests.every(t=>x.tests[t[0]])){x.completed=true;v0480Save(s,x);st.textContent=`✓ Suite ${s} klar · 10/10.`}else st.textContent='✓ Test sparat.'}catch(e){st.textContent='KÖRFEL: '+(e?.message||e);throw e}finally{V0480_RUNNING=false;v0480Paint(s)}
}
function v0480Report(s){const d=V0480_DEFS[s],x=v0480Load(s),L=[`LINAS OPTI – VALIDATION SUITE ${s} · ${d.name}`,'Version: '+APP_VERSION,'Handel: AVSTÄNGD','Close >=83% fryst kandidat','Regelhash: '+V0460_RULE_HASH,'','OBS: diagnostik på återanvänd historik – inte nytt orört OOS-bevis.',''];d.tests.forEach((t,i)=>{const r=x.tests[t[0]];L.push(`${i+1}. ${t[1]} | ${r?.label||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('','Ingen parameteroptimering eller automatisk räddning har körts.');return L.join('\n')}
function v0480ExportOne(key){const [s,id]=key.split(':'),r=v0480Load(s).tests[id],t=V0480_DEFS[s].tests.find(q=>q[0]===id);return [`LINAS OPTI – SUITE ${s} TEST`,'Version: '+APP_VERSION,'Test: '+t[1],'Bedömning: '+r.label,'',r.explain,JSON.stringify(r.metrics,null,2),'','Återanvänd historik – diagnostik, inte nytt OOS-bevis.'].join('\n')}
async function v0480RunCDE(){const o=document.getElementById('v0480CDEStatus');try{o.textContent='Kör Suite C…';await v0480RunSuite('C',true);o.textContent='Kör Suite D…';await v0480RunSuite('D',true);o.textContent='Kör Suite E…';await v0480RunSuite('E',true);o.textContent='✓ C + D + E klara · 30/30 tester.'}catch(e){o.textContent='KÖRFEL: '+(e?.message||e)}}

function v0480CDEReport(){
 const L=['LINAS OPTI – VALIDATION SUITES C + D + E','Version: '+APP_VERSION,'Handel: AVSTÄNGD','Close >=83% fryst kandidat','Regelhash: '+V0460_RULE_HASH,'','30 lokala diagnostiska tester · återanvänd historik · inte nytt orört OOS-bevis.',''];
 for(const s of ['C','D','E']){L.push(`=== SUITE ${s} · ${V0480_DEFS[s].name} ===`);const x=v0480Load(s);V0480_DEFS[s].tests.forEach((t,i)=>{const r=x.tests[t[0]];L.push(`${i+1}. ${t[1]} | ${r?.label||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('')}
 L.push('Ingen parameteroptimering eller automatisk räddning har körts.');return L.join('\n')
}
function v0480CDEBackup(){return{backupSchema:'lina-v0480-cde-backup-v1',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:v0480Base()?.dataFingerprint||'—',suiteC:v0480Load('C'),suiteD:v0480Load('D'),suiteE:v0480Load('E')}}
window.addEventListener('DOMContentLoaded',()=>{
 for(const s of ['C','D','E']){
  document.getElementById(`v0480${s}RunAll`)?.addEventListener('click',()=>v0480RunSuite(s,true).catch(()=>{}));
  document.getElementById(`v0480${s}RunNext`)?.addEventListener('click',()=>v0480RunSuite(s,false).catch(()=>{}));
  document.getElementById(`v0480${s}Report`)?.addEventListener('click',()=>v0460Dl(v0480Report(s),`LINAS_OPTI_VALIDATION_SUITE_${s}_V0480_${new Date().toISOString().slice(0,10)}.txt`));
  document.getElementById(`v0480${s}Raw`)?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0480Load(s),null,2),`LINAS_OPTI_VALIDATION_SUITE_${s}_RAW_V0480_${new Date().toISOString().slice(0,10)}.json`,'application/json'));
  v0480Paint(s);
 }
 document.getElementById('v0480RunCDE')?.addEventListener('click',v0480RunCDE);
 document.getElementById('v0480CDEReport')?.addEventListener('click',()=>v0460Dl(v0480CDEReport(),`LINAS_OPTI_VALIDATION_CDE_V0480_${new Date().toISOString().slice(0,10)}.txt`));
 document.getElementById('v0480CDEBackup')?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0480CDEBackup(),null,2),`LINAS_OPTI_VALIDATION_CDE_BACKUP_V0480_${new Date().toISOString().slice(0,10)}.json`,'application/json'));
 document.getElementById('v0480HelpClose')?.addEventListener('click',()=>document.getElementById('v0480HelpModal').hidden=true);
 document.getElementById('v0480DetailClose')?.addEventListener('click',()=>document.getElementById('v0480DetailModal').hidden=true);
 document.getElementById('v0480ExportOne')?.addEventListener('click',e=>{const k=e.currentTarget.dataset.key;if(k){const [s,id]=k.split(':');v0460Dl(v0480ExportOne(k),`LINAS_OPTI_SUITE_${s}_${id.toUpperCase()}_V0480_${new Date().toISOString().slice(0,10)}.txt`)}})
 document.getElementById('v0480HelpModal')?.addEventListener('click',e=>{if(e.target.id==='v0480HelpModal')e.currentTarget.hidden=true});
 document.getElementById('v0480DetailModal')?.addEventListener('click',e=>{if(e.target.id==='v0480DetailModal')e.currentTarget.hidden=true});
 const jump=document.getElementById('v0413LabJump');if(jump&&[...jump.options].some(o=>o.value==='v0480ELab')){jump.value='v0480ELab';try{localStorage.setItem('linasopti_testlab_selected_v0423','v0480ELab')}catch{}jump.dispatchEvent(new Event('change'))}
});


// ============================================================
// V0.49.0 – VALIDATION SUITES F / G / H
// 30 more local diagnostics. No optimization.
// ============================================================
const V0490_DEFS={
 F:{name:'Sekvens & tidsberoende',key:'linasopti_validation_suite_f_v0490',tests:[
  ['acf1','P/L-autokorrelation lag 1'],['transitions','Vinst/förlust-övergångar'],['postloss','Efter förlustaffär'],
  ['poststreak','Efter 3 raka förluster'],['monthacf','Månadsautokorrelation'],['qacf','Kvartalsautokorrelation'],
  ['monthhalf','Första vs andra halvan av månaden'],['monthedge','Månadens början vs slut'],['daycluster','Dagsklustring av affärer'],['dailyexpect','Daglig expectancy']
 ]},
 G:{name:'Trade-geometri & exits',key:'linasopti_validation_suite_g_v0490',tests:[
  ['rmultiple','Realiserad R-multipel'],['riskdist','Riskbelopp per affär'],['targetshare','Andel målträffar'],['stopshare','Andel stoppar'],
  ['max60share','Andel max-60-exits'],['holdbands','Hålltid × P/L'],['pricequart','Entrypris-kvartiler'],['sizequart','Positionsstorlek-kvartiler'],
  ['equityquart','Equity-kvartiler'],['exitdistance','Exitavstånd från entry']
 ]},
 H:{name:'Blockstress & borttagning',key:'linasopti_validation_suite_h_v0490',tests:[
  ['loomonth','Leave-one-month-out'],['looquarter','Leave-one-quarter-out'],['looyear','Leave-one-year-out'],['looweekday','Leave-one-weekday-out'],
  ['lootime','Leave-one-timebucket-out'],['removebest1m','Ta bort bästa månaden'],['removebest3m','Ta bort tre bästa månader'],
  ['winsor1','Winsorize 1% tails'],['winsor25','Winsorize 2,5% tails'],['oddEven','Udda vs jämna handelsdagar']
 ]}
};
const V0490_HELP={
 'F:suite':['Suite F','Mäter om affärsresultaten uppvisar sekvensberoende, klustring eller tidsmönster som kan göra edgen mindre stabil.'],
 'G:suite':['Suite G','Mäter själva affärernas geometri: risk, R-multiplar, exitmix, hålltid och positionsstorlek.'],
 'H:suite':['Suite H','Stressar resultatet genom att ta bort hela tidsblock eller begränsa extrema affärer.'],
 acf1:['P/L-autokorrelation','Korrelation mellan en affärs P/L och nästa affärs P/L. Nära noll betyder svagt linjärt sekvensberoende.'],
 transitions:['Övergångar','Jämför sannolikheten för vinst efter vinst och efter förlust.'],postloss:['Efter förlust','Expectancy på affären direkt efter en förlust.'],
 poststreak:['Efter 3 förluster','Expectancy på affären efter minst tre raka förluster.'],monthacf:['Månadsautokorrelation','Samband mellan en månads resultat och nästa månads resultat.'],
 qacf:['Kvartalsautokorrelation','Samband mellan ett kvartals resultat och nästa.'],monthhalf:['Månadshalvor','Jämför affärer dag 1–15 med dag 16–slut.'],
 monthedge:['Månads början/slut','Jämför första 5 och sista 5 kalenderdagarna i varje månad.'],daycluster:['Dagsklustring','Mäter hur många affärer som normalt inträffar samma handelsdag.'],
 dailyexpect:['Daglig expectancy','Fördelning av total P/L per aktiv handelsdag.'],
 rmultiple:['R-multipel','Realiserad P/L dividerad med planerad riskreferens 0,6% av entry-notional.'],riskdist:['Riskbelopp','Fördelning av uppskattad riskreferens per affär.'],
 targetshare:['Målträffar','Andel affärer som avslutats på mål +0,8%.'],stopshare:['Stoppar','Andel affärer som avslutats på stop efter delay.'],
 max60share:['Max 60 min','Andel affärer som avslutas av tidsgränsen.'],holdbands:['Hålltid','P/L uppdelat på kort, medel och längre hålltid.'],
 pricequart:['Entrypris','Jämför P/L mellan fyra kvartiler av entrypris.'],sizequart:['Positionsstorlek','Jämför P/L mellan fyra kvartiler av notionalstorlek.'],
 equityquart:['Equitynivå','Jämför P/L mellan fyra kvartiler av entryEquity.'],exitdistance:['Exitavstånd','Fördelning av procentuell exitrörelse från entry.'],
 loomonth:['Leave-one-month-out','Tar bort en hel månad i taget och letar efter sämsta kvarvarande totalresultat.'],looquarter:['Leave-one-quarter-out','Tar bort ett helt kvartal i taget.'],
 looyear:['Leave-one-year-out','Tar bort ett år i taget.'],looweekday:['Leave-one-weekday-out','Tar bort en veckodag i taget.'],
 lootime:['Leave-one-timebucket-out','Tar bort ett 30-minuters entryfönster i taget.'],removebest1m:['Ta bort bästa månaden','Stressar resultatet utan den mest lönsamma månaden.'],
 removebest3m:['Ta bort tre bästa månader','Hårdare stress utan de tre bästa månaderna.'],winsor1:['Winsorize 1%','Begränsar de översta och nedersta 1% av affärsresultaten till respektive percentil.'],
 winsor25:['Winsorize 2,5%','Samma tailstress vid 2,5%.'],oddEven:['Udda/jämna dagar','Jämför handelsdagar med udda respektive jämnt datum.']
};
function v0490New(s){return{schema:'LINA-SUITE-'+s+'-1',appVersion:'V0.49.0',rulesHash:V0460_RULE_HASH,createdAt:new Date().toISOString(),tests:{},completed:false}}
function v0490Load(s){const d=V0490_DEFS[s];try{const x=JSON.parse(localStorage.getItem(d.key)||'null');return x&&x.schema==='LINA-SUITE-'+s+'-1'&&x.rulesHash===V0460_RULE_HASH?x:v0490New(s)}catch{return v0490New(s)}}
function v0490Save(s,x){x.updatedAt=new Date().toISOString();localStorage.setItem(V0490_DEFS[s].key,JSON.stringify(x));return x}
function v0490Base(){return v0470BBase()}
function v0490Assess(v,g,w){return v>=g?{status:'ROBUST',label:'✅ SER ROBUST UT'}:v>=w?{status:'SENSITIVE',label:'⚠️ KÄNSLIG'}:{status:'WEAK',label:'❌ SVAGHET HITTAD'}}
function v0490Info(){return{status:'INFO',label:'ℹ️ BESKRIVANDE'}}
function v0490Corr(a,b){const n=Math.min(a.length,b.length);if(n<3)return 0;const ma=a.slice(0,n).reduce((x,y)=>x+y,0)/n,mb=b.slice(0,n).reduce((x,y)=>x+y,0)/n;let num=0,da=0,db=0;for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;num+=x*y;da+=x*x;db+=y*y}return da&&db?num/Math.sqrt(da*db):0}
function v0490DayKey(t){return (t.entryTime||'').slice(0,10)}
function v0490MonthKey(t){return (t.entryTime||'').slice(0,7)}
function v0490QuarterKey(t){const y=(t.entryTime||'').slice(0,4),m=+(t.entryTime||'').slice(5,7);return `${y}-Q${Math.ceil(m/3)}`}
function v0490Group(tr,fn){const g={};for(const t of tr){const k=fn(t);(g[k]??=[]).push(t)}return g}
function v0490Rows(g){return Object.entries(g).map(([k,a])=>({key:k,...v0470BStats(a)}))}
function v0490Quant(a,p){return v0470BQ(a,p)}
function v0490Notional(t){return v0470BNotional(t)}
function v0490Hold(t){return Math.max(0,(new Date(t.exitTime)-new Date(t.entryTime))/60000)}
function v0490NY(t){return new Date(new Date(t.entryTime).toLocaleString('en-US',{timeZone:'America/New_York'}))}
function v0490QuartRows(tr,fn){const vals=tr.map(fn).sort((a,b)=>a-b),q1=v0490Quant(vals,.25),q2=v0490Quant(vals,.5),q3=v0490Quant(vals,.75),g=v0490Group(tr,t=>{const v=fn(t);return v<=q1?'Q1':v<=q2?'Q2':v<=q3?'Q3':'Q4'});return{cuts:[q1,q2,q3],rows:v0490Rows(g)}}
function v0490Winsor(vals,p){const lo=v0490Quant(vals,p),hi=v0490Quant(vals,1-p);return vals.map(x=>Math.max(lo,Math.min(hi,x)))}
async function v0490RunTest(s,id){
 const base=v0490Base();if(!base?.closed?.length)throw new Error('Suite A-basdata saknas lokalt.');
 const tr=[...base.closed].sort((a,b)=>new Date(a.entryTime)-new Date(b.entryTime)),p=tr.map(v0470BPnl),st=v0470BStats(tr);
 if(id==='acf1'){const c=v0490Corr(p.slice(0,-1),p.slice(1)),score=1-Math.min(1,Math.abs(c)/.25),q=v0490Assess(score,.75,.45);return{...q,metrics:{lag1:c},explain:`Lag-1 autokorrelation ${c.toFixed(3)}.`}}
 if(id==='transitions'){let ww=0,wn=0,lw=0,ln=0;for(let i=1;i<p.length;i++){if(p[i-1]>0){wn++;if(p[i]>0)ww++}else{ln++;if(p[i]>0)lw++}}const pw=ww/wn,pl=lw/ln,d=Math.abs(pw-pl),q=v0490Assess(1-d,.9,.8);return{...q,metrics:{pWinAfterWin:pw,pWinAfterLoss:pl,diff:d},explain:`Vinst efter vinst ${(pw*100).toFixed(1)}% · efter förlust ${(pl*100).toFixed(1)}%.`}}
 if(id==='postloss'){const a=[];for(let i=1;i<tr.length;i++)if(p[i-1]<0)a.push(tr[i]);const s2=v0470BStats(a),q=s2.pnl>0?v0490Assess(1,1,.5):v0490Assess(0,1,.5);return{...q,metrics:s2,explain:`Efter förlust: ${s2.n} affärer · P/L ${s2.pnl.toFixed(0)} kr · PF ${s2.pf.toFixed(2)}.`}}
 if(id==='poststreak'){const a=[];let streak=0;for(let i=0;i<tr.length-1;i++){streak=p[i]<0?streak+1:0;if(streak>=3)a.push(tr[i+1])}const s2=v0470BStats(a),q=s2.pnl>0?v0490Assess(1,1,.5):s2.pnl>-1000?v0490Assess(.5,1,.5):v0490Assess(0,1,.5);return{...q,metrics:s2,explain:`Efter ≥3 raka förluster: ${s2.n} affärer · P/L ${s2.pnl.toFixed(0)} kr.`}}
 if(id==='monthacf'||id==='qacf'){const g={};for(const t of tr){const k=id==='monthacf'?v0490MonthKey(t):v0490QuarterKey(t);g[k]=(g[k]||0)+v0470BPnl(t)}const vals=Object.keys(g).sort().map(k=>g[k]),c=v0490Corr(vals.slice(0,-1),vals.slice(1)),score=1-Math.min(1,Math.abs(c)/.4),q=v0490Assess(score,.75,.45);return{...q,metrics:{lag1:c,blocks:vals.length},explain:`${id==='monthacf'?'Månads':'Kvartals'} lag-1 ${c.toFixed(3)} över ${vals.length} block.`}}
 if(id==='monthhalf'){const g=v0490Group(tr,t=>+v0490DayKey(t).slice(8,10)<=15?'Dag 1–15':'Dag 16–slut'),rows=v0490Rows(g),pos=rows.filter(x=>x.pnl>0).length,q=v0490Assess(pos,2,1);return{...q,metrics:{groups:rows},explain:rows.map(x=>`${x.key}: ${x.pnl.toFixed(0)} kr`).join(' · ')}}
 if(id==='monthedge'){const g=v0490Group(tr,t=>{const d=+v0490DayKey(t).slice(8,10);return d<=5?'Dag 1–5':d>=25?'Dag 25–slut':'Mitten'}),rows=v0490Rows(g),edges=rows.filter(x=>x.key!=='Mitten'),pos=edges.filter(x=>x.pnl>0).length,q=v0490Assess(pos,2,1);return{...q,metrics:{groups:rows},explain:rows.map(x=>`${x.key}: ${x.pnl.toFixed(0)} kr`).join(' · ')}}
 if(id==='daycluster'){const g=v0490Group(tr,v0490DayKey),counts=Object.values(g).map(a=>a.length),mean=counts.reduce((a,b)=>a+b,0)/counts.length,p95=v0490Quant(counts,.95);return{...v0490Info(),metrics:{activeDays:counts.length,meanTradesPerDay:mean,p95},explain:`${counts.length} aktiva dagar · snitt ${mean.toFixed(2)} affärer/dag · 95:e percentil ${p95}.`}}
 if(id==='dailyexpect'){const g=v0490Group(tr,v0490DayKey),vals=Object.values(g).map(a=>v0470BStats(a).pnl),pos=vals.filter(x=>x>0).length/vals.length,q=v0490Assess(pos,.55,.48);return{...q,metrics:{activeDays:vals.length,positiveRate:pos,median:v0490Quant(vals,.5),worst:Math.min(...vals)},explain:`${(pos*100).toFixed(1)}% positiva aktiva dagar · median ${v0490Quant(vals,.5).toFixed(0)} kr.`}}
 if(id==='rmultiple'){const r=tr.map(t=>v0470BPnl(t)/(v0490Notional(t)*.006||1)),mean=r.reduce((a,b)=>a+b,0)/r.length,med=v0490Quant(r,.5),q=mean>0?v0490Assess(mean,.02,0):v0490Assess(-1,.02,0);return{...q,metrics:{meanR:mean,medianR:med,p05:v0490Quant(r,.05),p95:v0490Quant(r,.95)},explain:`Snitt ${mean.toFixed(3)}R · median ${med.toFixed(3)}R.`}}
 if(id==='riskdist'){const r=tr.map(t=>v0490Notional(t)*.006),mean=r.reduce((a,b)=>a+b,0)/r.length;return{...v0490Info(),metrics:{mean,median:v0490Quant(r,.5),p05:v0490Quant(r,.05),p95:v0490Quant(r,.95)},explain:`Riskreferens median ${v0490Quant(r,.5).toFixed(0)} kr · 5–95% ${v0490Quant(r,.05).toFixed(0)}–${v0490Quant(r,.95).toFixed(0)} kr.`}}
 if(id==='targetshare'||id==='stopshare'||id==='max60share'){const key=id==='targetshare'?'mål':id==='stopshare'?'stop':'max 60',n=tr.filter(t=>(t.why||'').toLowerCase().includes(key)).length,r=n/tr.length;return{...v0490Info(),metrics:{count:n,share:r,total:tr.length},explain:`${n}/${tr.length} = ${(r*100).toFixed(1)}%.`}}
 if(id==='holdbands'){const g=v0490Group(tr,t=>{const m=v0490Hold(t);return m<=20?'≤20 min':m<=40?'21–40 min':'41–60+ min'}),rows=v0490Rows(g),pos=rows.filter(x=>x.pnl>0).length,q=v0490Assess(pos,2,1);return{...q,metrics:{groups:rows},explain:rows.map(x=>`${x.key}: ${x.pnl.toFixed(0)} kr`).join(' · ')}}
 if(id==='pricequart'||id==='sizequart'||id==='equityquart'){const fn=id==='pricequart'?t=>+t.entry:id==='sizequart'?v0490Notional:t=>+t.entryEquity||0,o=v0490QuartRows(tr,fn),pos=o.rows.filter(x=>x.pnl>0).length,q=v0490Assess(pos,3,2);return{...q,metrics:o,explain:`${pos}/4 kvartiler positiva.`}}
 if(id==='exitdistance'){const a=tr.map(t=>(+t.exit-+t.entry)/(+t.entry||1)),mean=a.reduce((x,y)=>x+y,0)/a.length;return{...v0490Info(),metrics:{mean,median:v0490Quant(a,.5),p05:v0490Quant(a,.05),p95:v0490Quant(a,.95)},explain:`Exit-rörelse snitt ${(mean*100).toFixed(3)}% · median ${(v0490Quant(a,.5)*100).toFixed(3)}%.`}}
 if(['loomonth','looquarter','looyear','looweekday','lootime'].includes(id)){let fn;if(id==='loomonth')fn=v0490MonthKey;else if(id==='looquarter')fn=v0490QuarterKey;else if(id==='looyear')fn=t=>(t.entryTime||'').slice(0,4);else if(id==='looweekday')fn=t=>new Intl.DateTimeFormat('sv-SE',{timeZone:'America/New_York',weekday:'short'}).format(new Date(t.entryTime));else fn=t=>{const d=new Date(t.entryTime),p=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(d),h=+p.find(x=>x.type==='hour').value,m=+p.find(x=>x.type==='minute').value;return `${h}:${m<30?'00':'30'}`};const keys=[...new Set(tr.map(fn))],rows=keys.map(k=>({removed:k,...v0470BStats(tr.filter(t=>fn(t)!==k))})).sort((a,b)=>a.pnl-b.pnl),worst=rows[0],q=worst.pnl>0?v0490Assess(1,1,.5):worst.pnl>-1500?v0490Assess(.5,1,.5):v0490Assess(0,1,.5);return{...q,metrics:{worst,all:rows},explain:`Sämsta kvarvarande P/L efter ett block tas bort: ${worst.pnl.toFixed(0)} kr (${worst.removed}).`}}
 if(id==='removebest1m'||id==='removebest3m'){const n=id==='removebest1m'?1:3,g=v0490Group(tr,v0490MonthKey),rows=v0490Rows(g).sort((a,b)=>b.pnl-a.pnl),drop=new Set(rows.slice(0,n).map(x=>x.key)),r=v0470BStats(tr.filter(t=>!drop.has(v0490MonthKey(t)))),q=r.pnl>0?v0490Assess(1,1,.5):r.pnl>-1500?v0490Assess(.5,1,.5):v0490Assess(0,1,.5);return{...q,metrics:{removed:[...drop],remaining:r},explain:`Utan ${n} bästa månad${n>1?'er':''}: P/L ${r.pnl.toFixed(0)} kr · PF ${r.pf.toFixed(2)}.`}}
 if(id==='winsor1'||id==='winsor25'){const cut=id==='winsor1'?.01:.025,w=v0490Winsor(p,cut),sum=w.reduce((a,b)=>a+b,0),mean=sum/w.length,q=sum>0?v0490Assess(1,1,.5):sum>-1000?v0490Assess(.5,1,.5):v0490Assess(0,1,.5);return{...q,metrics:{cut,totalPnl:sum,mean},explain:`Winsor ${(cut*100).toFixed(1)}%: total P/L ${sum.toFixed(0)} kr.`}}
 if(id==='oddEven'){const a=v0470BStats(tr.filter(t=>+v0490DayKey(t).slice(8,10)%2)),b=v0470BStats(tr.filter(t=>!(+v0490DayKey(t).slice(8,10)%2))),pos=(a.pnl>0?1:0)+(b.pnl>0?1:0),q=v0490Assess(pos,2,1);return{...q,metrics:{odd:a,even:b},explain:`Udda datum ${a.pnl.toFixed(0)} kr · jämna datum ${b.pnl.toFixed(0)} kr.`}}
 throw new Error('Okänt test '+id)
}
let V0490_RUNNING=false;
function v0490Paint(s){const d=V0490_DEFS[s],x=v0490Load(s),done=d.tests.filter(t=>x.tests[t[0]]).length,rows=document.getElementById(`v0490${s}Rows`);if(rows)rows.innerHTML=d.tests.map((t,i)=>{const r=x.tests[t[0]];return `<tr><td>${i+1}</td><td>${r?`<button class="v0470-browbtn" data-v49detail="${s}:${t[0]}">${t[1]}</button>`:t[1]}</td><td>${r?.label||'○ EJ KÖRD'}</td><td><button class="v0470-help" data-v49help="${t[0]}">?</button></td></tr>`}).join('');const bar=document.getElementById(`v0490${s}Bar`),pct=document.getElementById(`v0490${s}Pct`),sum=document.getElementById(`v0490${s}Summary`);if(bar)bar.style.width=`${done/10*100}%`;if(pct)pct.textContent=`${done}/10`;if(sum){const a=Object.values(x.tests);sum.textContent=`${done}/10 klara · ✅ ${a.filter(r=>r.status==='ROBUST').length} robusta · ⚠️ ${a.filter(r=>r.status==='SENSITIVE').length} känsliga · ❌ ${a.filter(r=>r.status==='WEAK').length} svagheter · ℹ️ ${a.filter(r=>r.status==='INFO').length} beskrivande`;}[`v0490${s}Report`,`v0490${s}Raw`].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=!x.completed});document.querySelectorAll('[data-v49help]').forEach(b=>b.onclick=()=>v0490ShowHelp(b.dataset.v49help));document.querySelectorAll('[data-v49detail]').forEach(b=>b.onclick=()=>v0490ShowDetail(b.dataset.v49detail))}
function v0490ShowHelp(key){const x=V0490_HELP[key]||['Förklaring','Diagnostik på återanvänd historik.'],m=document.getElementById('v0490HelpModal');document.getElementById('v0490HelpTitle').textContent=x[0];document.getElementById('v0490HelpBody').innerHTML=`<p>${x[1]}</p>`;m.hidden=false}
function v0490ShowDetail(key){const [s,id]=key.split(':'),r=v0490Load(s).tests[id],t=V0490_DEFS[s].tests.find(q=>q[0]===id),m=document.getElementById('v0490DetailModal');document.getElementById('v0490DetailTitle').textContent=`Suite ${s} · ${t?.[1]||id}`;document.getElementById('v0490DetailBody').innerHTML=r?`<p><b>${r.label}</b></p><p>${r.explain}</p><details><summary>Visa tekniska detaljer</summary><pre style="white-space:pre-wrap">${JSON.stringify(r.metrics,null,2)}</pre></details>`:'Ej kört';document.getElementById('v0490ExportOne').dataset.key=key;m.hidden=false}
async function v0490RunSuite(s,all=true){if(V0490_RUNNING)throw new Error('En lokal svit körs redan.');V0490_RUNNING=true;const d=V0490_DEFS[s],st=document.getElementById(`v0490${s}Status`);try{let x=v0490Load(s);do{const t=d.tests.find(q=>!x.tests[q[0]]);if(!t)break;st.textContent=`Kör ${t[1]}…`;const r=await v0490RunTest(s,t[0]);x.tests[t[0]]={...r,completedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:v0490Base()?.dataFingerprint||'—'};v0490Save(s,x);v0490Paint(s);if(!all)break;await new Promise(r=>setTimeout(r,15))}while(true);x=v0490Load(s);if(d.tests.every(t=>x.tests[t[0]])){x.completed=true;v0490Save(s,x);st.textContent=`✓ Suite ${s} klar · 10/10.`}else st.textContent='✓ Test sparat.'}catch(e){st.textContent='KÖRFEL: '+(e?.message||e);throw e}finally{V0490_RUNNING=false;v0490Paint(s)}}
function v0490Report(s){const d=V0490_DEFS[s],x=v0490Load(s),L=[`LINAS OPTI – VALIDATION SUITE ${s} · ${d.name}`,'Version: '+APP_VERSION,'Handel: AVSTÄNGD','Close >=83% fryst kandidat','Regelhash: '+V0460_RULE_HASH,'','OBS: diagnostik på återanvänd historik – inte nytt orört OOS-bevis.',''];d.tests.forEach((t,i)=>{const r=x.tests[t[0]];L.push(`${i+1}. ${t[1]} | ${r?.label||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('','Ingen parameteroptimering eller automatisk räddning har körts.');return L.join('\n')}
function v0490ExportOne(key){const [s,id]=key.split(':'),r=v0490Load(s).tests[id],t=V0490_DEFS[s].tests.find(q=>q[0]===id);return [`LINAS OPTI – SUITE ${s} TEST`,'Version: '+APP_VERSION,'Test: '+t[1],'Bedömning: '+r.label,'',r.explain,JSON.stringify(r.metrics,null,2),'','Återanvänd historik – diagnostik, inte nytt OOS-bevis.'].join('\n')}
async function v0490RunFGH(){const o=document.getElementById('v0490FGHStatus');try{o.textContent='Kör Suite F…';await v0490RunSuite('F',true);o.textContent='Kör Suite G…';await v0490RunSuite('G',true);o.textContent='Kör Suite H…';await v0490RunSuite('H',true);o.textContent='✓ F + G + H klara · 30/30 tester.'}catch(e){o.textContent='KÖRFEL: '+(e?.message||e)}}
function v0490FGHReport(){const L=['LINAS OPTI – VALIDATION SUITES F + G + H','Version: '+APP_VERSION,'Handel: AVSTÄNGD','Close >=83% fryst kandidat','Regelhash: '+V0460_RULE_HASH,'','30 lokala diagnostiska tester · återanvänd historik · inte nytt orört OOS-bevis.',''];for(const s of ['F','G','H']){L.push(`=== SUITE ${s} · ${V0490_DEFS[s].name} ===`);const x=v0490Load(s);V0490_DEFS[s].tests.forEach((t,i)=>{const r=x.tests[t[0]];L.push(`${i+1}. ${t[1]} | ${r?.label||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('')}L.push('Ingen parameteroptimering eller automatisk räddning har körts.');return L.join('\n')}
function v0490FGHBackup(){return{backupSchema:'lina-v0490-fgh-backup-v1',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:v0490Base()?.dataFingerprint||'—',suiteF:v0490Load('F'),suiteG:v0490Load('G'),suiteH:v0490Load('H')}}
window.addEventListener('DOMContentLoaded',()=>{for(const s of ['F','G','H']){document.getElementById(`v0490${s}RunAll`)?.addEventListener('click',()=>v0490RunSuite(s,true).catch(()=>{}));document.getElementById(`v0490${s}RunNext`)?.addEventListener('click',()=>v0490RunSuite(s,false).catch(()=>{}));document.getElementById(`v0490${s}Report`)?.addEventListener('click',()=>v0460Dl(v0490Report(s),`LINAS_OPTI_VALIDATION_SUITE_${s}_V0490_${new Date().toISOString().slice(0,10)}.txt`));document.getElementById(`v0490${s}Raw`)?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0490Load(s),null,2),`LINAS_OPTI_VALIDATION_SUITE_${s}_RAW_V0490_${new Date().toISOString().slice(0,10)}.json`,'application/json'));v0490Paint(s)}document.getElementById('v0490RunFGH')?.addEventListener('click',v0490RunFGH);document.getElementById('v0490FGHReport')?.addEventListener('click',()=>v0460Dl(v0490FGHReport(),`LINAS_OPTI_VALIDATION_FGH_V0490_${new Date().toISOString().slice(0,10)}.txt`));document.getElementById('v0490FGHBackup')?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0490FGHBackup(),null,2),`LINAS_OPTI_VALIDATION_FGH_BACKUP_V0490_${new Date().toISOString().slice(0,10)}.json`,'application/json'));document.getElementById('v0490HelpClose')?.addEventListener('click',()=>document.getElementById('v0490HelpModal').hidden=true);document.getElementById('v0490DetailClose')?.addEventListener('click',()=>document.getElementById('v0490DetailModal').hidden=true);document.getElementById('v0490ExportOne')?.addEventListener('click',e=>{const k=e.currentTarget.dataset.key;if(k){const [s,id]=k.split(':');v0460Dl(v0490ExportOne(k),`LINAS_OPTI_SUITE_${s}_${id.toUpperCase()}_V0490_${new Date().toISOString().slice(0,10)}.txt`)}});const jump=document.getElementById('v0413LabJump');if(jump&&[...jump.options].some(o=>o.value==='v0490HLab')){jump.value='v0490HLab';try{localStorage.setItem('linasopti_testlab_selected_v0423','v0490HLab')}catch{}jump.dispatchEvent(new Event('change'))}});


// ============================================================
// V0.50.0 – VALIDATION SUITES I / J / K
// 30 local diagnostics from saved Suite A trades.
// No optimization, no fresh OOS claim.
// ============================================================
const V0500_DEFS={
 I:{name:'Fördelning & expectancy',key:'linasopti_validation_suite_i_v0500',tests:[
  ['payoff','Payoff ratio'],['trimmean','Trimmat snitt 5%'],['quantiles','P/L-kvantiler'],
  ['skew','Skevhet'],['kurt','Excess kurtosis'],['dropTop1','PF utan bästa 1% vinnare'],
  ['dropWorst1','PF utan sämsta 1% förluster'],['medexpect','Median-expectancy'],['winloss','Win/loss-asymmetri'],['decomp','Expectancy-dekomposition']
 ]},
 J:{name:'Equity & drawdown',key:'linasopti_validation_suite_j_v0500',tests:[
  ['maxddkr','Max drawdown i kronor'],['maxddpct','Max drawdown i procent'],['uwtrades','Längsta underwater i affärer'],
  ['uwdays','Längsta underwater i kalenderdagar'],['recovery','Recovery factor'],['ulcer','Ulcer index'],
  ['worstday','Sämsta aktiva dag'],['worstweek','Sämsta vecka'],['worstmonth2','Sämsta månad'],['ddepisodes','Drawdown-episoder']
 ]},
 K:{name:'Resiliens & kombostress',key:'linasopti_validation_suite_k_v0500',tests:[
  ['drop5','Slumpbortfall 5%'],['drop15','Slumpbortfall 15%'],['drop30','Slumpbortfall 30%'],
  ['cost10drop10','+10% kostnad + 10% bortfall'],['cost20drop10','+20% kostnad + 10% bortfall'],
  ['monthbootcost10','Månadsbootstrap +10% kostnad'],['remove2m','Ta bort 2 slumpmånader'],['remove4m','Ta bort 4 slumpmånader'],
  ['winsorCost10','Winsor 1% +10% kostnad'],['pessimistic','Pessimistisk kombostress']
 ]}
};
const V0500_HELP={
 'I:suite':['Suite I','Undersöker formen på P/L-fördelningen och hur robust expectancy ser ut utan att ändra handelsregler.'],
 'J:suite':['Suite J','Undersöker equitykurvans drawdowns, underwater-perioder och återhämtning.'],
 'K:suite':['Suite K','Kombinerar kostnadsstress, bortfall och blockborttagning för att se hur tunn marginalen är.'],
 payoff:['Payoff ratio','Genomsnittlig vinst dividerad med genomsnittlig absolut förlust.'],trimmean:['Trimmat snitt','Tar bort översta och nedersta 5% av affärs-P/L innan snittet beräknas.'],
 quantiles:['P/L-kvantiler','Visar 10:e, 25:e, 50:e, 75:e och 90:e percentilen.'],skew:['Skevhet','Positiv skevhet betyder längre högersvans; negativ skevhet längre vänstersvans.'],
 kurt:['Kurtosis','Mäter hur tunga svansarna är relativt normalfördelning.'],dropTop1:['Utan bästa 1%','Tar bort de bästa 1% av vinstaffärerna och räknar om PF/P/L.'],
 dropWorst1:['Utan sämsta 1%','Tar bort de sämsta 1% av förlustaffärerna och räknar om PF/P/L.'],medexpect:['Median-expectancy','Medianen av affärs-P/L; visar om den typiska affären är positiv eller negativ.'],
 winloss:['Win/loss-asymmetri','Jämför genomsnittlig vinnare med genomsnittlig förlorare.'],decomp:['Expectancy-dekomposition','Visar hur win rate och payoff tillsammans skapar expectancy.'],
 maxddkr:['Max drawdown','Största peak-to-trough-fallet i equitykurvan i kronor.'],maxddpct:['Max drawdown %','Största drawdown relativt föregående equitytopp.'],
 uwtrades:['Underwater-affärer','Längsta antal affärer från equitytopp till ny topp.'],uwdays:['Underwater-dagar','Längsta kalenderperiod från equitytopp till återhämtning.'],
 recovery:['Recovery factor','Total nettovinst dividerad med största drawdown.'],ulcer:['Ulcer index','RMS av procentuell drawdown genom equitykurvan; lägre är jämnare.'],
 worstday:['Sämsta dag','Sämsta total-P/L under en aktiv handelsdag.'],worstweek:['Sämsta vecka','Sämsta total-P/L under en ISO-liknande måndag–söndag-vecka.'],
 worstmonth2:['Sämsta månad','Sämsta kalendermånaden i sparad historik.'],ddepisodes:['Drawdown-episoder','Antal separata underwaterperioder samt median och maxdjup.'],
 drop5:['Bortfall 5%','Slumpmässigt tar bort 5% av affärerna i många simuleringar.'],drop15:['Bortfall 15%','Slumpmässigt tar bort 15% av affärerna.'],
 drop30:['Bortfall 30%','Slumpmässigt tar bort 30% av affärerna.'],cost10drop10:['Kostnad+bortfall','Lägger +10% extra modellerad friktion och tar samtidigt bort 10% av affärerna.'],
 cost20drop10:['Hårdare kostnad+bortfall','Lägger +20% extra modellerad friktion och 10% slumpbortfall.'],monthbootcost10:['Månadsbootstrap med kostnad','Resamplar hela månader och lägger +10% extra friktion.'],
 remove2m:['Ta bort två månader','Tar bort två slumpmässiga hela månader många gånger.'],remove4m:['Ta bort fyra månader','Tar bort fyra slumpmässiga hela månader många gånger.'],
 winsorCost10:['Winsor + kostnad','Begränsar 1% tails och lägger +10% extra friktion.'],pessimistic:['Pessimistisk kombostress','Tar bort bästa månaden och lägger +10% extra friktion samtidigt.']
};
function v0500New(s){return{schema:'LINA-SUITE-'+s+'-1',appVersion:'V0.50.0',rulesHash:V0460_RULE_HASH,createdAt:new Date().toISOString(),tests:{},completed:false}}
function v0500Load(s){const d=V0500_DEFS[s];try{const x=JSON.parse(localStorage.getItem(d.key)||'null');return x&&x.schema==='LINA-SUITE-'+s+'-1'&&x.rulesHash===V0460_RULE_HASH?x:v0500New(s)}catch{return v0500New(s)}}
function v0500Save(s,x){x.updatedAt=new Date().toISOString();localStorage.setItem(V0500_DEFS[s].key,JSON.stringify(x));return x}
function v0500Base(){return v0470BBase()}
function v0500Assess(v,g,w){return v>=g?{status:'ROBUST',label:'✅ SER ROBUST UT'}:v>=w?{status:'SENSITIVE',label:'⚠️ KÄNSLIG'}:{status:'WEAK',label:'❌ SVAGHET HITTAD'}}
function v0500Info(){return{status:'INFO',label:'ℹ️ BESKRIVANDE'}}
function v0500Mean(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0}
function v0500Quant(a,p){return v0470BQ(a,p)}
function v0500Moments(a){const m=v0500Mean(a),sd=Math.sqrt(v0500Mean(a.map(x=>(x-m)**2)))||0;if(!sd)return{mean:m,sd:0,skew:0,kurt:0};return{mean:m,sd,skew:v0500Mean(a.map(x=>((x-m)/sd)**3)),kurt:v0500Mean(a.map(x=>((x-m)/sd)**4))-3}}
function v0500Group(tr,fn){const g={};for(const t of tr){const k=fn(t);(g[k]??=[]).push(t)}return g}
function v0500Day(t){return (t.entryTime||'').slice(0,10)}
function v0500Month(t){return (t.entryTime||'').slice(0,7)}
function v0500Week(t){const d=new Date(t.entryTime),x=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));const day=(x.getUTCDay()+6)%7;x.setUTCDate(x.getUTCDate()-day);return x.toISOString().slice(0,10)}
function v0500Eq(tr,start=100000){let e=start,peak=start,maxDD=0,maxPct=0,peakIdx=0,maxDur=0,uwStart=null,maxDays=0,series=[];for(let i=0;i<tr.length;i++){e+=v0470BPnl(tr[i]);if(e>=peak){peak=e;peakIdx=i;uwStart=null}else{const dd=e-peak,pct=dd/peak;maxDD=Math.min(maxDD,dd);maxPct=Math.min(maxPct,pct);const dur=i-peakIdx;maxDur=Math.max(maxDur,dur);if(uwStart===null)uwStart=new Date(tr[Math.max(0,peakIdx)]?.exitTime||tr[i].exitTime);maxDays=Math.max(maxDays,(new Date(tr[i].exitTime)-uwStart)/86400000)}series.push({e,peak,dd:e-peak,pct:(e-peak)/peak})}return{final:e,maxDD,maxPct,maxUnderwaterTrades:maxDur,maxUnderwaterDays:maxDays,series}}
function v0500CostedPnl(t,mult){return v0470BPnl(t)-v0470BNotional(t)*V0460_RULES.costSide*2*(mult-1)}
function v0500Rng(seed){return v0470BRng(seed)}
function v0500Winsor(vals,p){const lo=v0500Quant(vals,p),hi=v0500Quant(vals,1-p);return vals.map(x=>Math.max(lo,Math.min(hi,x)))}
async function v0500RunTest(s,id){
 const base=v0500Base();if(!base?.closed?.length)throw new Error('Suite A-basdata saknas lokalt.');
 const tr=[...base.closed].sort((a,b)=>new Date(a.entryTime)-new Date(b.entryTime)),p=tr.map(v0470BPnl),st=v0470BStats(tr);
 const wins=p.filter(x=>x>0),loss=p.filter(x=>x<0),avgW=v0500Mean(wins),avgL=Math.abs(v0500Mean(loss));
 if(id==='payoff'){const r=avgL?avgW/avgL:Infinity,q=v0500Assess(r,1.5,1.2);return{...q,metrics:{avgWin:avgW,avgLoss:avgL,payoff:r},explain:`Snittvinst ${avgW.toFixed(2)} kr · snittförlust ${avgL.toFixed(2)} kr · payoff ${r.toFixed(2)}.`}}
 if(id==='trimmean'){const a=[...p].sort((x,y)=>x-y),n=Math.floor(a.length*.05),tm=v0500Mean(a.slice(n,a.length-n)),q=tm>0?v0500Assess(tm,5,0):v0500Assess(-1,5,0);return{...q,metrics:{trimPct:.05,mean:st.mean,trimmedMean:tm},explain:`Vanligt snitt ${st.mean.toFixed(2)} kr · trimmat 5% ${tm.toFixed(2)} kr.`}}
 if(id==='quantiles'){return{...v0500Info(),metrics:{p10:v0500Quant(p,.10),p25:v0500Quant(p,.25),p50:v0500Quant(p,.50),p75:v0500Quant(p,.75),p90:v0500Quant(p,.90)},explain:`P10 ${v0500Quant(p,.10).toFixed(0)} · median ${v0500Quant(p,.50).toFixed(0)} · P90 ${v0500Quant(p,.90).toFixed(0)} kr.`}}
 if(id==='skew'||id==='kurt'){const m=v0500Moments(p);return{...v0500Info(),metrics:m,explain:id==='skew'?`Skevhet ${m.skew.toFixed(3)}.`:`Excess kurtosis ${m.kurt.toFixed(3)}.`}}
 if(id==='dropTop1'){const a=[...wins].sort((x,y)=>y-x),n=Math.max(1,Math.ceil(wins.length*.01)),cut=new Set(a.slice(0,n)),left=[];let removed=0;for(const t of tr){const x=v0470BPnl(t);if(x>0&&removed<n&&cut.has(x)){removed++;continue}left.push(t)}const r=v0470BStats(left),q=r.pnl>0?v0500Assess(1,1,.5):r.pnl>-1000?v0500Assess(.5,1,.5):v0500Assess(0,1,.5);return{...q,metrics:{removed:n,...r},explain:`Utan bästa 1% vinnare: P/L ${r.pnl.toFixed(0)} kr · PF ${r.pf.toFixed(2)}.`}}
 if(id==='dropWorst1'){const a=[...loss].sort((x,y)=>x-y),n=Math.max(1,Math.ceil(loss.length*.01)),threshold=a[n-1],left=[];let removed=0;for(const t of tr){const x=v0470BPnl(t);if(x<=threshold&&removed<n){removed++;continue}left.push(t)}const r=v0470BStats(left);return{...v0500Info(),metrics:{removed:n,...r},explain:`Utan sämsta 1% förluster: P/L ${r.pnl.toFixed(0)} kr · PF ${r.pf.toFixed(2)}.`}}
 if(id==='medexpect'){const med=v0500Quant(p,.5),q=med>0?v0500Assess(1,1,.5):med>-60?v0500Assess(.5,1,.5):v0500Assess(0,1,.5);return{...q,metrics:{median:med,mean:st.mean},explain:`Median ${med.toFixed(2)} kr · snitt ${st.mean.toFixed(2)} kr.`}}
 if(id==='winloss'){const r=avgL?avgW/avgL:Infinity;return{...v0500Info(),metrics:{winRate:st.wr,avgWin:avgW,avgLoss:avgL,ratio:r},explain:`WR ${(st.wr*100).toFixed(1)}% · avg vinnare/förlorare ${r.toFixed(2)}×.`}}
 if(id==='decomp'){const exp=st.wr*avgW-(1-st.wr)*avgL,q=exp>0?v0500Assess(exp,5,0):v0500Assess(-1,5,0);return{...q,metrics:{winRate:st.wr,avgWin:avgW,avgLoss:avgL,expectancy:exp},explain:`Expectancy = ${exp.toFixed(2)} kr/affär från WR ${(st.wr*100).toFixed(1)}% och payoff ${(avgW/avgL).toFixed(2)}.`}}
 const eq=v0500Eq(tr);
 if(id==='maxddkr'){const score=Math.abs(eq.maxDD)<=5000?1:Math.abs(eq.maxDD)<=8000?.5:0,q=v0500Assess(score,1,.5);return{...q,metrics:{maxDD:eq.maxDD,final:eq.final},explain:`Max drawdown ${eq.maxDD.toFixed(0)} kr.`}}
 if(id==='maxddpct'){const score=Math.abs(eq.maxPct)<=.05?1:Math.abs(eq.maxPct)<=.08?.5:0,q=v0500Assess(score,1,.5);return{...q,metrics:{maxDDPct:eq.maxPct},explain:`Max drawdown ${(eq.maxPct*100).toFixed(2)}%.`}}
 if(id==='uwtrades'){const score=eq.maxUnderwaterTrades<=150?1:eq.maxUnderwaterTrades<=300?.5:0,q=v0500Assess(score,1,.5);return{...q,metrics:{maxUnderwaterTrades:eq.maxUnderwaterTrades},explain:`Längsta underwaterperiod ${eq.maxUnderwaterTrades} affärer.`}}
 if(id==='uwdays'){const score=eq.maxUnderwaterDays<=180?1:eq.maxUnderwaterDays<=365?.5:0,q=v0500Assess(score,1,.5);return{...q,metrics:{maxUnderwaterDays:eq.maxUnderwaterDays},explain:`Längsta underwaterperiod cirka ${eq.maxUnderwaterDays.toFixed(0)} kalenderdagar.`}}
 if(id==='recovery'){const r=Math.abs(eq.maxDD)?st.pnl/Math.abs(eq.maxDD):Infinity,q=v0500Assess(r,1,.5);return{...q,metrics:{recoveryFactor:r,netPnl:st.pnl,maxDD:eq.maxDD},explain:`Recovery factor ${r.toFixed(2)}.`}}
 if(id==='ulcer'){const ui=Math.sqrt(v0500Mean(eq.series.map(x=>(x.pct*100)**2))),score=ui<=2?1:ui<=4?.5:0,q=v0500Assess(score,1,.5);return{...q,metrics:{ulcerIndex:ui},explain:`Ulcer index ${ui.toFixed(2)}.`}}
 if(id==='worstday'||id==='worstweek'||id==='worstmonth2'){const fn=id==='worstday'?v0500Day:id==='worstweek'?v0500Week:v0500Month,g=v0500Group(tr,fn),rows=Object.entries(g).map(([k,a])=>({key:k,pnl:a.reduce((z,t)=>z+v0470BPnl(t),0),n:a.length})).sort((a,b)=>a.pnl-b.pnl),w=rows[0];return{...v0500Info(),metrics:{worst:w},explain:`Sämsta block ${w.key}: ${w.pnl.toFixed(0)} kr på ${w.n} affärer.`}}
 if(id==='ddepisodes'){let indd=false,start=0,depth=0,eps=[];eq.series.forEach((x,i)=>{if(x.dd<0&&!indd){indd=true;start=i;depth=x.dd}else if(indd){depth=Math.min(depth,x.dd);if(x.dd>=0){eps.push({start,end:i,trades:i-start,depth});indd=false}}});if(indd)eps.push({start,end:eq.series.length-1,trades:eq.series.length-1-start,depth});const depths=eps.map(x=>x.depth);return{...v0500Info(),metrics:{count:eps.length,medianDepth:depths.length?v0500Quant(depths,.5):0,worstDepth:depths.length?Math.min(...depths):0},explain:`${eps.length} drawdown-episoder · median-djup ${(depths.length?v0500Quant(depths,.5):0).toFixed(0)} kr.`}}
 if(id==='drop5'||id==='drop15'||id==='drop30'){const rate=id==='drop5'?.05:id==='drop15'?.15:.30,rng=v0500Rng(50000+Math.round(rate*100)),tot=[];for(let k=0;k<3000;k++){let s=0;for(const t of tr)if(rng()>=rate)s+=v0470BPnl(t);tot.push(s)}const prob=tot.filter(x=>x>0).length/tot.length,q=v0500Assess(prob,.8,.6);return{...q,metrics:{runs:3000,dropRate:rate,positiveProbability:prob,p05:v0500Quant(tot,.05)},explain:`${(rate*100).toFixed(0)}% bortfall: ${(prob*100).toFixed(1)}% positiva simuleringar · P05 ${v0500Quant(tot,.05).toFixed(0)} kr.`}}
 if(id==='cost10drop10'||id==='cost20drop10'){const extra=id==='cost10drop10'?.10:.20,rng=v0500Rng(id==='cost10drop10'?50110:50210),tot=[];for(let k=0;k<3000;k++){let s=0;for(const t of tr)if(rng()>=.10)s+=v0500CostedPnl(t,1+extra);tot.push(s)}const prob=tot.filter(x=>x>0).length/tot.length,q=v0500Assess(prob,.75,.5);return{...q,metrics:{runs:3000,extraCost:extra,dropRate:.10,positiveProbability:prob,p05:v0500Quant(tot,.05)},explain:`+${(extra*100).toFixed(0)}% kostnad +10% bortfall: ${(prob*100).toFixed(1)}% positiva simuleringar.`}}
 if(id==='monthbootcost10'){const g=v0500Group(tr,v0500Month),keys=Object.keys(g),vals=keys.map(k=>g[k].reduce((a,t)=>a+v0500CostedPnl(t,1.10),0)),rng=v0500Rng(50310),tot=[];for(let k=0;k<5000;k++){let s=0;for(let i=0;i<vals.length;i++)s+=vals[Math.floor(rng()*vals.length)];tot.push(s)}const prob=tot.filter(x=>x>0).length/tot.length,q=v0500Assess(prob,.75,.5);return{...q,metrics:{runs:5000,positiveProbability:prob,ci95:[v0500Quant(tot,.025),v0500Quant(tot,.975)]},explain:`Månadsbootstrap +10% kostnad: ${(prob*100).toFixed(1)}% positiva.`}}
 if(id==='remove2m'||id==='remove4m'){const n=id==='remove2m'?2:4,g=v0500Group(tr,v0500Month),keys=Object.keys(g),rng=v0500Rng(id==='remove2m'?50402:50404),tot=[];for(let k=0;k<3000;k++){const a=[...keys];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}const drop=new Set(a.slice(0,n));tot.push(tr.filter(t=>!drop.has(v0500Month(t))).reduce((z,t)=>z+v0470BPnl(t),0))}const prob=tot.filter(x=>x>0).length/tot.length,q=v0500Assess(prob,.8,.6);return{...q,metrics:{runs:3000,removedMonths:n,positiveProbability:prob,p05:v0500Quant(tot,.05)},explain:`Ta bort ${n} slumpmånader: ${(prob*100).toFixed(1)}% positiva · P05 ${v0500Quant(tot,.05).toFixed(0)} kr.`}}
 if(id==='winsorCost10'){const costed=tr.map(t=>v0500CostedPnl(t,1.10)),w=v0500Winsor(costed,.01),sum=w.reduce((a,b)=>a+b,0),q=sum>0?v0500Assess(1,1,.5):sum>-1000?v0500Assess(.5,1,.5):v0500Assess(0,1,.5);return{...q,metrics:{pnl:sum,mean:v0500Mean(w)},explain:`Winsor 1% +10% kostnad: ${sum.toFixed(0)} kr.`}}
 if(id==='pessimistic'){const g=v0500Group(tr,v0500Month),rows=Object.entries(g).map(([k,a])=>({k,pnl:a.reduce((z,t)=>z+v0470BPnl(t),0)})).sort((a,b)=>b.pnl-a.pnl),drop=rows[0].k,left=tr.filter(t=>v0500Month(t)!==drop),sum=left.reduce((a,t)=>a+v0500CostedPnl(t,1.10),0),q=sum>0?v0500Assess(1,1,.5):sum>-1500?v0500Assess(.5,1,.5):v0500Assess(0,1,.5);return{...q,metrics:{removedBestMonth:drop,pnl:sum},explain:`Utan bästa månaden (${drop}) och +10% kostnad: ${sum.toFixed(0)} kr.`}}
 throw new Error('Okänt test '+id)
}
let V0500_RUNNING=false;
function v0500Paint(s){const d=V0500_DEFS[s],x=v0500Load(s),done=d.tests.filter(t=>x.tests[t[0]]).length,rows=document.getElementById(`v0500${s}Rows`);if(rows)rows.innerHTML=d.tests.map((t,i)=>{const r=x.tests[t[0]];return `<tr><td>${i+1}</td><td>${r?`<button class="v0470-browbtn" data-v50detail="${s}:${t[0]}">${t[1]}</button>`:t[1]}</td><td>${r?.label||'○ EJ KÖRD'}</td><td><button class="v0470-help" data-v50help="${t[0]}">?</button></td></tr>`}).join('');const bar=document.getElementById(`v0500${s}Bar`),pct=document.getElementById(`v0500${s}Pct`),sum=document.getElementById(`v0500${s}Summary`);if(bar)bar.style.width=`${done/10*100}%`;if(pct)pct.textContent=`${done}/10`;if(sum){const a=Object.values(x.tests);sum.textContent=`${done}/10 klara · ✅ ${a.filter(r=>r.status==='ROBUST').length} robusta · ⚠️ ${a.filter(r=>r.status==='SENSITIVE').length} känsliga · ❌ ${a.filter(r=>r.status==='WEAK').length} svagheter · ℹ️ ${a.filter(r=>r.status==='INFO').length} beskrivande`;}[`v0500${s}Report`,`v0500${s}Raw`].forEach(id=>{const b=document.getElementById(id);if(b)b.disabled=!x.completed});document.querySelectorAll('[data-v50help]').forEach(b=>b.onclick=()=>v0500ShowHelp(b.dataset.v50help));document.querySelectorAll('[data-v50detail]').forEach(b=>b.onclick=()=>v0500ShowDetail(b.dataset.v50detail))}
function v0500ShowHelp(key){const x=V0500_HELP[key]||['Förklaring','Diagnostik på återanvänd historik.'],m=document.getElementById('v0500HelpModal');document.getElementById('v0500HelpTitle').textContent=x[0];document.getElementById('v0500HelpBody').innerHTML=`<p>${x[1]}</p>`;m.hidden=false}
function v0500ShowDetail(key){const [s,id]=key.split(':'),r=v0500Load(s).tests[id],t=V0500_DEFS[s].tests.find(q=>q[0]===id),m=document.getElementById('v0500DetailModal');document.getElementById('v0500DetailTitle').textContent=`Suite ${s} · ${t?.[1]||id}`;document.getElementById('v0500DetailBody').innerHTML=r?`<p><b>${r.label}</b></p><p>${r.explain}</p><details><summary>Visa tekniska detaljer</summary><pre style="white-space:pre-wrap">${JSON.stringify(r.metrics,null,2)}</pre></details>`:'Ej kört';document.getElementById('v0500ExportOne').dataset.key=key;m.hidden=false}
async function v0500RunSuite(s,all=true){if(V0500_RUNNING)throw new Error('En lokal svit körs redan.');V0500_RUNNING=true;const d=V0500_DEFS[s],st=document.getElementById(`v0500${s}Status`);try{let x=v0500Load(s);do{const t=d.tests.find(q=>!x.tests[q[0]]);if(!t)break;st.textContent=`Kör ${t[1]}…`;const r=await v0500RunTest(s,t[0]);x.tests[t[0]]={...r,completedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:v0500Base()?.dataFingerprint||'—'};v0500Save(s,x);v0500Paint(s);if(!all)break;await new Promise(r=>setTimeout(r,15))}while(true);x=v0500Load(s);if(d.tests.every(t=>x.tests[t[0]])){x.completed=true;v0500Save(s,x);st.textContent=`✓ Suite ${s} klar · 10/10.`}else st.textContent='✓ Test sparat.'}catch(e){st.textContent='KÖRFEL: '+(e?.message||e);throw e}finally{V0500_RUNNING=false;v0500Paint(s)}}
function v0500Report(s){const d=V0500_DEFS[s],x=v0500Load(s),L=[`LINAS OPTI – VALIDATION SUITE ${s} · ${d.name}`,'Version: '+APP_VERSION,'Handel: AVSTÄNGD','Close >=83% fryst kandidat','Regelhash: '+V0460_RULE_HASH,'','OBS: diagnostik på återanvänd historik – inte nytt orört OOS-bevis.',''];d.tests.forEach((t,i)=>{const r=x.tests[t[0]];L.push(`${i+1}. ${t[1]} | ${r?.label||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('','Ingen parameteroptimering eller automatisk räddning har körts.');return L.join('\n')}
function v0500ExportOne(key){const [s,id]=key.split(':'),r=v0500Load(s).tests[id],t=V0500_DEFS[s].tests.find(q=>q[0]===id);return [`LINAS OPTI – SUITE ${s} TEST`,'Version: '+APP_VERSION,'Test: '+t[1],'Bedömning: '+r.label,'',r.explain,JSON.stringify(r.metrics,null,2),'','Återanvänd historik – diagnostik, inte nytt OOS-bevis.'].join('\n')}
async function v0500RunIJK(){const o=document.getElementById('v0500IJKStatus');try{o.textContent='Kör Suite I…';await v0500RunSuite('I',true);o.textContent='Kör Suite J…';await v0500RunSuite('J',true);o.textContent='Kör Suite K…';await v0500RunSuite('K',true);o.textContent='✓ I + J + K klara · 30/30 tester.'}catch(e){o.textContent='KÖRFEL: '+(e?.message||e)}}
function v0500IJKReport(){const L=['LINAS OPTI – VALIDATION SUITES I + J + K','Version: '+APP_VERSION,'Handel: AVSTÄNGD','Close >=83% fryst kandidat','Regelhash: '+V0460_RULE_HASH,'','30 lokala diagnostiska tester · återanvänd historik · inte nytt orört OOS-bevis.',''];for(const s of ['I','J','K']){L.push(`=== SUITE ${s} · ${V0500_DEFS[s].name} ===`);const x=v0500Load(s);V0500_DEFS[s].tests.forEach((t,i)=>{const r=x.tests[t[0]];L.push(`${i+1}. ${t[1]} | ${r?.label||'Ej körd'}`);if(r?.explain)L.push('   '+r.explain)});L.push('')}L.push('Ingen parameteroptimering eller automatisk räddning har körts.');return L.join('\n')}
function v0500IJKBackup(){return{backupSchema:'lina-v0500-ijk-backup-v1',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),rulesHash:V0460_RULE_HASH,dataFingerprint:v0500Base()?.dataFingerprint||'—',suiteI:v0500Load('I'),suiteJ:v0500Load('J'),suiteK:v0500Load('K')}}
window.addEventListener('DOMContentLoaded',()=>{for(const s of ['I','J','K']){document.getElementById(`v0500${s}RunAll`)?.addEventListener('click',()=>v0500RunSuite(s,true).catch(()=>{}));document.getElementById(`v0500${s}RunNext`)?.addEventListener('click',()=>v0500RunSuite(s,false).catch(()=>{}));document.getElementById(`v0500${s}Report`)?.addEventListener('click',()=>v0460Dl(v0500Report(s),`LINAS_OPTI_VALIDATION_SUITE_${s}_V0500_${new Date().toISOString().slice(0,10)}.txt`));document.getElementById(`v0500${s}Raw`)?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0500Load(s),null,2),`LINAS_OPTI_VALIDATION_SUITE_${s}_RAW_V0500_${new Date().toISOString().slice(0,10)}.json`,'application/json'));v0500Paint(s)}document.getElementById('v0500RunIJK')?.addEventListener('click',v0500RunIJK);document.getElementById('v0500IJKReport')?.addEventListener('click',()=>v0460Dl(v0500IJKReport(),`LINAS_OPTI_VALIDATION_IJK_V0500_${new Date().toISOString().slice(0,10)}.txt`));document.getElementById('v0500IJKBackup')?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0500IJKBackup(),null,2),`LINAS_OPTI_VALIDATION_IJK_BACKUP_V0500_${new Date().toISOString().slice(0,10)}.json`,'application/json'));document.getElementById('v0500HelpClose')?.addEventListener('click',()=>document.getElementById('v0500HelpModal').hidden=true);document.getElementById('v0500DetailClose')?.addEventListener('click',()=>document.getElementById('v0500DetailModal').hidden=true);document.getElementById('v0500ExportOne')?.addEventListener('click',e=>{const k=e.currentTarget.dataset.key;if(k){const [s,id]=k.split(':');v0460Dl(v0500ExportOne(k),`LINAS_OPTI_SUITE_${s}_${id.toUpperCase()}_V0500_${new Date().toISOString().slice(0,10)}.txt`)}});const jump=document.getElementById('v0413LabJump');if(jump&&[...jump.options].some(o=>o.value==='v0500KLab')){jump.value='v0500KLab';try{localStorage.setItem('linasopti_testlab_selected_v0423','v0500KLab')}catch{}jump.dispatchEvent(new Event('change'))}});


// ============================================================
// V0.51.0 – FORWARD VALIDATION GATE
// Starts only after 2026-09-10. Historical diagnostics remain frozen.
// ============================================================
const V0510_KEY='linasopti_forward_validation_v0510';
const V0510_ANCHOR='2026-09-11T00:00:00Z';
const V0510_MILESTONES=[
  {n:60,label:'Första lägesbild',help:'Minst 60 nya forward-affärer. För tidigt för stark slutsats, men tillräckligt för första varningssignal.'},
  {n:120,label:'Mellanbedömning',help:'120 nya affärer ger bättre möjlighet att skilja tillfälligt brus från bestående försämring.'},
  {n:250,label:'Starkare forward-bedömning',help:'250 nya affärer är fortfarande inte ett bevis, men betydligt mer informativt än historisk efterdiagnostik.'}
];
const V0510_HELP={
  suite:['Forward Validation Gate','Detta steg använder bara data efter 2026-09-10. Regler och regelhash låses vid start. Ingen parameter får ändras inom samma forward-generation.'],
  pf:['Profit Factor','Bruttovinster dividerat med bruttoförluster på enbart nya forward-affärer.'],
  dd:['Max drawdown','Största fall från tidigare forward-equitytopp till efterföljande botten.'],
  milestone:['Milstolpar','60, 120 och 250 nya affärer används som observationsnivåer. De är inte optimeringsmål och ändrar inga regler automatiskt.']
};
function v0510New(){
  return {
    schema:'LINA-FORWARD-1',
    appVersion:'V0.51.0',
    anchor:V0510_ANCHOR,
    rulesHash:V0460_RULE_HASH,
    startedAt:null,
    lastScanAt:null,
    lastDataEnd:null,
    lastProcessedDate:null,
    closed:[],
    seenTradeIds:{},
    scans:[],
    gate:'NOT_STARTED'
  };
}
function v0510Load(){
  try{
    const x=JSON.parse(localStorage.getItem(V0510_KEY)||'null');
    if(x&&x.schema==='LINA-FORWARD-1'&&x.rulesHash===V0460_RULE_HASH)return x;
  }catch{}
  return v0510New();
}
function v0510Save(x){localStorage.setItem(V0510_KEY,JSON.stringify(x));return x}
function v0510TradeId(t){return [t.symbol||t.s,t.entryTime,t.exitTime,(+t.entry).toFixed(6),(+t.exit).toFixed(6)].join('|')}
function v0510Stats(tr){
  const ps=tr.map(v0470BPnl),gw=ps.filter(x=>x>0).reduce((a,b)=>a+b,0),gl=-ps.filter(x=>x<0).reduce((a,b)=>a+b,0);
  let eq=100000,peak=100000,maxDD=0;for(const p of ps){eq+=p;peak=Math.max(peak,eq);maxDD=Math.min(maxDD,eq-peak)}
  return {n:tr.length,pnl:ps.reduce((a,b)=>a+b,0),pf:gl?gw/gl:null,wr:tr.length?ps.filter(x=>x>0).length/tr.length:0,maxDD,final:100000+ps.reduce((a,b)=>a+b,0)};
}
function v0510TradeDays(tr){return new Set(tr.map(t=>(t.entryTime||'').slice(0,10))).size}
function v0510Gate(st){
  const n=st.n;
  if(n<60)return {code:'COLLECTING',label:'SAMlar NY DATA'};
  // Deliberately broad frozen observation thresholds; no optimization follows.
  if(st.pf!==null && st.pf>=1.05 && st.pnl>0)return {code:'HEALTHY',label:n>=250?'✅ STARKARE FRAMÅTSTÖD':'✅ POSITIV LÄGESBILD'};
  if(st.pf!==null && st.pf>=.95 && st.pnl>-2000)return {code:'WATCH',label:'⚠️ BEVAKA'};
  return {code:'WEAK',label:'❌ FORWARD-SVAGHET'};
}
function v0510Paint(){
  const x=v0510Load(),st=v0510Stats(x.closed),gate=x.startedAt?v0510Gate(st):{label:'EJ STARTAD'};
  document.getElementById('v0510RuleHash').textContent=V0460_RULE_HASH;
  document.getElementById('v0510GateStatus').textContent=gate.label;
  document.getElementById('v0510Days').textContent=v0510TradeDays(x.closed);
  document.getElementById('v0510Trades').textContent=st.n;
  document.getElementById('v0510Pnl').textContent=`${st.pnl.toFixed(0)} kr`;
  document.getElementById('v0510Pf').textContent=st.pf===null?'—':st.pf.toFixed(2);
  document.getElementById('v0510Dd').textContent=st.n?`${st.maxDD.toFixed(0)} kr`:'—';
  document.getElementById('v0510ProgressText').textContent=`${Math.min(st.n,60)} / 60 affärer`;
  document.getElementById('v0510Bar').style.width=`${Math.min(100,st.n/60*100)}%`;
  document.getElementById('v0510Init').disabled=!!x.startedAt;
  document.getElementById('v0510Scan').disabled=!x.startedAt;
  document.getElementById('v0510Report').disabled=!x.startedAt;
  document.getElementById('v0510Status').textContent=x.startedAt
    ? `Startad ${new Date(x.startedAt).toLocaleString('sv-SE')} · senaste scan ${x.lastScanAt?new Date(x.lastScanAt).toLocaleString('sv-SE'):'ingen ännu'} · ${st.n} nya affärer sparade.`
    : 'Forward-testet är inte startat ännu. När det startas låses ankardatum och regelhash.';
  document.getElementById('v0510Milestones').innerHTML=V0510_MILESTONES.map(m=>{
    const done=st.n>=m.n;
    return `<tr><td>${m.label}</td><td>${m.n} affärer</td><td>${done?'✅ UPPNÅDD':'○ EJ UPPNÅDD'}</td><td><button class="v0470-help" data-v51ms="${m.n}">?</button></td></tr>`
  }).join('');
  document.querySelectorAll('[data-v51ms]').forEach(b=>b.onclick=()=>{const m=V0510_MILESTONES.find(x=>x.n===+b.dataset.v51ms);v0510Help([m.label,m.help])});
  document.querySelectorAll('[data-v51help]').forEach(b=>b.onclick=()=>v0510Help(V0510_HELP[b.dataset.v51help]||V0510_HELP.suite));
  const list=document.getElementById('v0510TradesList');
  list.innerHTML=x.closed.slice(-100).reverse().map(t=>`<div class="v0510-trade"><b>${t.symbol||t.s}</b> · ${(t.entryTime||'').replace('T',' ').slice(0,16)} · ${v0470BPnl(t).toFixed(0)} kr · ${t.why||''}</div>`).join('')||'<div class="muted">Inga forward-affärer ännu.</div>';
}
function v0510Help(x){document.getElementById('v0510HelpTitle').textContent=x[0];document.getElementById('v0510HelpBody').innerHTML=`<p>${x[1]}</p>`;document.getElementById('v0510HelpModal').hidden=false}
function v0510Init(){
  let x=v0510Load();
  if(x.startedAt)return;
  x.startedAt=new Date().toISOString();
  x.anchor=V0510_ANCHOR;
  x.rulesHash=V0460_RULE_HASH;
  x.gate='COLLECTING';
  v0510Save(x);v0510Paint();
}
async function v0510FetchRange(start,end,statusEl){
  const symbols=[...V0440_SYMBOLS,'SPY'];
  if(statusEl)statusEl.textContent=`Hämtar ${symbols.length} symboler · ${start.slice(0,10)} → ${end.slice(0,10)}…`;
  return v0434Retry(
    ()=>bridge(`/bars?symbols=${encodeURIComponent(symbols.join(','))}&timeframe=5Min&start=${encodeURIComponent(start.slice(0,10))}&end=${encodeURIComponent(end.slice(0,10))}`),
    'Forward-data',
    statusEl
  );
}

function v0510DateAdd(dateStr,days){
  const d=new Date(dateStr+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10);
}
function v0510NYNowParts(){
  const p=new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),o={};
  p.forEach(x=>o[x.type]=x.value);
  return {date:`${o.year}-${o.month}-${o.day}`,minutes:(+o.hour)*60+(+o.minute)};
}
function v0510LastCompletedDate(){
  const n=v0510NYNowParts();
  // Do not admit a current US session until safely after regular close.
  return n.minutes>=965?n.date:v0510DateAdd(n.date,-1);
}
async function v0510Scan(){
  const btn=document.getElementById('v0510Scan'),status=document.getElementById('v0510Status');
  let x=v0510Load();if(!x.startedAt)throw new Error('Forward-valideringen är inte startad.');
  btn.disabled=true;
  try{
    const anchorDate=V0510_ANCHOR.slice(0,10);
    const endDate=v0510LastCompletedDate();
    const startDate=x.lastProcessedDate?v0510DateAdd(x.lastProcessedDate,1):anchorDate;
    if(startDate>endDate){
      status.textContent=`Ingen ny avslutad USA-handelsdag att läsa ännu. Senast behandlad: ${x.lastProcessedDate||'ingen'} · första tillåtna dag ${anchorDate}.`;
      return;
    }
    const prior=v0510Stats(x.closed);
    status.textContent=`Hämtar avslutade dagar ${startDate} → ${endDate}…`;
    const rows=await v0510FetchRange(startDate,endDate,status);
    const candidate=v04511Engine(rows,prior.final,.83);
    const all=Array.isArray(candidate?.closed)?candidate.closed:(Array.isArray(candidate)?candidate:[]);
    let added=0;
    for(const t of all){
      if((t.entryTime||'').slice(0,10)<anchorDate)continue;
      const id=v0510TradeId(t);if(x.seenTradeIds[id])continue;
      x.seenTradeIds[id]=true;x.closed.push(t);added++;
    }
    x.closed.sort((a,b)=>new Date(a.entryTime)-new Date(b.entryTime));
    x.lastScanAt=new Date().toISOString();
    x.lastProcessedDate=endDate;
    x.lastDataEnd=endDate;
    x.scans.push({at:x.lastScanAt,start:startDate,end:endDate,added,total:x.closed.length,startCapital:prior.final});
    v0510Save(x);v0510Paint();
    status.textContent=`✓ Scan klar · ${added} nya affärer · behandlat t.o.m. ${endDate} · totalt ${x.closed.length}.`;
  }catch(e){
    status.textContent='KÖRFEL: '+(e?.message||e);
  }finally{btn.disabled=false}
}
function v0510Report(){
  const x=v0510Load(),st=v0510Stats(x.closed),gate=v0510Gate(st),L=[
    'LINAS OPTI – FORWARD VALIDATION REPORT',
    'Version: '+APP_VERSION,
    'Handel: AVSTÄNGD',
    'Startankare: '+x.anchor,
    'Startad: '+(x.startedAt||'—'),
    'Regelhash: '+x.rulesHash,
    'Close >=83% fryst kandidat',
    '',
    `Status: ${gate.label}`,
    `Nya handelsdagar: ${v0510TradeDays(x.closed)}`,
    `Nya affärer: ${st.n}`,
    `Netto-P/L: ${st.pnl.toFixed(2)} kr`,
    `PF: ${st.pf===null?'—':st.pf.toFixed(3)}`,
    `WR: ${(st.wr*100).toFixed(1)}%`,
    `Max DD: ${st.maxDD.toFixed(2)} kr`,
    '',
    'Milstolpar:',
    ...V0510_MILESTONES.map(m=>`- ${m.n} affärer: ${st.n>=m.n?'UPPNÅDD':'ej uppnådd'}`),
    '',
    'Endast affärer efter ankardatum räknas. Ingen parameteroptimering eller automatisk räddning har körts.'
  ];
  return L.join('\n');
}
function v0510Backup(){
  const x=v0510Load();
  return {backupSchema:'lina-v0510-forward-backup-v1',appVersion:APP_VERSION,exportedAt:new Date().toISOString(),forward:x};
}
window.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('v0510Init')?.addEventListener('click',v0510Init);
  document.getElementById('v0510Scan')?.addEventListener('click',()=>v0510Scan());
  document.getElementById('v0510Report')?.addEventListener('click',()=>v0460Dl(v0510Report(),`LINAS_OPTI_FORWARD_V0510_${new Date().toISOString().slice(0,10)}.txt`));
  document.getElementById('v0510Backup')?.addEventListener('click',()=>v0460Dl(JSON.stringify(v0510Backup(),null,2),`LINAS_OPTI_FORWARD_BACKUP_V0510_${new Date().toISOString().slice(0,10)}.json`,'application/json'));
  document.getElementById('v0510HelpClose')?.addEventListener('click',()=>document.getElementById('v0510HelpModal').hidden=true);
  document.getElementById('v0510HelpModal')?.addEventListener('click',e=>{if(e.target.id==='v0510HelpModal')e.currentTarget.hidden=true});
  v0510Paint();
  const jump=document.getElementById('v0413LabJump');
  if(jump&&[...jump.options].some(o=>o.value==='v0510ForwardLab')){
    jump.value='v0510ForwardLab';
    try{localStorage.setItem('linasopti_testlab_selected_v0423','v0510ForwardLab')}catch{}
    jump.dispatchEvent(new Event('change'));
  }
});


// ============================================================
// V0.51.1 – iPhone PWA + automatic forward catch-up on open
// ============================================================
const V0511_PREF_KEY='linasopti_pwa_prefs_v0511';
function v0511LoadPrefs(){
  try{
    const x=JSON.parse(localStorage.getItem(V0511_PREF_KEY)||'null');
    return x&&typeof x==='object'?{autoCheck:x.autoCheck!==false,lastAuto:x.lastAuto||null}:{autoCheck:true,lastAuto:null};
  }catch{return{autoCheck:true,lastAuto:null}}
}
function v0511SavePrefs(x){localStorage.setItem(V0511_PREF_KEY,JSON.stringify(x));return x}
function v0511IsStandalone(){
  return window.matchMedia?.('(display-mode: standalone)')?.matches===true || window.navigator.standalone===true;
}
function v0511Paint(){
  const p=v0511LoadPrefs();
  const m=document.getElementById('v0511Mode'),a=document.getElementById('v0511AutoState'),l=document.getElementById('v0511LastAuto'),b=document.getElementById('v0511AutoToggle');
  if(m)m.textContent=v0511IsStandalone()?'Hemscreen-app':'Webbläsare';
  if(a)a.textContent=p.autoCheck?'På':'Av';
  if(l)l.textContent=p.lastAuto?new Date(p.lastAuto).toLocaleString('sv-SE'):'—';
  if(b)b.textContent=p.autoCheck?'Stäng av auto-kontroll':'Slå på auto-kontroll';
}
async function v0511AutoCatchup(){
  const p=v0511LoadPrefs();if(!p.autoCheck)return;
  const x=v0510Load();if(!x.startedAt)return;
  const endDate=v0510LastCompletedDate(),anchor=V0510_ANCHOR.slice(0,10),startDate=x.lastProcessedDate?v0510DateAdd(x.lastProcessedDate,1):anchor;
  p.lastAuto=new Date().toISOString();v0511SavePrefs(p);v0511Paint();
  if(startDate>endDate)return;
  const status=document.getElementById('v0510Status');
  try{
    if(status)status.textContent=`Auto-kontroll: hämtar saknade avslutade dagar ${startDate} → ${endDate}…`;
    await v0510Scan();
  }catch(e){
    if(status)status.textContent='Auto-kontroll KÖRFEL: '+(e?.message||e);
  }
}
window.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('v0511InstallHelp')?.addEventListener('click',()=>{
    const h=document.getElementById('v0511InstallHint');if(h)h.hidden=!h.hidden;
  });
  document.getElementById('v0511AutoToggle')?.addEventListener('click',()=>{
    const p=v0511LoadPrefs();p.autoCheck=!p.autoCheck;v0511SavePrefs(p);v0511Paint();
  });
  document.querySelectorAll('[data-v511help]').forEach(b=>b.addEventListener('click',()=>{
    const h=document.getElementById('v0511InstallHint');if(h)h.hidden=false;
  }));
  v0511Paint();
  // Small delay so the existing Forward UI finishes painting first.
  setTimeout(v0511AutoCatchup,700);
});


// ============================================================
// V0.51.2 – global refresh button
// Reloads the current page/PWA while preserving localStorage checkpoints.
// ============================================================
window.addEventListener('DOMContentLoaded',()=>{
  const b=document.getElementById('v0512Refresh');
  if(!b)return;
  b.addEventListener('click',()=>{
    const s=document.getElementById('v0510Status')?.textContent||'';
    const scanBusy=/hämtar|auto-kontroll/i.test(s);
    if(scanBusy){
      const ok=window.confirm('Lina hämtar data just nu. Uppdatera ändå? Pågående hämtning avbryts, men redan sparade checkpoints ligger kvar.');
      if(!ok)return;
    }
    b.disabled=true;
    b.querySelector('small').textContent='Laddar…';
    window.location.reload();
  });
});


// ============================================================
// V0.52.0 – HISTORICAL TIME MACHINE / PSEUDO-FORWARD
// Diagnostic only. Never counts as real V0.51 forward evidence.
// ============================================================
const V0520_KEY='linasopti_historical_timemachine_v0520';
const V0520_END='2026-09-10';
function v0520Load(){try{return JSON.parse(localStorage.getItem(V0520_KEY)||'null')}catch{return null}}
function v0520Save(x){localStorage.setItem(V0520_KEY,JSON.stringify(x));return x}
function v0520Dates(start,end){
  const a=[],d=new Date(start+'T12:00:00Z'),e=new Date(end+'T12:00:00Z');
  while(d<=e){const w=d.getUTCDay();if(w!==0&&w!==6)a.push(d.toISOString().slice(0,10));d.setUTCDate(d.getUTCDate()+1)}
  return a;
}
function v0520Stats(t){
  const arr=t||[], pl=arr.reduce((s,x)=>s+(+x.pnl||0),0),wins=arr.filter(x=>(+x.pnl||0)>0),loss=t.filter(x=>(+x.pnl||0)<=0);
  const gw=wins.reduce((s,x)=>s+(+x.pnl||0),0),gl=-loss.reduce((s,x)=>s+(+x.pnl||0),0);
  return {n:arr.length,pl,pf:gl?gw/gl:(gw?Infinity:0),wr:arr.length?wins.length/arr.length:0};
}
function v0520Paint(){
  const x=v0520Load(),mode=document.getElementById('v0520Mode'),status=document.getElementById('v0520Status'),
  next=document.getElementById('v0520Next'),auto=document.getElementById('v0520Auto'),rep=document.getElementById('v0520Report'),bak=document.getElementById('v0520Backup'),
  bar=document.getElementById('v0520Bar'),stats=document.getElementById('v0520Stats');
  if(!x){
    if(mode)mode.textContent='EJ STARTAD';
    const b=document.querySelector('#v0521LiveStatus b'),d=document.getElementById('v0521DayLine'),t=document.getElementById('v0521TradeLine'),sv=document.getElementById('v0521SavedLine');
    if(b)b.textContent='Väntar på start…'; if(d)d.textContent='Dag — / — · 0%'; if(t)t.textContent='Affärer hittills: 0'; if(sv)sv.textContent='Senast sparad: —';
    return
  }
  if(mode)mode.textContent=x.done?'KLAR':'PÅGÅR';
  if(next)next.disabled=x.done;if(auto)auto.disabled=x.done;if(rep)rep.disabled=false;if(bak)bak.disabled=false;
  const pct=x.dates.length?100*Math.min(x.cursor,x.dates.length)/x.dates.length:0;if(bar)bar.style.width=pct.toFixed(1)+'%';
  const s=v0520Stats(x.closed||[]);
  if(status)status.textContent=`Framsläppt t.o.m. ${x.lastDate||'—'} · ${x.cursor}/${x.dates.length} vardagar · ${s.n} affärer`;
  if(stats)stats.innerHTML=`<div><span>Affärer</span><b>${s.n}</b></div><div><span>Netto P/L</span><b>${s.pl.toFixed(0)} kr</b></div><div><span>PF</span><b>${Number.isFinite(s.pf)?s.pf.toFixed(2):'∞'}</b></div>`;
  const b=document.querySelector('#v0521LiveStatus b'),d=document.getElementById('v0521DayLine'),t=document.getElementById('v0521TradeLine'),sv=document.getElementById('v0521SavedLine');
  const shownDate=x.currentDate||x.lastDate||x.dates[Math.min(x.cursor,x.dates.length-1)]||'—';
  if(b)b.textContent=x.done?`Klar: ${shownDate}`:`Bearbetar: ${shownDate}`;
  if(d)d.textContent=`Dag ${Math.min(x.cursor,x.dates.length)} / ${x.dates.length} · ${pct.toFixed(1)}%`;
  if(t)t.textContent=`Affärer hittills: ${s.n}`;
  if(sv)sv.textContent=`Senast sparad: ${x.savedAt?new Date(x.savedAt).toLocaleString('sv-SE'):x.lastDate||'—'}`;
}
async function v0520Start(){
  const y=document.getElementById('v0520StartYear')?.value||'2024',start=`${y}-01-01`,dates=v0520Dates(start,V0520_END);
  v0520Save({schema:'LINA-TIMEMACHINE-1',version:'V0.52.1',start,end:V0520_END,dates,cursor:0,lastDate:null,currentDate:dates[0]||null,closed:[],seen:{},createdAt:new Date().toISOString(),savedAt:new Date().toISOString(),rulesHash:'7fe0c1bb',diagnosticOnly:true,done:false});
  v0520Paint();
}
async function v0520Advance(n){
  const x=v0520Load();if(!x||x.done)return;
  const target=Math.min(x.cursor+n,x.dates.length);if(target<=x.cursor)return;
  const from=x.dates[x.cursor],to=x.dates[target-1];
  x.currentDate=from; x.savedAt=new Date().toISOString(); v0520Save(x); v0520Paint();
  const syms=[...V0440_SYMBOLS,'SPY'].join(',');
  const rows=await v0434Retry(()=>bridge(`/bars?symbols=${encodeURIComponent(syms)}&timeframe=5Min&start=${from}T00:00:00Z&end=${to}T23:59:59Z`));
  const flat=Array.isArray(rows)?rows:(rows?.rows||rows?.data||[]);
  const prior=v0520Stats(x.closed),capital=100000+prior.pl;
  const r=v04511Engine(flat,capital,.83);
  for(const t of (r.closed||[])){
    const id=[t.symbol,t.entryTime,t.exitTime,t.entry,t.exit].join('|');
    if(!x.seen[id]){x.seen[id]=1;x.closed.push(t)}
  }
  x.cursor=target;x.lastDate=to;x.currentDate=to;x.done=target>=x.dates.length;x.updatedAt=new Date().toISOString();x.savedAt=x.updatedAt;v0520Save(x);v0520Paint();
}
async function v0520RunAll(){
  let x=v0520Load();while(x&&!x.done){await v0520Advance(20);x=v0520Load();await new Promise(r=>setTimeout(r,20))}
}
function v0520Download(name,text,type='text/plain'){
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);
}
window.addEventListener('DOMContentLoaded',()=>{
 document.getElementById('v0520Start')?.addEventListener('click',v0520Start);
 document.getElementById('v0520Next')?.addEventListener('click',()=>v0520Advance(+(document.getElementById('v0520Step')?.value||1)));
 document.getElementById('v0520Auto')?.addEventListener('click',v0520RunAll);
 document.getElementById('v0520Reset')?.addEventListener('click',()=>{if(confirm('Återställa endast historiska Tidsmaskinen? Riktig forward påverkas inte.')){localStorage.removeItem(V0520_KEY);v0520Paint()}});
 document.getElementById('v0520Report')?.addEventListener('click',()=>{const x=v0520Load();if(!x)return;const s=v0520Stats(x.closed);v0520Download(`LINA_TIMEMACHINE_V0520_${x.start}_${x.end}.txt`,`LINA HISTORISK TIDSMASKIN V0.52.1\nDIAGNOSTIK / PSEUDO-FORWARD – INTE NY OOS\nStart: ${x.start}\nStopp: ${x.end}\nRegelhash: ${x.rulesHash}\nAffärer: ${s.n}\nNetto P/L: ${s.pl.toFixed(2)} kr\nPF: ${Number.isFinite(s.pf)?s.pf.toFixed(3):'INF'}\nWR: ${(100*s.wr).toFixed(1)}%\n`)});
 document.getElementById('v0520Backup')?.addEventListener('click',()=>{const x=v0520Load();if(x)v0520Download('LINA_TIMEMACHINE_V0520_CHECKPOINT.json',JSON.stringify(x,null,2),'application/json')});
 document.getElementById('v0520Help')?.addEventListener('click',()=>alert('Tidsmaskinen spelar upp gammal marknadsdata kronologiskt. Motorn får bara dagens och tidigare bars i varje steg. Eftersom Jägaren redan utvecklats med delar av denna historik är detta pseudo-forward/diagnostik – aldrig en ersättning för riktig forward från 2026-09-11.'));
 v0520Paint();
});

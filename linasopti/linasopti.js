
const APP_VERSION = "V0.21";
window.addEventListener("DOMContentLoaded", () => {
  const v = document.getElementById("appVersion");
  if (v) v.textContent = "Linas Opti " + APP_VERSION + " · JS " + APP_VERSION;
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
async function getBars(tf){
 try{$("bridgeStatus").textContent="Hämtar...";
 let j=await bridge(params(tf));
 let rows=j.rows||[];
 if(tf==="1Day"){
   DAILY=rows;
 }else{
   INTRA=rows;
 }
 updateTestDataStatus();
 $("bridgeStatus").innerHTML=`<span class="good">Klart: ${rows.length} rader (${tf})</span>`;
 updateDataStatus()}
 catch(e){$("bridgeStatus").innerHTML='<span class="bad">'+e.message+"</span>"}
}
$("dailyBtn").onclick=()=>getBars("1Day");$("intraBtn").onclick=()=>getBars("5Min");

function grouped(rows){let m={};rows.forEach(r=>(m[r.symbol]??=[]).push(r));return m}
function sd(a){if(a.length<2)return 0;let m=a.reduce((s,x)=>s+x,0)/a.length;return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/a.length)}
function swing(rows,capital,maxPos,evalStart,cooldownDays=0){
 if(!rows.length)return null;
 let g=grouped(rows),symbols=Object.keys(g),tradeSymbols=symbols.filter(s=>s!=="SPY"),
 dates=[...new Set(rows.map(r=>r.t.slice(0,10)))].sort(),
 cash=capital,pos={},log=[],curve=[],peak=capital,dd=0,w=0,l=0,closed=[],blockedEntries=0,lastStopDi={};
 let map={};symbols.forEach(s=>{map[s]={};g[s].forEach(r=>map[s][r.t.slice(0,10)]=r)});
 let firstEval=dates.findIndex(d=>!evalStart||d>=evalStart);
 if(firstEval<0) firstEval=dates.length;
 let firstTrade=Math.max(20,firstEval);

 for(let di=firstTrade;di<dates.length;di++){
  let date=dates[di];

  // Exit: stop/target uses today's OHLC; time exit uses today's close.
  for(let s of Object.keys(pos)){
   let bar=map[s][date]; if(!bar)continue;
   let p=pos[s],age=di-p.di,exit=null,exitPrice=null;
   let stop=p.entry*.93,target=p.entry*1.12;
   if(bar.l<=stop){exit="Stop −7%";exitPrice=stop}
   else if(bar.h>=target){exit="Vinst +12%";exitPrice=target}
   else if(age>=20){exit="20 dagar";exitPrice=bar.c}
   if(exit){
    if(exit==="Stop −7%") lastStopDi[s]=di;
    let value=p.shares*exitPrice,pl=value-p.cost;
    cash+=value; pl>=0?w++:l++;
    let tr={symbol:s,entryDate:p.entryDate,exitDate:date,entry:p.entry,exit:exitPrice,shares:p.shares,pnl:pl,ret:exitPrice/p.entry-1,why:exit};
    closed.push(tr);
    log.push({t:date,robot:"Opti Swing",s,a:"SÄLJ",price:exitPrice,amount:value,why:exit,pnl:pl});
    delete pos[s];
   }
  }

  // Entry: signal uses ONLY data through previous trading day; execution at today's open.
  let signalDate=dates[di-1],candidates=[];
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
   if(score>.015){
     let blocked=cooldownDays>0 && lastStopDi[s]!=null && (di-lastStopDi[s])<=cooldownDays;
     if(blocked) blockedEntries++;
     else candidates.push({s,score,price:today.o});
   }
  }
  candidates.sort((a,b)=>b.score-a.score);
  while(Object.keys(pos).length<5&&candidates.length){
   let x=candidates.shift();
   let eq=cash+Object.values(pos).reduce((q,p)=>q+p.shares*(map[p.s][date]?.c||p.entry),0);
   let budget=Math.min(cash,eq*maxPos); if(budget<eq*.04)break;
   let shares=budget/x.price; cash-=budget;
   pos[x.s]={s:x.s,entry:x.price,entryDate:date,shares,cost:budget,di};
   log.push({t:date,robot:"Opti Swing",s:x.s,a:"KÖP",price:x.price,amount:budget,why:"Signal föregående stängning → köp dagens öppning",pnl:null});
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
   openAtEnd:0,evalStart:dates[firstTrade]||evalStart||null,cooldownDays,blockedEntries};
}
function daytrade(rows,capital,riskPct){
 if(!rows.length)return null;let days={};rows.forEach(r=>{let d=r.t.slice(0,10);(days[d]??={});(days[d][r.symbol]??=[]).push(r)});
 let eq=capital,peak=capital,dd=0,w=0,l=0,log=[],curve=[];
 for(let d of Object.keys(days).sort()){let count=0;
  for(let [s,bars] of Object.entries(days[d])){bars.sort((a,b)=>new Date(a.t)-new Date(b.t));if(bars.length<8||count>=6)continue;let entryIdx=Math.min(3,bars.length-2),base=bars[0].o,entryBar=bars[entryIdx],move=entryBar.c/base-1,side=null,why=null;if(move>.004){side="LONG";why="öppningsmomentum"}else if(move<-.006){side="LONG";why="mean reversion"}else continue;
   let spread=.00035,slip=.00025,entry=entryBar.c*(1+spread/2+slip),stop=entry*.992,target=entry*1.012,exitBar=bars.at(-1),exitWhy="stängning";
   for(let i=entryIdx+1;i<bars.length;i++){if(bars[i].l<=stop){exitBar=bars[i];exitWhy="stop";break}if(bars[i].h>=target){exitBar=bars[i];exitWhy="mål";break}}
   let exit=Math.max(exitBar.l,Math.min(exitBar.c,exitBar.h))*(1-spread/2-slip),risk=eq*riskPct,shares=Math.min((eq*.20)/entry,risk/(entry-stop)),pl=shares*(exit-entry);eq+=pl;pl>=0?w++:l++;count++;
   log.push({t:exitBar.t,robot:"Opti Day",s,a:"LONG",price:entry,amount:shares*entry,why:why+" / "+exitWhy,pnl:pl})
  }peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:d,v:eq})
 }return {eq,ret:eq/capital-1,dd,n:w+l,wr:(w+l)?w/(w+l):0,avg:(w+l)?(eq-capital)/(w+l):0,log,curve}
}
function render(s,d,capital){
 $("kStart").textContent=fmt(capital);$("kDaily").textContent=DAILY.length;$("kIntra").textContent=INTRA.length;
 let ts=[...DAILY,...INTRA].map(x=>x.t).sort();$("kPeriod").textContent=ts.length?ts[0].slice(0,10)+" → "+ts.at(-1).slice(0,10):"—";
 if(s){$("sEq").textContent=fmt(s.eq);$("sRet").textContent=(s.ret>=0?"+":"")+pct(s.ret);$("sRet").className=s.ret>=0?"good":"bad";$("sDD").textContent=pct(s.dd);$("sN").textContent=s.n;$("sWR").textContent=pct(s.wr);$("sBench").textContent=s.bench==null?"—":pct(s.ret-s.bench)}
 else ["sEq","sRet","sDD","sN","sWR","sBench"].forEach(x=>$(x).textContent="Ingen dagsdata");
 if(d){$("dEq").textContent=fmt(d.eq);$("dRet").textContent=(d.ret>=0?"+":"")+pct(d.ret);$("dRet").className=d.ret>=0?"good":"bad";$("dDD").textContent=pct(d.dd);$("dN").textContent=d.n;$("dWR").textContent=pct(d.wr);$("dAvg").textContent=fmt(d.avg)}
 else ["dEq","dRet","dDD","dN","dWR","dAvg"].forEach(x=>$(x).textContent="Ingen 5-min-data");
 let logs=[...(s?.log||[]),...(d?.log||[])].sort((a,b)=>new Date(b.t)-new Date(a.t));$("tbody").innerHTML=logs.map(x=>`<tr><td>${x.t}</td><td>${x.robot}</td><td>${x.s}</td><td>${x.a}</td><td>${x.price.toFixed(2)}</td><td>${fmt(x.amount)}</td><td>${x.why}</td><td class="${x.pnl==null?"":x.pnl>=0?"good":"bad"}">${x.pnl==null?"—":fmt(x.pnl)}</td></tr>`).join("");draw(s,d,capital);show("result")
}
function draw(s,d,capital){let c=$("chart"),ctx=c.getContext("2d"),q=devicePixelRatio||1,W=c.clientWidth,H=c.clientHeight;c.width=W*q;c.height=H*q;ctx.scale(q,q);ctx.clearRect(0,0,W,H);let curves=[s?.curve,d?.curve].filter(Boolean),vals=curves.flatMap(x=>x.map(q=>q.v));if(!vals.length)return;let mn=Math.min(capital,...vals)*.98,mx=Math.max(capital,...vals)*1.02;ctx.strokeStyle="#dfe3e8";for(let i=0;i<5;i++){let y=12+i*(H-24)/4;ctx.beginPath();ctx.moveTo(10,y);ctx.lineTo(W-10,y);ctx.stroke()}[s?.curve,d?.curve].forEach((arr,j)=>{if(!arr?.length)return;ctx.strokeStyle=j?"#8a4f9e":"#1f5f99";ctx.lineWidth=2;ctx.beginPath();arr.forEach((p,i)=>{let x=10+i*(W-20)/Math.max(1,arr.length-1),y=10+(mx-p.v)*(H-20)/(mx-mn);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});ctx.fillStyle="#59636e";ctx.font="12px -apple-system";ctx.fillText("Blå = Opti Swing • Lila = Opti Day",14,18)}
$("runBtn").onclick=()=>{let cap=+$("capital").value;if(!DAILY.length&&!INTRA.length){$("testStatus").innerHTML='<span class="bad">Ingen data inläst.</span>';return}let start=$("evalStart")?.value||"",mp=+$("maxpos").value;let s=swing(DAILY,cap,mp,start,0),sFiltered=swing(DAILY,cap,mp,start,5),d=daytrade(INTRA,cap,+$("risk").value);LAST={s,sFiltered,d};render(s,d,cap);renderV015Audit(s);renderV019AB(s,sFiltered)};
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
 const s=LAST?.s||null,sFiltered=LAST?.sFiltered||null,d=LAST?.d||null;
 const payload={
  app:"Linas Opti",
  version:APP_VERSION,
  exportedAt:new Date().toISOString(),
  mode:"Backtest / paper only",
  tradingEnabled:false,
  data:{
   symbols:v17Symbols(),
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
  day:d?{
   endingCapital:d.eq,returnPct:d.ret*100,maxDrawdownPct:d.dd*100,
   trades:d.n,winRatePct:d.wr*100
  }:null
 };
 if(sFiltered){
  payload.swingCooldown5={
   rule:"Efter stop-loss: 5 handelsdagars karantän innan samma aktie får köpas igen",
   endingCapital:sFiltered.eq,returnPct:sFiltered.ret*100,maxDrawdownPct:sFiltered.dd*100,
   trades:sFiltered.n,winRatePct:sFiltered.wr*100,
   benchmarkReturnPct:Number.isFinite(sFiltered.bench)?sFiltered.bench*100:null,
   vsBenchmarkPct:Number.isFinite(sFiltered.bench)?(sFiltered.ret-sFiltered.bench)*100:null,
   profitFactor:sFiltered.pf===Infinity?"Infinity":sFiltered.pf,
   averageWin:sFiltered.avgWin,averageLoss:sFiltered.avgLoss,bestTrade:sFiltered.best,worstTrade:sFiltered.worst,
   blockedReentrySignals:sFiltered.blockedEntries||0
  };
  if(full) payload.swingCooldown5.closedTrades=(sFiltered.closed||[]);
 }
 if(full && s){
  payload.swing.closedTrades=(s.closed||[]).map(x=>({
   symbol:x.symbol,entryDate:x.entryDate,exitDate:x.exitDate,
   entryPrice:x.entry,exitPrice:x.exit,shares:x.shares,
   pnl:x.pnl,returnPct:x.ret*100,exitReason:x.why
  }));
  payload.swing.eventLog=s.log||[];
 }
 return payload;
}
function v17TextReport(full){
 const p=v17BaseReport(full),s=p.swing,d=p.day;
 let a=[];
 a.push("LINAS OPTI – TESTRAPPORT",`Version: ${p.version}`,`Exporterad: ${p.exportedAt}`,"Handel: AVSTÄNGD (backtest/paper)","");
 a.push("DATA",`Symboler: ${p.data.symbols}`,`Data: ${p.data.from} → ${p.data.to}`,`Teststart: ${p.data.evaluationStart}`,`Dagsrader: ${p.data.dailyRows}`,`5-min-rader: ${p.data.fiveMinuteRows}`,"");
 a.push("INSTÄLLNINGAR",`Startkapital: ${p.settings.startCapital}`,`Max position swing: ${p.settings.swingMaxPosition}`,`Risk/affär day: ${p.settings.dayRiskPerTrade}`,"");
 if(s){
  a.push("OPTI SWING",`Slutkapital: ${s.endingCapital}`,`Avkastning: ${s.returnPct.toFixed(2)}%`,`Max drawdown: ${s.maxDrawdownPct.toFixed(2)}%`,`Affärer: ${s.trades}`,`Vinstfrekvens: ${s.winRatePct.toFixed(2)}%`,`Benchmark: SPY`,`SPY: ${s.benchmarkReturnPct==null?"—":s.benchmarkReturnPct.toFixed(2)+"%"}`,`Mot benchmark: ${s.vsBenchmarkPct==null?"—":s.vsBenchmarkPct.toFixed(2)+"%"}`,`Profit factor: ${s.profitFactor}`,`Snittvinst: ${s.averageWin}`,`Snittförlust: ${s.averageLoss}`,`Bästa affär: ${s.bestTrade}`,`Sämsta affär: ${s.worstTrade}`,`Öppna vid slut: ${s.openAtEnd}`,"");
 }
 if(p.swingCooldown5){let b=p.swingCooldown5;a.push("A/B – 5 DAGARS KARANTÄN",`Regel: ${b.rule}`,`B avkastning: ${b.returnPct.toFixed(2)}%`,`B max drawdown: ${b.maxDrawdownPct.toFixed(2)}%`,`B affärer: ${b.trades}`,`B vinstfrekvens: ${b.winRatePct.toFixed(2)}%`,`B profit factor: ${b.profitFactor}`,`B mot SPY: ${b.vsBenchmarkPct==null?"—":b.vsBenchmarkPct.toFixed(2)+"%"}`,`Blockerade återköpssignaler: ${b.blockedReentrySignals}`,"");}
 if(d)a.push("OPTI DAY",`Slutkapital: ${d.endingCapital}`,`Avkastning: ${d.returnPct.toFixed(2)}%`,`Affärer: ${d.trades}`,"");
 if(full&&s){
  a.push("AVSLUTADE SWING-AFFÄRER");
  (s.closedTrades||[]).forEach((x,i)=>a.push(`${i+1}. ${x.symbol} | ${x.entryDate} → ${x.exitDate} | in ${x.entryPrice} | ut ${x.exitPrice} | P/L ${x.pnl} | ${x.returnPct.toFixed(2)}% | ${x.exitReason}`));
  a.push("","HÄNDELSELOGG",JSON.stringify(s.eventLog,null,2));
 }
 return a.join("\n");
}
async function v17Share(full){
 const status=document.getElementById("v17ExportStatus");
 if(!LAST?.s&&!LAST?.d){if(status)status.textContent="Kör ett test först.";return}
 const txt=v17TextReport(full);
 const stamp=new Date().toISOString().slice(0,10);
 const name=`linasopti_v017_${full?"full":"snabb"}_${stamp}.txt`;
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

function v19num(v,d=2){return Number.isFinite(Number(v))?Number(v).toFixed(d):"—"}
function renderV019AB(a,b){
 const put=(id,val,cls="")=>{let e=document.getElementById(id);if(e){e.textContent=val;e.className=cls}};
 const fill=(p,x)=>{
  if(!x)return;
  put(p+"Ret",(x.ret>=0?"+":"")+pct(x.ret),x.ret>=0?"good":"bad");
  put(p+"Eq",fmt(x.eq)); put(p+"DD",pct(x.dd),x.dd<-.10?"bad":"");
  put(p+"N",x.n); put(p+"WR",pct(x.wr)); put(p+"PF",x.pf===Infinity?"∞":v19num(x.pf));
  put(p+"Vs",x.bench==null?"—":((x.ret-x.bench)>=0?"+":"")+pct(x.ret-x.bench),(x.ret-(x.bench||0))>=0?"good":"bad");
 };
 fill("abA",a); fill("abB",b);
 put("abBlocked",b?String(b.blockedEntries||0):"—");
 if(a&&b){
   let delta=b.ret-a.ret, ddImprove=b.dd-a.dd;
   put("abDelta",(delta>=0?"+":"")+pct(delta),delta>=0?"good":"bad");
   put("abDDDelta",(ddImprove>=0?"+":"")+pct(ddImprove),ddImprove>=0?"good":"bad");
 }
}

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

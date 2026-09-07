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
 let f=input.files[0];if(!f)return;try{let rows=parseCSV(await f.text());if(kind==="daily")DAILY=rows;else INTRA=rows;updateDataStatus()}catch(e){$("csvStatus").innerHTML='<span class="bad">'+e.message+"</span>"}
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
 let j=await bridge(params(tf));let rows=j.rows||[];if(tf==="1Day")DAILY=rows;else INTRA=rows;
 $("bridgeStatus").innerHTML=`<span class="good">Klart: ${rows.length} rader (${tf})</span>`;updateDataStatus()}
 catch(e){$("bridgeStatus").innerHTML='<span class="bad">'+e.message+"</span>"}
}
$("dailyBtn").onclick=()=>getBars("1Day");$("intraBtn").onclick=()=>getBars("5Min");

function grouped(rows){let m={};rows.forEach(r=>(m[r.symbol]??=[]).push(r));return m}
function sd(a){if(a.length<2)return 0;let m=a.reduce((s,x)=>s+x,0)/a.length;return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/a.length)}
function swing(rows,capital,maxPos){
 if(!rows.length)return null;let g=grouped(rows),symbols=Object.keys(g),dates=[...new Set(rows.map(r=>r.t.slice(0,10)))].sort(),cash=capital,pos={},log=[],curve=[],peak=capital,dd=0,w=0,l=0;
 let map={};symbols.forEach(s=>{map[s]={};g[s].forEach(r=>map[s][r.t.slice(0,10)]=r)});
 for(let di=20;di<dates.length;di++){let date=dates[di];
  for(let s of Object.keys(pos)){let bar=map[s][date];if(!bar)continue;let p=pos[s],pnl=bar.c/p.entry-1,age=di-p.di,exit=pnl<=-.07?"Stop −7%":pnl>=.12?"Vinst +12%":age>=20?"20 dagar":null;
   if(exit){let value=p.shares*bar.c,pl=value-p.cost;cash+=value;pl>=0?w++:l++;log.push({t:date,robot:"Opti Swing",s,a:"SÄLJ",price:bar.c,amount:value,why:exit,pnl:pl});delete pos[s]}}
  let candidates=[];
  for(let s of symbols){if(pos[s])continue;let hist=g[s].filter(r=>r.t.slice(0,10)<=date);if(hist.length<21)continue;let c=hist[hist.length-1].c,c20=hist[hist.length-21].c,c5=hist[hist.length-6].c,r20=c/c20-1,r5=c/c5-1,rets=hist.slice(-20).map((x,i,a)=>i?Math.log(x.c/a[i-1].c):0).slice(1),vol=sd(rets)*Math.sqrt(252),score=.65*r20+.20*r5-.15*vol;if(score>.015)candidates.push({s,score,bar:hist[hist.length-1]})}
  candidates.sort((a,b)=>b.score-a.score);
  while(Object.keys(pos).length<5&&candidates.length){let x=candidates.shift(),eq=cash+Object.values(pos).reduce((q,p)=>q+p.shares*(map[p.s][date]?.c||p.entry),0),budget=Math.min(cash,eq*maxPos);if(budget<eq*.04)break;let shares=budget/x.bar.c;cash-=budget;pos[x.s]={s:x.s,entry:x.bar.c,shares,cost:budget,di};log.push({t:date,robot:"Opti Swing",s:x.s,a:"KÖP",price:x.bar.c,amount:budget,why:"20d/5d momentum + volatilitet",pnl:null})}
  let eq=cash+Object.values(pos).reduce((q,p)=>q+p.shares*(map[p.s][date]?.c||p.entry),0);peak=Math.max(peak,eq);dd=Math.min(dd,eq/peak-1);curve.push({t:date,v:eq})
 }
 let last=dates.at(-1);for(let s of Object.keys(pos)){let bar=map[s][last];if(!bar)continue;let p=pos[s],value=p.shares*bar.c,pl=value-p.cost;cash+=value;pl>=0?w++:l++;log.push({t:last,robot:"Opti Swing",s,a:"SÄLJ",price:bar.c,amount:value,why:"Period slut",pnl:pl})}
 let bench=null;let bs=symbols.includes("SPY")?"SPY":symbols[0];if(g[bs]?.length>1)bench=g[bs].at(-1).c/g[bs][0].c-1;
 return {eq:cash,ret:cash/capital-1,dd,n:w+l,wr:(w+l)?w/(w+l):0,log,curve,bench}
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
$("runBtn").onclick=()=>{let cap=+$("capital").value;if(!DAILY.length&&!INTRA.length){$("testStatus").innerHTML='<span class="bad">Ingen data inläst.</span>';return}let s=swing(DAILY,cap,+$("maxpos").value),d=daytrade(INTRA,cap,+$("risk").value);LAST={s,d};render(s,d,cap)};
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


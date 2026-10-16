/* Remember diagnostic capture v0.1.54. No layout modifications.
   Opt-in viewer with ?viewportDebug=1; snapshots remain on this device. */
(()=>{'use strict';
const KEY='remember:viewport-diagnostics:v1', MAX=28;
const records=[];let touched=false;
function round(v){return typeof v==='number'?Math.round(v*10)/10:null}
function box(el){if(!el)return null;const r=el.getBoundingClientRect();const c=getComputedStyle(el);return {top:round(r.top),bottom:round(r.bottom),height:round(r.height),scrollTop:round(el.scrollTop),position:c.position,background:c.backgroundColor,overflow:c.overflowY}}
function snap(phase){
 const vv=window.visualViewport,root=document.documentElement,body=document.body;
 const pseudo=body?getComputedStyle(body,'::before'):null;
 const entry={phase,ms:Math.round(performance.now()),touch:touched,innerHeight:innerHeight,outerHeight:outerHeight,screenHeight:screen.height,dpr:devicePixelRatio,scrollY:round(scrollY),visual:vv?{height:round(vv.height),offsetTop:round(vv.offsetTop),pageTop:round(vv.pageTop),scale:round(vv.scale)}:null,html:box(root),body:box(body),main:box(body?.querySelector('main')),header:box(body?.querySelector('header')),version:box(document.getElementById('remember-global-version')),before:pseudo?{top:pseudo.top,bottom:pseudo.bottom,height:pseudo.height,position:pseudo.position,background:pseudo.backgroundColor}:null};
 records.push(entry);if(records.length>MAX)records.shift();
 try{sessionStorage.setItem(KEY,JSON.stringify(records))}catch{}
 update();
}
let panel;
function update(){if(panel){const pre=panel.querySelector('pre');if(pre)pre.textContent=JSON.stringify(records,null,2)}}
function show(){
 if(panel)return;
 panel=document.createElement('section');panel.id='remember-viewport-debug';
 panel.style.cssText='position:fixed;inset:calc(env(safe-area-inset-top) + 8px) 8px calc(env(safe-area-inset-bottom) + 8px);z-index:2147483647;background:#14231fee;color:#fff;border:1px solid #aaa;border-radius:12px;padding:12px;display:flex;flex-direction:column;font:12px system-ui;box-sizing:border-box';
 const title=document.createElement('strong');title.textContent='Remember · skärmmätning 0.1.54';panel.append(title);
 const buttons=document.createElement('div');buttons.style.cssText='display:flex;gap:8px;margin:10px 0';
 const copy=document.createElement('button');copy.type='button';copy.textContent='Kopiera mätning';copy.style.cssText='padding:10px;background:#d8e9dc;color:#14231f;border-radius:8px';
 copy.onclick=async()=>{const txt=JSON.stringify(records,null,2);try{await navigator.clipboard.writeText(txt);copy.textContent='Kopierat!'}catch{const ta=document.createElement('textarea');ta.value=txt;panel.append(ta);ta.select();document.execCommand('copy');ta.remove();copy.textContent='Kopierat!'}};
 const close=document.createElement('button');close.type='button';close.textContent='Stäng';close.style.cssText='padding:10px';close.onclick=()=>{panel.remove();panel=null};buttons.append(copy,close);panel.append(buttons);
 const pre=document.createElement('pre');pre.style.cssText='overflow:auto;flex:1;white-space:pre-wrap;word-break:break-word;margin:0';panel.append(pre);document.body.append(panel);update();
}
document.addEventListener('click',event=>{if(event.target.closest('#remember-open-viewport-diagnostics')){snap('opened-from-app');show()} });
function defer(phase){requestAnimationFrame(()=>snap(phase))}
snap('script-loaded');
document.addEventListener('DOMContentLoaded',()=>{defer('dom-ready');if(new URLSearchParams(location.search).has('viewportDebug'))show()},{once:true});
window.addEventListener('pageshow',()=>defer('pageshow'));
window.addEventListener('load',()=>defer('load'));
window.addEventListener('resize',()=>defer('window-resize'));
window.visualViewport?.addEventListener('resize',()=>defer('visual-resize'));
window.visualViewport?.addEventListener('scroll',()=>defer('visual-scroll'));
document.addEventListener('touchstart',()=>{if(!touched){snap('before-first-touch');touched=true}},{once:true,passive:true});
document.addEventListener('touchend',()=>{defer('after-first-touch')},{once:true,passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)defer('foreground')});
setTimeout(()=>snap('after-350ms'),350);
setTimeout(()=>snap('after-1200ms'),1200);
setTimeout(()=>snap('after-3000ms'),3000);
})();

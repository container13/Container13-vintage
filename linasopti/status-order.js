(function(global){
'use strict';
function generationOf(el){
 for(const a of el?.attributes||[]){const m=/^data-gen(\d+)-/.exec(a.name);if(m)return Number(m[1])}
 return -1;
}
let busy=false;
function apply(){
 const root=document.querySelector('#view');if(!root||busy)return;
 const route=window.LinaRouter?.current?.()||location.hash.replace(/^#/,'')||'dashboard';
 const gens=[...root.children].filter(el=>generationOf(el)>=0).sort((a,b)=>generationOf(b)-generationOf(a));
 if(!gens.length)return;
 busy=true;
 try{
  if(route==='dashboard'){
   // Keep the dashboard introduction and system status ahead of completed generations.
   // An actionable STOPPAD/BLOCKERAD status is promoted above the introduction.
   const priority=[...root.children].filter(el=>generationOf(el)<0 && /STOPPAD|BLOCKERAD/.test(el.textContent||'') && !el.classList.contains('hero') && !el.classList.contains('grid'));
   let anchor=null;
   for(const el of priority){if(root.firstChild!==el)root.insertBefore(el,root.firstChild);anchor=el}
   const introduction=[...root.children].filter(el=>el.classList?.contains('crumb')||el.classList?.contains('hero')||el.classList?.contains('system-health'));
   for(const el of introduction){if(anchor && anchor.nextElementSibling!==el)anchor.insertAdjacentElement('afterend',el);else if(!anchor && root.firstChild!==el)root.insertBefore(el,root.firstChild);anchor=el}
   for(const el of gens){if(anchor && anchor.nextElementSibling!==el)anchor.insertAdjacentElement('afterend',el);else if(!anchor && root.firstChild!==el)root.insertBefore(el,root.firstChild);anchor=el}
  }else{
   const top=gens[0];if(root.firstChild!==top)root.prepend(top);
   const gate=root.querySelector(':scope > [data-release-gate]');if(gate&&top.nextElementSibling!==gate)top.insertAdjacentElement('afterend',gate);
   let anchor=gate||top;
   for(const el of gens.slice(1)){if(anchor.nextElementSibling!==el)anchor.insertAdjacentElement('afterend',el);anchor=el}
  }
 }finally{busy=false}
}
let queued=false;
function schedule(){if(queued)return;queued=true;setTimeout(()=>{queued=false;apply()},0)}
document.addEventListener('DOMContentLoaded',()=>{
 const root=document.querySelector('#view');if(!root)return;
 new MutationObserver(records=>{if(!busy&&records.some(r=>r.type==='childList'&&r.target===root))schedule()}).observe(root,{childList:true});
 schedule();
});
global.LinaStatusOrder=Object.freeze({apply,generationOf});
})(typeof window==='object'?window:globalThis);

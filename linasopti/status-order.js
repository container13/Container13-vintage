(function(global){
'use strict';
function generationOf(el){
 for(const a of el?.attributes||[]){const m=/^data-gen(\d+)-/.exec(a.name);if(m)return Number(m[1])}
 return -1;
}
function apply(){
 const root=document.querySelector('#view');if(!root)return;
 const route=window.LinaRouter?.current?.()||location.hash.replace(/^#/,'')||'dashboard';
 if(route==='dashboard')return;
 const gens=[...root.children].filter(el=>generationOf(el)>=0).sort((a,b)=>generationOf(b)-generationOf(a));
 if(!gens.length)return;
 const top=gens[0];root.prepend(top);
 const gate=root.querySelector(':scope > [data-release-gate]');if(gate)top.insertAdjacentElement('afterend',gate);
 let anchor=gate||top;
 for(const el of gens.slice(1)){anchor.insertAdjacentElement('afterend',el);anchor=el}
}
global.LinaStatusOrder=Object.freeze({apply,generationOf});
})(typeof window==='object'?window:globalThis);

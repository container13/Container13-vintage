(function(){
'use strict';
const VERSION='V0.2.68';
const PREFIX='lina_clean_';
const EXCLUDE=new Set(['linasopti_unlocked','linasopti_login_code']);
function parse(v){try{return JSON.parse(v)}catch{return v}}
function safeDate(d=new Date()){const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'_'+z(d.getHours())+z(d.getMinutes())+z(d.getSeconds())}
function collect(){
  const local={};
  for(let i=0;i<localStorage.length;i++){
    const k=localStorage.key(i); if(!k||!k.startsWith(PREFIX)||EXCLUDE.has(k))continue;
    const raw=localStorage.getItem(k); if(raw!==null)local[k]=parse(raw);
  }
  const session={};
  for(const k of ['lina_sync_status','lina_recovery_report']){const raw=sessionStorage.getItem(k);if(raw!==null)session[k]=parse(raw)}
  return {
    schema:'LINA-STATUS-EXPORT-1',
    app:'Linas Opti Clean Core',
    release:VERSION,
    generatedAt:new Date().toISOString(),
    route:window.LinaRouter?.current?.()||location.hash.replace(/^#/,'')||'dashboard',
    tradeEnabled:false,
    maturity:window.LinaState?.get?.().maturity??48,
    sync:session,
    syncDiagnostics:window.LinaEvidence?.diagnostics?.()||null,
    localState:local,
    notes:[
      'Exporten innehåller endast Lina-state som används för analys och felsökning.',
      'Inga lösenkoder eller inloggningssessioner exporteras.',
      'Filen är avsedd att skickas till ChatGPT när en exakt status behövs.'
    ]
  };
}
function trigger(name,obj){
  const blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),0);return name;
}
function download(){return trigger(`LINA_STATUS_${VERSION.replace(/\./g,'')}_${safeDate()}.json`,collect())}
function downloadObject(prefix,obj){return trigger(`${prefix}_${safeDate()}.json`,obj)}
window.LinaStatusExport={VERSION,collect,download,downloadObject};
})();

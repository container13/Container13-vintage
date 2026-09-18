(function(){
'use strict';
const VERSION='V0.2.71';
const SCHEMA='LINA-GENERATION-ENGINE-1';
const LIFECYCLE=['PLAN','PLAN_LOCKED','RUNNERSPEC_LOCKED','ENGINE_VERIFIED','RESEARCH_RUNNING','RESEARCH_COMPLETE','SUMMARY_FROZEN','CANDIDATE_FROZEN','FORWARD'];
function gen4Snapshot(){
  const E=window.LinaGen4Engine; const s=E?.load?.()||{};
  return {generation:4,label:'Generation 4',state:s.candidate?.locked?'CANDIDATE_FROZEN':(s.summaryFreeze?.frozen?'SUMMARY_FROZEN':'LEGACY_STATE'),planHash:'8d51311d',runnerSpecHash:E?.RUNNER_SPEC_HASH||'d1daab90',candidate:s.candidate?.locked?{family:s.candidate.family,selection:s.candidate.selection,evidenceStatus:s.candidate.evidence?.status||''}:null,immutable:true,source:'Gen4 fryst originalstate'};
}
function registry(){
  return {schema:SCHEMA,release:VERSION,tradeEnabled:false,generations:[gen4Snapshot(),{generation:5,label:'Generation 5',state:'NOT_DEFINED',planHash:null,runnerSpecHash:null,candidate:null,immutable:false,source:'Väntar på lärdomsdriven plan efter Gen4'}]};
}
function exportRegistry(){window.LinaStatusExport?.downloadObject?.('LINA_GENERATION_ENGINE',registry())}
function render(root,ctx){
  const r=registry(),g4=r.generations[0],g5=r.generations[1];
  root.innerHTML=`<div class="crumb">Dashboard › Forskning › Generation Engine</div><section class="hero"><h1>⚙ Generation Engine</h1><p>Gemensam motor för framtida Lina-generationer. Motorn återanvänder processen — aldrig gamla forskningsresultat.</p></section><button class="back" id="back">← Forskning</button><section class="workspace"><div class="forward-lock"><b>GENERATION ENGINE · GRUND LAGD</b><span>${VERSION} · Handel AV</span></div><div class="forward-note"><b>Princip:</b> plan → lås → runnerspec → verifiera → kör hela forskningen → spara → sammanställ → mänsklig frysning → GitHub → deterministisk kandidat → framtida Forward.<br><small>Säkra deterministiska delsteg ska automatiseras. Motorn stannar vid verkliga beslutspunkter.</small></div><h2>Generationer</h2><div class="statusline"><b>🔒 ${g4.label}</b><br>Kandidat fryst · plan ${g4.planHash} · runnerspec ${g4.runnerSpecHash}<br><small>${g4.candidate?`${g4.candidate.family} · ${g4.candidate.selection} · ${g4.candidate.evidenceStatus}`:'Fryst Gen4-state läses endast som referens.'}</small></div><div class="statusline"><b>🧪 ${g5.label}</b><br><strong>Ej definierad</strong><br><small>Ingen plan, runnerspec eller research skapas i förväg. Nästa experiment definieras först från de frysta lärdomarna från Gen4.</small></div><h2>Livscykel</h2><div class="statusline">${LIFECYCLE.map((x,i)=>`${i+1}. ${x}`).join(' → ')}</div><div class="actions"><button id="exportGenEngine" class="secondary">📥 Exportera Generation Engine-status</button></div><div class="forward-note"><b>Nästa verkliga beslut:</b> definiera Gen5-planen. V0.2.71 startar ingen Gen5-forskning och öppnar ingen Forward.</div></section>`;
  root.querySelector('#back').onclick=()=>ctx.back(); root.querySelector('#exportGenEngine').onclick=exportRegistry;
}
window.LinaGenerationEngine={VERSION,SCHEMA,LIFECYCLE,registry,render,exportRegistry};
})();

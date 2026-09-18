(function(){
'use strict';
const VERSION='V0.2.72';
const SCHEMA='LINA-GENERATION-ENGINE-1';
const LIFECYCLE=['PLAN','PLAN_LOCKED','RUNNERSPEC_LOCKED','ENGINE_VERIFIED','RESEARCH_RUNNING','RESEARCH_COMPLETE','SUMMARY_FROZEN','CANDIDATE_FROZEN','FORWARD'];
function gen4Snapshot(){
  const E=window.LinaGen4Engine; const s=E?.load?.()||{};
  return {generation:4,label:'Generation 4',state:s.candidate?.locked?'CANDIDATE_FROZEN':(s.summaryFreeze?.frozen?'SUMMARY_FROZEN':'LEGACY_STATE'),planHash:'8d51311d',runnerSpecHash:E?.RUNNER_SPEC_HASH||'d1daab90',candidate:s.candidate?.locked?{family:s.candidate.family,selection:s.candidate.selection,evidenceStatus:s.candidate.evidence?.status||''}:null,immutable:true,source:'Gen4 fryst originalstate'};
}
function gen5Basis(){
  return {
    schema:'LINA-GEN5-BASIS-1',
    sourceGeneration:4,
    sourceStatus:'CANDIDATE_FROZEN_GITHUB',
    observations:[
      'Tre av fyra Gen4-familjer föll på koncentrationskravet; koncentration var den återkommande spärren.',
      'Två familjer föll även på aktivitetskravet om minst 100 OOS-affärer.',
      'Koncentrationsmedveten ensemble var enda familjen som klarade samtliga låsta gates: 112 OOS-affärer, PF 1.61, DD 4.5 %, koncentration 23.8 %, positiva folds 3/4.'
    ],
    frozenMethodNotes:[
      'Gen4:s walk-forward-motor använde OOS-år med intern warmup i stället för att fullt ut använda deklarerade train-ranges.',
      'Gen4-ensemblen utvärderades som viktad aggregation av komponentstatistik, inte som en fullständigt simulerad kombinerad portfölj.',
      'Equal-risk pullback hade parametern riskSlots som inte påverkade exekveringen.',
      'Gen4:s konkreta rankingformel låg i implementationen men var inte en del av den hashade runnerspecen.'
    ],
    proposal:{
      state:'PROPOSAL_NOT_LOCKED',
      hypothesis:'Behåll strukturell diversifiering men pröva den i en verkligt kombinerad portföljsimulering med komplett walk-forward-träning och fullständigt hashad urvalslogik.',
      preserve:['Koncentration som oberoende PASS/FAIL-gate','Aktivitetskrav och riskkrav','Equal-risk/symboltak som portföljprincip','Deterministiskt kandidatval','Ingen användning av framtida data efter forskningsgränsen'],
      correct:['Full train→OOS walk-forward per fold','Simulera ensemble som en faktisk gemensam portfölj','Alla parametrar måste användas eller tas bort före planlås','Hasha exakt rankingformel tillsammans med runnerspec','Spara komplett variant- och fold-evidens före continuation'],
      decision:'Mänskligt beslut krävs innan detta blir Gen5-plan. Ingen plan är låst och ingen Gen5-research får starta från detta underlag.'
    }
  };
}
function registry(){
  return {schema:SCHEMA,release:VERSION,tradeEnabled:false,generations:[gen4Snapshot(),{generation:5,label:'Generation 5',state:'BASIS_READY_PLAN_NOT_DEFINED',planHash:null,runnerSpecHash:null,candidate:null,immutable:false,source:'Lärdomsunderlag från fryst Gen4',basis:gen5Basis()}]};
}
function exportRegistry(){window.LinaStatusExport?.downloadObject?.('LINA_GENERATION_ENGINE',registry())}
function exportGen5Basis(){window.LinaStatusExport?.downloadObject?.('LINA_GEN5_UNDERLAG',gen5Basis())}
function render(root,ctx){
  const r=registry(),g4=r.generations[0],g5=r.generations[1],b=g5.basis;
  const li=a=>a.map(x=>`<li>${x}</li>`).join('');
  root.innerHTML=`<div class="crumb">Dashboard › Forskning › Generation Engine</div><section class="hero"><h1>⚙ Generation Engine</h1><p>Gemensam motor för framtida Lina-generationer. Motorn återanvänder processen — aldrig gamla forskningsresultat.</p></section><button class="back" id="back">← Forskning</button><section class="workspace"><div class="forward-lock"><b>GENERATION ENGINE · UNDERLAG REDO</b><span>${VERSION} · Handel AV</span></div><div class="forward-note"><b>Princip:</b> plan → lås → runnerspec → verifiera → kör hela forskningen → spara → sammanställ → mänsklig frysning → GitHub → deterministisk kandidat → framtida Forward.<br><small>Säkra deterministiska delsteg automatiseras. Motorn stannar vid verkliga beslutspunkter.</small></div><h2>Generationer</h2><div class="statusline"><b>🔒 ${g4.label}</b><br>Kandidat fryst · plan ${g4.planHash} · runnerspec ${g4.runnerSpecHash}<br><small>${g4.candidate?`${g4.candidate.family} · ${g4.candidate.selection} · ${g4.candidate.evidenceStatus}`:'Fryst Gen4-state läses endast som referens.'}</small></div><div class="statusline"><b>🧪 ${g5.label}</b><br><strong>Underlag redo · plan ej definierad</strong><br><small>Gen5 har fortfarande ingen låst plan, runnerspec eller research. Underlaget nedan är ett förslag vid nästa mänskliga beslutspunkt.</small></div><h2>Underlag för Generation 5</h2><div class="forward-note"><b>Vad Gen4 visade</b><ul>${li(b.observations)}</ul></div><div class="forward-note"><b>Metodpunkter som Gen5 ska rätta — utan att ändra Gen4</b><ul>${li(b.frozenMethodNotes)}</ul></div><div class="statusline"><b>Planförslag · EJ LÅST</b><br>${b.proposal.hypothesis}<br><br><b>Behåll:</b><ul>${li(b.proposal.preserve)}</ul><b>Rätta i nästa generation:</b><ul>${li(b.proposal.correct)}</ul><small>${b.proposal.decision}</small></div><div class="actions"><button id="exportGen5Basis" class="secondary">📥 Exportera Gen5-underlag</button><button id="exportGenEngine" class="secondary">📥 Exportera Generation Engine-status</button></div><h2>Livscykel</h2><div class="statusline">${LIFECYCLE.map((x,i)=>`${i+1}. ${x}`).join(' → ')}</div><div class="forward-note"><b>Nästa verkliga beslut:</b> godkänna eller ändra Gen5-planförslaget. ${VERSION} låser ingen Gen5-plan, startar ingen research och öppnar ingen Forward.</div></section>`;
  root.querySelector('#back').onclick=()=>ctx.back(); root.querySelector('#exportGenEngine').onclick=exportRegistry; root.querySelector('#exportGen5Basis').onclick=exportGen5Basis;
}
window.LinaGenerationEngine={VERSION,SCHEMA,LIFECYCLE,registry,render,exportRegistry};
})();

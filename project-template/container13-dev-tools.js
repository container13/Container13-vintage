// Container13 development tools. Enable explicitly with ?dev=1; disable with ?dev=0.
const key='container13-dev-tools';
const qs=new URLSearchParams(location.search);
if(qs.get('dev')==='1')sessionStorage.setItem(key,'1');
else if(location.pathname.endsWith('/remember/dashboard.html'))sessionStorage.removeItem(key);
if(qs.get('dev')==='0')sessionStorage.removeItem(key);
if(sessionStorage.getItem(key)==='1'){
 const style=document.createElement('style');
 style.textContent='#c13-dev-panel{position:fixed;right:12px;bottom:max(12px,env(safe-area-inset-bottom));z-index:2147483000;display:flex;gap:7px;padding:8px;border-radius:13px;background:#10231ff2;box-shadow:0 4px 25px #0008}#c13-dev-panel button{font:600 13px system-ui;padding:10px;border-radius:8px;border:1px solid #a6c7b4;background:#254438;color:white}#c13-dev-dialog{border:1px solid #8db29f;border-radius:14px;background:#10231f;color:white;max-width:min(94vw,600px);max-height:90dvh;overflow:auto}#c13-dev-dialog img{display:block;max-width:100%;max-height:55dvh;object-fit:contain;margin:12px auto}#c13-dev-dialog button{margin:5px;padding:10px}';
 document.head.append(style);
 const panel=document.createElement('div');panel.id='c13-dev-panel';panel.setAttribute('data-html2canvas-ignore','true');
 panel.innerHTML='<button type="button" id="c13-dev-refresh">↻ Uppdatera</button><button type="button" id="c13-dev-shot">📸 Hela sidan</button>';
 document.body.append(panel);
 document.getElementById('refreshRemember')?.remove();
 const refresh=async()=>{if(!confirm('Uppdatera sidan? Osparade ändringar kan försvinna.'))return;try{const reg=await navigator.serviceWorker?.getRegistration();await reg?.update()}catch{}const u=new URL(location.href);u.searchParams.set('_reload',Date.now());location.replace(u.href)};
 panel.querySelector('#c13-dev-refresh').onclick=refresh;
 panel.querySelector('#c13-dev-shot').onclick=async()=>{
  const btn=panel.querySelector('#c13-dev-shot');btn.disabled=true;btn.textContent='Fångar…';
  try{
   if(!window.html2canvas){await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';script.onload=resolve;script.onerror=reject;document.head.append(script)})}
   const canvas=await html2canvas(document.documentElement,{backgroundColor:'#10231f',useCORS:true,scale:Math.min(devicePixelRatio||1,2),windowWidth:document.documentElement.scrollWidth,windowHeight:document.documentElement.scrollHeight,scrollX:0,scrollY:0,ignoreElements:e=>e.id==='c13-dev-panel'||e.id==='c13-dev-dialog'||e.matches?.('input[type=password],video')});
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Kunde inte skapa PNG');
   const name='remember-'+new Date().toISOString().replace(/[:.]/g,'-')+'.png',file=new File([blob],name,{type:'image/png'}),url=URL.createObjectURL(blob);
   const dialog=document.createElement('dialog');dialog.id='c13-dev-dialog';dialog.innerHTML='<h3>Hela sidan – förhandsvisning</h3><p>Observera: externa bilder, kameravyer och känsliga uppgifter kan saknas eller synas. Kontrollera bilden före delning.</p><img alt="Förhandsvisning av helsidesbild"><div><button id="c13-copy">📋 Kopiera</button><button id="c13-share">📤 Dela / AirDrop</button><button id="c13-save">💾 Spara PNG</button><button id="c13-close">Stäng</button></div><p id="c13-result" role="status"></p>';
   document.body.append(dialog);dialog.querySelector('img').src=url;
   const status=msg=>dialog.querySelector('#c13-result').textContent=msg;
   dialog.querySelector('#c13-copy').onclick=async()=>{try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);status('Bilden kopierad.')}catch{status('Bildkopiering stöds inte här. Välj Dela eller Spara PNG.')}};
   dialog.querySelector('#c13-share').onclick=async()=>{try{if(!navigator.canShare?.({files:[file]}))throw Error('Fildelning stöds inte här');await navigator.share({files:[file],title:'Remember – helsidesbild'})}catch(e){status(e.name==='AbortError'?'Delning avbruten.':'Delning stöds inte här. Spara PNG i stället.')}};
   dialog.querySelector('#c13-save').onclick=()=>{const a=document.createElement('a');a.href=url;a.download=name;a.click();status('Nedladdning begärd.')};
   dialog.querySelector('#c13-close').onclick=()=>dialog.close();
   dialog.onclose=()=>{URL.revokeObjectURL(url);dialog.remove()};dialog.showModal();
  }catch(e){alert('Kunde inte fånga hela sidan: '+e.message+'\nKontrollera internetanslutningen och försök igen.')}finally{btn.disabled=false;btn.textContent='📸 Hela sidan'}
 };
}

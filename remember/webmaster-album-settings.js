export function uploadStatus(album,now=Date.now()){
 const opens=Date.parse(album.override_opens_at||album.default_opens_at);
 const closes=Date.parse(album.override_closes_at||album.default_closes_at);
 return album.is_active===false?'Albumet är avstängt':album.forced_closed?'Tillfälligt stängt':!Number.isFinite(opens)||!Number.isFinite(closes)?'Tid saknas':now<opens?'Öppnar senare':now>=closes?'Stängt för uppladdning':'Öppet för uppladdning';
}
export function localInput(iso){const d=new Date(iso);return Number.isFinite(+d)?new Date(+d-d.getTimezoneOffset()*60000).toISOString().slice(0,16):'';}
export function inputUTC(value){const d=new Date(value);if(!value||!Number.isFinite(+d)||localInput(d.toISOString())!==value)throw Error('Kontrollera datum och klockslag.');return d.toISOString();}
export function extendedClose(iso,hours,now=Date.now()){return new Date(Math.max(Date.parse(iso)||0,now)+hours*3600000).toISOString();}

export function timeZoneLabel(zone){return zone==='Europe/Stockholm'?'Svensk tid':zone||'Uppgift saknas';}

export function mountWebmasterAlbumSettings({host,album,enabled,request}){
 let current=album,saving=false;
 host.hidden=false;
 host.innerHTML=`<section class="admin-overview"><h2>Albumöversikt</h2><dl><div><dt>Albumägare</dt><dd data-owner></dd></div><div><dt>Uppladdning</dt><dd data-status></dd></div><div data-count-row hidden><dt>Bilder / bildgräns</dt><dd data-count></dd></div><div><dt>Tidszon</dt><dd data-zone></dd></div></dl></section><section class="admin-times"><h2>Tider och åtkomst</h2><p data-window></p><form data-time-form><fieldset><legend class="sr-only">Ändra uppladdningsperiod</legend><label>Öppnar<input name="opens" type="datetime-local" required></label><label>Stänger<input name="closes" type="datetime-local" required></label><p class="admin-time-zone"></p><div class="admin-extend"><button type="button" data-hours="24" class="secondary">Förläng 24 timmar</button><button type="button" data-hours="168" class="secondary">Förläng 7 dagar</button></div><p class="admin-settings-status" data-extension-note></p><p class="admin-settings-status" data-close-preview role="status" aria-live="polite" hidden></p><label class="admin-closed"><input name="closed" type="checkbox"> Tillfälligt stängd för uppladdning</label><button type="submit">Spara ändringar</button></fieldset></form><p class="admin-settings-status" data-settings-feedback role="status" aria-live="polite"></p></section>`;
 const q=s=>host.querySelector(s),form=q('form'),fieldset=q('fieldset'),feedback=q('[data-settings-feedback]');
 const date=iso=>new Intl.DateTimeFormat('sv-SE',{dateStyle:'medium',timeStyle:'short',timeZone:current.event_timezone||'Europe/Stockholm'}).format(new Date(iso));
 function updateDraftPreview(){
  const closesValue=form.elements.closes.value,opensValue=form.elements.opens.value;
  const expires=Date.parse(closesValue),expired=Number.isFinite(expires)&&expires<=Date.now();
  host.querySelectorAll('[data-hours]').forEach(button=>{
   const period=button.dataset.hours==='24'?'24 timmar':'7 dagar';
   button.textContent=expired?'Öppna igen i '+period:'Förläng '+period;
  });
  q('[data-extension-note]').textContent=(expired?'Tiden räknas från nu.':'Tiden läggs till albumets valda sluttid.')+(form.elements.closed.checked?' Albumet är tillfälligt stängt. Avmarkera stängningen för att tillåta uppladdning.':'');
  const preview=q('[data-close-preview]');
  const dirty=closesValue!==localInput(current.override_closes_at||current.default_closes_at)||opensValue!==localInput(current.override_opens_at||current.default_opens_at)||form.elements.closed.checked!==!!current.forced_closed;
  preview.hidden=!dirty;
  if(dirty){
   try{const iso=inputUTC(closesValue);preview.textContent='Ny sluttid: '+date(iso)+' ('+timeZoneLabel(current.event_timezone)+'). Inte sparad.'+(form.elements.closed.checked?' Uppladdningen förblir tillfälligt stängd.':'');}
   catch{preview.textContent='Kontrollera den nya sluttiden. Ändringarna är inte sparade.';}
  }else preview.textContent='';
 }
 function render(){
  q('[data-owner]').textContent=current.owner_email||'Uppgift saknas';q('[data-status]').textContent=uploadStatus(current);
  q('[data-zone]').textContent=timeZoneLabel(current.event_timezone);
  const opens=current.override_opens_at||current.default_opens_at,closes=current.override_closes_at||current.default_closes_at;
  q('[data-window]').textContent=opens&&closes?date(opens)+' – '+date(closes):'Uppladdningstider saknas.';
  form.elements.opens.value=localInput(opens);form.elements.closes.value=localInput(closes);form.elements.closed.checked=!!current.forced_closed;
  const deviceZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
  q('.admin-time-zone').textContent=deviceZone===current.event_timezone?'':'Ändringsfälten visas i '+timeZoneLabel(deviceZone)+'.';
  if(Number.isInteger(current.photo_limit)&&Number.isInteger(current.photo_count)){q('[data-count-row]').hidden=false;q('[data-count]').textContent=current.photo_count+' / '+current.photo_limit;}
  fieldset.disabled=!enabled||saving;updateDraftPreview();
 }
 render();if(!enabled)feedback.textContent='Tidsändringar är inte aktiverade ännu.';
 form.addEventListener('input',updateDraftPreview);form.addEventListener('change',updateDraftPreview);form.addEventListener('focusin',updateDraftPreview);
 host.querySelectorAll('[data-hours]').forEach(button=>button.onclick=()=>{
  if(!enabled||saving)return;
  try{form.elements.closes.value=localInput(extendedClose(inputUTC(form.elements.closes.value),Number(button.dataset.hours)));updateDraftPreview();feedback.textContent='Kontrollera den nya sluttiden och välj Spara ändringar.';}catch(e){feedback.textContent=e.message;}
 });
 async function refresh(){const data=await request({action:'album_settings',albumId:current.id});if(!data.album)throw Error('Albumuppgifterna kunde inte hämtas.');current=data.album;render();}
 if(enabled)void refresh().catch(e=>{enabled=false;render();feedback.textContent=e.message;});
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!enabled||saving||!form.reportValidity())return;
  let opensAt,closesAt;
  try{opensAt=inputUTC(form.elements.opens.value);closesAt=inputUTC(form.elements.closes.value);if(Date.parse(closesAt)<=Date.parse(opensAt))throw Error('Sluttiden måste vara efter starttiden.');}catch(e){feedback.textContent=e.message;return;}
  const forcedClosed=form.elements.closed.checked;
  saving=true;fieldset.disabled=true;form.setAttribute('aria-busy','true');feedback.textContent='Sparar ändringarna…';
  try{const data=await request({action:'save_album_settings',albumId:current.id,expectedRevision:String(current.revision),opensAt,closesAt,forcedClosed});if(!data.album)throw Error('Resultatet kunde inte bekräftas.');current=data.album;feedback.textContent='Ändringarna är sparade.';}
  catch(e){feedback.textContent=e.message+' Hämtar aktuella tider…';try{await refresh();feedback.textContent=e.message+' Aktuella tider har hämtats. Kontrollera innan du försöker igen.';}catch{enabled=false;feedback.textContent='Sparresultatet är osäkert. Öppna albumet igen för att hämta aktuella tider.';}}
  finally{saving=false;form.removeAttribute('aria-busy');render();}
 });
 function updatePhotoCount(count){
  if(!Number.isInteger(count)||count<0||!Number.isInteger(current.photo_limit))return;
  current={...current,photo_count:count};q('[data-count-row]').hidden=false;
  q('[data-count]').textContent=count+' / '+current.photo_limit;
 }
 return {refresh,updatePhotoCount};
}

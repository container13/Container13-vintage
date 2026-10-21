// Separate webmaster-only album access control. Capability is false until backend rollout.
export function mountWebmasterAlbumActivation({host,album,enabled,request,confirmDisable=message=>window.confirm(message)}){
 let current=null,saving=false;
 host.hidden=false;
 host.innerHTML=`<section class="admin-overview"><h2>Albumets åtkomst</h2><form><fieldset disabled><legend class="sr-only">Aktivera eller stäng av album</legend><label class="admin-closed"><input name="active" type="checkbox"> Album aktivt</label><p data-activation-description>Avstängt album blockerar gästernas visning och all ny uppladdning. Bilderna behålls. Webmaster kan administrera albumet.</p><label>Skäl till avstängning (valfritt)<textarea name="reason" rows="2" maxlength="500"></textarea></label><p class="admin-settings-status">Skälet visas endast för webmaster.</p><button type="submit">Spara albumstatus</button></fieldset></form><p data-activation-feedback class="admin-settings-status" role="status" aria-live="polite"></p></section>`;
 const form=host.querySelector('form'),fields=form.querySelector('fieldset'),feedback=host.querySelector('[data-activation-feedback]');
 function render(){
  const known=current&&typeof current.is_active==='boolean';
  fields.disabled=!enabled||!known||saving;
  form.elements.active.indeterminate=!known;
  form.elements.active.checked=known?current.is_active:false;
  form.elements.reason.value=known?current.activation_reason||'':'';
  form.elements.reason.disabled=!known||current.is_active;
 }
 function setCurrent(data){
  if(!data?.album||data.album.id!==album.id||typeof data.album.is_active!=='boolean'||typeof data.album.revision!=='string')throw Error('Albumstatus kunde inte verifieras.');
  current=data.album;
  // Keep the shared schedule revision/status synchronized by re-reading it after a change.
  host.dispatchEvent(new CustomEvent('remember-album-activation',{bubbles:true,detail:{is_active:current.is_active}}));
  render();
 }
 async function refresh(){setCurrent(await request({action:'album_activation',albumId:album.id}));}
 render();
 if(!enabled)feedback.textContent='Avstängning är inte aktiverad ännu. Albumets status kan inte hämtas här.';
 else void refresh().then(()=>{feedback.textContent=current.is_active?'Albumet är aktivt.':'Albumet är avstängt.';}).catch(e=>{enabled=false;render();feedback.textContent=e.message;});
 form.elements.active.addEventListener('change',()=>{
  form.elements.reason.disabled=form.elements.active.checked;
  feedback.textContent=form.elements.active.checked?'Inte sparat. Återaktivering behåller tidigare sluttid och eventuell tillfällig uppladdningsstängning.':'Inte sparat. Avstängning stoppar nya bildhämtningar och uppladdningar. Redan hämtade bilder kan finnas kvar.';
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!enabled||!current||saving||!form.reportValidity())return;
  const active=form.elements.active.checked,reason=active?'':form.elements.reason.value.trim();
  if(active===current.is_active&&reason===(current.activation_reason||'')){feedback.textContent='Inga ändringar att spara.';return;}
  if(!active&&current.is_active&&!await confirmDisable('Stänga av albumet? Gäster kan inte längre hämta bilder eller ladda upp. Bilderna behålls.'))return;
  saving=true;fields.disabled=true;form.setAttribute('aria-busy','true');feedback.textContent='Sparar albumstatus…';
  try{setCurrent(await request({action:'save_album_activation',albumId:album.id,expectedRevision:current.revision,active,reason}));feedback.textContent=current.is_active?'Albumet är återaktiverat. Tidigare tider och inställningar är oförändrade.':'Albumet är avstängt. Bilderna behålls.';}
  catch(e){try{await refresh();feedback.textContent=e.message+' Aktuell status har hämtats. Kontrollera innan du försöker igen.';}catch{enabled=false;feedback.textContent='Sparresultatet är osäkert. Öppna albumet igen för att verifiera status.';}}
  finally{saving=false;form.removeAttribute('aria-busy');render();}
 });
 return {refresh};
}

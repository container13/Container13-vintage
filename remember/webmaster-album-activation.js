// One confirmation dialog and independent switches outside each album link.
export function createWebmasterAlbumActivation({document:doc=document,request,onChanged=()=>{},canUse=()=>false,focusFallback=()=>null}){
 const win=doc.defaultView;
 const dialog=doc.createElement('dialog');dialog.className='album-activation-dialog';
 dialog.setAttribute('aria-labelledby','albumActivationTitle');
 dialog.innerHTML=`<div class="activation-dialog-heading"><h2 id="albumActivationTitle"></h2><button type="button" data-close aria-label="Stäng">✕</button></div><p data-description></p><form><label data-reason-label>Skäl till avstängning (valfritt)<textarea name="reason" maxlength="500" rows="3"></textarea><span>Visas endast för webmaster.</span></label><p data-feedback role="status" aria-live="polite"></p><div class="activation-dialog-actions"><button type="button" data-cancel>Avbryt</button><button type="submit" data-confirm></button></div></form>`;
 doc.body.append(dialog);
 const q=s=>dialog.querySelector(s),form=q('form');
 let selected=null,generation=0,scroll=0,bodyStyle=null;
 function usable(){return canUse()===true;}
 function validate(data,id){
  const a=data?.album;
  if(!a||a.id!==id||typeof a.is_active!=='boolean'||typeof a.revision!=='string'||!/^\d+$/.test(a.revision))throw Error('Albumstatus kunde inte verifieras.');
  return a;
 }
 function controls(){
  const saving=selected?.saving===true;
  q('[data-close]').disabled=saving;q('[data-cancel]').disabled=saving;
  q('[data-confirm]').disabled=!selected?.current||selected.loading||saving||!usable()||selected.current.is_active===selected.target;
  form.elements.reason.disabled=selected?.loading||saving;
  dialog.setAttribute('aria-busy',String(!!selected?.loading||saving));
 }
 function close(){if(!selected?.saving&&dialog.open)dialog.close();}
 q('[data-close]').onclick=close;q('[data-cancel]').onclick=close;
 dialog.addEventListener('cancel',event=>{if(selected?.saving)event.preventDefault();});
 dialog.addEventListener('click',event=>{
  if(event.target!==dialog||selected?.saving)return;
  const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();
 });
 dialog.addEventListener('close',()=>{
  const previous=selected;selected=null;generation++;
  if(bodyStyle){Object.assign(doc.body.style,bodyStyle);bodyStyle=null;win.scrollTo(0,scroll);}
  const target=[...doc.querySelectorAll('[data-album-switch]')].find(el=>el.dataset.albumSwitch===previous?.id&&!el.disabled)||focusFallback();
  target?.focus({preventScroll:true});
 });
 async function open(album,button,target){
  if(!usable()||selected||typeof album.is_active!=='boolean'||target===album.is_active)return;
  const seq=++generation;
  selected={id:album.id,target,current:null,loading:true,saving:false};
  q('#albumActivationTitle').textContent=(target?'Återaktivera ':'Stäng av ')+(album.title||'albumet')+'?';
  q('[data-description]').textContent=target?'Albumets tidigare sluttid och tillfälliga uppladdningsstängning behålls.':'Gäster kan inte längre hämta bilder eller ladda upp. Bilderna behålls. Redan hämtade eller sparade bilder kan finnas kvar.';
  q('[data-reason-label]').hidden=target;
  form.elements.reason.value='';
  q('[data-confirm]').textContent=target?'Återaktivera album':'Stäng av album';
  q('[data-feedback]').textContent='Hämtar aktuell albumstatus…';
  scroll=win.scrollY;bodyStyle={position:doc.body.style.position,top:doc.body.style.top,width:doc.body.style.width};
  doc.body.style.position='fixed';doc.body.style.top=-scroll+'px';doc.body.style.width='100%';
  controls();dialog.showModal();
  try{
   const current=validate(await request({action:'album_activation',albumId:album.id}),album.id);
   if(seq!==generation||!selected||!usable())return;
   selected.current=current;onChanged(current);
   q('[data-feedback]').textContent=current.is_active===target?'Albumet har redan denna status. Inget behöver sparas.':'Ändringen sparas när du bekräftar.';
   if(!target)form.elements.reason.value=current.activation_reason||'';
  }catch(e){if(seq===generation&&selected)q('[data-feedback]').textContent=e.message+' Stäng och försök igen.';}
  finally{if(seq===generation&&selected){selected.loading=false;controls();}}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();const operation=selected;
  if(!operation||operation.loading||operation.saving||!operation.current||!usable()||operation.current.is_active===operation.target||!form.reportValidity())return;
  const seq=generation;operation.saving=true;controls();q('[data-feedback]').textContent='Sparar albumstatus…';
  try{
   const current=validate(await request({action:'save_album_activation',albumId:operation.id,expectedRevision:operation.current.revision,active:operation.target,reason:operation.target?'':form.elements.reason.value.trim()}),operation.id);
   if(seq!==generation||!selected||!usable())return;
   if(current.is_active!==operation.target)throw Error('Den önskade statusen kunde inte bekräftas.');
   onChanged(current);operation.saving=false;dialog.close();
  }catch(e){
   if(seq!==generation||!selected)return;
   operation.current=null;
   try{
    const current=validate(await request({action:'album_activation',albumId:operation.id}),operation.id);
    if(seq!==generation||!selected||!usable())return;
    operation.current=current;onChanged(current);
    q('[data-feedback]').textContent=e.message+' Aktuell status har hämtats. Kontrollera innan du försöker igen.';
   }catch{if(seq===generation&&selected)q('[data-feedback]').textContent='Sparresultatet är osäkert. Stäng och uppdatera albumlistan innan nytt försök.';}
  }finally{if(seq===generation&&selected){operation.saving=false;controls();}}
 });
 function mountSwitch({host,album,enabled}){
  const known=typeof album.is_active==='boolean';
  const label=doc.createElement('span');label.className='album-switch-label';label.textContent=known?(album.is_active?'Aktivt':'Avstängt'):'Status saknas';
  const button=doc.createElement('button');button.type='button';button.className='album-status-switch';button.dataset.albumSwitch=album.id;
  button.dataset.state=known?(album.is_active?'on':'off'):'unknown';
  button.setAttribute('role','switch');button.setAttribute('aria-checked',String(known&&album.is_active));
  button.setAttribute('aria-label','Album aktivt: '+(album.title||'Album')+(known?'':'. Status kan inte hämtas ännu.'));
  button.setAttribute('aria-describedby','catalogActivationNotice');button.disabled=!enabled||!known||!usable();
  const thumb=doc.createElement('span');thumb.className='album-switch-thumb';thumb.setAttribute('aria-hidden','true');button.append(thumb);
  let down=null,suppressUntil=0;
  button.addEventListener('pointerdown',event=>{if(button.disabled||event.isPrimary===false)return;down={x:event.clientX,y:event.clientY};button.setPointerCapture?.(event.pointerId);});
  button.addEventListener('pointercancel',()=>{down=null;});
  button.addEventListener('pointerup',event=>{
   if(!down||button.disabled)return;const dx=event.clientX-down.x,dy=event.clientY-down.y;down=null;
   if(Math.abs(dx)>=12&&Math.abs(dx)>Math.abs(dy)){suppressUntil=Date.now()+500;event.preventDefault();void open(album,button,dx>0);}
  });
  button.onclick=event=>{if(button.disabled)return;if(event.detail&&Date.now()<suppressUntil)return;void open(album,button,!album.is_active);};
  host.append(label,button);return button;
 }
 function reset(){generation++;if(selected)selected.saving=false;if(dialog.open)dialog.close();else selected=null;}
 return {mountSwitch,reset,isBusy:()=>!!selected};
}

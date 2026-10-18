// Shared development-only role navigation. Server authorization is never changed by the UI.
const roles={webmaster:{label:'🛠 Webmaster'},owner:{label:'👤 Albumägare'},guest:{label:'👥 Gäst'}};
export function mountRememberRoleSwitcher({host,mode,albumId,onGuest}){
 if(!host||!roles[mode]||!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(albumId||''))return;
 host.replaceChildren();host.classList.add('remember-role-switcher');
 for(const [role,entry] of Object.entries(roles)){
  if(role===mode)continue;
  const button=document.createElement('button');
  button.type='button';button.className='remember-role-button';button.textContent=entry.label;
  button.onclick=()=>{
   if(role==='guest'){if(typeof onGuest==='function')void onGuest(button);return;}
   const url=new URL('./album-admin.html',location.href);
   url.searchParams.set('id',albumId);
   if(role==='owner')url.searchParams.set('view','owner');
   location.assign(url.href);
  };
  host.append(button);
 }
}
export const rememberRoleSwitcherCSS='.remember-role-switcher{display:flex;justify-content:center;align-items:center;gap:9px;margin:0 auto 12px;max-width:420px}.remember-role-button{flex:0 1 175px;min-width:0;padding:9px 11px!important;min-height:40px;border:1px solid rgba(255,255,255,.55)!important;border-radius:12px!important;background:rgba(18,45,35,.90)!important;color:#f6f3e9!important;font:650 13px system-ui!important;white-space:nowrap;cursor:pointer}.remember-role-button:focus-visible{outline:3px solid #d9e7a4;outline-offset:2px}';

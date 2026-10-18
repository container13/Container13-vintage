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
export const rememberRoleSwitcherCSS=`
.remember-role-switcher{display:flex;justify-content:center;align-items:center;gap:10px;margin:0 auto 10px;max-width:360px}
.remember-role-button{flex:0 1 156px;min-width:0;padding:7px 10px!important;min-height:38px!important;border:1px solid rgba(234,231,198,.55)!important;border-radius:13px!important;background:rgba(21,51,40,.88)!important;color:#f6f3e9!important;font:650 13px system-ui!important;white-space:nowrap;cursor:pointer}
.remember-role-button:focus-visible{outline:3px solid #d9e7a4;outline-offset:2px}
.remember-album-heading{border:1px solid rgba(255,255,255,.38);border-radius:19px;padding:18px 18px 20px;margin:0 0 18px;background:rgba(23,49,39,.90);box-shadow:0 12px 30px rgba(0,0,0,.22);text-align:center}
.remember-album-heading .mode-banner{position:static!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#e6d59c!important;font-size:13px!important;font-weight:750!important;letter-spacing:.09em}
.remember-album-heading .mode-banner small{display:none!important}
.remember-album-heading h1{margin:9px 0 0!important;font-family:Georgia,serif!important;font-size:clamp(30px,8vw,45px)!important;line-height:1.12!important;color:#fff4db!important;overflow-wrap:anywhere}
.remember-album-heading[data-mode="guest"]{background:rgba(29,59,43,.9)}
.remember-album-heading[data-mode="owner"]{background:rgba(44,54,38,.9)}
`;

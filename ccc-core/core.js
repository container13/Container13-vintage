// CCC Core JS — v2.8.43
// Gemensamt beteende: tema, profilmeny och logout.

const root=document.documentElement;
const $=(selector)=>document.querySelector(selector);

function applyTheme(theme){
  root.dataset.theme=theme;
  localStorage.setItem("ccc-theme",theme);
  $("#themeBtn")?.setAttribute("aria-pressed",String(theme==="dark"));

  const themeColor=theme==="dark"?"#11141b":"#f7f7f9";
  let metaTheme=document.querySelector('meta[name="theme-color"]');
  if(!metaTheme){
    metaTheme=document.createElement("meta");
    metaTheme.name="theme-color";
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute("content",themeColor);

  /* iOS/PWA kan visa viewportens canvas i safe-area. Måla även den explicit. */
  root.style.backgroundColor=themeColor;
  if(document.body)document.body.style.backgroundColor=themeColor;
}
const savedTheme=localStorage.getItem("ccc-theme");
const prefersDark=window.matchMedia?.("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme||(prefersDark?"dark":"light"));

const profileBtn=$("#profileBtn");
const profileMenu=$("#profileMenu");
function setProfileMenu(open){
  if(!profileMenu)return;
  profileMenu.hidden=!open;
  profileBtn?.setAttribute("aria-expanded",String(open));
}
$("#themeBtn")?.addEventListener("click",()=>applyTheme(root.dataset.theme==="dark"?"light":"dark"));
profileBtn?.addEventListener("click",(event)=>{event.stopPropagation();setProfileMenu(profileMenu?.hidden??true);});
document.addEventListener("click",(event)=>{
  if(profileMenu&&!profileMenu.hidden&&!profileMenu.contains(event.target)&&event.target!==profileBtn)setProfileMenu(false);
});

const logoutBtn=$("#logout");
const logoutDialog=$("#logoutDialog");
const cancelLogout=$("#cancelLogout");
const confirmLogout=$("#confirmLogout");
function setLogoutDialog(open){if(logoutDialog)logoutDialog.hidden=!open;}
logoutBtn?.addEventListener("click",()=>{setProfileMenu(false);setLogoutDialog(true);});
cancelLogout?.addEventListener("click",()=>setLogoutDialog(false));
logoutDialog?.addEventListener("click",(event)=>{if(event.target===logoutDialog)setLogoutDialog(false);});
document.addEventListener("keydown",(event)=>{if(event.key==="Escape"){setProfileMenu(false);setLogoutDialog(false);}});
confirmLogout?.addEventListener("click",async()=>{
  confirmLogout.disabled=true;
  try{
    const [{auth},{signOut}]=await Promise.all([
      import("./auth/firebase.js"),
      import("https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js")
    ]);
    await signOut(auth);
    window.location.href=new URL("./auth/index.html",import.meta.url).href;
  }catch(error){
    console.error("CCC logout failed",error);
    confirmLogout.disabled=false;
  }
});


// ==========================================================
// CCC HEADER CORE v1 — v2.9.3
// Centralt styrd header. Moduler bestämmer endast synlighet
// och reagerar på events; geometri/ikoner ägs av core.css.
// ==========================================================
const CCC_HEADER_ICONS={
  back:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>`,
  settings:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.4"/><path d="M19.2 13.3a7.8 7.8 0 0 0 .1-1.3 7.8 7.8 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2.2-1.3L14.2 3h-4.4l-.4 2.4a7.6 7.6 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6A7.8 7.8 0 0 0 4.7 12c0 .44.04.87.1 1.3l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2.2 1.3l.4 2.4h4.4l.4-2.4a7.6 7.6 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6Z"/></svg>`,
  theme:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path class="ccc-theme-fill" d="M12 4a8 8 0 0 1 0 16Z"/></svg>`,
  user:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r="3"/><path d="M6.8 18c1.1-2.5 3-3.8 5.2-3.8s4.1 1.3 5.2 3.8"/></svg>`
};

function ensureCCCHeader(){
  const header=document.querySelector(".ccc-header");
  if(!header)return null;

  let left=header.querySelector(".ccc-header-left-tools");
  if(!left){
    left=document.createElement("div");
    left.className="ccc-header-left-tools";
    left.innerHTML=`
      <button id="cccHeaderBack" class="ccc-header-control ccc-header-control--back" type="button" aria-label="Tillbaka" hidden>${CCC_HEADER_ICONS.back}</button>
      <button id="cccHeaderSettings" class="ccc-header-control ccc-header-control--settings" type="button" aria-label="Modulinställningar" hidden>${CCC_HEADER_ICONS.settings}</button>`;
    header.appendChild(left);
  }

  const theme=$("#themeBtn");
  if(theme){
    theme.classList.add("ccc-header-control--theme");
    theme.innerHTML=CCC_HEADER_ICONS.theme;
  }
  const profile=$("#profileBtn");
  if(profile)profile.innerHTML=CCC_HEADER_ICONS.user;

  const back=$("#cccHeaderBack");
  const settings=$("#cccHeaderSettings");
  if(back&&!back.dataset.cccBound){
    back.dataset.cccBound="1";
    back.addEventListener("click",()=>document.dispatchEvent(new CustomEvent("ccc:header-back")));
  }
  if(settings&&!settings.dataset.cccBound){
    settings.dataset.cccBound="1";
    settings.addEventListener("click",()=>document.dispatchEvent(new CustomEvent("ccc:header-settings")));
  }
  return {header,left,back,settings,theme,profile};
}

const CCCHeader={
  state:{back:false,settings:false},
  set(next={}){
    const ui=ensureCCCHeader();
    this.state={...this.state,...next};
    if(ui?.back)ui.back.hidden=!this.state.back;
    if(ui?.settings)ui.settings.hidden=!this.state.settings;
    document.body?.classList.toggle("ccc-has-header-back",!!this.state.back);
    document.body?.classList.toggle("ccc-has-header-settings",!!this.state.settings);
    return {...this.state};
  },
  get(){return {...this.state}}
};

const initialHeader={
  back:document.body?.dataset.cccHeaderBack==="true",
  settings:document.body?.dataset.cccHeaderSettings==="true"
};
ensureCCCHeader();
CCCHeader.set(window.__CCC_HEADER_PENDING__||initialHeader);




// ==========================================================
// CCC FOOTER CORE v4 — v2.9.44
// Footern är en permanent del av CCC:s grundlayout.
// Dashboard visar samma footer-yta men utan knapp/innehåll.
// Moduler använder samma ccc:header-back-event som headerpilen.
// ==========================================================
function isCCCDashboard(){
  return /\/ccc-core\/dashboard\/?(?:index\.html)?$/i.test(location.pathname);
}


function ensureCCCFooter(){
  let footer=document.querySelector("#cccCoreFooter");
  if(!footer){
    footer=document.createElement("footer");
    footer.id="cccCoreFooter";
    footer.className="ccc-core-footer";
    footer.setAttribute("aria-label","Snabbnavigation");
    footer.innerHTML=`
      <button id="cccCoreFooterBack" class="ccc-core-footer-back" type="button">
        <span class="ccc-core-footer-back-icon" aria-hidden="true">←</span>
        <span class="ccc-core-footer-back-copy">
          <strong>Tillbaka</strong>
          <small>Till föregående steg</small>
        </span>
      </button>`;
    const shell=document.querySelector(".ccc-app-shell,.app-shell")||document.body;
    shell.appendChild(footer);
  }

  const dashboard=isCCCDashboard();
  footer.classList.toggle("ccc-core-footer--empty",dashboard);

  const back=footer.querySelector("#cccCoreFooterBack");
  if(back){
    back.hidden=dashboard;
    if(!back.dataset.cccBound){
      back.dataset.cccBound="1";
      back.addEventListener("click",()=>{
        if(CCCHeader.state.back){
          document.dispatchEvent(new CustomEvent("ccc:header-back"));
        }else{
          location.href=new URL("./dashboard/index.html",import.meta.url).href;
        }
      });
    }
  }

  document.body.classList.add("ccc-has-core-footer");
  return footer;
}
const CCCFooter={
  el:ensureCCCFooter(),
  toolConfig:null,
  renderDefault(){
    const footer=this.el||ensureCCCFooter();
    footer.querySelector(".ccc-core-footer-selection")?.remove();
    footer.querySelector(".ccc-core-footer-tools")?.remove();
    const back=footer.querySelector("#cccCoreFooterBack");
    if(back)back.hidden=isCCCDashboard();
    if(this.toolConfig&&!isCCCDashboard()){
      const tools=document.createElement("div");
      tools.className="ccc-core-footer-tools";
      if(this.toolConfig.help){
        const help=document.createElement("button");
        help.type="button";
        help.className="ccc-core-footer-tool ccc-core-footer-help";
        help.innerHTML='<span aria-hidden="true">?</span><small>Hjälp</small>';
        help.addEventListener("click",()=>this.toolConfig?.onHelp?.());
        tools.append(help);
      }
      if(this.toolConfig.select){
        const select=document.createElement("button");
        select.type="button";
        select.className="ccc-core-footer-tool ccc-core-footer-select";
        select.innerHTML='<span aria-hidden="true">✓</span><small>Välj</small>';
        select.addEventListener("click",()=>this.toolConfig?.onSelect?.());
        tools.append(select);
      }
      footer.insertBefore(tools,back||null);
    }
  },
  showDefault(){this.renderDefault();},
  setTools(config=null){this.toolConfig=config;this.renderDefault();},
  clearTools(){this.toolConfig=null;this.renderDefault();},
  showSelection({count=0,onDelete,onCancel}={}){
    const footer=this.el||ensureCCCFooter();
    footer.querySelector(".ccc-core-footer-tools")?.remove();
    const back=footer.querySelector("#cccCoreFooterBack");
    if(back)back.hidden=true;
    let bar=footer.querySelector(".ccc-core-footer-selection");
    if(!bar){
      bar=document.createElement("div");
      bar.className="ccc-core-footer-selection";
      bar.innerHTML=`<button class="ccc-footer-cancel" type="button">Avbryt</button><span class="ccc-footer-selection-count" aria-live="polite"></span><button class="ccc-footer-delete" type="button" aria-label="Ta bort markerade">🗑 <span>Ta bort</span></button>`;
      footer.appendChild(bar);
    }
    bar.querySelector(".ccc-footer-selection-count").textContent=`${count} markerad${count===1?"":"e"}`;
    const d=bar.querySelector(".ccc-footer-delete");
    d.disabled=count<1;
    d.onclick=()=>onDelete?.();
    bar.querySelector(".ccc-footer-cancel").onclick=()=>onCancel?.();
  },
  showUndo({count=1,onUndo}={}){
    const footer=this.el||ensureCCCFooter();
    footer.querySelector(".ccc-core-footer-tools")?.remove();
    footer.querySelector(".ccc-core-footer-selection")?.remove();
    const back=footer.querySelector("#cccCoreFooterBack");
    if(back)back.hidden=true;
    let undo=footer.querySelector(".ccc-core-footer-undo");
    if(!undo){
      undo=document.createElement("div");
      undo.className="ccc-core-footer-undo";
      undo.innerHTML=`<span class="ccc-footer-undo-copy"></span><button class="ccc-footer-undo-btn" type="button">Ångra</button>`;
      footer.appendChild(undo);
    }
    undo.querySelector(".ccc-footer-undo-copy").textContent=count===1?"1 utkast borttaget":`${count} utkast borttagna`;
    undo.querySelector(".ccc-footer-undo-btn").onclick=()=>onUndo?.();
  }
};
window.CCC_CORE={applyTheme,setProfileMenu,setLogoutDialog,header:CCCHeader,footer:CCCFooter};
document.dispatchEvent(new CustomEvent("ccc:core-ready",{detail:{header:CCCHeader}}));

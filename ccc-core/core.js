// CCC Core JS — v2.8.43
  // v2.10.30 – central user-facing entity terminology
  if (!window.CCC_TERMINOLOGY) {
    const terminologyScript = document.createElement("script");
    terminologyScript.src = new URL("terminology.js?v=2.10.32", import.meta.url).href;
    terminologyScript.addEventListener("load",()=>window.CCC_TERMINOLOGY?.apply?.(),{once:true});
    document.head.appendChild(terminologyScript);
  }

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

// Ett fysiskt tryck får aldrig konsumeras som två bakåtsteg när en vy eller
// sida hinner bytas under fingret. Spärren delas av header och footer och
// överlever även en kort sidnavigation via sessionStorage.
const CCC_BACK_GUARD_KEY="ccc-core-back-guard-until";
let cccBackGuardUntil=0;
function runCCCNavigationOnce(action){
  const now=Date.now();
  let stored=0;
  try{stored=Number(sessionStorage.getItem(CCC_BACK_GUARD_KEY)||0);}catch(_){ }
  if(now<Math.max(cccBackGuardUntil,stored))return false;
  cccBackGuardUntil=now+1200;
  try{sessionStorage.setItem(CCC_BACK_GUARD_KEY,String(cccBackGuardUntil));}catch(_){ }
  action?.();
  return true;
}
function dispatchCCCBackOnce(){
  return runCCCNavigationOnce(()=>document.dispatchEvent(new CustomEvent("ccc:header-back")));
}
function navigateCCCDashboardOnce(){
  return runCCCNavigationOnce(()=>{location.href=new URL("./dashboard/index.html",import.meta.url).href;});
}

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
    back.addEventListener("click",dispatchCCCBackOnce);
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

// ==========================================================
// CCC SWIPE CORE v5 — v2.10.94
// Gemensam fysik för paginerade CCC-arbetsytor. Anpassa bild
// är känslofacit: direkt fingerföljning, motstånd först nära
// ytterläget och en lugn, kort landning efter släpp.
// Free-varianten äger flytande karuseller: native touch-momentum,
// fri bromsning och ingen tvingad sidlandning.
// ==========================================================
const CCCSwipe={
  profile:Object.freeze({
    activationPx:12,
    axisRatio:1.25,
    thresholdRatio:.24,
    minThresholdPx:72,
    snapMs:580,
    easing:"cubic-bezier(.20,.58,.16,1)",
    edgeResistance:.24,
    outerStartRatio:.78,
    outerDragFactor:.72,
    maxDragRatio:1.08
  }),
  transition(property="transform"){
    return `${property} ${this.profile.snapMs}ms ${this.profile.easing}`;
  },
  isHorizontal(dx,dy){
    return Math.abs(dx)>this.profile.activationPx&&Math.abs(dx)>Math.abs(dy)*this.profile.axisRatio;
  },
  offset(dx,width,{atEdge=false}={}){
    const safeWidth=Math.max(1,width);
    const sign=Math.sign(dx)||1;
    const raw=Math.min(Math.abs(dx),safeWidth*this.profile.maxDragRatio);
    if(atEdge)return sign*Math.min(raw*this.profile.edgeResistance,safeWidth*.18);
    const outerStart=safeWidth*this.profile.outerStartRatio;
    const followed=raw<=outerStart
      ? raw
      : outerStart+(raw-outerStart)*this.profile.outerDragFactor;
    return sign*followed;
  },
  shouldCommit(dx,width){
    const threshold=Math.max(this.profile.minThresholdPx,Math.max(1,width)*this.profile.thresholdRatio);
    return Math.abs(dx)>threshold;
  },
  ensureViewport(element){
    if(!element)return null;
    if(element.parentElement?.classList.contains("ccc-swipe-viewport"))return element.parentElement;
    const parent=element.parentNode;
    if(!parent)return null;
    const viewport=document.createElement("div");
    viewport.className="ccc-swipe-viewport";
    parent.insertBefore(viewport,element);
    viewport.appendChild(element);
    return viewport;
  },
  bindFree(element,{centerWhenFits=true}={}){
    if(!element)return null;
    if(element.dataset.cccFreeSwipeBound==="1")return element;
    element.dataset.cccFreeSwipeBound="1";
    element.classList.add("ccc-free-swipe");
    element.classList.toggle("ccc-free-swipe--center",centerWhenFits);

    const syncOverflow=()=>{
      const overflowing=element.scrollWidth>element.clientWidth+2;
      element.classList.toggle("is-overflowing",overflowing);
      if(!overflowing)element.scrollLeft=0;
    };
    requestAnimationFrame(syncOverflow);
    if("ResizeObserver" in window){
      const observer=new ResizeObserver(syncOverflow);
      observer.observe(element);
      [...element.children].forEach(child=>observer.observe(child));
    }else window.addEventListener("resize",syncOverflow,{passive:true});

    let drag=null;
    let momentumFrame=0;
    let suppressClickUntil=0;
    const stopMomentum=()=>{if(momentumFrame)cancelAnimationFrame(momentumFrame);momentumFrame=0;};
    const finishMouseDrag=event=>{
      if(!drag||event.pointerId!==drag.id)return;
      const velocity=drag.velocity;
      if(drag.moved)suppressClickUntil=performance.now()+140;
      drag=null;
      element.classList.remove("is-dragging");
      try{element.releasePointerCapture(event.pointerId);}catch(_){ }
      let speed=velocity;
      let previous=performance.now();
      const coast=now=>{
        const elapsed=Math.min(32,now-previous);
        previous=now;
        speed*=Math.pow(.92,elapsed/16.67);
        element.scrollLeft-=speed*elapsed;
        if(Math.abs(speed)>.015)momentumFrame=requestAnimationFrame(coast);
        else momentumFrame=0;
      };
      if(Math.abs(speed)>.04)momentumFrame=requestAnimationFrame(coast);
    };
    element.addEventListener("pointerdown",event=>{
      if(event.pointerType!=="mouse"||event.button!==0||!element.classList.contains("is-overflowing"))return;
      stopMomentum();
      drag={id:event.pointerId,x:event.clientX,time:performance.now(),velocity:0,moved:false};
      element.classList.add("is-dragging");
      element.setPointerCapture(event.pointerId);
    });
    element.addEventListener("pointermove",event=>{
      if(!drag||event.pointerId!==drag.id)return;
      const now=performance.now();
      const dx=event.clientX-drag.x;
      const elapsed=Math.max(1,now-drag.time);
      element.scrollLeft-=dx;
      if(Math.abs(dx)>2)drag.moved=true;
      drag.velocity=dx/elapsed;
      drag.x=event.clientX;
      drag.time=now;
      event.preventDefault();
    });
    element.addEventListener("pointerup",finishMouseDrag);
    element.addEventListener("pointercancel",finishMouseDrag);
    element.addEventListener("click",event=>{
      if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}
    },true);
    element.addEventListener("dragstart",event=>event.preventDefault());
    return element;
  }
};

// Gemensam fysisk tryckkänsla för Dashboard och modulernas välkomstkort.
// Vy-/sidnavigation och CCC:s egen kameravy fördröjs. Den rena filväljaren
// behåller webbläsarens direkta, betrodda användartryck.
const CCCPress={
  delayMs:320,
  install(){
    if(document.documentElement.dataset.cccPressBound)return;
    document.documentElement.dataset.cccPressBound="1";
    document.addEventListener("click",event=>{
      const card=event.target?.closest?.(".ccc-module-home .ccc-module-card");
      if(!card||card.disabled||card.getAttribute("aria-disabled")==="true")return;
      card.classList.add("is-ccc-pressed");
      window.setTimeout(()=>card.classList.remove("is-ccc-pressed"),this.delayMs+90);
      if(!card.matches("a[href],[data-ccc-press-delay]"))return;
      if(card.dataset.cccPressReplay==="1"){
        delete card.dataset.cccPressReplay;
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      if(card.dataset.cccPressPending==="1")return;
      card.dataset.cccPressPending="1";
      const delay=matchMedia("(prefers-reduced-motion: reduce)").matches?0:this.delayMs;
      window.setTimeout(()=>{
        delete card.dataset.cccPressPending;
        if(card.matches("a[href]")){
          window.location.assign(card.href);
          return;
        }
        card.dataset.cccPressReplay="1";
        card.click();
      },delay);
    },true);
  }
};
CCCPress.install();

const initialHeader={
  back:document.body?.dataset.cccHeaderBack==="true",
  settings:document.body?.dataset.cccHeaderSettings==="true"
};
ensureCCCHeader();
CCCHeader.set(window.__CCC_HEADER_PENDING__||initialHeader);




// ==========================================================
// CCC FOOTER CORE v6 — v2.9.47
// Footern är en permanent del av CCC:s grundlayout.
// Dashboard visar samma footer-yta men utan knapp/innehåll.
// Moduler använder samma ccc:header-back-event som headerpilen.
// ==========================================================
function isCCCDashboard(){
  return /\/ccc-core\/dashboard\/?(?:index\.html)?$/i.test(location.pathname);
}
function cccHelpEnabled(){return localStorage.getItem("ccc-help-tips-enabled")!=="0";}


function ensureCCCFooter(){
  let footer=document.querySelector("#cccCoreFooter");
  if(!footer){
    footer=document.createElement("footer");
    footer.id="cccCoreFooter";
    footer.className="ccc-core-footer";
    footer.setAttribute("aria-label","Snabbnavigation");
    footer.innerHTML=`
      <button id="cccCoreFooterBack" class="ccc-core-footer-back" type="button">
        <span class="ccc-core-footer-back-icon" aria-hidden="true">${CCC_HEADER_ICONS.back}</span>
        <span class="ccc-core-footer-back-copy">
          <strong>Tillbaka</strong>
          <small>Till föregående steg</small>
        </span>
      </button>`;
    document.body.appendChild(footer);
  }

  const dashboard=isCCCDashboard();
  footer.classList.toggle("ccc-core-footer--empty",dashboard&&!cccHelpEnabled());

  const back=footer.querySelector("#cccCoreFooterBack");
  if(back){
    back.hidden=dashboard;
    if(!back.dataset.cccBound){
      back.dataset.cccBound="1";
      back.addEventListener("click",()=>{
        if(CCCHeader.state.back){
          dispatchCCCBackOnce();
        }else{
          navigateCCCDashboardOnce();
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
    const showCoreHelp=cccHelpEnabled();
    if(this.toolConfig||showCoreHelp){
      const tools=document.createElement("div");
      tools.className="ccc-core-footer-tools";
      if(showCoreHelp){
        const help=document.createElement("button");
        help.type="button";
        help.className="ccc-core-footer-tool ccc-core-footer-help";
        help.innerHTML='<span class="ccc-footer-tool-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 0 1 4.8 1c0 2-2.5 2.2-2.5 4"/><path d="M12 17.6h.01"/></svg></span><small>Hjälp</small>';
        help.addEventListener("click",()=>window.CCC_CORE?.help?.open?.());
        tools.append(help);
      }
      if(this.toolConfig?.settings){
        const settings=document.createElement("button");
        settings.type="button";
        settings.className="ccc-core-footer-tool ccc-core-footer-settings";
        settings.innerHTML=`<span aria-hidden="true">⚙</span><small>${this.toolConfig.settingsLabel||"Inställningar"}</small>`;
        settings.addEventListener("click",()=>this.toolConfig?.onSettings?.());
        tools.append(settings);
      }
      if(this.toolConfig?.select){
        const select=document.createElement("button");
        select.type="button";
        select.className="ccc-core-footer-tool ccc-core-footer-select";
        select.innerHTML='<span aria-hidden="true">✓</span><small>Välj</small>';
        select.addEventListener("click",()=>this.toolConfig?.onSelect?.());
        tools.append(select);
      }
      if(this.toolConfig?.forward){
        const forward=document.createElement("button");
        forward.type="button";
        forward.className="ccc-core-footer-tool ccc-core-footer-forward";
        const icon=this.toolConfig.forwardIcon||"→";
        const label=this.toolConfig.forwardLabel||"Vidare";
        forward.innerHTML=`<span aria-hidden="true">${icon}</span><small>${label}</small>`;
        forward.addEventListener("click",()=>this.toolConfig?.onForward?.());
        tools.append(forward);
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

// ==========================================================
// CCC CONTEXT HELP v2 — v2.10.122
// En enda Core-ruta för hjälp i alla aktiva vyer. Moduler kan
// registrera finare innehåll, men äger inte dialogens geometri,
// hjälpknappen eller länken till lokala inställningar. Hjälpen
// öppnas endast aktivt med ? i Core-footern.
// ==========================================================
const CCC_HELP_ENABLED_KEY="ccc-help-tips-enabled";
const CCC_HELP_CONTENT={
  dashboard:{
    homeView:{title:"Dashboard",intro:"Här väljer du vilken del av CCC du vill arbeta i.",points:["Vision skapar och kompletterar objekt.","Publicera förbereder, väljer kanal och publicerar.","Mer samlar övriga verktyg."],settings:["Hjälp och tips","Vilka verktyg som ska visas när funktionen byggs ut"]},
    addImagesView:{title:"Lägg till bilder",intro:"Välj hur bilder ska hämtas till den lokala arbetsytan.",points:["Ta ett nytt foto eller välj befintliga bilder.","Inget publiceras automatiskt."],settings:["Standardval för bilder och kamera"]},
    cameraSessionView:{title:"Fotosession",intro:"Fortsätt fotografera eller avsluta den aktuella serien.",points:["Ångra senaste tar bara bort den senast tillagda bilden.","Klar sparar sessionen lokalt."],settings:["Kamerans standardval"]},
    imagesView:{title:"Mina bilder",intro:"Här hanterar du bilder som finns lokalt på enheten.",points:["Markera bilder för nästa steg.","Öppna en bild för att komplettera uppgifter."],settings:["Visning och standardfält"]},
    imageDetailView:{title:"Bildens uppgifter",intro:"Kontrollera och komplettera uppgifterna för den valda bilden.",points:["Spara behåller ändringarna lokalt.","Tillbaka återgår till samma bildlista."],settings:["Vilka uppgifter som visas"]},
    moreView:{title:"Fler verktyg",intro:"Här finns funktioner som inte behöver ligga på Dashboard.",points:["Välj ett verktyg för att öppna dess egen arbetsyta."],settings:["Synliga verktyg"]}
  },
  vision:{
    start:{title:"Välkommen till Vision",intro:"Skapa nya objekt från kamera eller bilder på enheten.",points:["Ta ett foto startar CCC-kameran.","Fortsätt fotosession återöppnar sparade objekt."],settings:["AI och lokalt lärande","Kostnadsvisning"]},
    workspace:{title:"Välj objekt",intro:"Välj vilket objekt i fotosessionen du vill arbeta vidare med.",points:["Svep mellan bildserier när det finns fler objekt.","Granska & komplettera öppnar markerat objekt."],settings:["AI och lokalt lärande"]},
    edit:{title:"Granska & komplettera",intro:"Kontrollera bilder, rubrik, pris och beskrivning för objektet.",points:["Ändringar sparas automatiskt.","AI-analys är frivillig.","Klar eller Tillbaka återgår till rätt ursprung."],settings:["AI-verktyg","Lokalt lärande","Kostnadsvisning"]},
    suggestion:{title:"Vision-förslag",intro:"Granska CCC:s förslag innan det används.",points:["Godkänn förslaget eller välj Ändra.","Du kan lägga till fler bilder på samma objekt."],settings:["Automatisk AI-analys","Lokalt lärande"]},
    done:{title:"Färdiga objekt",intro:"Objekten är sparade och kan skickas vidare till Publicera.",points:["Publicera öppnar publiceringsflödet.","Fota fler fortsätter samma arbetspass."],settings:["AI och lokalt lärande"]},
    camera:{title:"CCC-kameran",intro:"Fotografera ett eller flera objekt utan att lämna CCC.",points:["Välj zoom och ta bilden.","Efteråt kan du ta om, fortsätta eller expresspublicera."],settings:["Kamerans framtida standardval"]}
  },
  publish:{
    startView:{title:"Publicera",intro:"Välj utkast, kanal eller hantera sådant som redan publicerats.",points:["Förbered öppnar lokala utkast.","Historik och publicerade bilder finns kvar lokalt."],settings:["Standardvisning på hemsidan"]},
    gridView:{title:"Förbered för publicering",intro:"Välj och kontrollera de objekt som ska gå vidare.",points:["Tryck på ett objekt för detaljvy.","Svep mellan sidor när fler objekt finns."],settings:["Standardvisning på hemsidan"]},
    detailView:{title:"Kontrollera objekt",intro:"Granska objektets bild innan publicering.",points:["Anpassa bild öppnar manuell justering.","Publicera går till sista kontrollen."],settings:["Standardvisning på hemsidan"]},
    cropView:{title:"Anpassa bild",intro:"Flytta och zooma bilden manuellt tills den känns rätt.",points:["Återställ visar hela originalbilden centrerad.","Spara och Tillbaka behåller samma returväg."],settings:["Bildanpassning när fler val tillkommer"]},
    channelView:{title:"Välj objekt",intro:"Markera vilka objekt som ska publiceras i den valda kanalen.",points:["Tryck för att markera eller avmarkera.","Fortsätt när urvalet är klart."],settings:["Standardvisning på hemsidan"]},
    channelTargetsView:{title:"Välj kanal",intro:"Välj var objekten ska publiceras.",points:["Låsta kanaler är ännu inte anslutna.","Ett aktivt val krävs innan publicering."],settings:["Anslutna kanaler när funktionen byggs ut"]},
    channelConfirmView:{title:"Sista kontrollen",intro:"Kontrollera objekt, verktyg, kanal och visning före publicering.",points:["Gul ram visar vilket objekt verktygen arbetar med.","Alla objekt i raden publiceras även om bara ett är markerat."],settings:["Vilka uppgifter Container13 visar"]},
    publishedView:{title:"Publicerat och historik",intro:"Se vad som ligger ute och vad som finns sparat lokalt.",points:["Du kan ta bort innehåll från hemsidan utan att radera lokala original.","Historiken visar tidigare publiceringar."],settings:["Standardvisning på hemsidan"]}
  },
  settings:{default:{title:"Inställningar",intro:"Här anpassar du den aktuella modulen och CCC:s hjälpsystem.",points:["Ändringar sparas på den här enheten.","Tillbaka återgår till vyn du kom från."],settings:[]}}
};

const CCCHelp={
  context:null,
  enabled(){return localStorage.getItem(CCC_HELP_ENABLED_KEY)!=="0";},
  module(){
    const path=location.pathname;
    if(path.includes("/vision/"))return "vision";
    if(path.includes("/publish/"))return "publish";
    if(path.includes("/settings/"))return "settings";
    return "dashboard";
  },
  detect(){
    const module=this.module();
    if(module==="dashboard")return [...document.querySelectorAll(".dashboard-view")].find(el=>!el.hidden&&el.classList.contains("is-active"))?.id||[...document.querySelectorAll(".dashboard-view")].find(el=>!el.hidden)?.id||"homeView";
    if(module==="publish")return [...document.querySelectorAll(".publish-view")].find(el=>!el.hidden)?.id||"startView";
    if(module==="vision"){
      if(!document.querySelector("#cameraOverlay")?.hidden)return "camera";
      if(!document.querySelector("#editCard")?.hidden)return "edit";
      if(!document.querySelector("#visionCard")?.hidden)return "suggestion";
      if(!document.querySelector("#seriesDoneCard")?.hidden)return "done";
      if(!document.querySelector("#visionStartHome")?.hidden)return "start";
      return "workspace";
    }
    return "default";
  },
  setContext(key){
    const next=`${this.module()}:${key||this.detect()}`;
    if(this.context===next)return;
    this.context=next;
    CCCFooter?.renderDefault?.();
  },
  data(){
    const [module,key]=(this.context||`${this.module()}:${this.detect()}`).split(":");
    return {module,key,content:CCC_HELP_CONTENT[module]?.[key]||CCC_HELP_CONTENT[module]?.default||{title:"Hjälp",intro:"Här arbetar du vidare i CCC.",points:[],settings:[]}};
  },
  ensureDialog(){
    let dialog=document.querySelector("#cccContextHelpDialog");
    if(dialog)return dialog;
    dialog=document.createElement("div");
    dialog.id="cccContextHelpDialog";
    dialog.className="ccc-help-dialog";
    dialog.hidden=true;
    dialog.innerHTML=`<section class="ccc-help-panel" role="dialog" aria-modal="true" aria-labelledby="cccContextHelpTitle"><button class="ccc-help-close" type="button" aria-label="Stäng hjälp">×</button><div class="ccc-help-mark" aria-hidden="true">?</div><h2 id="cccContextHelpTitle"></h2><p class="ccc-help-intro"></p><div class="ccc-help-points"></div><section class="ccc-help-settings"><h3>Du kan anpassa den här vyn</h3><ul></ul><button class="ccc-help-open-settings" type="button">Öppna inställningar för vyn</button></section></section>`;
    document.body.append(dialog);
    dialog.querySelector(".ccc-help-close").onclick=()=>this.close();
    dialog.addEventListener("click",event=>{if(event.target===dialog)this.close();});
    dialog.querySelector(".ccc-help-open-settings").onclick=()=>this.openSettings();
    return dialog;
  },
  open(){
    if(!this.enabled())return;
    this.context=`${this.module()}:${this.detect()}`;
    const {module,key,content}=this.data();
    const dialog=this.ensureDialog();
    dialog.querySelector("h2").textContent=content.title;
    dialog.querySelector(".ccc-help-intro").textContent=content.intro;
    dialog.querySelector(".ccc-help-points").innerHTML=(content.points||[]).map(point=>`<p><span aria-hidden="true">✓</span>${point}</p>`).join("");
    const settings=dialog.querySelector(".ccc-help-settings");
    settings.hidden=!(content.settings||[]).length;
    settings.querySelector("ul").innerHTML=(content.settings||[]).map(item=>`<li>${item}</li>`).join("");
    dialog.hidden=false;
    dialog.querySelector(".ccc-help-close").focus({preventScroll:true});
  },
  close(){const dialog=document.querySelector("#cccContextHelpDialog");if(dialog)dialog.hidden=true;},
  openSettings(){
    const {module}=this.data();
    this.close();
    if(module==="vision"||module==="publish"){
      document.dispatchEvent(new CustomEvent("ccc:header-settings"));
      return;
    }
    const target=new URL("./settings/index.html",import.meta.url);
    target.searchParams.set("module",module==="settings"?"dashboard":module);
    location.href=target.href;
  },
  install(){
    const sync=()=>this.setContext(this.detect());
    new MutationObserver(sync).observe(document.body,{subtree:true,attributes:true,attributeFilter:["hidden","class"]});
    document.addEventListener("ccc:header-back",event=>{
      const dialog=document.querySelector("#cccContextHelpDialog");
      if(dialog&&!dialog.hidden){event.stopImmediatePropagation();this.close();}
    },true);
    document.addEventListener("keydown",event=>{if(event.key==="Escape")this.close();});
    setTimeout(sync,250);
  }
};
window.CCC_CORE={
  applyTheme,setProfileMenu,setLogoutDialog,header:CCCHeader,footer:CCCFooter,
  swipe:CCCSwipe,press:CCCPress,help:CCCHelp,
  navigation:{back:dispatchCCCBackOnce,dashboard:navigateCCCDashboardOnce}
};
CCCHelp.install();
CCCFooter.renderDefault();
document.dispatchEvent(new CustomEvent("ccc:core-ready",{detail:{header:CCCHeader}}));

window.__CCC_HEADER_PENDING__={back:true,settings:true};
import { auth } from "../auth/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
onAuthStateChanged(auth,(user)=>{if(!user)window.location.href="../auth/index.html";});

const $=(s)=>document.querySelector(s);
const DB_NAME="ccc-local-workspace", DB_VERSION=3, STORE_NAME="images", FILE_STORE="vision-files";
let items=[],activeIndex=0,objectUrls=[];
const DRAFTS_PER_PAGE=9;
let draftPage=0,draftGridGesture=null;
let draftPreviewGesture=null,draftPreviewSuppressClick=false;
let cropImage=null,cropState=null,pointer=null;
let activeItemId=null;
let recentlyAdaptedItemId=null;
let draftSelectionMode=false;const selectedDraftIds=new Set();
let pendingDraftDelete=null;
const channelSelectedIds=new Set();
let container13ChannelSelected=false;
let channelSelectPage=0;
const CHANNEL_PER_PAGE=9;
const decodedImageCache=new Map();
const MAX_DECODED_CACHE=3;

function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE_NAME)){const s=db.createObjectStore(STORE_NAME,{keyPath:"id"});s.createIndex("createdAt","createdAt");}if(!db.objectStoreNames.contains("sessions"))db.createObjectStore("sessions",{keyPath:"id"});if(!db.objectStoreNames.contains(FILE_STORE)){const f=db.createObjectStore(FILE_STORE,{keyPath:"id"});f.createIndex("createdAt","createdAt");}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error("IndexedDB-uppgraderingen blockerades av en annan öppen CCC-flik."));});}
async function getAll(){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readonly"),r=tx.objectStore(STORE_NAME).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function getLatestVisionSession(){const db=await openDb();return new Promise((resolve,reject)=>{if(!db.objectStoreNames.contains("sessions")){db.close();resolve(null);return;}const tx=db.transaction("sessions","readonly"),r=tx.objectStore("sessions").get("active-vision-session");r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function visionSessionDrafts(){
  const session=await getLatestVisionSession();
  const savedItems=Array.isArray(session?.items)?session.items:[];
  const drafts=[];
  for(const saved of savedItems){
    if(!saved?.id||!saved?.originalFileKey)continue;
    const originalBlob=await getSourceFile(saved.originalFileKey);
    if(!originalBlob)continue;
    const fields=saved.editedFields||saved.visionResult?.fields||{};
    drafts.push({
      id:saved.id,
      originalFileKey:saved.originalFileKey,
      originalBlob,
      createdAt:saved.createdAt||session.savedAt||Date.now(),
      source:"vision-session",
      imageProcessingState:"original",
      readyToPublish:true,
      approved:!!saved.approved,
      title:String(fields.title||saved.visionResult?.summaryTitle||"").trim(),
      brand:String(fields.brand||fields.manufacturer||saved.visionResult?.summaryBrand||"").trim(),
      size:String(fields.size||"").trim(),
      price:String(fields.price||"").trim(),
      description:String(fields.description||"").trim(),
      fields
    });
  }
  return drafts;
}

async function put(record){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readwrite");tx.objectStore(STORE_NAME).put(record);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}async function deleteDraftIds(ids){const wanted=new Set(ids);if(!wanted.size)return;const db=await openDb();await new Promise((resolve,reject)=>{const stores=[STORE_NAME,"sessions",FILE_STORE].filter(n=>db.objectStoreNames.contains(n)),tx=db.transaction(stores,"readwrite"),images=tx.objectStore(STORE_NAME);wanted.forEach(id=>images.delete(id));if(stores.includes("sessions")){const sessions=tx.objectStore("sessions"),req=sessions.get("active-vision-session");req.onsuccess=()=>{const s=req.result;if(!s||!Array.isArray(s.items))return;const removed=s.items.filter(i=>wanted.has(i.id));s.items=s.items.filter(i=>!wanted.has(i.id));s.savedAt=Date.now();sessions.put(s);if(stores.includes(FILE_STORE)){const files=tx.objectStore(FILE_STORE);removed.forEach(i=>{if(i.originalFileKey)files.delete(i.originalFileKey);});}};}tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)};tx.onabort=()=>{db.close();reject(tx.error||new Error("Kunde inte ta bort utkast."))};});}
async function getSourceFile(key){if(!key)return null;const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(FILE_STORE,"readonly"),r=tx.objectStore(FILE_STORE).get(key);r.onsuccess=()=>resolve(r.result?.blob||null);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function hydrateOriginal(record){if(record.originalBlob||!record.originalFileKey)return record;const blob=await getSourceFile(record.originalFileKey);return blob?{...record,originalBlob:blob}:record;}
function persistenceRecord(item){const record={...item};delete record.thumbUrl;delete record.fullUrl;if(record.originalFileKey)delete record.originalBlob;return record;}
function url(blob){const u=URL.createObjectURL(blob);objectUrls.push(u);return u;}
function dataUrl(blob){return new Promise((resolve,reject)=>{if(!blob){resolve("");return;}const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||""));reader.onerror=()=>reject(reader.error||new Error("Kunde inte läsa bildförhandsvisningen."));reader.readAsDataURL(blob);});}
async function previewSrc(record){
  const blob=record.publishBlob||record.thumbnailBlob||record.originalBlob;
  if(!blob)return "";
  try{return await dataUrl(blob);}catch(error){console.warn("[CCC Publicera] Data-URL misslyckades, använder blob-URL",error);return url(blob);}
}
function touchDecodedCache(key,image){
  if(!key||!image)return image;
  if(decodedImageCache.has(key))decodedImageCache.delete(key);
  decodedImageCache.set(key,image);
  while(decodedImageCache.size>MAX_DECODED_CACHE){
    const oldest=decodedImageCache.keys().next().value;
    decodedImageCache.delete(oldest);
  }
  return image;
}
async function preloadItem(index){
  if(!items.length)return null;
  const normalized=(index+items.length)%items.length;
  const item=items[normalized];
  if(!item)return null;
  const key=item.id||String(normalized);
  if(decodedImageCache.has(key)){
    const cached=decodedImageCache.get(key);
    touchDecodedCache(key,cached);
    return cached;
  }
  const src=item.fullUrl||item.thumbUrl||await previewSrc(item);
  if(!src)return null;
  return new Promise(resolve=>{
    const image=new Image();
    image.decoding="async";
    image.onload=()=>resolve(touchDecodedCache(key,image));
    image.onerror=()=>resolve(null);
    image.src=src;
  });
}
function preloadNeighbors(index){
  if(!items.length)return;
  preloadItem(index).catch(()=>{});
  if(items.length>1){
    preloadItem(index-1).catch(()=>{});
    preloadItem(index+1).catch(()=>{});
  }
}
function title(item,index){return item.title?.trim()||item.fields?.title?.trim()||`Plagg ${index+1}`;}
function resetViewScroll(view){
  const el=$("#"+view);
  if(!el)return;
  try{el.scrollTop=0;}catch(_){}
  const scrollChild=el.querySelector(".draft-grid,.publish-scroll,.crop-view");
  if(scrollChild)try{scrollChild.scrollTop=0;}catch(_){}
}
let currentPublishView="startView";
function setPublishHeader(view){
  const state={back:true,settings:true};
  window.__CCC_HEADER_PENDING__=state;
  window.CCC_CORE?.header?.set(state);
}
function show(view){if(view!=="gridView"&&draftSelectionMode){draftSelectionMode=false;selectedDraftIds.clear();}
  currentPublishView=view;
  ["startView","gridView","channelView","channelTargetsView","channelConfirmView","publishedView","detailView","cropView"].forEach(id=>$("#"+id).hidden=id!==view);
  setPublishHeader(view);
  configureFooterForView(view);
  requestAnimationFrame(()=>{
    resetViewScroll(view);
    const active=$("#"+view);
    active?.scrollIntoView?.({block:"start",inline:"nearest"});
  });
}

// CCC v2.9.33 – egen back-swipe pausad.
// Enhandsnavigation testas i stället med fast tumvänligt nederfält.

function ensureDraftGridUi(){
  if(document.getElementById("cccDraftGridCompactStyles"))return;
  const style=document.createElement("style");
  style.id="cccDraftGridCompactStyles";
  style.textContent=`
    #draftGrid.draft-grid{gap:8px!important;touch-action:pan-y;overflow:hidden;align-content:start;min-height:min(66vw,420px)}
    #draftGrid.draft-grid.grid-1{grid-template-columns:minmax(0,1fr)!important}
    #draftGrid.draft-grid.grid-2{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    #draftGrid.draft-grid.grid-4{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    #draftGrid.draft-grid.grid-9{grid-template-columns:repeat(3,minmax(0,1fr))!important}
    #draftGrid.draft-grid.grid-1 .draft-card{width:min(100%,420px);justify-self:center}
    #draftGrid .draft-card{position:relative!important;aspect-ratio:1/1!important;min-width:0!important;min-height:0!important;border-radius:12px!important;overflow:hidden!important;padding:0!important;margin:0!important;-webkit-touch-callout:none!important;-webkit-tap-highlight-color:transparent!important;-webkit-user-select:none!important;user-select:none!important;appearance:none!important;-webkit-appearance:none!important}
    #draftGrid .draft-card img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;pointer-events:none!important;-webkit-user-drag:none!important;-webkit-user-select:none!important;user-select:none!important;-webkit-tap-highlight-color:transparent!important}
    .ccc-draft-preview-layer{position:fixed;inset:0;z-index:9999;pointer-events:none;background:rgba(5,7,12,.58);opacity:0;transition:opacity .16s ease}
    .ccc-draft-preview-layer.is-open{opacity:1}
    .ccc-draft-preview-image{position:fixed;z-index:10000;pointer-events:none;object-fit:contain;background:#0b0d13;border-radius:12px;box-shadow:0 18px 52px rgba(0,0,0,.55);transform-origin:center center;transform:translate3d(var(--ccc-preview-tx),var(--ccc-preview-ty),0) scale(var(--ccc-preview-sx),var(--ccc-preview-sy));will-change:transform,border-radius;transition:transform .36s cubic-bezier(.22,.7,.24,1),border-radius .36s ease}.ccc-draft-preview-image.is-open{transform:translate3d(0,0,0) scale(1,1);border-radius:16px}
    #draftGrid .draft-card-caption{display:none!important}
    .ccc-draft-pager{display:flex;align-items:center;justify-content:center;gap:7px;margin:16px auto 4px;min-height:12px}
    .ccc-draft-pager[hidden]{display:none!important}
    .ccc-draft-page-dot{width:7px;height:7px;border:0;border-radius:999px;padding:0;background:rgba(210,214,225,.42)}
    .ccc-draft-page-dot[aria-current="true"]{background:#e0b14b;transform:scale(1.18)}
    button:focus:not(:focus-visible),a:focus:not(:focus-visible){outline:none!important;box-shadow:none!important}
    button:focus-visible,a:focus-visible{outline:2px solid #e0b14b!important;outline-offset:3px!important}
  `;
  document.head.append(style);
}
function clearDraftPreviewGesture(){
  if(draftPreviewGesture?.timer)clearTimeout(draftPreviewGesture.timer);
  draftPreviewGesture=null;
}
function closeDraftPreview(){
  const g=draftPreviewGesture;
  if(!g?.preview)return clearDraftPreviewGesture();
  const {layer,preview}=g.preview;
  layer.classList.remove("is-open");
  preview.classList.remove("is-open");
  const cleanup=()=>{layer.remove();preview.remove();};
  preview.addEventListener("transitionend",cleanup,{once:true});
  window.setTimeout(cleanup,420);
  draftPreviewGesture=null;
}
function openDraftPreview(button,img){
  if(!draftPreviewGesture||draftPreviewGesture.button!==button)return;
  const rect=button.getBoundingClientRect();
  const vw=window.innerWidth,vh=window.innerHeight;
  const maxW=Math.min(vw-32,520),maxH=Math.min(vh-120,680);
  const ratio=(img.naturalWidth&&img.naturalHeight)?img.naturalWidth/img.naturalHeight:1;
  let w=maxW,h=w/ratio;
  if(h>maxH){h=maxH;w=h*ratio;}
  const targetLeft=Math.round((vw-w)/2),targetTop=Math.round((vh-h)/2);
  const layer=document.createElement("div");
  layer.className="ccc-draft-preview-layer";
  const preview=document.createElement("img");
  preview.className="ccc-draft-preview-image";
  preview.alt=img.alt||"Förhandsvisning";
  preview.src=img.currentSrc||img.src;
  // Keep one fixed target geometry and animate only transform. This prevents the
  // final one-frame snap seen when left/top/width/height were animated separately.
  preview.style.left=`${targetLeft}px`;
  preview.style.top=`${targetTop}px`;
  preview.style.width=`${Math.round(w)}px`;
  preview.style.height=`${Math.round(h)}px`;
  const sx=rect.width/w,sy=rect.height/h;
  const tx=rect.left-targetLeft+(rect.width-w)/2;
  const ty=rect.top-targetTop+(rect.height-h)/2;
  preview.style.setProperty("--ccc-preview-tx",`${tx}px`);
  preview.style.setProperty("--ccc-preview-ty",`${ty}px`);
  preview.style.setProperty("--ccc-preview-sx",String(sx));
  preview.style.setProperty("--ccc-preview-sy",String(sy));
  document.body.append(layer,preview);
  draftPreviewGesture.preview={layer,preview,rect};
  draftPreviewGesture.longPressed=true;
  draftPreviewSuppressClick=true;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    layer.classList.add("is-open");
    preview.classList.add("is-open");
  }));
}

let quickLookTimer=null;
function closeImageQuickLook(){
  if(quickLookTimer){clearTimeout(quickLookTimer);quickLookTimer=null;}
  document.querySelector(".ccc-image-quicklook")?.remove();
}
function openImageQuickLook(src,alt="Bild"){
  if(!src)return;
  closeImageQuickLook();
  const overlay=document.createElement("div");
  overlay.className="ccc-image-quicklook";
  overlay.setAttribute("role","dialog");
  overlay.setAttribute("aria-label","Tillfällig helskärmsvisning");
  const image=document.createElement("img");
  image.src=src;
  image.alt=alt;
  overlay.append(image);
  overlay.addEventListener("click",closeImageQuickLook,{once:true});
  document.body.append(overlay);
  requestAnimationFrame(()=>overlay.classList.add("is-open"));
  quickLookTimer=window.setTimeout(closeImageQuickLook,2500);
}

function bindDetailDoubleTapQuickLook(){
  const area=$("#swipeArea");
  if(!area||area.dataset.quickLookBound)return;
  area.dataset.quickLookBound="1";
  let tap=null,lastTapAt=0;
  area.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse"&&e.button!==0)return;
    tap={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),moved:false};
  },{passive:true});
  area.addEventListener("pointermove",e=>{
    if(!tap||tap.id!==e.pointerId)return;
    if(Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>12)tap.moved=true;
  },{passive:true});
  area.addEventListener("pointerup",e=>{
    if(!tap||tap.id!==e.pointerId)return;
    const now=performance.now();
    const isTap=!tap.moved && now-tap.t<360;
    tap=null;
    if(!isTap)return;
    if(now-lastTapAt<330){
      lastTapAt=0;
      e.preventDefault();
      openImageQuickLook($("#detailImage")?.src,$("#detailImage")?.alt||"Bild");
    }else{
      lastTapAt=now;
    }
  },{passive:false});
  area.addEventListener("pointercancel",()=>{tap=null;},{passive:true});
}

function bindDraftPreview(button,img){
  button.addEventListener("contextmenu",e=>e.preventDefault());
  button.addEventListener("pointerdown",e=>{
    if(e.pointerType==="mouse"&&e.button!==0)return;
    clearDraftPreviewGesture();
    draftPreviewGesture={button,id:e.pointerId,x:e.clientX,y:e.clientY,longPressed:false,preview:null,timer:null};
    draftPreviewGesture.timer=window.setTimeout(()=>openDraftPreview(button,img),750);
  });
  button.addEventListener("pointermove",e=>{
    const g=draftPreviewGesture;
    if(!g||g.button!==button||g.id!==e.pointerId||g.longPressed)return;
    if(Math.hypot(e.clientX-g.x,e.clientY-g.y)>12)clearDraftPreviewGesture();
  });
  const finish=e=>{
    const g=draftPreviewGesture;
    if(!g||g.button!==button||g.id!==e.pointerId)return;
    if(g.longPressed)closeDraftPreview(); else clearDraftPreviewGesture();
  };
  button.addEventListener("pointerup",finish);
  button.addEventListener("pointercancel",finish);
  button.addEventListener("lostpointercapture",finish);
}

bindDetailDoubleTapQuickLook();

function renderDraftPager(){
  const grid=$("#draftGrid");
  if(!grid)return;
  let pager=document.getElementById("draftPager");
  if(!pager){
    pager=document.createElement("div");
    pager.id="draftPager";
    pager.className="ccc-draft-pager";
    pager.setAttribute("aria-label","Sidor med lokala utkast");
    grid.insertAdjacentElement("afterend",pager);
  }
  pager.replaceChildren();
  const pages=Math.ceil(items.length/DRAFTS_PER_PAGE);
  pager.hidden=pages<=1;
  for(let i=0;i<pages;i+=1){
    const dot=document.createElement("button");
    dot.type="button"; dot.className="ccc-draft-page-dot";
    dot.setAttribute("aria-label",`Visa sida ${i+1} av ${pages}`);
    dot.setAttribute("aria-current",String(i===draftPage));
    dot.addEventListener("click",async()=>{draftPage=i;await renderGrid();});
    pager.append(dot);
  }
}
function bindDraftGridSwipe(){
  const grid=$("#draftGrid");
  if(!grid||grid.dataset.swipeBound)return;
  grid.dataset.swipeBound="1";
  grid.addEventListener("pointerdown",e=>{
    if(Math.ceil(items.length/DRAFTS_PER_PAGE)<=1)return;
    draftGridGesture={id:e.pointerId,x:e.clientX,y:e.clientY};
  });
  grid.addEventListener("pointerup",async e=>{
    if(!draftGridGesture||draftGridGesture.id!==e.pointerId)return;
    const g=draftGridGesture; draftGridGesture=null;
    const dx=e.clientX-g.x,dy=e.clientY-g.y;
    if(Math.abs(dx)<45||Math.abs(dx)<=Math.abs(dy)*1.15)return;
    const pages=Math.ceil(items.length/DRAFTS_PER_PAGE);
    const nextPage=Math.max(0,Math.min(pages-1,draftPage+(dx<0?1:-1)));
    if(nextPage!==draftPage){draftPage=nextPage;await renderGrid();}
  });
  grid.addEventListener("pointercancel",()=>{draftGridGesture=null;});
}


function helpHtmlForView(view){
  if(view==="gridView")return `
    <div class="help-row"><strong>Tryck</strong><br>Öppna plagget.</div>
    <div class="help-row"><strong>Långtryck</strong><br>Snabbzoom/förhandsvisning.</div>
    <div class="help-row"><strong>Dubbeltryck</strong><br>Visa bilden tillfälligt i helskärm.</div>
    <div class="help-row"><strong>Bilderna</strong><br>Tryck på ett plagg för att öppna det. Där kan du fortfarande kontrollera och anpassa bilden innan publicering.</div>
      <div class="help-row"><strong>Grön bock ✓</strong><br>Bilden har en sparad bildanpassning. Du kan fortfarande öppna plagget och ändra den.</div>
      <div class="help-row"><strong>Röd bock ✓</strong><br>Visas i Välj-läget och betyder att utkastet är markerat för borttagning. Inget tas bort förrän du trycker Ta bort och bekräftar.</div>
      <div class="help-row"><strong>Fortsätt</strong><br>Går vidare med de färdiga plaggen till val av kanal.</div>
      <div class="help-row"><strong>Välj</strong><br>Öppnar läget där du kan markera lokala utkast för borttagning.</div>`;
  if(view==="detailView")return `<div class="help-row"><strong>Grön ✓</strong><br>Bilden har en sparad anpassning men kan ändras igen.</div><div class="help-row"><strong>Anpassa bild</strong><br>Öppna beskärning/zoom för den här bilden.</div>`;
  if(view==="cropView")return `<div class="help-row"><strong>Anpassa bild</strong><br>Flytta och zooma tills utsnittet känns rätt.</div><div class="help-row"><strong>Spara anpassning</strong><br>Sparar bilden och återgår till miniatyrerna.</div>`;
  return `<div class="help-row"><strong>Tillbaka</strong><br>Går till föregående steg.</div>`;
}
function openPublishHelp(){
  const dlg=$("#publishHelpDialog"),body=$("#publishHelpBody");
  if(!dlg||!body)return;
  body.innerHTML=helpHtmlForView(currentPublishView);
  dlg.hidden=false;
}
function closePublishHelp(){const dlg=$("#publishHelpDialog");if(dlg)dlg.hidden=true;}
let publishFooterCoreWaitBound=false;
function configureFooterForView(view){
  if(!window.CCC_CORE?.footer){
    if(!publishFooterCoreWaitBound){
      publishFooterCoreWaitBound=true;
      document.addEventListener("ccc:core-ready",()=>{
        publishFooterCoreWaitBound=false;
        configureFooterForView(currentPublishView);
      },{once:true});
    }
    return;
  }
  if(view==="gridView"&&pendingDraftDelete){
    window.CCC_CORE.footer.showUndo?.({count:pendingDraftDelete.ids.length,onUndo:undoPendingDraftDelete});
    return;
  }
  if(draftSelectionMode){updateSelectionFooter();return;}
  const config={help:["gridView","detailView","cropView"].includes(view),onHelp:openPublishHelp};
  if(view==="gridView"){
    Object.assign(config,{
      help:true,
      onHelp:openPublishHelp,
      select:true,
      onSelect:enterDraftSelection,
      selectLabel:"Välj"
    });
  }
  window.CCC_CORE.footer.setTools?.(config);
}
function updateSelectionFooter(){
  const continueBtn=$("#preparedContinueBtn");
  if(continueBtn)continueBtn.hidden=draftSelectionMode;
  if(draftSelectionMode)window.CCC_CORE?.footer?.showSelection?.({count:selectedDraftIds.size,onDelete:confirmDeleteSelectedDrafts,onCancel:exitDraftSelection});
  else window.CCC_CORE?.footer?.showDefault?.();
}
function enterDraftSelection(){
  if(!items.length)return;
  draftSelectionMode=true;
  selectedDraftIds.clear();
  updateSelectionFooter();
  renderGrid();
}
function exitDraftSelection(){
  draftSelectionMode=false;
  selectedDraftIds.clear();
  const continueBtn=$("#preparedContinueBtn");
  if(continueBtn)continueBtn.hidden=false;
  configureFooterForView(currentPublishView);
  renderGrid();
}
async function commitPendingDraftDelete(){
  const pending=pendingDraftDelete;
  if(!pending)return;
  pendingDraftDelete=null;
  clearTimeout(pending.timer);
  try{await deleteDraftIds(pending.ids);}catch(err){console.warn("[CCC] permanent delete failed",err);}
}
function undoPendingDraftDelete(){
  const pending=pendingDraftDelete;
  if(!pending)return;
  pendingDraftDelete=null;
  clearTimeout(pending.timer);
  const currentIds=new Set(items.map(i=>i.id));
  const restored=[...items];
  pending.removed
    .slice()
    .sort((a,b)=>a.index-b.index)
    .forEach(({item,index})=>{
      if(currentIds.has(item.id))return;
      restored.splice(Math.min(index,restored.length),0,item);
      currentIds.add(item.id);
    });
  items=restored;
  window.CCC_CORE?.footer?.setTools?.({
    help:true,
    onHelp:openPublishHelp,
    select:true,
    onSelect:enterDraftSelection,
    selectLabel:"Välj"
  });
  renderGrid();
}

function selectedDeletePreviewItems(ids){
  const wanted=new Set(ids);
  return items.filter(item=>wanted.has(item.id));
}
function askDeleteDraftConfirmation(ids){
  const dlg=$("#deleteDraftDialog"),thumbs=$("#deleteDraftThumbs"),text=$("#deleteDraftText");
  if(!dlg||!thumbs||!text)return Promise.resolve(false);
  const selected=selectedDeletePreviewItems(ids);
  text.textContent=ids.length===1?"Kontrollera bilden innan du tar bort utkastet.":`Kontrollera de ${ids.length} markerade bilderna innan du tar bort dem.`;
  thumbs.replaceChildren();
  selected.slice(0,5).forEach((item,index)=>{
    const wrap=document.createElement("div");
    wrap.className="delete-draft-thumb";
    const img=document.createElement("img");
    img.alt=`Markerad bild ${index+1}`;
    img.src=itemImageSrc(items.indexOf(item))||item.imageUrl||item.url||"";
    wrap.append(img);
    thumbs.append(wrap);
  });
  if(selected.length>5){
    const more=document.createElement("div");
    more.className="delete-draft-more";
    more.textContent=`+${selected.length-5}`;
    thumbs.append(more);
  }
  $("#deleteDraftTitle").textContent=ids.length===1?"Ta bort markerat utkast?":`Ta bort ${ids.length} markerade utkast?`;
  dlg.hidden=false;
  return new Promise(resolve=>{
    const close=result=>{
      dlg.hidden=true;
      $("#confirmDeleteDrafts").onclick=null;
      $("#cancelDeleteDrafts").onclick=null;
      resolve(result);
    };
    $("#confirmDeleteDrafts").onclick=()=>close(true);
    $("#cancelDeleteDrafts").onclick=()=>close(false);
  });
}
async function confirmDeleteSelectedDrafts(){
  const ids=[...selectedDraftIds];
  if(!ids.length)return;
  if(!(await askDeleteDraftConfirmation(ids)))return;

  // Om en tidigare radering fortfarande väntar på Ångra, slutför den först.
  await commitPendingDraftDelete();

  const wanted=new Set(ids);
  const removed=items
    .map((item,index)=>({item,index}))
    .filter(({item})=>wanted.has(item.id));

  items=items.filter(item=>!wanted.has(item.id));
  selectedDraftIds.clear();
  draftSelectionMode=false;
  draftPage=Math.min(draftPage,Math.max(0,Math.ceil(items.length/DRAFTS_PER_PAGE)-1));

  const timer=window.setTimeout(()=>{commitPendingDraftDelete();configureFooterForView("gridView");},8000);
  pendingDraftDelete={ids,removed,timer};

  window.CCC_CORE?.footer?.showUndo?.({count:ids.length,onUndo:undoPendingDraftDelete});
  await renderGrid();
}
async function renderGrid(){
  const grid=$("#draftGrid");
  const empty=$("#emptyState");
  ensureDraftGridUi();
  bindDraftGridSwipe();
  grid.replaceChildren();
  $("#draftCount").textContent=items.length===1?"1 lokalt utkast":`${items.length} lokala utkast`;
  $("#startDraftCount").textContent=items.length===1?"1 utkast":`${items.length} utkast`;

  const hasItems=items.length>0;
  const preparedContinue=$("#preparedContinueBtn");
  if(preparedContinue){
    preparedContinue.disabled=!hasItems;
    preparedContinue.hidden=draftSelectionMode;
  }
  if(empty){
    empty.hidden=hasItems;
    empty.style.display=hasItems?"none":"grid";
  }
  grid.hidden=!hasItems;
  grid.style.display=hasItems?"grid":"none";

  const pages=Math.max(1,Math.ceil(items.length/DRAFTS_PER_PAGE));
  draftPage=Math.max(0,Math.min(draftPage,pages-1));
  const pageStart=draftPage*DRAFTS_PER_PAGE;
  const pageEnd=Math.min(items.length,pageStart+DRAFTS_PER_PAGE);
  const visibleCount=Math.max(0,pageEnd-pageStart);
  grid.classList.remove("grid-1","grid-2","grid-4","grid-9");
  if(visibleCount===1)grid.classList.add("grid-1");
  else if(visibleCount===2)grid.classList.add("grid-2");
  else if(visibleCount<=4)grid.classList.add("grid-4");
  else grid.classList.add("grid-9");
  for(let index=pageStart;index<pageEnd;index+=1){
    const item=items[index];
    const b=document.createElement("button");
    b.type="button";
    b.className="draft-card";
    b.setAttribute("aria-label",`Öppna ${title(item,index)}`);

    const img=document.createElement("img");
    img.alt=title(item,index);
    img.decoding="async";
    img.src=item.thumbUrl||await previewSrc(item);
    img.addEventListener("error",async()=>{
      console.warn("[CCC Publicera] Miniatyr kunde inte visas",{id:item.id,type:(item.originalBlob||item.publishBlob)?.type});
      const source=item.originalBlob||item.publishBlob||item.thumbnailBlob;
      if(source && !img.dataset.retried){
        img.dataset.retried="1";
        try{img.src=await dataUrl(source);}catch(_){}
      }
    });
    b.append(img);

    if(item.imageProcessingState==="webp-cropped" && item.publishBlob){
      const adaptedBadge=document.createElement("span");
      adaptedBadge.className="draft-adapted-badge";
      adaptedBadge.textContent="✓";
      adaptedBadge.setAttribute("aria-label","Bilden har en sparad anpassning");
      b.append(adaptedBadge);
    }
    if(item.id===recentlyAdaptedItemId)b.classList.add("just-adapted");

    const cap=document.createElement("span");
    cap.className="draft-card-caption";
    cap.textContent=title(item,index);
    b.append(cap);
    const itemId=item.id;
    b.dataset.itemId=itemId;if(draftSelectionMode){b.classList.add("is-selecting");if(selectedDraftIds.has(itemId))b.classList.add("is-selected");const mark=document.createElement("span");mark.className="draft-select-mark";mark.textContent=selectedDraftIds.has(itemId)?"✓":"";b.append(mark);}else bindDraftPreview(b,img);

    let thumbTap=null,thumbLastTapAt=0,thumbSingleTimer=null,lastTouchHandledAt=0;
    b.addEventListener("pointerdown",e=>{
      if(e.pointerType!=="touch"&&e.pointerType!=="pen")return;
      thumbTap={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),moved:false};
    },{passive:true});
    b.addEventListener("pointermove",e=>{
      if(!thumbTap||thumbTap.id!==e.pointerId)return;
      if(Math.hypot(e.clientX-thumbTap.x,e.clientY-thumbTap.y)>12)thumbTap.moved=true;
    },{passive:true});
    b.addEventListener("pointerup",e=>{
      if(!thumbTap||thumbTap.id!==e.pointerId)return;
      const now=performance.now();
      const isTap=!thumbTap.moved && now-thumbTap.t<360;
      thumbTap=null;
      if(!isTap)return;
      lastTouchHandledAt=Date.now();e.preventDefault();if(draftSelectionMode){selectedDraftIds.has(itemId)?selectedDraftIds.delete(itemId):selectedDraftIds.add(itemId);updateSelectionFooter();renderGrid();return;}
      if(draftPreviewSuppressClick){
        draftPreviewSuppressClick=false;
        if(thumbSingleTimer){clearTimeout(thumbSingleTimer);thumbSingleTimer=null;}
        return;
      }
      if(now-thumbLastTapAt<330){
        thumbLastTapAt=0;
        if(thumbSingleTimer){clearTimeout(thumbSingleTimer);thumbSingleTimer=null;}
        openImageQuickLook(itemImageSrc(index)||img.src,title(item,index));
      }else{
        thumbLastTapAt=now;
        if(thumbSingleTimer)clearTimeout(thumbSingleTimer);
        thumbSingleTimer=window.setTimeout(()=>{
          thumbSingleTimer=null;
          openDetailById(itemId);
        },340);
      }
    },{passive:false});
    b.addEventListener("pointercancel",()=>{thumbTap=null;},{passive:true});

    b.addEventListener("click",e=>{if(draftSelectionMode){e.preventDefault();e.stopPropagation();if(Date.now()-lastTouchHandledAt<700)return;selectedDraftIds.has(itemId)?selectedDraftIds.delete(itemId):selectedDraftIds.add(itemId);updateSelectionFooter();renderGrid();return;}
      if(Date.now()-lastTouchHandledAt<700){
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if(draftPreviewSuppressClick){
        draftPreviewSuppressClick=false;
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      openDetailById(itemId);
    });
    grid.append(b);
  }
  renderDraftPager();
}
function normalizedIndex(index){
  return items.length ? (index+items.length)%items.length : 0;
}
function itemImageSrc(index){
  if(!items.length)return "";
  const item=items[normalizedIndex(index)];
  if(!item)return "";
  if(item.publishBlob){
    if(!item.publishUrl)item.publishUrl=url(item.publishBlob);
    return item.publishUrl;
  }
  return item.fullUrl||item.thumbUrl||"";
}
function setSwipeTransforms(offset=0,animate=false){
  const area=$("#swipeArea");
  if(!area)return;
  const width=Math.max(1,area.clientWidth);
  const prev=$("#detailPrevImage"),current=$("#detailImage"),nextImg=$("#detailNextImage");
  [prev,current,nextImg].forEach(img=>{
    img.style.transition=animate?"transform 480ms cubic-bezier(.16,.74,.18,1)":"none";
  });
  prev.style.transform=`translate3d(${offset-width}px,0,0)`;
  current.style.transform=`translate3d(${offset}px,0,0)`;
  nextImg.style.transform=`translate3d(${offset+width}px,0,0)`;
}
function syncSwipeNeighbors(){
  if(!items.length)return;
  syncActiveIndexFromId();
  const current=activeItem();
  if(!current)return;
  $("#detailImage").src=itemImageSrc(activeIndex);
  $("#detailPrevImage").src=itemImageSrc(activeIndex-1);
  $("#detailNextImage").src=itemImageSrc(activeIndex+1);
  setSwipeTransforms(0,false);
  preloadNeighbors(activeIndex);
}
function updateDetailCopy(){
  syncActiveIndexFromId();
  const item=activeItem();
  if(!item)return;
  $("#detailTitle").textContent=title(item,activeIndex);
  $("#detailMeta").textContent=[item.brand,item.size&&`Storlek ${item.size}`,item.price&&`${item.price} kr`].filter(Boolean).join(" · ");
  $("#detailCounter").textContent=`${activeIndex+1} av ${items.length}`;
  const adjusted=item.imageProcessingState==="webp-cropped" && !!item.publishBlob;
  const originalReady=item.imageProcessingState==="webp-original" && !!item.publishBlob;
  const badge=$("#detailAdjustedBadge");
  if(badge)badge.hidden=!adjusted;
  $("#publishStatus").textContent=adjusted
    ?"Bilden är anpassad och klar som WebP."
    :(originalReady?"Bilden är klar som WebP i originalformat.":"");
}
function itemIndexById(itemId){
  if(!itemId)return -1;
  return items.findIndex(item=>item?.id===itemId);
}
function activeItem(){
  if(!items.length)return null;
  if(activeItemId){
    const byId=items.find(item=>item?.id===activeItemId);
    if(byId)return byId;
  }
  return items[activeIndex]||null;
}
function syncActiveIndexFromId(){
  if(!activeItemId)return;
  const index=itemIndexById(activeItemId);
  if(index>=0)activeIndex=index;
}
function openDetailById(itemId){
  const index=itemIndexById(itemId);
  if(index<0){
    console.warn("[CCC Publicera] Hittade inte utkastet som miniatyren pekade på",itemId);
    return;
  }
  openDetail(index);
}
function openDetail(index){
  if(!items.length)return;
  if(swipeCommitTimer){
    clearTimeout(swipeCommitTimer);
    swipeCommitTimer=null;
  }
  swipeGesture=null;
  swipeAnimating=false;

  activeIndex=normalizedIndex(index);
  const item=items[activeIndex];
  activeItemId=item?.id||null;
  if(!item)return;
  $("#detailImage").src=itemImageSrc(activeIndex);
  updateDetailCopy();
  show("detailView");
  bindDetailArrowButtons();
  requestAnimationFrame(()=>{
    syncActiveIndexFromId();
    syncSwipeNeighbors();
    requestAnimationFrame(()=>setSwipeTransforms(0,false));
  });
}
function next(delta){openDetail(activeIndex+delta);}

function bindDetailArrowButtons(){
  const root=$("#detailView")||document;
  const bind=(el,delta)=>{
    if(!el||el.dataset.cccDetailArrowBound)return;
    el.dataset.cccDetailArrowBound="1";
    el.setAttribute("role","button");
    el.setAttribute("tabindex","0");
    const activate=e=>{
      e.preventDefault();
      e.stopPropagation();
      next(delta);
    };
    el.addEventListener("click",activate);
    el.addEventListener("keydown",e=>{
      if(e.key==="Enter"||e.key===" ")activate(e);
    });
  };
  // The visible arrows are spans (.swipe-hint), not buttons. Bind them directly.
  bind(root.querySelector(".swipe-hint.left"),-1);
  bind(root.querySelector(".swipe-hint.right"),1);
}
bindDetailArrowButtons();

let swipeGesture=null;
let swipeAnimating=false;
let swipeCommitTimer=null;

$("#swipeArea").addEventListener("pointerdown",e=>{
  if(swipeAnimating||items.length<2)return;
  if(e.pointerType==="mouse"&&e.button!==0)return;
  const area=e.currentTarget;
  area.setPointerCapture?.(e.pointerId);
  e.currentTarget.classList.add("is-swiping");
  swipeGesture={
    id:e.pointerId,
    startX:e.clientX,
    startY:e.clientY,
    dx:0,
    horizontal:false
  };
  setSwipeTransforms(0,false);
});

$("#swipeArea").addEventListener("pointermove",e=>{
  if(!swipeGesture||swipeGesture.id!==e.pointerId||swipeAnimating)return;
  const dx=e.clientX-swipeGesture.startX;
  const dy=e.clientY-swipeGesture.startY;

  if(!swipeGesture.horizontal){
    if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
    if(Math.abs(dy)>Math.abs(dx)*1.15){
      swipeGesture=null;
      return;
    }
    swipeGesture.horizontal=true;
  }

  e.preventDefault();
  const width=Math.max(1,e.currentTarget.clientWidth);
  const raw=Math.min(Math.abs(dx),width*1.08);
  // Follow the finger almost 1:1, with only gentle resistance near the outer edge.
  const softened=raw<=width*.78 ? raw*.985 : width*.7683+(raw-width*.78)*.72;
  const limited=Math.sign(dx)*softened;
  swipeGesture.dx=limited;
  setSwipeTransforms(limited,false);
},{passive:false});

function finishSwipe(e,cancelled=false){
  if(!swipeGesture||swipeGesture.id!==e.pointerId)return;
  $("#swipeArea")?.classList.remove("is-swiping");
  const gesture=swipeGesture;
  swipeGesture=null;

  if(!gesture.horizontal||cancelled){
    setSwipeTransforms(0,true);
    return;
  }

  const area=$("#swipeArea");
  const width=Math.max(1,area.clientWidth);
  const threshold=width*.23;

  if(Math.abs(gesture.dx)<threshold){
    setSwipeTransforms(0,true);
    return;
  }

  const delta=gesture.dx<0?1:-1;
  const target=gesture.dx<0?-width:width;
  const targetItem=items[normalizedIndex(activeIndex+delta)];
  const targetItemId=targetItem?.id;
  swipeAnimating=true;
  setSwipeTransforms(target,true);

  if(swipeCommitTimer)clearTimeout(swipeCommitTimer);
  swipeCommitTimer=window.setTimeout(()=>{
    swipeCommitTimer=null;
    const resolvedIndex=itemIndexById(targetItemId);
    if(resolvedIndex>=0){
      activeIndex=resolvedIndex;
      activeItemId=targetItemId;
    }
    const item=activeItem();
    if(!item)return;
    $("#detailImage").src=itemImageSrc(activeIndex);
    updateDetailCopy();
    syncSwipeNeighbors();
    swipeAnimating=false;
  },490);
}

$("#swipeArea").addEventListener("pointerup",e=>finishSwipe(e,false));
$("#swipeArea").addEventListener("pointercancel",e=>finishSwipe(e,true));
$("#swipeArea").addEventListener("lostpointercapture",e=>{
  if(swipeGesture?.id===e.pointerId)finishSwipe(e,true);
});

$("#draftsBtn").addEventListener("click",async()=>{
  await renderGrid();
  preloadNeighbors(0);
  show("gridView");
  requestAnimationFrame(()=>$("#cccHeaderBack")?.focus({preventScroll:true}));
});
$("#preparedContinueBtn")?.addEventListener("click",()=>{
  if(!items.length)return;
  channelSelectedIds.clear();
  items.forEach(item=>channelSelectedIds.add(item.id));
  channelSelectPage=0;
  container13ChannelSelected=false;
  const c13=$("#container13ChannelBtn");
  c13?.classList.remove("is-chosen");
  c13?.setAttribute("aria-pressed","false");
  const next=$("#channelNextBtn");
  if(next)next.disabled=true;
  show("channelTargetsView");
});

$("#channelBtn").addEventListener("click",()=>{
  channelSelectedIds.clear();
  channelSelectPage=0;
  container13ChannelSelected=false;
  const c13=$("#container13ChannelBtn");
  c13?.classList.remove("is-chosen");
  c13?.setAttribute("aria-pressed","false");
  const next=$("#channelNextBtn");
  if(next)next.disabled=true;
  show("channelTargetsView");
});
$("#publishedBtn").addEventListener("click",()=>show("publishedView"));


function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});}
function geometry(){if(!cropImage||!cropState)return null;const c=$("#cropCanvas"),base=Math.max(c.width/cropImage.naturalWidth,c.height/cropImage.naturalHeight),scale=base*cropState.zoom,w=cropImage.naturalWidth*scale,h=cropImage.naturalHeight*scale,lx=Math.max(0,(w-c.width)/2),ly=Math.max(0,(h-c.height)/2);cropState.x=Math.max(-lx,Math.min(lx,cropState.x));cropState.y=Math.max(-ly,Math.min(ly,cropState.y));return{c,scale,w,h};}
function drawCrop(){const g=geometry();if(!g)return;const ctx=g.c.getContext("2d",{alpha:false});ctx.fillStyle="#111";ctx.fillRect(0,0,g.c.width,g.c.height);ctx.drawImage(cropImage,(g.c.width-g.w)/2+cropState.x,(g.c.height-g.h)/2+cropState.y,g.w,g.h);
  renderCropDiagnostics();
}
function smartCropSuggestion(image){
  // Local, lightweight subject-saliency heuristic. No upload and no permanent edit.
  const side=144,c=document.createElement("canvas"),ctx=c.getContext("2d",{willReadFrequently:true});
  const ratio=image.naturalWidth/image.naturalHeight;
  c.width=ratio>=1?side:Math.max(72,Math.round(side*ratio));
  c.height=ratio>=1?Math.max(72,Math.round(side/ratio)):side;
  ctx.drawImage(image,0,0,c.width,c.height);
  const {data}=ctx.getImageData(0,0,c.width,c.height), pts=[];
  let total=0,cx=0,cy=0;
  for(let y=1;y<c.height-1;y+=2){for(let x=1;x<c.width-1;x+=2){
    const i=(y*c.width+x)*4,r=data[i],g=data[i+1],b=data[i+2];
    const max=Math.max(r,g,b),min=Math.min(r,g,b),sat=max-min;
    const j=(y*c.width+x+1)*4,k=((y+1)*c.width+x)*4;
    const edge=Math.abs(r-data[j])+Math.abs(g-data[j+1])+Math.abs(b-data[j+2])+Math.abs(r-data[k])+Math.abs(g-data[k+1])+Math.abs(b-data[k+2]);
    const nx=x/c.width,ny=y/c.height,central=Math.exp(-(((nx-.46)/.34)**2+((ny-.47)/.38)**2));
    const score=(sat*.72+Math.min(180,edge)*.42)*(.34+.66*central);
    if(score>42){pts.push([x,y,score]);total+=score;cx+=x*score;cy+=y*score;}
  }}
  if(!total||pts.length<20)return {zoom:1,x:0,y:0};
  cx/=total;cy/=total;
  // Keep a tighter salient cluster around the weighted subject center.
  // v2.8.78 deliberately rejects more surrounding page/UI clutter and lets the garment fill more of the crop.
  const radius=Math.min(c.width,c.height)*.31, near=pts.filter(p=>Math.hypot(p[0]-cx,p[1]-cy)<=radius);
  const use=near.length>15?near:pts;

  // Trim extreme saliency outliers instead of letting one remote edge enlarge the whole box.
  const xs=use.map(p=>p[0]).sort((a,b)=>a-b), ys=use.map(p=>p[1]).sort((a,b)=>a-b);
  const q=(arr,f)=>arr[Math.max(0,Math.min(arr.length-1,Math.floor((arr.length-1)*f)))];
  let minX=q(xs,.05),maxX=q(xs,.95),minY=q(ys,.04),maxY=q(ys,.96);

  const span=Math.max(maxX-minX,maxY-minY);

  // v2.8.95 RC1: paired collar/shoulder lock.
  // A V-neck / white neck opening can make the centre of the top edge disappear.
  // If strong upper-edge points exist on BOTH sides of the subject at nearly the
  // same height, treat them as one garment edge and keep that edge in the crop.
  // This deliberately changes only minY; zoom/X/Y logic below remains unchanged.
  const upperScoreFloor=54;
  const shoulderReach=span*.46;
  const innerGap=span*.035;
  const upperWindow=minY+span*.12;
  const leftUpper=use
    .filter(p=>p[2]>=upperScoreFloor && p[0]>=cx-shoulderReach && p[0]<=cx-innerGap && p[1]<=upperWindow)
    .map(p=>p[1]).sort((a,b)=>a-b);
  const rightUpper=use
    .filter(p=>p[2]>=upperScoreFloor && p[0]<=cx+shoulderReach && p[0]>=cx+innerGap && p[1]<=upperWindow)
    .map(p=>p[1]).sort((a,b)=>a-b);

  if(leftUpper.length>=2 && rightUpper.length>=2){
    const leftTop=q(leftUpper,.12),rightTop=q(rightUpper,.12);
    const pairedTolerance=span*.13;
    if(Math.abs(leftTop-rightTop)<=pairedTolerance){
      const pairedTop=Math.min(leftTop,rightTop);
      if(pairedTop<minY){
        minY=Math.max(0,pairedTop-span*.025);
      }
    }
  }

  const pad=.20*span;
  minX=Math.max(0,minX-pad);maxX=Math.min(c.width,maxX+pad);
  minY=Math.max(0,minY-pad);maxY=Math.min(c.height,maxY+pad);

  const box=Math.max(12,Math.max(maxX-minX,maxY-minY));
  const subjectX=((minX+maxX)/2)/c.width*image.naturalWidth,subjectY=((minY+maxY)/2)/c.height*image.naturalHeight;
  const subjectSize=box/Math.min(c.width,c.height)*Math.min(image.naturalWidth,image.naturalHeight);
  const baseCrop=Math.min(image.naturalWidth,image.naturalHeight);
  const zoom=Math.max(1.03,Math.min(2.45,baseCrop/Math.max(1,subjectSize)*1.04));
  const canvas=$("#cropCanvas"),base=Math.max(canvas.width/image.naturalWidth,canvas.height/image.naturalHeight),scale=base*zoom;
  const x=(image.naturalWidth/2-subjectX)*scale,y=(image.naturalHeight/2-subjectY)*scale;
  // v2.8.94 adaptive X-centering retained unchanged.
  // Small imbalances are ignored; stronger off-centre subjects receive gradually
  // more correction. Zoom, Y, crop size and sleeve padding remain untouched.
  const subjectOffset=(subjectX-image.naturalWidth/2)/Math.max(1,image.naturalWidth);
  const absOffset=Math.abs(subjectOffset);
  let correctionStrength=0;

  if(absOffset>=.04 && absOffset<.08){
    correctionStrength=.30;
  }else if(absOffset>=.08 && absOffset<.12){
    correctionStrength=.43;
  }else if(absOffset>=.12){
    correctionStrength=.54;
  }

  const rawCorrection=-subjectOffset*canvas.width*correctionStrength;
  const maxCorrection=canvas.width*.085;
  const xCorrection=Math.max(-maxCorrection,Math.min(maxCorrection,rawCorrection));
  const correctedX=x+xCorrection;

  return {zoom,x:correctedX,y};
}
function calculateCropDiagnostics(){
  if(!cropImage||!cropState)return null;
  const canvas=$("#cropCanvas");
  if(!canvas)return null;

  const cw=canvas.width,ch=canvas.height;
  const base=Math.max(cw/cropImage.naturalWidth,ch/cropImage.naturalHeight);
  const scale=base*cropState.zoom;
  const dw=cropImage.naturalWidth*scale;
  const dh=cropImage.naturalHeight*scale;
  const left=(cw-dw)/2+cropState.x;
  const top=(ch-dh)/2+cropState.y;
  const right=cw-(left+dw);
  const bottom=ch-(top+dh);

  const pct=v=>Math.round(v*10)/10;
  const visibleW=Math.min(cw,left+dw)-Math.max(0,left);
  const visibleH=Math.min(ch,top+dh)-Math.max(0,top);

  return {
    zoom:Math.round(cropState.zoom*100)/100,
    x:Math.round(cropState.x),
    y:Math.round(cropState.y),
    sourceW:cropImage.naturalWidth,
    sourceH:cropImage.naturalHeight,
    imageFillW:pct(visibleW/cw*100),
    imageFillH:pct(visibleH/ch*100),
    leftMargin:pct(Math.max(0,left)/cw*100),
    rightMargin:pct(Math.max(0,right)/cw*100),
    topMargin:pct(Math.max(0,top)/ch*100),
    bottomMargin:pct(Math.max(0,bottom)/ch*100)
  };
}

function renderCropDiagnostics(){
  const panel=$("#cropDiag");
  if(!panel||panel.hidden)return;
  const d=calculateCropDiagnostics();
  if(!d){panel.textContent="Ingen crop-data tillgänglig.";return;}
  const item=activeItem?.()||items[activeIndex];
  panel.textContent=[
    `Plagg: ${item?.title||item?.brand||item?.id||"okänt"}`,
    `Källa: ${d.sourceW} × ${d.sourceH}px`,
    ``,
    `Zoom: ${d.zoom}×`,
    `X: ${d.x}px`,
    `Y: ${d.y}px`,
    ``,
    `Bild i crop – bredd: ${d.imageFillW}%`,
    `Bild i crop – höjd: ${d.imageFillH}%`,
    ``,
    `Marginal vänster: ${d.leftMargin}%`,
    `Marginal höger: ${d.rightMargin}%`,
    `Marginal topp: ${d.topMargin}%`,
    `Marginal botten: ${d.bottomMargin}%`
  ].join("\\n");
}


function updateCropCounter(){
  const el=$("#cropCounter");
  if(!el)return;
  syncActiveIndexFromId();
  el.textContent=`${activeIndex+1} av ${items.length}`;
}

function setCropZoom(nextZoom){
  if(!cropState)return;
  const z=Math.max(.35,Math.min(3,Number(nextZoom)||1));
  cropState.zoom=z;
  const input=$("#cropZoom");
  if(input)input.value=String(z);
  const value=$("#cropZoomValue");
  if(value)value.textContent=`${Math.round(z*100)} %`;
  drawCrop();
}

function stepCropZoom(delta){
  if(!cropState)return;
  setCropZoom((cropState.zoom||1)+delta);
}

function cycleCropZoom(){
  if(!cropState)return;
  const z=cropState.zoom||1;
  setCropZoom(z<1.15?1.30:z<1.55?1.80:1);
}

async function openCrop(){
  syncActiveIndexFromId();
  const item=activeItem();
  if(!item)return;
  // Vision-originalet används som bildkälla; sparad cropData återanvänds för fortsatt finjustering.
  const originalSource=item.originalBlob?url(item.originalBlob):(item.thumbUrl||item.fullUrl);
  cropImage=await loadImage(originalSource);
  if(item.cropData){cropState={...item.cropData};}
  else{
    cropState=smartCropSuggestion(cropImage);
    item.cropSuggestion={...cropState};
    console.debug("[CCC Publicera] crop v2.8.95 RC1 paired-collar lock",{id:item.id,zoom:cropState.zoom,x:cropState.x,y:cropState.y});
  }
  $("#cropZoom").value=String(cropState.zoom);
  const zoomValue=$("#cropZoomValue");
  if(zoomValue)zoomValue.textContent=`${Math.round(cropState.zoom*100)} %`;
  updateCropCounter();
  $("#cropOriginalPreview").src=item.thumbUrl||item.fullUrl;
  drawCrop();show("cropView");
}
async function createOriginalWebP(item){
  const src=item.originalBlob||item.thumbnailBlob;
  if(!src)throw new Error("Originalbild saknas.");
  const sourceUrl=item.thumbUrl||await previewSrc(item);
  const image=await loadImage(sourceUrl);

  // v2.9.20: alla färdiga publiceringsbilder får samma kvadratiska canvas.
  // "Behåll hela bilden" visar hela originalet centrerat utan beskärning;
  // eventuell restyta blir samma mörka bakgrund som i Publicera.
  const outSize=Math.max(1,Math.min(1600,Math.max(image.naturalWidth,image.naturalHeight)));
  const scale=Math.min(outSize/image.naturalWidth,outSize/image.naturalHeight);
  const drawW=Math.max(1,Math.round(image.naturalWidth*scale));
  const drawH=Math.max(1,Math.round(image.naturalHeight*scale));
  const dx=Math.round((outSize-drawW)/2);
  const dy=Math.round((outSize-drawH)/2);
  const out=document.createElement("canvas");
  out.width=out.height=outSize;
  const ctx=out.getContext("2d",{alpha:false});
  ctx.fillStyle="#111";
  ctx.fillRect(0,0,outSize,outSize);
  ctx.drawImage(image,dx,dy,drawW,drawH);
  return new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error("WebP misslyckades")),"image/webp",.84));
}
$("#cropBtn").addEventListener("click",openCrop);
const cropDiagToggle=$("#cropDiagToggle");
if(cropDiagToggle){
  cropDiagToggle.addEventListener("click",()=>{
    const panel=$("#cropDiag");
    if(!panel)return;
    panel.hidden=!panel.hidden;
    cropDiagToggle.textContent=panel.hidden?"Visa crop-data":"Dölj crop-data";
    renderCropDiagnostics();
  });
}

$("#keepOriginalBtn").addEventListener("click",async()=>{
  const item=activeItem();
  if(!item)return;
  const button=$("#keepOriginalBtn"),old=button.textContent;
  button.disabled=true;button.textContent="Optimerar…";
  try{
    const blob=await createOriginalWebP(item);
    item.publishBlob=blob;
    item.cropData=null;
    item.imageProcessingState="webp-original";
    await put(persistenceRecord({...item,publishBlob:blob,cropData:null,imageProcessingState:item.imageProcessingState}));
    if(item.publishUrl&&item.publishUrl.startsWith("blob:"))URL.revokeObjectURL(item.publishUrl);
    item.publishUrl=url(blob);
    openDetailById(item.id);
  }catch(error){
    console.error("[CCC Publicera] Kunde inte optimera originalbilden",error);
    button.textContent="Försök igen";
    button.disabled=false;
    return;
  }
  button.textContent=old;button.disabled=false;
});

const cropZoomInput=$("#cropZoom");
if(cropZoomInput)cropZoomInput.addEventListener("input",e=>setCropZoom(Number(e.target.value)||1));

$("#cropZoomToggle")?.addEventListener("click",()=>{
  const controls=$("#cropZoomControls");
  if(controls)controls.hidden=!controls.hidden;
});
$("#cropZoomOut")?.addEventListener("click",()=>stepCropZoom(-.05));
$("#cropZoomIn")?.addEventListener("click",()=>stepCropZoom(.05));

$("#cropReset").addEventListener("click",()=>{
  const item=activeItem();
  if(!item)return;
  const suggestion=item.cropSuggestion||smartCropSuggestion(cropImage);
  item.cropSuggestion={...suggestion};
  cropState={...suggestion};
  $("#cropZoom").value=String(cropState.zoom);
  const zoomValue=$("#cropZoomValue");
  if(zoomValue)zoomValue.textContent=`${Math.round(cropState.zoom*100)} %`;
  drawCrop();
});
const cropPointers=new Map();
let pinchStart=null;

function pointerDistance(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function pointerMid(a,b){return{x:(a.x+b.x)/2,y:(a.y+b.y)/2};}

$("#cropCanvas").addEventListener("pointerdown",e=>{
  if(!cropState)return;
  e.preventDefault();
  e.currentTarget.setPointerCapture?.(e.pointerId);
  cropPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});

  if(cropPointers.size===1){
    pointer={id:e.pointerId,x:e.clientX,y:e.clientY,ox:cropState.x,oy:cropState.y};
    pinchStart=null;
  }else if(cropPointers.size===2){
    const [a,b]=[...cropPointers.values()];
    pinchStart={
      distance:Math.max(1,pointerDistance(a,b)),
      zoom:cropState.zoom,
      x:cropState.x,
      y:cropState.y,
      mid:pointerMid(a,b)
    };
    pointer=null;
  }
},{passive:false});

$("#cropCanvas").addEventListener("pointermove",e=>{
  if(!cropState||!cropPointers.has(e.pointerId))return;
  e.preventDefault();
  cropPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
  const c=e.currentTarget,r=c.getBoundingClientRect();
  const canvasPerCssX=c.width/Math.max(1,r.width),canvasPerCssY=c.height/Math.max(1,r.height);

  if(cropPointers.size>=2&&pinchStart){
    const [a,b]=[...cropPointers.values()].slice(0,2);
    const distance=Math.max(1,pointerDistance(a,b));
    const mid=pointerMid(a,b);
    const newZoom=Math.max(1,Math.min(3,pinchStart.zoom*(distance/pinchStart.distance)));
    cropState.zoom=newZoom;
    cropState.x=pinchStart.x+(mid.x-pinchStart.mid.x)*canvasPerCssX;
    cropState.y=pinchStart.y+(mid.y-pinchStart.mid.y)*canvasPerCssY;
    $("#cropZoom").value=String(newZoom);
    const zoomValue=$("#cropZoomValue");
    if(zoomValue)zoomValue.textContent=`${Math.round(newZoom*100)} %`;
    drawCrop();
    return;
  }

  if(pointer&&pointer.id===e.pointerId&&cropPointers.size===1){
    cropState.x=pointer.ox+(e.clientX-pointer.x)*canvasPerCssX;
    cropState.y=pointer.oy+(e.clientY-pointer.y)*canvasPerCssY;
    drawCrop();
  }
},{passive:false});

function endCropPointer(e){
  const wasPinching=cropPointers.size>=2;
  cropPointers.delete(e.pointerId);
  // Efter pinch får kvarvarande finger inte omedelbart bli ett nytt drag.
  // Det tog tidigare över med en ny referenspunkt och upplevdes som ett hack/hopp.
  if(wasPinching){
    pointer=null;
  }else if(cropPointers.size===1){
    const [id,p]=[...cropPointers.entries()][0];
    pointer={id,x:p.x,y:p.y,ox:cropState?.x||0,oy:cropState?.y||0};
  }else{
    pointer=null;
  }
  pinchStart=null;
}
["pointerup","pointercancel","lostpointercapture"].forEach(n=>$("#cropCanvas").addEventListener(n,endCropPointer));
$("#cropDone").addEventListener("click",async()=>{
  const item=activeItem(),g=geometry();
  if(!item||!g)return;
  const savedItemId=item.id;
  item.cropData={...cropState};
  const sx=Math.max(0,((g.w-g.c.width)/2-cropState.x)/g.scale);
  const sy=Math.max(0,((g.h-g.c.height)/2-cropState.y)/g.scale);
  const size=Math.min(cropImage.naturalWidth-sx,cropImage.naturalHeight-sy,g.c.width/g.scale);
  const outSize=Math.max(1,Math.min(1600,Math.round(size)));
  const out=document.createElement("canvas");
  out.width=out.height=outSize;
  out.getContext("2d",{alpha:false}).drawImage(cropImage,sx,sy,size,size,0,0,outSize,outSize);
  const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error("WebP misslyckades")),"image/webp",.84));
  item.publishBlob=blob;
  item.imageProcessingState="webp-cropped";
  await put(persistenceRecord({...item,publishBlob:blob,cropData:item.cropData,imageProcessingState:item.imageProcessingState}));
  if(item.publishUrl&&item.publishUrl.startsWith("blob:"))URL.revokeObjectURL(item.publishUrl);
  item.publishUrl=url(blob);
  item.thumbUrl=await previewSrc(item);
  recentlyAdaptedItemId=savedItemId;
  show("gridView");
  await renderGrid();
  requestAnimationFrame(()=>{
    const card=document.querySelector(`.draft-card[data-item-id="${CSS.escape(savedItemId)}"]`);
    card?.scrollIntoView?.({block:"nearest",inline:"nearest",behavior:"smooth"});
  });
  window.setTimeout(()=>{
    if(recentlyAdaptedItemId===savedItemId){
      recentlyAdaptedItemId=null;
      document.querySelector(`.draft-card[data-item-id="${CSS.escape(savedItemId)}"]`)?.classList.remove("just-adapted");
    }
  },1600);
});

$("#publishBtn").addEventListener("click",()=>{const item=activeItem();if(!item)return;$("#publishStatus").textContent=item.publishBlob?"Nästa steg kopplar den här WebP-bilden till Container13.":"Beskär bilden först så skapas publicerings-WebP lokalt.";if(!item.publishBlob)openCrop();});


function channelGridClass(count){
  if(count===1)return "grid-1";
  if(count===2)return "grid-2";
  if(count<=4)return "grid-4";
  return "grid-9";
}

function updateChannelSelectionUi(){
  const count=channelSelectedIds.size;
  const label=$("#channelSelectedCount");
  if(label)label.textContent=count===1?"1 vald":`${count} valda`;
  const button=$("#channelContinueBtn");
  if(button)button.disabled=count===0;
}

function renderChannelPager(pageCount){
  const pager=$("#channelSelectPager");
  if(!pager)return;
  pager.replaceChildren();
  pager.hidden=pageCount<=1;
  for(let i=0;i<pageCount;i+=1){
    const dot=document.createElement("button");
    dot.type="button";
    dot.className="ccc-draft-page-dot";
    dot.setAttribute("aria-label",`Visa sida ${i+1} av ${pageCount}`);
    dot.setAttribute("aria-current",String(i===channelSelectPage));
    dot.addEventListener("click",async()=>{channelSelectPage=i;await renderChannelSelection();});
    pager.append(dot);
  }
}

async function renderChannelSelection(){
  const grid=$("#channelSelectGrid");
  if(!grid)return;
  grid.replaceChildren();
  const pageCount=Math.max(1,Math.ceil(items.length/CHANNEL_PER_PAGE));
  channelSelectPage=Math.max(0,Math.min(channelSelectPage,pageCount-1));
  const start=channelSelectPage*CHANNEL_PER_PAGE;
  const end=Math.min(items.length,start+CHANNEL_PER_PAGE);
  const count=Math.max(0,end-start);
  grid.className=`draft-grid channel-select-grid ${channelGridClass(count)}`;

  for(let index=start;index<end;index+=1){
    const item=items[index];
    const button=document.createElement("button");
    button.type="button";
    button.className="draft-card channel-select-card";
    button.dataset.itemId=item.id;
    button.setAttribute("aria-label",`Markera ${title(item,index)}`);

    const img=document.createElement("img");
    img.src=item.thumbUrl||await previewSrc(item);
    img.alt=title(item,index);
    img.decoding="async";
    button.append(img);

    const mark=document.createElement("span");
    mark.className="channel-select-mark";
    mark.textContent=channelSelectedIds.has(item.id)?"✓":"";
    button.classList.toggle("is-selected",channelSelectedIds.has(item.id));
    button.append(mark);

    // Samma långtrycks-preview som i Förbered.
    bindDraftPreview(button,img);

    let tap=null,lastTap=0,singleTimer=null,lastTouchHandled=0;
    button.addEventListener("pointerdown",e=>{
      if(e.pointerType!=="touch"&&e.pointerType!=="pen")return;
      tap={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),moved:false};
    },{passive:true});
    button.addEventListener("pointermove",e=>{
      if(!tap||tap.id!==e.pointerId)return;
      if(Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>12)tap.moved=true;
    },{passive:true});
    button.addEventListener("pointerup",e=>{
      if(!tap||tap.id!==e.pointerId)return;
      const now=performance.now(),isTap=!tap.moved&&now-tap.t<360;
      tap=null;
      if(!isTap)return;
      lastTouchHandled=Date.now();
      e.preventDefault();
      if(draftPreviewSuppressClick){
        draftPreviewSuppressClick=false;
        if(singleTimer){clearTimeout(singleTimer);singleTimer=null;}
        return;
      }
      if(now-lastTap<330){
        lastTap=0;
        if(singleTimer){clearTimeout(singleTimer);singleTimer=null;}
        openImageQuickLook(itemImageSrc(index)||img.src,title(item,index));
      }else{
        lastTap=now;
        if(singleTimer)clearTimeout(singleTimer);
        singleTimer=window.setTimeout(async()=>{
          singleTimer=null;
          channelSelectedIds.has(item.id)?channelSelectedIds.delete(item.id):channelSelectedIds.add(item.id);
          await renderChannelSelection();
        },340);
      }
    },{passive:false});
    button.addEventListener("click",async e=>{
      if(Date.now()-lastTouchHandled<700){e.preventDefault();return;}
      if(draftPreviewSuppressClick){draftPreviewSuppressClick=false;e.preventDefault();return;}
      channelSelectedIds.has(item.id)?channelSelectedIds.delete(item.id):channelSelectedIds.add(item.id);
      await renderChannelSelection();
    });
    grid.append(button);
  }

  renderChannelPager(pageCount);
  updateChannelSelectionUi();
}

$("#channelContinueBtn")?.addEventListener("click",async()=>{
  if(!channelSelectedIds.size)return;
  await renderChannelConfirmation();
  show("channelConfirmView");
});


let channelToastTimer=0;
function showChannelUnavailable(channel){
  const toast=$("#channelToast");
  if(!toast)return;
  toast.textContent=`${channel} är inte anslutet ännu. Härifrån kommer du senare kunna ansluta kanalen.`;
  toast.hidden=false;
  toast.classList.add("is-visible");
  clearTimeout(channelToastTimer);
  channelToastTimer=window.setTimeout(()=>{
    toast.classList.remove("is-visible");
    window.setTimeout(()=>{toast.hidden=true;},180);
  },2300);
}
document.querySelectorAll(".channel-option.is-unavailable").forEach(button=>{
  button.addEventListener("click",()=>showChannelUnavailable(button.dataset.channel||"Kanalen"));
});

async function renderChannelConfirmation(){
  const selected=items.filter(item=>channelSelectedIds.has(item.id));
  const grid=$("#confirmGrid");
  if(!grid)return;
  grid.replaceChildren();
  grid.className=`draft-grid confirm-grid ${channelGridClass(selected.length)}`;
  $("#confirmPublishBtn").textContent=selected.length===1?"Publicera 1 plagg":`Publicera ${selected.length} plagg`;
  const c13Confirm=$("#confirmC13Channel");
  if(c13Confirm){
    c13Confirm.classList.toggle("is-active",container13ChannelSelected);
    c13Confirm.setAttribute("aria-pressed",String(container13ChannelSelected));
  }
  $("#confirmPreviewBtn").disabled=!container13ChannelSelected;
  $("#confirmPublishBtn").disabled=!container13ChannelSelected;

  for(const item of selected){
    const index=Math.max(0,itemIndexById(item.id));
    const card=document.createElement("button");
    card.type="button";
    card.className="draft-card confirm-card";
    card.setAttribute("aria-label",`Förhandsvisa ${title(item,index)}`);
    const img=document.createElement("img");
    img.src=item.thumbUrl||await previewSrc(item);
    img.alt=title(item,index);
    img.decoding="async";
    card.append(img);
    bindDraftPreview(card,img);
    card.addEventListener("dblclick",e=>{
      e.preventDefault();
      openImageQuickLook(itemImageSrc(index)||img.src,title(item,index));
    });
    grid.append(card);
  }
}

$("#container13ChannelBtn")?.addEventListener("click",()=>{
  container13ChannelSelected=!container13ChannelSelected;
  const button=$("#container13ChannelBtn");
  button.classList.toggle("is-chosen",container13ChannelSelected);
  button.setAttribute("aria-pressed",String(container13ChannelSelected));
  const next=$("#channelNextBtn");
  if(next)next.disabled=!container13ChannelSelected;
});

$("#channelNextBtn")?.addEventListener("click",async()=>{
  if(!container13ChannelSelected)return;
  channelSelectedIds.clear();
  channelSelectPage=0;
  const label=$("#channelSelectionChannelLabel");
  if(label)label.textContent="Container13 hemsida";
  await renderChannelSelection();
  show("channelView");
});

function container13DisplaySettings(){
  return {
    showTitle:localStorage.getItem("ccc-publish-container13-show-title")!=="0",
    showDescription:localStorage.getItem("ccc-publish-container13-show-description")==="1"
  };
}

function container13PayloadForSelection(){
  return items.filter(item=>channelSelectedIds.has(item.id)).map(item=>({
    id:item.id,
    originalFileKey:item.originalFileKey||"",
    title:title(item,Math.max(0,itemIndexById(item.id))),
    description:String(item.description||item.fields?.description||"").trim(),
    brand:item.brand||item.fields?.brand||"",
    size:item.size||item.fields?.size||"",
    price:item.price||item.fields?.price||"",
    createdAt:new Date().toISOString()
  }));
}

async function openSitePreviewForSelection(){
  const payload=container13PayloadForSelection();
  if(!payload.length)return false;
  const displaySettings=container13DisplaySettings();
  try{
    sessionStorage.setItem("ccc-site-preview-items",JSON.stringify(payload));
    sessionStorage.setItem("ccc-site-preview-display-settings",JSON.stringify(displaySettings));
    sessionStorage.setItem("ccc-site-preview-item",JSON.stringify(payload[0]));
  }catch(error){
    console.warn("[CCC Publicera] Kunde inte spara preview-metadata",error);
  }
  const target=new URL("../site-preview/nyinkommet.html",window.location.href);
  target.searchParams.set("cccPreview","1");
  target.searchParams.set("items",payload.map(item=>item.id).join(","));
  window.location.href=target.href;
  return true;
}


$("#confirmC13Channel")?.addEventListener("click",()=>{
  container13ChannelSelected=!container13ChannelSelected;
  const button=$("#confirmC13Channel");
  button.classList.toggle("is-active",container13ChannelSelected);
  button.setAttribute("aria-pressed",String(container13ChannelSelected));
  $("#confirmPreviewBtn").disabled=!container13ChannelSelected;
  $("#confirmPublishBtn").disabled=!container13ChannelSelected;
  $("#confirmStatus").textContent=container13ChannelSelected?"":"Välj minst en kanal för att publicera.";
});
document.querySelectorAll("#channelConfirmView .confirm-channel-chip.is-unavailable").forEach(button=>{
  button.addEventListener("click",()=>showChannelUnavailable(button.dataset.channel||"Kanalen"));
});

$("#confirmPreviewBtn")?.addEventListener("click",()=>{
  if(!channelSelectedIds.size){
    $("#confirmStatus").textContent="Inga plagg är valda.";
    return;
  }
  $("#confirmStatus").textContent="Öppnar förhandsvisningen…";
  openSitePreviewForSelection();
});
$("#confirmPublishBtn")?.addEventListener("click",async()=>{
  if(!container13ChannelSelected){
    $("#confirmStatus").textContent="Välj minst en kanal för att publicera.";
    return;
  }
  const button=$("#confirmPublishBtn");
  const payload=container13PayloadForSelection();
  if(!payload.length){
    $("#confirmStatus").textContent="Inga plagg är valda.";
    return;
  }

  button.disabled=true;
  const originalLabel=button.textContent;
  button.textContent="Publicerar…";
  $("#confirmStatus").textContent="Publicerar till Container13 staging…";

  try{
    const publishedAt=new Date().toISOString();
    const stagePayload=payload.map(item=>({...item,createdAt:publishedAt,stagingPublishedAt:publishedAt}));
    const displaySettings=container13DisplaySettings();

    // Staging får INTE skriva om originalposterna i CCC:s IndexedDB.
    // Återanvänd exakt samma metadata-transport som fungerande Förhandsvisa.
    sessionStorage.setItem("ccc-site-preview-items",JSON.stringify(stagePayload));
    sessionStorage.setItem("ccc-site-preview-display-settings",JSON.stringify(displaySettings));
    sessionStorage.setItem("ccc-site-preview-item",JSON.stringify(stagePayload[0]));

    // Persistent staging-manifest innehåller bara metadata/status, aldrig bildblobbar.
    localStorage.setItem("ccc-site-stage-items",JSON.stringify(stagePayload));
    localStorage.setItem("ccc-site-stage-display-settings",JSON.stringify(displaySettings));
    localStorage.setItem("ccc-site-stage-published-at",publishedAt);
    localStorage.setItem("ccc-site-stage-status",JSON.stringify({
      channel:"container13",
      ids:stagePayload.map(item=>item.id),
      publishedAt
    }));

    $("#confirmStatus").textContent=payload.length===1
      ?"1 plagg publicerat till staging."
      :`${payload.length} plagg publicerade till staging.`;

    const target=new URL("../site-preview/nyinkommet.html",window.location.href);
    target.searchParams.set("cccStage","1");
    target.searchParams.set("items",stagePayload.map(item=>item.id).join(","));
    window.location.href=target.href;
  }catch(error){
    console.error("[CCC Publicera] Staging-publicering misslyckades",error);
    $("#confirmStatus").textContent="Publiceringen till staging misslyckades. Inga skarpa Container13-data har ändrats.";
    button.disabled=false;
    button.textContent=originalLabel;
  }
});


(async()=>{try{
  let explicit=(await getAll()).filter(r=>r.readyToPublish!==false);
  explicit=await Promise.all(explicit.map(hydrateOriginal));
  const sessionDrafts=await visionSessionDrafts();
  const merged=new Map(sessionDrafts.map(r=>[r.id,r]));
  explicit.forEach(r=>merged.set(r.id,{...(merged.get(r.id)||{}),...r}));
  let records=[...merged.values()].filter(r=>r.originalBlob||r.publishBlob||r.thumbnailBlob);
  records.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
  items=records.map(r=>({...r,thumbUrl:""}));
  $("#startDraftCount").textContent=items.length===1?"1 utkast":`${items.length} utkast`;
  show("startView");

  await Promise.all(items.map(async(item,index)=>{
    item.thumbUrl=await previewSrc(item);
    if(index===0)preloadNeighbors(0);
  }));
  await renderGrid();
}catch(e){
  console.error("[CCC Publicera] Kunde inte läsa lokala utkast",{name:e?.name,message:e?.message},e);
  $("#emptyState").hidden=false;
  $("#emptyState").innerHTML="<strong>Kunde inte läsa lokala utkast</strong><span>Försök öppna Publicera igen.</span>";
}})();
window.addEventListener("pagehide",()=>objectUrls.forEach(u=>URL.revokeObjectURL(u)));

// Dubbeltryck på beskärningsytan används inte längre för zoom.
// Zoom styrs enbart av de explicita crop-kontrollerna/pinch.

async function leavePublishDetail(){
  if(swipeCommitTimer){
    clearTimeout(swipeCommitTimer);
    swipeCommitTimer=null;
  }
  swipeGesture=null;
  swipeAnimating=false;
  $("#swipeArea")?.classList.remove("is-swiping");
  setSwipeTransforms(0,false);
  await renderGrid();
  activeItemId=null;
  show("gridView");
}


async function leavePublishCrop(){
  cropImage=null;
  cropState=null;
  pointer=null;
  await renderGrid();
  activeItemId=null;
  show("gridView");
}


$("#deleteDraftDialog")?.addEventListener("click",e=>{if(e.target===$("#deleteDraftDialog"))$("#cancelDeleteDrafts")?.click();});
$("#closePublishHelp")?.addEventListener("click",closePublishHelp);
$("#publishHelpDialog")?.addEventListener("click",e=>{if(e.target===$("#publishHelpDialog"))closePublishHelp();});

document.addEventListener("ccc:header-back",async()=>{if(currentPublishView==="gridView"&&draftSelectionMode){exitDraftSelection();return;}
  if(currentPublishView==="startView"){
    window.location.href="../dashboard/index.html";
    return;
  }
  if(currentPublishView==="channelConfirmView"){
    show("channelView");
    return;
  }
  if(currentPublishView==="channelView"){
    show("channelTargetsView");
    return;
  }
  if(currentPublishView==="channelTargetsView"){
    show("startView");
    return;
  }
  if(currentPublishView==="gridView"||currentPublishView==="publishedView"){
    show("startView");
    return;
  }
  if(currentPublishView==="detailView"){
    await leavePublishDetail();
    return;
  }
  if(currentPublishView==="cropView"){
    await leavePublishCrop();
    return;
  }
});
document.addEventListener("ccc:header-settings",()=>{
  window.location.href="../settings/index.html?module=publish";
});
document.addEventListener("ccc:core-ready",()=>{
  setPublishHeader(currentPublishView);
  configureFooterForView(currentPublishView);
},{once:true});

/* CCC cache stamp: v2.9.13 */


/* CCC cache stamp: v2.9.20 */

/* CCC cache stamp: v2.9.61 */

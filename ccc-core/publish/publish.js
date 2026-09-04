window.__CCC_HEADER_PENDING__={back:true,settings:true};
import { auth } from "../auth/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
onAuthStateChanged(auth,(user)=>{if(!user)window.location.href="../auth/index.html";});

const database=getFirestore(auth.app);
const storage=getStorage(auth.app);

const entityTerm=(form="singular",cap=false)=>window.CCC_TERMINOLOGY?.label?.(form,cap)||({singular:"objekt",plural:"objekt",definiteSingular:"objektet",definitePlural:"objekten"}[form]||"objekt");
const $=(s)=>document.querySelector(s);
const DB_NAME="ccc-local-workspace", DB_VERSION=3, STORE_NAME="images", FILE_STORE="vision-files";
let items=[],activeIndex=0,objectUrls=[];
const DRAFTS_PER_PAGE=9, PREPARED_PER_PAGE=6, CONFIRM_PER_PAGE=6;
const PAGED_GRID_GUTTER=14;
const PUBLICATION_HISTORY_KEY="ccc-publication-history-v1";
let draftPage=0,draftGridGesture=null;
let quickPublishReturnView=null;
let confirmToolItemId=null;
let confirmAddPending=false;
let workspaceStartMode=false;
let channelPickerReturnsToWorkspace=false;
let historyReturnsToWorkspace=false;
let channelTargetsReturnView="startView";
let cropReturnContext={view:"gridView",itemId:""};
let publishBackPending=false;
let draftPreviewGesture=null,draftPreviewSuppressClick=false;
let cropImage=null,cropState=null,cropBaseline=null,cropUsingCutout=false,pointer=null;
let activeItemId=null;
let recentlyAdaptedItemId=null;
let draftSelectionMode=false;const selectedDraftIds=new Set();
let pendingDraftDelete=null;
const publishedSelectedIds=new Set();
const channelSelectedIds=new Set();
let container13ChannelSelected=false;
let channelSelectPage=0;
let confirmPage=0;
const CHANNEL_PER_PAGE=6;
const decodedImageCache=new Map();
const MAX_DECODED_CACHE=3;
function updateStartCount(){
  const start=$("#startDraftCount"),detail=$("#draftCount");
  if(start)start.textContent=items.length===1?"1 utkast":`${items.length} utkast`;
  if(detail)detail.textContent=items.length===1?"1 lokalt utkast":`${items.length} lokala utkast`;
}

function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE_NAME)){const s=db.createObjectStore(STORE_NAME,{keyPath:"id"});s.createIndex("createdAt","createdAt");}if(!db.objectStoreNames.contains("sessions"))db.createObjectStore("sessions",{keyPath:"id"});if(!db.objectStoreNames.contains(FILE_STORE)){const f=db.createObjectStore(FILE_STORE,{keyPath:"id"});f.createIndex("createdAt","createdAt");}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error("IndexedDB-uppgraderingen blockerades av en annan öppen CCC-flik."));});}
async function getAll(){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readonly"),r=tx.objectStore(STORE_NAME).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function getLatestVisionSession(){const db=await openDb();return new Promise((resolve,reject)=>{if(!db.objectStoreNames.contains("sessions")){db.close();resolve(null);return;}const tx=db.transaction("sessions","readonly"),store=tx.objectStore("sessions"),r=store.get("vision-active");r.onsuccess=()=>{if(r.result){resolve(r.result);return;}const legacy=store.get("active-vision-session");legacy.onsuccess=()=>resolve(legacy.result||null);legacy.onerror=()=>reject(legacy.error);};r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
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
      cccItemId:saved.cccItemId||"",
      imageMetadata:saved.imageMetadata||null,
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

async function put(record){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readwrite");tx.objectStore(STORE_NAME).put(record);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
async function putSourceFile(id,blob,metadata=null){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(FILE_STORE,"readwrite");tx.objectStore(FILE_STORE).put({id,blob,metadata,createdAt:Date.now()});tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};tx.onabort=()=>{db.close();reject(tx.error||new Error("Bildfilens sparning avbröts."));};});}
async function putVisionSession(record){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction("sessions","readwrite");tx.objectStore("sessions").put(record);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};tx.onabort=()=>{db.close();reject(tx.error||new Error("Vision-sessionens sparning avbröts."));};});}
async function deleteDraftIds(ids){
  const wanted=new Set(ids);if(!wanted.size)return;
  const db=await openDb();
  await new Promise((resolve,reject)=>{
    const stores=[STORE_NAME,"sessions",FILE_STORE].filter(n=>db.objectStoreNames.contains(n));
    const tx=db.transaction(stores,"readwrite"),images=tx.objectStore(STORE_NAME);
    wanted.forEach(id=>images.delete(id));
    if(stores.includes("sessions")){
      const sessions=tx.objectStore("sessions");
      for(const sessionId of ["vision-active","active-vision-session"]){
        const req=sessions.get(sessionId);
        req.onsuccess=()=>{
          const s=req.result;if(!s||!Array.isArray(s.items))return;
          const removed=s.items.filter(i=>wanted.has(i.id));
          s.items=s.items.filter(i=>!wanted.has(i.id));s.count=s.items.length;s.savedAt=new Date().toISOString();sessions.put(s);
          if(stores.includes(FILE_STORE)){const files=tx.objectStore(FILE_STORE);removed.forEach(i=>{if(i.originalFileKey)files.delete(i.originalFileKey);});}
        };
      }
    }
    tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>{db.close();reject(tx.error)};tx.onabort=()=>{db.close();reject(tx.error||new Error("Kunde inte ta bort utkast."))};
  });
}
async function detachDraftIdsFromVisionSession(ids){
  const wanted=new Set(ids);if(!wanted.size)return;
  const db=await openDb();
  if(!db.objectStoreNames.contains("sessions")){db.close();return;}
  await new Promise((resolve,reject)=>{
    const tx=db.transaction("sessions","readwrite"),sessions=tx.objectStore("sessions");
    for(const sessionId of ["vision-active","active-vision-session"]){
      const req=sessions.get(sessionId);
      req.onsuccess=()=>{
        const session=req.result;if(!session||!Array.isArray(session.items))return;
        session.items=session.items.filter(item=>!wanted.has(item.id));
        session.count=session.items.length;
        session.savedAt=new Date().toISOString();
        sessions.put(session);
      };
    }
    tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};tx.onabort=()=>{db.close();reject(tx.error||new Error("Kunde inte uppdatera fotosessionen."));};
  });
}
async function archivePublishedDrafts(ids,publishedEntries=[]){
  const wanted=new Set(ids),byLocalId=new Map(publishedEntries.map(entry=>[entry.localId,entry]));
  const archivedAt=new Date().toISOString();
  for(const item of items){
    if(!wanted.has(item.id))continue;
    const entry=byLocalId.get(item.id)||{};
    item.readyToPublish=false;
    item.localArchiveState="published";
    item.lastPublishedAt=archivedAt;
    item.lastPublishedChannel="Container13 · Nyinkommet";
    item.liveImageUrl=entry.imageUrl||"";
    item.liveDocumentId=entry.documentId||"";
    item.isLivePublished=true;
    await put(persistenceRecord(item));
  }
  await detachDraftIdsFromVisionSession(ids);
}
async function getSourceFile(key){if(!key)return null;const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(FILE_STORE,"readonly"),r=tx.objectStore(FILE_STORE).get(key);r.onsuccess=()=>resolve(r.result?.blob||null);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function hydrateOriginal(record){if(record.originalBlob||!record.originalFileKey)return record;const blob=await getSourceFile(record.originalFileKey);return blob?{...record,originalBlob:blob}:record;}
function createCccItemId(){
  const d=new Date();
  const y=String(d.getFullYear());
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  const entropy=(globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`)
    .replace(/[^a-zA-Z0-9]/g,"").slice(-6).toUpperCase();
  return `C13-${y}${m}${day}-${entropy}`;
}
function ensureCccIdentity(item){
  if(!item.cccItemId)item.cccItemId=createCccItemId();
  return item.cccItemId;
}
function buildPublishMetadata(item){
  const fields=item?.fields||{};
  return {
    schemaVersion:1,
    cccItemId:ensureCccIdentity(item),
    title:String(item?.title||fields.title||"").trim(),
    brand:String(item?.brand||fields.brand||fields.manufacturer||"").trim(),
    size:String(item?.size||fields.size||"").trim(),
    price:String(item?.price||fields.price||"").trim(),
    description:String(item?.description||fields.description||"").trim(),
    source:"ccc",
    updatedAt:new Date().toISOString()
  };
}

function removeLegacyDemoState(item){
  if(item?.demoWatermark!==true)return false;
  delete item.demoWatermark;
  delete item.imageMetadata?.demoWatermark;
  /* Äldre demokopior kan ha vattenstämpeln inbränd i publishBlob.
     Kasta därför bara den genererade kopian och återgå säkert till originalet. */
  item.publishBlob=null;
  item.publishUrl="";
  item.cropData=null;
  item.imageProcessingState="original";
  return true;
}

async function ensurePublishSource(item){
  if(!item)return "";
  if(!item.originalBlob && item.originalFileKey){
    try{
      const blob=await getSourceFile(item.originalFileKey);
      if(blob)item.originalBlob=blob;
    }catch(error){
      console.warn("[CCC Publicera] Vision-originalet kunde inte hämtas",item.id,error);
    }
  }
  if(item.publishBlob){
    /* blob:-adresser gäller bara i dokumentet där de skapades. Äldre utkast
       kan innehålla en sparad men ogiltig adress; skapa då en ny från Blob. */
    if(!item.publishUrl||!objectUrls.includes(item.publishUrl))item.publishUrl=url(item.publishBlob);
    return item.publishUrl;
  }
  if(item.thumbUrl)return item.thumbUrl;
  if(item.originalBlob||item.thumbnailBlob){
    item.thumbUrl=await previewSrc(item);
    return item.thumbUrl;
  }
  return item.fullUrl||"";
}

async function ensureOriginalSource(item){
  if(!item)return "";
  if(!item.originalBlob&&item.originalFileKey){
    try{item.originalBlob=await getSourceFile(item.originalFileKey);}
    catch(error){console.warn("[CCC Publicera] Originalbilden kunde inte hämtas",item.id,error);}
  }
  if(item.originalBlob)return url(item.originalBlob);
  return item.fullUrl||item.thumbUrl||await previewSrc(item);
}

function persistenceRecord(item){const record={...item};delete record.thumbUrl;delete record.fullUrl;delete record.publishUrl;if(record.originalFileKey)delete record.originalBlob;return record;}
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
function title(item,index){return item.title?.trim()||item.fields?.title?.trim()||`${entityTerm("singular",true)} ${index+1}`;}
function resetViewScroll(view){
  const el=$("#"+view);
  if(!el)return;
  try{el.scrollTop=0;}catch(_){}
  const scrollChild=el.querySelector(".draft-grid,.publish-scroll,.crop-view");
  if(scrollChild)try{scrollChild.scrollTop=0;}catch(_){}
}
const publishEntryParams = new URLSearchParams(window.location.search);
const directPrepareView = publishEntryParams.get("view") === "prepare";
const legacyPublishStart = publishEntryParams.get("legacyStart") === "1";
const directPrepareItemId = publishEntryParams.get("item") || "";
const directPrepareItemIds = (publishEntryParams.get("items")||directPrepareItemId)
  .split(",").map(value=>value.trim()).filter(Boolean);
const directPrepareToolItemId = publishEntryParams.get("toolItem") || "";
const directPrepareOrigin = publishEntryParams.get("from") || "";
const publishAddCameraReturn = directPrepareOrigin === "vision-publish-add";
const PUBLISH_ADD_STATE_KEY = "ccc-publish-add-camera-state";
const directFromVisionEdit = directPrepareOrigin === "vision-edit" && !!directPrepareItemId;
const directFromVisionExpress = directPrepareOrigin === "vision-camera-express" && directPrepareItemIds.length>0;
const directFromVisionWorkspace = directPrepareOrigin === "vision-workspace";
const directFromVisionReady = directPrepareOrigin === "vision-ready";
const directFromVisionReview = directPrepareOrigin === "vision-review-return";
const directReturnWorkspace = publishEntryParams.get("workspace") === "1";
const directReviewParent = publishEntryParams.get("returnParent") || "";
let directPrepareBackGuard = directFromVisionEdit||directFromVisionExpress||directFromVisionWorkspace||directFromVisionReady||directFromVisionReview;
let currentPublishView="startView";
const PUBLISH_SETTINGS_RETURN_KEY="ccc-publish-settings-return";

function rememberPublishSettingsReturn(){
  try{sessionStorage.setItem(PUBLISH_SETTINGS_RETURN_KEY,JSON.stringify({
    createdAt:Date.now(),view:currentPublishView,activeItemId,activeIndex,
    selectedIds:[...channelSelectedIds],confirmToolItemId,container13ChannelSelected,
    workspaceStartMode,channelPickerReturnsToWorkspace,historyReturnsToWorkspace,
    channelTargetsReturnView,cropReturnContext:{...cropReturnContext},quickPublishReturnView,
    draftSelectionMode,selectedDraftIds:[...selectedDraftIds],draftPage,channelSelectPage,confirmPage
  }));}catch(_){ }
}
function takePublishSettingsReturn(){
  if(new URLSearchParams(window.location.search).get("settingsReturn")!=="1")return null;
  try{
    const raw=sessionStorage.getItem(PUBLISH_SETTINGS_RETURN_KEY);
    sessionStorage.removeItem(PUBLISH_SETTINGS_RETURN_KEY);
    const state=raw?JSON.parse(raw):null;
    return state&&Date.now()-Number(state.createdAt||0)<15*60*1000?state:null;
  }catch(_){return null;}
}

function finishDirectPrepareBootstrap(){
  document.documentElement.classList.remove("ccc-publish-booting");
  document.documentElement.classList.remove("ccc-direct-prepare-loading");
  if(!directFromVisionEdit&&!directFromVisionExpress&&!directFromVisionWorkspace&&!directFromVisionReady&&!directFromVisionReview){
    directPrepareBackGuard=false;
    return;
  }
  window.setTimeout(()=>{directPrepareBackGuard=false;},650);
}

function readPublishAddCameraState(){
  try{
    const raw=sessionStorage.getItem(PUBLISH_ADD_STATE_KEY);
    if(!raw)return null;
    const value=JSON.parse(raw);
    if(!value||Date.now()-Number(value.createdAt||0)>15*60*1000){
      sessionStorage.removeItem(PUBLISH_ADD_STATE_KEY);
      return null;
    }
    return value;
  }catch(_){return null;}
}
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
  if(view==="cropView")startCropFooterGuard();
  else stopCropFooterGuard();
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
    #draftGrid .draft-card{-webkit-touch-callout:none!important;-webkit-tap-highlight-color:transparent!important;-webkit-user-select:none!important;user-select:none!important;appearance:none!important;-webkit-appearance:none!important}
    #draftGrid .draft-card img{pointer-events:none!important;-webkit-user-drag:none!important;-webkit-user-select:none!important;user-select:none!important;-webkit-tap-highlight-color:transparent!important}
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
function closeAnyDraftPreview(){
  if(draftPreviewGesture?.preview)closeDraftPreview(); else clearDraftPreviewGesture();
  document.querySelectorAll(".ccc-draft-preview-layer,.ccc-draft-preview-image").forEach(node=>node.remove());
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
  const globalFinish=e=>{
    const g=draftPreviewGesture;
    if(!g||g.id!==e.pointerId)return;
    if(g.longPressed)closeAnyDraftPreview(); else clearDraftPreviewGesture();
  };
  window.addEventListener("pointerup",globalFinish,{once:true});
  window.addEventListener("pointercancel",globalFinish,{once:true});
}

/* Dubbeltryck tas bort: enkeltryck, långtryck och swipe ska inte konkurrera. */

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
  const pages=Math.ceil(items.length/PREPARED_PER_PAGE);
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
function pageVisualRange(page,perPage,sourceItems=items){
  const start=page*perPage;
  return {start,end:Math.min(sourceItems.length,start+perPage)};
}
function pageGhostCard(item,index,kind){
  const card=document.createElement("div");
  card.className=`draft-card ${kind==="channel"?"channel-select-card":kind==="confirm"?"confirm-card":""}`;
  const img=document.createElement("img");
  img.src=item.thumbUrl||itemImageSrc(Math.max(0,itemIndexById(item.id)))||"";
  img.alt="";
  img.decoding="async";
  card.append(img);

  if(kind==="draft" && item.imageProcessingState==="webp-cropped" && item.publishBlob){
    const badge=document.createElement("span");
    badge.className="draft-adapted-badge";
    badge.textContent="✓";
    card.append(badge);
  }
  if(kind==="channel"){
    const mark=document.createElement("span");
    mark.className="channel-select-mark";
    const selected=channelSelectedIds.has(item.id);
    mark.textContent=selected?"✓":"";
    card.classList.toggle("is-selected",selected);
    card.append(mark);
  }
  return card;
}
function appendGridPlaceholders(grid,count,perPage=DRAFTS_PER_PAGE){
  for(let index=count;index<perPage;index+=1){
    const placeholder=document.createElement("span");
    placeholder.className="draft-grid-placeholder";
    placeholder.setAttribute("aria-hidden","true");
    grid.append(placeholder);
  }
}
function removePagedGridGhosts(){
  document.querySelectorAll(".ccc-paged-grid-ghost").forEach(node=>node.remove());
}
function ensurePagedGridViewport(grid){
  const coreViewport=window.CCC_CORE?.swipe?.ensureViewport?.(grid);
  if(coreViewport)return coreViewport;
  if(grid?.parentElement?.classList.contains("ccc-swipe-viewport"))return grid.parentElement;
  const parent=grid?.parentNode;
  if(!parent)return null;
  const viewport=document.createElement("div");
  viewport.className="ccc-swipe-viewport";
  parent.insertBefore(viewport,grid);
  viewport.appendChild(grid);
  return viewport;
}
function createPageGhost(grid,kind,page,perPage,sourceItems=items){
  removePagedGridGhosts();
  const rect=grid.getBoundingClientRect();
  const viewport=ensurePagedGridViewport(grid)||grid.parentElement;
  const viewportRect=viewport?.getBoundingClientRect?.()||{left:rect.left,top:rect.top};
  const ghost=document.createElement("div");
  ghost.className=`ccc-paged-grid-ghost draft-grid ${kind==="channel"?"channel-select-grid":kind==="confirm"?"confirm-grid":""}`;
  const range=pageVisualRange(page,perPage,sourceItems);
  const count=Math.max(0,range.end-range.start);
  ghost.classList.add(channelGridClass(count));
  ghost.style.setProperty("left",`${rect.left-viewportRect.left}px`,"important");
  ghost.style.setProperty("top",`${rect.top-viewportRect.top}px`,"important");
  ghost.style.setProperty("width",`${rect.width}px`,"important");
  ghost.style.setProperty("height",`${rect.height}px`,"important");
  const gridStyle=getComputedStyle(grid);
  ghost.style.setProperty("grid-template-columns",gridStyle.gridTemplateColumns,"important");
  ghost.style.setProperty("column-gap",gridStyle.columnGap,"important");
  ghost.style.setProperty("row-gap",gridStyle.rowGap,"important");
  ghost.style.setProperty("padding",gridStyle.padding,"important");
  ghost.style.setProperty("box-shadow","none","important");
  ghost.style.setProperty("filter","none","important");
  for(let index=range.start;index<range.end;index+=1){
    ghost.append(pageGhostCard(sourceItems[index],index,kind));
  }
  appendGridPlaceholders(ghost,count,perPage);
  (viewport||grid.parentElement||document.body).append(ghost);
  return ghost;
}
function softenPageSwipe(dx,width,atEdge=false){
  const swipeCore=window.CCC_CORE?.swipe;
  if(swipeCore?.offset)return swipeCore.offset(dx,width,{atEdge});
  const sign=Math.sign(dx)||1;
  const raw=Math.min(Math.abs(dx),width*1.08);
  if(atEdge)return sign*Math.min(raw*.28,width*.18);
  const softened=raw<=width*.78 ? raw*.985 : width*.7683+(raw-width*.78)*.72;
  return sign*softened;
}
function setPagedGridTransform(grid,ghost,offset,width,direction,animate=false){
  const transition=animate
    ? (window.CCC_CORE?.swipe?.transition?.()||"transform 580ms cubic-bezier(.20,.58,.16,1)")
    : "none";
  const travel=width+PAGED_GRID_GUTTER;
  grid.style.transition=transition;
  grid.style.transform=`translate3d(${offset}px,0,0)`;
  if(ghost){
    ghost.style.transition=transition;
    ghost.style.transform=`translate3d(${offset+(direction>0?travel:-travel)}px,0,0)`;
  }
}
function bindPagedGridSwipe({gridId,kind,getPage,setPage,perPage,render,getItems=()=>items}){
  const grid=$(gridId);
  if(!grid||grid.dataset.cccSmoothSwipeBound)return;
  ensurePagedGridViewport(grid);
  grid.dataset.cccSmoothSwipeBound="1";
  let swipe=null;
  let suppressUntil=0;
  let ghost=null;
  let ghostDirection=0;

  const clearGhost=()=>{
    ghost?.remove();
    ghost=null;
    ghostDirection=0;
  };

  grid.addEventListener("click",event=>{
    if(performance.now()<suppressUntil){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);

  const setTransform=(dx,animate=false)=>{
    setPagedGridTransform(grid,ghost,dx,Math.max(1,grid.clientWidth),ghostDirection,animate);
  };

  const begin=(x,y,id,target)=>{
    if(Math.ceil(getItems().length/perPage)<=1)return false;
    closeAnyDraftPreview();
    clearGhost();
    swipe={id,x,y,dx:0,dy:0,horizontal:false,target};
    setTransform(0,false);
    return true;
  };

  const move=(x,y,event)=>{
    if(!swipe)return;
    const dx=x-swipe.x;
    const dy=y-swipe.y;
    swipe.dx=dx; swipe.dy=dy;

    const swipeCore=window.CCC_CORE?.swipe;
    if(!swipe.horizontal&&(swipeCore?.isHorizontal?.(dx,dy)??(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.25))){
      swipe.horizontal=true;
      clearDraftPreviewGesture();
    }
    if(!swipe.horizontal)return;

    event.preventDefault();
    draftPreviewSuppressClick=true;
    const page=getPage();
    const last=Math.ceil(getItems().length/perPage)-1;
    const atEdge=(page===0&&dx>0)||(page===last&&dx<0);
    const direction=dx<0?1:-1;
    if(!atEdge&&direction!==ghostDirection){
      clearGhost();
      ghostDirection=direction;
      ghost=createPageGhost(grid,kind,page+direction,perPage,getItems());
    }
    setTransform(softenPageSwipe(dx,Math.max(1,grid.clientWidth),atEdge),false);
  };

  const finish=async()=>{
    if(!swipe)return;
    const {dx,horizontal}=swipe;
    swipe=null;

    if(!horizontal){
      setTransform(0,true);
      window.setTimeout(clearGhost,(window.CCC_CORE?.swipe?.profile?.snapMs||580)+10);
      draftPreviewSuppressClick=false;
      return;
    }

    const width=Math.max(1,grid.clientWidth);
    const oldPage=getPage();
    let next=oldPage;
    const commit=window.CCC_CORE?.swipe?.shouldCommit?.(dx,width)??Math.abs(dx)>Math.max(72,width*.24);
    if(commit)next=oldPage+(dx<0?1:-1);
    const last=Math.max(0,Math.ceil(getItems().length/perPage)-1);
    next=Math.max(0,Math.min(next,last));

    const changed=next!==oldPage;
    /* Ghost-sidan startar en hel sidbredd + gutter från aktuell sida.
       Snapen måste färdas exakt samma sträcka, annars stannar den nya sidan
       vid guttern och hoppar på plats först när den gamla sidan rensas. */
    const travel=width+PAGED_GRID_GUTTER;
    setTransform(changed?(dx<0?-travel:travel):0,true);
    if(changed){
      suppressUntil=performance.now()+(window.CCC_CORE?.swipe?.profile?.snapMs||580)+220;
      window.setTimeout(async()=>{
        setPage(next);
        /* Den bortgående gridden får inte ligga kvar som ett halvtransparent
           lager medan nästa sida bygger sina miniatyrer. Målsidan (ghost)
           ligger kvar synlig tills den riktiga gridden är färdig. */
        grid.style.visibility="hidden";
        grid.style.transition="none";
        await render();
        setTransform(0,false);
        grid.style.visibility="visible";
        clearGhost();
      },(window.CCC_CORE?.swipe?.profile?.snapMs||580)+10);
    }else{
      window.setTimeout(clearGhost,(window.CCC_CORE?.swipe?.profile?.snapMs||580)+10);
    }
    window.setTimeout(()=>{draftPreviewSuppressClick=false;},(window.CCC_CORE?.swipe?.profile?.snapMs||580)+80);
  };

  grid.addEventListener("touchstart",event=>{
    if(event.touches.length!==1)return;
    const t=event.touches[0];
    begin(t.clientX,t.clientY,"touch",event.target);
  },{passive:true});
  grid.addEventListener("touchmove",event=>{
    if(!swipe||event.touches.length!==1)return;
    const t=event.touches[0];
    move(t.clientX,t.clientY,event);
  },{passive:false});
  grid.addEventListener("touchend",finish,{passive:false});
  grid.addEventListener("touchcancel",finish,{passive:true});

  grid.addEventListener("pointerdown",event=>{
    if(event.pointerType!=="mouse"||event.button!==0)return;
    begin(event.clientX,event.clientY,event.pointerId,event.target);
  });
  grid.addEventListener("pointermove",event=>{
    if(event.pointerType!=="mouse"||!swipe||swipe.id!==event.pointerId)return;
    move(event.clientX,event.clientY,event);
  });
  grid.addEventListener("pointerup",event=>{
    if(event.pointerType==="mouse"&&swipe?.id===event.pointerId)finish();
  });
  grid.addEventListener("pointercancel",event=>{
    if(event.pointerType==="mouse"&&swipe?.id===event.pointerId){
      swipe=null;
      setTransform(0,true);
      window.setTimeout(clearGhost,(window.CCC_CORE?.swipe?.profile?.snapMs||580)+10);
    }
  });
}
function bindDraftGridSwipe(){
  bindPagedGridSwipe({
    gridId:"#draftGrid",
    kind:"draft",
    getPage:()=>draftPage,
    setPage:value=>{draftPage=value;},
    perPage:PREPARED_PER_PAGE,
    render:renderGrid
  });
}
function bindChannelGridSwipe(){
  bindPagedGridSwipe({
    gridId:"#channelSelectGrid",
    kind:"channel",
    getPage:()=>channelSelectPage,
    setPage:value=>{channelSelectPage=value;},
    perPage:CHANNEL_PER_PAGE,
    render:renderChannelSelection
  });
}
function selectedChannelItems(){return items.filter(item=>channelSelectedIds.has(item.id));}
function bindConfirmGridSwipe(){
  bindPagedGridSwipe({
    gridId:"#confirmGrid",
    kind:"confirm",
    getPage:()=>confirmPage,
    setPage:value=>{confirmPage=value;},
    perPage:CONFIRM_PER_PAGE,
    getItems:selectedChannelItems,
    render:()=>renderChannelConfirmation(false)
  });
}


function helpHtmlForView(view){
  if(view==="gridView")return `
    <div class="help-row"><strong>Tryck</strong><br>${entityTerm("definiteSingular",true)} öppnas här.</div>
    <div class="help-row"><strong>Långtryck</strong><br>Snabbzoom/förhandsvisning.</div>
    <div class="help-row"><strong>Bilderna</strong><br>Tryck på ett ${entityTerm("singular")} för att öppna det. Där kan du fortfarande kontrollera och anpassa bilden innan publicering.</div>
      <div class="help-row"><strong>Grön bock ✓</strong><br>Bilden har en sparad bildanpassning. Du kan fortfarande öppna ${entityTerm("definiteSingular")} och ändra den.</div>
      <div class="help-row"><strong>Röd bock ✓</strong><br>Visas i Välj-läget och betyder att utkastet är markerat för borttagning. Inget tas bort förrän du trycker Ta bort och bekräftar.</div>
      <div class="help-row"><strong>Fortsätt</strong><br>Går vidare med de färdiga ${entityTerm("plural")} till val av kanal.</div>
      <div class="help-row"><strong>Välj</strong><br>Öppnar läget där du kan markera lokala utkast för borttagning.</div>`;
  if(view==="detailView")return `<div class="help-row"><strong>Grön ✓</strong><br>Bilden har en sparad anpassning men kan ändras igen.</div><div class="help-row"><strong>Anpassa bild</strong><br>Gör den automatiska bildanpassningen när den behövs.</div><div class="help-row"><strong>Publicera</strong><br>Tar aktuellt objekt direkt till sista kontrollvyn.</div><div class="help-row"><strong>Klar – tillbaka till bilderna</strong><br>Återgår till Förbered så att du kan fortsätta med nästa bild.</div>`;
  if(view==="cropView")return `<div class="help-row"><strong>Anpassa bild</strong><br>Dra, nypzooma eller använd verktygen för att placera bilden.</div><div class="help-row"><strong>Hela bilden / Fyll ytan</strong><br>Välj om hela originalet ska synas eller om bilden ska fylla publiceringsytan.</div><div class="help-row"><strong>Rotera / Återställ</strong><br>Rotera 90 grader eller återgå till hela originalbilden.</div><div class="help-row"><strong>Frilägg</strong><br>Testar lokal bakgrundsborttagning. Jämför Original och Frilagd och justera känsligheten innan du använder resultatet.</div><div class="help-row"><strong>Bakgrund</strong><br>Platsen är förberedd och byggs efter att friläggningen testats.</div><div class="help-row"><strong>Spara anpassning</strong><br>Sparar en separat publiceringsvariant och bevarar originalet.</div>`;
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
function quickPublishCurrentCrop(){
  if(currentPublishView!=="cropView"||!activeItem())return;
  cropQuickPublishRequested=true;
  commitCropAdjustment({force:true});
}

async function quickPublishCurrentDetail(){
  const item=activeItem();
  if(currentPublishView!=="detailView"||!item)return;
  quickPublishReturnView="detailView";
  channelSelectedIds.clear();
  channelSelectedIds.add(item.id);
  channelSelectPage=0;
  confirmPage=0;
  container13ChannelSelected=false;
  await renderChannelConfirmation();
  if(directPrepareToolItemId&&selected.includes(directPrepareToolItemId)){
    confirmToolItemId=directPrepareToolItemId;
    syncConfirmToolUi();
  }
  show("channelConfirmView");
}

async function openDirectVisionConfirmation(itemIds){
  const requested=(Array.isArray(itemIds)?itemIds:[itemIds]).filter(Boolean);
  const selected=requested.filter(id=>itemIndexById(id)>=0);
  if(!selected.length)return false;
  for(const id of selected)await ensurePublishSource(items[itemIndexById(id)]);
  activeIndex=itemIndexById(selected[0]);
  activeItemId=items[activeIndex]?.id||null;
  quickPublishReturnView=null;
  channelSelectedIds.clear();
  selected.forEach(id=>channelSelectedIds.add(id));
  channelSelectPage=0;
  confirmPage=0;
  const restoredToolItemId=directPrepareToolItemId&&selected.includes(directPrepareToolItemId)
    ?directPrepareToolItemId
    :null;
  confirmToolItemId=null;
  container13ChannelSelected=false;
  await renderChannelConfirmation();
  if(restoredToolItemId){
    confirmToolItemId=restoredToolItemId;
    syncConfirmToolUi();
  }
  show("channelConfirmView");
  return true;
}

function setCropFooterLikeVision(){
  if(currentPublishView!=="cropView"||cropReturnContext.view==="channelConfirmView")return;
  const footer=window.CCC_CORE?.footer;
  if(!footer)return;
  footer.setTools({
    help:true,
    onHelp:openPublishHelp,
    forward:true,
    forwardLabel:"Publicera",
    forwardIcon:"→",
    onForward:quickPublishCurrentCrop
  });
}

function startCropFooterGuard(){
  setCropFooterLikeVision();
  /* Core kan bli klart i samma bildruta som Anpassa öppnas. Några korta,
     villkorade omtag gör samma deklarativa setTools-anrop som Vision och
     lämnar inga observer/listeners efter sig. */
  [0,60,180].forEach(delay=>window.setTimeout(()=>{
    if(currentPublishView==="cropView")setCropFooterLikeVision();
  },delay));
}

function stopCropFooterGuard(){}
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
  if(view==="detailView"){
    Object.assign(config,{
      forward:true,
      forwardLabel:"Publicera",
      forwardIcon:"→",
      onForward:quickPublishCurrentDetail
    });
  }
  if(view==="cropView"&&cropReturnContext.view!=="channelConfirmView"){
    Object.assign(config,{
      forward:true,
      forwardLabel:"Publicera",
      forwardIcon:"→",
      onForward:quickPublishCurrentCrop
    });
  }
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
  draftPage=Math.min(draftPage,Math.max(0,Math.ceil(items.length/PREPARED_PER_PAGE)-1));

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

  const pages=Math.max(1,Math.ceil(items.length/PREPARED_PER_PAGE));
  draftPage=Math.max(0,Math.min(draftPage,pages-1));
  const pageStart=draftPage*PREPARED_PER_PAGE;
  const pageEnd=Math.min(items.length,pageStart+PREPARED_PER_PAGE);
  const visibleCount=Math.max(0,pageEnd-pageStart);
  applySharedPublishGridClass(grid,visibleCount);
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

    let thumbTap=null,lastTouchHandledAt=0;
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
      if(draftPreviewSuppressClick){draftPreviewSuppressClick=false;return;}
      openDetailById(itemId);
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
  appendGridPlaceholders(grid,visibleCount,PREPARED_PER_PAGE);
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
    if(!item.publishUrl||!objectUrls.includes(item.publishUrl))item.publishUrl=url(item.publishBlob);
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
    img.style.transition=animate
      ? (window.CCC_CORE?.swipe?.transition?.()||"transform 580ms cubic-bezier(.20,.58,.16,1)")
      : "none";
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
async function openDetailById(itemId){
  const index=itemIndexById(itemId);
  if(index<0){
    console.warn("[CCC Publicera] Hittade inte utkastet som miniatyren pekade på",itemId);
    return;
  }
  const source=await ensurePublishSource(items[index]);
  if(!source){
    console.warn("[CCC Publicera] Bildkälla saknas för utkastet",itemId);
  }
  openDetail(index);
  if(source)$("#detailImage").src=source;
}
function openDetail(index){
  if(!items.length)return;
  if(swipeCommitTimer){
    clearTimeout(swipeCommitTimer);
    swipeCommitTimer=null;
  }
  swipeGesture=null;
  swipeAnimating=false;
  $("#swipeArea")?.classList.remove("is-swiping","swipe-to-next","swipe-to-prev");

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
    const swipeCore=window.CCC_CORE?.swipe;
    if(!(swipeCore?.isHorizontal?.(dx,dy)??(Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.25))){
      if(Math.abs(dy)>Math.abs(dx)*1.25){
        swipeGesture=null;
      }
      return;
    }
    if(Math.abs(dy)>Math.abs(dx)*1.25){
      swipeGesture=null;
      return;
    }
    swipeGesture.horizontal=true;
  }

  e.preventDefault();
  const width=Math.max(1,e.currentTarget.clientWidth);
  const limited=window.CCC_CORE?.swipe?.offset?.(dx,width)??dx;
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
  const commit=window.CCC_CORE?.swipe?.shouldCommit?.(gesture.dx,width)??Math.abs(gesture.dx)>Math.max(72,width*.24);
  if(!commit){
    setSwipeTransforms(0,true);
    return;
  }

  const delta=gesture.dx<0?1:-1;
  const target=gesture.dx<0?-width:width;
  const targetItem=items[normalizedIndex(activeIndex+delta)];
  const targetItemId=targetItem?.id;
  swipeAnimating=true;
  area.classList.toggle("swipe-to-next",delta>0);
  area.classList.toggle("swipe-to-prev",delta<0);
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
    area.classList.remove("swipe-to-next","swipe-to-prev");
    swipeAnimating=false;
  },(window.CCC_CORE?.swipe?.profile?.snapMs||580)+10);
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
  channelTargetsReturnView="gridView";
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
  channelTargetsReturnView="startView";
  show("channelTargetsView");
});
function firestoreTime(value){
  if(!value)return 0;
  if(typeof value.toMillis==="function")return value.toMillis();
  if(typeof value.seconds==="number")return value.seconds*1000;
  return Date.parse(value)||0;
}

async function fetchPublishedNewArrivals(){
  const snapshot=await getDocs(query(collection(database,"gallery"),orderBy("createdAt","desc")));
  return snapshot.docs
    .map(entry=>({id:entry.id,...entry.data()}))
    .filter(item=>item.category==="nyinkommet"&&String(item.imageUrl||"").trim())
    .sort((a,b)=>firestoreTime(b.createdAt)-firestoreTime(a.createdAt));
}

function publicationDateText(value){
  const millis=firestoreTime(value);
  if(!millis)return "Tid saknas";
  return new Intl.DateTimeFormat("sv-SE",{dateStyle:"short",timeStyle:"short"}).format(new Date(millis));
}
function readPublicationHistory(){
  try{
    const parsed=JSON.parse(localStorage.getItem(PUBLICATION_HISTORY_KEY)||"[]");
    return Array.isArray(parsed)?parsed:[];
  }catch(_){return [];}
}
function savePublicationBatch(entries,failed=0){
  if(!entries?.length)return;
  const history=readPublicationHistory();
  history.unshift({
    id:`batch-${Date.now()}`,
    publishedAt:new Date().toISOString(),
    channel:"Container13 · Nyinkommet",
    failed,
    items:entries.map(entry=>({title:entry.title||`${entityTerm("singular",true)} utan namn`,imageUrl:entry.imageUrl||"",cccItemId:entry.cccItemId||""}))
  });
  try{localStorage.setItem(PUBLICATION_HISTORY_KEY,JSON.stringify(history.slice(0,30)));}catch(error){console.warn("[CCC Publicera] Kunde inte spara publiceringshistorik",error);}
}
function renderPublicationHistory(){
  const list=$("#publishedHistoryList"),empty=$("#publishedHistoryEmpty");
  if(!list||!empty)return;
  const history=readPublicationHistory();
  list.replaceChildren();
  empty.hidden=history.length!==0;
  empty.style.display=history.length?"none":"grid";
  for(const batch of history){
    const article=document.createElement("article");article.className="publication-batch";
    const heading=document.createElement("div");heading.className="publication-batch-heading";
    const copy=document.createElement("div");
    const title=document.createElement("strong");title.textContent=publicationDateText(batch.publishedAt);
    const meta=document.createElement("span");
    const count=Array.isArray(batch.items)?batch.items.length:0;
    meta.textContent=`${batch.channel||"Container13"} · ${count} ${count===1?"bild":"bilder"}${batch.failed?` · ${batch.failed} misslyckades`:""}`;
    copy.append(title,meta);heading.append(copy);article.append(heading);
    const thumbs=document.createElement("div");thumbs.className="publication-batch-images";
    for(const item of (batch.items||[])){
      const figure=document.createElement("figure");
      const img=document.createElement("img");img.src=item.imageUrl;img.alt=item.title||"Publicerad bild";img.loading="lazy";
      const caption=document.createElement("figcaption");caption.textContent=item.title||`${entityTerm("singular",true)} utan namn`;
      figure.append(img,caption);thumbs.append(figure);
    }
    article.append(thumbs);list.append(article);
  }
}
function selectPublishedTab(tab){
  for(const name of ["live","saved","history"]){
    const selected=name===tab;
    const capitalized=name[0].toUpperCase()+name.slice(1);
    $(`#published${capitalized}Panel`).hidden=!selected;
    const button=$(`#published${capitalized}Tab`);
    button.classList.toggle("is-active",selected);
    button.setAttribute("aria-selected",String(selected));
  }
  if(tab==="history")renderPublicationHistory();
  if(tab==="saved")loadSavedPublishedImages();
}
async function loadSavedPublishedImages(){
  const grid=$("#publishedSavedGrid"),empty=$("#publishedSavedEmpty");if(!grid||!empty)return;
  grid.replaceChildren();
  const records=(await getAll())
    .filter(record=>record.readyToPublish===false&&record.localArchiveState==="published")
    .sort((a,b)=>Date.parse(b.lastPublishedAt||0)-Date.parse(a.lastPublishedAt||0));
  empty.hidden=records.length!==0;empty.style.display=records.length?"none":"grid";
  for(const raw of records){
    const item=await hydrateOriginal(raw);
    const card=document.createElement("article");card.className="published-card saved-image-card";
    const imageWrap=document.createElement("div");imageWrap.className="published-card-image";
    const img=document.createElement("img");img.src=await previewSrc(item);img.alt=item.title||"Lokalt sparad bild";img.loading="lazy";imageWrap.append(img);
    const info=document.createElement("div");info.className="published-card-info";
    const title=document.createElement("strong");title.textContent=item.title||`${entityTerm("singular",true)} utan namn`;
    const channel=document.createElement("span");channel.textContent=item.lastPublishedChannel||"Container13 · Nyinkommet";
    const when=document.createElement("time");when.textContent=publicationDateText(item.lastPublishedAt);
    const status=document.createElement("span");status.className=`saved-live-status ${item.isLivePublished?"is-live":"is-offline"}`;status.textContent=item.isLivePublished?"● Ligger ute nu":"Sparad lokalt · inte ute";
    info.append(title,channel,when,status);card.append(imageWrap,info);grid.append(card);
  }
}

function updatePublishedSelectionBar(){
  const bar=$("#publishedSelectionBar"),button=$("#confirmPublishedSelection"),count=publishedSelectedIds.size;
  if(!bar||!button)return;
  bar.hidden=count===0;
  button.textContent=`Ta bort ${count} ${count===1?"bild":"bilder"} från hemsidan`;
}
function togglePublishedSelection(item,card){
  publishedSelectedIds.has(item.id)?publishedSelectedIds.delete(item.id):publishedSelectedIds.add(item.id);
  card.classList.toggle("is-selected-for-delete",publishedSelectedIds.has(item.id));
  const button=card.querySelector(".published-delete");
  if(button)button.textContent=publishedSelectedIds.has(item.id)?"Markerad för borttagning":"Markera för borttagning";
  updatePublishedSelectionBar();
}
async function markLocalArchiveNotLive(itemsRemoved){
  const documentIds=new Set(itemsRemoved.map(item=>item.id));
  const cccIds=new Set(itemsRemoved.map(item=>item.cccItemId).filter(Boolean));
  const localRecords=await getAll();
  for(const record of localRecords){
    if(record.readyToPublish!==false)continue;
    if(!documentIds.has(record.liveDocumentId)&&!cccIds.has(record.cccItemId))continue;
    record.isLivePublished=false;
    record.removedFromLiveAt=new Date().toISOString();
    await put(record);
  }
}
async function syncLocalArchiveLiveState(liveItems){
  const documentIds=new Set(liveItems.map(item=>item.id)),cccIds=new Set(liveItems.map(item=>item.cccItemId).filter(Boolean));
  const records=await getAll();
  for(const record of records){
    if(record.readyToPublish!==false||record.localArchiveState!=="published")continue;
    const isLive=documentIds.has(record.liveDocumentId)||cccIds.has(record.cccItemId);
    if(record.isLivePublished===isLive)continue;
    record.isLivePublished=isLive;
    if(!isLive)record.removedFromLiveAt=record.removedFromLiveAt||new Date().toISOString();
    await put(record);
  }
}
async function deleteSelectedPublishedItems(){
  const selected=publishedLiveItems.filter(item=>publishedSelectedIds.has(item.id));
  if(!selected.length)return;
  if(!window.confirm(`Ta bort ${selected.length} ${selected.length===1?"bild":"bilder"} från Container13 · Nyinkommet?\n\nLokala original i CCC påverkas inte.`))return;
  const panel=$("#publishedLivePanel"),scrollTop=panel?.scrollTop||0,button=$("#confirmPublishedSelection");
  if(button)button.disabled=true;
  const failures=[];
  for(const item of selected){
    try{
      if(item.storagePath){try{await deleteObject(storageRef(storage,item.storagePath));}catch(error){console.warn("[CCC Publicera] Bildfilen saknades eller kunde inte tas bort",error);}}
      await deleteDoc(doc(database,"gallery",item.id));
    }catch(error){failures.push(item);console.error("[CCC Publicera] Kunde inte ta bort publicerad bild",item.id,error);}
  }
  const removed=selected.filter(item=>!failures.includes(item));
  await markLocalArchiveNotLive(removed);
  publishedSelectedIds.clear();updatePublishedSelectionBar();
  await loadPublishedView(failures.length?`${removed.length} borttagna · ${failures.length} misslyckades.`:`${removed.length} ${removed.length===1?"bild är":"bilder är"} borttagna från hemsidan.`);
  requestAnimationFrame(()=>{if(panel)panel.scrollTop=Math.min(scrollTop,panel.scrollHeight-panel.clientHeight);});
  if(button)button.disabled=false;
}

let publishedLiveItems=[];
let publishedResultTimer=0;
async function loadPublishedView(message=""){
  const grid=$("#publishedGrid"),summary=$("#publishedSummary"),empty=$("#publishedEmpty"),result=$("#publishedResult");
  grid.replaceChildren();empty.hidden=true;empty.style.display="none";summary.textContent="Hämtar Container13…";
  clearTimeout(publishedResultTimer);
  if(message){result.hidden=false;result.textContent=message;publishedResultTimer=window.setTimeout(()=>{result.hidden=true;},3200);}else result.hidden=true;
  try{
    const all=await fetchPublishedNewArrivals();
    await syncLocalArchiveLiveState(all);
    const visible=all.slice(0,16);
    publishedLiveItems=visible;
    summary.textContent=`${visible.length} av 16 bilder ligger ute i Nyinkommet`;
    const startCount=$("#publishedStartCount");if(startCount)startCount.textContent=`${visible.length} ligger ute · visa eller ta bort`;
    empty.hidden=visible.length!==0;
    empty.style.display=visible.length?"none":"grid";
    for(const item of visible){
      const card=document.createElement("article");card.className="published-card";
      const imageWrap=document.createElement("div");imageWrap.className="published-card-image";
      const img=document.createElement("img");img.src=item.imageUrl;img.alt=item.title||`${entityTerm("singular",true)} publicerat`;img.loading="lazy";img.decoding="async";imageWrap.append(img);
      const info=document.createElement("div");info.className="published-card-info";
      const title=document.createElement("strong");title.textContent=item.title||`${entityTerm("singular",true)} utan namn`;
      const where=document.createElement("span");where.textContent="Container13 · Nyinkommet";
      const when=document.createElement("time");when.textContent=publicationDateText(item.createdAt);
      const del=document.createElement("button");del.type="button";del.className="published-delete";del.textContent="Markera för borttagning";del.setAttribute("aria-label",`Markera ${item.title||"bilden"} för borttagning från hemsidan`);
      del.addEventListener("click",()=>togglePublishedSelection(item,card));
      info.append(title,where,when,del);card.append(imageWrap,info);grid.append(card);
    }
  }catch(error){
    console.error("[CCC Publicera] Kunde inte hämta publicerade bilder",error);
    summary.textContent="Kunde inte hämta Nyinkommet";
    result.hidden=false;result.textContent="Kontrollera anslutningen och försök igen.";
  }
}

$("#publishedLiveTab")?.addEventListener("click",()=>selectPublishedTab("live"));
$("#publishedSavedTab")?.addEventListener("click",()=>selectPublishedTab("saved"));
$("#cancelPublishedSelection")?.addEventListener("click",()=>{
  publishedSelectedIds.clear();
  document.querySelectorAll(".published-card.is-selected-for-delete").forEach(card=>{
    card.classList.remove("is-selected-for-delete");
    const button=card.querySelector(".published-delete");if(button)button.textContent="Markera för borttagning";
  });
  updatePublishedSelectionBar();
});
$("#confirmPublishedSelection")?.addEventListener("click",deleteSelectedPublishedItems);
$("#publishedHistoryTab")?.addEventListener("click",()=>selectPublishedTab("history"));
$("#publishedBtn").addEventListener("click",async()=>{historyReturnsToWorkspace=false;publishedSelectedIds.clear();updatePublishedSelectionBar();show("publishedView");selectPublishedTab("live");renderPublicationHistory();await loadPublishedView();});


function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});}
function cropImageDimensions(image=cropImage,rotation=cropState?.rotation||0){
  const sideways=Math.abs(rotation%180)===90;
  return {width:sideways?image.naturalHeight:image.naturalWidth,height:sideways?image.naturalWidth:image.naturalHeight};
}
function geometry(){
  if(!cropImage||!cropState)return null;
  const c=$("#cropCanvas"),dims=cropImageDimensions(),base=Math.max(c.width/dims.width,c.height/dims.height),scale=base*cropState.zoom,w=dims.width*scale,h=dims.height*scale,lx=Math.max(0,(w-c.width)/2),ly=Math.max(0,(h-c.height)/2);
  cropState.x=Math.max(-lx,Math.min(lx,cropState.x));cropState.y=Math.max(-ly,Math.min(ly,cropState.y));
  return{c,scale,w,h,rotation:cropState.rotation||0};
}
function drawCrop(){const g=geometry();if(!g)return;const ctx=g.c.getContext("2d",{alpha:true});if(cropUsingCutout)ctx.clearRect(0,0,g.c.width,g.c.height);else{ctx.fillStyle="#111";ctx.fillRect(0,0,g.c.width,g.c.height);}ctx.save();ctx.translate(g.c.width/2+cropState.x,g.c.height/2+cropState.y);ctx.rotate(g.rotation*Math.PI/180);ctx.drawImage(cropImage,-cropImage.naturalWidth*g.scale/2,-cropImage.naturalHeight*g.scale/2,cropImage.naturalWidth*g.scale,cropImage.naturalHeight*g.scale);ctx.restore();
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
    `${entityTerm("singular",true)}: ${item?.title||item?.brand||item?.id||"okänt"}`,
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
  el.textContent=`${entityTerm("singular",true)} ${activeIndex+1} av ${items.length}`;
}

function cropStateSnapshot(state=cropState){
  if(!state)return null;
  return {
    zoom:Number(state.zoom)||1,
    x:Number(state.x)||0,
    y:Number(state.y)||0,
    rotation:((Number(state.rotation)||0)%360+360)%360
  };
}

function cropStateHasChanged(){
  const current=cropStateSnapshot(),baseline=cropBaseline;
  if(!current||!baseline)return false;
  return Math.abs(current.zoom-baseline.zoom)>.001
    ||Math.abs(current.x-baseline.x)>.5
    ||Math.abs(current.y-baseline.y)>.5
    ||current.rotation!==baseline.rotation;
}

function updateCropSaveState(){
  const button=$("#cropDone");
  if(!button)return;
  const changed=cropStateHasChanged();
  button.disabled=!changed;
  button.setAttribute("aria-disabled",String(!changed));
}

function setCropZoom(nextZoom){
  if(!cropState)return;
  const z=Math.max(.1,Math.min(3,Number(nextZoom)||1));
  cropState.zoom=z;
  const input=$("#cropZoom");
  if(input)input.value=String(z);
  const value=$("#cropZoomValue");
  if(value)value.textContent=`${Math.round(z*100)} %`;
  drawCrop();
  updateCropSaveState();
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

function manualCropState(mode="contain",image=cropImage,rotation=0){
  const canvas=$("#cropCanvas");
  if(!canvas||!image)return {zoom:1,x:0,y:0,rotation};
  const dims=cropImageDimensions(image,rotation),cover=Math.max(canvas.width/dims.width,canvas.height/dims.height),contain=Math.min(canvas.width/dims.width,canvas.height/dims.height);
  return {zoom:mode==="cover"?1:Math.max(.1,Math.min(1,contain/cover)),x:0,y:0,rotation};
}

async function openCrop({preserveBack=false}={}){
  cropBaseline=null;
  cropUsingCutout=false;
  updateCropSaveState();
  if(!preserveBack){
    const origin=["detailView","channelConfirmView","gridView"].includes(currentPublishView)
      ?currentPublishView
      :"gridView";
    cropReturnContext={view:origin,itemId:activeItemId||activeItem()?.id||""};
  }
  syncActiveIndexFromId();
  const item=activeItem();
  if(!item)return;
  // En sparad friläggning är den aktiva redigeringskällan. Vision-originalet
  // ligger separat kvar och hämtas först om användaren öppnar Frilägg igen.
  let originalSource="";
  try{
    cropUsingCutout=!!item.cutoutBlob;
    originalSource=cropUsingCutout?url(item.cutoutBlob):await ensureOriginalSource(item);
    if(!originalSource)throw new Error("Bildkälla saknas.");
    cropImage=await loadImage(originalSource);
  }catch(error){
    console.error("[CCC Publicera] Anpassa bild kunde inte öppnas",error);
    const status=cropReturnContext.view==="channelConfirmView"?$("#confirmStatus"):$("#publishStatus");
    if(status)status.textContent="Bilden kunde inte öppnas för anpassning. Försök igen.";
    cropImage=null;
    return;
  }
  if(cropUsingCutout){cropState={zoom:1,x:0,y:0,rotation:0,...item.cutoutData?.outputCropData};}
  else if(item.cropData){cropState={rotation:0,...item.cropData};}
  else{
    /* Manuell grundpassning: hela originalet syns centrerat. Automatisk
       motivbeskärning är avstängd tills den kan utvecklas och testas separat. */
    cropState=manualCropState("contain",cropImage,0);
  }
  $("#cropZoom").value=String(cropState.zoom);
  const zoomValue=$("#cropZoomValue");
  if(zoomValue)zoomValue.textContent=`${Math.round(cropState.zoom*100)} %`;
  updateCropCounter();
  $("#cropOriginalPreview").src=item.thumbUrl||item.fullUrl;
  const cropNote=$("#cropFutureNote");
  if(cropNote)cropNote.textContent=item.cutoutBlob?"Friläggning sparad · originalbilden är orörd":"Dra för att flytta · nyp för att zooma";
  $("#cropPreview")?.classList.toggle("is-cutout",cropUsingCutout);
  drawCrop();
  cropBaseline=cropStateSnapshot();
  updateCropSaveState();
  show("cropView");
}
$("#cropBtn").addEventListener("click",()=>openCrop());
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

const cropZoomInput=$("#cropZoom");
if(cropZoomInput)cropZoomInput.addEventListener("input",e=>setCropZoom(Number(e.target.value)||1));

$("#cropZoomToggle")?.addEventListener("click",()=>{
  const controls=$("#cropZoomControls");
  if(controls)controls.hidden=!controls.hidden;
});
$("#cropZoomOut")?.addEventListener("click",()=>stepCropZoom(-.05));
$("#cropZoomIn")?.addEventListener("click",()=>stepCropZoom(.05));

function applyCropPreset(mode){
  if(!cropImage)return;
  cropState=manualCropState(mode,cropImage,cropState?.rotation||0);
  setCropZoom(cropState.zoom);
}
$("#cropContain")?.addEventListener("click",()=>applyCropPreset("contain"));
$("#cropCover")?.addEventListener("click",()=>applyCropPreset("cover"));
$("#cropRotate")?.addEventListener("click",()=>{
  if(!cropImage)return;
  const rotation=((cropState?.rotation||0)+90)%360;
  cropState=manualCropState("contain",cropImage,rotation);
  setCropZoom(cropState.zoom);
});

$("#cropReset").addEventListener("click",()=>{
  const item=activeItem();
  if(!item)return;
  cropState=manualCropState("contain",cropImage,0);
  $("#cropZoom").value=String(cropState.zoom);
  const zoomValue=$("#cropZoomValue");
  if(zoomValue)zoomValue.textContent=`${Math.round(cropState.zoom*100)} %`;
  drawCrop();
  updateCropSaveState();
});

let cutoutSourceCanvas=null,cutoutResultCanvas=null,cutoutRenderTimer=null,cutoutShowingOriginal=false;

function setCutoutBusy(busy){
  const busyLayer=$("#cutoutBusy"),apply=$("#cutoutApply"),slider=$("#cutoutSensitivity");
  if(busyLayer)busyLayer.hidden=!busy;
  if(apply)apply.disabled=busy;
  if(slider)slider.disabled=busy;
}

function drawCutoutPreview(){
  const preview=$("#cutoutPreview"),source=cutoutShowingOriginal?cutoutSourceCanvas:cutoutResultCanvas;
  if(!preview||!source)return;
  const ctx=preview.getContext("2d");
  ctx.clearRect(0,0,preview.width,preview.height);
  ctx.drawImage(source,0,0,preview.width,preview.height);
  $("#cutoutShowOriginal")?.classList.toggle("is-active",cutoutShowingOriginal);
  $("#cutoutShowResult")?.classList.toggle("is-active",!cutoutShowingOriginal);
}

function cornerPalette(data,width,height){
  const size=Math.max(5,Math.round(Math.min(width,height)*.025));
  const anchors=[[0,0],[width-size,0],[0,height-size],[width-size,height-size]];
  return anchors.map(([sx,sy])=>{
    let r=0,g=0,b=0,count=0;
    for(let y=sy;y<sy+size;y+=2)for(let x=sx;x<sx+size;x+=2){
      const index=(y*width+x)*4;r+=data[index];g+=data[index+1];b+=data[index+2];count++;
    }
    return [r/count,g/count,b/count];
  });
}

function cleanCutoutIslands(background,width,height,queue){
  const labels=new Int32Array(background.length),components=[];
  let label=0;
  for(let start=0;start<background.length;start++){
    if(background[start]||labels[start])continue;
    label++;let head=0,tail=0,area=0,sumX=0,sumY=0;
    labels[start]=label;queue[tail++]=start;
    while(head<tail){
      const index=queue[head++],x=index%width,y=(index/width)|0;
      area++;sumX+=x;sumY+=y;
      for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
        if(!ox&&!oy)continue;
        const nx=x+ox,ny=y+oy;if(nx<0||nx>=width||ny<0||ny>=height)continue;
        const next=ny*width+nx;
        if(!background[next]&&!labels[next]){labels[next]=label;queue[tail++]=next;}
      }
    }
    const cx=sumX/area,cy=sumY/area;
    const centreDistance=Math.hypot((cx-width/2)/width,(cy-height/2)/height);
    components.push({label,area,centreDistance,score:area*(1.18-Math.min(.58,centreDistance))});
  }
  if(components.length<=1)return 0;
  const main=components.reduce((best,item)=>item.score>best.score?item:best,components[0]);
  const keep=new Set([main.label]);
  for(const component of components){
    if(component.label===main.label)continue;
    const substantial=component.area>=main.area*.12;
    const companion=component.area>=main.area*.035&&component.centreDistance<.34;
    if(substantial||companion)keep.add(component.label);
  }
  const removedComponents=components.filter(component=>!keep.has(component.label));
  if(!removedComponents.length)return 0;
  for(let index=0;index<labels.length;index++)if(labels[index]&&!keep.has(labels[index]))background[index]=1;
  return removedComponents.filter(component=>component.area>=9).length;
}

function createLocalCutout(source,sensitivity){
  const width=source.width,height=source.height,sourceCtx=source.getContext("2d",{willReadFrequently:true});
  const image=sourceCtx.getImageData(0,0,width,height),data=image.data,palette=cornerPalette(data,width,height);
  const background=new Uint8Array(width*height),queue=new Int32Array(width*height);
  const threshold=18+Number(sensitivity)*1.18,thresholdSquared=threshold*threshold;
  const matchesBackground=index=>{
    const offset=index*4,r=data[offset],g=data[offset+1],b=data[offset+2];
    for(const color of palette){
      const dr=r-color[0],dg=g-color[1],db=b-color[2];
      if(dr*dr+dg*dg+db*db<=thresholdSquared)return true;
    }
    return false;
  };
  let head=0,tail=0;
  const seed=index=>{if(!background[index]&&matchesBackground(index)){background[index]=1;queue[tail++]=index;}};
  for(let x=0;x<width;x++){seed(x);seed((height-1)*width+x);}
  for(let y=1;y<height-1;y++){seed(y*width);seed(y*width+width-1);}
  while(head<tail){
    const index=queue[head++],x=index%width,y=(index/width)|0;
    if(x>0)seed(index-1);if(x<width-1)seed(index+1);if(y>0)seed(index-width);if(y<height-1)seed(index+width);
  }
  const removedIslands=cleanCutoutIslands(background,width,height,queue);
  for(let index=0;index<background.length;index++){
    if(background[index]){data[index*4+3]=0;continue;}
    const x=index%width,y=(index/width)|0;let neighbours=0;
    for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){
      if(!ox&&!oy)continue;const nx=x+ox,ny=y+oy;
      if(nx>=0&&nx<width&&ny>=0&&ny<height&&background[ny*width+nx])neighbours++;
    }
    data[index*4+3]=Math.max(70,255-neighbours*24);
  }
  const result=document.createElement("canvas");result.width=width;result.height=height;
  result.getContext("2d").putImageData(image,0,0);
  return {canvas:result,removedIslands};
}

async function runLocalCutout(){
  const source=cutoutSourceCanvas;
  if(!source)return;
  setCutoutBusy(true);
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(source!==cutoutSourceCanvas){setCutoutBusy(false);return;}
  const sensitivity=Number($("#cutoutSensitivity")?.value)||50;
  const cutout=createLocalCutout(source,sensitivity);
  cutoutResultCanvas=cutout.canvas;
  cutoutShowingOriginal=false;
  drawCutoutPreview();
  const status=$("#cutoutStatus");
  if(status)status.textContent=cutout.removedIslands
    ?`${cutout.removedIslands} fristående störande ${cutout.removedIslands===1?"yta":"ytor"} rensades automatiskt.`
    :"Ingen fristående störande yta hittades.";
  setCutoutBusy(false);
}

async function openCutoutDialog(){
  if(!cropImage||!cropState)return;
  const source=$("#cropCanvas"),size=Math.min(600,source.width,source.height);
  cutoutSourceCanvas=document.createElement("canvas");cutoutSourceCanvas.width=size;cutoutSourceCanvas.height=size;
  if(cropUsingCutout){
    const item=activeItem(),originalSource=await ensureOriginalSource(item),originalImage=await loadImage(originalSource);
    const state={zoom:1,x:0,y:0,rotation:0,...item.cutoutData?.sourceCropData};
    const sideways=Math.abs(state.rotation%180)===90,dims={width:sideways?originalImage.naturalHeight:originalImage.naturalWidth,height:sideways?originalImage.naturalWidth:originalImage.naturalHeight};
    const base=Math.max(size/dims.width,size/dims.height),scale=base*state.zoom,positionScale=size/Math.max(1,source.width),ctx=cutoutSourceCanvas.getContext("2d");
    ctx.fillStyle="#111";ctx.fillRect(0,0,size,size);ctx.save();ctx.translate(size/2+state.x*positionScale,size/2+state.y*positionScale);ctx.rotate(state.rotation*Math.PI/180);ctx.drawImage(originalImage,-originalImage.naturalWidth*scale/2,-originalImage.naturalHeight*scale/2,originalImage.naturalWidth*scale,originalImage.naturalHeight*scale);ctx.restore();
  }else cutoutSourceCanvas.getContext("2d").drawImage(source,0,0,source.width,source.height,0,0,size,size);
  const slider=$("#cutoutSensitivity");if(slider)slider.value="50";
  const value=$("#cutoutSensitivityValue");if(value)value.textContent="50";
  const dialog=$("#cutoutDialog");if(dialog)dialog.hidden=false;
  await runLocalCutout();
}

function closeCutoutDialog(){
  const dialog=$("#cutoutDialog");if(dialog)dialog.hidden=true;
  cutoutSourceCanvas=null;cutoutResultCanvas=null;cutoutShowingOriginal=false;
  if(cutoutRenderTimer){clearTimeout(cutoutRenderTimer);cutoutRenderTimer=null;}
}

$("#cropCutout")?.addEventListener("click",openCutoutDialog);
$("#cutoutClose")?.addEventListener("click",closeCutoutDialog);
$("#cutoutDialog")?.addEventListener("click",event=>{if(event.target===$("#cutoutDialog"))closeCutoutDialog();});
$("#cutoutShowOriginal")?.addEventListener("click",()=>{cutoutShowingOriginal=true;drawCutoutPreview();});
$("#cutoutShowResult")?.addEventListener("click",()=>{cutoutShowingOriginal=false;drawCutoutPreview();});
$("#cutoutSensitivity")?.addEventListener("input",event=>{
  const value=$("#cutoutSensitivityValue");if(value)value.textContent=event.target.value;
  if(cutoutRenderTimer)clearTimeout(cutoutRenderTimer);
  cutoutRenderTimer=setTimeout(runLocalCutout,120);
});
$("#cutoutReset")?.addEventListener("click",()=>{
  const slider=$("#cutoutSensitivity");if(slider)slider.value="50";
  const value=$("#cutoutSensitivityValue");if(value)value.textContent="50";
  runLocalCutout();
});
$("#cutoutApply")?.addEventListener("click",async()=>{
  const item=activeItem();if(!item||!cutoutResultCanvas)return;
  setCutoutBusy(true);
  const blob=await new Promise((resolve,reject)=>cutoutResultCanvas.toBlob(value=>value?resolve(value):reject(new Error("Friläggningen kunde inte sparas.")),"image/webp",.90));
  const sourceCropData=cropUsingCutout?{...item.cutoutData?.sourceCropData}:{...cropState};
  const outputCropData={zoom:1,x:0,y:0,rotation:0};
  item.cropData={...outputCropData};
  item.cutoutBlob=blob;
  item.cutoutData={method:"local-edge-v1",sensitivity:Number($("#cutoutSensitivity")?.value)||50,createdAt:new Date().toISOString(),sourceCropData,outputCropData};
  item.publishBlob=blob;
  item.imageProcessingState="webp-cutout";
  await put(persistenceRecord(item));
  if(item.publishUrl&&item.publishUrl.startsWith("blob:"))URL.revokeObjectURL(item.publishUrl);
  item.publishUrl=url(blob);item.thumbUrl=await previewSrc(item);
  cropImage=await loadImage(item.publishUrl);
  cropUsingCutout=true;
  cropState={...outputCropData};
  $("#cropPreview")?.classList.add("is-cutout");
  drawCrop();
  cropBaseline=cropStateSnapshot();updateCropSaveState();
  closeCutoutDialog();
  const note=$("#cropFutureNote");if(note)note.textContent="Friläggning sparad · originalbilden är orörd";
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
    const newZoom=Math.max(.1,Math.min(3,pinchStart.zoom*(distance/pinchStart.distance)));
    cropState.zoom=newZoom;
    cropState.x=pinchStart.x+(mid.x-pinchStart.mid.x)*canvasPerCssX;
    cropState.y=pinchStart.y+(mid.y-pinchStart.mid.y)*canvasPerCssY;
    $("#cropZoom").value=String(newZoom);
    const zoomValue=$("#cropZoomValue");
    if(zoomValue)zoomValue.textContent=`${Math.round(newZoom*100)} %`;
    drawCrop();
    updateCropSaveState();
    return;
  }

  if(pointer&&pointer.id===e.pointerId&&cropPointers.size===1){
    cropState.x=pointer.ox+(e.clientX-pointer.x)*canvasPerCssX;
    cropState.y=pointer.oy+(e.clientY-pointer.y)*canvasPerCssY;
    drawCrop();
    updateCropSaveState();
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
let cropQuickPublishRequested=false;

async function commitCropAdjustment({force=false}={}){
  if(!force&&!cropStateHasChanged())return;
  const item=activeItem(),g=geometry();
  if(!item||!g)return;
  const savedItemId=item.id;
  item.cropData={...cropState};
  if(cropUsingCutout&&item.cutoutData)item.cutoutData.outputCropData={...cropState};
  /* Spara exakt det användaren ser i anpassningsrutan. Då fungerar även
     utzoomning till hela bilden med centrerad restyta. */
  const outSize=Math.max(1,Math.min(1600,Math.max(cropImage.naturalWidth,cropImage.naturalHeight)));
  const out=document.createElement("canvas");
  out.width=out.height=outSize;
  const outCtx=out.getContext("2d",{alpha:true});
  if(!cropUsingCutout){outCtx.fillStyle="#111";outCtx.fillRect(0,0,outSize,outSize);}
  outCtx.drawImage(g.c,0,0,g.c.width,g.c.height,0,0,outSize,outSize);
  const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error("WebP misslyckades")),"image/webp",.84));
  item.publishBlob=blob;
  item.imageProcessingState="webp-cropped";
  await put(persistenceRecord({...item,publishBlob:blob,cropData:item.cropData,imageProcessingState:item.imageProcessingState}));
  if(item.publishUrl&&item.publishUrl.startsWith("blob:"))URL.revokeObjectURL(item.publishUrl);
  item.publishUrl=url(blob);
  item.thumbUrl=await previewSrc(item);
  cropBaseline=cropStateSnapshot();
  updateCropSaveState();
  recentlyAdaptedItemId=savedItemId;
  if(cropQuickPublishRequested){
    cropQuickPublishRequested=false;
    quickPublishReturnView="cropView";
    channelSelectedIds.clear();
    channelSelectedIds.add(savedItemId);
    channelSelectPage=0;
    confirmPage=0;
    /* Snabbfilen hoppar över kanalsteget men får inte välja kanal åt
       användaren. Ett aktivt kanalval görs i sista kontrollvyn. */
    container13ChannelSelected=false;
    await renderChannelConfirmation();
    show("channelConfirmView");
    return;
  }
  await returnFromCrop();
  if(cropReturnContext.view==="gridView")requestAnimationFrame(()=>{
    const card=document.querySelector(`.draft-card[data-item-id="${CSS.escape(savedItemId)}"]`);
    card?.scrollIntoView?.({block:"nearest",inline:"nearest",behavior:"smooth"});
  });
  window.setTimeout(()=>{
    if(recentlyAdaptedItemId===savedItemId){
      recentlyAdaptedItemId=null;
      document.querySelector(`.draft-card[data-item-id="${CSS.escape(savedItemId)}"]`)?.classList.remove("just-adapted");
    }
  },1600);
}
$("#cropDone").addEventListener("click",()=>commitCropAdjustment());

$("#publishBtn").addEventListener("click",()=>{
  $("#publishStatus").textContent="";
  leavePublishDetail();
});


function channelGridClass(count){
  if(count===1)return "grid-1";
  if(count===2)return "grid-2";
  if(count<=4)return "grid-4";
  return "grid-9";
}
function applySharedPublishGridClass(grid,count,extraClass=""){
  if(!grid)return;
  grid.className=`draft-grid ${extraClass} ${channelGridClass(count)}`.trim();
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
  bindChannelGridSwipe();
  grid.replaceChildren();
  const pageCount=Math.max(1,Math.ceil(items.length/CHANNEL_PER_PAGE));
  channelSelectPage=Math.max(0,Math.min(channelSelectPage,pageCount-1));
  const start=channelSelectPage*CHANNEL_PER_PAGE;
  const end=Math.min(items.length,start+CHANNEL_PER_PAGE);
  const count=Math.max(0,end-start);
  applySharedPublishGridClass(grid,count,"channel-select-grid");

  for(let index=start;index<end;index+=1){
    const item=items[index];
    const button=document.createElement("button");
    button.type="button";
    button.className="draft-card channel-select-card";
    button.dataset.itemId=item.id;
    button.setAttribute("aria-label",`Markera ${title(item,index)}`);

    const img=document.createElement("img");
    img.src=await previewSrc(item)||item.thumbUrl||item.fullUrl||"";
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

    let tap=null,lastTouchHandled=0;
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
      if(draftPreviewSuppressClick){draftPreviewSuppressClick=false;return;}
      channelSelectedIds.has(item.id)?channelSelectedIds.delete(item.id):channelSelectedIds.add(item.id);
      renderChannelSelection();
    },{passive:false});
    button.addEventListener("click",async e=>{
      if(Date.now()-lastTouchHandled<700){e.preventDefault();return;}
      if(draftPreviewSuppressClick){draftPreviewSuppressClick=false;e.preventDefault();return;}
      channelSelectedIds.has(item.id)?channelSelectedIds.delete(item.id):channelSelectedIds.add(item.id);
      await renderChannelSelection();
    });
    grid.append(button);
  }

  appendGridPlaceholders(grid,count,CHANNEL_PER_PAGE);

  renderChannelPager(pageCount);
  updateChannelSelectionUi();
}

$("#channelContinueBtn")?.addEventListener("click",async()=>{
  if(!channelSelectedIds.size)return;
  quickPublishReturnView=null;
  confirmToolItemId=null;
  confirmPage=0;
  await renderChannelConfirmation();
  channelPickerReturnsToWorkspace=false;
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

function syncConfirmPublishAction(){
  const button=$("#confirmPublishBtn");
  if(!button)return;
  const count=channelSelectedIds.size;
  if(!count){
    button.textContent=`Välj ${entityTerm("plural")}`;
    button.disabled=true;
    return;
  }
  if(!container13ChannelSelected){
    button.textContent="Välj kanal";
    button.disabled=true;
    return;
  }
  button.textContent=count===1?`Publicera 1 ${entityTerm("singular")}`:`Publicera ${count} ${entityTerm("plural")}`;
  button.disabled=count===0;
}

function syncConfirmToolUi(){
  const selected=selectedChannelItems();
  if(confirmToolItemId&&!selected.some(item=>item.id===confirmToolItemId))confirmToolItemId=null;
  const item=selected.find(entry=>entry.id===confirmToolItemId)||null;
  const status=$("#confirmToolStatus");
  if(status){
    const position=item?selected.findIndex(entry=>entry.id===item.id)+1:0;
    status.textContent=item?`${entityTerm("singular",true)} ${position} av ${selected.length} markerat`:`Välj ett ${entityTerm("singular")}`;
    status.classList.toggle("is-active",!!item);
  }
  for(const selector of ["#confirmReviewBtn","#confirmAdaptBtn","#confirmRemoveBtn"]){
    const button=$(selector);if(button)button.disabled=!item;
  }
  document.querySelectorAll("#confirmGrid .confirm-card").forEach(card=>{
    const active=!!item&&card.dataset.itemId===item.id;
    card.classList.toggle("is-tool-selected",active);
    card.setAttribute("aria-pressed",String(active));
  });
}

function bindConfirmObjectFreeSwipe(){
  window.CCC_CORE?.swipe?.bindFree?.($("#confirmGrid"),{centerWhenFits:true});
}

async function ensureVisionReviewItem(item){
  if(!item?.id)throw new Error("Objektet saknar identitet.");
  const existing=await getLatestVisionSession();
  const previousItems=Array.isArray(existing?.items)?existing.items:[];
  if(previousItems.some(entry=>String(entry.id)===String(item.id)))return;

  await ensurePublishSource(item);
  const originalFileKey=item.originalFileKey||`${item.id}:main`;
  if(!item.originalFileKey){
    const source=item.originalBlob||item.publishBlob||item.thumbnailBlob;
    if(!source)throw new Error("Originalbilden kunde inte föras tillbaka till Vision.");
    await putSourceFile(originalFileKey,source,item.imageMetadata||buildPublishMetadata(item));
    item.originalFileKey=originalFileKey;
  }
  const fields={
    ...(item.fields||{}),
    title:item.title||item.fields?.title||"",
    brand:item.brand||item.fields?.brand||"",
    size:item.size||item.fields?.size||"",
    price:item.price||item.fields?.price||"",
    description:item.description||item.fields?.description||""
  };
  const sessionItem={
    id:item.id,cccItemId:item.cccItemId||"",originalFileKey,extraFileKeys:[],
    aiAnalyzedMain:false,aiAnalyzedExtra:[],demoKey:"arsenal",approved:!!item.approved,
    editedFields:fields,visionReady:!!item.visionReady,visionResult:item.visionResult||null,
    analysisMode:item.analysisMode||"manual",aiUsage:item.aiUsage||null,
    aiModel:item.aiModel||"",aiCostUsd:Number(item.aiCostUsd||0),
    aiCostSek:Number(item.aiCostSek||0),cropData:item.cropData||null
  };
  const sessionItems=[...previousItems,sessionItem];
  await putVisionSession({
    ...(existing||{}),id:"vision-active",schemaVersion:2,savedAt:new Date().toISOString(),
    currentIndex:sessionItems.length-1,count:sessionItems.length,items:sessionItems
  });
}
document.addEventListener("ccc:core-ready",()=>{
  if(currentPublishView==="channelConfirmView")bindConfirmObjectFreeSwipe();
},{once:true});

function setContainer13ChannelSelected(selected){
  container13ChannelSelected=!!selected;
  const targetButton=$("#container13ChannelBtn");
  if(targetButton){
    targetButton.classList.toggle("is-chosen",container13ChannelSelected);
    targetButton.setAttribute("aria-pressed",String(container13ChannelSelected));
  }
  const confirmButton=$("#confirmC13Channel");
  if(confirmButton){
    confirmButton.classList.toggle("is-active",container13ChannelSelected);
    confirmButton.setAttribute("aria-pressed",String(container13ChannelSelected));
    confirmButton.setAttribute("aria-label",`Container13, ${container13ChannelSelected?"vald":"inte vald"} kanal`);
  }
  const next=$("#channelNextBtn");
  if(next)next.disabled=!container13ChannelSelected;
  const preview=$("#confirmPreviewBtn");
  if(preview)preview.disabled=!container13ChannelSelected;
  syncConfirmPublishAction();
}

async function renderChannelConfirmation(resetControls=true){
  const selected=selectedChannelItems();
  const grid=$("#confirmGrid");
  if(!grid)return;
  const empty=$("#confirmWorkspaceEmpty");
  if(empty)empty.hidden=selected.length>0;
  grid.hidden=selected.length===0;
  grid.replaceChildren();
  /* Centreringen ska vara korrekt redan före Core-modulen hunnit binda den
     fria swipen. Core tar därefter över och sätter is-overflowing vid behov. */
  grid.className="confirm-grid confirm-object-strip ccc-free-swipe ccc-free-swipe--center";
  const c13Confirm=$("#confirmC13Channel");
  if(c13Confirm)setContainer13ChannelSelected(container13ChannelSelected);
  else syncConfirmPublishAction();
  if(resetControls){
    confirmToolItemId=null;
    container13PublishDisplayOverride=null;
    confirmDisplayDraft=null;
    if($("#confirmDisplayDialog"))$("#confirmDisplayDialog").hidden=true;
  }
  syncConfirmDisplayUi();

  for(const item of selected){
    const index=Math.max(0,itemIndexById(item.id));
    const card=document.createElement("button");
    card.type="button";
    card.className="draft-card confirm-card";
    card.dataset.itemId=item.id;
    card.setAttribute("aria-label",`Markera ${title(item,index)} för verktyg`);
    card.setAttribute("aria-pressed","false");
    const img=document.createElement("img");
    img.src=await previewSrc(item)||item.thumbUrl||item.fullUrl||"";
    img.alt=title(item,index);
    img.decoding="async";
    card.append(img);
    card.addEventListener("click",()=>{
      confirmToolItemId=item.id;
      syncConfirmToolUi();
    });
    grid.append(card);
  }
  syncConfirmToolUi();
  bindConfirmObjectFreeSwipe();
  requestAnimationFrame(()=>{
    grid.classList.toggle("is-overflowing",grid.scrollWidth>grid.clientWidth+2);
  });
}

$("#confirmReviewBtn")?.addEventListener("click",async()=>{
  if(!confirmToolItemId)return;
  const selectedIds=selectedChannelItems().map(item=>item.id);
  if(!selectedIds.length)return;
  const returnUrl=new URL("../publish/index.html",window.location.href);
  returnUrl.searchParams.set("view","prepare");
  returnUrl.searchParams.set("items",selectedIds.join(","));
  returnUrl.searchParams.set("toolItem",confirmToolItemId);
  returnUrl.searchParams.set("from","vision-review-return");
  if(workspaceStartMode)returnUrl.searchParams.set("workspace","1");
  returnUrl.searchParams.set("returnParent",
    directFromVisionEdit?"vision-edit"
      :directFromVisionExpress?"vision-express"
      :directFromVisionReady?"vision-ready"
      :directFromVisionWorkspace?"vision-workspace"
      :workspaceStartMode?"workspace":"channel");
  try{
    const reviewItem=selectedChannelItems().find(item=>item.id===confirmToolItemId);
    await ensureVisionReviewItem(reviewItem);
    sessionStorage.removeItem("ccc-vision-return-edit-item");
    sessionStorage.removeItem("ccc-vision-return-publish-confirm");
    sessionStorage.setItem("ccc-vision-return-edit-item",confirmToolItemId);
    sessionStorage.setItem("ccc-vision-return-publish-confirm",JSON.stringify({
      itemId:confirmToolItemId,
      url:returnUrl.href,
      createdAt:Date.now()
    }));
  }catch(error){
    console.error("[CCC Publicera] Kunde inte öppna objektet i Vision",error);
    $("#confirmStatus").textContent="Kunde inte öppna Granska & komplettera. Försök igen.";
    return;
  }
  const visionTarget=new URL("../vision/index.html",window.location.href);
  visionTarget.searchParams.set("returnTo","publish-confirm");
  visionTarget.searchParams.set("item",confirmToolItemId);
  window.location.assign(visionTarget.href);
});

$("#confirmAdaptBtn")?.addEventListener("click",async()=>{
  const index=itemIndexById(confirmToolItemId);
  if(index<0)return;
  activeIndex=index;
  activeItemId=confirmToolItemId;
  await openCrop();
});

$("#confirmRemoveBtn")?.addEventListener("click",async()=>{
  const item=selectedChannelItems().find(entry=>entry.id===confirmToolItemId);
  if(!item)return;
  if(!window.confirm(`Ta bort ${title(item,itemIndexById(item.id))} från den här publiceringen?\n\nObjektet finns kvar som lokalt utkast.`))return;
  channelSelectedIds.delete(item.id);
  confirmToolItemId=null;
  await renderChannelConfirmation(false);
  syncConfirmPublishAction();
});

function syncConfirmAddObjectLabel(label=null){
  const button=$("#confirmAddImagesBtn");
  const text=button?.querySelector("span:last-child");
  if(!button||!text)return;
  text.textContent=label||"Bilder";
  button.disabled=confirmAddPending;
}

function publishAddCameraState(){
  return {
    selectedIds:[...channelSelectedIds],
    channelSelected:container13ChannelSelected,
    toolItemId:confirmToolItemId||"",
    returnUrl:new URL("../publish/index.html?from=vision-publish-add",window.location.href).href,
    createdAt:Date.now()
  };
}

async function createConfirmImportedObject(file,index){
  const id=`${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  const createdAt=Date.now()+index;
  const originalFileKey=`${id}:main`;
  const item={
    id,
    cccItemId:createCccItemId(),
    originalFileKey,
    originalBlob:file,
    originalName:file.name||`ccc-${id}.jpg`,
    originalType:file.type||"image/jpeg",
    createdAt,
    source:"publish-confirm-device-add",
    imageProcessingState:"original",
    readyToPublish:true,
    title:"",brand:"",size:"",price:"",description:"",fields:{},
    publishBlob:null,publishUrl:"",cropData:null,thumbUrl:""
  };
  item.imageMetadata=buildPublishMetadata(item);
  await putSourceFile(originalFileKey,file,item.imageMetadata);
  await put(persistenceRecord(item));
  item.thumbUrl=await previewSrc(item);
  return {
    item,
    sessionItem:{
      id:item.id,cccItemId:item.cccItemId,originalFileKey,extraFileKeys:[],
      aiAnalyzedMain:false,aiAnalyzedExtra:[],demoKey:"arsenal",approved:false,
      editedFields:null,visionReady:false,visionResult:null,analysisMode:"manual",
      aiUsage:null,aiModel:"",aiCostUsd:0,aiCostSek:0,cropData:null
    }
  };
}

async function addObjectsFromDevice(fileList){
  if(confirmAddPending)return;
  const files=[...(fileList||[])].filter(file=>file?.type?.startsWith("image/"));
  if(!files.length)return;
  confirmAddPending=true;
  syncConfirmAddObjectLabel("Lägger till…");
  try{
    const created=[];
    for(let index=0;index<files.length;index+=1)created.push(await createConfirmImportedObject(files[index],index));
    const existing=await getLatestVisionSession();
    const previousItems=Array.isArray(existing?.items)?existing.items:[];
    const sessionItems=[...previousItems,...created.map(entry=>entry.sessionItem)];
    await putVisionSession({
      ...(existing||{}),id:"vision-active",schemaVersion:2,savedAt:new Date().toISOString(),
      currentIndex:Math.max(0,sessionItems.length-created.length),count:sessionItems.length,items:sessionItems
    });
    for(const {item} of created){items.push(item);channelSelectedIds.add(item.id);}
    updateStartCount();
    await renderChannelConfirmation(false);
    syncConfirmPublishAction();
    $("#confirmStatus").textContent=created.length===1
      ?`1 ${entityTerm("singular")} har lagts till.`
      :`${created.length} ${entityTerm("plural")} har lagts till.`;
  }catch(error){
    console.error("[CCC Publicera] Kunde inte lägga till objekt från enheten",error);
    $("#confirmStatus").textContent=`Kunde inte lägga till ${entityTerm("plural")}. Försök igen.`;
  }finally{
    confirmAddPending=false;
    const input=$("#confirmAddObjectInput");if(input)input.value="";
    syncConfirmAddObjectLabel();
  }
}

$("#confirmAddPhotoBtn")?.addEventListener("click",()=>{
  const state=publishAddCameraState();
  try{sessionStorage.setItem(PUBLISH_ADD_STATE_KEY,JSON.stringify(state));}catch(_){ }
  window.location.assign("../vision/index.html?mode=publish-add&source=camera");
});
$("#confirmAddImagesBtn")?.addEventListener("click",()=>{
  const input=$("#confirmAddObjectInput");
  if(input){input.value="";input.click();}
});
$("#confirmAddObjectInput")?.addEventListener("change",event=>addObjectsFromDevice(event.target.files));

$("#confirmChooseDraftsBtn")?.addEventListener("click",async()=>{
  channelPickerReturnsToWorkspace=true;
  const label=$("#channelSelectionChannelLabel");if(label)label.textContent="Lokala utkast i CCC";
  channelSelectPage=0;
  await renderChannelSelection();
  show("channelView");
});

$("#confirmHistoryBtn")?.addEventListener("click",async()=>{
  historyReturnsToWorkspace=true;
  publishedSelectedIds.clear();
  updatePublishedSelectionBar();
  show("publishedView");
  selectPublishedTab("live");
  renderPublicationHistory();
  await loadPublishedView();
});

$("#container13ChannelBtn")?.addEventListener("click",()=>{
  setContainer13ChannelSelected(!container13ChannelSelected);
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
    showDescription:localStorage.getItem("ccc-publish-container13-show-description")==="1",
    showBrand:localStorage.getItem("ccc-publish-container13-show-brand")==="1",
    showSize:localStorage.getItem("ccc-publish-container13-show-size")==="1",
    showPrice:localStorage.getItem("ccc-publish-container13-show-price")==="1"
  };
}
let container13PublishDisplayOverride=null;
let confirmDisplayDraft=null;
function effectiveContainer13DisplaySettings(){
  return container13PublishDisplayOverride?{...container13DisplaySettings(),...container13PublishDisplayOverride}:container13DisplaySettings();
}
function displaySummaryText(settings=effectiveContainer13DisplaySettings()){
  const parts=["Bild"];
  if(settings.showTitle)parts.push("titel");
  if(settings.showDescription)parts.push("beskrivning");
  if(settings.showBrand)parts.push("märke");
  if(settings.showSize)parts.push("storlek");
  if(settings.showPrice)parts.push("pris");
  return parts.join(" + ");
}
function syncConfirmDisplayUi(){
  const settings=effectiveContainer13DisplaySettings();
  if($("#confirmDisplaySummary")){
    $("#confirmDisplaySummary").textContent=displaySummaryText(settings);
  }
  syncConfirmDisplayInputs(settings);
}
function syncConfirmDisplayInputs(settings){
  for(const [selector,key] of [["#confirmShowTitle","showTitle"],["#confirmShowDescription","showDescription"],["#confirmShowBrand","showBrand"],["#confirmShowSize","showSize"],["#confirmShowPrice","showPrice"]]){
    const input=$(selector); if(input)input.checked=!!settings[key];
  }
}
function readConfirmDisplayOverride(){
  return {showTitle:!!$("#confirmShowTitle")?.checked,showDescription:!!$("#confirmShowDescription")?.checked,showBrand:!!$("#confirmShowBrand")?.checked,showSize:!!$("#confirmShowSize")?.checked,showPrice:!!$("#confirmShowPrice")?.checked};
}

function safePublishFilePart(value){
  return String(value||"plagg")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-zA-Z0-9._-]+/g,"-")
    .replace(/^-+|-+$/g,"")
    .slice(0,80) || "plagg";
}

function publishBlobForItem(item){
  return item?.publishBlob || item?.thumbnailBlob || item?.originalBlob || null;
}

async function resolvePublishBlob(item){
  let blob=publishBlobForItem(item);
  if(!blob && item?.originalFileKey)blob=await getSourceFile(item.originalFileKey);
  return blob||null;
}

function publishBlobExtension(blob){
  const type=String(blob?.type||"").toLowerCase();
  if(type.includes("webp"))return "webp";
  if(type.includes("png"))return "png";
  return "jpg";
}

async function publishSelectedToContainer13Live(){
  if(!auth.currentUser)throw new Error("Du är inte längre inloggad.");

  const display=effectiveContainer13DisplaySettings();
  const selected=items.filter(item=>channelSelectedIds.has(item.id));
  if(!selected.length)throw new Error( `Inga ${entityTerm("plural")} är valda.`);

  let uploaded=0;
  const failures=[];
  const publishedIds=[];
  const publishedEntries=[];

  for(let index=0;index<selected.length;index+=1){
    const item=selected[index];
    let uploadedRef=null;
    try{
      const blob=await resolvePublishBlob(item);
      if(!blob)throw new Error("Bild saknas");

      const ext=publishBlobExtension(blob);
      const metadata=buildPublishMetadata(item);
      const idPart=safePublishFilePart(metadata.cccItemId);
      const storagePath=`nyinkommet/${Date.now()}-${index}-${idPart}.${ext}`;
      uploadedRef=storageRef(storage,storagePath);

      await uploadBytes(uploadedRef,blob,{
        contentType:blob.type||"image/jpeg",
        cacheControl:"public, max-age=31536000, immutable",
        customMetadata:{
          cccItemId:metadata.cccItemId,
          schemaVersion:"1",
          title:metadata.title.slice(0,200),
          brand:metadata.brand.slice(0,120),
          size:metadata.size.slice(0,80),
          source:"ccc"
        }
      });
      const imageUrl=await getDownloadURL(uploadedRef);

      const titleText=String(item.title||item.fields?.title||"").trim();
      const descriptionText=String(item.description||item.fields?.description||"").trim();

      const documentRef=await addDoc(collection(database,"gallery"),{
        category:"nyinkommet",
        imageUrl,
        storagePath,
        title:titleText,
        description:descriptionText,
        showTitle:display.showTitle,
        showDescription:display.showDescription,
        showBrand:display.showBrand,
        showSize:display.showSize,
        showPrice:display.showPrice,
        brand:metadata.brand,
        size:metadata.size,
        price:metadata.price,
        cccItemId:metadata.cccItemId,
        cccMetadataVersion:1,
        source:"ccc",
        createdAt:serverTimestamp(),
        createdBy:auth.currentUser.email||""
      });

      uploaded+=1;
      publishedIds.push(item.id);
      publishedEntries.push({localId:item.id,documentId:documentRef.id,title:titleText||metadata.title||`${entityTerm("singular",true)} utan namn`,imageUrl,cccItemId:metadata.cccItemId});
    }catch(error){
      failures.push({id:item?.id||"",message:error?.message||String(error)});
      if(uploadedRef){
        try{await deleteObject(uploadedRef);}catch(_){}
      }
      console.error("[CCC Publicera] Kunde inte publicera plagg",item?.id,error);
    }
  }

  try{await enforceNewArrivalsLimit(16);}catch(error){console.error("[CCC Publicera] Kunde inte verkställa 16-bildersgränsen",error);}
  return {uploaded,failed:failures.length,failures,publishedIds,publishedEntries};
}

async function enforceNewArrivalsLimit(maximum=16){
  const all=await fetchPublishedNewArrivals();
  for(const item of all.slice(maximum)){
    if(item.storagePath){try{await deleteObject(storageRef(storage,item.storagePath));}catch(error){console.warn("[CCC Publicera] Äldre bildfil kunde inte tas bort",error);}}
    await deleteDoc(doc(database,"gallery",item.id));
  }
}

const SITE_PREVIEW_BLOB_CACHE="ccc-site-preview-local-v1";

async function prepareSitePreviewBlobTransport(payload){
  if(!("caches" in window))return payload;
  try{
    await caches.delete(SITE_PREVIEW_BLOB_CACHE);
    const cache=await caches.open(SITE_PREVIEW_BLOB_CACHE);
    const byId=new Map(items.map(item=>[String(item.id),item]));

    return await Promise.all(payload.map(async meta=>{
      const item=byId.get(String(meta.id));
      if(!item)return meta;

      let blob=item.publishBlob||item.thumbnailBlob||item.originalBlob||null;
      if(!blob && item.originalFileKey){
        try{blob=await getSourceFile(item.originalFileKey);}catch(_){}
      }
      if(!blob)return meta;

      const key=new URL(`../site-preview/__ccc_local__/${encodeURIComponent(meta.id)}`,window.location.href).href;
      await cache.put(key,new Response(blob,{headers:{"Content-Type":blob.type||"image/jpeg"}}));
      return {...meta,imageCacheKey:key};
    }));
  }catch(error){
    console.warn("[CCC Publicera] Lokal bildtransport via Cache Storage misslyckades, använder IndexedDB-reserv.",error);
    return payload;
  }
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
  let payload=container13PayloadForSelection();
  if(!payload.length)return false;
  payload=await prepareSitePreviewBlobTransport(payload);
  const displaySettings=effectiveContainer13DisplaySettings();
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


function closeConfirmDisplayDialog({save=false}={}){
  const dialog=$("#confirmDisplayDialog");
  if(!dialog||dialog.hidden)return;
  if(save&&confirmDisplayDraft){
    container13PublishDisplayOverride={...confirmDisplayDraft};
    syncConfirmDisplayUi();
  }
  confirmDisplayDraft=null;
  dialog.hidden=true;
}
$("#confirmDisplayEditBtn")?.addEventListener("click",()=>{
  const dialog=$("#confirmDisplayDialog");if(!dialog)return;
  confirmDisplayDraft={...effectiveContainer13DisplaySettings()};
  syncConfirmDisplayInputs(confirmDisplayDraft);
  dialog.hidden=false;
});
for(const input of document.querySelectorAll("#confirmDisplayEditor input[type=checkbox]")){
  input.addEventListener("change",()=>{confirmDisplayDraft=readConfirmDisplayOverride();});
}
$("#confirmDisplayResetBtn")?.addEventListener("click",()=>{
  confirmDisplayDraft=container13DisplaySettings();
  syncConfirmDisplayInputs(confirmDisplayDraft);
});
$("#confirmDisplayCancelBtn")?.addEventListener("click",()=>closeConfirmDisplayDialog());
$("#confirmDisplayDoneBtn")?.addEventListener("click",()=>closeConfirmDisplayDialog({save:true}));
$("#confirmDisplayDialog")?.addEventListener("click",event=>{if(event.target===$("#confirmDisplayDialog"))closeConfirmDisplayDialog();});

$("#confirmC13Channel")?.addEventListener("click",()=>{
  setContainer13ChannelSelected(!container13ChannelSelected);
  $("#confirmStatus").textContent=container13ChannelSelected?"":"Välj minst en kanal för att publicera.";
});
document.querySelectorAll("#channelConfirmView .confirm-channel-chip.is-unavailable").forEach(button=>{
  button.addEventListener("click",()=>showChannelUnavailable(button.dataset.channel||"Kanalen"));
});

function bindConfirmChannelFreeSwipe(){
  window.CCC_CORE?.swipe?.bindFree?.(
    document.querySelector("#channelConfirmView .confirm-channel-strip"),
    {centerWhenFits:true}
  );
}
bindConfirmChannelFreeSwipe();
document.addEventListener("ccc:core-ready",bindConfirmChannelFreeSwipe,{once:true});

$("#confirmPublishBtn")?.addEventListener("click",async()=>{
  if(!container13ChannelSelected){
    $("#confirmStatus").textContent="Välj minst en kanal för att publicera.";
    return;
  }

  const button=$("#confirmPublishBtn");
  const count=channelSelectedIds.size;
  if(!count){
    $("#confirmStatus").textContent= `Inga ${entityTerm("plural")} är valda.`;
    return;
  }

  button.disabled=true;
  const originalLabel=button.textContent;
  button.textContent="Publicerar…";
  $("#confirmStatus").textContent=count===1
    ?`Publicerar 1 ${entityTerm("singular")} på Container13…`
    :`Publicerar ${count} ${entityTerm("plural")} på Container13…`;

  try{
    const result=await publishSelectedToContainer13Live();

    if(result.uploaded===0){
      throw new Error(result.failures?.[0]?.message||"Ingen bild kunde publiceras.");
    }

    if(result.publishedIds?.length){
      await archivePublishedDrafts(result.publishedIds,result.publishedEntries);
      const publishedSet=new Set(result.publishedIds);
      items=items.filter(item=>!publishedSet.has(item.id));
      result.publishedIds.forEach(id=>channelSelectedIds.delete(id));
      updateStartCount();
    }
    savePublicationBatch(result.publishedEntries,result.failed);

    if(result.failed>0){
      $("#confirmStatus").textContent=`${result.uploaded} publicerade, ${result.failed} misslyckades.`;
      show("publishedView");
      selectPublishedTab("live");
      renderPublicationHistory();
      await loadPublishedView(`${result.uploaded} publicerade · ${items.length} finns kvar redo att publicera · ${result.failed} misslyckades.`);
      return;
    }

    $("#confirmStatus").textContent=result.uploaded===1
      ?`✓ 1 ${entityTerm("singular")} publicerat på Container13.`
      :`✓ ${result.uploaded} ${entityTerm("plural")} publicerade på Container13.`;

    show("publishedView");
    selectPublishedTab("live");
    renderPublicationHistory();
    await loadPublishedView(`${result.uploaded} publicerade på Container13 · ${items.length} finns kvar redo att publicera.`);
  }catch(error){
    console.error("[CCC Publicera] Publicering till Container13 misslyckades",error);
    $("#confirmStatus").textContent=`Publiceringen misslyckades: ${error?.message||"okänt fel"}`;
    button.disabled=false;
    button.textContent=originalLabel;
  }
});


(async()=>{try{
  const settingsReturn=takePublishSettingsReturn();
  const allLocalRecords=await getAll();
  const archivedIds=new Set(allLocalRecords.filter(r=>r.readyToPublish===false).map(r=>r.id));
  let explicit=allLocalRecords.filter(r=>r.readyToPublish!==false);
  explicit=await Promise.all(explicit.map(hydrateOriginal));
  const sessionDrafts=(await visionSessionDrafts()).filter(record=>!archivedIds.has(record.id));
  const merged=new Map(sessionDrafts.map(r=>[r.id,r]));
  explicit.forEach(r=>merged.set(r.id,{...(merged.get(r.id)||{}),...r}));
  let records=[...merged.values()].filter(r=>r.originalBlob||r.publishBlob||r.thumbnailBlob);
  records.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
  items=records.map(r=>({...r,thumbUrl:"",publishUrl:""}));
  localStorage.removeItem("ccc-publish-demo-watermark");
  for(const item of items){
    const hadIdentity=!!item.cccItemId;
    const removedLegacyDemo=removeLegacyDemoState(item);
    ensureCccIdentity(item);
    item.imageMetadata={...(item.imageMetadata||{}),...buildPublishMetadata(item)};
    if(!hadIdentity||removedLegacyDemo){
      try{await put(persistenceRecord(item));}catch(error){console.warn("[CCC Publicera] Kunde inte uppdatera lokalt utkast",item.id,error);}
    }
  }
  $("#startDraftCount").textContent=items.length===1?"1 utkast":`${items.length} utkast`;

  const previewsReady=Promise.all(items.map(async(item,index)=>{
    item.thumbUrl=await previewSrc(item);
    if(index===0)preloadNeighbors(0);
  }));
  if(settingsReturn){
    await previewsReady;
    await renderGrid();
    activeItemId=settingsReturn.activeItemId&&itemIndexById(settingsReturn.activeItemId)>=0?settingsReturn.activeItemId:null;
    activeIndex=activeItemId?itemIndexById(activeItemId):Math.max(0,Math.min(Number(settingsReturn.activeIndex||0),Math.max(0,items.length-1)));
    channelSelectedIds.clear();
    (settingsReturn.selectedIds||[]).filter(id=>itemIndexById(id)>=0).forEach(id=>channelSelectedIds.add(id));
    confirmToolItemId=itemIndexById(settingsReturn.confirmToolItemId)>=0?settingsReturn.confirmToolItemId:null;
    container13ChannelSelected=!!settingsReturn.container13ChannelSelected;
    workspaceStartMode=!!settingsReturn.workspaceStartMode;
    channelPickerReturnsToWorkspace=!!settingsReturn.channelPickerReturnsToWorkspace;
    historyReturnsToWorkspace=!!settingsReturn.historyReturnsToWorkspace;
    channelTargetsReturnView=settingsReturn.channelTargetsReturnView||"startView";
    cropReturnContext=settingsReturn.cropReturnContext&&typeof settingsReturn.cropReturnContext==="object"
      ?{view:settingsReturn.cropReturnContext.view||"gridView",itemId:settingsReturn.cropReturnContext.itemId||""}
      :{view:"gridView",itemId:""};
    quickPublishReturnView=settingsReturn.quickPublishReturnView||null;
    draftPage=Math.max(0,Number(settingsReturn.draftPage||0));
    channelSelectPage=Math.max(0,Number(settingsReturn.channelSelectPage||0));
    confirmPage=Math.max(0,Number(settingsReturn.confirmPage||0));
    selectedDraftIds.clear();
    (settingsReturn.selectedDraftIds||[]).filter(id=>itemIndexById(id)>=0).forEach(id=>selectedDraftIds.add(id));
    if(settingsReturn.view==="detailView"&&items.length)openDetail(activeIndex);
    else if(settingsReturn.view==="cropView"&&items.length)await openCrop({preserveBack:true});
    else if(settingsReturn.view==="channelConfirmView"){await renderChannelConfirmation(false);show("channelConfirmView");}
    else if(settingsReturn.view==="channelView"){await renderChannelSelection();show("channelView");}
    else if(settingsReturn.view==="channelTargetsView")show("channelTargetsView");
    else if(settingsReturn.view==="publishedView"){
      publishedSelectedIds.clear();updatePublishedSelectionBar();show("publishedView");
      selectPublishedTab("live");renderPublicationHistory();await loadPublishedView();
    }
    else if(settingsReturn.view==="gridView"){
      show("gridView");
      if(settingsReturn.draftSelectionMode){draftSelectionMode=true;await renderGrid();updateSelectionFooter();}
    }
    else show("startView");
    requestAnimationFrame(()=>requestAnimationFrame(finishDirectPrepareBootstrap));
    return;
  }
  if(directPrepareView && directPrepareItemIds.some(id=>itemIndexById(id)>=0)){
    if(directReturnWorkspace)workspaceStartMode=true;
    await openDirectVisionConfirmation(directPrepareItemIds);
    requestAnimationFrame(()=>requestAnimationFrame(finishDirectPrepareBootstrap));
    await previewsReady;
    await renderGrid();
  }else{
    await previewsReady;
    await renderGrid();
    if(directPrepareView){
      preloadNeighbors(0);
      show("gridView");
      requestAnimationFrame(finishDirectPrepareBootstrap);
    }else if(legacyPublishStart){
      workspaceStartMode=false;
      show("startView");
      requestAnimationFrame(()=>requestAnimationFrame(finishDirectPrepareBootstrap));
    }else{
      workspaceStartMode=true;
      const cameraState=publishAddCameraReturn?readPublishAddCameraState():null;
      channelSelectedIds.clear();
      if(cameraState){
        [...(cameraState.selectedIds||[]),...(cameraState.newIds||[])]
          .filter(id=>itemIndexById(id)>=0)
          .forEach(id=>channelSelectedIds.add(id));
        container13ChannelSelected=!!cameraState.channelSelected;
        confirmToolItemId=itemIndexById(cameraState.toolItemId)>=0?cameraState.toolItemId:null;
      }else{
        container13ChannelSelected=false;
        confirmToolItemId=null;
      }
      await renderChannelConfirmation();
      show("channelConfirmView");
      if(cameraState){
        const added=Array.isArray(cameraState.newIds)?cameraState.newIds.length:0;
        if(added)$("#confirmStatus").textContent=added===1
          ?`1 ${entityTerm("singular")} har lagts till.`
          :`${added} ${entityTerm("plural")} har lagts till.`;
        try{sessionStorage.removeItem(PUBLISH_ADD_STATE_KEY);}catch(_){ }
      }
      requestAnimationFrame(()=>requestAnimationFrame(finishDirectPrepareBootstrap));
    }
  }
}catch(e){
  console.error("[CCC Publicera] Kunde inte läsa lokala utkast",{name:e?.name,message:e?.message},e);
  $("#emptyState").hidden=false;
  $("#emptyState").innerHTML="<strong>Kunde inte läsa lokala utkast</strong><span>Försök öppna Publicera igen.</span>";
  show("gridView");
  finishDirectPrepareBootstrap();
}})();
window.addEventListener("pagehide",()=>objectUrls.forEach(u=>URL.revokeObjectURL(u)));

// Dubbeltryck på beskärningsytan används inte längre för zoom.
// Zoom styrs enbart av de explicita crop-kontrollerna/pinch.

function returnToVisionObject(){
  if(!directFromVisionEdit)return false;
  try{sessionStorage.setItem("ccc-vision-return-edit-item",directPrepareItemId);}catch(_){}
  window.location.href="../vision/index.html";
  return true;
}

function returnToVisionContext(kind="any"){
  const allowed=kind==="ready"?directFromVisionReady
    :kind==="workspace"?directFromVisionWorkspace
    :(directFromVisionWorkspace||directFromVisionReady);
  if(!allowed)return false;
  window.location.href="../vision/index.html?returnFrom=publish";
  return true;
}

function returnFromVisionReview(){
  if(!directFromVisionReview)return false;
  if(directReviewParent==="vision-edit"){
    if(directPrepareToolItemId)try{sessionStorage.setItem("ccc-vision-return-edit-item",directPrepareToolItemId);}catch(_){ }
    window.location.href="../vision/index.html";
    return true;
  }
  if(directReviewParent==="vision-express"){
    window.location.href="../vision/index.html";
    return true;
  }
  if(directReviewParent==="vision-ready"||directReviewParent==="vision-workspace"){
    window.location.href="../vision/index.html?returnFrom=publish";
    return true;
  }
  if(directReviewParent==="workspace"){
    window.location.href="../dashboard/index.html";
    return true;
  }
  return false;
}

async function leavePublishDetail(){
  if(swipeCommitTimer){
    clearTimeout(swipeCommitTimer);
    swipeCommitTimer=null;
  }
  swipeGesture=null;
  swipeAnimating=false;
  $("#swipeArea")?.classList.remove("is-swiping","swipe-to-next","swipe-to-prev");
  setSwipeTransforms(0,false);
  await renderGrid();
  activeItemId=null;
  show("gridView");
}


async function returnFromCrop(){
  const context={...cropReturnContext};
  const itemId=context.itemId||activeItemId||activeItem()?.id||"";
  cropImage=null;
  cropState=null;
  cropBaseline=null;
  cropUsingCutout=false;
  pointer=null;
  if(context.view==="channelConfirmView"){
    if(itemId)confirmToolItemId=itemId;
    await renderChannelConfirmation(false);
    show("channelConfirmView");
    return;
  }
  if(context.view==="detailView"&&itemId){
    await openDetailById(itemId);
    return;
  }
  await renderGrid();
  activeItemId=null;
  show("gridView");
}


$("#deleteDraftDialog")?.addEventListener("click",e=>{if(e.target===$("#deleteDraftDialog"))$("#cancelDeleteDrafts")?.click();});
$("#closePublishHelp")?.addEventListener("click",closePublishHelp);
$("#publishHelpDialog")?.addEventListener("click",e=>{if(e.target===$("#publishHelpDialog"))closePublishHelp();});

async function goBackFromPublish(){
  if(directPrepareBackGuard)return;
  const logoutDialog=$("#logoutDialog");
  if(logoutDialog && !logoutDialog.hidden){logoutDialog.hidden=true;return;}
  const helpDialog=$("#publishHelpDialog");
  if(helpDialog && !helpDialog.hidden){closePublishHelp();return;}
  const deleteDialog=$("#deleteDraftDialog");
  if(deleteDialog && !deleteDialog.hidden){$("#cancelDeleteDrafts")?.click();return;}
  const displayDialog=$("#confirmDisplayDialog");
  if(displayDialog&&!displayDialog.hidden){
    closeConfirmDisplayDialog();
    return;
  }
  const cutoutDialog=$("#cutoutDialog");
  if(cutoutDialog&&!cutoutDialog.hidden){closeCutoutDialog();return;}
  if(currentPublishView==="gridView"&&draftSelectionMode){exitDraftSelection();return;}
  if(currentPublishView==="startView"){
    window.location.href="../dashboard/index.html";
    return;
  }
  if(currentPublishView==="channelConfirmView"){
    if(returnFromVisionReview())return;
    if(directFromVisionEdit){
      returnToVisionObject();
      return;
    }
    if(directFromVisionExpress){
      window.location.href="../vision/index.html";
      return;
    }
    if(returnToVisionContext("ready"))return;
    if(quickPublishReturnView==="cropView"){
      quickPublishReturnView=null;
      await openCrop({preserveBack:true});
      return;
    }
    if(quickPublishReturnView==="detailView"){
      quickPublishReturnView=null;
      openDetail(activeIndex);
      return;
    }
    if(workspaceStartMode){
      window.location.href="../dashboard/index.html";
      return;
    }
    show("channelView");
    return;
  }
  if(currentPublishView==="channelView"){
    if(channelPickerReturnsToWorkspace){
      channelPickerReturnsToWorkspace=false;
      await renderChannelConfirmation(false);
      show("channelConfirmView");
      return;
    }
    show("channelTargetsView");
    return;
  }
  if(currentPublishView==="channelTargetsView"){
    if(channelTargetsReturnView==="gridView"){await renderGrid();show("gridView");}
    else show("startView");
    return;
  }
  if(currentPublishView==="publishedView"&&(historyReturnsToWorkspace||workspaceStartMode)){
    historyReturnsToWorkspace=false;
    await renderChannelConfirmation(false);
    show("channelConfirmView");
    return;
  }
  if(currentPublishView==="gridView"||currentPublishView==="publishedView"){
    if(returnToVisionContext("workspace"))return;
    show("startView");
    return;
  }
  if(currentPublishView==="detailView"){
    if(returnToVisionObject())return;
    await leavePublishDetail();
    return;
  }
  if(currentPublishView==="cropView"){
    await returnFromCrop();
    return;
  }
}
document.addEventListener("ccc:header-back",async()=>{
  if(publishBackPending)return;
  publishBackPending=true;
  try{await goBackFromPublish();}
  finally{publishBackPending=false;}
});
document.addEventListener("ccc:header-settings",()=>{
  rememberPublishSettingsReturn();
  const target=new URL("../settings/index.html",window.location.href);
  target.searchParams.set("module","publish");
  target.searchParams.set("return","1");
  target.searchParams.set("source",window.location.search);
  window.location.href=target.href;
});
document.addEventListener("ccc:core-ready",()=>{
  setPublishHeader(currentPublishView);
  configureFooterForView(currentPublishView);
},{once:true});

/* CCC cache stamp: v2.9.13 */


/* CCC cache stamp: v2.9.20 */

/* CCC cache stamp: v2.9.61 */

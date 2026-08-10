import { auth } from "../auth/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
onAuthStateChanged(auth,(user)=>{if(!user)window.location.href="../auth/index.html";});

const $=(s)=>document.querySelector(s);
const DB_NAME="ccc-local-workspace", DB_VERSION=3, STORE_NAME="images", FILE_STORE="vision-files";
let items=[],activeIndex=0,objectUrls=[];
let cropImage=null,cropState=null,pointer=null;

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

async function put(record){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readwrite");tx.objectStore(STORE_NAME).put(record);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
async function getSourceFile(key){if(!key)return null;const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(FILE_STORE,"readonly"),r=tx.objectStore(FILE_STORE).get(key);r.onsuccess=()=>resolve(r.result?.blob||null);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function hydrateOriginal(record){if(record.originalBlob||!record.originalFileKey)return record;const blob=await getSourceFile(record.originalFileKey);return blob?{...record,originalBlob:blob}:record;}
function persistenceRecord(item){const record={...item};delete record.thumbUrl;delete record.fullUrl;if(record.originalFileKey)delete record.originalBlob;return record;}
function url(blob){const u=URL.createObjectURL(blob);objectUrls.push(u);return u;}
function dataUrl(blob){return new Promise((resolve,reject)=>{if(!blob){resolve("");return;}const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||""));reader.onerror=()=>reject(reader.error||new Error("Kunde inte läsa bildförhandsvisningen."));reader.readAsDataURL(blob);});}
async function previewSrc(record){
  const blob=record.thumbnailBlob||record.originalBlob||record.publishBlob;
  if(!blob)return "";
  try{return await dataUrl(blob);}catch(error){console.warn("[CCC Publicera] Data-URL misslyckades, använder blob-URL",error);return url(blob);}
}
function title(item,index){return item.title?.trim()||item.fields?.title?.trim()||`Plagg ${index+1}`;}
function resetViewScroll(view){
  const el=$("#"+view);
  if(!el)return;
  try{el.scrollTop=0;}catch(_){}
  const scrollChild=el.querySelector(".draft-grid,.publish-scroll,.crop-view");
  if(scrollChild)try{scrollChild.scrollTop=0;}catch(_){}
}
function show(view){
  ["startView","gridView","publishedView","detailView","cropView"].forEach(id=>$("#"+id).hidden=id!==view);
  requestAnimationFrame(()=>{
    resetViewScroll(view);
    const active=$("#"+view);
    active?.scrollIntoView?.({block:"start",inline:"nearest"});
  });
}
async function renderGrid(){
  const grid=$("#draftGrid");
  const empty=$("#emptyState");
  grid.replaceChildren();
  $("#draftCount").textContent=items.length===1?"1 lokalt utkast":`${items.length} lokala utkast`;
  $("#startDraftCount").textContent=items.length===1?"1 utkast":`${items.length} utkast`;

  const hasItems=items.length>0;
  if(empty){
    empty.hidden=hasItems;
    empty.style.display=hasItems?"none":"grid";
  }
  grid.hidden=!hasItems;
  grid.style.display=hasItems?"grid":"none";

  for(let index=0;index<items.length;index+=1){
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

    const cap=document.createElement("span");
    cap.className="draft-card-caption";
    cap.textContent=title(item,index);
    b.append(cap);
    b.addEventListener("click",()=>openDetail(index));
    grid.append(b);
  }
}
function openDetail(index){if(!items.length)return;activeIndex=(index+items.length)%items.length;const item=items[activeIndex];if(!item.fullUrl)item.fullUrl=item.thumbUrl||url(item.publishBlob||item.originalBlob||item.thumbnailBlob);$("#detailImage").src=item.fullUrl;$("#detailTitle").textContent=title(item,activeIndex);$("#detailMeta").textContent=[item.brand,item.size&&`Storlek ${item.size}`,item.price&&`${item.price} kr`].filter(Boolean).join(" · ");$("#detailCounter").textContent=`${activeIndex+1} av ${items.length}`;$("#publishStatus").textContent=item.publishBlob?"Bilden är beskuren och klar som WebP.":"";show("detailView");}
function next(delta){openDetail(activeIndex+delta);}
let touchStart=null;
$("#swipeArea").addEventListener("pointerdown",e=>{touchStart={x:e.clientX,y:e.clientY};});
$("#swipeArea").addEventListener("pointerup",e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25)next(dx<0?1:-1);});
$("#draftsBtn").addEventListener("click",async()=>{
  await renderGrid();
  show("gridView");
  requestAnimationFrame(()=>$("#gridBack")?.focus({preventScroll:true}));
});
$("#publishedBtn").addEventListener("click",()=>show("publishedView"));
$("#gridBack").addEventListener("click",()=>show("startView"));
$("#publishedBack").addEventListener("click",()=>show("startView"));
$("#detailBack").addEventListener("click",()=>show("gridView"));

function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});}
function geometry(){if(!cropImage||!cropState)return null;const c=$("#cropCanvas"),base=Math.max(c.width/cropImage.naturalWidth,c.height/cropImage.naturalHeight),scale=base*cropState.zoom,w=cropImage.naturalWidth*scale,h=cropImage.naturalHeight*scale,lx=Math.max(0,(w-c.width)/2),ly=Math.max(0,(h-c.height)/2);cropState.x=Math.max(-lx,Math.min(lx,cropState.x));cropState.y=Math.max(-ly,Math.min(ly,cropState.y));return{c,scale,w,h};}
function drawCrop(){const g=geometry();if(!g)return;const ctx=g.c.getContext("2d",{alpha:false});ctx.fillStyle="#111";ctx.fillRect(0,0,g.c.width,g.c.height);ctx.drawImage(cropImage,(g.c.width-g.w)/2+cropState.x,(g.c.height-g.h)/2+cropState.y,g.w,g.h);}
async function openCrop(){const item=items[activeIndex];if(!item.fullUrl)item.fullUrl=item.thumbUrl||url(item.originalBlob||item.thumbnailBlob);cropImage=await loadImage(item.fullUrl);cropState=item.cropData?{...item.cropData}:{zoom:1,x:0,y:0};$("#cropZoom").value=String(cropState.zoom);$("#cropOriginalPreview").src=item.thumbUrl||item.fullUrl;drawCrop();show("cropView");}
async function createOriginalWebP(item){
  const src=item.originalBlob||item.thumbnailBlob;
  if(!src)throw new Error("Originalbild saknas.");
  const sourceUrl=item.thumbUrl||await previewSrc(item);
  const image=await loadImage(sourceUrl);
  const maxSide=1600,scale=Math.min(1,maxSide/Math.max(image.naturalWidth,image.naturalHeight));
  const out=document.createElement("canvas");
  out.width=Math.max(1,Math.round(image.naturalWidth*scale));
  out.height=Math.max(1,Math.round(image.naturalHeight*scale));
  out.getContext("2d",{alpha:false}).drawImage(image,0,0,out.width,out.height);
  return new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error("WebP misslyckades")),"image/webp",.84));
}
$("#cropBtn").addEventListener("click",openCrop);
$("#keepOriginalBtn").addEventListener("click",async()=>{
  const item=items[activeIndex];
  if(!item)return;
  const button=$("#keepOriginalBtn"),old=button.textContent;
  button.disabled=true;button.textContent="Optimerar…";
  try{
    const blob=await createOriginalWebP(item);
    item.publishBlob=blob;
    item.cropData=null;
    item.imageProcessingState="webp-original";
    await put(persistenceRecord({...item,publishBlob:blob,cropData:null,imageProcessingState:item.imageProcessingState}));
    if(item.fullUrl&&item.fullUrl.startsWith("blob:"))URL.revokeObjectURL(item.fullUrl);
    item.fullUrl=url(blob);
    openDetail(activeIndex);
  }catch(error){
    console.error("[CCC Publicera] Kunde inte optimera originalbilden",error);
    button.textContent="Försök igen";
    button.disabled=false;
    return;
  }
  button.textContent=old;button.disabled=false;
});
$("#cropBack").addEventListener("click",()=>openDetail(activeIndex));$("#cropZoom").addEventListener("input",e=>{cropState.zoom=Number(e.target.value)||1;drawCrop();});$("#cropReset").addEventListener("click",()=>{cropState={zoom:1,x:0,y:0};$("#cropZoom").value="1";drawCrop();});
$("#cropCanvas").addEventListener("pointerdown",e=>{if(!cropState)return;e.currentTarget.setPointerCapture?.(e.pointerId);pointer={x:e.clientX,y:e.clientY,ox:cropState.x,oy:cropState.y};});
$("#cropCanvas").addEventListener("pointermove",e=>{if(!pointer)return;const c=e.currentTarget,r=c.getBoundingClientRect();cropState.x=pointer.ox+(e.clientX-pointer.x)*(c.width/Math.max(1,r.width));cropState.y=pointer.oy+(e.clientY-pointer.y)*(c.height/Math.max(1,r.height));drawCrop();});
["pointerup","pointercancel"].forEach(n=>$("#cropCanvas").addEventListener(n,()=>pointer=null));
$("#cropDone").addEventListener("click",async()=>{const item=items[activeIndex],g=geometry();if(!item||!g)return;const sx=Math.max(0,((g.w-g.c.width)/2-cropState.x)/g.scale),sy=Math.max(0,((g.h-g.c.height)/2-cropState.y)/g.scale),size=Math.min(cropImage.naturalWidth-sx,cropImage.naturalHeight-sy,g.c.width/g.scale),outSize=Math.max(1,Math.min(1600,Math.round(size))),out=document.createElement("canvas");out.width=out.height=outSize;out.getContext("2d",{alpha:false}).drawImage(cropImage,sx,sy,size,size,0,0,outSize,outSize);const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error("WebP misslyckades")),"image/webp",.84));item.publishBlob=blob;item.cropData={...cropState};item.imageProcessingState="webp-cropped";await put(persistenceRecord({...item,publishBlob:blob,cropData:item.cropData,imageProcessingState:item.imageProcessingState}));if(item.fullUrl){URL.revokeObjectURL(item.fullUrl);item.fullUrl=url(blob);}openDetail(activeIndex);});

$("#publishBtn").addEventListener("click",()=>{$("#publishStatus").textContent=items[activeIndex].publishBlob?"Nästa steg kopplar den här WebP-bilden till Container13.":"Beskär bilden först så skapas publicerings-WebP lokalt.";if(!items[activeIndex].publishBlob)openCrop();});

(async()=>{try{
  let explicit=(await getAll()).filter(r=>r.readyToPublish!==false);
  explicit=await Promise.all(explicit.map(hydrateOriginal));
  const sessionDrafts=await visionSessionDrafts();
  const merged=new Map(sessionDrafts.map(r=>[r.id,r]));
  explicit.forEach(r=>merged.set(r.id,{...(merged.get(r.id)||{}),...r}));
  let records=[...merged.values()].filter(r=>r.originalBlob||r.publishBlob||r.thumbnailBlob);
  records.sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
  items=await Promise.all(records.map(async r=>({...r,thumbUrl:await previewSrc(r)})));
  await renderGrid();
  show("startView");
}catch(e){
  console.error("[CCC Publicera] Kunde inte läsa lokala utkast",{name:e?.name,message:e?.message},e);
  $("#emptyState").hidden=false;
  $("#emptyState").innerHTML="<strong>Kunde inte läsa lokala utkast</strong><span>Försök öppna Publicera igen.</span>";
}})();
window.addEventListener("pagehide",()=>objectUrls.forEach(u=>URL.revokeObjectURL(u)));

/* CCC cache stamp: v2.8.75 */

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
  const radius=Math.min(c.width,c.height)*.30, near=pts.filter(p=>Math.hypot(p[0]-cx,p[1]-cy)<=radius);
  const use=near.length>15?near:pts;

  // Trim extreme saliency outliers instead of letting one remote edge enlarge the whole box.
  const xs=use.map(p=>p[0]).sort((a,b)=>a-b), ys=use.map(p=>p[1]).sort((a,b)=>a-b);
  const q=(arr,f)=>arr[Math.max(0,Math.min(arr.length-1,Math.floor((arr.length-1)*f)))];
  let minX=q(xs,.05),maxX=q(xs,.95),minY=q(ys,.04),maxY=q(ys,.96);

  const span=Math.max(maxX-minX,maxY-minY);
  const pad=.14*span;
  minX=Math.max(0,minX-pad);maxX=Math.min(c.width,maxX+pad);
  minY=Math.max(0,minY-pad);maxY=Math.min(c.height,maxY+pad);

  const box=Math.max(12,Math.max(maxX-minX,maxY-minY));
  const subjectX=((minX+maxX)/2)/c.width*image.naturalWidth,subjectY=((minY+maxY)/2)/c.height*image.naturalHeight;
  const subjectSize=box/Math.min(c.width,c.height)*Math.min(image.naturalWidth,image.naturalHeight);
  const baseCrop=Math.min(image.naturalWidth,image.naturalHeight);
  const zoom=Math.max(1.05,Math.min(2.55,baseCrop/Math.max(1,subjectSize)*1.08));
  const canvas=$("#cropCanvas"),base=Math.max(canvas.width/image.naturalWidth,canvas.height/image.naturalHeight),scale=base*zoom;
  const x=(image.naturalWidth/2-subjectX)*scale,y=(image.naturalHeight/2-subjectY)*scale;
  return {zoom,x,y};
}
async function openCrop(){
  const item=items[activeIndex];
  if(!item.fullUrl)item.fullUrl=item.thumbUrl||url(item.originalBlob||item.thumbnailBlob);
  cropImage=await loadImage(item.fullUrl);
  if(item.cropData){cropState={...item.cropData};}
  else{
    cropState=smartCropSuggestion(cropImage);
    item.cropSuggestion={...cropState};
  }
  $("#cropZoom").value=String(cropState.zoom);
  $("#cropOriginalPreview").src=item.thumbUrl||item.fullUrl;
  drawCrop();show("cropView");
}
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
$("#cropBack").addEventListener("click",()=>openDetail(activeIndex));$("#cropZoom").addEventListener("input",e=>{cropState.zoom=Number(e.target.value)||1;drawCrop();});$("#cropReset").addEventListener("click",()=>{const suggestion=items[activeIndex]?.cropSuggestion||smartCropSuggestion(cropImage);cropState={...suggestion};$("#cropZoom").value=String(cropState.zoom);drawCrop();});
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
  cropPointers.delete(e.pointerId);
  if(cropPointers.size===1){
    const [id,p]=[...cropPointers.entries()][0];
    pointer={id,x:p.x,y:p.y,ox:cropState?.x||0,oy:cropState?.y||0};
  }else{
    pointer=null;
  }
  pinchStart=null;
}
["pointerup","pointercancel","lostpointercapture"].forEach(n=>$("#cropCanvas").addEventListener(n,endCropPointer));
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

/* CCC cache stamp: v2.8.79 */

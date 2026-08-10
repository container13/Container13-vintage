import { auth } from "../auth/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
onAuthStateChanged(auth,(user)=>{if(!user)window.location.href="../auth/index.html";});

const $=(s)=>document.querySelector(s);
const DB_NAME="ccc-local-workspace", DB_VERSION=3, STORE_NAME="images", FILE_STORE="vision-files";
let items=[],activeIndex=0,objectUrls=[];
let cropImage=null,cropState=null,pointer=null;
let activeItemId=null;
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
    const itemId=item.id;
    b.dataset.itemId=itemId;
    b.addEventListener("click",()=>openDetailById(itemId));
    grid.append(b);
  }
}
function normalizedIndex(index){
  return items.length ? (index+items.length)%items.length : 0;
}
function itemImageSrc(index){
  if(!items.length)return "";
  const item=items[normalizedIndex(index)];
  return item?.fullUrl||item?.thumbUrl||"";
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
  if(!current.fullUrl)current.fullUrl=current.thumbUrl||url(current.publishBlob||current.originalBlob||current.thumbnailBlob);
  $("#detailImage").src=current.fullUrl;
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
  $("#publishStatus").textContent=item.publishBlob?"Bilden är beskuren och klar som WebP.":"";
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
  if(!item.fullUrl)item.fullUrl=item.thumbUrl||url(item.publishBlob||item.originalBlob||item.thumbnailBlob);

  $("#detailImage").src=item.fullUrl;
  updateDetailCopy();
  show("detailView");
  requestAnimationFrame(()=>{
    syncActiveIndexFromId();
    syncSwipeNeighbors();
    requestAnimationFrame(()=>setSwipeTransforms(0,false));
  });
}
function next(delta){openDetail(activeIndex+delta);}

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
    if(!item.fullUrl)item.fullUrl=item.thumbUrl||url(item.publishBlob||item.originalBlob||item.thumbnailBlob);
    $("#detailImage").src=item.fullUrl;
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
  requestAnimationFrame(()=>$("#gridBack")?.focus({preventScroll:true}));
});
$("#publishedBtn").addEventListener("click",()=>show("publishedView"));
$("#gridBack").addEventListener("click",()=>show("startView"));
$("#publishedBack").addEventListener("click",()=>show("startView"));
$("#detailBack").addEventListener("click",async()=>{
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
});

function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});}
function geometry(){if(!cropImage||!cropState)return null;const c=$("#cropCanvas"),base=Math.max(c.width/cropImage.naturalWidth,c.height/cropImage.naturalHeight),scale=base*cropState.zoom,w=cropImage.naturalWidth*scale,h=cropImage.naturalHeight*scale,lx=Math.max(0,(w-c.width)/2),ly=Math.max(0,(h-c.height)/2);cropState.x=Math.max(-lx,Math.min(lx,cropState.x));cropState.y=Math.max(-ly,Math.min(ly,cropState.y));return{c,scale,w,h};}
function drawCrop(){const g=geometry();if(!g)return;const ctx=g.c.getContext("2d",{alpha:false});ctx.fillStyle="#111";ctx.fillRect(0,0,g.c.width,g.c.height);ctx.drawImage(cropImage,(g.c.width-g.w)/2+cropState.x,(g.c.height-g.h)/2+cropState.y,g.w,g.h);}
function difficultImageCropSuggestion(image){
  /* Crop Engine 2.0
     Pass A: build a safe garment box.
     Pass B: trim background while preserving safety margins.
     Entirely local; no image leaves the device. */

  const side=180;
  const c=document.createElement("canvas");
  const ctx=c.getContext("2d",{willReadFrequently:true});
  const ratio=image.naturalWidth/image.naturalHeight;
  c.width=ratio>=1?side:Math.max(84,Math.round(side*ratio));
  c.height=ratio>=1?Math.max(84,Math.round(side/ratio)):side;
  ctx.drawImage(image,0,0,c.width,c.height);

  const {data}=ctx.getImageData(0,0,c.width,c.height);
  const w=c.width,h=c.height;

  const px=(x,y)=>{
    const i=(y*w+x)*4;
    return [data[i],data[i+1],data[i+2]];
  };
  const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);

  // Estimate surrounding background from border median.
  const border=[];
  for(let x=0;x<w;x+=3){border.push(px(x,1),px(x,h-2));}
  for(let y=0;y<h;y+=3){border.push(px(1,y),px(w-2,y));}
  const median=arr=>{
    const a=[...arr].sort((a,b)=>a-b);
    return a[Math.floor(a.length/2)]||0;
  };
  const bg=[
    median(border.map(p=>p[0])),
    median(border.map(p=>p[1])),
    median(border.map(p=>p[2]))
  ];

  // Foreground likelihood. Central weighting is deliberately mild:
  // sleeves and off-centre shirts must survive.
  const mask=new Uint8Array(w*h);
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const p=px(x,y);
      const mx=Math.max(...p),mn=Math.min(...p),sat=mx-mn;
      const bgDist=dist(p,bg);
      const edge=dist(p,px(x+1,y))+dist(p,px(x,y+1));
      const nx=x/(w-1)-.5, ny=y/(h-1)-.5;
      const central=Math.exp(-((nx/.58)**2+(ny/.60)**2));
      const score=bgDist*.50+sat*.60+Math.min(edge,220)*.31+central*18;
      if(score>76)mask[y*w+x]=1;
    }
  }

  // Reconnect thin sleeves/edges.
  const grown=new Uint8Array(w*h);
  for(let y=2;y<h-2;y++){
    for(let x=2;x<w-2;x++){
      let hit=0;
      for(let dy=-2;dy<=2&&!hit;dy++){
        for(let dx=-2;dx<=2;dx++){
          if(mask[(y+dy)*w+x+dx]){hit=1;break;}
        }
      }
      if(hit)grown[y*w+x]=1;
    }
  }

  // Connected components; prefer sizeable central-ish component.
  const seen=new Uint8Array(w*h);
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  let best=null;

  for(let y=2;y<h-2;y++){
    for(let x=2;x<w-2;x++){
      const seed=y*w+x;
      if(!grown[seed]||seen[seed])continue;
      const stack=[seed];
      seen[seed]=1;
      let count=0,minX=x,maxX=x,minY=y,maxY=y,sumX=0,sumY=0;

      while(stack.length){
        const p=stack.pop(),py=Math.floor(p/w),pxv=p-py*w;
        count++;sumX+=pxv;sumY+=py;
        minX=Math.min(minX,pxv);maxX=Math.max(maxX,pxv);
        minY=Math.min(minY,py);maxY=Math.max(maxY,py);

        for(const [dx,dy] of dirs){
          const xx=pxv+dx,yy=py+dy;
          if(xx<2||yy<2||xx>=w-2||yy>=h-2)continue;
          const ni=yy*w+xx;
          if(grown[ni]&&!seen[ni]){seen[ni]=1;stack.push(ni);}
        }
      }

      if(count<34)continue;
      const cx=sumX/count,cy=sumY/count;
      const centrePenalty=Math.hypot(cx/w-.5,cy/h-.5);
      const area=(maxX-minX+1)*(maxY-minY+1);
      const fill=count/Math.max(1,area);
      const score=count*(1.25-centrePenalty)*(.78+Math.min(.45,fill));
      if(!best||score>best.score){
        best={score,minX,maxX,minY,maxY,cx,cy,count};
      }
    }
  }

  if(!best)return {zoom:1,x:0,y:0};

  /* PASS A — SAFE GARMENT BOX
     Protect sleeves more than top/bottom. */
  let minX=best.minX,maxX=best.maxX,minY=best.minY,maxY=best.maxY;
  const garmentW=Math.max(1,maxX-minX);
  const garmentH=Math.max(1,maxY-minY);

  const safeX=Math.max(4,garmentW*.105);
  const safeTop=Math.max(3,garmentH*.065);
  const safeBottom=Math.max(3,garmentH*.075);

  minX=Math.max(0,minX-safeX);
  maxX=Math.min(w-1,maxX+safeX);
  minY=Math.max(0,minY-safeTop);
  maxY=Math.min(h-1,maxY+safeBottom);

  /* PASS B — BACKGROUND TRIM
     Work from the safe rectangle, not from a zoom target.
     We only rebalance/trim spare space while preserving the protected box. */
  const safeW=Math.max(1,maxX-minX);
  const safeH=Math.max(1,maxY-minY);

  // Horizontal balance: shift the crop toward the garment instead of widening it.
  const safeCenterX=(minX+maxX)/2;
  const frameCenterX=w/2;
  const offX=(safeCenterX-frameCenterX)/w;
  const trimShiftX=Math.sign(offX)*Math.min(safeW*.13,Math.abs(offX)*safeW*.72);

  // Vertical optical balance: slightly favour chest/upper body without risking hem.
  const safeCenterY=(minY+maxY)/2;
  const frameCenterY=h/2;
  const offY=(safeCenterY-frameCenterY)/h;
  const trimShiftY=Math.sign(offY)*Math.min(safeH*.07,Math.abs(offY)*safeH*.38);

  const subjectX=(safeCenterX-trimShiftX*.28)/w*image.naturalWidth;
  const subjectY=(safeCenterY-trimShiftY*.22)/h*image.naturalHeight;

  // Square must contain the complete protected garment box.
  // Target fill capped around 86% to retain visible sleeve safety.
  const protectedW=safeW/w*image.naturalWidth;
  const protectedH=safeH/h*image.naturalHeight;
  const needed=Math.max(protectedW,protectedH);
  const baseCrop=Math.min(image.naturalWidth,image.naturalHeight);
  let zoom=(baseCrop/Math.max(1,needed))*.86;
  zoom=Math.max(1,Math.min(1.88,zoom));

  const canvas=$("#cropCanvas");
  const base=Math.max(canvas.width/image.naturalWidth,canvas.height/image.naturalHeight);
  const scale=base*zoom;
  let x=(image.naturalWidth/2-subjectX)*scale;
  let y=(image.naturalHeight/2-subjectY)*scale;

  // Final safety check in crop-space: if detected garment would approach
  // any edge below ~6%, reduce zoom until the safety floor is restored.
  const cropSize=canvas.width;
  const minMargin=cropSize*.06;
  for(let tries=0;tries<5;tries++){
    const currentScale=base*zoom;
    const gx1=(minX/w*image.naturalWidth)*currentScale+(cropSize-image.naturalWidth*currentScale)/2+x;
    const gx2=(maxX/w*image.naturalWidth)*currentScale+(cropSize-image.naturalWidth*currentScale)/2+x;
    const gy1=(minY/h*image.naturalHeight)*currentScale+(cropSize-image.naturalHeight*currentScale)/2+y;
    const gy2=(maxY/h*image.naturalHeight)*currentScale+(cropSize-image.naturalHeight*currentScale)/2+y;

    if(gx1>=minMargin && cropSize-gx2>=minMargin &&
       gy1>=minMargin && cropSize-gy2>=minMargin)break;

    zoom=Math.max(1,zoom*.94);
    const ns=base*zoom;
    x=(image.naturalWidth/2-subjectX)*ns;
    y=(image.naturalHeight/2-subjectY)*ns;
  }

  return {zoom,x,y};
}
function imageNeedsMeaningfulCrop(image){
  const c=document.createElement("canvas");
  const ctx=c.getContext("2d",{willReadFrequently:true});
  const maxSide=96,ratio=image.naturalWidth/image.naturalHeight;
  c.width=ratio>=1?maxSide:Math.max(48,Math.round(maxSide*ratio));
  c.height=ratio>=1?Math.max(48,Math.round(maxSide/ratio)):maxSide;
  ctx.drawImage(image,0,0,c.width,c.height);

  const {data}=ctx.getImageData(0,0,c.width,c.height);
  let borderEdge=0,borderCount=0,interiorEdge=0,interiorCount=0;

  const rgb=(x,y)=>{
    const i=(y*c.width+x)*4;
    return [data[i],data[i+1],data[i+2]];
  };
  const diff=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);

  for(let y=1;y<c.height-1;y+=2){
    for(let x=1;x<c.width-1;x+=2){
      const p=rgb(x,y),edge=diff(p,rgb(x+1,y))+diff(p,rgb(x,y+1));
      const borderZone=x<c.width*.16||x>c.width*.84||y<c.height*.12||y>c.height*.88;
      if(borderZone){borderEdge+=edge;borderCount++;}
      else{interiorEdge+=edge;interiorCount++;}
    }
  }

  const b=borderEdge/Math.max(1,borderCount);
  const i=interiorEdge/Math.max(1,interiorCount);

  /* A clean garment photo normally has quieter outer margins than screenshots,
     collages and web pages. Only invoke stronger auto-crop when the borders
     contain substantial competing structure. */
  return b>i*.82 && b>42;
}

function smartCropSuggestion(image){
  if(!imageNeedsMeaningfulCrop(image)){
    /* Normal CCC camera photo: leave almost untouched.
       Small neutral zoom only compensates for square preview geometry. */
    return {zoom:1,x:0,y:0};
  }

  const suggestion=difficultImageCropSuggestion(image);

  /* Extreme/reference images: CCC proposes, user finishes.
     Hard safety rails stop automatic crop from becoming destructive. */
  suggestion.zoom=Math.max(1,Math.min(1.88,suggestion.zoom||1));
  suggestion.x*=.96;
  suggestion.y*=.96;
  return suggestion;
}

async function openCrop(){
  syncActiveIndexFromId();
  const item=activeItem();
  if(!item)return;
  if(!item.fullUrl)item.fullUrl=item.thumbUrl||url(item.originalBlob||item.thumbnailBlob);
  cropImage=await loadImage(item.fullUrl);
  if(item.cropData){cropState={...item.cropData};}
  else{
    cropState=smartCropSuggestion(cropImage);
    item.cropSuggestion={...cropState};
  }
  $("#cropZoom").value=String(cropState.zoom);
  $("#cropOriginalPreview").src=item.thumbUrl||item.fullUrl;
  const help=$("#cropView .crop-help");
  if(help){
    help.textContent=imageNeedsMeaningfulCrop(cropImage)
      ?"Svår bild: CCC skyddar först hela plagget och trimmar sedan bakgrunden. Dra eller nyp vid behov."
      :"Bilden ser redan bra ut. CCC lämnar utsnittet i princip orört.";
  }
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
$("#cropBack").addEventListener("click",async()=>{
  cropImage=null;
  cropState=null;
  pointer=null;
  await renderGrid();
  activeItemId=null;
  show("gridView");
});$("#cropZoom").addEventListener("input",e=>{cropState.zoom=Number(e.target.value)||1;drawCrop();});$("#cropReset").addEventListener("click",()=>{const suggestion=activeItem()?.cropSuggestion||smartCropSuggestion(cropImage);cropState={...suggestion};$("#cropZoom").value=String(cropState.zoom);drawCrop();});
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
$("#cropDone").addEventListener("click",async()=>{const item=activeItem(),g=geometry();if(!item||!g)return;const sx=Math.max(0,((g.w-g.c.width)/2-cropState.x)/g.scale),sy=Math.max(0,((g.h-g.c.height)/2-cropState.y)/g.scale),size=Math.min(cropImage.naturalWidth-sx,cropImage.naturalHeight-sy,g.c.width/g.scale),outSize=Math.max(1,Math.min(1600,Math.round(size))),out=document.createElement("canvas");out.width=out.height=outSize;out.getContext("2d",{alpha:false}).drawImage(cropImage,sx,sy,size,size,0,0,outSize,outSize);const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error("WebP misslyckades")),"image/webp",.84));item.publishBlob=blob;item.cropData={...cropState};item.imageProcessingState="webp-cropped";await put(persistenceRecord({...item,publishBlob:blob,cropData:item.cropData,imageProcessingState:item.imageProcessingState}));if(item.fullUrl){URL.revokeObjectURL(item.fullUrl);item.fullUrl=url(blob);}openDetail(activeIndex);});

$("#publishBtn").addEventListener("click",()=>{const item=activeItem();if(!item)return;$("#publishStatus").textContent=item.publishBlob?"Nästa steg kopplar den här WebP-bilden till Container13.":"Beskär bilden först så skapas publicerings-WebP lokalt.";if(!item.publishBlob)openCrop();});

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

/* CCC cache stamp: v2.8.90 */

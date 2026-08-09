import { auth } from "../auth/firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
onAuthStateChanged(auth,(user)=>{if(!user)window.location.href="../auth/index.html";});

const $=(s)=>document.querySelector(s);
const DB_NAME="ccc-local-workspace", DB_VERSION=1, STORE_NAME="images";
let items=[],activeIndex=0,objectUrls=[];
let cropImage=null,cropState=null,pointer=null;

function openDb(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const db=r.result;if(!db.objectStoreNames.contains(STORE_NAME)){const s=db.createObjectStore(STORE_NAME,{keyPath:"id"});s.createIndex("createdAt","createdAt");}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function getAll(){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readonly"),r=tx.objectStore(STORE_NAME).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error);tx.oncomplete=()=>db.close();});}
async function put(record){const db=await openDb();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,"readwrite");tx.objectStore(STORE_NAME).put(record);tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(tx.error);};});}
function url(blob){const u=URL.createObjectURL(blob);objectUrls.push(u);return u;}
function title(item,index){return item.title?.trim()||item.fields?.title?.trim()||`Plagg ${index+1}`;}
function show(view){["startView","gridView","publishedView","detailView","cropView"].forEach(id=>$("#"+id).hidden=id!==view);}
function renderGrid(){const grid=$("#draftGrid");grid.replaceChildren();$("#draftCount").textContent=items.length===1?"1 lokalt utkast":`${items.length} lokala utkast`;$("#startDraftCount").textContent=items.length===1?"1 utkast":`${items.length} utkast`;$("#emptyState").hidden=items.length>0;grid.hidden=items.length===0;items.forEach((item,index)=>{const b=document.createElement("button");b.type="button";b.className="draft-card";b.setAttribute("aria-label",`Öppna ${title(item,index)}`);const img=document.createElement("img");img.src=item.thumbUrl;img.alt="";b.append(img);b.addEventListener("click",()=>openDetail(index));grid.append(b);});}
function openDetail(index){if(!items.length)return;activeIndex=(index+items.length)%items.length;const item=items[activeIndex];if(!item.fullUrl)item.fullUrl=url(item.publishBlob||item.originalBlob||item.thumbnailBlob);$("#detailImage").src=item.fullUrl;$("#detailTitle").textContent=title(item,activeIndex);$("#detailMeta").textContent=[item.brand,item.size&&`Storlek ${item.size}`,item.price&&`${item.price} kr`].filter(Boolean).join(" · ");$("#detailCounter").textContent=`${activeIndex+1} av ${items.length}`;$("#publishStatus").textContent=item.publishBlob?"Bilden är beskuren och klar som WebP.":"";show("detail");}
function next(delta){openDetail(activeIndex+delta);}
let touchStart=null;
$("#swipeArea").addEventListener("pointerdown",e=>{touchStart={x:e.clientX,y:e.clientY};});
$("#swipeArea").addEventListener("pointerup",e=>{if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.25)next(dx<0?1:-1);});
$("#draftsBtn").addEventListener("click",()=>show("gridView"));
$("#publishedBtn").addEventListener("click",()=>show("publishedView"));
$("#gridBack").addEventListener("click",()=>show("startView"));
$("#publishedBack").addEventListener("click",()=>show("startView"));
$("#detailBack").addEventListener("click",()=>show("gridView"));

function loadImage(src){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;});}
function geometry(){if(!cropImage||!cropState)return null;const c=$("#cropCanvas"),base=Math.max(c.width/cropImage.naturalWidth,c.height/cropImage.naturalHeight),scale=base*cropState.zoom,w=cropImage.naturalWidth*scale,h=cropImage.naturalHeight*scale,lx=Math.max(0,(w-c.width)/2),ly=Math.max(0,(h-c.height)/2);cropState.x=Math.max(-lx,Math.min(lx,cropState.x));cropState.y=Math.max(-ly,Math.min(ly,cropState.y));return{c,scale,w,h};}
function drawCrop(){const g=geometry();if(!g)return;const ctx=g.c.getContext("2d",{alpha:false});ctx.fillStyle="#111";ctx.fillRect(0,0,g.c.width,g.c.height);ctx.drawImage(cropImage,(g.c.width-g.w)/2+cropState.x,(g.c.height-g.h)/2+cropState.y,g.w,g.h);}
async function openCrop(){const item=items[activeIndex];if(!item.fullUrl)item.fullUrl=url(item.originalBlob||item.thumbnailBlob);cropImage=await loadImage(item.fullUrl);cropState=item.cropData?{...item.cropData}:{zoom:1,x:0,y:0};$("#cropZoom").value=String(cropState.zoom);drawCrop();show("cropView");}
$("#cropBtn").addEventListener("click",openCrop);$("#cropBack").addEventListener("click",()=>openDetail(activeIndex));$("#cropZoom").addEventListener("input",e=>{cropState.zoom=Number(e.target.value)||1;drawCrop();});$("#cropReset").addEventListener("click",()=>{cropState={zoom:1,x:0,y:0};$("#cropZoom").value="1";drawCrop();});
$("#cropCanvas").addEventListener("pointerdown",e=>{if(!cropState)return;e.currentTarget.setPointerCapture?.(e.pointerId);pointer={x:e.clientX,y:e.clientY,ox:cropState.x,oy:cropState.y};});
$("#cropCanvas").addEventListener("pointermove",e=>{if(!pointer)return;const c=e.currentTarget,r=c.getBoundingClientRect();cropState.x=pointer.ox+(e.clientX-pointer.x)*(c.width/Math.max(1,r.width));cropState.y=pointer.oy+(e.clientY-pointer.y)*(c.height/Math.max(1,r.height));drawCrop();});
["pointerup","pointercancel"].forEach(n=>$("#cropCanvas").addEventListener(n,()=>pointer=null));
$("#cropDone").addEventListener("click",async()=>{const item=items[activeIndex],g=geometry();if(!item||!g)return;const sx=Math.max(0,((g.w-g.c.width)/2-cropState.x)/g.scale),sy=Math.max(0,((g.h-g.c.height)/2-cropState.y)/g.scale),size=Math.min(cropImage.naturalWidth-sx,cropImage.naturalHeight-sy,g.c.width/g.scale),outSize=Math.max(1,Math.min(1600,Math.round(size))),out=document.createElement("canvas");out.width=out.height=outSize;out.getContext("2d",{alpha:false}).drawImage(cropImage,sx,sy,size,size,0,0,outSize,outSize);const blob=await new Promise((resolve,reject)=>out.toBlob(b=>b?resolve(b):reject(new Error("WebP misslyckades")),"image/webp",.84));item.publishBlob=blob;item.cropData={...cropState};await put({...item,publishBlob:blob,cropData:item.cropData,thumbUrl:undefined,fullUrl:undefined});if(item.fullUrl){URL.revokeObjectURL(item.fullUrl);item.fullUrl=url(blob);}openDetail(activeIndex);});

$("#publishBtn").addEventListener("click",()=>{$("#publishStatus").textContent=items[activeIndex].publishBlob?"Nästa steg kopplar den här WebP-bilden till Container13.":"Beskär bilden först så skapas publicerings-WebP lokalt.";if(!items[activeIndex].publishBlob)openCrop();});

(async()=>{try{const records=(await getAll()).filter(r=>r.readyToPublish!==false);records.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));items=records.map(r=>({...r,thumbUrl:url(r.thumbnailBlob||r.originalBlob)}));renderGrid();show("startView");}catch(e){console.error(e);$("#emptyState").hidden=false;$("#emptyState").innerHTML="<strong>Kunde inte läsa lokala utkast</strong><span>Försök öppna Publicera igen.</span>";}})();
window.addEventListener("pagehide",()=>objectUrls.forEach(u=>URL.revokeObjectURL(u)));

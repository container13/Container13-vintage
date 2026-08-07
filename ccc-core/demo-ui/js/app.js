import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{
  if(!user) window.location.href="login.html";
});

const root=document.documentElement;
const profileBtn=document.getElementById("profileBtn");
const menu=document.getElementById("profileMenu");
const themeBtn=document.getElementById("themeBtn");
const logout=document.getElementById("logout");
const dialog=document.getElementById("logoutDialog");
const cancel=document.getElementById("cancelLogout");
const confirm=document.getElementById("confirmLogout");
const moreBtn=document.getElementById("moreBtn");
const addImagesBtn=document.getElementById("addImagesBtn");
const backBtn=document.getElementById("backBtn");
const backFromImagesBtn=document.getElementById("backFromImagesBtn");
const homeView=document.getElementById("homeView");
const addImagesView=document.getElementById("addImagesView");
const moreView=document.getElementById("moreView");
const imagesView=document.getElementById("imagesView");
const imageDetailView=document.getElementById("imageDetailView");
const cameraSessionView=document.getElementById("cameraSessionView");
const cameraChoiceBtn=document.getElementById("cameraChoiceBtn");
const albumChoiceBtn=document.getElementById("albumChoiceBtn");
const filesChoiceBtn=document.getElementById("filesChoiceBtn");
const cameraInput=document.getElementById("cameraInput");
const albumInput=document.getElementById("albumInput");
const filesInput=document.getElementById("filesInput");
const imageSelectionStatus=document.getElementById("imageSelectionStatus");
const cameraSessionCount=document.getElementById("cameraSessionCount");
const cameraSessionMessage=document.getElementById("cameraSessionMessage");
const takeNextPhotoBtn=document.getElementById("takeNextPhotoBtn");
const finishCameraSessionBtn=document.getElementById("finishCameraSessionBtn");
const sessionAlbumBtn=document.getElementById("sessionAlbumBtn");
const undoLastImageBtn=document.getElementById("undoLastImageBtn");
const cameraToHomeBtn=document.getElementById("cameraToHomeBtn");
const addMoreImagesBtn=document.getElementById("addMoreImagesBtn");
const backFromCameraSessionBtn=document.getElementById("backFromCameraSessionBtn");
const backFromGalleryBtn=document.getElementById("backFromGalleryBtn");
const backFromDetailBtn=document.getElementById("backFromDetailBtn");
const emptyAddBtn=document.getElementById("emptyAddBtn");
const imagesEmpty=document.getElementById("imagesEmpty");
const imagesContent=document.getElementById("imagesContent");
const imagesGrid=document.getElementById("imagesGrid");
const imagesCount=document.getElementById("imagesCount");
const selectedCount=document.getElementById("selectedCount");
const selectAllImages=document.getElementById("selectAllImages");
const publishSelectedBtn=document.getElementById("publishSelectedBtn");
const imageDetailForm=document.getElementById("imageDetailForm");
const detailPreview=document.getElementById("detailPreview");
const detailTitle=document.getElementById("detailTitle");
const detailBrand=document.getElementById("detailBrand");
const detailSize=document.getElementById("detailSize");
const detailPrice=document.getElementById("detailPrice");
const detailDescription=document.getElementById("detailDescription");
let imageItems=[];
let activeImageId=null;
let lastAddedIds=[];
const objectUrls=new Set();
const DB_NAME="ccc-local-workspace";
const DB_VERSION=1;
const STORE_NAME="images";

function openLocalDb(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE_NAME)){
        const store=db.createObjectStore(STORE_NAME,{keyPath:"id"});
        store.createIndex("createdAt","createdAt");
      }
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}

async function dbRequest(mode,operation){
  const db=await openLocalDb();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE_NAME,mode);
    const store=tx.objectStore(STORE_NAME);
    const request=operation(store);
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
    tx.oncomplete=()=>db.close();
    tx.onerror=()=>{db.close();reject(tx.error);};
  });
}

const saveLocalItem=(item)=>dbRequest("readwrite",(store)=>store.put(item));
const deleteLocalItem=(id)=>dbRequest("readwrite",(store)=>store.delete(id));
const getAllLocalItems=()=>dbRequest("readonly",(store)=>store.getAll());

function makeObjectUrl(blob){
  const url=URL.createObjectURL(blob);
  objectUrls.add(url);
  return url;
}

function revokeItemUrls(item){
  [item?.url,item?.fullUrl].forEach((url)=>{
    if(url && objectUrls.has(url)){URL.revokeObjectURL(url);objectUrls.delete(url);}
  });
}

async function createThumbnail(file,maxSize=360,quality=.78){
  let bitmap;
  try{
    bitmap=await createImageBitmap(file);
    const scale=Math.min(1,maxSize/Math.max(bitmap.width,bitmap.height));
    const width=Math.max(1,Math.round(bitmap.width*scale));
    const height=Math.max(1,Math.round(bitmap.height*scale));
    const canvas=document.createElement("canvas");
    canvas.width=width;canvas.height=height;
    const ctx=canvas.getContext("2d",{alpha:false});
    ctx.drawImage(bitmap,0,0,width,height);
    bitmap.close?.();
    const blob=await new Promise((resolve)=>canvas.toBlob(resolve,"image/webp",quality));
    return blob || file;
  }catch(error){
    console.warn("Kunde inte skapa WebP-miniatyr",error);
    bitmap?.close?.();
    return file;
  }
}

function hydrateItem(record){
  return {...record,selected:false,url:makeObjectUrl(record.thumbnailBlob || record.originalBlob)};
}

async function loadLocalWorkspace(){
  try{
    const records=await getAllLocalItems();
    records.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
    imageItems.forEach(revokeItemUrls);
    imageItems=records.map(hydrateItem);
    renderImages();
  }catch(error){
    console.error("Kunde inte läsa lokal arbetsyta",error);
    if(imageSelectionStatus){imageSelectionStatus.textContent="Kunde inte läsa lokala bilder.";imageSelectionStatus.hidden=false;}
  }
}
let cameraSessionAdded=0;

function setMenu(open){
  menu.hidden=!open;
  profileBtn?.setAttribute("aria-expanded",String(open));
}

profileBtn?.addEventListener("click",(event)=>{
  event.stopPropagation();
  setMenu(menu.hidden);
});

document.addEventListener("click",(event)=>{
  if(!menu.hidden && !menu.contains(event.target) && event.target!==profileBtn) setMenu(false);
});

document.addEventListener("keydown",(event)=>{
  if(event.key==="Escape"){
    setMenu(false);
    dialog.hidden=true;
  }
});

logout?.addEventListener("click",()=>{
  setMenu(false);
  dialog.hidden=false;
});
cancel?.addEventListener("click",()=>{ dialog.hidden=true; });
dialog?.addEventListener("click",(event)=>{ if(event.target===dialog) dialog.hidden=true; });

confirm?.addEventListener("click",async()=>{
  await signOut(auth);
  window.location.href="login.html";
});

function applyTheme(theme){
  root.dataset.theme=theme;
  localStorage.setItem("ccc-theme",theme);
  themeBtn?.setAttribute("aria-pressed",String(theme==="dark"));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",theme==="dark"?"#11141b":"#f7f7f9");
}

const savedTheme=localStorage.getItem("ccc-theme");
const preferredDark=window.matchMedia?.("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (preferredDark?"dark":"light"));
themeBtn?.addEventListener("click",()=>applyTheme(root.dataset.theme==="dark"?"light":"dark"));

function showView(view){
  homeView.hidden=view!=="home";
  addImagesView.hidden=view!=="add";
  imagesView.hidden=view!=="images";
  imageDetailView.hidden=view!=="detail";
  moreView.hidden=view!=="more";
  cameraSessionView.hidden=view!=="camera";

  // Varje vy börjar rent högst upp. Intern scroll i Mina bilder återställs också.
  dashboardMain?.scrollTo?.({top:0,left:0,behavior:"instant"});
  imagesGrid?.scrollTo?.({top:0,left:0,behavior:"instant"});
}
moreBtn?.addEventListener("click",()=>showView("more"));
addImagesBtn?.addEventListener("click",()=>{ window.location.href="../vision/index.html"; });
backBtn?.addEventListener("click",()=>showView("home"));
backFromImagesBtn?.addEventListener("click",()=>showView("home"));
backFromGalleryBtn?.addEventListener("click",()=>showView("home"));
backFromDetailBtn?.addEventListener("click",()=>showView("images"));
emptyAddBtn?.addEventListener("click",()=>showView("add"));

function openCamera(){ cameraInput?.click(); }
cameraChoiceBtn?.addEventListener("click",()=>{
  cameraSessionAdded=0;
  lastAddedIds=[];
  updateCameraSession();
  openCamera();
});
albumChoiceBtn?.addEventListener("click",()=>albumInput?.click());
filesChoiceBtn?.addEventListener("click",()=>filesInput?.click());

function imageLabel(item){
  return item.title?.trim() || "Namnlös";
}

function selectedItems(){
  return imageItems.filter((item)=>item.selected);
}

function updateSelectionUi(){
  const count=selectedItems().length;
  if(selectedCount) selectedCount.textContent=`${count} markerade`;
  if(publishSelectedBtn) publishSelectedBtn.disabled=count===0;
  if(selectAllImages){
    selectAllImages.checked=imageItems.length>0 && count===imageItems.length;
    selectAllImages.indeterminate=count>0 && count<imageItems.length;
  }
}

function renderImages(){
  const count=imageItems.length;
  if(imagesCount) imagesCount.textContent=count===1?"1 lokal bild":`${count} lokala bilder`;
  if(imagesEmpty) imagesEmpty.hidden=count>0;
  if(imagesContent) imagesContent.hidden=count===0;
  if(!imagesGrid) return;
  imagesGrid.replaceChildren();
  imageItems.forEach((item)=>{
    const card=document.createElement("article");
    card.className="image-card";
    card.innerHTML=`
      <label class="image-select-wrap" aria-label="Markera ${imageLabel(item)}">
        <input class="image-select" type="checkbox" ${item.selected?"checked":""}>
      </label>
      <button class="image-open" type="button">
        <img class="image-thumb" src="${item.url}" alt="${imageLabel(item)}">
        <span class="image-meta"><strong>${imageLabel(item)}</strong><small>${item.title?"Klar":"Komplettera"}</small></span>
      </button>`;
    card.querySelector(".image-select")?.addEventListener("change",(event)=>{
      item.selected=event.target.checked;
      updateSelectionUi();
    });
    card.querySelector(".image-open")?.addEventListener("click",()=>openImageDetail(item.id));
    imagesGrid.append(card);
  });
  updateSelectionUi();
}

function updateCameraSession(){
  if(cameraSessionCount) cameraSessionCount.textContent=cameraSessionAdded===1?"1 bild tagen":`${cameraSessionAdded} bilder tagna`;
  if(cameraSessionMessage) cameraSessionMessage.textContent=cameraSessionAdded===1?"Bild sparad lokalt":"Bilder sparade lokalt";
  if(undoLastImageBtn) undoLastImageBtn.disabled=lastAddedIds.length===0;
}

async function addFiles(files,source="files"){
  const selected=[...(files||[])].filter((file)=>file.type.startsWith("image/"));
  if(!selected.length) return;
  const added=[];
  if(imageSelectionStatus){imageSelectionStatus.textContent="Bearbetar bilder lokalt…";imageSelectionStatus.hidden=false;}
  for(const file of selected){
    const id=crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const thumbnailBlob=await createThumbnail(file);
    const record={
      id,
      originalBlob:file,
      thumbnailBlob,
      originalName:file.name || `ccc-bild-${Date.now()}`,
      originalType:file.type || "image/jpeg",
      createdAt:Date.now()+added.length,
      title:"",brand:"",size:"",price:"",description:""
    };
    await saveLocalItem(record);
    const item=hydrateItem(record);
    imageItems.unshift(item);
    added.push(item);
  }
  lastAddedIds=added.map((item)=>item.id);
  renderImages();
  if(source==="camera"){
    cameraSessionAdded+=added.length;
    updateCameraSession();
    showView("camera");
    return;
  }
  if(imageSelectionStatus){
    imageSelectionStatus.textContent=added.length===1?"1 bild sparad lokalt.":`${added.length} bilder sparade lokalt.`;
    imageSelectionStatus.hidden=false;
  }
  showView("images");
}

[cameraInput,albumInput,filesInput].forEach((input)=>{
  input?.addEventListener("change",async()=>{
    try{await addFiles(input.files,input===cameraInput?"camera":input===albumInput?"album":"files");}
    catch(error){console.error(error);alert("Bilderna kunde inte sparas lokalt.");}
    input.value="";
  });
});

takeNextPhotoBtn?.addEventListener("click",openCamera);
sessionAlbumBtn?.addEventListener("click",()=>albumInput?.click());
finishCameraSessionBtn?.addEventListener("click",()=>showView("images"));
backFromCameraSessionBtn?.addEventListener("click",()=>showView("add"));
cameraToHomeBtn?.addEventListener("click",()=>showView("home"));
addMoreImagesBtn?.addEventListener("click",()=>showView("add"));

undoLastImageBtn?.addEventListener("click",async()=>{
  const id=lastAddedIds.pop();
  if(!id) return;
  const index=imageItems.findIndex((item)=>item.id===id);
  if(index>=0){
    const [item]=imageItems.splice(index,1);
    revokeItemUrls(item);
  }
  await deleteLocalItem(id);
  cameraSessionAdded=Math.max(0,cameraSessionAdded-1);
  updateCameraSession();
  renderImages();
  undoLastImageBtn.disabled=lastAddedIds.length===0;
});

selectAllImages?.addEventListener("change",()=>{
  imageItems.forEach((item)=>{item.selected=selectAllImages.checked;});
  renderImages();
});

function openImageDetail(id){
  const item=imageItems.find((entry)=>entry.id===id);
  if(!item) return;
  activeImageId=id;
  if(!item.fullUrl) item.fullUrl=makeObjectUrl(item.originalBlob || item.thumbnailBlob);
  detailPreview.src=item.fullUrl;
  detailTitle.value=item.title;
  detailBrand.value=item.brand;
  detailSize.value=item.size;
  detailPrice.value=item.price;
  detailDescription.value=item.description;
  showView("detail");
}

imageDetailForm?.addEventListener("submit",(event)=>{
  event.preventDefault();
  const item=imageItems.find((entry)=>entry.id===activeImageId);
  if(!item) return;
  item.title=detailTitle.value.trim();
  item.brand=detailBrand.value.trim();
  item.size=detailSize.value.trim();
  item.price=detailPrice.value.trim();
  item.description=detailDescription.value.trim();
  saveLocalItem({
    id:item.id,
    originalBlob:item.originalBlob,
    thumbnailBlob:item.thumbnailBlob,
    originalName:item.originalName,
    originalType:item.originalType,
    createdAt:item.createdAt,
    title:item.title,brand:item.brand,size:item.size,price:item.price,description:item.description
  }).catch((error)=>console.error("Kunde inte spara bildinformationen",error));
  renderImages();
  showView("images");
});

publishSelectedBtn?.addEventListener("click",()=>{
  if(!selectedItems().length) return;
  window.location.href="publicera.html";
});

loadLocalWorkspace();

function updateGreeting(){
  const hour=new Date().getHours();
  let text="Hej";
  let icon="☀";
  if(hour<6){text="God natt";icon="☾";}
  else if(hour<10){text="God morgon";}
  else if(hour<12){text="God förmiddag";}
  else if(hour<17){text="God eftermiddag";icon="◉";}
  else if(hour<23){text="God kväll";icon="☾";}
  else{text="God natt";icon="☾";}
  const greetingText=document.getElementById("greetingText");
  const greetingIcon=document.getElementById("greetingIcon");
  if(greetingText) greetingText.textContent=text;
  if(greetingIcon) greetingIcon.textContent=icon;
}
updateGreeting();

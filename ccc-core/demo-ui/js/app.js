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
const cameraChoiceBtn=document.getElementById("cameraChoiceBtn");
const albumChoiceBtn=document.getElementById("albumChoiceBtn");
const filesChoiceBtn=document.getElementById("filesChoiceBtn");
const cameraInput=document.getElementById("cameraInput");
const albumInput=document.getElementById("albumInput");
const filesInput=document.getElementById("filesInput");
const imageSelectionStatus=document.getElementById("imageSelectionStatus");
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
}
moreBtn?.addEventListener("click",()=>showView("more"));
addImagesBtn?.addEventListener("click",()=>showView("add"));
backBtn?.addEventListener("click",()=>showView("home"));
backFromImagesBtn?.addEventListener("click",()=>showView("home"));
backFromGalleryBtn?.addEventListener("click",()=>showView("home"));
backFromDetailBtn?.addEventListener("click",()=>showView("images"));
emptyAddBtn?.addEventListener("click",()=>showView("add"));

cameraChoiceBtn?.addEventListener("click",()=>cameraInput?.click());
albumChoiceBtn?.addEventListener("click",()=>albumInput?.click());
filesChoiceBtn?.addEventListener("click",()=>filesInput?.click());

function imageLabel(item){
  return item.title?.trim() || "Namnlös bild";
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
  if(imagesCount) imagesCount.textContent=count===1?"1 bild":`${count} bilder`;
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
        <span class="image-meta"><strong>${imageLabel(item)}</strong><small>${item.title?"Sparad":"Tryck för att fylla i"}</small></span>
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

function addFiles(files){
  const selected=[...(files||[])].filter((file)=>file.type.startsWith("image/"));
  selected.forEach((file)=>imageItems.push({
    id:crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    file,
    url:URL.createObjectURL(file),
    selected:false,
    title:"",brand:"",size:"",price:"",description:""
  }));
  if(!selected.length) return;
  if(imageSelectionStatus){
    imageSelectionStatus.textContent=selected.length===1?"1 bild tillagd.":`${selected.length} bilder tillagda.`;
    imageSelectionStatus.hidden=false;
  }
  renderImages();
  showView("images");
}

[cameraInput,albumInput,filesInput].forEach((input)=>{
  input?.addEventListener("change",()=>{
    addFiles(input.files);
    input.value="";
  });
});

selectAllImages?.addEventListener("change",()=>{
  imageItems.forEach((item)=>{item.selected=selectAllImages.checked;});
  renderImages();
});

function openImageDetail(id){
  const item=imageItems.find((entry)=>entry.id===id);
  if(!item) return;
  activeImageId=id;
  detailPreview.src=item.url;
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
  renderImages();
  showView("images");
});

publishSelectedBtn?.addEventListener("click",()=>{
  if(!selectedItems().length) return;
  window.location.href="publicera.html";
});

renderImages();

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

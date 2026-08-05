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
const cameraChoiceBtn=document.getElementById("cameraChoiceBtn");
const albumChoiceBtn=document.getElementById("albumChoiceBtn");
const filesChoiceBtn=document.getElementById("filesChoiceBtn");
const cameraInput=document.getElementById("cameraInput");
const albumInput=document.getElementById("albumInput");
const filesInput=document.getElementById("filesInput");
const imageSelectionStatus=document.getElementById("imageSelectionStatus");

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
  addImagesView.hidden=view!=="images";
  moreView.hidden=view!=="more";
}
moreBtn?.addEventListener("click",()=>showView("more"));
addImagesBtn?.addEventListener("click",()=>showView("images"));
backBtn?.addEventListener("click",()=>showView("home"));
backFromImagesBtn?.addEventListener("click",()=>showView("home"));

cameraChoiceBtn?.addEventListener("click",()=>cameraInput?.click());
albumChoiceBtn?.addEventListener("click",()=>albumInput?.click());
filesChoiceBtn?.addEventListener("click",()=>filesInput?.click());

function reportSelectedImages(input){
  const count=input?.files?.length || 0;
  if(!count || !imageSelectionStatus) return;
  imageSelectionStatus.textContent=count===1
    ? "1 bild vald – nästa steg blir Inkorgen."
    : `${count} bilder valda – nästa steg blir Inkorgen.`;
  imageSelectionStatus.hidden=false;
}
[cameraInput,albumInput,filesInput].forEach((input)=>{
  input?.addEventListener("change",()=>reportSelectedImages(input));
});

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

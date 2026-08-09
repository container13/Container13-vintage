// CCC Core JS v1.0 — v2.8.14
// Gemensamt beteende: tema, profilmeny och logout.

const root=document.documentElement;
const $=(selector)=>document.querySelector(selector);

function applyTheme(theme){
  root.dataset.theme=theme;
  localStorage.setItem("ccc-theme",theme);
  $("#themeBtn")?.setAttribute("aria-pressed",String(theme==="dark"));
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content",theme==="dark"?"#11141b":"#f7f7f9");
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
    window.location.href="./auth/index.html";
  }catch(error){
    console.error("CCC logout failed",error);
    confirmLogout.disabled=false;
  }
});
window.CCC_CORE={applyTheme,setProfileMenu,setLogoutDialog};

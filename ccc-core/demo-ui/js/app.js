import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{
 if(!user) window.location.href="login.html";
});

const profileBtn=document.getElementById("profileBtn");
const menu=document.getElementById("profileMenu");
const logout=document.getElementById("logout");
const dialog=document.getElementById("logoutDialog");
const cancel=document.getElementById("cancelLogout");
const confirm=document.getElementById("confirmLogout");

profileBtn?.addEventListener("click",()=>menu.classList.toggle("show"));
logout?.addEventListener("click",()=>dialog.classList.add("show"));
cancel?.addEventListener("click",()=>dialog.classList.remove("show"));

confirm?.addEventListener("click",async()=>{
 await signOut(auth);
 window.location.href="login.html";
});

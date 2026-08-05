import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

onAuthStateChanged(auth,(user)=>{
 if(!user) window.location.href="login.html";
});

const logout=document.getElementById("logout");
if(logout){
 logout.onclick=async()=>{
  await signOut(auth);
  window.location.href="login.html";
 };
}

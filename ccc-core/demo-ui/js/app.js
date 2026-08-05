import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const login=document.getElementById("loginButton");
if(login){
 login.onclick=async()=>{
  const email=document.getElementById("email").value;
  const password=document.getElementById("password").value;
  const msg=document.getElementById("message");
  try{
   await signInWithEmailAndPassword(auth,email,password);
   location.href="dashboard.html";
  }catch(e){msg.textContent="Fel e-post eller lösenord.";}
 };
}
const p=document.getElementById("password");
const eye=document.getElementById("togglePassword");
if(eye){eye.onclick=()=>p.type=p.type==="password"?"text":"password";}

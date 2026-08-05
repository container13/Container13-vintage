import { auth } from "../firebase/firebase.js";
import { signInWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const email=document.getElementById("email");
const password=document.getElementById("password");
const message=document.getElementById("message");

document.getElementById("togglePassword").onclick=()=>{
 password.type=password.type==="password"?"text":"password";
};

document.getElementById("loginButton").onclick=async()=>{
 try{
  await signInWithEmailAndPassword(auth,email.value,password.value);
  location.href="dashboard.html";
 }catch(e){
  message.textContent="Vi kunde inte logga in. Kontrollera e-post och lösenord.";
 }
};

onAuthStateChanged(auth,(user)=>{
 if(user){ /* session exists */ }
});

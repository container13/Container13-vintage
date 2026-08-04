
const toggle=document.getElementById("togglePassword");
const password=document.getElementById("password");

if(toggle && password){
 toggle.onclick=()=>{
  password.type=password.type==="password"?"text":"password";
 };
}

const login=document.getElementById("loginButton");
if(login){
 login.onclick=()=>{
  document.getElementById("message").textContent="Nästa steg: koppla Firebase Auth.";
 };
}

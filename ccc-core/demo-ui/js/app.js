
const p=document.getElementById('password');
const eye=document.getElementById('togglePassword');
if(eye){eye.onclick=()=>p.type=p.type==='password'?'text':'password';}

const profile=document.getElementById('profileBtn');
const menu=document.getElementById('profileMenu');
if(profile){profile.onclick=()=>menu.classList.toggle('show');}

const login=document.getElementById('loginButton');
if(login){
 login.onclick=()=>{
  document.getElementById('message').textContent='Firebase Auth kopplas i nästa steg.';
 };
}

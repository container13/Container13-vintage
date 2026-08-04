
const button=document.getElementById("togglePassword");
const password=document.getElementById("password");

if(button && password){
 button.addEventListener("click",()=>{
   if(password.type==="password"){
     password.type="text";
   } else {
     password.type="password";
   }
 });
}

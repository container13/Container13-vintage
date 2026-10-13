document.getElementById('test').addEventListener('click',async()=>{
const field=document.getElementById('token');
const token=field.value.trim();
field.value='';
const result=document.getElementById('result');
if(!/^[A-Za-z0-9_-]{43}$/.test(token)){result.textContent='Ogiltigt tokenformat';return;}
result.textContent='Kontrollerar…';
try{
const response=await fetch('https://wykvztfmfbboxiqvuvwr.supabase.co/functions/v1/remember-guest-metadata',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({token})
});
const data=await response.json();
result.textContent=response.ok&&data.found===true
?'GODKÄNT: '+data.title+' (uppladdning öppen: '+(data.uploadsOpen?'ja':'nej')+')'
:response.ok?'Token nekad':'HTTP '+response.status;
}catch{result.textContent='Anslutningsfel';}
});
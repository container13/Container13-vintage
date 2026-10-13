const ENDPOINT='https://wykvztfmfbboxiqvuvwr.supabase.co/functions/v1/remember-photo-gallery';
export function mountRememberGallery({container,auth}) {
 container.innerHTML='<h2>Albumets bilder</h2><p class="remember-gallery-status" role="status">Hämtar bilder…</p><div class="remember-gallery-grid"></div><div class="remember-gallery-viewer" hidden><button type="button" aria-label="Stäng bild">✕ Stäng</button><img alt="Albumfoto"></div>';
 const status=container.querySelector('.remember-gallery-status'),grid=container.querySelector('.remember-gallery-grid'),viewer=container.querySelector('.remember-gallery-viewer'),large=viewer.querySelector('img');
 viewer.querySelector('button').onclick=()=>{viewer.hidden=true;large.removeAttribute('src');};
 viewer.onclick=e=>{if(e.target===viewer)viewer.querySelector('button').click();};
 let busy=false,stopped=false;
 async function refresh(){
  if(busy||stopped||document.hidden)return;
  busy=true;
  try{
   const options=await auth();
   if(!options)return;
   const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json',...(options.bearer?{Authorization:'Bearer '+options.bearer}:{})},body:JSON.stringify(options.token?{token:options.token}:{albumId:options.albumId}),cache:'no-store'});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||!data.ok)throw Error(data.error||'Kunde inte hämta bilder');
   const photos=data.photos||[];
   const previous=grid.querySelectorAll('img').length;
   grid.replaceChildren(...photos.map((p,i)=>{const img=document.createElement('img');img.src=p.url;img.alt='Albumfoto '+(i+1);img.loading=i<4?'eager':'lazy';img.onclick=()=>{large.src=p.url;viewer.hidden=false;};return img;}));
   status.textContent=photos.length?photos.length+' bilder i albumet · senaste överst':'Inga bilder i albumet ännu.';
   if(photos.length>previous)container.dataset.lastAdded=String(Date.now());
  }catch(e){status.textContent='Kunde inte visa albumets bilder. '+(e instanceof Error?e.message:'Försök igen.');}
  finally{busy=false;}
 }
 const timer=setInterval(refresh,30000);
 const onVisible=()=>{if(!document.hidden)void refresh();};
 document.addEventListener('visibilitychange',onVisible);
 void refresh();
 return {refresh,stop(){stopped=true;clearInterval(timer);document.removeEventListener('visibilitychange',onVisible);}};
}

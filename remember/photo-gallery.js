import {shareRememberCrop} from './photo-crop.js?v=0.1.72';
const ENDPOINT='https://wykvztfmfbboxiqvuvwr.supabase.co/functions/v1/remember-photo-gallery';
export function mountRememberGallery({container,auth}) {
 container.innerHTML='<h2>Albumets bilder</h2><p class="remember-gallery-status" role="status">Hämtar bilder…</p><div class="remember-gallery-grid"></div><div class="remember-gallery-viewer" hidden><button type="button" aria-label="Stäng bild">✕ Stäng</button><button type="button" class="remember-crop-button" aria-label="Spara bildutsnitt">📷</button><img alt="Albumfoto"></div>';
 const styleId='remember-photo-gesture-style';
 if(!document.getElementById(styleId)){
  const style=document.createElement('style');style.id=styleId;
  style.textContent='.remember-gallery-viewer:not([hidden]){touch-action:none;overflow:hidden;overscroll-behavior:contain}.remember-gallery-viewer img{pointer-events:none;user-select:none;-webkit-user-drag:none;touch-action:none;transition:transform .25s ease,opacity .25s ease}.remember-gallery-viewer img.dragging{transition:none}.remember-gallery-viewer img.incoming-photo{position:absolute;inset:0;margin:auto;max-width:96vw;max-height:88dvh;object-fit:contain;transition:transform .32s cubic-bezier(.2,.75,.25,1);z-index:0}.remember-gallery-viewer button{z-index:2}.remember-gallery-viewer .remember-crop-button{position:absolute;top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 24px);right:16px;width:52px;height:52px;border-radius:50%;background:#e8d4aa;color:#173a2d;font-size:24px;box-shadow:0 5px 20px #0008}.remember-gallery-viewer.controls-hidden button{opacity:0;pointer-events:none}';document.head.append(style);
 }
 const status=container.querySelector('.remember-gallery-status'),grid=container.querySelector('.remember-gallery-grid'),viewer=container.querySelector('.remember-gallery-viewer'),large=viewer.querySelector('img');
 // Shared Micke50-style viewer: vertical swipe, 8x pinch/pan, 3s reset.
 const closeButton=viewer.querySelector('button');
 const cropButton=viewer.querySelector('.remember-crop-button');
 cropButton.onclick=async()=>{if(!photos[pos])return;cropButton.disabled=true;try{await shareRememberCrop(photos[pos].url,large,viewer)}catch(e){if(e?.name!=='AbortError')alert('Kunde inte skapa bildutdrag. Prova vanlig skärmdump.')}finally{cropButton.disabled=false;controls()}};
 let photos=[],pos=0,gesture='none',startX=0,startY=0,zoomStartDistance=1,zoomStartX=0,zoomStartY=0,zoomHold=false,zoomTimer=null,zoomMoved=false,swipeLocked=false,mouseDown=false,scale=1,panX=0,panY=0,pinchBase=1,panBaseX=0,panBaseY=0,panStartX=0,panStartY=0,lastTap=0,controlsTimer=null;
 const midpoint=t=>({x:(t[0].clientX+t[1].clientX)/2,y:(t[0].clientY+t[1].clientY)/2});
 const gap=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
 const clearZoom=()=>{clearTimeout(zoomTimer);zoomTimer=null;zoomHold=false};
 const render=()=>{large.style.transform='translate3d('+panX+'px,'+panY+'px,0) scale('+scale+')';large.style.opacity='1'};
 const controls=()=>{viewer.classList.remove('controls-hidden');clearTimeout(controlsTimer);controlsTimer=setTimeout(()=>{if(!viewer.hidden)viewer.classList.add('controls-hidden')},2800)};
 function resetDrag(){gesture='none';scale=1;panX=panY=0;large.classList.remove('dragging');render()}
 function show(i){if(!photos.length)return;clearZoom();pos=(i+photos.length)%photos.length;large.style.transition='none';resetDrag();large.src=photos[pos].url;viewer.hidden=false;viewer.setAttribute('aria-label','Bild '+(pos+1)+' av '+photos.length);controls();requestAnimationFrame(()=>{large.style.transition=''})}
 function close(){clearZoom();clearTimeout(controlsTimer);viewer.hidden=true;large.removeAttribute('src');resetDrag();document.body.style.overflow=''}
 closeButton.onclick=close;
 viewer.onclick=e=>{if(e.target===viewer)close()};
 function finishSwipe(dx,dy){
  large.classList.remove('dragging');
  if(Math.abs(dy)<65||Math.abs(dy)<=Math.abs(dx)*1.2||photos.length<2){resetDrag();return}
  swipeLocked=true;clearZoom();
  const dir=dy<0?1:-1,next=(pos+dir+photos.length)%photos.length;
  const incoming=document.createElement('img');incoming.className='incoming-photo';incoming.alt='';incoming.src=photos[next].url;
  incoming.style.transform='translate3d(0,'+(dir*100)+'vh,0)';viewer.append(incoming);
  large.style.transition='transform .32s cubic-bezier(.2,.75,.25,1),opacity .32s ease';
  large.style.transform='translate3d(0,'+(-dir*100)+'vh,0)';large.style.opacity='.45';
  requestAnimationFrame(()=>requestAnimationFrame(()=>{incoming.style.transform='translate3d(0,0,0)'}));
  setTimeout(()=>{incoming.remove();if(!viewer.hidden)show(next);swipeLocked=false},340);
 }
 viewer.addEventListener('touchstart',e=>{
  if(e.target.closest('button')||swipeLocked)return;
  
  if(e.touches.length>=2){clearZoom();e.preventDefault();gesture='zoom';pinchBase=scale;panBaseX=panX;panBaseY=panY;const m=midpoint(e.touches);zoomStartX=m.x;zoomStartY=m.y;zoomStartDistance=Math.max(1,gap(e.touches));zoomMoved=false;large.classList.add('dragging')}
  else if(e.touches.length===1&&gesture==='none'){gesture=scale>1.01?'pan':'swipe';startX=e.touches[0].clientX;startY=e.touches[0].clientY;panStartX=startX;panStartY=startY;panBaseX=panX;panBaseY=panY;large.classList.add('dragging')}
 },{passive:false});
 viewer.addEventListener('touchmove',e=>{
  if(gesture==='zoom'&&e.touches.length>=2){e.preventDefault();const m=midpoint(e.touches);scale=Math.max(1,Math.min(8,pinchBase*Math.pow(Math.max(.15,gap(e.touches)/zoomStartDistance),2.3)));panX=panBaseX+m.x-zoomStartX;panY=panBaseY+m.y-zoomStartY;render()}
  else if(gesture==='pan'&&e.touches.length===1){e.preventDefault();panX=panBaseX+e.touches[0].clientX-panStartX;panY=panBaseY+e.touches[0].clientY-panStartY;render()}
  else if(gesture==='swipe'&&e.touches.length===1){e.preventDefault();const dx=e.touches[0].clientX-startX,dy=e.touches[0].clientY-startY;large.style.transform='translate3d(0,'+(Math.abs(dy)>Math.abs(dx)?dy:0)+'px,0)';large.style.opacity=String(Math.max(.5,1-Math.abs(dy)/800))}
 },{passive:false});
 viewer.addEventListener('touchend',e=>{
  if(gesture==='zoom'){if(e.touches.length===1){gesture='pan';panStartX=e.touches[0].clientX;panStartY=e.touches[0].clientY;panBaseX=panX;panBaseY=panY}else if(!e.touches.length){gesture='none';large.classList.remove('dragging');if(scale<=1.01)resetDrag();controls()}return}
  if(gesture==='pan'&&!e.touches.length){gesture='none';large.classList.remove('dragging');controls();return}
  if(gesture==='swipe'&&e.touches.length===0){const t=e.changedTouches[0];gesture='none';if(t&&Math.abs(t.clientX-startX)<12&&Math.abs(t.clientY-startY)<12){const now=Date.now();if(now-lastTap<350){resetDrag();lastTap=0}else{lastTap=now;controls()}}else if(t)finishSwipe(t.clientX-startX,t.clientY-startY);else resetDrag()}
 },{passive:false});
 viewer.addEventListener('touchcancel',()=>{gesture='none';large.classList.remove('dragging');render();controls()},{passive:true});
 viewer.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.target.closest('button')||swipeLocked)return;mouseDown=true;startX=e.clientX;startY=e.clientY;panStartX=startX;panStartY=startY;panBaseX=panX;panBaseY=panY;gesture=scale>1.01?'pan':'swipe';large.classList.add('dragging')});
 viewer.addEventListener('pointermove',e=>{if(!mouseDown||e.pointerType!=='mouse')return;const dx=e.clientX-startX,dy=e.clientY-startY;if(gesture==='pan'){panX=panBaseX+dx;panY=panBaseY+dy;render()}else large.style.transform='translate3d(0,'+(Math.abs(dy)>Math.abs(dx)?dy:0)+'px,0)'});
 viewer.addEventListener('pointerup',e=>{if(!mouseDown||e.pointerType!=='mouse')return;mouseDown=false;if(gesture==='pan'){gesture='none';large.classList.remove('dragging');controls()}else finishSwipe(e.clientX-startX,e.clientY-startY)});
 viewer.addEventListener('pointercancel',()=>{mouseDown=false;resetDrag()});
 const onKey=e=>{if(viewer.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowDown')show(pos+1);else if(e.key==='ArrowUp')show(pos-1)};
 document.addEventListener('keydown',onKey);
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
   photos=data.photos||[];
   const previous=grid.querySelectorAll('img').length;
   grid.replaceChildren(...photos.map((p,i)=>{const img=document.createElement('img');img.src=p.url;img.alt='Albumfoto '+(i+1);img.loading=i<4?'eager':'lazy';img.onclick=()=>{show(i);document.body.style.overflow='hidden';};return img;}));
   status.textContent=photos.length?photos.length+' bilder i albumet · senaste överst':'Inga bilder i albumet ännu.';
   if(photos.length>previous)container.dataset.lastAdded=String(Date.now());
  }catch(e){status.textContent='Kunde inte visa albumets bilder. '+(e instanceof Error?e.message:'Försök igen.');}
  finally{busy=false;}
 }
 const timer=setInterval(refresh,30000);
 const onVisible=()=>{if(!document.hidden)void refresh();};
 document.addEventListener('visibilitychange',onVisible);
 void refresh();
 return {refresh,stop(){stopped=true;clearInterval(timer);document.removeEventListener('visibilitychange',onVisible);document.removeEventListener('keydown',onKey);close();}};
}

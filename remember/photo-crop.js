export async function shareRememberCrop(url,img,viewer){
 const response=await fetch(url,{mode:'cors',cache:'no-store'});
 if(!response.ok)throw Error('Bilden kunde inte hämtas');
 const blob=await response.blob();
 const bitmap=await createImageBitmap(blob);
 try{
  const bounds=img.getBoundingClientRect();
  const view=viewer.getBoundingClientRect();
  const ratio=Math.min(3,window.devicePixelRatio||1);
  const canvas=document.createElement('canvas');
  canvas.width=Math.min(4096,Math.round(view.width*ratio));
  canvas.height=Math.min(4096,Math.round(view.height*ratio));
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#090909';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(bitmap,(bounds.left-view.left)*canvas.width/view.width,(bounds.top-view.top)*canvas.height/view.height,bounds.width*canvas.width/view.width,bounds.height*canvas.height/view.height);
  const result=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Bildutdrag kunde inte skapas')),'image/png'));
  const file=new File([result],'remember-bildutsnitt.png',{type:'image/png'});
  if(navigator.share&&navigator.canShare?.({files:[file]}))await navigator.share({files:[file]});
  else{
   const link=document.createElement('a'),objectUrl=URL.createObjectURL(result);
   link.href=objectUrl;link.download=file.name;link.click();setTimeout(()=>URL.revokeObjectURL(objectUrl),30000);
  }
 }finally{bitmap.close?.()}
}

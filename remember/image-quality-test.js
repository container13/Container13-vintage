// Diagnostic only: chosen images stay in this browser. No uploads or auth SDK.
import {prepareRememberImage} from './image-compress.js?v=0.1.167';
export async function compareRememberImage(file){
 if(!(file instanceof Blob)||!file.size||file.size>10*1024*1024)throw Error('Välj en bild på högst 10 MB.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Välj JPEG, PNG eller WebP.');
 const bitmap=await createImageBitmap(file,{imageOrientation:'from-image'});
 try{
  const original={id:'original',label:'Original',blob:file,width:bitmap.width,height:bitmap.height};
  const current=await prepareRememberImage(file);
  const scale=Math.min(1,2400/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('Bildbehandling stöds inte.');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
  const variants=[original,{id:'current',label:'Dagens komprimering',blob:current.blob,width:current.width,height:current.height}];
  for(const quality of [0.82,0.85]){
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b&&b.type==='image/jpeg'?resolve(b):reject(Error('Kunde inte skapa JPEG.')),'image/jpeg',quality));
   variants.push({id:'jpeg'+Math.round(quality*100),label:'Förslag: JPEG '+Math.round(quality*100),blob,width:canvas.width,height:canvas.height});
  }
  canvas.width=canvas.height=1;return variants;
 }finally{bitmap.close();}
}
const file=document.getElementById('file');
if(file){
 const run=document.getElementById('run'),status=document.getElementById('status'),results=document.getElementById('results'),details=document.getElementById('details');
 const focusX=document.getElementById('focusX'),focusY=document.getElementById('focusY');
 let items=[],urls=[],busy=false,generation=0;
 const format=n=>n<1048576?Math.round(n/1024)+' KB':(n/1048576).toFixed(2).replace('.',',')+' MB';
 function clear(){generation++;for(const url of urls)URL.revokeObjectURL(url);urls=[];items=[];results.replaceChildren();details.hidden=true;}
 function drawDetails(){
  if(!items.length)return;const original=items[0].variant;
  const span=Math.min(900,original.width,original.height),fw=span/original.width,fh=span/original.height;
  for(const {variant,image,canvas}of items){
   const sw=fw*variant.width,sh=fh*variant.height;
   const x=(variant.width-sw)*Number(focusX.value)/100,y=(variant.height-sh)*Number(focusY.value)/100;
   canvas.getContext('2d').drawImage(image,x,y,sw,sh,0,0,600,600);
  }
 }
 file.addEventListener('change',()=>{if(busy)return;clear();run.disabled=!file.files.length;status.textContent=file.files.length?'Klar att jämföra.':'Välj en originalbild.';});
 focusX.addEventListener('input',drawDetails);focusY.addEventListener('input',drawDetails);
 run.addEventListener('click',async()=>{
  if(busy||!file.files.length)return;busy=true;file.disabled=run.disabled=true;clear();const thisRun=generation;
  status.textContent='Jämför bilden lokalt…';
  try{
   const variants=await compareRememberImage(file.files[0]);if(thisRun!==generation)return;
   for(const variant of variants){
    const card=document.createElement('section');card.className='quality-card';card.dataset.variant=variant.id;
    const heading=document.createElement('h2');heading.textContent=variant.label;
    const info=document.createElement('p');info.className='metrics';
    info.textContent=variant.width+' × '+variant.height+' px · '+format(variant.blob.size)+' · '+variant.blob.type.replace('image/','').toUpperCase();
    const storage=document.createElement('p');storage.className='metrics';
    storage.textContent=variant.id==='original'?'Referensbild – behandlas inte.':'50 bilder av samma storlek: cirka '+format(variant.blob.size*50)+' bilddata.';
    const print=document.createElement('p');print.className='metrics';
    print.textContent='Vid 300 ppi: '+(variant.width/300*2.54).toFixed(1).replace('.',',')+' × '+(variant.height/300*2.54).toFixed(1).replace('.',',')+' cm före beskärning.';
    const url=URL.createObjectURL(variant.blob);urls.push(url);
    const image=document.createElement('img');image.src=url;image.alt=variant.label;image.className='full-image';
    const canvas=document.createElement('canvas');canvas.width=canvas.height=600;canvas.className='detail-image';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',variant.label+' – samma förstorade motivdel');
    card.append(heading,info,storage,print,image);
    const caption=document.createElement('p');caption.className='detail-label';caption.textContent='Samma förstorade motivdel';card.append(caption,canvas);
    if(variant.id!=='original'){
     const link=document.createElement('a');link.className='save';link.href=url;link.download='remember-'+variant.id+(variant.blob.type==='image/webp'?'.webp':'.jpg');link.textContent='Spara testbild';card.append(link);
     if(variant.blob.size>2*1024*1024){const note=document.createElement('p');note.className='warning';note.textContent='Över dagens uppladdningsgräns på 2 MB. Inte redo att införas med nuvarande gräns.';card.append(note);}
    }
    results.append(card);await image.decode();items.push({variant,image,canvas});
   }
   if(thisRun!==generation)return;details.hidden=false;drawDetails();status.textContent='Klart. Jämför ansikten, hår, text och små detaljer. Bilderna har inte laddats upp.';
  }catch(error){if(thisRun===generation){clear();status.textContent='Kunde inte jämföra: '+(error?.message||'okänt fel');}}
  finally{busy=false;file.disabled=false;run.disabled=!file.files.length;}
 });
 window.addEventListener('pagehide',clear);
}

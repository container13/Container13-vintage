(() => {
  "use strict";
  const PROJECT_ID = "container13-87c1a";
  const API_KEY = "AIzaSyDDWaTS_Yyo5X-skYiJ5nQYX5Jc5ZSa1tw";
  const gallery = document.getElementById("nyGallery");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const closeButton = document.getElementById("close");
  const previousButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  let images = [], currentIndex = 0;

  function val(v) {
    if (!v || typeof v !== "object") return null;
    if ("stringValue" in v) return v.stringValue;
    if ("booleanValue" in v) return v.booleanValue;
    if ("integerValue" in v) return Number(v.integerValue);
    if ("doubleValue" in v) return Number(v.doubleValue);
    if ("timestampValue" in v) return v.timestampValue;
    if (v.mapValue) return fields(v.mapValue.fields || {});
    if (v.arrayValue) return (v.arrayValue.values || []).map(val);
    return null;
  }
  function fields(f) { const o={}; Object.entries(f||{}).forEach(([k,v])=>o[k]=val(v)); return o; }
  function time(item) { const d=Date.parse(item.createdAt || item.uploadedAt || item.date || ""); return Number.isFinite(d) ? d : 0; }
  function imageUrl(item) { return item.imageUrl || item.url || item.downloadURL || item.downloadUrl || ""; }
  function category(item) { return String(item.category || item.type || item.section || "").toLowerCase(); }

  function show() { const item=images[currentIndex]; if(item&&lightboxImage){ lightboxImage.src=imageUrl(item); lightboxImage.alt=item.title||"Bild från Container 13 Vintage"; } }
  function open(index){ if(!lightbox||!images.length)return; currentIndex=index; show(); lightbox.style.display="flex"; lightbox.classList.add("show","active"); lightbox.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden"; }
  function close(){ if(!lightbox)return; lightbox.classList.remove("show","active"); lightbox.setAttribute("aria-hidden","true"); lightbox.style.display="none"; document.body.style.overflow=""; }
  function prev(){ if(images.length){ currentIndex=(currentIndex-1+images.length)%images.length; show(); } }
  function next(){ if(images.length){ currentIndex=(currentIndex+1)%images.length; show(); } }
  function render(items){
    images=items; gallery.innerHTML="";
    if(!items.length){ gallery.innerHTML='<p class="gallery-status">Det finns inga bilder under Nyinkommet ännu.</p>'; return; }
    items.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";

      const img = document.createElement("img");
      img.src = imageUrl(item);
      img.alt = item.title || "Bild från Container 13 Vintage";
      img.loading = "lazy";
      img.decoding = "async";
      img.addEventListener("click", () => open(index));
      img.addEventListener("error", () => figure.remove());

      figure.appendChild(img);
      gallery.appendChild(figure);
    });
  }
  async function load(){
    if(!gallery)return;
    gallery.innerHTML='<p class="gallery-status">Hämtar bilder...</p>';
    try{
      const url=`https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/gallery?pageSize=100&key=${API_KEY}`;
      const response=await fetch(url,{cache:"no-store"});
      if(!response.ok)throw new Error(`Firestore svarade ${response.status}`);
      const json=await response.json();
      const all=(json.documents||[]).map(d=>({id:d.name?.split('/').pop(),...fields(d.fields||{})}));
      const selected=all.filter(item=>category(item)==="nyinkommet" && imageUrl(item)).sort((a,b)=>time(b)-time(a)).slice(0,4);
      render(selected);
    }catch(error){ console.error(error); gallery.innerHTML=`<p class="gallery-status">Bilderna kunde inte hämtas (${error.message}).</p>`; }
  }
  closeButton?.addEventListener("click",close); previousButton?.addEventListener("click",prev); nextButton?.addEventListener("click",next); lightbox?.addEventListener("click",e=>{if(e.target===lightbox)close();}); document.addEventListener("keydown",e=>{if(e.key==="Escape")close(); if(e.key==="ArrowLeft")prev(); if(e.key==="ArrowRight")next();});
  load();
})();

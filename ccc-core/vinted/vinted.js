const MAX=9,cameraPicker=document.getElementById("cameraPicker"),albumPicker=document.getElementById("albumPicker"),photos=document.getElementById("photos"),cameraAdd=document.getElementById("cameraAdd"),albumAdd=document.getElementById("albumAdd"),count=document.getElementById("count"),analyze=document.getElementById("analyze"),result=document.getElementById("result"),fields=document.getElementById("fields");let items=[],lang="sv-SE",busy=false;const analysisStatus=document.getElementById("analysisStatus");
function draw(){photos.replaceChildren();items.forEach((item,i)=>{const d=document.createElement("div");d.className="v-photo";d.innerHTML='<img alt="Bild '+(i+1)+'"><span class="v-photo-number">'+(i+1)+'</span><button type="button" aria-label="Ta bort bild">×</button>';d.querySelector("img").src=item.url;d.querySelector("button").onclick=()=>{URL.revokeObjectURL(item.url);items.splice(i,1);draw()};photos.append(d)});count.textContent=items.length+" / "+MAX;analyze.disabled=!items.length||busy;const full=items.length>=MAX;cameraAdd.disabled=full;albumAdd.disabled=full;document.querySelector(".v-photo-actions")?.classList.toggle("is-full",full)}
function addFiles(files){result.hidden=true;fields.replaceChildren();analysisStatus.textContent="";for(const file of [...(files||[])]){if(items.length>=MAX)break;if(file.type.startsWith("image/"))items.push({file,url:URL.createObjectURL(file)})}draw()}
cameraAdd.onclick=()=>cameraPicker.click();albumAdd.onclick=()=>albumPicker.click();
cameraPicker.onchange=()=>{addFiles(cameraPicker.files);cameraPicker.value=""};
albumPicker.onchange=()=>{addFiles(albumPicker.files);albumPicker.value=""};
document.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;document.querySelectorAll("[data-lang]").forEach(x=>x.classList.toggle("active",x===b))});
function makeRows(data){
  const f=data?.fields||{};
  // CCC rule: never fill product details when the model reports uncertainty.
  if(data?.confidence!=="Säker")return [];
  const labels=lang==="sv-SE"
    ? [["TITEL","title"],["BESKRIVNING","description"],["KATEGORI","category"],["MÄRKE","brand"],["STORLEK","size"],["FÄRG","color"],["SÄSONG","season"],["TILLVERKARE","manufacturer"]]
    : [["TITLE","title"],["DESCRIPTION","description"],["CATEGORY","category"],["BRAND","brand"],["SIZE","size"],["COLOUR","color"],["SEASON","season"],["MANUFACTURER","manufacturer"]];
  return labels.flatMap(([label,key])=>{
    const value=typeof f[key]==="string"?f[key].trim():"";
    if(!value||/^(okänd|unknown|ej säker|not sure|n\/a|kontrollera)/i.test(value))return [];
    return [[label,value,"REVIEW"]];
  });
}
function renderFields(rows){fields.replaceChildren();rows.forEach(([label,value,status])=>{const row=document.createElement("div");row.className="v-field";row.innerHTML='<div class="v-field-main"><div class="v-label"><span>'+label+'</span><span class="v-status">'+(status==="UNKNOWN"?(lang==="sv-SE"?"Kontrollera":"Check"):(lang==="sv-SE"?"Förslag":"Suggestion"))+'</span></div><div class="v-value"></div></div><button class="v-copy" type="button" aria-label="Kopiera"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg></button>';row.querySelector(".v-value").textContent=value;const copy=row.querySelector(".v-copy");copy.onclick=async()=>{try{await navigator.clipboard.writeText(value);copy.classList.add("copied");setTimeout(()=>copy.classList.remove("copied"),900)}catch{}};fields.append(row)})}
analyze.onclick=async()=>{
  if(busy||!items.length)return;
  busy=true;draw();result.hidden=true;fields.replaceChildren();
  analyze.textContent="Analyserar…";analysisStatus.textContent="Analyserar bilder. Vänta…";
  try{
    const ai=window.CCC_VISION_AI;
    if(!ai?.configured?.())throw new Error("Vision är inte konfigurerad.");
    const response=await ai.analyze(items.slice(0,3).map(x=>x.file));
    const rows=makeRows(response.result);
    if(!rows.length){
      analysisStatus.textContent=lang==="sv-SE"?"Analysen är inte tillräckligt säker. Inga produktuppgifter visas.":"Analysis is uncertain. No product details shown.";
      return;
    }
    renderFields(rows);result.hidden=false;
    analysisStatus.textContent=lang==="sv-SE"?"AI-förslag – kontrollera varje uppgift före publicering.":"AI suggestions – verify each detail before publishing.";
    result.scrollIntoView({behavior:"smooth",block:"start"});
  }catch(e){analysisStatus.textContent="Analysen misslyckades: "+(e?.message||"Okänt fel");}
  finally{busy=false;analyze.textContent="Analysera bilder";draw();}
};
addEventListener("pagehide",()=>items.forEach(item=>URL.revokeObjectURL(item.url)),{once:true});draw();

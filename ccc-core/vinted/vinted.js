const MAX=9,cameraPicker=document.getElementById("cameraPicker"),albumPicker=document.getElementById("albumPicker"),photos=document.getElementById("photos"),cameraAdd=document.getElementById("cameraAdd"),albumAdd=document.getElementById("albumAdd"),count=document.getElementById("count"),analyze=document.getElementById("analyze"),result=document.getElementById("result"),fields=document.getElementById("fields");let items=[],lang="sv-SE",busy=false;const approvedFields=new Map();const analysisStatus=document.getElementById("analysisStatus");
function draw(){photos.replaceChildren();items.forEach((item,i)=>{const d=document.createElement("div");d.className="v-photo";d.innerHTML='<img alt="Bild '+(i+1)+'"><span class="v-photo-number">'+(i+1)+'</span><button type="button" aria-label="Ta bort bild">×</button>';d.querySelector("img").src=item.url;d.querySelector("button").onclick=()=>{URL.revokeObjectURL(item.url);items.splice(i,1);draw()};photos.append(d)});count.textContent=items.length+" / "+MAX;analyze.disabled=!items.length||busy;const full=items.length>=MAX;cameraAdd.disabled=full;albumAdd.disabled=full;document.querySelector(".v-photo-actions")?.classList.toggle("is-full",full)}
function addFiles(files){selectedTags=[];result.hidden=true;fields.replaceChildren();approvedFields.clear();analysisStatus.textContent="";for(const file of [...(files||[])]){if(items.length>=MAX)break;if(file.type.startsWith("image/"))items.push({file,url:URL.createObjectURL(file)})}draw()}
cameraAdd.onclick=()=>cameraPicker.click();albumAdd.onclick=()=>albumPicker.click();
cameraPicker.onchange=()=>{addFiles(cameraPicker.files);cameraPicker.value=""};
albumPicker.onchange=()=>{addFiles(albumPicker.files);albumPicker.value=""};
document.querySelectorAll("[data-lang]").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;document.querySelectorAll("[data-lang]").forEach(x=>x.classList.toggle("active",x===b))});
function makeRows(data){
  const f=data?.fields||{}; const evidence=data?.fieldEvidence||{};
  // Vision reports overall confidence, not per-field certainty. Display only explicit non-unknown values as reviewable suggestions, never as verified facts.
  const labels=lang==="sv-SE"
    ? [["TITEL","title"],["BESKRIVNING","description"],["KATEGORI","category"],["MÄRKE","brand"],["STORLEK","size"],["FÄRG","color"],["SÄSONG","season"],["TILLVERKARE","manufacturer"]]
    : [["TITLE","title"],["DESCRIPTION","description"],["CATEGORY","category"],["BRAND","brand"],["SIZE","size"],["COLOUR","color"],["SEASON","season"],["MANUFACTURER","manufacturer"]];
  return labels.flatMap(([label,key])=>{
    const value=typeof f[key]==="string"?f[key].trim():"";
    if(!value||/\b(okänd|okänt|unknown|osäker|osäkert|uncertain|ej säker|not sure|n\/a|kontrollera|kan inte avgöra|cannot determine|möjligen|possibly)\b/i.test(value))return [];
    const meta=evidence[key];
    if(meta && !["high","medium"].includes(meta.confidence))return [];
    return [[label,value,"REVIEW",meta||null]];
  });
}
const editDialog=document.getElementById("editDialog"),editInput=document.getElementById("editInput"),editHeading=document.getElementById("editHeading");
let activeEdit=null;
function closeEdit(){editDialog.close();activeEdit=null;}
document.getElementById("editCancel").onclick=closeEdit;
editDialog.addEventListener("cancel",()=>{activeEdit=null;});
document.getElementById("editForm").onsubmit=e=>{
  e.preventDefault();
  if(!activeEdit)return;
  const value=editInput.value.trim();
  activeEdit.valueNode.textContent=value;
  activeEdit.statusNode.textContent=lang==="sv-SE"?"Redigerad":"Edited";
  activeEdit.copy.dataset.value=value;
  closeEdit();
};
function renderFields(rows){
  fields.replaceChildren();approvedFields.clear();
  rows.forEach(([label,value,status,meta])=>{
    const row=document.createElement("div");row.className="v-field";
    row.innerHTML='<div class="v-field-main"><div class="v-label"><span></span><span class="v-status"></span></div><div class="v-value"></div></div><div class="v-field-actions"><button class="v-edit" type="button" aria-label="Redigera"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/></svg></button><button class="v-copy" type="button" aria-label="Kopiera"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg></button></div>';
    row.querySelector(".v-label span").textContent=label;
    const statusNode=row.querySelector(".v-status"),valueNode=row.querySelector(".v-value"),copy=row.querySelector(".v-copy");
    statusNode.textContent=status==="UNKNOWN"?(lang==="sv-SE"?"Kontrollera":"Check"):(lang==="sv-SE"?"Förslag":"Suggestion");
    valueNode.textContent=value;copy.dataset.value=value;approvedFields.set(label,()=>valueNode.textContent.trim());
    if(meta){
      statusNode.textContent=meta.confidence==="high"?(lang==="sv-SE"?"Tydligt bildstöd":"Clear evidence"):(lang==="sv-SE"?"Tolka och kontrollera":"Check interpretation");
      const detail=[meta.evidence,meta.nextPhoto?(lang==="sv-SE"?"Komplettera med bild: ":"Add photo: ")+meta.nextPhoto:""].filter(Boolean).join(" · ");
      if(detail){const hint=document.createElement("div");hint.className="v-evidence";hint.textContent=detail;row.querySelector(".v-field-main").append(hint);}
    }
    row.querySelector(".v-edit").onclick=()=>{activeEdit={valueNode,statusNode,copy};editHeading.textContent=(lang==="sv-SE"?"Redigera ":"Edit ")+label;editInput.value=valueNode.textContent;editDialog.showModal();};
    copy.onclick=async()=>{try{await navigator.clipboard.writeText(copy.dataset.value);copy.classList.add("copied");setTimeout(()=>copy.classList.remove("copied"),900)}catch{}};
    fields.append(row);
  });
}
analyze.onclick=async()=>{
  if(busy||!items.length)return;
  busy=true;draw();result.hidden=true;fields.replaceChildren();approvedFields.clear();
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
    analysisStatus.textContent=lang==="sv-SE"?"AI-förslag, inte verifierade fakta. Kontrollera varje uppgift före publicering.":"AI suggestions – verify each detail before publishing.";
    result.scrollIntoView({behavior:"smooth",block:"start"});
  }catch(e){analysisStatus.textContent="Analysen misslyckades: "+(e?.message||"Okänt fel");}
  finally{busy=false;analyze.textContent="Analysera bilder";draw();}
};
addEventListener("pagehide",()=>items.forEach(item=>URL.revokeObjectURL(item.url)),{once:true});draw();

function makeVintedListing(){
  const get=(sv,en)=>approvedFields.get(lang==="sv-SE"?sv:en)?.()||"";
  const title=get("TITEL","TITLE"),description=get("BESKRIVNING","DESCRIPTION");
  const entries=[["Märke","BRAND","MÄRKE"],["Kategori","CATEGORY","KATEGORI"],["Storlek","SIZE","STORLEK"],["Färg","COLOUR","FÄRG"],["Säsong","SEASON","SÄSONG"],["Tillverkare","MANUFACTURER","TILLVERKARE"]];
  const details=entries.map(([name,en,sv])=>{const value=get(sv,en);return value?name+": "+value:""}).filter(Boolean);
  const words=[title,description,...details].join(" ").toLocaleLowerCase("sv-SE");
  const tags=new Set();
  const addTag=(tag)=>tags.add("#"+tag);
  const rules=[
    [/\blevi['’]?s\b/i,["levis"]],
    [/jeansjacka|denimjacka|denim jacket/i,["jeansjacka","denimjacket","denimfashion"]],
    [/\bdenim\b|jeansjacka|denimjacka/i,["denim"]],
    [/\bvintage\b/i,["vintage"]],
    [/\bretro\b/i,["retro"]],
    [/\bsvart\b|mörk krage/i,["svart"]],
    [/\bblå|blue\b/i,["blue","bluejeans"]],
    [/\badidas\b/i,["adidas"]],
    [/\bnike\b/i,["nike"]],
    [/\bjacka\b|jeansjacka/i,["jacket"]],
    [/\bjeans\b/i,["jeans"]],
    [/\btröja\b/i,["sweater"]],
    [/\bskjorta\b/i,["shirt"]],
    [/\bhoodie\b|huvtröja/i,["hoodie"]],
    [/\bskinn\b|läder/i,["leather"]],
    [/\b90-tal|1990/i,["90s"]],
    [/\b00-tal|2000/i,["y2k"]]
  ];
  for(const [pattern,list] of rules)if(pattern.test(words))list.forEach(addTag);
  return [title,description,details.join("\n"),selectedTags.map(t=>"#"+t).join(" ")].filter(Boolean).join("\n\n");
}
const DEFAULT_BANK="y2k gorpcore archive subversive punk rock cyber grunge drip gorp retro unique rare og casual drain baggy cybery2k bottoms flared wide loose alt rap skate affliction carhartt diesel black jeans vintage secondhand playboy carti playboicarti pinterest cybercore washed vamp cowboy oldschool workwear archivefashion cargopants asaprocky rockstar yvl softcore revival skeleton classic gunna thug slime coutore jessepinkman szeroka religion truereligion edhardy krzyz luzne distressed maisonmargiela rickowens flower outdoorstyle outdoor hiking granola granolagirl hike swag levis bootcut cowboys".split(" ");
let tagBank=DEFAULT_BANK.slice(),selectedTags=[];
try{const saved=JSON.parse(localStorage.getItem("ccc-vinted-tags")||"null");if(Array.isArray(saved))tagBank=[...new Set([...tagBank,...saved])];}catch{}
const cleanTag=s=>s.trim().replace(/^#+/,"").toLowerCase().replace(/[^a-z0-9åäö_]/g,"");
const listingDialog=document.getElementById("listingDialog"),listingPreview=document.getElementById("listingPreview");
const copyListingStatus=document.getElementById("copyListingStatus");
function renderTags(){
  const selected=document.getElementById("selectedTags"),bank=document.getElementById("bankTags");
  selected.replaceChildren();bank.replaceChildren();
  function button(tag,active){const b=document.createElement("button");b.type="button";b.className="v-tag-pill";b.textContent="#"+tag+(active?" ×":" +");b.onclick=()=>{if(active&&!confirm("Vill du ta bort #"+tag+" från annonsen?"))return;selectedTags=active?selectedTags.filter(x=>x!==tag):[...selectedTags,tag];renderTags();};return b;}
  selectedTags.forEach(tag=>selected.append(button(tag,true)));
  tagBank.forEach(tag=>bank.append(button(tag,selectedTags.includes(tag))));
  updateListingPreview();
}
document.getElementById("tagAddForm").onsubmit=e=>{
 e.preventDefault();const input=document.getElementById("tagInput"),tag=cleanTag(input.value);input.value="";
 if(!tag)return;if(!tagBank.includes(tag)){tagBank.push(tag);try{localStorage.setItem("ccc-vinted-tags",JSON.stringify(tagBank));}catch{}}
 if(!selectedTags.includes(tag))selectedTags.push(tag);renderTags();
};
document.getElementById("tagBankToggle").onclick=()=>{const node=document.getElementById("tagBank");node.hidden=!node.hidden;document.getElementById("tagBankToggle").textContent=node.hidden?"Visa min hashtagbank":"Dölj hashtagbanken";};
const copyListing=document.getElementById("copyListing");
let listingLanguage="both";
function updateListingPreview(){listingPreview.textContent=makeVintedListing();document.getElementById("listingLanguageNote").textContent=listingLanguage==="sv"?"":"Engelsk annonstext kräver separat AI-generering. Tills dess visas originaltexten.";}
document.querySelectorAll("[data-listing-lang]").forEach(b=>b.onclick=()=>{listingLanguage=b.dataset.listingLang;document.querySelectorAll("[data-listing-lang]").forEach(x=>x.classList.toggle("active",x===b));updateListingPreview();});
copyListing.onclick=()=>{
  const content=makeVintedListing();if(!content)return;
  if(!selectedTags.length)selectedTags=tagBank.slice();
  renderTags();copyListingStatus.textContent="";
  listingDialog.showModal();
};
document.getElementById("listingClose").onclick=()=>listingDialog.close();
document.getElementById("listingCopy").onclick=async()=>{
  try{await navigator.clipboard.writeText(listingPreview.textContent);copyListingStatus.textContent="Kopierat ✓";}
  catch{copyListingStatus.textContent="Kunde inte kopiera. Försök igen.";}
};
listingDialog.addEventListener("click",e=>{if(e.target===listingDialog)listingDialog.close();});

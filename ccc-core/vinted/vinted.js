const MAX=9,cameraPicker=document.getElementById("cameraPicker"),albumPicker=document.getElementById("albumPicker"),photos=document.getElementById("photos"),cameraAdd=document.getElementById("cameraAdd"),albumAdd=document.getElementById("albumAdd"),count=document.getElementById("count"),analyze=document.getElementById("analyze"),result=document.getElementById("result"),fields=document.getElementById("fields");let items=[],lang="sv-SE",busy=false;const approvedFields=new Map();const analysisStatus=document.getElementById("analysisStatus");
function draw(){photos.replaceChildren();items.forEach((item,i)=>{const d=document.createElement("div");d.className="v-photo";d.innerHTML='<img alt="Bild '+(i+1)+'"><span class="v-photo-number">'+(i+1)+'</span><button type="button" aria-label="Ta bort bild">×</button>';d.querySelector("img").src=item.url;d.querySelector("button").onclick=()=>{URL.revokeObjectURL(item.url);items.splice(i,1);draw()};photos.append(d)});count.textContent=items.length+" / "+MAX;analyze.disabled=!items.length||busy;const full=items.length>=MAX;cameraAdd.disabled=full;albumAdd.disabled=full;document.querySelector(".v-photo-actions")?.classList.toggle("is-full",full)}
function addFiles(files){listingVariants.clear();try{sessionStorage.removeItem("ccc-vinted-session-variants-v1")}catch{}selectedTags=[];tagsInitialized=false;result.hidden=true;fields.replaceChildren();approvedFields.clear();analysisStatus.textContent="";for(const file of [...(files||[])]){if(items.length>=MAX)break;if(file.type.startsWith("image/"))items.push({file,url:URL.createObjectURL(file)})}draw()}
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
  return labels.map(([label,key])=>{
    const value=typeof f[key]==="string"?f[key].trim():"";
    if(!value||/\b(okänd|okänt|unknown|osäker|osäkert|uncertain|ej säker|not sure|n\/a|kontrollera|kan inte avgöra|cannot determine|möjligen|possibly)\b/i.test(value))return [label,"","UNKNOWN",null];
    const meta=evidence[key];
    if(meta && !["high","medium"].includes(meta.confidence))return [label,"","UNKNOWN",null];
    return [label,value,"REVIEW",meta||null];
  });
}
// Translate only the existing Vision facts. Never create or infer missing fields.
async function reviewRowsForLanguage(rows){
 if(lang!=="en-US")return rows;
 const keys=["title","description","category","brand","size","color","season","manufacturer"];
 const original=rows.map(r=>r[1]);
 const payload={title:original[0]||"",description:original[1]||"",details:rows.slice(2).map((r,i)=>r[1]?keys[i+2]+": "+r[1]:"").filter(Boolean).join("\n")};
 if(!payload.title&&!payload.description&&!payload.details)return rows;
 try{
  const response=await fetch("https://ccc-vision-pending-test.mangaj73.workers.dev",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"translate_listing",...payload})});
  const data=await response.json();
  if(!response.ok||!data.translation)throw Error("Translation unavailable");
  const t=data.translation;
  const translated={title:t.title,description:t.description};
  for(const line of String(t.details||"").split("\n")){
   const match=line.match(/^([a-z]+):\s*(.*)$/i);
   if(match&&keys.includes(match[1].toLowerCase()))translated[match[1].toLowerCase()]=match[2];
  }
  return rows.map((r,i)=>{
   if(!original[i])return r;
   const value=String(translated[keys[i]]||"").trim();
   return value?[r[0],value,r[2],r[3]]:r;
  });
 }catch(e){
  analysisStatus.textContent="English translation unavailable; original Vision wording is shown. No second image analysis was run.";
  return rows;
 }
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
  rewrittenListing=null;rewriteKey="";
  closeEdit();
};
function renderFields(rows){
  fields.replaceChildren();approvedFields.clear();
  rows.forEach(([label,value,status,meta])=>{
    const row=document.createElement("div");row.className="v-field";
    row.innerHTML='<div class="v-field-main"><div class="v-label"><span></span><span class="v-status"></span></div><div class="v-value"></div></div><div class="v-field-actions"><button class="v-edit" type="button" aria-label="Redigera"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/></svg></button><button class="v-copy" type="button" aria-label="Kopiera"><svg viewBox="0 0 24 24"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg></button></div>';
    row.querySelector(".v-label span").textContent=label;
    const include=document.createElement("input");include.type="checkbox";include.checked=true;include.setAttribute("aria-label","Ta med "+label+" i annonsen");include.style.cssText="accent-color:#e2b85c";row.querySelector(".v-field-actions").append(include);include.classList.add("v-field-include");
    const statusNode=row.querySelector(".v-status"),valueNode=row.querySelector(".v-value"),copy=row.querySelector(".v-copy");
    statusNode.textContent=status==="UNKNOWN"?(lang==="sv-SE"?"Kontrollera":"Check"):(lang==="sv-SE"?"Förslag":"Suggestion");
    valueNode.textContent=value;copy.dataset.value=value;approvedFields.set(label,()=>include.checked?valueNode.textContent.trim():"");
    include.onchange=()=>{rewrittenListing=null;rewriteKey="";};
    if(meta){
      statusNode.textContent=meta.confidence==="high"?(lang==="sv-SE"?"Tydligt bildstöd":"Clear evidence"):(lang==="sv-SE"?"Tolka och kontrollera":"Check interpretation");
      const detail=[meta.evidence,meta.nextPhoto?(lang==="sv-SE"?"Komplettera med bild: ":"Add photo: ")+meta.nextPhoto:""].filter(Boolean).join(" · ");
      if(detail){const hint=document.createElement("div");hint.className="v-evidence";hint.textContent=detail;row.querySelector(".v-field-main").append(hint);}
    }
    const openFieldEditor=()=>{activeEdit={valueNode,statusNode,copy};editHeading.textContent=(lang==="sv-SE"?"Redigera ":"Edit ")+label;editInput.value=valueNode.textContent;editDialog.showModal();};
    row.querySelector(".v-edit").onclick=openFieldEditor;
    const mainTextArea=row.querySelector(".v-field-main");
    mainTextArea.setAttribute("role","button");mainTextArea.setAttribute("tabindex","0");mainTextArea.setAttribute("aria-label","Redigera "+label);
    mainTextArea.onclick=openFieldEditor;
    mainTextArea.onkeydown=e=>{if(e.target===mainTextArea&&(e.key==="Enter"||e.key===" ")){e.preventDefault();openFieldEditor();}};
    copy.onclick=async()=>{try{await navigator.clipboard.writeText(copy.dataset.value);copy.classList.add("copied");setTimeout(()=>copy.classList.remove("copied"),900)}catch{}};
    fields.append(row);
  });
}
// Review uses the existing CCC swipe physics when CCC_CORE is available.
// The review stage is fixed-height: never scroll the entire review vertically.
const reviewDialog=document.getElementById("reviewDialog");
const reviewStage=document.getElementById("reviewStage");
const reviewDots=document.getElementById("reviewDots");
const reviewPosition=document.getElementById("reviewPosition");
let reviewIndex=0,reviewTouch=null,reviewAnimating=false;
const reviewTrack=document.createElement("div");
reviewTrack.className="v-review-track";
reviewStage.replaceChildren(reviewTrack);
reviewTrack.append(fields);
function reviewPages(){return reviewTrack.querySelectorAll(":scope > .v-review-page").length;}
function renderReviewPages(){
  // Rows have been moved out of #fields into pages after the first render.
  // Reuse them when reopening review instead of losing the product fields.
  const freshRows=[...fields.querySelectorAll(".v-field")];
  const rows=freshRows.length?freshRows:[...reviewTrack.querySelectorAll(".v-field")];
  reviewTrack.replaceChildren();
  for(let i=0;i<rows.length;){
    const count=i===0?3:5;
    const page=document.createElement("section");page.className="v-review-page";
    page.setAttribute("aria-label","Produktuppgifter "+(i+1)+"–"+Math.min(i+count,rows.length));
    rows.slice(i,i+count).forEach(row=>{row.hidden=false;row.removeAttribute("aria-hidden");page.append(row);});
    reviewTrack.append(page);
    i+=count;
  }
  // Each slide is exactly one stage wide; the track itself remains stage-sized.
  reviewTrack.style.width="100%";
  reviewTrack.querySelectorAll(".v-review-page").forEach(p=>{
    p.style.width="100%";
    p.style.flex="0 0 100%";
  });
}
function reviewOffset(index){return -index*reviewStage.clientWidth;}
function showReviewField(index,{animate=true}={}){
  const pages=reviewPages();if(!pages)return;
  reviewIndex=Math.max(0,Math.min(pages-1,index));
  reviewTrack.style.transition=animate?"transform 320ms cubic-bezier(.22,.68,.18,1)":"none";
  reviewTrack.style.transform="translate3d("+reviewOffset(reviewIndex)+"px,0,0)";
  reviewPosition.textContent=(reviewIndex+1)+" / "+pages;
  reviewDots.replaceChildren();
  for(let i=0;i<pages;i++){
    const b=document.createElement("button");b.type="button";b.className=i===reviewIndex?"active":"";
    b.setAttribute("aria-label","Visa sida "+(i+1));
    b.setAttribute("aria-current",i===reviewIndex?"step":"false");
    b.onclick=()=>showReviewField(i);reviewDots.append(b);
  }
}
function openReviewDialog(){renderReviewPages();if(!reviewDialog.open)reviewDialog.showModal();requestAnimationFrame(()=>showReviewField(0,{animate:false}));}
document.getElementById("openReview").onclick=openReviewDialog;
document.getElementById("reviewBack").onclick=()=>reviewDialog.close();
document.getElementById("reviewProposal").onclick=()=>{reviewDialog.close();copyListing.click();};
reviewStage.addEventListener("touchstart",e=>{
 if(e.touches.length!==1||e.target.closest("input,textarea,button")){reviewTouch=null;return;}
 reviewTouch={x:e.touches[0].clientX,y:e.touches[0].clientY,dx:0,active:false};
 reviewTrack.style.transition="none";
},{passive:true});
reviewStage.addEventListener("touchmove",e=>{
 if(!reviewTouch||e.touches.length!==1)return;
 const dx=e.touches[0].clientX-reviewTouch.x,dy=e.touches[0].clientY-reviewTouch.y;
 const swipe=window.CCC_CORE?.swipe;
 if(!reviewTouch.active){
   if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>12){reviewTouch=null;showReviewField(reviewIndex,{animate:true});return;}
   if(!(swipe?.isHorizontal?swipe.isHorizontal(dx,dy):Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)*1.25))return;
   reviewTouch.active=true;
 }
 if(e.cancelable)e.preventDefault();
 reviewTouch.dx=dx;
 const atEdge=(reviewIndex===0&&dx>0)||(reviewIndex===reviewPages()-1&&dx<0);
 const shift=swipe?.offset?swipe.offset(dx,reviewStage.clientWidth,{atEdge}):dx*(atEdge?.24:1);
 reviewTrack.style.transform="translate3d("+(reviewOffset(reviewIndex)+shift)+"px,0,0)";
},{passive:false});
reviewStage.addEventListener("touchend",()=>{
 if(!reviewTouch)return;
 const dx=reviewTouch.dx,active=reviewTouch.active;
 reviewTouch=null;
 if(!active){reviewTrack.style.transition="";return;} // Preserve native click/tap on text.
 const swipe=window.CCC_CORE?.swipe;
 const commit=Math.abs(dx)>Math.max(48,reviewStage.clientWidth*.16);
 showReviewField(reviewIndex+(commit?(dx<0?1:-1):0));
},{passive:true});
reviewStage.addEventListener("touchcancel",()=>{reviewTouch=null;showReviewField(reviewIndex);},{passive:true});
reviewStage.addEventListener("keydown",e=>{
 if(e.target.closest("input,textarea"))return;
 if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();showReviewField(reviewIndex+(e.key==="ArrowRight"?1:-1));}
});
window.addEventListener("resize",()=>{if(reviewDialog.open)showReviewField(reviewIndex,{animate:false});});

analyze.onclick=async()=>{
  if(busy||!items.length)return;
  busy=true;analyze.classList.add("is-working");draw();result.hidden=true;fields.replaceChildren();approvedFields.clear();
  analyze.textContent="Analyserar…";analysisStatus.textContent="Analyserar bilder. Vänta…";
  try{
    const ai=window.CCC_VISION_AI;
    if(!ai?.configured?.())throw new Error("Vision är inte konfigurerad.");
    const response=await ai.analyze(items.slice(0,3).map(x=>x.file));
    lang=readListingPreferences().language==="en"?"en-US":"sv-SE";
    const rows=await reviewRowsForLanguage(makeRows(response.result));
    if(!rows.some(row=>row[1])){
      analysisStatus.textContent=lang==="sv-SE"?"Analysen är inte tillräckligt säker. Inga produktuppgifter visas.":"Analysis is uncertain. No product details shown.";
      return;
    }
    renderFields(rows);result.hidden=false;openReviewDialog();
    // Start the first listing rewrite while the user reviews the fields.
    // This shares the same cache/key as the preview, avoiding a second request.
    void ensureRewrite();
    if(!analysisStatus.textContent.includes("translation unavailable"))analysisStatus.textContent=lang==="sv-SE"?"AI-förslag, inte verifierade fakta. Kontrollera varje uppgift före publicering.":"AI suggestions – verify each detail before publishing.";
    requestAnimationFrame(()=>window.scrollTo({top:0,behavior:"instant"}));
  }catch(e){analysisStatus.textContent="Analysen misslyckades: "+(e?.message||"Okänt fel");}
  finally{busy=false;analyze.classList.remove("is-working");analyze.textContent="✦ Analysera och skapa annons";draw();}
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
let tagBank=DEFAULT_BANK.slice(),selectedTags=[],tagsInitialized=false;
try{const saved=JSON.parse(localStorage.getItem("ccc-vinted-tags")||"null");if(Array.isArray(saved))tagBank=[...new Set([...tagBank,...saved])];}catch{}
function suggestTags(){
 const p=listingParts(),v=(p.title+" "+p.description+" "+p.details).toLowerCase();
 const en=listingLanguage==="en",out=[];
 const add=(sv,english=sv)=>{const tag=en?english:sv;if(!out.includes(tag))out.push(tag)};
 add("container13");
 // Container13 secondhand context; vintage only when the garment is identified as vintage.
 add("secondhand");
 if(/vintage|årtionde|decade|1990|1980|1970|90-tal|80-tal|70-tal/i.test(v))add("vintage");
 if(/\\blee\\b/.test(v))add("lee");
 if(/\\blevi['’]?s\\b/.test(v))add("levis");
 if(/\\badidas\\b/.test(v))add("adidas");
 if(/\\bnike\\b/.test(v))add("nike");
 if(/jeans|denim/.test(v)){add("jeans");add("denim");add("denimjeans")}
 if(/jacka|jacket/.test(v))add("jacka","jacket");
 if(/hoodie|huvtröja/.test(v))add("hoodie");
 if(/skjorta|shirt/.test(v))add("skjorta","shirt");
 if(/ljusblå|light blue/.test(v))add("ljusblå","lightblue");
 else if(/\\bblå\\b|\\bblue\\b/.test(v))add("blå","blue");
 if(/\\bsvart\\b|\\bblack\\b/.test(v))add("svart","black");

 if(/\\bretro\\b/.test(v))add("retro");
 if(/\\by2k\\b/.test(v))add("y2k");
 if(/raka ben|rak passform|straight legs|straight cut|straight fit/.test(v))add("rakajeans","straightlegjeans");
 if(/uppvikta benslut|turned-up hems|turn up hem|cuffed hems/.test(v))add("uppviktabenslut","cuffedjeans");
 if(/femfick|five-pocket/.test(v))add("femfickor","fivepocketjeans");
 if(/tvättad|washed|blekt|faded/.test(v))add("tvättaddenim","washeddenim");
 if(/\\bjeans\\b/.test(v)){add("jeansstil","denimstyle");add("jeansmode","denimfashion")}
 return out.slice(0,12);
}
const cleanTag=s=>s.trim().replace(/^#+/,"").toLowerCase().replace(/[^a-z0-9åäö_]/g,"");
const listingDialog=document.getElementById("listingDialog"),listingPreview=document.getElementById("listingPreview");
const copyListingStatus=document.getElementById("copyListingStatus");
let aiSuggestedTags=[];
function refreshAiTagSuggestions(){
  aiSuggestedTags=suggestTags().map(cleanTag).filter(Boolean);
  const newTags=aiSuggestedTags.filter(tag=>!tagBank.includes(tag));
  if(newTags.length){
    tagBank.push(...newTags);
    try{localStorage.setItem("ccc-vinted-tags",JSON.stringify(tagBank));}catch{}
  }
}
function renderTags(){
 const display=document.getElementById("listingHashtags"),bank=document.getElementById("bankTags");
 display.textContent=selectedTags.map(tag=>"#"+tag).join(" ");
 bank.replaceChildren();
 tagBank.forEach(tag=>{
  const button=document.createElement("button");button.type="button";button.className="v-tag-pill";
  button.textContent="#"+tag+" ×";button.title="Radera #"+tag+" från hashtagbanken";
  button.onclick=()=>{
   if(!confirm("Vill du verkligen radera #"+tag+" från hashtagbanken?"))return;
   tagBank=tagBank.filter(t=>t!==tag);selectedTags=selectedTags.filter(t=>t!==tag);
   try{localStorage.setItem("ccc-vinted-tags",JSON.stringify(tagBank));}catch{}
   renderTags();
  };
  bank.append(button);
 });
 updateListingPreview();
}
const aiTagToggle=document.getElementById("useAiTags");
aiTagToggle.onchange=()=>{selectedTags=[...(aiTagToggle.checked?aiSuggestedTags:tagBank)];renderTags();};
const tagEditorDialog=document.getElementById("tagEditorDialog");
document.getElementById("tagEditorOpen").onclick=()=>tagEditorDialog.showModal();
document.getElementById("tagEditorClose").onclick=()=>tagEditorDialog.close();
tagEditorDialog.addEventListener("click",e=>{if(e.target===tagEditorDialog)tagEditorDialog.close();});
document.getElementById("tagAddForm").onsubmit=e=>{
 e.preventDefault();const input=document.getElementById("tagInput"),tag=cleanTag(input.value);input.value="";
 if(!tag)return;
 if(!tagBank.includes(tag))tagBank.push(tag);
 try{localStorage.setItem("ccc-vinted-tags",JSON.stringify(tagBank));}catch{}
 if(!aiTagToggle.checked&&!selectedTags.includes(tag))selectedTags.push(tag);
 renderTags();
};
const copyListing=document.getElementById("copyListing");
const VINTED_PREFS_KEY="ccc-vinted-listing-preferences";
function readListingPreferences(){try{const p=JSON.parse(localStorage.getItem(VINTED_PREFS_KEY)||"{}");return {language:["sv","en"].includes(p.language)?p.language:"en",style:["neutral","selling","max"].includes(p.style)?p.style:"selling"};}catch{return {language:"en",style:"selling"};}}
let listingLanguage="en",listingStyle="selling";
const preferencesDialog=document.getElementById("vintedSettingsDialog"),defaultLanguage=document.getElementById("vintedDefaultLanguage"),defaultStyle=document.getElementById("vintedDefaultStyle");
function saveListingPreferences(){try{localStorage.setItem(VINTED_PREFS_KEY,JSON.stringify({language:defaultLanguage.value,style:defaultStyle.value}));}catch{}}
function applyListingPreferences(){const p=readListingPreferences();listingLanguage=p.language;listingStyle=p.style;defaultLanguage.value=p.language;defaultStyle.value=p.style;document.querySelectorAll("[data-listing-lang]").forEach(b=>{const active=b.dataset.listingLang===listingLanguage;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});document.querySelectorAll("[data-listing-style]").forEach(b=>{const active=b.dataset.listingStyle===listingStyle;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));});}
document.getElementById("vintedSettingsOpen").onclick=()=>{defaultLanguage.value=readListingPreferences().language;defaultStyle.value=readListingPreferences().style;preferencesDialog.showModal();};
document.getElementById("vintedSettingsClose").onclick=()=>preferencesDialog.close();
defaultLanguage.onchange=saveListingPreferences;defaultStyle.onchange=saveListingPreferences;
const analysisLanguage=document.getElementById("analysisLanguage"),analysisStyle=document.getElementById("analysisStyle");
function syncAnalysisOptions(){const p=readListingPreferences();analysisLanguage.value=p.language;analysisStyle.value=p.style;}
function saveAnalysisOptions(){defaultLanguage.value=analysisLanguage.value;defaultStyle.value=analysisStyle.value;saveListingPreferences();applyListingPreferences();}
analysisLanguage.onchange=saveAnalysisOptions;analysisStyle.onchange=saveAnalysisOptions;
defaultLanguage.addEventListener("change",syncAnalysisOptions);defaultStyle.addEventListener("change",syncAnalysisOptions);
applyListingPreferences();syncAnalysisOptions();
let rewrittenListing=null,rewriteKey="",rewriteRequest=0,pendingRewriteKey="";
const listingVariants=new Map();
function neutralVariant(parts){return {title:parts.title,description:parts.description,details:parts.details};}
const recentCopy=(()=>{try{return JSON.parse(localStorage.getItem("ccc-vinted-recent-copy")||"[]")}catch{return []}})();

// Explicit opt-in AI rewriting is retained for future UI, never run automatically.
async function rewriteListingOnDemand(parts,style,language){
 const response=await fetch(TRANSLATION_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"rewrite_listing",...parts,style,language,recent:recentCopy})});
 const data=await response.json();
 if(!response.ok||!data.listing?.description)throw Error(data.error||"AI-omskrivning misslyckades");
 return data.listing;
}
function listingCacheKey(){return JSON.stringify({parts:listingParts(),listingStyle,listingLanguage});}
const SESSION_VARIANTS_KEY="ccc-vinted-session-variants-v1";
function rememberVariant(key,value){
 listingVariants.set(key,value);
 try{const saved=JSON.parse(sessionStorage.getItem(SESSION_VARIANTS_KEY)||"{}");saved[key]=value;const entries=Object.entries(saved).slice(-24);sessionStorage.setItem(SESSION_VARIANTS_KEY,JSON.stringify(Object.fromEntries(entries)));}catch{}
}
function recallVariant(key){
 if(listingVariants.has(key))return listingVariants.get(key);
 try{const saved=JSON.parse(sessionStorage.getItem(SESSION_VARIANTS_KEY)||"{}");if(saved[key]?.description){listingVariants.set(key,saved[key]);return saved[key];}}catch{}
 return null;
}
async function ensureRewrite(){
 const parts=listingParts(),key=listingCacheKey();
 const cached=recallVariant(key);
 if(cached){++rewriteRequest;document.getElementById("listingCopy").disabled=false;rewrittenListing=cached;rewriteKey=key;updateListingPreview();return;}
 const requestId=++rewriteRequest;
 rewrittenListing=null;rewriteKey="";updateListingPreview();
 const note=document.getElementById("listingLanguageNote"),copy=document.getElementById("listingCopy");
 note.textContent="Skapar annons med AI…";note.classList.add("is-working");copy.disabled=true;
 try{
  const listing=await rewriteListingOnDemand(parts,listingStyle,listingLanguage);
  rememberVariant(key,listing);
  if(requestId!==rewriteRequest)return;
  rewrittenListing=listing;rewriteKey=key;updateListingPreview();
 }catch(error){
  if(requestId!==rewriteRequest)return;
  note.classList.remove("is-working");note.textContent="AI-anropet misslyckades. Välj stilen igen för att försöka på nytt.";
  listingPreview.textContent="";copyListingStatus.textContent=error?.message||"Kunde inte skapa annons.";
 }finally{if(requestId===rewriteRequest)copy.disabled=false;}
}
let translatedListing=null,translationKey="",translationRequest=0;
const TRANSLATION_ENDPOINT="https://ccc-vision-pending-test.mangaj73.workers.dev";
function listingParts(){
 const get=(sv,en)=>approvedFields.get(lang==="sv-SE"?sv:en)?.()||"";
 const title=get("TITEL","TITLE"),description=get("BESKRIVNING","DESCRIPTION");
 const entries=[["Brand","MÄRKE","BRAND"],["Category","KATEGORI","CATEGORY"],["Size","STORLEK","SIZE"],["Color","FÄRG","COLOUR"],["Season","SÄSONG","SEASON"],["Manufacturer","TILLVERKARE","MANUFACTURER"]];
 return {title,description,details:entries.map(([label,sv,en])=>{const value=get(sv,en);return value?label+": "+value:"";}).filter(Boolean).join("\n")};
}
function updateListingPreview(fallback=false){
 const note=document.getElementById("listingLanguageNote");
 const effectiveTags=selectedTags;
 const tags=effectiveTags.map(t=>"#"+t).join(" ");
 const tagSummary=document.getElementById("listingTagCount");if(tagSummary)tagSummary.textContent=effectiveTags.length+" hashtags ingår i kopian";
 if(rewrittenListing){
  const detailLabels={Brand:"Märke",Category:"Kategori",Size:"Storlek",Color:"Färg",Season:"Säsong",Manufacturer:"Tillverkare"};
 const details=listingLanguage==="sv"?rewrittenListing.details.split("\n").map(line=>line.replace(/^(Brand|Category|Size|Color|Season|Manufacturer):/,key=>detailLabels[key.slice(0,-1)]+":")).join("\n"):rewrittenListing.details;
 listingPreview.textContent=[rewrittenListing.title,rewrittenListing.description,details].filter(Boolean).join("\n\n");
  note.classList.remove("is-working");note.textContent="";return;
 }
 if(fallback){listingPreview.textContent="";return;}
 listingPreview.textContent="";note.textContent="Förbereder annons…";
}
async function ensureTranslation(){
 if(listingLanguage==="sv"){updateListingPreview();return;}
 const parts=listingParts(),key=JSON.stringify(parts);
 if(translatedListing&&translationKey===key){updateListingPreview();return;}
 const requestId=++translationRequest;translatedListing=null;updateListingPreview();
 try{
   const response=await fetch(TRANSLATION_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"translate_listing",...parts})});
   const data=await response.json();
   if(!response.ok||!data.translation?.description)throw Error(data.error||"Ingen översättning");
   if(requestId!==translationRequest)return;
   translatedListing=data.translation;translationKey=key;updateListingPreview();
 }catch(e){if(requestId!==translationRequest)return;document.getElementById("listingLanguageNote").classList.remove("is-working");document.getElementById("listingLanguageNote").textContent="Kunde inte skapa engelsk annonstext. Försök välja språk igen.";listingPreview.textContent="";}
}

document.querySelectorAll("[data-listing-style]").forEach(b=>b.onclick=()=>{listingStyle=b.dataset.listingStyle;copyListingStatus.textContent="";document.querySelectorAll("[data-listing-style]").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b));});ensureRewrite();});
document.querySelectorAll("[data-listing-lang]").forEach(b=>b.onclick=()=>{listingLanguage=b.dataset.listingLang;copyListingStatus.textContent="";refreshAiTagSuggestions();renderTags();document.querySelectorAll("[data-listing-lang]").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b));});ensureRewrite();});
copyListing.onclick=()=>{
  const content=makeVintedListing();if(!content)return;
  applyListingPreferences();refreshAiTagSuggestions();
  if(!tagsInitialized){selectedTags=[...(aiTagToggle.checked?aiSuggestedTags:tagBank)];tagsInitialized=true;}
  renderTags();copyListingStatus.textContent="";
  listingDialog.showModal();document.getElementById("listingHeading").focus({preventScroll:true});document.querySelector(".v-listing-body").scrollTop=0;listingDialog.scrollTop=0;ensureRewrite();
};
document.getElementById("listingClose").onclick=()=>listingDialog.close();
document.getElementById("listingCopy").onclick=async()=>{
  if(!rewrittenListing||!listingPreview.textContent.trim()){copyListingStatus.textContent="Ingen annonstext klar att kopiera.";return;}
  try{await navigator.clipboard.writeText([listingPreview.textContent,selectedTags.map(t=>"#"+t).join(" ")].filter(Boolean).join("\n\n"));copyListingStatus.textContent="Kopierat ✓";if(rewrittenListing){recentCopy.push(rewrittenListing.title+" "+rewrittenListing.description.slice(0,120));if(recentCopy.length>8)recentCopy.splice(0,recentCopy.length-8);try{localStorage.setItem("ccc-vinted-recent-copy",JSON.stringify(recentCopy))}catch{}}const b=document.getElementById("listingCopy");b.classList.add("is-copied");b.textContent="✓";b.blur();setTimeout(()=>{b.classList.remove("is-copied");b.textContent="⧉";},1300);}
  catch{copyListingStatus.textContent="Kunde inte kopiera. Försök igen.";}
};
listingDialog.addEventListener("click",e=>{if(e.target===listingDialog)listingDialog.close();});



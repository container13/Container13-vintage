(() => {
  const params=new URLSearchParams(window.location.search);
  const moduleName=params.get("module")||"dashboard";

  const publishCard=document.getElementById("publishSettingsCard");
  const visionCard=document.getElementById("visionSettingsCard");
  const dashboardCard=document.getElementById("dashboardSettingsCard");
  const dashboardHelpCard=document.getElementById("dashboardHelpCard");

  if(publishCard)publishCard.hidden=moduleName!=="publish";
  if(visionCard)visionCard.hidden=moduleName!=="vision";
  const dashboardMode=moduleName!=="publish" && moduleName!=="vision";
  if(dashboardCard)dashboardCard.hidden=!dashboardMode;
  if(dashboardHelpCard)dashboardHelpCard.hidden=false;

  const markerSubtitle=document.querySelector(".settings-marker span");
  if(markerSubtitle){
    markerSubtitle.textContent=moduleName==="publish"
      ?"Publicera"
      :moduleName==="vision"
        ?"Vision"
        :"Dashboard";
  }

  // Dashboard
  const key="ccc-help-tips-enabled";
  const enabled=document.getElementById("helpTipsEnabled");
  const autoOpen=document.getElementById("helpAutoOpen");
  const resetHelpHistory=document.getElementById("resetHelpHistory");
  const saved=document.getElementById("tipsSaved");
  if(enabled){
    enabled.checked=localStorage.getItem(key)!=="0";
    enabled.addEventListener("change",()=>{
      localStorage.setItem(key,enabled.checked?"1":"0");
      if(saved)saved.textContent=enabled.checked?"Hjälpknappen är aktiverad.":"Hjälpknappen är avstängd.";
    });
  }
  if(autoOpen){
    autoOpen.checked=localStorage.getItem("ccc-help-auto-open")!=="0";
    autoOpen.addEventListener("change",()=>{
      localStorage.setItem("ccc-help-auto-open",autoOpen.checked?"1":"0");
      if(saved)saved.textContent=autoOpen.checked?"Första-gången-hjälp är aktiverad.":"Automatisk hjälp är avstängd.";
    });
  }
  resetHelpHistory?.addEventListener("click",()=>{
    Object.keys(localStorage).filter(key=>key.startsWith("ccc-help-seen:")).forEach(key=>localStorage.removeItem(key));
    if(saved)saved.textContent="Alla första-gången-tips visas igen.";
  });

  // Publicera
  const showTitle=document.getElementById("publishC13ShowTitle");
  const showDescription=document.getElementById("publishC13ShowDescription");
  const showBrand=document.getElementById("publishC13ShowBrand");
  const showSize=document.getElementById("publishC13ShowSize");
  const showPrice=document.getElementById("publishC13ShowPrice");
  const publishSaved=document.getElementById("publishDisplaySaved");
  const KEY_TITLE="ccc-publish-container13-show-title";
  const KEY_DESCRIPTION="ccc-publish-container13-show-description";
  const KEY_BRAND="ccc-publish-container13-show-brand";
  const KEY_SIZE="ccc-publish-container13-show-size";
  const KEY_PRICE="ccc-publish-container13-show-price";

  if(moduleName==="publish" && publishCard){
    if(showTitle)showTitle.checked=localStorage.getItem(KEY_TITLE)!=="0";
    if(showDescription)showDescription.checked=localStorage.getItem(KEY_DESCRIPTION)==="1";
    if(showBrand)showBrand.checked=localStorage.getItem(KEY_BRAND)==="1";
    if(showSize)showSize.checked=localStorage.getItem(KEY_SIZE)==="1";
    if(showPrice)showPrice.checked=localStorage.getItem(KEY_PRICE)==="1";
    const savePublish=()=>{
      localStorage.setItem(KEY_TITLE,showTitle?.checked?"1":"0");
      localStorage.setItem(KEY_DESCRIPTION,showDescription?.checked?"1":"0");
      localStorage.setItem(KEY_BRAND,showBrand?.checked?"1":"0");
      localStorage.setItem(KEY_SIZE,showSize?.checked?"1":"0");
      localStorage.setItem(KEY_PRICE,showPrice?.checked?"1":"0");
      if(publishSaved){
        publishSaved.textContent="Visningen för Container13 är sparad.";
        clearTimeout(savePublish._timer);
        savePublish._timer=setTimeout(()=>{publishSaved.textContent="";},1800);
      }
    };
    showTitle?.addEventListener("change",savePublish);
    showDescription?.addEventListener("change",savePublish);
    showBrand?.addEventListener("change",savePublish);
    showSize?.addEventListener("change",savePublish);
    showPrice?.addEventListener("change",savePublish);
  }

  // Vision
  const visionLearnEdits=document.getElementById("visionLearnEditsSetting");
  const visionCost=document.getElementById("visionTotalCost");
  const visionSaved=document.getElementById("visionSettingsSaved");
  const knowledgeBtn=document.getElementById("visionShowKnowledgeBtn");
  const knowledgeList=document.getElementById("visionKnowledgeList");
  const clearKnowledgeBtn=document.getElementById("visionClearKnowledgeBtn");

  function escapeHtml(value){
    return String(value??"")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function flashVisionSaved(text="Sparat ✓"){
    if(!visionSaved)return;
    visionSaved.textContent=text;
    clearTimeout(flashVisionSaved._timer);
    flashVisionSaved._timer=setTimeout(()=>{visionSaved.textContent="";},1600);
  }

  async function refreshVisionCost(){
    if(!visionCost)return;
    try{
      const summary=await window.CCC_VISION_KNOWLEDGE?.costSummarySince?.("1970-01-01T00:00:00.000Z");
      const sek=Number(summary?.sek||0);
      visionCost.textContent=`${new Intl.NumberFormat("sv-SE",{
        minimumFractionDigits:2,
        maximumFractionDigits:2
      }).format(sek)} kr`;
    }catch(error){
      console.warn("[CCC Settings/Vision] Kunde inte läsa kostnad",error);
      visionCost.textContent="0,00 kr";
    }
  }

  async function renderKnowledgeList(){
    if(!knowledgeList)return;
    const rows=await window.CCC_VISION_KNOWLEDGE?.listKnowledge?.()||[];
    if(!rows.length){
      knowledgeList.innerHTML='<p class="settings-knowledge-empty">CCC har inte lärt sig något lokalt ännu.</p>';
      return;
    }
    knowledgeList.innerHTML=rows.map(row=>{
      const title=row.subject||row.brand||"Okänt objekt";
      const details=[row.brand&&row.brand!==title?row.brand:"",row.category,row.season].filter(Boolean).join(" · ");
      const source=row.source==="user-confirmed"?"Lärt från din ändring":"Godkänt av dig";
      return `<div class="settings-knowledge-item"><strong>${escapeHtml(title)}</strong>${details?`<small>${escapeHtml(details)}</small>`:""}<small>${source}</small></div>`;
    }).join("");
  }

  if(moduleName==="vision" && visionCard){
    if(visionLearnEdits)visionLearnEdits.checked=localStorage.getItem("ccc-vision-learn-edits")!=="false";
    visionLearnEdits?.addEventListener("change",event=>{
      localStorage.setItem("ccc-vision-learn-edits",String(event.target.checked));
      flashVisionSaved();
    });

    knowledgeBtn?.addEventListener("click",async event=>{
      const open=knowledgeList?.hidden!==false;
      if(knowledgeList)knowledgeList.hidden=!open;
      event.currentTarget.setAttribute("aria-expanded",String(open));
      event.currentTarget.textContent=open?"Dölj vad CCC har lärt sig":"Visa vad CCC har lärt sig";
      if(open)await renderKnowledgeList();
    });

    const clearDialog=document.getElementById("visionClearKnowledgeDialog");
    const cancelClear=document.getElementById("cancelVisionClearKnowledge");
    const confirmClear=document.getElementById("confirmVisionClearKnowledge");

    clearKnowledgeBtn?.addEventListener("click",()=>{
      if(clearDialog)clearDialog.hidden=false;
    });

    cancelClear?.addEventListener("click",()=>{
      if(clearDialog)clearDialog.hidden=true;
    });

    clearDialog?.addEventListener("click",event=>{
      if(event.target===clearDialog)clearDialog.hidden=true;
    });

    confirmClear?.addEventListener("click",async()=>{
      confirmClear.disabled=true;
      try{
        await window.CCC_VISION_KNOWLEDGE?.clearKnowledge?.();
        await renderKnowledgeList();
        if(clearDialog)clearDialog.hidden=true;
        flashVisionSaved("Kunskapsbasen är rensad ✓");
      }finally{
        confirmClear.disabled=false;
      }
    });

    refreshVisionCost();
  }

  document.addEventListener("ccc:header-back",()=>{
    const logoutDialog=document.getElementById("logoutDialog");
    if(logoutDialog&&!logoutDialog.hidden){logoutDialog.hidden=true;return;}
    const clearDialog=document.getElementById("visionClearKnowledgeDialog");
    if(clearDialog&&!clearDialog.hidden){clearDialog.hidden=true;return;}
    const returnToPrevious=params.get("return")==="1";
    if(moduleName==="publish"||moduleName==="vision"){
      const target=new URL(`../${moduleName}/index.html`,window.location.href);
      if(returnToPrevious){
        const source=new URLSearchParams(params.get("source")||"");
        source.forEach((value,key)=>target.searchParams.set(key,value));
        target.searchParams.set("settingsReturn","1");
      }
      window.location.href=target.href;
      return;
    }
    window.location.href="../dashboard/index.html";
  });
})();

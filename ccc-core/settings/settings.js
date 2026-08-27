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
  if(dashboardHelpCard)dashboardHelpCard.hidden=!dashboardMode;

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
  const saved=document.getElementById("tipsSaved");
  if(enabled){
    enabled.checked=localStorage.getItem(key)!=="0";
    enabled.addEventListener("change",()=>{
      localStorage.setItem(key,enabled.checked?"1":"0");
      if(saved)saved.textContent=enabled.checked?"Hjälpknappen är aktiverad.":"Hjälpknappen är avstängd.";
    });
  }

  const DIMMER_LEAVE_KEY="ccc-dimmer-leave-ms";
  const DIMMER_ENTER_KEY="ccc-dimmer-enter-ms";
  const DIMMER_VISIBILITY_KEY="ccc-dimmer-visibility";
  const DIMMER_COLOR_KEY="ccc-dimmer-color";
  const dimmerLeave=document.getElementById("dimmerLeaveMs");
  const dimmerEnter=document.getElementById("dimmerEnterMs");
  const dimmerLeaveValue=document.getElementById("dimmerLeaveValue");
  const dimmerEnterValue=document.getElementById("dimmerEnterValue");
  const dimmerVisibility=document.getElementById("dimmerVisibility");
  const dimmerVisibilityValue=document.getElementById("dimmerVisibilityValue");
  const dimmerColor=document.getElementById("dimmerColor");
  const dimmerColorValue=document.getElementById("dimmerColorValue");
  const dimmerSaved=document.getElementById("dimmerTimingSaved");
  const resetDimmer=document.getElementById("resetDimmerTiming");
  const dimmerStoredValue=(key,fallback)=>{
    const value=Number(localStorage.getItem(key));
    return Number.isFinite(value)&&value>=150&&value<=1200?value:fallback;
  };
  const syncDimmerControls=()=>{
    if(dimmerLeaveValue&&dimmerLeave)dimmerLeaveValue.textContent=`${dimmerLeave.value} ms`;
    if(dimmerEnterValue&&dimmerEnter)dimmerEnterValue.textContent=`${dimmerEnter.value} ms`;
    if(dimmerVisibilityValue&&dimmerVisibility)dimmerVisibilityValue.textContent=`${dimmerVisibility.value} %`;
    if(dimmerColorValue&&dimmerColor)dimmerColorValue.textContent=dimmerColor.value.toUpperCase();
  };
  const flashDimmerSaved=(text="Sparat – testa från Dashboard")=>{
    if(!dimmerSaved)return;
    dimmerSaved.textContent=text;
    clearTimeout(flashDimmerSaved._timer);
    flashDimmerSaved._timer=setTimeout(()=>{dimmerSaved.textContent="";},1800);
  };
  if(dashboardMode&&dashboardCard&&dimmerLeave&&dimmerEnter&&dimmerVisibility&&dimmerColor){
    dimmerLeave.value=String(dimmerStoredValue(DIMMER_LEAVE_KEY,260));
    dimmerEnter.value=String(dimmerStoredValue(DIMMER_ENTER_KEY,300));
    const storedVisibilityRaw=localStorage.getItem(DIMMER_VISIBILITY_KEY);
    const storedVisibility=Number(storedVisibilityRaw);
    dimmerVisibility.value=String(storedVisibilityRaw!==null&&Number.isFinite(storedVisibility)&&storedVisibility>=0&&storedVisibility<=40?storedVisibility:9);
    const storedColor=String(localStorage.getItem(DIMMER_COLOR_KEY)||"");
    dimmerColor.value=/^#[0-9a-f]{6}$/i.test(storedColor)?storedColor:"#000000";
    syncDimmerControls();
    dimmerLeave.addEventListener("input",()=>{
      localStorage.setItem(DIMMER_LEAVE_KEY,dimmerLeave.value);
      syncDimmerControls();
      flashDimmerSaved();
    });
    dimmerEnter.addEventListener("input",()=>{
      localStorage.setItem(DIMMER_ENTER_KEY,dimmerEnter.value);
      syncDimmerControls();
      flashDimmerSaved();
    });
    dimmerVisibility.addEventListener("input",()=>{
      localStorage.setItem(DIMMER_VISIBILITY_KEY,dimmerVisibility.value);
      syncDimmerControls();
      flashDimmerSaved();
    });
    dimmerColor.addEventListener("input",()=>{
      localStorage.setItem(DIMMER_COLOR_KEY,dimmerColor.value);
      syncDimmerControls();
      flashDimmerSaved();
    });
    resetDimmer?.addEventListener("click",()=>{
      localStorage.removeItem(DIMMER_LEAVE_KEY);
      localStorage.removeItem(DIMMER_ENTER_KEY);
      localStorage.removeItem(DIMMER_VISIBILITY_KEY);
      localStorage.removeItem(DIMMER_COLOR_KEY);
      dimmerLeave.value="260";
      dimmerEnter.value="300";
      dimmerVisibility.value="9";
      dimmerColor.value="#000000";
      syncDimmerControls();
      flashDimmerSaved("Återställt till 260/300 ms, 9 %, svart");
    });
  }

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
    if(moduleName==="publish")window.location.href="../publish/index.html";
    else if(moduleName==="vision")window.location.href="../vision/index.html";
    else window.location.href="../dashboard/index.html";
  });
})();

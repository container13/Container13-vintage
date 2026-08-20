(() => {
  const params=new URLSearchParams(window.location.search);
  const moduleName=params.get("module")||"dashboard";
  const publishCard=document.getElementById("publishSettingsCard");
  const dashboardCard=document.getElementById("dashboardSettingsCard");
  const dashboardHelpCard=document.getElementById("dashboardHelpCard");

  if(publishCard)publishCard.hidden=moduleName!=="publish";
  if(dashboardCard)dashboardCard.hidden=moduleName==="publish";
  if(dashboardHelpCard)dashboardHelpCard.hidden=moduleName==="publish";

  const key="ccc-help-tips-enabled";
  const enabled=document.getElementById("helpTipsEnabled"),saved=document.getElementById("tipsSaved");
  if(enabled){
    enabled.checked=localStorage.getItem(key)!=="0";
    enabled.addEventListener("change",()=>{
      localStorage.setItem(key,enabled.checked?"1":"0");
      if(saved)saved.textContent=enabled.checked?"Hjälpknappen är aktiverad.":"Hjälpknappen är avstängd.";
    });
  }

  const showTitle=document.getElementById("publishC13ShowTitle");
  const showDescription=document.getElementById("publishC13ShowDescription");
  const publishSaved=document.getElementById("publishDisplaySaved");
  const KEY_TITLE="ccc-publish-container13-show-title";
  const KEY_DESCRIPTION="ccc-publish-container13-show-description";

  if(moduleName==="publish" && publishCard){
    if(showTitle)showTitle.checked=localStorage.getItem(KEY_TITLE)!=="0";
    if(showDescription)showDescription.checked=localStorage.getItem(KEY_DESCRIPTION)==="1";
    const save=()=>{
      localStorage.setItem(KEY_TITLE,showTitle?.checked?"1":"0");
      localStorage.setItem(KEY_DESCRIPTION,showDescription?.checked?"1":"0");
      if(publishSaved){
        publishSaved.textContent="Visningen för Container13 är sparad.";
        clearTimeout(save._timer);
        save._timer=setTimeout(()=>{publishSaved.textContent="";},1800);
      }
    };
    showTitle?.addEventListener("change",save);
    showDescription?.addEventListener("change",save);
  }

  document.addEventListener("ccc:header-back",()=>{
    if(moduleName==="publish")window.location.href="../publish/index.html";
    else window.location.href="../dashboard/index.html";
  });
})();
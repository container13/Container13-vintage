(() => {
  const key="ccc-help-tips-enabled";
  const enabled=document.getElementById("helpTipsEnabled"),saved=document.getElementById("tipsSaved");
  if(enabled){
    enabled.checked=localStorage.getItem(key)!=="0";
    enabled.addEventListener("change",()=>{
      localStorage.setItem(key,enabled.checked?"1":"0");
      if(saved)saved.textContent=enabled.checked?"Hjälpknappen är aktiverad.":"Hjälpknappen är avstängd.";
    });
  }
})();
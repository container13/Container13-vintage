(() => {
  const CCC_VERSION = "2.8.73";
  window.CCC_VERSION = CCC_VERSION;
  function applyVersion(){
    document.querySelectorAll(".js-ccc-version").forEach(el=>el.textContent=`v${CCC_VERSION}`);
    document.querySelectorAll(".ccc-brand-mark, .brand").forEach(brand=>{
      if(brand.querySelector(".ccc-global-version")) return;
      const badge=document.createElement("span");
      badge.className="ccc-global-version"; badge.textContent=`v${CCC_VERSION}`;
      badge.setAttribute("aria-label",`CCC version ${CCC_VERSION}`); brand.appendChild(badge);
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",applyVersion); else applyVersion();
})();

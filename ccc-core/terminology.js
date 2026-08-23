// CCC central terminology – v2.10.30
(() => {
  const STORAGE_KEY = "ccc.core.terminology.entity";
  const PRESETS = {
    object:{singular:"objekt",plural:"objekt",definiteSingular:"objektet",definitePlural:"objekten"},
    garment:{singular:"plagg",plural:"plagg",definiteSingular:"plagget",definitePlural:"plaggen"},
    product:{singular:"produkt",plural:"produkter",definiteSingular:"produkten",definitePlural:"produkterna"},
    item:{singular:"vara",plural:"varor",definiteSingular:"varan",definitePlural:"varorna"}
  };
  const choice=()=>{try{return localStorage.getItem(STORAGE_KEY)||"object"}catch(_){return"object"}};
  const get=()=>({key:choice(),...(PRESETS[choice()]||PRESETS.object)});
  const set=(key)=>{if(!PRESETS[key])return false;try{localStorage.setItem(STORAGE_KEY,key)}catch(_){};window.dispatchEvent(new CustomEvent("ccc:terminologychange",{detail:get()}));return true};
  const label=(form="singular",cap=false)=>{const v=get()[form]||get().singular;return cap?v.charAt(0).toUpperCase()+v.slice(1):v};
  const format=(template="")=>{
    const g=get();
    const tokens={
      singular:g.singular,
      plural:g.plural,
      definiteSingular:g.definiteSingular,
      definitePlural:g.definitePlural,
      Singular:g.singular.charAt(0).toUpperCase()+g.singular.slice(1),
      Plural:g.plural.charAt(0).toUpperCase()+g.plural.slice(1),
      DefiniteSingular:g.definiteSingular.charAt(0).toUpperCase()+g.definiteSingular.slice(1),
      DefinitePlural:g.definitePlural.charAt(0).toUpperCase()+g.definitePlural.slice(1)
    };
    return String(template).replace(/\{(singular|plural|definiteSingular|definitePlural|Singular|Plural|DefiniteSingular|DefinitePlural)\}/g,(_,key)=>tokens[key]);
  };
  const apply=(root=document)=>{
    root.querySelectorAll?.("[data-ccc-term]").forEach(el=>{
      const template=el.getAttribute("data-ccc-term");
      if(template) el.textContent=format(template);
    });
    root.querySelectorAll?.("[data-ccc-term-aria]").forEach(el=>{
      const template=el.getAttribute("data-ccc-term-aria");
      if(template) el.setAttribute("aria-label",format(template));
    });
  };
  window.CCC_TERMINOLOGY={presets:PRESETS,get,set,label,format,apply,storageKey:STORAGE_KEY};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>apply(),{once:true});
  else apply();
  window.addEventListener("ccc:terminologychange",()=>apply());
})();

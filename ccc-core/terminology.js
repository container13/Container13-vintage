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
  window.CCC_TERMINOLOGY={presets:PRESETS,get,set,label,storageKey:STORAGE_KEY};
})();

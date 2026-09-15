(function(){
  const KEY='lina_clean_core_state_v0011';
  const defaults={version:'0.2.11',tradeEnabled:false,maturity:48,lastRoute:'dashboard'};
  function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{return {...defaults}}}
  let state=load();
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  window.LinaState={get:()=>({...state}),set(patch){state=Object.assign({},state,patch||{});save();return {...state}},reset(){state={...defaults};save();return {...state}}};
})();

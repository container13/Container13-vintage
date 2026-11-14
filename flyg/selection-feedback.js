/* Presentation adapter only; live-search.js remains the sole search owner. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FlygSelectionUI=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
 function begin(button,text){
  if(!button)return null;
  button.parentElement?.querySelector('.selection-feedback')?.remove();
  const message=button.ownerDocument.createElement('p');message.className='selection-feedback';message.setAttribute('role','status');message.textContent=text;
  const action={button,message,label:button.textContent};button.textContent=text;button.insertAdjacentElement('afterend',message);return action;
 }
 function error(action,text){if(!action)return;action.message.textContent=text;action.message.setAttribute('role','alert');action.message.scrollIntoView({block:'center',behavior:'auto'});}
 function finish(action){if(action?.button.isConnected)action.button.textContent=action.label;}
 function reveal(results){const heading=results.querySelector('h3');if(!heading)return;heading.tabIndex=-1;heading.style.scrollMarginTop='16px';heading.scrollIntoView({block:'start',behavior:'auto'});heading.focus({preventScroll:true});}
 return Object.freeze({begin,error,finish,reveal});
});

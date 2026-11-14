(()=>{'use strict';if(!('serviceWorker'in navigator)||!/^https?:$/.test(location.protocol))return;window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).then(reg=>reg.update()).catch(error=>{console.warn('Flyg PWA: service worker kunde inte registreras',error)}));})();

if(window.matchMedia('(display-mode: standalone)').matches||navigator.standalone){document.getElementById('installHelp')?.remove()}

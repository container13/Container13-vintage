(function(){
  'use strict';
  const RELEASE='V0.3.02';
  const CACHE='0.3.02';
  window.LinaVersion=Object.freeze({release:RELEASE,cache:CACHE,number:RELEASE.replace(/^V/,'')});
  window.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-lina-version]').forEach(el=>{el.textContent=RELEASE});
  });
})();

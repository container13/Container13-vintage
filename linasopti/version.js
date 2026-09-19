(function(){
  'use strict';
  const RELEASE='V0.2.87';
  const CACHE='0.2.87';
  window.LinaVersion=Object.freeze({release:RELEASE,cache:CACHE,number:RELEASE.replace(/^V/,'')});
  window.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-lina-version]').forEach(el=>{el.textContent=RELEASE});
  });
})();

/* Remember shared viewport repaint: installed iOS PWA visual viewport changes on launch. */
(()=>{'use strict';
 const root=document.documentElement;
 let frame=0,last=0;
 function sync(){
  frame=0;
  const h=Math.max(window.innerHeight||0,window.visualViewport?.height||0);
  if(!h)return;
  const rounded=Math.ceil(h);
  if(rounded===last)return;
  last=rounded;
  root.style.setProperty('--remember-live-viewport',rounded+'px');
 }
 function schedule(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(sync)}
 schedule();
 document.addEventListener('DOMContentLoaded',schedule,{once:true});
 window.addEventListener('pageshow',schedule);
 window.addEventListener('resize',schedule);
 window.addEventListener('orientationchange',schedule);
 window.visualViewport?.addEventListener('resize',schedule);
 window.visualViewport?.addEventListener('scroll',schedule);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
})();

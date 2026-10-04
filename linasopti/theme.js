(function(){
  'use strict';
  const KEY='linasopti_theme';
  const meta=()=>document.querySelector('meta[name="theme-color"]');
  function preferred(){const saved=localStorage.getItem(KEY);if(saved==='dark'||saved==='light')return saved;return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}
  function paint(theme,persist){document.documentElement.dataset.theme=theme;if(persist)localStorage.setItem(KEY,theme);const m=meta();if(m)m.content=theme==='dark'?'#0b111b':'#f4f7fb';const b=document.getElementById('themeToggle');if(b){const icon=b.querySelector('span'),label=b.querySelector('small');if(icon)icon.textContent=theme==='dark'?'☀️':'🌙';if(label)label.textContent=theme==='dark'?'Ljust':'Mörkt';b.setAttribute('aria-pressed',theme==='dark'?'true':'false');b.title=theme==='dark'?'Byt till ljust tema':'Byt till mörkt tema'}}
  paint(preferred(),false);
  document.addEventListener('DOMContentLoaded',()=>{paint(document.documentElement.dataset.theme||preferred(),false);const b=document.getElementById('themeToggle');if(b&&!b.dataset.bound){b.dataset.bound='1';b.addEventListener('click',()=>paint(document.documentElement.dataset.theme==='dark'?'light':'dark',true))}});
  window.LinaTheme={get:()=>document.documentElement.dataset.theme,set:t=>{if(t==='dark'||t==='light')paint(t,true)}};
})();

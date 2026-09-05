// ==UserScript==
// @name         Competence Tool – Android DIAG (fristående)
// @namespace    container13.mobile.android.diag
// @version      1.0.0
// @description  Mäter omladdningar och storlekshändelser utan att ändra Competence Tool.
// @match        https://competencetool.se/*
// @match        https://*.competencetool.se/*
// @include      /^https:\/\/[^/]*competencetool\.se\/.*$/
// @run-at       document-start
// @noframes
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  if (window !== window.top) return;

  const KEY = 'ctm-android-diag-v1';
  const now = () => new Date().toLocaleTimeString('sv-SE');
  const fresh = () => ({
    started: now(), topStarts: 0, topLoads: 0, iframeLoads: 0,
    resize: 0, vvResize: 0, vvScroll: 0, mutations: 0,
    framesNow: 0, lastEvent: 'start'
  });
  let state;
  try { state = { ...fresh(), ...JSON.parse(sessionStorage.getItem(KEY) || '{}') }; }
  catch (_) { state = fresh(); }
  state.topStarts += 1;
  state.lastEvent = `DIAG start ${now()}`;

  const save = () => {
    try { sessionStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  };
  save();

  const report = () => [
    'Android DIAG 1.0.0',
    `Startad: ${state.started}`,
    `Topstarter: ${state.topStarts}`,
    `Top load: ${state.topLoads}`,
    `Iframe load: ${state.iframeLoads}`,
    `Iframe nu: ${state.framesNow}`,
    `Resize: ${state.resize}`,
    `Viewport resize: ${state.vvResize}`,
    `Viewport scroll: ${state.vvScroll}`,
    `DOM-ändringar: ${state.mutations}`,
    `Senast: ${state.lastEvent}`,
    `URL: ${location.href}`
  ].join('\n');

  let panel;
  const render = () => {
    if (!panel?.isConnected) return;
    panel.querySelector('[data-diag-report]').textContent = report();
  };
  const count = (field, label) => {
    state[field] += 1;
    state.lastEvent = `${label} ${now()}`;
    save();
    render();
  };

  const mount = () => {
    if (document.getElementById('ctm-android-diag')) return;
    const style = document.createElement('style');
    style.textContent = `
      #ctm-android-diag{position:fixed;z-index:2147483647;top:max(8px,env(safe-area-inset-top));left:8px;right:8px;padding:12px;border:3px solid #d40032;border-radius:14px;background:#fff;color:#111;box-shadow:0 6px 24px #0005;font:700 14px/1.35 ui-monospace,monospace}
      #ctm-android-diag pre{margin:0 0 9px;white-space:pre-wrap;font:inherit}
      #ctm-android-diag .row{display:flex;gap:8px}
      #ctm-android-diag button{min-height:42px;flex:1;border:0;border-radius:9px;background:#0d6089;color:#fff;font:700 15px system-ui}
      #ctm-android-diag button:last-child{background:#666}
    `;
    panel = document.createElement('section');
    panel.id = 'ctm-android-diag';
    panel.innerHTML = '<pre data-diag-report></pre><div class="row"><button data-copy>Kopiera rapport</button><button data-reset>Nollställ</button></div>';
    (document.head || document.documentElement).appendChild(style);
    (document.body || document.documentElement).appendChild(panel);
    panel.querySelector('[data-copy]').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(report());
        panel.querySelector('[data-copy]').textContent = 'Kopierad ✓';
      } catch (_) {
        prompt('Kopiera texten:', report());
      }
    });
    panel.querySelector('[data-reset]').addEventListener('click', () => {
      state = fresh();
      state.topStarts = 1;
      state.lastEvent = `Nollställd ${now()}`;
      save(); render();
    });
    render();
  };

  const knownFrames = new WeakSet();
  const watchFrames = () => {
    const frames = Array.from(document.querySelectorAll('iframe'));
    state.framesNow = frames.length;
    frames.forEach((frame) => {
      if (knownFrames.has(frame)) return;
      knownFrames.add(frame);
      frame.addEventListener('load', () => count('iframeLoads', 'iframe load'));
    });
    save(); render();
  };

  window.addEventListener('load', () => count('topLoads', 'top load'), { once: true });
  window.addEventListener('resize', () => count('resize', 'resize'));
  window.visualViewport?.addEventListener('resize', () => count('vvResize', 'viewport resize'));
  window.visualViewport?.addEventListener('scroll', () => count('vvScroll', 'viewport scroll'));

  const startObserver = () => {
    watchFrames();
    new MutationObserver((records) => {
      state.mutations += records.length;
      state.lastEvent = `DOM ${now()}`;
      watchFrames();
    }).observe(document.documentElement, { childList: true, subtree: true });
  };

  mount();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { mount(); startObserver(); }, { once: true });
  } else {
    startObserver();
  }
})();

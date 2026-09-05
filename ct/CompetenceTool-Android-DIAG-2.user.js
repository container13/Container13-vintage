// ==UserScript==
// @name         Competence Tool – Android DIAG 2.0
// @namespace    container13.mobile.android.diag2
// @version      2.0.0
// @description  Loggar laddningar i Violentmonkey och visar dem på en separat rapportsida.
// @match        https://competencetool.se/*
// @match        https://*.competencetool.se/*
// @match        https://container13.se/ct/android-diag-report.html*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// ==/UserScript==

(() => {
  'use strict';
  const PREFIX = 'ctdiag2:event:';
  const isReport = location.hostname === 'container13.se'
    && location.pathname.endsWith('/ct/android-diag-report.html');

  const keys = () => {
    try { return GM_listValues().filter((key) => key.startsWith(PREFIX)).sort(); }
    catch (_) { return []; }
  };

  const log = (type, extra = {}) => {
    const stamp = Date.now();
    const key = `${PREFIX}${String(stamp).padStart(13, '0')}:${Math.random().toString(36).slice(2, 8)}`;
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    try {
      GM_setValue(key, {
        stamp, time: new Date(stamp).toLocaleTimeString('sv-SE'), type,
        top: window === window.top, url: location.href, ready: document.readyState,
        nav: nav?.type || '', width: window.innerWidth, height: window.innerHeight,
        ...extra
      });
      const all = keys();
      all.slice(0, Math.max(0, all.length - 240)).forEach((oldKey) => GM_deleteValue(oldKey));
    } catch (_) {}
  };

  const loadEvents = () => keys().map((key) => {
    try { return GM_getValue(key); } catch (_) { return null; }
  }).filter(Boolean);

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  const showReport = () => {
    const mount = () => {
      const events = loadEvents();
      const count = (type, top) => events.filter((event) => event.type === type && (top === undefined || event.top === top)).length;
      const startsTop = count('start', true);
      const startsFrame = count('start', false);
      const last = events.slice(-30).reverse();
      const urls = [...new Set(events.map((event) => event.url).filter(Boolean))];
      const line = (event) => `${event.time} | ${event.top ? 'TOP' : 'RAM'} | ${event.type} | ${event.ready} | ${event.nav || '-'} | ${event.width}x${event.height}\n${event.url}`;

      document.documentElement.innerHTML = `<head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Android DIAG 2.0</title><style>
        *{box-sizing:border-box}body{margin:0;padding:14px;background:#eef3f6;color:#173f57;font:16px/1.4 system-ui,sans-serif}.wrap{max-width:720px;margin:auto}.card{margin-bottom:14px;padding:16px;border:1px solid #bdd5e3;border-radius:18px;background:#fff;box-shadow:0 8px 22px #0d537b18}h1{margin:0 0 5px;font-size:25px}h2{margin:0 0 10px;font-size:18px}.ok{color:#198754}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.metric{padding:10px;border-radius:11px;background:#edf7fc}.metric b{display:block;font-size:24px}button{width:100%;min-height:48px;margin-top:9px;border:0;border-radius:12px;background:#0d6089;color:#fff;font:700 16px system-ui}button.danger{background:#b4002b}pre{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.45 ui-monospace,monospace}.empty{padding:15px;border-radius:12px;background:#fff3cd;color:#664d03}
      </style></head><body><main class="wrap">
        <section class="card"><h1>Android DIAG 2.0</h1><div class="ok">Rapporten visas utanför CompetenceTool</div></section>
        <section class="card"><h2>Sammanfattning</h2><div class="grid">
          <div class="metric">Topstarter<b>${startsTop}</b></div><div class="metric">Ramstarter<b>${startsFrame}</b></div>
          <div class="metric">Top load<b>${count('load', true)}</b></div><div class="metric">Ram load<b>${count('load', false)}</b></div>
          <div class="metric">Pagehide<b>${count('pagehide')}</b></div><div class="metric">Fel<b>${count('error') + count('rejection')}</b></div>
          <div class="metric">Resize<b>${count('resize')}</b></div><div class="metric">Viewport resize<b>${count('vvresize')}</b></div>
        </div></section>
        <section class="card"><h2>Adresser</h2>${urls.length ? `<pre>${urls.map(escapeHtml).join('\n\n')}</pre>` : '<div class="empty">Ingen logg hittades ännu.</div>'}</section>
        <section class="card"><h2>Senaste händelser</h2><pre>${last.map((event) => escapeHtml(line(event))).join('\n\n')}</pre><button id="copy">Kopiera hela rapporten</button><button class="danger" id="clear">Rensa loggen</button></section>
      </main></body>`;

      const plain = [
        'Android DIAG 2.0', `Topstarter: ${startsTop}`, `Ramstarter: ${startsFrame}`,
        `Top load: ${count('load', true)}`, `Ram load: ${count('load', false)}`,
        `Pagehide: ${count('pagehide')}`, `Fel: ${count('error') + count('rejection')}`,
        `Resize: ${count('resize')}`, `Viewport resize: ${count('vvresize')}`,
        '', 'ADRESSER', ...urls, '', 'SENASTE HÄNDELSER', ...last.map(line)
      ].join('\n');
      document.getElementById('copy').addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(plain); alert('Rapporten är kopierad.'); }
        catch (_) { prompt('Kopiera rapporten:', plain); }
      });
      document.getElementById('clear').addEventListener('click', () => {
        if (!confirm('Rensa hela DIAG-loggen?')) return;
        keys().forEach((key) => GM_deleteValue(key));
        location.reload();
      });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
    else mount();
  };

  if (isReport) { showReport(); return; }
  log('start');
  window.addEventListener('load', () => log('load'), { once: true });
  window.addEventListener('pagehide', () => log('pagehide'), { once: true });
  window.addEventListener('beforeunload', () => log('beforeunload'), { once: true });
  window.addEventListener('hashchange', () => log('hashchange'));
  window.addEventListener('resize', () => log('resize'));
  window.visualViewport?.addEventListener('resize', () => log('vvresize'));
  window.addEventListener('error', (event) => log('error', { message: event.message || '' }));
  window.addEventListener('unhandledrejection', (event) => log('rejection', { message: String(event.reason || '') }));
  window.setTimeout(() => log('alive-5s'), 5000);
  window.setTimeout(() => log('alive-15s'), 15000);
})();

const CACHE_NAME = 'container13-site-v6.10.20';
const APP_SHELL = [
  './',
  './index.html',
  './animation-test.html',
  './omoss.html',
  './galleri.html',
  './nyinkommet.html',
  './kontakt.html',
  './hittahit.html',
  './css/style.css',
  './includes/header.html',
  './includes/footer.html',
  './pwa.js',
  './js/analytics.js',
  './js/layout.js',
  './js/theme-init.js',
  './js/theme-controls.js',
  './bilder/logotyp/logo-patina.png',
  './bilder/animation/startanimation-second-hand-desktop.webp',
  './bilder/animation/startanimation-second-hand-mobile.webp',
  './icons/icon-192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        APP_SHELL.map(async (url) => {
          const response = await fetch(new Request(url, { cache: 'reload' }));
          if (response.ok) {
            await cache.put(url, response);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key.startsWith('container13-site-'))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request, { cache: 'no-store' })
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;

        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        return Response.error();
      })
  );
});

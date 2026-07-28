const CACHE_NAME = 'container13-site-v6.10.47';
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
  './js/gallery-data.js',
  './js/settings-data.js',
  './js/site-data.js',
  './js/site-settings.js',
  './js/status.js',
  './js/galleri.js',
  './js/nyinkommet.js',
  './js/senaste-nytt.js',
  './js/opening-hours.js',
  './js/image-preloader.js',
  './js/theme-init.js',
  './js/theme-controls.js',
  './bilder/logotyp/logo-patina.webp',
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

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request, { ignoreSearch: true });
          return cached || caches.match('./index.html');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      const refresh = fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => cached || Response.error());

      return cached || refresh;
    })
  );
});

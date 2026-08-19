// CCC site-preview: inert service worker-fil.
// pwa.js registrerar ingen service worker i preview-läget.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", () => {});

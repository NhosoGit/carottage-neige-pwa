const CACHE_NAME = 'carotte-neige-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', evt => {
  const url = new URL(evt.request.url);
  if (ASSETS.includes(url.pathname) || url.pathname === '/' ) {
    evt.respondWith(
      caches.match(evt.request).then(cached => cached || fetch(evt.request))
    );
    return;
  }
  evt.respondWith(
    fetch(evt.request).catch(() => caches.match(evt.request))
  );
});
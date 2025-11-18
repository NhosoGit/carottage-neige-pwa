const CACHE_NAME = 'carotte-neige-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/aide.html',
  '/offline.html',    // Ajout de la page offline
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/logo.png'
];

// INSTALLATION : mise en cache des fichiers essentiels
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATION : suppression des anciens caches
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// FETCH : stratégie mixte avec fallback offline
self.addEventListener('fetch', evt => {
  const url = new URL(evt.request.url);

  // Cache-first pour l'app shell
  if (ASSETS.includes(url.pathname) || url.pathname === '/') {
    evt.respondWith(
      caches.match(evt.request).then(cached => cached || fetch(evt.request))
    );
    return;
  }

  // Network-first avec fallback cache ou offline.html
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.match(evt.request).then(cached => {
        return cached || caches.match('/offline.html');
      });
    })
  );
});
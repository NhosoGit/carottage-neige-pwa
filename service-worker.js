
const CACHE_NAME = 'app-cache-v3';
const ASSETS = [
  '/',                // racine
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/MV.png'
];

// Installation : mise en cache des fichiers essentiels
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : suppression des anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch : stratégie améliorée
self.addEventListener('fetch', event => {
  const req = event.request;

  // Cas 1 : Navigation (HTML)
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Cas 2 : Scripts, CSS, images ? cache-first
  if (['script', 'style', 'image'].includes(req.destination)) {
    event.respondWith(
      caches.match(req).then(response => {
        return response || fetch(req).then(networkResp => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(req, networkResp.clone());
            return networkResp;
          });
        });
      })
    );
    return;
  }

  // Cas 3 : Autres requêtes ? network-first avec fallback
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});

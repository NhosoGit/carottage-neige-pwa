
const CACHE_NAME = 'app-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/aide.html',
  '/MV.png',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/offline.html'
];

// Installation : mise en cache des fichiers essentiels
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
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
});

// Fetch : stratégie offline améliorée
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response; // Cache-first pour les ressources connues
      }
      return fetch(event.request).catch(() => caches.match('/offline.html'));
    })
  );
});

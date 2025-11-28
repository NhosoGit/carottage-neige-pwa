const CACHE_NAME = 'app-cache-v3';
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// ?? Fix OFFICIEL Android : navigation fallback ? index.html
self.addEventListener('fetch', event => {
  // Navigation (chargement de page)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Autres requêtes (JS, CSS, images…)
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Fallback d'urgence si vraiment introuvable
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

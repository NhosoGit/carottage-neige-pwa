const CACHE_NAME = "app-cache-v4";
const ASSETS = [
  "/",
  "/index.html",
  "/aide.html",
  "/MV.png",
  "/styles.css",
  "/app.js",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// ?? Le correctif indispensables Android
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Navigation = renvoyer TOUJOURS index.html
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("/index.html"))
    );
    return;
  }

  // Ressources statiques
  event.respondWith(
    caches.match(req).then((res) => res || fetch(req))
  );
});

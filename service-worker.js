const CACHE_NAME = "tabungin-cache-v1";
const urlsToCache = [
  "/tabungin",
  "/tabungin/index.html",
  "/tabungin/manifest.json",
  "/tabungin/script.js",
  // "https://cdn.tailwindcss.com",
  // "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
  // "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
];

// Install Service Worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});

// Fetch Data
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Gunakan cache jika ada, kalau tidak fetch online
      return response || fetch(event.request);
    })
  );
});

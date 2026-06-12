const CACHE_NAME = "estoque-pwa-v2";

const STATIC_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://unpkg.com/@zxing/library@latest"
];

// ================= INSTALL =================
self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_FILES);
    })
  );

  self.skipWaiting();
});

// ================= ACTIVATE =================
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

// ================= FETCH (CORRIGIDO) =================
self.addEventListener("fetch", (event) => {

  const url = event.request.url;

  // 🔥 HTML SEMPRE BUSCA DA INTERNET (EVITA TRAVAR UPDATE)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // 📦 OUTROS ARQUIVOS: cache first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});

const CACHE_NAME = 'v1_cache_miapp';
const urlsToCache = ['./', './index.html', './styles.css', './script.js'];

// Instalación: Guarda los archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Intercepta peticiones para servir desde el caché si no hay red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
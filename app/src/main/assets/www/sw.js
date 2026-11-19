const CACHE = 'pec-vih-v500';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/data.js',
  './js/validation.js',
  './js/classification.js',
  './js/render.js',
  './js/ui.js',
  './js/mva-pediatric-flowchart.js',
  './js/infant-followup-flowchart.js',
  './manifest.json',
  './icons/ARV-P.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/ALD_bottle.png',
  './icons/TAF_bottle.png',
  './icons/TLD_bottle.png',
  './icons/pald_bottle.png',
  './icons/DTG-10_bottle.png',
  './icons/DTG-50_bottle.png',
  './icons/abct3tc120_60_bottle.png',
  './icons/abc_3tc_600_300_bottle.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetched = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});

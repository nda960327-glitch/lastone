const CACHE_NAME = 'vocabmaster-v346'; // feat: 버튼 시스템 리디자인
const KAWAII = [];
for (const kind of ['bear', 'cloud', 'sprout']) {
  for (const pose of ['idle','happy','oops','cheer','wave','dance','sleep','love','shock','face','face-happy','mini']) {
    KAWAII.push(`/assets/kawaii/${kind}-${pose}.svg`);
  }
}
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/kawaii.css',
  '/app.js',
  '/supabase-db.js',
  '/sfx.js',
  '/celebration.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon.jpg',
  ...KAWAII
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First (네트워크 우선, 실패 시 캐시 폴백) 전략
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});

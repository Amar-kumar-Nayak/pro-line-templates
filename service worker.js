const CACHE_NAME = 'proline-cache-v2'; // Change this version to invalidate old cache

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/all.min.css',
  '/css/bootstrap.min.css',
  '/css/tooplate-style.css',
  '/js/jquery-1.9.1.min.js',
  '/js/jquery.singlePageNav.min.js',
  '/js/bootstrap.min.js',
  '/videos/city-night-blur-01.mp4',
  '/img/img-01.jpg',
  '/img/img-02.jpg',
  '/img/img-03.jpg',
  '/img/img-04.jpg',
  '/img/img-05.jpg',
  '/img/img-06.jpg'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate Event - Clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch Event - Try cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedRes => {
      const fetchPromise = fetch(event.request).then(networkRes => {
        if (networkRes && networkRes.status === 200) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkRes.clone());
          });
        }
        return networkRes;
      }).catch(() => cachedRes); // fallback to cache on network failure

      return cachedRes || fetchPromise;
    })
  );
});

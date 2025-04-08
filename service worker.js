// service-worker.js

const CACHE_NAME = "pro-line-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/css/all.min.css",
  "/css/bootstrap.min.css",
  "/css/tooplate-style.css",
  "/js/jquery-1.9.1.min.js",
  "/js/jquery.singlePageNav.min.js",
  "/js/bootstrap.min.js",
  "/videos/city-night-blur-01.mp4",
  "/img/img-01.jpg",
  "/img/img-02.jpg",
  "/img/img-03.jpg",
  "/img/img-04.jpg",
  "/img/img-05.jpg",
  "/img/img-06.jpg"
];

// Install service worker and cache all necessary files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the service worker and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Intercept fetch requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

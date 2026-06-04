const CACHE_NAME = "edu-kit-pwa-20260604-no-google-font";

const LOCAL_ASSETS = [
    "./",
    "./index.html",
    "./h-deletion.html",
    "./tensing.html",
    "./nasalization.html",
    "./aspiration.html",
    "./palatalization.html",
    "./double-final.html",
    "./final-sound.html",
    "./manifest.webmanifest",
    "./assets/css/style.css",
    "./assets/css/h-deletion.css",
    "./assets/css/tensing.css",
    "./assets/css/nasalization.css",
    "./assets/css/aspiration.css",
    "./assets/css/palatalization.css",
    "./assets/css/double-final.css",
    "./assets/css/final-sound.css",
    "./assets/js/app.js",
    "./assets/js/data.js",
    "./assets/js/h-deletion.js",
    "./assets/js/tensing.js",
    "./assets/js/nasalization.js",
    "./assets/js/aspiration.js",
    "./assets/js/palatalization.js",
    "./assets/js/double-final.js",
    "./assets/js/final-sound.js",
    "./assets/js/pwa.js",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.allSettled(LOCAL_ASSETS.map((asset) => cache.add(asset))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys
                .filter((key) => key !== CACHE_NAME)
                .map((key) => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => cachedResponse || fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, responseClone))
                        .catch(() => {});
                    return networkResponse;
                })
                .catch(() => caches.match("./index.html")))
    );
});

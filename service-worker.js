const CACHE_NAME = "edu-kit-pwa-20260811-phonemic";

const LOCAL_ASSETS = [
    "./",
    "./index.html",
    "./h-deletion.html",
    "./tensing.html",
    "./nasalization.html",
    "./aspiration.html",
    "./palatalization.html",
    "./liquidization.html",
    "./double-final.html",
    "./final-sound.html",
    "./decoding-jamo.html",
    "./decoding-syllable.html",
    "./decoding-final.html",
    "./decoding-word.html",
    "./decoding-nonsense.html",
    "./phonemic-syllable-count.html",
    "./phonemic-initial-sound.html",
    "./phonemic-final-sound.html",
    "./phonemic-same-sound.html",
    "./phonemic-blending.html",
    "./phonemic-segmenting.html",
    "./manifest.webmanifest",
    "./assets/css/style.css",
    "./assets/css/h-deletion.css",
    "./assets/css/tensing.css",
    "./assets/css/nasalization.css",
    "./assets/css/aspiration.css",
    "./assets/css/palatalization.css",
    "./assets/css/liquidization.css",
    "./assets/css/double-final.css",
    "./assets/css/final-sound.css",
    "./assets/css/decoding.css",
    "./assets/css/phonemic.css",
    "./assets/js/app.js",
    "./assets/js/data.js",
    "./assets/js/tts.js",
    "./assets/js/h-deletion.js",
    "./assets/js/tensing.js",
    "./assets/js/nasalization.js",
    "./assets/js/aspiration.js",
    "./assets/js/palatalization.js",
    "./assets/js/liquidization.js",
    "./assets/js/double-final.js",
    "./assets/js/final-sound.js",
    "./assets/js/decoding-jamo.js",
    "./assets/js/decoding-syllable.js",
    "./assets/js/decoding-final.js",
    "./assets/js/decoding-word.js",
    "./assets/js/decoding-nonsense.js",
    "./assets/js/phonemic-common.js",
    "./assets/js/phonemic-syllable-count.js",
    "./assets/js/phonemic-initial-sound.js",
    "./assets/js/phonemic-final-sound.js",
    "./assets/js/phonemic-same-sound.js",
    "./assets/js/phonemic-blending.js",
    "./assets/js/phonemic-segmenting.js",
    "./assets/js/pwa.js",
    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/maskable-512.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.allSettled(LOCAL_ASSETS.map((asset) => cache.add(asset))))
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

self.addEventListener("message", (event) => {
    if (event.data?.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    const isNavigation = event.request.mode === "navigate";
    const acceptsHtml = event.request.headers.get("accept")?.includes("text/html");

    if (isNavigation || acceptsHtml) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => cache.put(event.request, responseClone))
                        .catch(() => {});
                    return networkResponse;
                })
                .catch(() => caches.match(event.request)
                    .then((cachedResponse) => cachedResponse || caches.match("./index.html")))
        );
        return;
    }

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


const cacheName = 'cacheAssets';
// On install event: Triggered when service worker is installed.
self.addEventListener('install', function (event) {
    console.log('Service Worker Installed!', event);

    //Activate itself when it enters the waiting phase
    self.skipWaiting();

    //Create the static cache.
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                cache.addAll([
                    '/',
                    '/index.html',
                    '/script.js',
                    '/css/style.css',
                    '/images/logo.png',
                    '/manifest.json',
                    '/icons/favicon-196.png',
                    '/icons/favicon.ico',
                    '/offline.html',
                    'icons/manifest-icon-192.maskable.png'
                ]);
            })
            .catch((error) => {
                console.log('Cache Failed: ', error);
            })
    );
});

//On activate event: Triggered when the service worker is activated.
self.addEventListener('activate', function (event) {
    console.log('Service Worker Activated', event);

    // Immediately get control over the open pages.
    event.waitUntil(clients.claim());

    // Remove unnecessary caches.
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                cacheNames.forEach((item => {
                    if (item !== cacheName) {
                        caches.delete(item);
                    }
                }))
            })
    );
});

//On fetch event: Triggered when service worker retrieves an asset.
self.addEventListener('fetch', (event) => {

      // Cache strategy: Stale While Revalidate
      event.respondWith(
        caches.open(cacheName)
        .then((cache) => {
            return cache.match(event.request)
            .then((cachedResponse) => {
                const fetchedResponse = fetch(event.request)
                .then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                .catch(() => {
                    return cache.match('/offline.html');
                });
                return cachedResponse || fetchedResponse;
            })
        })
    )
    //Cache Strategy: Cache Only
    // event.respondWith(
    //     caches.open(cacheName)
    //     .then((cache) => {
    //         return cache.match(event.request)
    //         .then((response) => {
    //             return response;
    //         })
    //     })
    // )

    //Cache strategy: Network Only
    // event.respondWith(
    //     fetch(event.request)
    //     .then((response) => {
    //         return response;
    //     })
    // )


    //Cache strategy: Cache with Network Fallback 
    // event.respondWith(
    //     caches.open(cacheName)
    //     .then((cache) => {
    //         return cache.match(event.request)
    //         .then((response) => {
    //             return response || fetch(event.request);
    //         })
    //     })
    // )

    // Cache strategy: Network with Cache Fallback
    // event.respondWith(
    //     fetch(event.request)
    //         .catch(() => {
    //             return caches.open(cacheName)
    //                 .then((cache) => {
    //                     return cache.match(event.request);
    //                 })
    //         })
    // )

});
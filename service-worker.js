
import musicDB from './music-db/music-db.js';

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
    if (event.request.method == 'GET') {
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
    }
});


self.addEventListener('message', (event) => {
    console.log('[SW]Message Received', event);
    const data = event.data;
    const whoAmI = event.source;
    whoAmI.postMessage('Thanks')

    const options = { includeUncontrolled: false, type: 'window' }
    self.clients.matchAll(options).then((matchClients) => {
        matchClients.forEach((client) => {
            if (client.id !== who.id) {
                client.postMessage('Someone else sent me a message');
            };
        })
    })
})

self.addEventListener('sync', (event) => {
    switch (event.tag) {
        case 'my-tag-name':
            console.log('DO something');
            break;
        case 'add-music':
            console.log('addMusics')
            addMusic();
            break;
        case 'send-email':
            console.log('Sending email');
            break;
    }
});

function addMusic() {
    musicDB.dbOffline.open()
        .then(() => {
            musicDB.dbOffline.getAll()
                .then((musics) => {
                    //Open the online database
                    musicDB.dbOnline.open()
                        .then(() => {

                            //Save the musics online
                            musics.forEach(music => {
                                musicDB.dbOnline.add(music.songTitle, music.songArtist)
                                    .then(() => {
                                        musicDB.dbOffline.delete(music.id)
                                    })
                                    .catch((error) => console.log(error))
                            })

                            //Broadcast a message to the user
                            clients.matchAll().then((clients) => {
                                clients.forEach((client) => {
                                    client.postMessage({
                                        action: 'music-sync',
                                        count: musics.length
                                    });
                                });
                            });



                            // Also display a notification
                            const message = `Synchronized ${musics.length} music!`
                            registration.showNotification(message);
                        })
                        .catch((error) => console.log(error))
                });
        })
        .catch((error) => console.log(error));
}

self.addEventListener('notificationclick', (event) => {
    let data = " ";
    switch (event.action) {
        case 'Agree':
            data = "So we both agree on that!"
            break;
        case 'Disagree':
            data = "Let's agree to disagree. "
            break;
        default:
            console.log('Clicked on the notification!');
            break;
    }
    clients.matchAll().then((clients) => {
        clients.forEach((client) => {
            client.postMessage({
                action: event.action,
                message: data
            });
        });
    });
})

self.addEventListener('push', (event) => {
    const data = event.data.json();
    console.log('Data Content', data);

    const options = {
        body: data.description,
        icon: data.icon
    }
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    )
})
 let staticCacheName = '';

/*
    self.addEventListener('install', function (event) {
        console.log('Service worker installing...');
        self.skipWaiting();
        event.waitUntil(
            caches.open(staticCacheName).then(function (cache) {
                cache.addAll([
                    '/',
                    '/precentage/cartridge',
                    '/storage',
                    '/floors',
                    '/admin',
                    'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js',
                    '/css/style.css',
                    '/js/front-end.js'
                ]);
            })
        );
    });
*/

/*    self.addEventListener('activate', function (event) {
        console.log('Service worker activating...');
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.filter((cacheName) => {
                        return cacheName.startsWith('printer') &&
                            cacheName !== staticCacheName
                    }).map((cacheName) => {
                        return cache.delete(cacheName);
                    })
                );
            })
        );
    });*/

    // I'm a new service worker
 console.log('hi');
    addEventListener('fetch', event => {
        event.respondWith(
            fetch(event.request).catch(()=>{ new Response('you is offline') })
           /* caches.match(event.request).then(function (res) {

                if (res) { return res; }
                else { return fetch(event.request); }

            }).catch(() => {
                return new Response('Holy shit dis failed');
            })*/
        );

    });
(function () {
    'use strict';

    self.addEventListener('install', function (event) {
        console.log('Service worker installing...');
        self.skipWaiting();
        event.waitUntil(
            caches.open('static')
                .then(function (cache) {
                    // cache.add('/');
                    // cache.add('/index.html');
                    // cache.add('/src/js/app.js');
                    cache.addAll([
                        '/',
                        '/precentage/cartridge',
                        '/storage',
                        '/floors',
                        '/admin',
                        'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js'
                    ]);
                })
        );
    });

    self.addEventListener('activate', function (event) {
        console.log('Service worker activating...');
    });

    // I'm a new service worker

    self.addEventListener('fetch', function (event) {
        console.log('Fetching:', event.request.url);

        event.respondWith(
            caches.match(event.request)
                .then(function (res) {
                    if (res) {
                        return res;
                    } else {
                        return fetch(event.request);
                    }
                })
        );
    });
})();
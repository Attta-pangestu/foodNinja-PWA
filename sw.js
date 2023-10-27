const STATIC_CHACHE_NAME = 'static-site-v4' ; 
const DYNAMIC_CHACHE_NAME = 'dynamix-site-v3' ; 

const assetCache = [
    '/', 
    './index.html', 
    '/pages/fallback.html',
    './css/styles.css',
    './css/materialize.min.css',
    './js/app.js', 
    './js/materialize.min.js', 
    './js/script.js',
    './img/dish.png',
    './js/firebase-app.js',
    './js/db.js',
    './js/ui.js',
    'https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js', 
    'https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore-compat.js',
    'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
]

const dynamicCache = [] ; 

// cache limit size 
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size)) ; 
            }
        })
    })
};

self.addEventListener('install', evt => {
    console.log('Menginstall Service Worker');
    evt.waitUntil(
        caches.open(STATIC_CHACHE_NAME).then(cache => {
            return cache.addAll(assetCache).catch(err => {
                console.error('Gagal menambahkan ke cache:', err);
            });
        })
    );
});


self.addEventListener('activate', evt => {
    console.log('activate service worker') ; 
    evt.waitUntil(
        caches.keys().then( keys => {
            return Promise.all(keys
                .filter( key => key !== STATIC_CHACHE_NAME && key !== DYNAMIC_CHACHE_NAME)
                .map(key => caches.delete(key)) 
                );
        })
    );
})

self.addEventListener('fetch', evt => {
    if (evt.request.url.indexOf('firestore.googleapis.com') === -1 && evt.request.url.startsWith('http')) {
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                if (cacheRes) {
                    return cacheRes;
                }
                return fetch(evt.request)
                    .then(fetchRes => {
                        return caches.open(DYNAMIC_CHACHE_NAME)
                            .then(cache => {
                                cache.put(evt.request.url, fetchRes.clone());
                                limitCacheSize(DYNAMIC_CHACHE_NAME, 15);
                                return fetchRes;
                            });
                    }).catch(err => {
                        console.log('error melakukan fetch', err);
                        return caches.match('/pages/fallback.html');  // Mengembalikan halaman fallback saat fetch gagal
                    });
            })
        );
    }
});

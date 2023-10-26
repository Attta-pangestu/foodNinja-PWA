const STATIC_CHACHE_NAME = 'static-site-v4' ; 
const DYNAMIC_CHACHE_NAME = 'dynamix-site-v3' ; 

const assetCache = [
    '/', 
    'index.html', 
    '/pages/fallback.html',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/js/app.js', 
    '/js/materialize.min.js', 
    '/js/script.js',
    '/img/dish.png',
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
            cache.addAll(assetCache) ; 
        } )
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
    // evt.respondWith(
    //     caches.match(evt.request)
    //     .then(cacheRes => {
    //         return cacheRes || fetch(evt.request)    
    //         .then(fetchRes => {
    //             return caches.open(DYNAMIC_CHACHE_NAME)
    //             .then(cache => {
    //                 cache.put(evt.request.url, fetchRes.clone())
    //                 // limit dynamic cache size
    //                 limitCacheSize(DYNAMIC_CHACHE_NAME, 15) ; 
    //                 return fetchRes; 
    //             }) 
    //             .catch(() => caches.match('/pages/fallback.html')); 
                
    //         });
    //     }) 
    //     .catch( () => caches.match('/pages/fallback.html') )
    // ); 
});
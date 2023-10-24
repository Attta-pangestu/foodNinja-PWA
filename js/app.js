if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js') 
    .then(() => console.log('Service Worker Didaftarkan !!'))
    .catch( () => console.log('Error Mendaftarkan Service Worker')) ; 
}
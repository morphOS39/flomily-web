var CACHE = 'flomily-pwa-v10';
var SHELL = ['/app/', '/app/app.css', '/app/app.js', '/app/manifest.json'];

self.addEventListener('install', function(e) {
    e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(SHELL); }));
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    e.waitUntil(caches.keys().then(function(keys) {
        return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
    }));
    self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    if (e.request.url.includes('/api/')) return;
    e.respondWith(caches.match(e.request).then(function(r) { return r || fetch(e.request); }));
});

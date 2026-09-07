const CACHE = 'amr-eye-static-v4';
self.addEventListener('install', event => {event.waitUntil(caches.open(CACHE).then(c=>c.add('/offline.html')).then(()=>self.skipWaiting()));});
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('amr-eye-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if(event.request.method !== 'GET' || url.origin !== self.location.origin) return;
 // Always fetch pages from the server so publication and access changes take effect.
 if(event.request.mode === 'navigate') { event.respondWith(fetch(event.request).catch(async () => (await caches.match('/offline.html')) || new Response('<!doctype html><meta name="viewport" content="width=device-width"><title>AMR-Eye offline</title><body style="background:#031018;color:#edfffb;font:18px system-ui;padding:32px"><h1>You are offline</h1><p>Reconnect to load the latest AMR-Eye demonstration.</p><button onclick="location.reload()">Try again</button></body>', {status:503,headers:{'Content-Type':'text/html'}}))); return; }
 if(!/\.(png|webp|svg|woff2?)$/.test(url.pathname)) return;
 event.respondWith(fetch(event.request).then(response => { if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}return response; }).catch(()=>caches.match(event.request).then(r=>r||Response.error())));
});

const CACHE='amreye-public-v7';
const OFFLINE=['/offline.html','/repository.json','/amr-eye-icon.png'];
async function refresh(){const c=await caches.open(CACHE);await Promise.all(OFFLINE.map(async path=>{const r=await fetch(path);if(r.ok)await c.put(path,r)}))}
self.addEventListener('install',e=>e.waitUntil(refresh().then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('amr')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 if(u.origin!==self.location.origin||e.request.method!=='GET'||u.pathname.startsWith('/admin')||u.pathname.startsWith('/api/'))return;
 if(OFFLINE.includes(u.pathname))e.respondWith(fetch(e.request).then(async r=>{if(r.ok){const c=await caches.open(CACHE);await c.put(u.pathname,r.clone())}return r}).catch(()=>caches.match(u.pathname)));
 else if(e.request.mode==='navigate'){
   e.waitUntil(refresh().catch(()=>{}));
   e.respondWith(fetch(e.request).catch(()=>caches.match('/offline.html')));
 }
});

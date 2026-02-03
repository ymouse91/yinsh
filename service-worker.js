/* Minimal SW: cache app shell */
const CACHE = "yinsh-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon192.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async()=>{
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k===CACHE)?null:caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  event.respondWith((async()=>{
    const cached = await caches.match(event.request, { ignoreSearch:true });
    if(cached) return cached;
    try{
      const res = await fetch(event.request);
      return res;
    }catch(e){
      // offline fallback
      return caches.match("./index.html");
    }
  })());
});

self.addEventListener("message", (event) => {
  if(event.data?.type === "SKIP_WAITING"){
    self.skipWaiting();
  }
});

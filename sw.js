const C='haccp-v2';
const SHELL=['./','index.html','manifest.webmanifest','firebase-config.js','icon-192.png','icon-512.png','pdf-lib.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>0)))));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))).then(()=>clients.claim())));
// Cache prima: l'app si apre subito anche con linea lenta o assente; in background si aggiorna.
self.addEventListener('fetch',e=>{const q=e.request,u=new URL(q.url);
 if(q.method!=='GET'||!(u.origin===location.origin||u.hostname==='www.gstatic.com'||u.hostname==='cdnjs.cloudflare.com'))return;
 e.respondWith((async()=>{const c=await caches.open(C);
  const hit=await c.match(q,{ignoreSearch:q.mode==='navigate'})||(q.mode==='navigate'?await c.match('index.html')||await c.match('./'):null);
  const net=fetch(q).then(r=>{if(r&&r.ok)c.put(q,r.clone());return r}).catch(()=>null);
  if(hit){e.waitUntil(net);return hit}
  return (await net)||new Response('',{status:504})})())});

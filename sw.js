// Rendash: funciona offline depois da primeira visita
const C = 'rendash-v2'
self.addEventListener('install', (e) => { self.skipWaiting() })
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))).then(() => self.clients.claim())) })
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url)
  if (e.request.method !== 'GET' || u.origin !== location.origin) return
  const page = e.request.mode === 'navigate' || u.pathname.endsWith('.html') || u.pathname.endsWith('.webmanifest')
  if (page) {
    e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(C).then((ca) => ca.put(e.request, c)); return r }).catch(() => caches.match(e.request).then((r) => r || caches.match('./'))))
    return
  }
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((r) => { if (r.ok) { const c = r.clone(); caches.open(C).then((ca) => ca.put(e.request, c)) } return r })))
})
self.addEventListener('notificationclick', (e) => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: 'window' }).then((cs) => cs.length ? cs[0].focus() : self.clients.openWindow('./?app=1'))) })

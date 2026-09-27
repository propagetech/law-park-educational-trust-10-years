// Service worker for the /event-duties app.
// The page registers it as /event-duties-sw.js?v=<build id>, so every deploy
// is a new worker and old caches are dropped on activate.
// Pages and data are network-first (a new deploy wins whenever there is
// signal); the cache only answers when the phone is offline.

const VERSION = new URL(self.location.href).searchParams.get('v') || 'dev'
const CACHE = `duties-${VERSION}`
const SHELL = [
  '/event-duties',
  '/event-duties.webmanifest',
  '/android-chrome-192x192.png',
  '/images/event-duties/lawpark-trust-logo.webp',
  '/images/event-duties/lawpark-trust-tree-icon.webp',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('duties-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request, { cache: 'no-store' })
    if (response.ok) cache.put(fallbackUrl || request, response.clone())
    return response
  } catch (err) {
    const cached = await cache.match(fallbackUrl || request)
    if (cached) return cached
    throw err
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (url.pathname === '/duties-version.json') return // always live
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, '/event-duties'))
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request)) // file names carry a content hash
  } else {
    event.respondWith(networkFirst(request))
  }
})

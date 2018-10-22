/**
 * Service worker entry point
 *
 * Be careful to only include necessary dependencies here
 */
import { bundleResponse } from './serviceworker/dataset.js'

const CACHE_NAME = 'openneuro'
const CACHE_PATHS = serviceWorkerOption.assets

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_PATHS)
    }),
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method === 'GET') {
    const url = new URL(event.request.url)
    if (url.pathname.startsWith('/crn') && url.pathname.endsWith('download')) {
      // Catch any aggregate download requests
      return event.respondWith(bundleResponse(url))
    } else {
      // Skip serving from cache for cross origin 'only-if-cached' requests
      if (
        event.request.cache === 'only-if-cached' &&
        event.request.mode !== 'same-origin'
      )
        return
      // Respond from cache, then the network
      event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(response => {
            return response || fetch(event.request)
          })
        }),
      )
    }
  }
})

/**
 * Service worker entry point
 *
 * Be careful to only include necessary dependencies here
 */
import packageJson from '../../package.json'
import { zipResponse } from './serviceworker/s3'
import config from '../../config'

const CACHE_NAME = `openneuro-${packageJson.version}`
const CACHE_PATHS = serviceWorkerOption.assets

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_PATHS)
    }),
  )
})

self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method === 'GET') {
    const url = new URL(event.request.url)
    const bucket = config.aws.s3.datasetBucket
    const bucketHostname = `${bucket}.s3.amazonaws.com`
    if (url.hostname.endsWith(bucketHostname)) {
      // Respond from the service worker
      const hostname = url.hostname
      const prefix = url.pathname.slice(1)
      return event.respondWith(zipResponse(hostname, prefix))
    } else {
      // Respond from cache, then the network
      return event.respondWith(
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request)
        }),
      )
    }
  }
})

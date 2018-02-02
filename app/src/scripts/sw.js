/**
 * Service worker entry point
 *
 * Be careful to only include necessary dependencies here
 */
import packageJson from '../../package.json'
import { zipResponse } from './serviceworker/s3'

const CACHE_NAME = `openneuro-${packageJson.version}`
const CACHE_PATHS = serviceWorkerOption.assets

self.addEventListener('install', event => {
  // TODO - remove console messages
  console.log('installed')
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
    const awsHostname = '.s3.amazonaws.com'
    if (url.hostname.endsWith(awsHostname)) {
      const hostname = url.hostname
      const prefix = url.pathname.slice(1)
      event.respondWith(zipResponse(hostname, prefix))
    } else {
      return
    }
  }
})

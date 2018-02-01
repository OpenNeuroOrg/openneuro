/**
 * Service worker entry point
 *
 * Be careful to only include necessary dependencies here
 */
import packageJson from '../../package.json'
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

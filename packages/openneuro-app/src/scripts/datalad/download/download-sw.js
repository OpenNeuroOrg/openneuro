import * as Sentry from '@sentry/browser'
import { downloadUri } from './download-uri.js'
import { trackDownload } from './track-download.js'

const startDownload = uri => {
  global.location.assign(uri)
}

// Verify environment dependencies for downloads
export const checkBrowserEnvironment = environment => {
  if (!('serviceWorker' in environment.navigator)) {
    throw new Error(
      'Your browser must support service workers to download. See the FAQ for supported browsers.',
    )
  } else if (typeof environment.ReadableStream === 'undefined') {
    throw new Error(
      'Web streams are required to download. Try a recent version of Chrome or see the FAQ for how to enable these features on Firefox.',
    )
  }
}

// Wait for the service worker to be ready and call next()
export const awaitRegistration = (next, environment) => registration =>
  new Promise((resolve, reject) => {
    if (registration.active) {
      // Service worker is already running as expected
      next()
    } else {
      // Waiting on the service worker
      if (registration.installing || registration.waiting) {
        environment.navigator.serviceWorker.addEventListener(
          'statechange',
          event => {
            if (event.target.state === 'active') {
              // Worker ready, start downloading
              environment.navigator.serviceWorker.removeEventListener(
                'statechange',
                this,
                true,
              )
              next()
            }
          },
        )
      } else {
        reject(
          new Error(
            'Download failed, please refresh and try again in a few moments.',
          ),
        )
      }
    }
  })

/**
 * Event handler for initiating dataset or snapshot downloads
 * @param {string} datasetId Accession number string for a dataset
 */
export const downloadClick = (datasetId, snapshotTag) => () => {
  // Check that a service worker is registered
  try {
    checkBrowserEnvironment(global)
  } catch (e) {
    global.alert(e.message)
  }
  // Create a closure for download path, datasetId, and optional tag
  const next = () => {
    startDownload(downloadUri(datasetId, snapshotTag))
    trackDownload(datasetId, snapshotTag)
  }
  // Check for a running service worker
  global.navigator.serviceWorker
    .getRegistration()
    .then(awaitRegistration(next, global))
    .catch(err => {
      Sentry.captureException(err)
    })
}

/* eslint-disable no-console */
import * as Sentry from '@sentry/browser'
import React from 'react'
import PropTypes from 'prop-types'
import { event } from 'react-ga'
import config from '../../../../config.js'
import datalad from '../../utils/datalad'

const startDownload = uri => {
  global.location.assign(uri)
}

const trackDownload = (datasetId, snapshotTag) => {
  event({
    category: 'Download',
    action: 'Started web download',
    label: snapshotTag ? `${datasetId}:${snapshotTag}` : datasetId,
  })
  datalad.trackAnalytics(datasetId, {
    snapshot: true,
    tag: snapshotTag,
    type: 'downloads',
  })
}

export const downloadUri = (datasetId, snapshotTag) =>
  // This can't be a GraphQL query since it is intercepted
  // by the service worker
  snapshotTag
    ? `${config.crn.url}datasets/${datasetId}/snapshots/${snapshotTag}/download`
    : `${config.crn.url}datasets/${datasetId}/download`

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
const downloadClick = (datasetId, snapshotTag) => () => {
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

/**
 * Generate a magic bundle link for this dataset
 */
const DownloadLink = ({ datasetId, snapshotTag }) => (
  <div>
    <h4>Download with your browser</h4>
    <p>
      This method is convenient and best for smaller datasets and with a good
      internet connection.
    </p>
    <button
      className="btn-blue"
      onClick={downloadClick(datasetId, snapshotTag)}>
      <i className={'fa fa-download'} /> Download
    </button>
  </div>
)

DownloadLink.propTypes = {
  datasetId: PropTypes.string.isRequired,
  snapshotTag: PropTypes.string,
}

export default DownloadLink

/* eslint-disable no-console */
import React from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../../common/forms/warn-button.jsx'
import config from '../../../../config.js'
import datalad from '../../utils/datalad'

const startDownload = uri => {
  global.location.assign(uri)
}
const trackDownload = (datasetId, snapshotTag) => {
  datalad.trackAnalytics(datasetId, {
    snapshot: true,
    tag: snapshotTag,
    type: 'downloads',
  })
}

/**
 * Event handler for initiating dataset or snapshot downloads
 * @param {string} datasetId Accession number string for a dataset
 */
const downloadClick = (datasetId, snapshotTag) => callback => {
  // This can't be a GraphQL query since it is intercepted
  // by the service worker
  const uri = snapshotTag
    ? `${config.crn.url}datasets/${datasetId}/snapshots/${snapshotTag}/download`
    : `${config.crn.url}datasets/${datasetId}/download`
  // Check that a service worker is registered
  if (!('serviceWorker' in global.navigator)) {
    global.alert(
      'Your browser must support service workers to download. See the FAQ for supported browsers.',
    )
    callback()
  } else if (typeof global.ReadableStream === 'undefined') {
    // This is likely Firefox with flags disabled
    global.alert(
      'Web streams are required to download. Try a recent version of Chrome or see the FAQ for how to enable these features on Firefox.',
    )
    callback()
  } else {
    // Check for a running service worker
    global.navigator.serviceWorker.getRegistration().then(registration => {
      if (registration.active) {
        // Service worker is already running as expected
        startDownload(uri)
        trackDownload(datasetId, snapshotTag)
        callback()
      } else {
        // Waiting on the service worker
        if (registration.installing || registration.waiting) {
          global.navigator.serviceWorker.addEventListener(
            'statechange',
            function(e) {
              if (e.target.state === 'active') {
                // Worker ready, start downloading
                global.navigator.serviceWorker.removeEventListener(
                  'statechange',
                  this,
                  true,
                )
                startDownload(uri)
                trackDownload(datasetId, snapshotTag)
                callback()
              }
            },
          )
        } else {
          global.alert(
            'Download failed, please refresh and try again in a few moments.',
          )
          callback()
        }
      }
    })
  }
}

/**
 * Generate a magic bundle link for this dataset
 */
const DownloadLink = ({ datasetId, snapshotTag }) => (
  <div role="presentation" className="tool">
    <WarnButton
      tooltip="Download"
      icon="fa-download"
      warn={false}
      action={downloadClick(datasetId, snapshotTag)}
    />
  </div>
)

DownloadLink.propTypes = {
  datasetId: PropTypes.string.isRequired,
  snapshotTag: PropTypes.string,
}

export default DownloadLink

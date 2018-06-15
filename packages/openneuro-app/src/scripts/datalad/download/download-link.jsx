import React from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../../common/forms/warn-button.jsx'
import config from '../../../../config.js'

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
  const serviceWorker = global.navigator.serviceWorker.controller
  if (serviceWorker && serviceWorker.scriptURL.startsWith(config.crn.url)) {
    global.open(uri, `${datasetId} download`)
  } else {
    // Something has gone wrong with the service worker
    // or the browser does not support it
    global.alert(
      'An error was encountered with this download. Please try again or upgrade to a newer supported browser.',
    )
  }
  // Finish the WarnButton loading state.
  callback()
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

import React from 'react'
import PropTypes from 'prop-types'
import { downloadNative } from './download-native.js'
import { downloadClick } from './download-sw.js'

const DownloadLinkNative = ({ datasetId, snapshotTag }) => (
  <div>
    <h4>Download with your browser</h4>
    <p>
      This method is convenient and allows you to select a local directory to
      download the dataset to. Existing files will not be downloaded if you
      select an existing directory.
    </p>
    <button
      className="btn-blue"
      onClick={downloadNative(datasetId, snapshotTag)}>
      <i className={'fa fa-download'} /> Download
    </button>
  </div>
)

DownloadLinkNative.propTypes = {
  datasetId: PropTypes.string.isRequired,
  snapshotTag: PropTypes.string,
}

const DownloadLinkServiceWorker = ({ datasetId, snapshotTag }) => (
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

DownloadLinkServiceWorker.propTypes = {
  datasetId: PropTypes.string.isRequired,
  snapshotTag: PropTypes.string,
}

/**
 * Generate a magic bundle link for this dataset
 */
const DownloadLink = ({ datasetId, snapshotTag }) =>
  'chooseFileSystemEntries' in window ? (
    <DownloadLinkNative datasetId={datasetId} snapshotTag={snapshotTag} />
  ) : (
    <DownloadLinkServiceWorker
      datasetId={datasetId}
      snapshotTag={snapshotTag}
    />
  )

DownloadLink.propTypes = {
  datasetId: PropTypes.string.isRequired,
  snapshotTag: PropTypes.string,
}

export default DownloadLink

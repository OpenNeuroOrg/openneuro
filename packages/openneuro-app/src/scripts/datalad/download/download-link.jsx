import React from 'react'
import PropTypes from 'prop-types'
import { downloadNative } from './download-native.js'
import { downloadClick } from './download-sw.js'

const DownloadLinkNative = ({ datasetId, snapshotTag }) => (
  <div>
    <h4>Download with your browser</h4>
    <p>
      This method is convenient and allows you to select a local directory to
      download the dataset to.
    </p>
    <h5>Steps</h5>
    <ol>
      <li>
        Select a local directory to save the dataset and grant permission to
        OpenNeuro to read and write into this directory.
      </li>
      <li>
        Download will run in the background, please leave the site open while
        downloading.
      </li>
      <li>A notification will appear when complete.</li>
    </ol>
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
    <p>
      Firefox has known issues with this method, please try the CLI or DataLad
      download methods if your cannot complete a download with Firefox.
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

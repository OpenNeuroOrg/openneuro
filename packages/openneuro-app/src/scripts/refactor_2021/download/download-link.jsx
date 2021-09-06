import React from 'react'
import PropTypes from 'prop-types'
import { downloadNative } from './download-native.js'
import { useApolloClient } from '@apollo/client'

const DownloadLink = ({ datasetId, snapshotTag }) => {
  const client = useApolloClient()
  return (
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
        onClick={downloadNative(datasetId, snapshotTag, client)}>
        <i className={'fa fa-download'} /> Download
      </button>
    </div>
  )
}

DownloadLink.propTypes = {
  datasetId: PropTypes.string.isRequired,
  snapshotTag: PropTypes.string,
}

export default DownloadLink

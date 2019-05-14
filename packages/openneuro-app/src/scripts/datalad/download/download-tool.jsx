import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import WarnButton from '../../common/forms/warn-button.jsx'

/**
 * Produce redirect function for this router, dataset, and snapshot
 * @param {object} history React router history object
 * @param {string} datasetId Accession number string
 * @param {string} snapshotTag Optional snapshot tag to redirect to
 * @returns {function}
 */
const downloadRedirect = (history, datasetId, snapshotTag) => callback => {
  snapshotTag
    ? history.push(`/datasets/${datasetId}/versions/${snapshotTag}/download`)
    : history.push(`/datasets/${datasetId}/download`)

  callback()
}

/**
 * Toolbar component to redirect to download modal page
 */
const DownloadTool = ({ datasetId, snapshotTag, history }) => (
  <div role="presentation" className="tool">
    <WarnButton
      tooltip="Download"
      icon="fa-download"
      warn={false}
      action={downloadRedirect(history, datasetId, snapshotTag)}
    />
  </div>
)

DownloadTool.propTypes = {
  history: PropTypes.object,
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default withRouter(DownloadTool)

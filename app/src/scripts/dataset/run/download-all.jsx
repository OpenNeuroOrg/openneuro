import React from 'react'
import WarnButton from '../../common/forms/warn-button.jsx'
import actions from '../dataset.actions'

const DownloadAll = ({ datasetId, snapshotId, type = 'results' }) => {
  return (
    <span className="download-all">
      <WarnButton
        icon="fa-download"
        message=" DOWNLOAD All"
        prepDownload={actions.getResultDownloadTicket.bind(
          this,
          snapshotId,
          datasetId,
          { path: 'all-' + type },
        )}
      />
    </span>
  )
}

export default DownloadAll

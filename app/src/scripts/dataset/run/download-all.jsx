import React from 'react'
import WarnButton from '../../common/forms/warn-button.jsx'
import DownloadS3 from './download-s3.jsx'
import actions from '../dataset.actions'

const DownloadAll = ({ run, type = 'results' }) => {
  return (
    <span className="download-all">
      <WarnButton
        icon="fa-download"
        message=" DOWNLOAD All"
        prepDownload={actions.getResultDownloadTicket.bind(
          this,
          run.snapshotId,
          run._id,
          { path: 'all-' + type },
        )}
      />
      <DownloadS3
        datasetHash={run.datasetHash}
        analysisId={run.analysis.analysisId}
      />
    </span>
  )
}

export default DownloadAll

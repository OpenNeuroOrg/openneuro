import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Panel } from 'react-bootstrap'
import DownloadLink from './download-link.jsx'
import DownloadS3 from './download-s3.jsx'
import DownloadCommandLine from './download-command-line.jsx'
import DownloadDatalad from './download-datalad.jsx'

const DownloadDataset = ({
  match: {
    // snapshotId is widely used but snapshotTag is more accurate
    params: { datasetId, snapshotId: snapshotTag },
  },
}) => (
  <div className="dataset-form">
    <div className="col-xs-12 dataset-form-header">
      <div className="form-group">
        <label>How to Download</label>
      </div>
      <hr className="modal-inner" />
    </div>
    <div className="dataset-form-body col-xs-12">
      <div className="dataset-form-content col-xs-12">
        <DownloadLink datasetId={datasetId} snapshotTag={snapshotTag} />
        <hr className="modal-inner" />
        <DownloadS3 datasetId={datasetId} />
        <hr className="modal-inner" />
        <Panel header="Advanced Methods" collapsible>
          <DownloadCommandLine
            datasetId={datasetId}
            snapshotTag={snapshotTag}
          />
          <DownloadDatalad datasetId={datasetId} />
        </Panel>
      </div>
    </div>
  </div>
)

DownloadDataset.propTypes = {
  match: PropTypes.object,
}

export default withRouter(DownloadDataset)

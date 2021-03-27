/* global globalThis */
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import styled from '@emotion/styled'
import DownloadLink from './download-link.jsx'
import DownloadS3 from './download-s3.jsx'
import DownloadCommandLine from './download-command-line.jsx'
import DownloadDatalad from './download-datalad.jsx'

const PaddedDiv = styled.div`
  padding: 1em;
`

const DownloadDataset = ({
  match: {
    // snapshotId is widely used but snapshotTag is more accurate
    params: { datasetId, snapshotId: snapshotTag },
  },
}) => (
  <div>
    <div className="col-xs-12">
      <h3>How to Download</h3>
      <hr className="modal-inner" />
    </div>
    <div className="col-xs-12">
      <PaddedDiv className="col-xs-6">
        {'showDirectoryPicker' in globalThis ? (
          <DownloadLink datasetId={datasetId} snapshotTag={snapshotTag} />
        ) : (
          <DownloadCommandLine
            datasetId={datasetId}
            snapshotTag={snapshotTag}
          />
        )}
      </PaddedDiv>
      <PaddedDiv className="col-xs-6">
        <DownloadS3 datasetId={datasetId} />
      </PaddedDiv>
    </div>
    <div className="col-xs-12">
      {'showDirectoryPicker' in globalThis && (
        <PaddedDiv className="col-xs-6">
          <DownloadCommandLine
            datasetId={datasetId}
            snapshotTag={snapshotTag}
          />
        </PaddedDiv>
      )}
      <PaddedDiv className="col-xs-6">
        <DownloadDatalad datasetId={datasetId} />
      </PaddedDiv>
    </div>
  </div>
)

DownloadDataset.propTypes = {
  match: PropTypes.object,
}

export default withRouter(DownloadDataset)

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
    <div className="container">
      <div className="grid grid-between">
        <div className="col col-12">
          <h3>How to Download</h3>
        </div>
        <div className="col ">
          {'showDirectoryPicker' in globalThis ? (
            <DownloadLink datasetId={datasetId} snapshotTag={snapshotTag} />
          ) : (
            <DownloadCommandLine
              datasetId={datasetId}
              snapshotTag={snapshotTag}
            />
          )}
        </div>
        <div className="col ">
          <DownloadS3 datasetId={datasetId} />
        </div>
      </div>
      <hr />
      <div className="grid grid-between">
        {'showDirectoryPicker' in globalThis && (
          <div className="col">
            <DownloadCommandLine
              datasetId={datasetId}
              snapshotTag={snapshotTag}
            />
          </div>
        )}
        <div className="col">
          <DownloadDatalad datasetId={datasetId} />
        </div>
      </div>
    </div>
  </div>
)

DownloadDataset.propTypes = {
  match: PropTypes.object,
}

export default withRouter(DownloadDataset)

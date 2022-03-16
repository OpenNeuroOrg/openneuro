/* global globalThis */
import React from 'react'
import PropTypes from 'prop-types'
import { Link, useRouteMatch } from 'react-router-dom'
import DownloadLink from '../download/download-link.jsx'
import DownloadS3 from '../download/download-s3.jsx'
import DownloadCommandLine from '../download/download-command-line.jsx'
import DownloadDatalad from '../download/download-datalad.jsx'

interface SnapshotRouteParams {
  datasetId?: string
  snapshotId?: string
}

const DownloadDataset = ({ worker, datasetPermissions }) => {
  const {
    params: { datasetId, snapshotId: snapshotTag },
  } = useRouteMatch<SnapshotRouteParams>()
  const workerId = worker?.split('-').pop()
  return (
    <div>
      <div className="container">
        <div className="grid grid-between">
          <div className="col col-12">
            <h3>How to Download</h3>
          </div>
          <div className="col col-lg">
            {'showDirectoryPicker' in globalThis ? (
              <DownloadLink datasetId={datasetId} snapshotTag={snapshotTag} />
            ) : (
              <DownloadCommandLine
                datasetId={datasetId}
                snapshotTag={snapshotTag}
              />
            )}
          </div>
          <div className="col col-lg">
            <DownloadS3 datasetId={datasetId} />
          </div>
        </div>
        <hr />
        <div className="grid grid-between">
          {'showDirectoryPicker' in globalThis && (
            <div className="col col-lg">
              <DownloadCommandLine
                datasetId={datasetId}
                snapshotTag={snapshotTag}
              />
            </div>
          )}
          <div className="col col-lg">
            <DownloadDatalad
              datasetId={datasetId}
              workerId={workerId}
              datasetPermissions={datasetPermissions}
            />
          </div>
        </div>
        <div className="grid grid-between">
          <div className="col">
            <Link className="return-link m-l-0" to={`/datasets/${datasetId}`}>
              Return to Dataset
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

DownloadDataset.propTypes = {
  worker: PropTypes.string,
  datasetPermissions: PropTypes.object,
}

export default DownloadDataset

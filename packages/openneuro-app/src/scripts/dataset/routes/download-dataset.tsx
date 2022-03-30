/* global globalThis */
import React from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch } from 'react-router-dom'
import DownloadLink from '../download/download-link.jsx'
import DownloadS3 from '../download/download-s3.jsx'
import DownloadCommandLine from '../download/download-command-line.jsx'
import DownloadDatalad from '../download/download-datalad.jsx'
import { DatasetPageBorder } from './styles/dataset-page-border'
import { HeaderRow3 } from './styles/header-row'

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
    <DatasetPageBorder>
      <HeaderRow3>How to Download</HeaderRow3>
      <div className="grid grid-between">
        {'showDirectoryPicker' in globalThis ? (
          <DownloadLink datasetId={datasetId} snapshotTag={snapshotTag} />
        ) : (
          <DownloadCommandLine
            datasetId={datasetId}
            snapshotTag={snapshotTag}
          />
        )}
        <DownloadS3 datasetId={datasetId} />
      </div>
      {'showDirectoryPicker' in globalThis && (
        <DownloadCommandLine datasetId={datasetId} snapshotTag={snapshotTag} />
      )}
      <DownloadDatalad
        datasetId={datasetId}
        workerId={workerId}
        datasetPermissions={datasetPermissions}
      />
    </DatasetPageBorder>
  )
}

DownloadDataset.propTypes = {
  worker: PropTypes.string,
  datasetPermissions: PropTypes.object,
}

export default DownloadDataset

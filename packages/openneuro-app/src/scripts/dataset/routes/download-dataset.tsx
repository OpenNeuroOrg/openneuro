/* global globalThis */
import React from "react"
import PropTypes from "prop-types"
import { Navigate, useParams } from "react-router-dom"
import DownloadLink from "../download/download-link.jsx"
import DownloadS3 from "../download/download-s3.jsx"
import DownloadCommandLine from "../download/download-command-line.jsx"
import DownloadDatalad from "../download/download-datalad.jsx"
import { DatasetPageBorder } from "./styles/dataset-page-border"
import { HeaderRow3 } from "./styles/header-row"
import { DownloadScript } from "../download/download-script"
import { useLocalStorage } from "../../utils/local-storage"
import { STORAGE_KEY } from "../../components/agreement"

const DownloadDataset = ({ worker, datasetPermissions }) => {
  const { datasetId, tag: snapshotTag } = useParams()
  const [agreed, setAgreed] = useLocalStorage(STORAGE_KEY, false)
  // If the download page is directly visited without the agreement, return to the dataset page
  if (!agreed) {
    return <Navigate to={`/datasets/${datasetId}`} replace={true} />
  }
  const workerId = worker?.split("-").pop()
  return (
    <DatasetPageBorder>
      <HeaderRow3>How to Download</HeaderRow3>
      <div className="grid grid-between">
        {"showDirectoryPicker" in globalThis
          ? <DownloadLink datasetId={datasetId} snapshotTag={snapshotTag} />
          : (
            <DownloadCommandLine
              datasetId={datasetId}
              snapshotTag={snapshotTag}
            />
          )}
        <DownloadS3 datasetId={datasetId} />
      </div>
      {"showDirectoryPicker" in globalThis && (
        <DownloadCommandLine datasetId={datasetId} snapshotTag={snapshotTag} />
      )}
      <DownloadDatalad
        datasetId={datasetId}
        workerId={workerId}
        datasetPermissions={datasetPermissions}
      />
      <DownloadScript datasetId={datasetId} snapshotTag={snapshotTag} />
    </DatasetPageBorder>
  )
}

DownloadDataset.propTypes = {
  worker: PropTypes.string,
  datasetPermissions: PropTypes.object,
}

export default DownloadDataset

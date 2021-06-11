import React from 'react'
import bytes from 'bytes'

export interface DatasetHeaderMetaProps {
  datasetId: string
  totalFiles: number
  size: number
}

export const DatasetHeaderMeta: React.FC<DatasetHeaderMetaProps> = ({
  datasetId,
  totalFiles,
  size,
}) => {
  return (
    <div className="dataset-header-meta">
      <span>OpenNeuro Accession Number:</span> {datasetId}
      <span>Files:</span> {totalFiles}
      <span>Size:</span> {bytes(size)}
    </div>
  )
}

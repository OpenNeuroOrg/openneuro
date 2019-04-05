import React from 'react'

const File = ({ datasetId, path, filename, snapshotTag = null }) => {
  const snapshotPath = snapshotTag ? `/snapshots/${snapshotTag}` : ''
  return (
    <>
      {filename}
      <span className="filetree-editfile">
        <span className="download-file">
          <a
            href={`/crn/datasets/${datasetId}${snapshotPath}/files/${(path &&
              path + ':') ||
              ''}${filename}`}
            download>
            Download
          </a>
        </span>
        <span className="view-file">View</span>
      </span>
    </>
  )
}

export default File

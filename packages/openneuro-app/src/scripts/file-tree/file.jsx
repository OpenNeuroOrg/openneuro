import React from 'react'
import PropTypes from 'prop-types'

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

File.propTypes = {
  datasetId: PropTypes.string,
  path: PropTypes.string,
  filename: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default File

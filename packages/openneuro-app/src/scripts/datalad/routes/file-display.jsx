import React from 'react'
import PropTypes from 'prop-types'
import FileView from '../../file-tree/file-view.jsx'
import { apiPath } from '../../file-tree/file.jsx'

/**
 * Create dataset -> dir -> filename breadcrumbs
 */
export const FileDisplayBreadcrumb = ({ filePath }) => {
  const tokens = filePath.split(':')
  return (
    <>
      {tokens.map((token, index) => {
        if (token === tokens.slice(-1)) {
          return (
            <span className="display-file" key={index}>
              {' '}
              <i className="fa fa-file-o" /> {token}
            </span>
          )
        } else {
          return (
            <span className="display-file" key={index}>
              {' '}
              <i className="fa fa-folder-open-o" /> {token}
            </span>
          )
        }
      })}
    </>
  )
}

FileDisplayBreadcrumb.propTypes = {
  filePath: PropTypes.string,
}

const FileDisplay = ({ datasetId, snapshotTag = null, filePath }) => (
  <div className="dataset-form">
    <div className="col-xs-12">
      <span className="ds-primary display-file-path">
        {datasetId}
        <FileDisplayBreadcrumb filePath={filePath} />
      </span>
      <div className="form-group modal-title">
        <label>{filePath.split(':').slice(-1)}</label>
        <div className="modal-download btn-admin-blue">
          <a href={apiPath(datasetId, snapshotTag, filePath)} download>
            Download
          </a>
        </div>
      </div>
      <FileView
        datasetId={datasetId}
        snapshotTag={snapshotTag}
        path={filePath}
      />
    </div>
  </div>
)

FileDisplay.propTypes = {
  datasetId: PropTypes.string,
  filePath: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default FileDisplay

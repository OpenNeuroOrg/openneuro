import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import FileView from './file-view.jsx'
import { apiPath } from './file'
import styled from '@emotion/styled'
import { Media } from '../../styles/media'

const PathBreadcrumb = styled.div`
  font-size: 14px;
  margin-bottom: 15px;
  color: #333;
  text-transform: uppercase;
  h2 {
    margin-bottom: 10px;
  }
  .display-file {
    margin-right: 10px;
  }
`

/**
 * Create dataset -> dir -> filename breadcrumbs
 */
export const FileDisplayBreadcrumb = ({ filePath }) => {
  const tokens = filePath.split(':')
  return (
    <>
      {tokens.map((token, index) => {
        if (token === tokens.slice(-1)[0]) {
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
  <div className="dataset-form display-file container">
    <div className="grid display-file-content">
      <div className="display-file-header col col-12">
        <div className="form-group modal-title">
          <span className="ds-primary display-file-path">
            <PathBreadcrumb>
              <h2>{datasetId}</h2>
              <FileDisplayBreadcrumb filePath={filePath} />
            </PathBreadcrumb>
          </span>
          <Media greaterThanOrEqual="medium">
            <div className="modal-download btn-admin-blue">
              <a href={apiPath(datasetId, snapshotTag, filePath)} download>
                <i className="fa fa-download" /> Download
              </a>
              <Link className="return-link" to={`/datasets/${datasetId}`}>
                Return to dataset
              </Link>
            </div>
          </Media>
          <hr />
        </div>
      </div>
      <div className="col col-12  display-file-body">
        <FileView
          datasetId={datasetId}
          snapshotTag={snapshotTag}
          path={filePath}
        />
      </div>
    </div>
  </div>
)

FileDisplay.propTypes = {
  datasetId: PropTypes.string,
  filePath: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default FileDisplay

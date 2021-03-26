import React from 'react'
import PropTypes from 'prop-types'
import FileView from '../../file-tree/file-view.jsx'
import { apiPath } from '../../file-tree/file.jsx'
import styled from '@emotion/styled'
import { Media } from '../../styles/media'

const PathBreadcrumb = styled.span`
  font-size: 18px;
  color: #777;
  text-transform: uppercase;
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
  <div className="dataset-form display-file">
    <div className="col-xs-12 display-file-content">
      <div className="display-file-header">
        <div className="form-group modal-title">
          <span className="ds-primary display-file-path">
            <PathBreadcrumb>
              {datasetId}
              <FileDisplayBreadcrumb filePath={filePath} />
            </PathBreadcrumb>
          </span>
          <Media greaterThanOrEqual="medium">
            <div className="modal-download btn-admin-blue">
              <a href={apiPath(datasetId, snapshotTag, filePath)} download>
                <i className="fa fa-download" /> Download
              </a>
            </div>
          </Media>
          <hr />
        </div>
      </div>
      <div className="display-file-body">
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

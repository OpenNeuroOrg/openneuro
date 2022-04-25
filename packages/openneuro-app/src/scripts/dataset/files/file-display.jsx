import React from 'react'
import PropTypes from 'prop-types'
import FileView from './file-view.jsx'
import { apiPath } from './file'
import styled from '@emotion/styled'
import { Media } from '../../styles/media'
import { DatasetPageBorder } from '../routes/styles/dataset-page-border'

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
  <DatasetPageBorder className="dataset-form display-file">
    <PathBreadcrumb>
      <FileDisplayBreadcrumb filePath={filePath} />
    </PathBreadcrumb>
    <div className="display-file-body">
      <FileView
        datasetId={datasetId}
        snapshotTag={snapshotTag}
        path={filePath}
      />
    </div>

    <Media greaterThanOrEqual="medium">
      <hr />
      <div className="modal-download btn-admin-blue">
        <a href={apiPath(datasetId, snapshotTag, filePath)} download>
          <i className="fa fa-download" /> Download
        </a>
      </div>
    </Media>
  </DatasetPageBorder>
)

FileDisplay.propTypes = {
  datasetId: PropTypes.string,
  filePath: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default FileDisplay

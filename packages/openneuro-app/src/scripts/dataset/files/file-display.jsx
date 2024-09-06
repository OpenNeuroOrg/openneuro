import React, { useContext } from "react"
import PropTypes from "prop-types"
import { useParams } from "react-router-dom"
import FileView from "./file-view.jsx"
import { apiPath } from "./file"
import styled from "@emotion/styled"
import { Media } from "../../styles/media"
import { DatasetPageBorder } from "../routes/styles/dataset-page-border"
import DatasetQueryContext from "../../datalad/dataset/dataset-query-context"
import { fetchMoreDirectory } from "./file-tree-unloaded-directory.jsx"
import { Loading } from "@openneuro/components/loading"

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
  const tokens = filePath.split(":")
  return (
    <>
      {tokens.map((token, index) => {
        if (token === tokens.slice(-1)[0]) {
          return (
            <span className="display-file" key={index}>
              {" "}
              <i className="fa fa-file-o" /> {token}
            </span>
          )
        } else {
          return (
            <span className="display-file" key={index}>
              {" "}
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

const FileDisplay = ({ dataset, snapshotTag = null, filePath }) => {
  const { fetchMore } = useContext(DatasetQueryContext)
  const files = snapshotTag ? dataset.files : dataset.draft.files
  const datasetFile = files.find((file) => file.filename === filePath)
  // If no file matches, we are missing data, load the next missing parent
  if (!datasetFile) {
    const components = filePath.split(":")
    for (let i = components.length; i > 0; i--) {
      const path = components.slice(0, i).join(":")
      const file = files.find((file) => file.filename === path)
      if (file && file.directory) {
        fetchMoreDirectory(fetchMore, dataset.id, snapshotTag, file)
        break
      }
    }
    return (
      <DatasetPageBorder className="dataset-form display-file">
        <PathBreadcrumb>
          <FileDisplayBreadcrumb filePath={filePath} />
        </PathBreadcrumb>
        <Loading />
      </DatasetPageBorder>
    )
  } else {
    const url = datasetFile?.urls?.[0] ||
      apiPath(dataset.id, snapshotTag, filePath)
    return (
      <DatasetPageBorder className="dataset-form display-file">
        <PathBreadcrumb>
          <FileDisplayBreadcrumb filePath={filePath} />
        </PathBreadcrumb>
        <div className="display-file-body">
          <FileView
            url={url}
            path={filePath}
          />
        </div>

        <Media greaterThanOrEqual="medium">
          <hr />
          <div className="modal-download btn-admin-blue">
            <a href={url} download>
              <i className="fa fa-download" /> Download
            </a>
          </div>
        </Media>
      </DatasetPageBorder>
    )
  }
}

FileDisplay.propTypes = {
  datasetId: PropTypes.string,
  filePath: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export const FileDisplayRoute = ({ dataset, snapshotTag }) => {
  return (
    <FileDisplay
      dataset={dataset}
      snapshotTag={snapshotTag}
      {...useParams()}
    />
  )
}

FileDisplayRoute.propTypes = {
  datasetId: PropTypes.string,
  snapshotTag: PropTypes.string,
}

export default FileDisplay

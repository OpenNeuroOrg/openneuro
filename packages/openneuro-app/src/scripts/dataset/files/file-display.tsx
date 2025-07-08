import React, { useContext } from "react"
import { useParams } from "react-router-dom"
import FileView from "./file-view.jsx"
import { apiPath } from "./file"
import styled from "@emotion/styled"
import { Media } from "../../styles/media"
import { DatasetPageBorder } from "../routes/styles/dataset-page-border"
import DatasetQueryContext from "../../datalad/dataset/dataset-query-context"
import { fetchMoreDirectory } from "./file-tree-unloaded-directory.jsx"
import { Loading } from "../../components/loading/Loading"

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

interface FileDisplayBreadcrumbProps {
  filePath: string
}

/**
 * Create dataset -> dir -> filename breadcrumbs
 */
export const FileDisplayBreadcrumb = (
  { filePath }: FileDisplayBreadcrumbProps,
) => {
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

interface FileDisplayFileArray {
  filename: string
  directory: boolean
  urls: string[]
}

interface FileDisplayProps {
  datasetId: string
  files: FileDisplayFileArray[]
  snapshotTag?: string
  filePath?: string
}

const FileDisplay = (
  { datasetId, files, snapshotTag = null, filePath }: FileDisplayProps,
) => {
  const { fetchMore } = useContext(DatasetQueryContext)
  const datasetFile = files.find((file) => file.filename === filePath)
  // If no file matches, we are missing data, load the next missing parent
  if (!datasetFile) {
    const components = filePath.split(":")
    for (let i = components.length; i > 0; i--) {
      const path = components.slice(0, i).join(":")
      const file = files.find((file) => file.filename === path)
      if (file && file.directory) {
        fetchMoreDirectory(fetchMore, datasetId, snapshotTag, file)
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
      apiPath(datasetId, snapshotTag, filePath)
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

interface FileDisplayRouteProps {
  datasetId: string
  files: FileDisplayFileArray[]
  snapshotTag?: string
}

export const FileDisplayRoute = (
  { datasetId, files, snapshotTag }: FileDisplayRouteProps,
) => {
  return (
    <FileDisplay
      datasetId={datasetId}
      files={files}
      snapshotTag={snapshotTag}
      {...useParams()}
    />
  )
}

export default FileDisplay

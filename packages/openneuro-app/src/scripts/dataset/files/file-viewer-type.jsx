import React, { Suspense } from "react"
import PropTypes from "prop-types"
import { Loading } from "../../components/loading/Loading"
import { isNifti } from "./file-types"

const FileViewerText = React.lazy(() =>
  import("./viewers/file-viewer-text.jsx")
)
const FileViewerNifti = React.lazy(() => import("./viewers/file-viewer-nifti"))
const FileViewerJson = React.lazy(() =>
  import("./viewers/file-viewer-json.jsx")
)
const FileViewerTsv = React.lazy(() => import("./viewers/file-viewer-tsv.jsx"))
const FileViewerCsv = React.lazy(() => import("./viewers/file-viewer-csv.jsx"))
const FileViewerHtml = React.lazy(() =>
  import("./viewers/file-viewer-html.jsx")
)
const FileViewerMarkdown = React.lazy(() =>
  import("./viewers/file-viewer-markdown")
)
const FileViewerNeurosift = React.lazy(() =>
  import("./viewers/file-viewer-neurosift").then((module) => ({
    default: module.FileViewerNeurosift,
  }))
)

/**
 * Choose the right viewer for each file type
 */
const FileViewerType = ({ path, url, data }) => {
  const viewer = (() => {
    if (
      path.endsWith("README") ||
      path.endsWith("CHANGES") ||
      path.endsWith(".bidsignore") ||
      path.endsWith(".gitignore") ||
      path.endsWith(".txt") ||
      path.endsWith(".rst") ||
      path.endsWith(".yml") ||
      path.endsWith(".yaml")
    ) {
      return <FileViewerText data={data} />
    } else if (isNifti(path)) {
      return <FileViewerNifti imageUrl={url} />
    } else if (path.endsWith(".md")) {
      return <FileViewerMarkdown data={data} />
    } else if (path.endsWith(".json")) {
      return <FileViewerJson data={data} />
    } else if (path.endsWith(".tsv")) {
      return <FileViewerTsv data={data} />
    } else if (path.endsWith(".csv")) {
      return <FileViewerCsv data={data} />
    } else if (path.endsWith(".html")) {
      return <FileViewerHtml data={data} />
    } else if (path.endsWith(".edf")) {
      return <FileViewerNeurosift url={url} filetype="edf" />
    } else if (path.endsWith(".nwb")) {
      return <FileViewerNeurosift url={url} filetype="nwb" />
    } else {
      return (
        <div className="file-viewer-fallback">
          This file must be downloaded to view it.
        </div>
      )
    }
  })()
  return <Suspense fallback={<Loading />}>{viewer}</Suspense>
}

FileViewerType.propTypes = {
  path: PropTypes.string,
  url: PropTypes.string,
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerType

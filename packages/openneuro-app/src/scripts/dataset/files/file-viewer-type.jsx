import React from "react"
import PropTypes from "prop-types"
import FileViewerText from "./viewers/file-viewer-text.jsx"
import FileViewerNifti from "./viewers/file-viewer-nifti"
import FileViewerJson from "./viewers/file-viewer-json.jsx"
import FileViewerTsv from "./viewers/file-viewer-tsv.jsx"
import FileViewerCsv from "./viewers/file-viewer-csv.jsx"
import FileViewerHtml from "./viewers/file-viewer-html.jsx"
import { FileViewerNeurosift } from "./viewers/file-viewer-neurosift"
import { isNifti } from "./file-types"
import FileViewerMarkdown from "./viewers/file-viewer-markdown"

/**
 * Choose the right viewer for each file type
 */
const FileViewerType = ({ path, url, data }) => {
  if (
    path.endsWith("README") ||
    path.endsWith("CHANGES") ||
    path.endsWith(".bidsignore") ||
    path.endsWith(".gitignore") ||
    path.endsWith(".txt") ||
    path.endsWith(".rst") ||
    path.endsWith(".yml") || path.endsWith(".yaml")
  ) {
    return <FileViewerText data={data} />
  } else if (
    isNifti(path)
  ) {
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
}

FileViewerType.propTypes = {
  path: PropTypes.string,
  url: PropTypes.string,
  data: PropTypes.instanceOf(ArrayBuffer),
}

export default FileViewerType
